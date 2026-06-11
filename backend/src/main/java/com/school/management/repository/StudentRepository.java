package com.school.management.repository;

import com.google.firebase.database.FirebaseDatabase;
import com.school.management.model.Student;
import org.springframework.stereotype.Repository;

@Repository
@org.springframework.context.annotation.Profile("firebase")
public class StudentRepository extends RealtimeDatabaseRepository<Student> implements StudentStore {

    public StudentRepository(FirebaseDatabase database) {
        super(database, "students", Student.class, Student::setId);
    }
}
