package com.school.management.repository;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.school.management.model.UserProfile;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

@Repository
@Profile("firebase")
public class UserRepository {

    private static final long TIMEOUT_SECONDS = 30;
    private static final String PATH = "users";

    private final FirebaseDatabase database;

    public UserRepository(FirebaseDatabase database) {
        this.database = database;
    }

    public List<UserProfile> findAll() {
        CompletableFuture<List<UserProfile>> future = new CompletableFuture<>();
        database.getReference(PATH).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                List<UserProfile> results = new ArrayList<>();
                for (DataSnapshot child : snapshot.getChildren()) {
                    UserProfile profile = child.getValue(UserProfile.class);
                    if (profile != null) {
                        profile.setUid(child.getKey());
                        results.add(profile);
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

    public UserProfile findByUid(String uid) {
        CompletableFuture<UserProfile> future = new CompletableFuture<>();
        database.getReference(PATH).child(uid).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot snapshot) {
                UserProfile profile = snapshot.getValue(UserProfile.class);
                if (profile != null) {
                    profile.setUid(snapshot.getKey());
                }
                future.complete(profile);
            }

            @Override
            public void onCancelled(DatabaseError error) {
                future.completeExceptionally(error.toException());
            }
        });
        return await(future);
    }

    public UserProfile save(UserProfile profile) {
        CompletableFuture<UserProfile> future = new CompletableFuture<>();
        database.getReference(PATH).child(profile.getUid()).setValue(profile, (error, ref) -> {
            if (error != null) {
                future.completeExceptionally(error.toException());
            } else {
                future.complete(profile);
            }
        });
        return await(future);
    }

    public void deleteByUid(String uid) {
        CompletableFuture<Void> future = new CompletableFuture<>();
        database.getReference(PATH).child(uid).removeValue((error, ref) -> {
            if (error != null) {
                future.completeExceptionally(error.toException());
            } else {
                future.complete(null);
            }
        });
        await(future);
    }

    private <R> R await(CompletableFuture<R> future) {
        try {
            return future.get(TIMEOUT_SECONDS, TimeUnit.SECONDS);
        } catch (Exception e) {
            if (e.getCause() instanceof RuntimeException runtime) {
                throw runtime;
            }
            throw new RuntimeException("Firebase user operation failed", e);
        }
    }
}
