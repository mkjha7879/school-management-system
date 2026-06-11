package com.school.management.model;

public class DashboardStats {

    private long studentCount;
    private long teacherCount;
    private long classCount;

    public DashboardStats() {
    }

    public DashboardStats(long studentCount, long teacherCount, long classCount) {
        this.studentCount = studentCount;
        this.teacherCount = teacherCount;
        this.classCount = classCount;
    }

    public long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(long studentCount) {
        this.studentCount = studentCount;
    }

    public long getTeacherCount() {
        return teacherCount;
    }

    public void setTeacherCount(long teacherCount) {
        this.teacherCount = teacherCount;
    }

    public long getClassCount() {
        return classCount;
    }

    public void setClassCount(long classCount) {
        this.classCount = classCount;
    }
}
