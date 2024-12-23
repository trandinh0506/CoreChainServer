# CoreChain API

CoreChain API provides seamless integration for managing user data and interactions within your application. It's lightweight, fast, and designed to scale with your needs.

Key Features:

-   Authentication and Authorization
-   User Data Management
-   Real-time Notifications
-

## Usages:

<!-- authen -->

### Login

**URL:**`auth/login`

**Method** POST

**Header:** `Content-type: application/json`

**Request Body:** `req.body.data`
**Request Body:**  
The `req.body.data` object must include the following fields:

| Field      | Type   | Required | Description          |
| ---------- | ------ | -------- | -------------------- |
| `username` | string | Yes      | The user's username. |
| `password` | string | Yes      | The user's password. |

**Example Request Body:**

```json
{
    "data": {
        "username": "exampleUser",
        "password": "examplePassword"
    }
}
```

**Response Codes:**
| Code | Description |
|------|-------------|
| `200`| `Success` |
| `404`| `Not Found` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": "Login successful",
    "token": "Example token"
}
```

-   404 (Not Found)

```json
{
    "message": "User not found"
}
```

-   500 (Internal Server Error)

```json
{
    "message": "Internal Server Error"
}
```

### Register

**URL:**`/auth/register`

**Method** POST

**Header:** `Content-type: application/json`

**Request Body:** `req.body.data`
**Request Body:**  
The `req.body.data` object must include the following fields:

| Field      | Type   | Required | Description          |
| ---------- | ------ | -------- | -------------------- |
| `username` | string | Yes      | The user's username. |
| `password` | string | Yes      | The user's password. |
| `email`    | string | Yes      | The user's email.    |
| `role`     | string | Yes      | The user's role.     |

**Example Request Body:**

```json
{
    "data": {
        "username": "exampleUser",
        "password": "examplePassword",
        "email": "exampleEmail",
        "role": "exampleRole"
    }
}
```

**Response Codes:**
| Code | Description |
|------|-------------|
| `200`| `Success` |
| `409`| `conflict` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": "Register successful",
    "token": "Example token"
}
```

-   409 (conflict)

```json
{
    "message": "Username had already existed"
}
```

-   500 (Internal Server Error)

```json
{
    "message": "Internal Server Error"
}
```

### Logout

**URL:**`auth/logout`

**Method** POST

**Header:**

| Headers       | Value          | Required | Description                      |
| ------------- | -------------- | -------- | -------------------------------- |
| Authorization | Bearer <token> | Yes      | Bearer token for authentication. |

**Response Codes:**
| Code | Description |
|------|-------------|
| `200`| `Success` |
| `401`| `Unauthorized` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": "Logout successful"
}
```

-   401 (Unauthorized)

```json
{
    "message": "Missing authorization token"
}
```

-   500 (Internal Server Error)

```json
{
    "message": "Internal Server Error"
}
```

### Request Reset Password

**URL:**`auth/resetPassword`

**Method** POST

**Header:**

| Headers       | Value          | Required | Description                      |
| ------------- | -------------- | -------- | -------------------------------- |
| Authorization | Bearer <token> | Yes      | Bearer token for authentication. |

**Response Codes:**
| Code | Description |
|------|-------------|
| `200`| `Success` |
| `401`| `Unauthorized` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": "Request reset password successful"
}
```

-   401 (Unauthorized)

```json
{
    "message": "Missing authorization token"
}
```

-   500 (Internal Server Error)

```json
{
    "message": "Internal Server Error"
}
```

### Change Password

**URL:**`/auth/changePassword`

**Method** POST

**Headers**

| Headers       | Value            | Required | Description                      |
| ------------- | ---------------- | -------- | -------------------------------- |
| Content-type  | application/json | Yes      |                                  |
| Authorization | Bearer <token>   | Yes      | Bearer token for authentication. |

**Request Body:** `req.body.data`
**Request Body:**  
The `req.body.data` object must include the following fields:

| Field         | Type   | Required | Description             |
| ------------- | ------ | -------- | ----------------------- |
| `password`    | string | Yes      | The user's password.    |
| `newPassword` | string | Yes      | The user's newPassword. |

**Example Request Body:**

```json
{
    "data": {
        "password": "examplePassword",
        "newPassword": "exampleNewPassword"
    }
}
```

**Response Codes:**
| Code | Description |
|------|-------------|
| `200`| `Success` |
| `409`| `conflict` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": "Password changed successfully",
    "token": "Example token"
}
```

-   409 (conflict)

```json
{
    "message": "Old password do not matched"
}
```

-   500 (Internal Server Error)

```json
{
    "message": "Internal Server Error"
}
```

<!-- common api -->

### Get all tasks

**URL:**`auth/getAllTasks`

**Method** GET

**Header:**

| Headers       | Value          | Required | Description                         |
| ------------- | -------------- | -------- | ----------------------------------- |
| Authorization | Bearer <token> | Yes      | Bearer token for authentication.    |
| projectId     | :projectId     | Yes      | The id of the project to get tasks. |

**Response Codes:**
| Code | Description |
|------|-------------|
| `200`| `Success` |
| `401`| `Unauthorized` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": [
        {
            "UserID": "exampleUserID",
            "task": "exampleTask",
            "deadline": "yyyy-mm-dd'T'HH:mm"
        }
    ]
}
```

-   401 (Unauthorized)

```json
{
    "message": "Missing authorization token"
}
```

-   500 (Internal Server Error)

```json
{
    "message": "Internal Server Error"
}
```

<!-- manager api -->

### Allocate Tasks

**URL:**`/auth/manager/allocateTasks`

**Method** POST

**Header:**

| Headers       | Value            | Required | Description                      |
| ------------- | ---------------- | -------- | -------------------------------- |
| Content-type  | application/json | Yes      |                                  |
| Authorization | Bearer <token>   | Yes      | Bearer token for authentication. |

**Request Body:** `req.body.data`
**Request Body:**  
The `req.body.data` object must include the following fields:

| Field       | Type      | Required | Description                |
| ----------- | --------- | -------- | -------------------------- |
| `userId`    | string    | Yes      | The user id assigned task. |
| `projectId` | string    | Yes      | The project id.            |
| `task`      | string    | Yes      | The task title.            |
| `deadline`  | date/time | Yes      | The deadline of the task.  |

**Example Request Body:**

```json
{
    "data": {
        "userId": "exampleUserId",
        "projectId": "exampleProjectId",
        "task": "exampleTask",
        "deadline": "yyyy-mm-dd'T'HH:mm"
    }
}
```

**Response Codes:**
| Code | Description |
| ---- | ----------- |
| `200`| `Success` |
| `401`| `Unauthorized` |
| `403`| `Forbidden` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": "Task allocated successfully"
}
```

-   401 (Unauthorized)

```json
{
    "message": "Missing authorization token"
}
```

-   403 (Forbidden)

```json
{
    "message": "Permission denied"
}
```

-   500 (Internal Server Error)

```json
{
    "message": "Internal Server Error"
}
```

### Send CV
