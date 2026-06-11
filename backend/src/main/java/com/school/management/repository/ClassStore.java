package com.school.management.repository;

import com.school.management.model.SchoolClass;

import java.util.List;

public interface ClassStore {
    List<SchoolClass> findAll();
    SchoolClass findById(String id);
    SchoolClass save(SchoolClass schoolClass, String existingId);
    void deleteById(String id);
    long count();
}
