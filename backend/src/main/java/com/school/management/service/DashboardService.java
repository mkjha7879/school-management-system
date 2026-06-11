package com.school.management.service;

import com.school.management.model.DashboardStats;
import com.school.management.repository.ClassStore;
import com.school.management.repository.StudentStore;
import com.school.management.repository.TeacherStore;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final StudentStore studentRepository;
    private final TeacherStore teacherRepository;
    private final ClassStore classRepository;

    public DashboardService(
            StudentStore studentRepository,
            TeacherStore teacherRepository,
            ClassStore classRepository
    ) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.classRepository = classRepository;
    }

    public DashboardStats getStats() {
        return new DashboardStats(
                studentRepository.count(),
                teacherRepository.count(),
                classRepository.count()
        );
    }
}
