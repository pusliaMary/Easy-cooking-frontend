# React + TypeScript + Vite + Node.js (express.js) + MongoDB + Cloudinary

### Project Title: EASY-COOKING APP

### THE NOTE

This application is made for people who are sick of the everyday routine of planning meals, but still crave healthy and delicious food. The idea is to make the process as easy as it can possibly be. Buy your ingredients or order a delivery (integration with delivery services is currently in progress), put on your headphones or watch a movie, and cook delicious dishes by following **EASY** steps. 

### DEV

The app provides the opportunity to use filters by meal type or meal base, choose between meat or vegan recipes, and recreate your meal plan. It also provides a shopping list of ingredients to buy and a step-by-step cooking guide for each dish. An Admin Panel is available to authorized users to perform CRUD operations on recipes. 

### 🛠 Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT via jose (Secure HTTP-Only Cookies)

### 🔒 Authentication & Security

The application implements a secure, native, and fully asynchronous authentication system using the **jose** library. 

* **Token Generation:** Upon successful authentication, the server issues a signed accessToken with a **2-hour expiration time** using the HS256 algorithm.
* **Storage & Protection:** Tokens are transmitted and stored via **HTTP-Only Cookies** (accessToken). This approach eliminates the risk of XSS attacks associated with local storage.
* **Route Protection:** A custom authenticate middleware intercepts incoming requests for protected endpoints (like Admin CRUD actions), verifies the cookie's signature, and attaches the active session data to the request.
* **Global Error Handling:** Features a robust error boundary that automatically catches 404 routes and formats system exceptions, securely hiding error stack traces in production environments (NODE_ENV=production).

### 🚀 Getting Started

### Prerequisites

Make sure you have the following installed: 

* [Node.js](https://nodejs.org/) (v16 or higher)
* [Git](https://git-scm.com/)

### Installation & Setup

1. **Clone the repository:** 

bash

git clone https://github.com/your-username/your-repo-name.git

2. **Install dependencies:** 

bash

npm install


4. **Run the application:** 

bash

npm start

The app should now be running at http://localhost:3000.

### 🗺 Roadmap

* [x] Core recipe filtering (meal type, meat/vegan, *keywords)
* [x] Step-by-step cooking guides
* [x] Native JWT authentication & route protection via jose
* [x] Admin panel with CRUD operations for recipes
* [ ] Integration with popular food delivery services (In Progress)
* [ ] Automated weekly meal plan generator
* [ ] Voice control for hands-free cooking steps
