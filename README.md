# Travel Planner Application

A full-stack travel planning application with AI-powered itinerary generation.

## Technology Stack

### Frontend
- **React 18** with Vite
- **React Router Dom** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **JWT** authentication

### Backend
- **Spring Boot 3.1.5**
- **Spring Security** with JWT
- **Spring Data JPA**
- **PostgreSQL** database
- **Google Gemini AI** for itinerary generation
- **Java 17**

## Features

- User authentication (Sign up/Sign in)
- Trip planning and management
- AI-powered itinerary generation
- Travel journal functionality
- User profile management
- Responsive design

## Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── services/       # API service layer
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Spring Boot backend
│   └── WarderGen/
│       ├── src/main/java/com/travelplanner/
│       │   ├── controller/ # REST controllers
│       │   ├── model/      # Entity models
│       │   ├── repository/ # Data repositories
│       │   ├── service/    # Business logic
│       │   ├── security/   # Security configuration
│       │   └── dto/        # Data transfer objects
│       └── pom.xml
└── README.md
```

## Local Development

### Prerequisites
- Node.js 16+
- Java 17+
- Maven 3.6+
- PostgreSQL

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend/WarderGen
mvn spring-boot:run
```

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variables as needed

### Backend (Render)
1. Connect your GitHub repository to Render
2. Use the provided `render.yaml` configuration
3. Set environment variables:
   - `JWT_SECRET`: Your JWT secret key
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `DATABASE_URL`: Will be auto-provided by Render PostgreSQL
   - `DB_USERNAME`: Will be auto-provided by Render PostgreSQL
   - `DB_PASSWORD`: Will be auto-provided by Render PostgreSQL

## Environment Variables

### Backend
- `JWT_SECRET`: Secret key for JWT token generation
- `GEMINI_API_KEY`: Google Gemini API key for AI features
- `DATABASE_URL`: PostgreSQL connection string
- `CORS_ORIGINS`: Allowed frontend URLs

### Frontend
- `VITE_API_URL`: Backend API URL (for production)

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Trip Management
- `GET /api/trips` - Get user trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/{id}` - Get trip by ID
- `PUT /api/trips/{id}` - Update trip
- `DELETE /api/trips/{id}` - Delete trip

### Itinerary
- `POST /api/itineraries/generate/{tripId}` - Generate itinerary
- `PUT /api/itineraries/regenerate/{tripId}` - Regenerate itinerary
- `POST /api/itineraries/adapt/{tripId}` - Adapt itinerary

### Journal
- `GET /api/journal/{tripId}` - Get trip journal
- `POST /api/journal/{tripId}` - Save journal entry
- `DELETE /api/journal/{tripId}` - Delete journal

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.