package com.school.management.repository;

import com.school.management.model.Student;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Profile("local")
public class LocalStudentRepository implements StudentStore {

    private final InMemoryStore<Student> store;

    public LocalStudentRepository(InMemoryStore<Student> store) {
        this.store = store;
    }

    public List<Student> findAll() {
        return store.findAll();
    }

    public Student findById(String id) {
        return store.findById(id);
    }

    public Student save(Student student, String existingId) {
        return store.save(student, existingId);
    }

    public void deleteById(String id) {
        store.deleteById(id);
    }

    public long count() {
        return store.count();
    }
}
