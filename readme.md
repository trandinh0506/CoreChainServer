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

The `req.body.data` object must include the following fields:

| Field      | Type   | Required | Description          |
| ---------- | ------ | -------- | -------------------- |
| `email`    | string | Yes      | The user's email.    |
| `password` | string | Yes      | The user's password. |

**Example Request Body:**

```json
{
    "data": {
        "username": "exampleUserEmail",
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
    "role": "role"
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

The `req.body.data` object must include the following fields:

| Field      | Type   | Required | Description              |
| ---------- | ------ | -------- | ------------------------ |
| `email`    | string | Yes      | The user's email.        |
| `phone`    | string | Yes      | The user's phone number. |
| `password` | string | Yes      | The user's password.     |
| `role`     | string | Yes      | The user's role.         |

**Example Request Body:**

```json
{
    "data": {
        "email": "exampleEmail",
        "password": "examplePassword",
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
    "message": "Register successful"
}
```

-   409 (conflict)

```json
{
    "message": "Email had already existed"
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

**Header:** No header need to provide

**Body:** No body need to be provided

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

-   401 (Unauthorized)

```json
{
    "message": "Invalid access token"
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

**Header:** `Content-type: application/json`

**Request Body:** `req.body.data`

The `req.body.data` object must include the following fields:

| Field   | Type   | Required | Description       |
| ------- | ------ | -------- | ----------------- |
| `email` | string | Yes      | The user's email. |

**Response Codes:**
| Code | Description |
|------|-------------|
| `200`| `Success` |
| `404`| `Not found` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": "Request reset password successful"
}
```

-   404 (Not found)

```json
{
    "message": "User's email not found"
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

| Headers      | Value            | Required | Description |
| ------------ | ---------------- | -------- | ----------- |
| Content-type | application/json | Yes      |             |

**Request Body:** `req.body.data`

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
    "message": "Password changed successfully"
}
```

-   409 (conflict)

```json
{
    "message": "Old password does not matched"
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

| Headers   | Value      | Required | Description                         |
| --------- | ---------- | -------- | ----------------------------------- |
| projectId | :projectId | Yes      | The id of the project to get tasks. |

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
            "title": "exampleTask",
            "description": "exampleTask description",
            "deadline": "yyyy-mm-dd'T'HH:mm",
            "completed": "exampleTaskCompleted (true/false)"
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

### Get user information

**URL:**`auth/profile`

**Method** GET

**Header:** No header need to provide

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
            "fulname": "String",
            "blockAddress": "String",
            "email": "String",
            "phone": "0123456789",
            "address": "String",
            "identifiNumber": "String",
            "position": "String",
            "salary": 123,
            "startWorkDate": "11-11-2022",
            "role": "String"
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

### Update Profile

**URL:**`/auth/profile`

**Method** POST

**Header:**

| Headers      | Value            | Required | Description |
| ------------ | ---------------- | -------- | ----------- |
| Content-type | application/json | Yes      |             |

**Request Body:** `req.body.data`

**Request Body:**  
The `req.body.data` object must include the following fields:

| Field            | Type   | Required | Description                 |
| ---------------- | ------ | -------- | --------------------------- |
| `fullName`       | string | No       | The user's fullname .       |
| `address`        | string | No       | The user's address.         |
| `birthday`       | string | No       | The user's birthday.        |
| `identifiNumber` | string | No       | The user's identifi number. |

**Example Request Body:**

```json
{
    "data": {
        "fullName": "exampleFullName",
        "address": "exampleAddress",
        "birthday": "exampleBirthday",
        "identifiNumber": "exampleIdentifiNumber"
    }
}
```

**Response Codes:**
| Code | Description |
| ---- | ----------- |
| `200`| `Success` |
| `400`| `Failure` |
| `401`| `Unauthorized` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": "Profile updated successfully"
}
```

-   400 (Failure)

```json
{
    "message": "No valid fields to update"
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

**URL:**`/auth/manager/tasks`

**Method** POST

**Header:**

| Headers      | Value            | Required | Description |
| ------------ | ---------------- | -------- | ----------- |
| Content-type | application/json | Yes      |             |

**Request Body:** `req.body.data`

**Request Body:**  
The `req.body.data` object must include the following fields:

| Field         | Type      | Required | Description                |
| ------------- | --------- | -------- | -------------------------- |
| `staffId`     | string    | Yes      | The user id assigned task. |
| `projectId`   | string    | Yes      | The project id.            |
| `title`       | string    | Yes      | The task title.            |
| `description` | string    | Yes      | The task description.      |
| `deadline`    | date/time | Yes      | The deadline of the task.  |

**Example Request Body:**

```json
{
    "data": {
        "staffId": "exampleUserId",
        "projectId": "exampleProjectId",
        "title": "exampleTask title",
        "description": "exampleTask description",
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

### Get Project

**URL:**`/auth/manager/projects`

**Method:**`GET`

**Body:** `No body need to provide`

**Response Code:**
| Code | Description |
| ---- | ----------- |
| `200`| `Success` |
| `204`| `No-Content` |
| `401`| `Unauthorized` |
| `403`| `Forbidden` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": {
        "message": "Projects retrieved successfully",
        "data": [
            {
                "id": "example project id",
                "managerId": "example manager id",
                "staffs": ["staff id"],
                "projectName": "example project name",
                "deadline": "yyyy-MM-dd'T'HH:mm:ss",
                "completed": "Boolean",
                "completedAt": "yyyy-MM-dd'T'HH:mm:ss"
            }
        ]
    }
}
```

-   204 (No Content)

```json
{
    "message": {
        "message": "No project found for this manager",
        "data": []
    }
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

<!-- admin api -->

### Create Project

**URL:**`/auth/admin/create-project`

**Method** POST

**Header:**

| Headers      | Value            | Required | Description |
| ------------ | ---------------- | -------- | ----------- |
| Content-type | application/json | Yes      |             |

**Request Body:** `req.body.data`

**Request Body:**  
The `req.body.data` object must include the following fields:

| Field         | Type      | Required | Description                      |
| ------------- | --------- | -------- | -------------------------------- |
| `managerId`   | string    | Yes      | The manager id assigned project. |
| `projectName` | string    | Yes      | The project name.                |
| `deadline`    | date/time | Yes      | The deadline of the task.        |

**Example Request Body:**

```json
{
    "data": {
        "managerId": "exampleManagerId",
        "projectName": "exampleProjectName",
        "deadline": "yyyy-mm-dd'T'HH:mm"
    }
}
```

**Response Codes:**
| Code | Description |
| ---- | ----------- |
| `200`| `Success` |
| `400`| `Failure` |
| `401`| `Unauthorized` |
| `403`| `Forbidden` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": {
        "message": "Project created successfully",
        "data": "projectId"
    }
}
```

-   400 (Failure)

```json
{
    "message": "Missing required fields"
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

### Get Projects

**URL:**`/auth/admin/projects`

**Method:**`GET`

**Body:** `No body need to provide`

**Response Code:**
| Code | Description |
| ---- | ----------- |
| `200`| `Success` |
| `204`| `No-Content` |
| `401`| `Unauthorized` |
| `403`| `Forbidden` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```json
{
    "message": {
        "message": "Projects retrieved successfully",
        "data": [
            {
                "id": "example project id",
                "managerId": "example manager id",
                "staffs": ["staff id"],
                "projectName": "example project name",
                "deadline": "yyyy-MM-dd'T'HH:mm:ss",
                "completed": "Boolean",
                "completedAt": "yyyy-MM-dd'T'HH:mm:ss"
            }
        ]
    }
}
```

-   204 (No Content)

```json
{
    "message": {
        "message": "No project found",
        "data": []
    }
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
