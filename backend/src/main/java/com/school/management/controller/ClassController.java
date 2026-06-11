package com.school.management.controller;

import com.school.management.model.SchoolClass;
import com.school.management.service.ClassService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    @GetMapping
    public List<SchoolClass> getAll() {
        return classService.findAll();
    }

    @GetMapping("/{id}")
    public SchoolClass getById(@PathVariable String id) {
        return classService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SchoolClass create(@Valid @RequestBody SchoolClass schoolClass) {
        return classService.create(schoolClass);
    }

    @PutMapping("/{id}")
    public SchoolClass update(@PathVariable String id, @Valid @RequestBody SchoolClass schoolClass) {
        return classService.update(id, schoolClass);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        classService.delete(id);
    }
}
