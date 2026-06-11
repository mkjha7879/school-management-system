package com.school.management.repository;

import com.school.management.model.Student;

import java.util.List;

public interface StudentStore {
    List<Student> findAll();
    Student findById(String id);
    Student save(Student student, String existingId);
    void deleteById(String id);
    long count();
}
