# Markdown Notes Application

A production-quality, full-stack Markdown notes application with a clean architecture, real-time editing, and persistent storage.

## Overview

This application provides a seamless note-taking experience with:
- **Live Markdown Editor**: Split-screen editing with real-time preview
- **Persistent Storage**: PostgreSQL database with optimized queries
- **Auto-save**: Debounced auto-save for smooth editing experience
- **Search**: Full-text search across all notes
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

### Frontend
- **React.js** (v18) - Functional components with hooks
- **Context API** - Lightweight state management
- **Marked** - Markdown parsing
- **DOMPurify** - XSS protection
- **Plain CSS** - Minimal, utility-based styling

### Backend
- **Node.js** with Express.js
- **MySQL** - Primary database
- **Joi** - Input validation
- **Helmet** - Security headers
- **Rate Limiting** - API protection

### Architecture
- **Clean Architecture**: Controller-Service-Repository pattern
- **Separation of Concerns**: Modular, maintainable codebase
- **Error Handling**: Comprehensive error management
- **Performance Optimized**: Debounced operations, efficient queries

## Project Structure

```
markdown-notes-app/
ââââ backend/
â  â  â  âââ src/
â  â  â  â   âââ controllers/     # API endpoint handlers
â  â  â  â   âââ services/        # Business logic
â  â  â  â   âââ repositories/    # Data access layer
â  â  â  â   âââ middleware/      # Validation, error handling
â  â  â  â   âââ database/       # Database connection & migrations
â  â  â  â   âââ routes/          # API routes
â  â  â  â   âââ utils/           # Utility functions
â  â  â  â   âââ server.js        # Express server setup
â  â  â  âââ package.json
â  â  â  âââ .env.example
âââ frontend/
â  â  â  âââ public/
â  â  â  â   âââ index.html
â  â  â  âââ src/
â  â  â  â   âââ components/
â  â  â  â   â   âââ Editor/      # Markdown editor components
â  â  â  â   â   âââ Layout/      # Layout components
â  â  â  â   â   âââ UI/         # Reusable UI components
â  â  â  â   âââ context/         # React context for state
â  â  â  â   âââ hooks/           # Custom React hooks
â  â  â  â   âââ services/        # API service layer
â  â  â  â   âââ utils/           # Utility functions
â  â  â  â   âââ styles/          # CSS stylesheets
â  â  â  â   âââ App.js           # Main React component
â  â  â  â   âââ index.js         # React entry point
â  â  â  âââ package.json
âââ README.md
```

## Database Schema

### Notes Table
```sql
CREATE TABLE notes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    content TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Indexes for Performance
- `idx_notes_updated_at` - For sorting by modification time
- `idx_notes_fulltext` - Full-text search on title and content

## API Documentation

### Base URL
`http://localhost:3001/api`

### Endpoints

#### Get All Notes
```http
GET /notes?page=1&limit=20
```

#### Get Single Note
```http
GET /notes/:id
```

#### Create Note
```http
POST /notes
Content-Type: application/json

{
  "title": "Note Title",
  "content": "Markdown content"
}
```

#### Update Note
```http
PUT /notes/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Note
```http
DELETE /notes/:id
```

#### Search Notes
```http
GET /notes/search?q=search_term&page=1&limit=20
```

### Response Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Clone and Setup
```bash
git clone <repository-url>
cd markdown-notes-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=markdown_notes
# DB_USER=root
# DB_PASSWORD=
# PORT=3001
# NODE_ENV=development
# FRONTEND_URL=http://localhost:3000

# Create database
mysql -u root -p -e "CREATE DATABASE markdown_notes;"

# Run migrations
npm run migrate
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env if needed (optional)
# REACT_APP_API_URL=http://localhost:3001/api
```

### 4. Run the Application

#### Start Backend
```bash
cd backend
npm run dev  # Development with nodemon
# or
npm start    # Production
```

#### Start Frontend
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## Environment Variables

### Backend (.env)
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=markdown_notes
DB_USER=root
DB_PASSWORD=

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```bash
# API URL (optional, defaults to http://localhost:3001/api)
REACT_APP_API_URL=http://localhost:3001/api
```

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Database Migrations
```bash
cd backend
npm run migrate
```

### Code Quality
- ESLint and Prettier configured
- Comprehensive error handling
- Input validation on all endpoints
- Security headers and rate limiting

## Performance Features

### Frontend Optimizations
- **Debounced Auto-save**: 800ms delay prevents excessive API calls
- **React.memo**: Prevents unnecessary re-renders
- **Efficient State Management**: Context API with optimized updates
- **Virtual Scrolling**: Handles large note lists efficiently

### Backend Optimizations
- **Connection Pooling**: Efficient database connections
- **Indexed Queries**: Fast search and pagination
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Prevents malformed data

## Security Features

- **XSS Protection**: DOMPurify sanitizes all HTML output
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Secure cross-origin requests
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Joi schema validation
- **Security Headers**: Helmet.js middleware

## Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
```

#### Backend
```bash
cd backend
npm start
```

### Docker Deployment (Optional)

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: markdown_notes
      MYSQL_USER: root
      MYSQL_ROOT_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=markdown_notes
      - DB_USER=root
      - DB_PASSWORD=password
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

## Features Implemented

### Core Features
- [x] Markdown editor with live preview
- [x] Split-screen layout
- [x] Full CRUD operations for notes
- [x] Persistent PostgreSQL database
- [x] Auto-save with debouncing
- [x] Full-text search
- [x] Responsive design

### Advanced Features
- [x] Clean architecture (Controller-Service-Repository)
- [x] Comprehensive error handling
- [x] Input validation
- [x] Security headers and rate limiting
- [x] Performance optimizations
- [x] Mobile responsive

### Future Enhancements
- [ ] Tags system
- [ ] Version history
- [ ] Dark mode toggle
- [ ] Export to PDF
- [ ] Collaboration features
- [ ] File attachments

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with clean architecture principles for scalability and maintainability.**
