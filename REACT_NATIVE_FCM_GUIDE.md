# React Native FCM Integration - Complete Guide

This guide shows how to integrate Firebase Cloud Messaging (FCM) with your React Native HRM app to receive push notifications when tasks are assigned.

## 1. Installation

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

## 2. Firebase Setup

1. Create project at https://console.firebase.google.com
2. Add Android/iOS apps
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Follow platform-specific setup in Firebase docs

## 3. Notification Service

Create `src/services/notificationService.ts`:

```typescript
import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, Alert } from 'react-native';

// Request notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // Auto-granted on Android < 13
  }
  
  // iOS
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

// Get FCM token
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Setup notification handlers
export const setupNotificationHandlers = (
  onForegroundNotification: (message: any) => void,
  onBackgroundNotification: (message: any) => void,
  onNotificationOpenedApp: (message: any) => void
) => {
  // Foreground notification handler
  const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground notification:', remoteMessage);
    
    // Show in-app alert
    Alert.alert(
      remoteMessage.notification?.title || 'New Notification',
      remoteMessage.notification?.body || '',
      [
        {
          text: 'View',
          onPress: () => onForegroundNotification(remoteMessage.data),
        },
        { text: 'Dismiss', style: 'cancel' },
      ]
    );
  });

  // Background notification opened handler
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification opened app from background:', remoteMessage);
    onBackgroundNotification(remoteMessage.data);
  });

  // Quit state notification opened handler
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notification opened app from quit state:', remoteMessage);
        onNotificationOpenedApp(remoteMessage.data);
      }
    });

  return unsubscribeForeground;
};
```

## 4. API Service

Create `src/services/api.ts`:

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://your-api-url.com/api/v1',
  timeout: 10000,
});

// Add auth token interceptor
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Update FCM token function
export const updateFcmToken = async (userId: string, fcmToken: string) => {
  try {
    const response = await api.patch(`/users/fcm-token/${userId}`, {
      fcmToken,
    });
    console.log('FCM token updated successfully');
    return response.data;
  } catch (error) {
    console.error('Failed to update FCM token:', error);
    throw error;
  }
};

export default api;
```

## 5. App Component Integration

Update `App.tsx`:

```typescript
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {
  requestNotificationPermission,
  getFCMToken,
  setupNotificationHandlers,
} from './services/notificationService';
import { updateFcmToken } from './services/api';

function App() {
  const navigation = useNavigation();

  useEffect(() => {
    // Request permission and setup FCM
    const initializeNotifications = async () => {
      const hasPermission = await requestNotificationPermission();
      
      if (hasPermission) {
        const fcmToken = await getFCMToken();
        
        if (fcmToken && user?.id) {
          // Update FCM token on backend
          await updateFcmToken(user.id, fcmToken);
        }
      }

      // Setup notification handlers
      const unsubscribe = setupNotificationHandlers(
        // Foreground notification
        (data) => {
          if (data?.taskId) {
            navigation.navigate('TaskDetail', { taskId: data.taskId });
          }
        },
        // Background notification opened
        (data) => {
          if (data?.taskId) {
            navigation.navigate('TaskDetail', { taskId: data.taskId });
          }
        },
        // Quit state notification opened
        (data) => {
          if (data?.taskId) {
            navigation.navigate('TaskDetail', { taskId: data.taskId });
          }
        }
      );

      return unsubscribe;
    };

    const unsubscribe = initializeNotifications();

    // Listen for token refresh
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
      console.log('FCM Token refreshed:', token);
      if (user?.id) {
        await updateFcmToken(user.id, token);
      }
    });

    return () => {
      unsubscribe?.then((unsub) => unsub());
      unsubscribeTokenRefresh();
    };
  }, [user]);

  return (
    // Your app components
  );
}
```

## 6. Login Integration

Update your login flow to register the FCM token:

```typescript
// In your login function
const handleLogin = async (email: string, password: string) => {
  try {
    // Login API call
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data;
    
    // Save auth token
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    // Get and register FCM token
    const fcmToken = await getFCMToken();
    if (fcmToken) {
      await updateFcmToken(user.id, fcmToken);
    }
    
    // Navigate to home
    navigation.navigate('Home');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

## 7. Background Message Handler (iOS Required)

Add to `index.js`:

```javascript
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});
```

## 8. Android Manifest Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.INTERNET" />
```

## 9. iOS Capabilities

In Xcode:
1. Open `ios/YourApp.xcworkspace`
2. Select target → Signing & Capabilities
3. Add "Push Notifications" capability
4. Add "Background Modes" → Enable "Remote notifications"

## Complete Flow

```
1. User opens app
   ↓
2. Request notification permission
   ↓
3. Get FCM token from Firebase
   ↓
4. User logs in
   ↓
5. Send FCM token to backend (PATCH /users/fcm-token/:id)
   ↓
6. Token stored in MongoDB user document
   ↓
7. Manager creates task assigned to user
   ↓
8. NestJS publishes task.created event to Kafka (includes FCM token)
   ↓
9. Golang service consumes event
   ↓
10. Golang sends FCM push notification
   ↓
11. User receives notification on device
   ↓
12. User taps notification → Navigate to task details
```

## Testing

1. Login to the app
2. Check console for FCM token
3. Create a task assigned to this user via backend
4. Verify push notification is received
5. Tap notification and verify navigation to task details

## Troubleshooting

- **No token received**: Check Firebase project setup and google-services.json/GoogleService-Info.plist
- **Permission denied**: Ensure permissions are requested before getting token
- **Notifications not showing**: Check app is properly configured in Firebase Console
- **iOS notifications not working**: Verify APNs certificates are uploaded to Firebase
