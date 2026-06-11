package com.school.management.repository;

import com.school.management.model.SchoolClass;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Profile("local")
public class LocalClassRepository implements ClassStore {

    private final InMemoryStore<SchoolClass> store;

    public LocalClassRepository(InMemoryStore<SchoolClass> store) {
        this.store = store;
    }

    public List<SchoolClass> findAll() {
        return store.findAll();
    }

    public SchoolClass findById(String id) {
        return store.findById(id);
    }

    public SchoolClass save(SchoolClass schoolClass, String existingId) {
        return store.save(schoolClass, existingId);
    }

    public void deleteById(String id) {
        store.deleteById(id);
    }

    public long count() {
        return store.count();
    }
}
