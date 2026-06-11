package com.school.management.config;

import com.school.management.model.Student;
import com.school.management.model.Teacher;
import com.school.management.repository.ClassStore;
import com.school.management.repository.StudentStore;
import com.school.management.repository.TeacherStore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("firebase")
public class FirebaseDataSeeder {

    private static final Logger log = LoggerFactory.getLogger(FirebaseDataSeeder.class);

    @Bean
    CommandLineRunner seedFirebaseData(
            StudentStore studentStore,
            TeacherStore teacherStore,
            ClassStore classStore
    ) {
        return args -> {
            if (studentStore.count() > 0 || teacherStore.count() > 0) {
                log.info("Firebase database already has data — skipping seed");
                return;
            }

            log.info("Seeding Firebase Realtime Database with sample data...");

            Teacher teacher = new Teacher();
            teacher.setFirstName("Priya");
            teacher.setLastName("Patel");
            teacher.setEmail("priya@school.com");
            teacher.setSubject("Mathematics");
            teacher.setDepartment("Science");
            teacher = teacherStore.save(teacher, null);

            Student student = new Student();
            student.setFirstName("Aarav");
            student.setLastName("Sharma");
            student.setEmail("aarav@school.com");
            student.setGrade("10");
            student.setPhone("9876543210");
            studentStore.save(student, null);

            log.info("Firebase seed complete (1 teacher, 1 student). Classes: {}", classStore.count());
        };
    }
}
