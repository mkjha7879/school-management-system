package com.school.management.repository;

import com.school.management.model.Teacher;

import java.util.List;

public interface TeacherStore {
    List<Teacher> findAll();
    Teacher findById(String id);
    Teacher save(Teacher teacher, String existingId);
    void deleteById(String id);
    long count();
}
