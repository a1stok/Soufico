
# User API Documentation

## Overview
This API helps manage user data in a MongoDB database. It allows saving, retrieving, and deleting user information like names and profile pictures.

---

## Base URL
If you're running this locally:
```
http://localhost:3000
```

---

## Endpoints

### 1. **Save User Data**
- **Method:** `POST`
- **URL:** `/api/users/save`
- **Description:** This saves or updates user data in the database.
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "uid": "firebase-uid-12345",
    "name": "John Doe",
    "photoURL": "https://example.com/photo.jpg"
  }
  ```
- **Response:**
  - Success:
    ```json
    {
      "message": "User data saved successfully!"
    }
    ```
  - Error:
    ```json
    {
      "error": "Failed to save user data."
    }
    ```

---

### 2. **Get User Data**
- **Method:** `GET`
- **URL:** `/api/users/:uid`
- **Description:** Use this to fetch user data by their UID.
- **Example URL:**
  ```
  http://localhost:3000/api/users/firebase-uid-12345
  ```
- **Response:**
  - Success:
    ```json
    {
      "uid": "firebase-uid-12345",
      "name": "John Doe",
      "photoURL": "https://example.com/photo.jpg"
    }
    ```
  - User Not Found:
    ```json
    {
      "error": "User not found."
    }
    ```

---

### 3. **Delete User Data**
- **Method:** `DELETE`
- **URL:** `/api/users/:uid`
- **Description:** This deletes a user's data by their UID.
- **Example URL:**
  ```
  http://localhost:3000/api/users/firebase-uid-12345
  ```
- **Response:**
  - Success:
    ```json
    {
      "message": "User deleted successfully!"
    }
    ```
  - User Not Found:
    ```json
    {
      "error": "User not found."
    }
    ```

---

## MongoDB Setup

### Database: `Soufico`
### Collection: `users`

### Document Format:
```json
{
  "_id": "<ObjectId>",
  "uid": "firebase-uid-12345",
  "name": "John Doe",
  "photoURL": "https://example.com/photo.jpg"
}
```

---

## How to Run the Server
1. Install the dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. The server will run at `http://localhost:3000`.

---

## Testing the API
You can test the API using tools like:
- [Postman](https://www.postman.com/)
- `curl` commands

---

Let me know if there’s anything else that needs fixing!
