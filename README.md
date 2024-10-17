# 🎵 Music API

This is a RESTful API for a music app where users can create and manage playlists, upload songs, and search for other playlists or songs. The API supports user authentication, playlist creation, song uploads (audio files and cover images), and more.

## Features

- **User Authentication**: Sign up, login, JWT-based access token and refresh token system.
- **Song Management**: Upload songs, edit song details, delete songs, pagination support.
- **Playlist Management**: Create and manage playlists, add/remove songs from playlists.
- **File Upload**: Upload audio files and cover images for songs.
- **Collaborations**: Support for songs with multiple artists collaborating.
- **Search**: Search songs or playlists based on various criteria.

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose for schema modeling)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer for handling file uploads (audio files and images)
- **Pagination**: Built-in pagination for song and playlist listings.

---

## Prerequisites

Before setting up the project, ensure that you have:

- **Node.js** installed (version 14 or higher).
- **MongoDB** installed and running locally or a MongoDB cloud instance.
- **npm** (Node Package Manager) to install dependencies.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/music-api.git
cd music-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a `.env` File

Create a `.env` file in the root of your project and copy all from `.env.sample` file and configure the environment variables in your project accordingly.

### 4. Run the Server

Start the development server:

```bash
npm run dev
```

---

## API Endpoints

### Authentication Routes

#### 1. **Register User**

```http
POST /users/register
```

**Body:**

```json
{
  "username": "exampleUser",
  "email": "example@example.com",
  "password": "securePassword"
}
```

#### 2. **Login User**

```http
POST /users/login
```

**Body:**

```json
{
  "email": "example@example.com",
  "password": "securePassword"
}
```

#### 3. **Refresh Token**

```http
POST /users/refresh
```

---

### Song Routes

#### 1. **Get All Songs (with Pagination)**

```http
GET /songs?page=1&limit=10
```

#### 2. **Create a Song** (Authenticated)

```http
POST /songs
```

**Form Data (Multer)**:

- `audioFile`: The song audio file (MP3, WAV, etc.).
- `coverImage`: The song cover image (JPEG, PNG, etc.).
- Other fields: `title`, `artists`, `album`, `genre` (optional).

#### 3. **Delete a Song** (Artist Only)

```http
DELETE /songs/:id
```

**Authorization**: Only the artist(s) who created the song can delete it.

---

### Playlist Routes

#### 1. **Get All Playlists**

```http
GET /playlists
```

#### 2. **Create a Playlist** (Authenticated)

```http
POST /playlists
```

**Body:**

```json
{
  "title": "Chill Vibes",
  "description": "A playlist for relaxing",
  "songs": ["songId1", "songId2"]
}
```

#### 3. **Add a Song to Playlist**

```http
PUT /playlists/:id/add-song
```

**Body:**

```json
{
  "songId": "songId1"
}
```

#### 4. **Remove a Song from Playlist**

```http
PUT /playlists/:id/remove-song
```

**Body:**

```json
{
  "songId": "songId1"
}
```

---

## File Uploads

- **Audio Files** are stored in the `/public/uploads` directory.
- **Cover Images** are also stored in the `/public/uploads` directory.
- Files are accessible via URLs such as: `http://localhost:8080/uploads/temp/{file-name}`.

---

## Middleware

- **`authMiddleware`**: Protects routes to ensure only authenticated users can access them.
- **`upload`**: Multer middleware to handle file uploads for songs and images.

---

## Pagination

- The `getAllSongs` and `getAllPlaylists` endpoints support pagination with the following query parameters:
  - `page`: The page number (default is `1`).
  - `limit`: The number of items per page (default is `10`).

Example:

```http
GET /songs?page=2&limit=5
```

---

## Error Handling

All routes return appropriate error messages and status codes in case of invalid requests or server issues.

- **400 Bad Request**: For missing fields, invalid data, or file upload errors.
- **401 Unauthorized**: For requests made without valid authentication.
- **403 Forbidden**: When a user tries to perform an action they're not authorized for (e.g., deleting a song they didn't create).

---

## Contribution

Feel free to fork this repository and submit pull requests. Contributions and feedback are welcome!

---

## License

This project is licensed under the MIT License.

---

## Contact

- **Author**: [Kamal Melkani](https://github.com/rockmel03)
- **Email**: kamalmelkani03@gmail.com

---
