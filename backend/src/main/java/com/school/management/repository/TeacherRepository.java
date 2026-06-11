package com.school.management.repository;

import com.google.firebase.database.FirebaseDatabase;
import com.school.management.model.Teacher;
import org.springframework.stereotype.Repository;

@Repository
@org.springframework.context.annotation.Profile("firebase")
public class TeacherRepository extends RealtimeDatabaseRepository<Teacher> implements TeacherStore {

    public TeacherRepository(FirebaseDatabase database) {
        super(database, "teachers", Teacher.class, Teacher::setId);
    }
}
