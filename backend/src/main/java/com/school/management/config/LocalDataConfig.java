package com.school.management.config;

import com.school.management.model.SchoolClass;
import com.school.management.model.Student;
import com.school.management.model.Teacher;
import com.school.management.repository.InMemoryStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("local")
public class LocalDataConfig {

    @Bean
    public InMemoryStore<Student> studentStore() {
        InMemoryStore<Student> store = new InMemoryStore<>(Student::setId, Student::getId);
        seedStudents(store);
        return store;
    }

    @Bean
    public InMemoryStore<Teacher> teacherStore() {
        InMemoryStore<Teacher> store = new InMemoryStore<>(Teacher::setId, Teacher::getId);
        seedTeachers(store);
        return store;
    }

    @Bean
    public InMemoryStore<SchoolClass> classStore() {
        return new InMemoryStore<>(SchoolClass::setId, SchoolClass::getId);
    }

    private void seedStudents(InMemoryStore<Student> store) {
        Student student = new Student();
        student.setFirstName("Aarav");
        student.setLastName("Sharma");
        student.setEmail("aarav@school.com");
        student.setGrade("10");
        student.setPhone("9876543210");
        store.save(student, null);
    }

    private void seedTeachers(InMemoryStore<Teacher> store) {
        Teacher teacher = new Teacher();
        teacher.setFirstName("Priya");
        teacher.setLastName("Patel");
        teacher.setEmail("priya@school.com");
        teacher.setSubject("Mathematics");
        teacher.setDepartment("Science");
        store.save(teacher, null);
    }
}
