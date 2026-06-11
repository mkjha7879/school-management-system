package com.school.management.repository;

import com.school.management.exception.ResourceNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BiConsumer;
import java.util.function.Function;

public class InMemoryStore<T> {

    private final Map<String, T> data = new ConcurrentHashMap<>();
    private final BiConsumer<T, String> idSetter;
    private final Function<T, String> idGetter;

    public InMemoryStore(BiConsumer<T, String> idSetter, Function<T, String> idGetter) {
        this.idSetter = idSetter;
        this.idGetter = idGetter;
    }

    public List<T> findAll() {
        return new ArrayList<>(data.values());
    }

    public T findById(String id) {
        T entity = data.get(id);
        if (entity == null) {
            throw new ResourceNotFoundException("Record not found: " + id);
        }
        return entity;
    }

    public T save(T entity, String existingId) {
        boolean isNew = existingId == null || existingId.isBlank();
        String id = isNew ? UUID.randomUUID().toString() : existingId;
        if (!isNew && !data.containsKey(existingId)) {
            throw new ResourceNotFoundException("Record not found: " + existingId);
        }
        idSetter.accept(entity, id);
        data.put(id, entity);
        return entity;
    }

    public void deleteById(String id) {
        findById(id);
        data.remove(id);
    }

    public long count() {
        return data.size();
    }
}
