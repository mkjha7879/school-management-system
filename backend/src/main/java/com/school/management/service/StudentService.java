package com.school.management.service;

import com.school.management.model.Student;
import com.school.management.repository.StudentStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentStore studentRepository;
    private final RealtimeBroadcaster broadcaster;

    public StudentService(StudentStore studentRepository, RealtimeBroadcaster broadcaster) {
        this.studentRepository = studentRepository;
        this.broadcaster = broadcaster;
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Student findById(String id) {
        return studentRepository.findById(id);
    }

    public Student create(Student student) {
        Student saved = studentRepository.save(student, null);
        broadcaster.entityChanged("students", "created");
        return saved;
    }

    public Student update(String id, Student student) {
        studentRepository.findById(id);
        Student saved = studentRepository.save(student, id);
        broadcaster.entityChanged("students", "updated");
        return saved;
    }

    public void delete(String id) {
        studentRepository.deleteById(id);
        broadcaster.entityChanged("students", "deleted");
    }
}
