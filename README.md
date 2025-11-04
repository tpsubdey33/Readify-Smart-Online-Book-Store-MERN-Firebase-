### 🚀 Readify – Smart Online Book Store (MERN + Firebase)

## 🚀 How to Run This Project
🖥️ Frontend (React + Vite + Firebase)
Steps:

Clone or unzip the project folder.

Navigate to the frontend directory:

cd frontend


Create a .env.local file in the frontend root (same level as package.json) and add the following environment variables:

# Firebase configuration
VITE_API_KEY="AIzaSyCXvDIC4MPrkaMdeg_O2iij88wLpfj3qBA"

VITE_Auth_Domain="book-store-mern-app.firebaseapp.com"

VITE_PROJECT_ID="book-store-mern-app"

VITE_STORAGE_BUCKET="book-store-mern-app.appspot.com"

VITE_MESSAGING_SENDERID="205632822247"

VITE_APPID="1:205632822247:web:b0db0ec66bf6de0bbb3b42"



### Install dependencies:

npm install


Start the frontend development server:

npm run dev

### ⚙️ Backend (Node.js + Express + MongoDB)
Steps:

Navigate to the backend directory:

cd server


Install dependencies:

npm install


Create a .env file in the backend root (same level as package.json) and add the following environment variables:

# MongoDB connection string
DB_URL="mongodb+srv://helpyourassistant:pqam0Mwv3Vwv8Off@cluster0.qc3bq.mongodb.net/book-store?retryWrites=true&w=majority&appName=Cluster0"

# JWT secret key
JWT_SECRET_KEY="bc992a20cb6706f741433686be814e3df45e57ea1c2fc85f9dbb0ef7df12308a669bfa7c976368ff32e32f6541480ce9ec1b122242f9b1257ab669026aeaf16"

## 📚 API Documentation (Swagger UI)

# 🔍 What is Swagger?
    Swagger is an API documentation and testing tool that provides an interactive UI for exploring
    
     and testing backend APIs without using tools like Postman.
It helps developers quickly understand available endpoints, request formats, and response structures.

# ✅ Why Swagger is Used

To automatically generate clean and interactive API documentation.

To test endpoints directly from the browser without external tools.

To maintain up-to-date API details as the backend evolves.

To improve developer collaboration and debugging.
#### Start the backend server

npm run start:dev

# Open your browser and visit:

http://localhost:5000/api-docs

![Swagger UI Screenshot](./frontend/src/assets/Swagger.png)

You’ll see a Swagger UI dashboard where you can:

View all API endpoints (GET, POST, PUT, DELETE)

Expand each API to see parameters and response examples

Test endpoints directly by entering required data and clicking "Execute"


### ⚠️ Note:

Make sure you have MongoDB properly set up.

Update the DB_URL with your own MongoDB connection string.

Replace the JWT_SECRET_KEY with a unique secret key for your app.

Start the backend server:

npm run start:dev

### 🧩 Project Structure
📦 project-root/
 ┣ 📂 frontend/      → React + Vite + Firebase frontend
 ┣ 📂 server/       → Node.js + Express + MongoDB backend
 ┣ 📄 .gitignore
 ┣ 📄 README.md




🏁 Final Notes

Make sure MongoDB is running before starting the backend.

Both the frontend and backend should run simultaneously.

Default ports:

Frontend → http://localhost:5173

Backend → http://localhost:3000

API Docs → http://localhost:5000/api-docs
