package com.school.management.service;

import com.school.management.model.Teacher;
import com.school.management.repository.TeacherStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherService {

    private final TeacherStore teacherRepository;
    private final RealtimeBroadcaster broadcaster;

    public TeacherService(TeacherStore teacherRepository, RealtimeBroadcaster broadcaster) {
        this.teacherRepository = teacherRepository;
        this.broadcaster = broadcaster;
    }

    public List<Teacher> findAll() {
        return teacherRepository.findAll();
    }

    public Teacher findById(String id) {
        return teacherRepository.findById(id);
    }

    public Teacher create(Teacher teacher) {
        Teacher saved = teacherRepository.save(teacher, null);
        broadcaster.entityChanged("teachers", "created");
        return saved;
    }

    public Teacher update(String id, Teacher teacher) {
        teacherRepository.findById(id);
        Teacher saved = teacherRepository.save(teacher, id);
        broadcaster.entityChanged("teachers", "updated");
        return saved;
    }

    public void delete(String id) {
        teacherRepository.deleteById(id);
        broadcaster.entityChanged("teachers", "deleted");
    }
}
