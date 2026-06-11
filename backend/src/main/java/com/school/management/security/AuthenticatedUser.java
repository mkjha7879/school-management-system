package com.school.management.security;

import com.school.management.model.Role;

public record AuthenticatedUser(String uid, String email, Role role) {
}
