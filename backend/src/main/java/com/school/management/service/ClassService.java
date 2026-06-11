package com.school.management.service;

import com.school.management.model.SchoolClass;
import com.school.management.model.Teacher;
import com.school.management.repository.ClassStore;
import com.school.management.repository.TeacherStore;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassService {

    private final ClassStore classRepository;
    private final TeacherStore teacherRepository;
    private final RealtimeBroadcaster broadcaster;

    public ClassService(ClassStore classRepository, TeacherStore teacherRepository, RealtimeBroadcaster broadcaster) {
        this.classRepository = classRepository;
        this.teacherRepository = teacherRepository;
        this.broadcaster = broadcaster;
    }

    public List<SchoolClass> findAll() {
        return classRepository.findAll();
    }

    public SchoolClass findById(String id) {
        return classRepository.findById(id);
    }

    public SchoolClass create(SchoolClass schoolClass) {
        enrichTeacherName(schoolClass);
        SchoolClass saved = classRepository.save(schoolClass, null);
        broadcaster.entityChanged("classes", "created");
        return saved;
    }

    public SchoolClass update(String id, SchoolClass schoolClass) {
        classRepository.findById(id);
        enrichTeacherName(schoolClass);
        SchoolClass saved = classRepository.save(schoolClass, id);
        broadcaster.entityChanged("classes", "updated");
        return saved;
    }

    public void delete(String id) {
        classRepository.deleteById(id);
        broadcaster.entityChanged("classes", "deleted");
    }

    private void enrichTeacherName(SchoolClass schoolClass) {
        if (schoolClass.getTeacherId() != null && !schoolClass.getTeacherId().isBlank()) {
            Teacher teacher = teacherRepository.findById(schoolClass.getTeacherId());
            schoolClass.setTeacherName(teacher.getFirstName() + " " + teacher.getLastName());
        }
    }
}
