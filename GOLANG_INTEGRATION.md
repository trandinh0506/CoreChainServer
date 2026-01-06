# Golang Notification Service - Integration Guide

## Task.Created Event Consumer

Your Golang notification service should implement a Kafka consumer that listens to the `task.created` topic and processes incoming events.

### Expected Message Format

The NestJS service publishes messages in this format:

```json
{
  "event_type": "task.created",
  "timestamp": "2026-01-01T09:12:00Z",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete project proposal",
    "description": "Need to finalize the Q1 proposal",
    "attachments": [],
    "createdBy": {
      "_id": "507f191e810c19729de860ea",
      "email": "manager@example.com"
    },
    "assignedTo": "507f191e810c19729de860eb",
    "projectId": "507f191e810c19729de860ec",
    "priority": 1,
    "status": 1,
    "startDate": "2026-01-02T00:00:00Z",
    "dueDate": "2026-01-10T00:00:00Z",
    "isDeleted": false,
    "createdAt": "2026-01-01T09:12:00Z",
    "updatedAt": "2026-01-01T09:12:00Z"
  },
  "metadata": {
    "assignedToUser": {
      "_id": "507f191e810c19729de860eb",
      "fcmToken": "device-fcm-token-here",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Golang Consumer Handler (Pseudo-code)

```go
func HandleTaskCreatedEvent(message []byte) error {
    var event TaskCreatedEvent
    err := json.Unmarshal(message, &event)
    if err != nil {
        return fmt.Errorf("failed to unmarshal event: %w", err)
    }

    // Extract notification details
    notification := &Notification{
        ID:               uuid.New().String(),
        NotificationType: TASK_ASSIGNED,
        UserID:           event.Metadata.AssignedToUser.ID,
        FCMToken:         event.Metadata.AssignedToUser.FCMToken,
        Title:            "New Task Assigned",
        Body:             fmt.Sprintf("You have been assigned: %s", event.Data.Title),
        Data: map[string]interface{}{
            "taskId":     event.Data.ID,
            "taskTitle":  event.Data.Title,
            "priority":   event.Data.Priority,
            "dueDate":    event.Data.DueDate,
            "projectId":  event.Data.ProjectID,
        },
        Status:      PENDING,
        CreatedAt:   time.Now(),
        TaskID:      event.Data.ID,
        ProjectID:   event.Data.ProjectID,
        Priority:    event.Data.Priority,
    }

    // Save to database
    err = notificationRepo.Create(notification)
    if err != nil {
        return fmt.Errorf("failed to save notification: %w", err)
    }

    // Send FCM notification
    if event.Metadata.AssignedToUser.FCMToken != "" {
        err = fcmService.SendNotification(notification)
        if err != nil {
            // Update notification status to failed
            notification.Status = FAILED
            notification.ErrorMessage = err.Error()
            notificationRepo.Update(notification)
            return fmt.Errorf("failed to send FCM: %w", err)
        }

        // Update notification status to sent
        notification.Status = SENT
        notification.SentAt = timePtr(time.Now())
        notificationRepo.Update(notification)
    } else {
        log.Warn("No FCM token for user", event.Metadata.AssignedToUser.ID)
    }

    return nil
}
```

### Notification Types

You should define a constant for task-related notifications:

```go
const (
    TASK_ASSIGNED   NotificationType = "task.assigned"
    TASK_UPDATED    NotificationType = "task.updated"
    TASK_COMPLETED  NotificationType = "task.completed"
    // ... other types
)
```

### Error Handling

- **No FCM Token**: Log warning, save notification to DB, skip FCM
- **Invalid Message**: Log error, store in dead letter queue
- **FCM Failure**: Update notification status, implement retry logic
- **Database Failure**: Log critical error, may need manual intervention

### Testing

1. **Start Golang service** with Kafka consumer
2. **Create task in NestJS** via REST API
3. **Monitor Kafka consumer logs** for event consumption
4. **Check notification database** for new record
5. **Verify FCM delivery** to test device

### Configuration

Ensure your Golang service Kafka consumer is configured to:
- **Topic**: `task.created`
- **Consumer Group**: `golang-notification-consumer`
- **Broker**: Same as NestJS (e.g., `localhost:9092`)
