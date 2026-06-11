package com.school.management.repository;

import com.google.firebase.database.FirebaseDatabase;
import com.school.management.model.SchoolClass;
import org.springframework.stereotype.Repository;

@Repository
@org.springframework.context.annotation.Profile("firebase")
public class ClassRepository extends RealtimeDatabaseRepository<SchoolClass> implements ClassStore {

    public ClassRepository(FirebaseDatabase database) {
        super(database, "classes", SchoolClass.class, SchoolClass::setId);
    }
}
