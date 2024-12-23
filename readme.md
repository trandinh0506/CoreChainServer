# CoreChain API

CoreChain API provides seamless integration for managing user data and interactions within your application. It's lightweight, fast, and designed to scale with your needs.

Key Features:

-   Authentication and Authorization
-   User Data Management
-   Real-time Notifications
-

## Usages:

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

**Respone Codes:**
| Code | Description |
|------|-------------|
| `200`| `Success` |
| `404`| `Not Found` |
| `500`| `Internal Server Error`|

**Example Respone**

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

**Respone Codes:**
| Code | Description |
|------|-------------|
| `200`| `Success` |
| `409`| `conflict username had already existed` |
| `500`| `Internal Server Error`|

**Example Respone**

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
