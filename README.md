# Murmur Reborn

A full-stack chat and social platform with real-time messaging, friend requests, and notifications.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Usage](#usage)
- [API Overview](#api-overview)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Real-time group and private chat (powered by Stream)
- Friend requests and notifications
- User authentication
- Responsive UI

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Query, Lucide Icons
- **Backend:** Node.js, Express, Stream Chat API
- **Database:** (Add your DB, e.g., MongoDB, if used)
- **Other:** JWT Auth, REST API

---

## Project Structure

```
Murmur Reborn/
│
├── backend/
│   └── src/
│       ├── controllers/
│       │   └── chat.controller.js
│       ├── lib/
│       │   └── stream.js
│       └── utils/
│           ├── ApiResponse.js
│           └── asyncHandler.js
│   └── ... (other backend files)
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   └── NotificationsPage.jsx
│       └── components/
│           └── NoNotificationsFound.jsx
│   └── ... (other frontend files)
│
└── README.md
```

---

## Setup & Installation

### Backend

1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file with your Stream API keys and other secrets.

3. **Run the backend:**
   ```sh
   npm run dev
   ```

### Frontend

1. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```

2. **Run the frontend:**
   ```sh
   npm start
   ```

---

## Usage

- Visit the frontend URL (usually `http://localhost:3000`)
- Register or log in
- Send/accept friend requests, chat in groups, and receive notifications

---

## API Overview

- **POST /api/chat/group** – Create a group chat
- **GET /api/chat/token** – Get a Stream chat token
- *(Add more endpoints as needed)*

---

## Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)