# Drone Spots Map

A full-stack web application for mapping and discovering drone flying spots. Built with React, TypeScript, Node.js, and MongoDB.

## Features

- Interactive Google Maps interface for viewing drone spots
- Add new drone spots with custom names, descriptions, and drone types
- Automatic location detection
- Place autocomplete for easy spot naming
- Filter spots by drone types (tinywhoop, toothpick, 5-inch)
- Clean and minimal map interface
- Responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- Google Maps API for mapping
- Vite for build tooling
- Nginx for serving static files

### Backend
- Node.js with TypeScript
- Express.js for API
- MongoDB for database
- Mongoose for ODM

### Infrastructure
- Docker and Docker Compose for containerization
- MongoDB for data persistence

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- Google Maps API key

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd drone-spots-map
```

2. Set up environment variables:
   - Create a `.env` file in the frontend directory with your Google Maps API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

3. Start the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:80
- Backend API: http://localhost:3001

## Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm run dev
```

## API Endpoints

- `GET /api/spots` - Get all drone spots
- `POST /api/spots` - Create a new drone spot
- `GET /api/spots/nearby` - Get spots near a location (requires lat, lng, and optional radius)

## Project Structure

```
drone-spots-map/
├── frontend/               # React frontend application
│   ├── src/               # Source files
│   ├── public/            # Static files
│   └── Dockerfile         # Frontend Docker configuration
├── backend/               # Node.js backend application
│   ├── src/              # Source files
│   └── Dockerfile        # Backend Docker configuration
└── docker-compose.yml    # Docker Compose configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Maps Platform
- Material-UI
- React Google Maps API 