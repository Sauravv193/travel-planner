🌍 AI-Powered Travel Planner
A full-stack web application that generates personalized travel itineraries using Google's Gemini AI. This tool helps you manage your trips, track expenses, and keep a travel journal.

🌐 Live Demo
🚀 https://travel-planner-akyd.vercel.app/

✨ Features
🤖 AI Itinerary Generation: Instantly create detailed travel plans for any destination.

🔐 Secure Authentication: User registration and login system with JWT authentication.

✈️ Trip Management: Easily create, view, update, and delete your travel plans.

💸 Expense Tracking: Keep a close eye on your budget with a built-in expense tracker.

📖 Travel Journal: Document your memories and experiences for each trip.

📱 Responsive Design: A seamless experience across desktop and mobile devices.

🛠️ Tech Stack
Category

Technology

Backend

Java 17, Spring Boot 3, Spring Security (JWT), Spring JPA

Frontend

React 18, Vite, Tailwind CSS, Axios, React Router

AI Integration

Google Gemini AI API

Database

PostgreSQL

Deployment

Docker, Render (Backend & DB)

🚀 Getting Started
Follow these instructions to get a local copy up and running.

Prerequisites
Java 17+

Maven 3.6+

Node.js 16+

PostgreSQL

A Google Gemini API key

Installation & Setup
Clone the repository:

git clone [https://github.com/Sauravv193/travel-planner.git](https://github.com/Sauravv193/travel-planner.git)
cd travel-planner

Configure and run the Backend:

Navigate to the backend directory: cd backend/WarderGen

Set up your PostgreSQL database and update the src/main/resources/application.properties file with your database credentials, JWT secret, and Gemini API key:

spring.datasource.url=jdbc:postgresql://localhost:5432/your_db_name
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password

gemini.api.key=your-gemini-api-key
travel.app.jwtSecret=your-strong-jwt-secret

Run the Spring Boot application:

./mvnw spring-boot:run

The backend will be running at http://localhost:8080.

Configure and run the Frontend:

Navigate to the frontend directory: cd ../../frontend

Install the necessary packages:

npm install

Create a .env.local file and add the backend API URL:

echo "VITE_API_URL=http://localhost:8080/api" > .env.local

Start the development server:

npm run dev

The frontend will be running at http://localhost:5173.

Access the application:
Open your browser and go to http://localhost:5173. You can now register an account and start planning your trips!

🌐 API Endpoints
A few of the core API endpoints include:

POST /api/auth/signup: Register a new user.

POST /api/auth/signin: Authenticate and receive a JWT.

GET /api/trips: Fetch all trips for the authenticated user.

POST /api/trips: Create a new trip.

POST /api/itineraries/generate/{tripId}: Generate an AI-powered itinerary for a specific trip.

GET /api/journal/{tripId}: Retrieve the travel journal for a trip.

👨‍💻 Author
Sauravv193 - GitHub Profile

📄 License
This project is licensed under the MIT License.

Found this project helpful? Please consider giving it a ⭐ on GitHub!
