package com.school.management.service;

import com.school.management.model.DashboardStats;
import com.school.management.repository.ClassStore;
import com.school.management.repository.StudentStore;
import com.school.management.repository.TeacherStore;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Pushes live updates to subscribed clients over STOMP/WebSocket.
 */
@Service
public class RealtimeBroadcaster {

    private final SimpMessagingTemplate messagingTemplate;
    private final StudentStore studentStore;
    private final TeacherStore teacherStore;
    private final ClassStore classStore;

    public RealtimeBroadcaster(
            SimpMessagingTemplate messagingTemplate,
            StudentStore studentStore,
            TeacherStore teacherStore,
            ClassStore classStore
    ) {
        this.messagingTemplate = messagingTemplate;
        this.studentStore = studentStore;
        this.teacherStore = teacherStore;
        this.classStore = classStore;
    }

    /** Notify that a collection changed, and refresh dashboard counts. */
    public void entityChanged(String collection, String action) {
        messagingTemplate.convertAndSend(
                "/topic/" + collection,
                Map.of("collection", collection, "action", action, "at", System.currentTimeMillis())
        );
        broadcastDashboard();
    }

    public void broadcastDashboard() {
        DashboardStats stats = new DashboardStats(
                studentStore.count(),
                teacherStore.count(),
                classStore.count()
        );
        messagingTemplate.convertAndSend("/topic/dashboard", stats);
    }

    public void announce(Object announcement) {
        messagingTemplate.convertAndSend("/topic/announcements", announcement);
    }
}
