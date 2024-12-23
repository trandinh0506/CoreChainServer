# CoreChain API

CoreChain API provides seamless integration for managing user data and interactions within your application. It's lightweight, fast, and designed to scale with your needs.

Key Features:

-   Authentication and Authorization
-   User Data Management
-   Real-time Notifications
-

## Usages:

<!-- authen -->

### 1. Login

**URL:**`/login`

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

```
{
    "message": "Login successful",
    "token"  : "Example token",
}
```

-   404 (Not Found)

```
{
    "message": "User not found",
}
```

-   500 (Internal Server Error)

```
{
    "message": "Internal Server Error"
}
```

### 2. Register

**URL:**`/register`

**Method** POST

**Header:** `Content-type: application/json`

**Request Body:** `req.body.data`
**Request Body:**  
The `req.body.data` object must include the following fields:

| Field      | Type   | Required | Description          |
| ---------- | ------ | -------- | -------------------- |
| `username` | string | Yes      | The user's username. |
| `password` | string | Yes      | The user's password. |
| `role`     | string | Yes      | The user's role      |

**Example Request Body:**

```json
{
    "data": {
        "username": "exampleUser",
        "password": "examplePassword",
        "role": "exampleRole"
    }
}
```

**Response Codes:**
| Code | Description |
|------|-------------|
| `200`| `Success` |
| `409`| `conflict username had already existed` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```
{
    "message": "Register successful",
    "token": "Example token",
}
```

-   409 (conflict)

```
{
    "message": "Username had already existed",
}
```

-   500 (Internal Server Error)

```
{
    "message": "Internal Server Error"
}
```

### 3. Logout

**URL:**`/logout`

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

```
{
    "message": "Logout successful",
}
```

-   401 (Unauthorized)

```
{
    "message": "Missing authorization token",
}
```

-   500 (Internal Server Error)

```
{
    "message": "Internal Server Error"
}
```

<!-- manager tasks -->

### 4. Allocate Tasks

**URL:**`/allocateTasks`

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

```
{
  "data": {
    "userId": `userId`,
    "projectId": `projectId`,
    "task": `task title`,
    "deadline": `yyyy-mm-dd'T'HH:mm`
  }
}
```

**Response Codes:**
| Code | Description |
| ---- | ---------------------- |
| `200`| `Success` |
| `401`| `Unauthorized` |
| `403`| `Forbidden` |
| `500`| `Internal Server Error`|

**Example Response**

-   200 (Success)

```
{
    "message": "Task allocated successfully",
}
```

-   401 (Unauthorized)

```
{
    "message": "Missing authorization token",
}
```

-   403 (Forbidden)

```
{
    "message": "Permission denied",
}
```

-   500 (Internal Server Error)

```
{
    "message": "Internal Server Error"
}
```
