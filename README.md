
# User API Documentation
## Base URL
Haii, to run it locally:
```
http://localhost:3000
```

---

## Endpoints

### 1. **Save User Data**
- **Method:** `POST`
- **URL:** `/api/users/save`
- **Description:** Saves or updates user data in the database.
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
- **Description:** Fetch user data by their UID.
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
- **Description:** Deletes a user's data by their UID.
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
  "name": "Kostia Ua",
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

