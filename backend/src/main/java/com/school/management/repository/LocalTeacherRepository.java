package com.school.management.repository;

import com.school.management.model.Teacher;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Profile("local")
public class LocalTeacherRepository implements TeacherStore {

    private final InMemoryStore<Teacher> store;

    public LocalTeacherRepository(InMemoryStore<Teacher> store) {
        this.store = store;
    }

    public List<Teacher> findAll() {
        return store.findAll();
    }

    public Teacher findById(String id) {
        return store.findById(id);
    }

    public Teacher save(Teacher teacher, String existingId) {
        return store.save(teacher, existingId);
    }

    public void deleteById(String id) {
        store.deleteById(id);
    }

    public long count() {
        return store.count();
    }
}
