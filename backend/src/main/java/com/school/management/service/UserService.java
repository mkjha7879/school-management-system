package com.school.management.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.school.management.exception.ResourceNotFoundException;
import com.school.management.model.Role;
import com.school.management.model.UserProfile;
import com.school.management.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Profile("firebase")
public class UserService {

    private final FirebaseAuth firebaseAuth;
    private final UserRepository userRepository;

    public UserService(FirebaseAuth firebaseAuth, UserRepository userRepository) {
        this.firebaseAuth = firebaseAuth;
        this.userRepository = userRepository;
    }

    public List<UserProfile> findAll() {
        return userRepository.findAll();
    }

    public UserProfile findByUid(String uid) {
        UserProfile profile = userRepository.findByUid(uid);
        if (profile == null) {
            throw new ResourceNotFoundException("User not found: " + uid);
        }
        return profile;
    }

    public UserProfile createUser(String email, String password, String displayName, Role role, String linkedId) {
        try {
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(email)
                    .setPassword(password)
                    .setDisplayName(displayName)
                    .setEmailVerified(false);
            UserRecord record = firebaseAuth.createUser(request);

            firebaseAuth.setCustomUserClaims(record.getUid(), Map.of("role", role.name()));

            UserProfile profile = new UserProfile();
            profile.setUid(record.getUid());
            profile.setEmail(email);
            profile.setDisplayName(displayName);
            profile.setRole(role);
            profile.setLinkedId(linkedId);
            profile.setCreatedAt(System.currentTimeMillis());
            return userRepository.save(profile);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException("Failed to create user: " + e.getMessage(), e);
        }
    }

    public UserProfile updateRole(String uid, Role role) {
        try {
            firebaseAuth.setCustomUserClaims(uid, Map.of("role", role.name()));
            UserProfile profile = findByUid(uid);
            profile.setRole(role);
            return userRepository.save(profile);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException("Failed to update role: " + e.getMessage(), e);
        }
    }

    public void deleteUser(String uid) {
        try {
            firebaseAuth.deleteUser(uid);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException("Failed to delete auth user: " + e.getMessage(), e);
        }
        userRepository.deleteByUid(uid);
    }

    /** Ensures a profile row exists for a user that authenticated (self-heal). */
    public UserProfile ensureProfile(String uid, String email, Role role) {
        UserProfile existing = userRepository.findByUid(uid);
        if (existing != null) {
            return existing;
        }
        UserProfile profile = new UserProfile();
        profile.setUid(uid);
        profile.setEmail(email);
        profile.setDisplayName(email);
        profile.setRole(role);
        profile.setCreatedAt(System.currentTimeMillis());
        return userRepository.save(profile);
    }
}
