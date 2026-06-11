package com.school.management.controller;

import com.school.management.model.Role;
import com.school.management.model.UserProfile;
import com.school.management.service.UserService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.Valid;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@Profile("firebase")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserProfile> getAll() {
        return userService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserProfile create(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(
                request.email(),
                request.password(),
                request.displayName(),
                request.role(),
                request.linkedId()
        );
    }

    @PutMapping("/{uid}/role")
    public UserProfile updateRole(@PathVariable String uid, @RequestBody UpdateRoleRequest request) {
        return userService.updateRole(uid, request.role());
    }

    @DeleteMapping("/{uid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String uid) {
        userService.deleteUser(uid);
    }

    public record CreateUserRequest(
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6) String password,
            @NotBlank String displayName,
            @NotNull Role role,
            String linkedId
    ) {
    }

    public record UpdateRoleRequest(@NotNull Role role) {
    }
}
