package com.school.management.config;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.school.management.model.Role;
import com.school.management.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.Map;

@Configuration
@Profile("firebase")
public class AdminBootstrap {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    @Value("${admin.email:admin@school.com}")
    private String adminEmail;

    @Value("${admin.password:admin123}")
    private String adminPassword;

    @Bean
    CommandLineRunner bootstrapAdmin(FirebaseAuth firebaseAuth, UserService userService) {
        return args -> {
            try {
                UserRecord existing = firebaseAuth.getUserByEmail(adminEmail);
                firebaseAuth.setCustomUserClaims(existing.getUid(), Map.of("role", Role.ADMIN.name()));
                userService.ensureProfile(existing.getUid(), adminEmail, Role.ADMIN);
                log.info("Admin user already exists: {}", adminEmail);
            } catch (FirebaseAuthException e) {
                try {
                    log.info("Creating bootstrap admin user: {}", adminEmail);
                    userService.createUser(adminEmail, adminPassword, "Administrator", Role.ADMIN, null);
                    log.info("Bootstrap admin created: {} (change the password after first login)", adminEmail);
                } catch (Exception createError) {
                    log.warn("====================================================================");
                    log.warn("Could not create admin user. Enable Email/Password sign-in:");
                    log.warn("  https://console.firebase.google.com/project/"
                            + "school-management-system-79732/authentication/providers");
                    log.warn("Then restart the backend. Reason: {}", rootMessage(createError));
                    log.warn("Backend will continue running so the rest of the API works.");
                    log.warn("====================================================================");
                }
            }
        };
    }

    private String rootMessage(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null) {
            cur = cur.getCause();
        }
        return cur.getMessage();
    }
}
