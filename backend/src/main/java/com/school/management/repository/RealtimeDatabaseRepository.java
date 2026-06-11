package com.school.management.repository;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.school.management.exception.ResourceNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.function.BiConsumer;

public abstract class RealtimeDatabaseRepository<T> {

    private static final long TIMEOUT_SECONDS = 30;

    private final FirebaseDatabase database;
    private final String path;
    private final Class<T> type;
    private final BiConsumer<T, String> idSetter;

    protected RealtimeDatabaseRepository(
            FirebaseDatabase database,
            String path,
            Class<T> type,
            BiConsumer<T, String> idSetter
    ) {
        this.database = database;
        this.path = path;
        this.type = type;
        this.idSetter = idSetter;
    }

    public List<T> findAll() {
        CompletableFuture<List<T>> future = new CompletableFuture<>();
        reference().addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                List<T> results = new ArrayList<>();
                if (snapshot.exists()) {
                    for (DataSnapshot child : snapshot.getChildren()) {
                        T entity = child.getValue(type);
                        if (entity != null) {
                            idSetter.accept(entity, child.getKey());
                            results.add(entity);
                        }
                    }
                }
                future.complete(results);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(error.toException());
            }
        });
        return await(future);
    }

    public T findById(String id) {
        CompletableFuture<T> future = new CompletableFuture<>();
        reference().child(id).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                if (!snapshot.exists()) {
                    future.completeExceptionally(
                            new ResourceNotFoundException(path + " not found: " + id)
                    );
                    return;
                }
                T entity = snapshot.getValue(type);
                idSetter.accept(entity, snapshot.getKey());
                future.complete(entity);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(error.toException());
            }
        });
        return await(future);
    }

    public T save(T entity, String existingId) {
        boolean isNew = existingId == null || existingId.isBlank();
        String id = isNew ? UUID.randomUUID().toString() : existingId;

        if (!isNew) {
            findById(existingId);
        }

        idSetter.accept(entity, id);
        CompletableFuture<T> future = new CompletableFuture<>();
        reference().child(id).setValue(entity, (error, ref) -> {
            if (error != null) {
                future.completeExceptionally(error.toException());
            } else {
                future.complete(entity);
            }
        });
        return await(future);
    }

    public void deleteById(String id) {
        findById(id);
        CompletableFuture<Void> future = new CompletableFuture<>();
        reference().child(id).removeValue((error, ref) -> {
            if (error != null) {
                future.completeExceptionally(error.toException());
            } else {
                future.complete(null);
            }
        });
        await(future);
    }

    public long count() {
        return findAll().size();
    }

    private DatabaseReference reference() {
        return database.getReference(path);
    }

    private <R> R await(CompletableFuture<R> future) {
        try {
            return future.get(TIMEOUT_SECONDS, TimeUnit.SECONDS);
        } catch (Exception e) {
            if (e.getCause() instanceof RuntimeException runtime) {
                throw runtime;
            }
            throw new RuntimeException("Firebase operation failed for " + path, e);
        }
    }
}
