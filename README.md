# 🚀 SocialApp

> A full-stack social media platform featuring a real-time feed, user following system, and instant notifications. Built with performance and scalability in mind using **NestJS** and **Next.js**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v18%2B-green.svg)
![Status](https://img.shields.io/badge/status-Assignment_Ready-success.svg)

---

## ✨ Key Features

* **🔐 Secure Authentication:** JWT-based Login and Sign-up with password hashing.
* **📱 Fully Responsive:** Optimized for Mobile, Tablet, and Desktop (Tailwind CSS).
* **📡 Real-time Updates:** WebSocket (Socket.io) powered notifications for new followers.
* **📝 Asynchronous Processing:** Post creation is handled via **Redis Queues** (BullMQ) for scalability.
* **👥 Social Graph:** Follow/Unfollow system with a personalized timeline feed.
* **🛡️ Security:** Protected routes using Guards and HTTP-only cookies/headers.

---

## 🛠️ Tech Stack

### **Backend (Server)**
* ![NestJS](https://img.shields.io/badge/-NestJS-E0234E?logo=nestjs&logoColor=white) **NestJS** - Progressive Node.js framework.
* ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) **MongoDB** - NoSQL Database (via Mongoose).
* ![Redis](https://img.shields.io/badge/-Redis-DC382D?logo=redis&logoColor=white) **Redis & BullMQ** - For background job processing.
* ![Socket.io](https://img.shields.io/badge/-Socket.io-010101?logo=socket.io&logoColor=white) **WebSockets** - Real-time event gateway.

### **Frontend (Client)**
* ![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=next.js&logoColor=white) **Next.js 14** - React Framework (App Router).
* ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) **Tailwind CSS** - Modern styling.
* ![Shadcn](https://img.shields.io/badge/-shadcn%2Fui-000000?logo=shadcnui&logoColor=white) **shadcn/ui** - Accessible UI components.

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### **1. Prerequisites**
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (Running locally or via Atlas)
* [Redis](https://redis.io/) (Required for the Post Queue to work)

### **2. Installation & Setup**

<details>
<summary><strong>👇 Click to expand Backend Setup</strong></summary>

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm run start:dev
    ```
    *The backend runs on `http://localhost:3000`*
</details>

<details>
<summary><strong>👇 Click to expand Frontend Setup</strong></summary>

1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the client:
    ```bash
    npm run dev
    ```
    *The frontend runs on `http://localhost:3001`*
</details>

---