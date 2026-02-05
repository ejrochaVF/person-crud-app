# Person CRUD Application - Full Stack Learning Project

## 🎯 Project Overview

This is a complete **3-tier web application** built with React (frontend) and Node.js (backend) to teach you modern full-stack development. The application implements a simple CRUD (Create, Read, Update, Delete) for managing Person entities.

## 📚 What You'll Learn

1. **3-Tier Architecture**: Clear separation between Presentation, Business Logic, and Data Access layers
2. **RESTful API Design**: How to design and consume REST APIs
3. **React Frontend**: Modern React with hooks, component patterns, and state management
4. **Node.js Backend**: Express.js server with proper routing and middleware
5. **ORM Integration**: Sequelize ORM for database operations and model management
6. **Repository Pattern**: Clean data access layer with BaseRepository and specific repositories
7. **Dependency Injection**: Using Awilix for managing dependencies and testability
8. **Unit of Work Pattern**: Managing database transactions across multiple operations
9. **Project Structure**: Industry best practices for organizing code
10. **Error Handling**: Proper error handling across all tiers
11. **Development Workflow**: How to run and develop both projects simultaneously

---

## 🏗️ Architecture Overview

### Why Two Separate Projects?

**Best Practice: YES, use two separate projects!**

**Reasons:**
- **Separation of Concerns**: Frontend and backend are different applications with different dependencies, build processes, and deployment strategies
- **Independent Scaling**: In production, you can scale frontend and backend independently
- **Different Technologies**: Frontend uses Webpack/Vite for bundling; backend runs directly with Node.js
- **Team Collaboration**: Different teams can work on frontend/backend without conflicts
- **Deployment Flexibility**: Can deploy to different servers/services (e.g., Netlify for frontend, AWS for backend)

### 3-Tier Architecture Explained

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                        │
│                     (React Frontend)                        │
│  - Components (UI)                                          │
│  - Services (API calls)                                     │
│  - State Management                                         │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC TIER                      │
│                    (Node.js Backend)                        │
│  - Controllers (Handle requests/responses)                  │
│  - Services (Business logic & validation)                   │
│  - Dependency Injection (Awilix container)                  │
└─────────────────────────────────────────────────────────────┘
                            ↕ ORM/Repository
┌─────────────────────────────────────────────────────────────┐
│                    DATA ACCESS TIER                         │
│                    (MySQL + Sequelize ORM)                  │
│  - Models (Sequelize entities)                              │
│  - Repositories (Data access patterns)                      │
│  - Unit of Work (Transaction management)                    │
│  - Database Connection & Configuration                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
person-crud-app/
├── frontend/                    # React Application (Presentation Tier)
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── components/         # React Components (UI Layer)
│   │   │   ├── PersonList.jsx  # Display list of persons
│   │   │   ├── PersonForm.jsx  # Create/Edit form
│   │   │   └── PersonItem.jsx  # Single person display
│   │   ├── services/           # API Communication Layer
│   │   │   └── personService.js # All API calls to backend
│   │   ├── App.jsx             # Main App component
│   │   ├── App.css             # Styles
│   │   └── index.js            # Entry point
│   ├── package.json
│   └── README.md
│
├── backend/                     # Node.js Application
│   ├── src/
│   │   ├── config/             # Configuration
│   │   │   └── database.js     # Database connection (Sequelize)
│   │   ├── controllers/        # Presentation Tier - Request Handlers
│   │   │   ├── baseController.js # Common HTTP functionality
│   │   │   └── personController.js
│   │   ├── models/             # Domain Layer - Sequelize Models
│   │   │   └── personModel.js
│   │   ├── repositories/       # Data Access Tier - Repository Pattern
│   │   │   ├── baseRepository.js # Generic CRUD operations
│   │   │   ├── personRepository.js # Person-specific operations
│   │   │   ├── cacheManager.js # Caching for performance
│   │   │   └── unitOfWork.js   # Transaction management
│   │   ├── services/           # Business Logic Tier - Domain Services
│   │   │   ├── personService.js # Person business logic
│   │   │   └── README.md
│   │   ├── routes/             # API Routes Definition
│   │   │   └── personRoutes.js
│   │   ├── common/             # Shared utilities
│   │   │   ├── errors.js       # Custom error classes
│   │   │   └── README.md
│   │   ├── di/                 # Dependency Injection
│   │   │   └── container.js    # Awilix container configuration
│   │   └── server.js           # Express app setup & entry point
│   ├── package.json
│   ├── .env.example            # Environment variables template
│   └── README.md
│
└── README.md                    # This file
```

---

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **React Hooks** - useState, useEffect for state management
- **Axios** - HTTP client for API communication
- **CSS3** - Styling and responsive design

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web framework for Node.js
- **Sequelize** - Promise-based ORM for MySQL
- **MySQL** - Relational database management system
- **Awilix** - Dependency injection container
- **CORS** - Cross-origin resource sharing middleware
- **dotenv** - Environment variable management

### Development Tools
- **Visual Studio Code** - IDE with excellent JavaScript support
- **npm** - Package manager for Node.js
- **MySQL Workbench** - Database administration tool

### Design Patterns
- **Repository Pattern** - Abstracts data access logic
- **Dependency Injection** - Loose coupling and testability
- **Unit of Work** - Manages database transactions
- **Base Repository** - Common CRUD operations
- **Service Layer** - Business logic encapsulation

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Visual Studio Code** - [Download](https://code.visualstudio.com/)

### Step 1: Database Setup

1. Start your MySQL server (localhost)
2. Open MySQL command line or MySQL Workbench
3. Run the following SQL to create the database and table:

```sql
-- Create database
CREATE DATABASE person_crud_db;

-- Use the database
USE person_crud_db;

-- Create persons table
CREATE TABLE persons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  address VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO persons (name, surname, email, address, phone) VALUES
('John', 'Doe', 'john.doe@email.com', '123 Main St', '555-0101'),
('Jane', 'Smith', 'jane.smith@email.com', '456 Oak Ave', '555-0102'),
('Bob', 'Johnson', 'bob.johnson@email.com', '789 Pine Rd', '555-0103');
```

**Note**: The application uses Sequelize ORM to interact with the database. The table structure is defined in `backend/src/models/personModel.js`, and all database operations go through the Repository layer.

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env file with your MySQL credentials
# Use your favorite editor or:
code .env

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Open a NEW terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will open automatically in your browser at `http://localhost:3000`

---

## 🔄 How the Application Works

### Data Flow for CRUD Operations

#### CREATE (Add Person)
1. **Frontend**: User fills form → `PersonForm.jsx` component
2. **Frontend**: Form submission → `personService.createPerson()` makes POST request
3. **Backend**: Request hits `POST /api/persons` → `personRoutes.js`
4. **Backend**: Route calls `personController.createPerson()`
5. **Backend**: Controller delegates to `personService.createPerson()` (business logic)
6. **Backend**: Service validates business rules and calls `personRepository.create()`
7. **Backend**: Repository uses Sequelize model to execute `INSERT` query
8. **Database**: MySQL executes the query
9. **Backend**: Returns success/error response through all layers
10. **Frontend**: Updates UI with new person

#### READ (Get All Persons)
1. **Frontend**: Component mounts → `PersonList.jsx` useEffect hook
2. **Frontend**: `personService.getAllPersons()` makes GET request
3. **Backend**: Request hits `GET /api/persons` → `personRoutes.js`
4. **Backend**: Route calls `personController.getAllPersons()`
5. **Backend**: Controller delegates to `personService.getAllPersons()` (business logic)
6. **Backend**: Service calls `personRepository.findAll()` with caching
7. **Backend**: Repository uses Sequelize model to execute `SELECT` query
8. **Database**: MySQL returns the data
9. **Backend**: Data flows back through repository → service → controller
10. **Frontend**: Updates UI with person list
5. **Backend**: Controller calls `personModel.findAll()`
6. **Database**: Model executes `SELECT * FROM persons`
7. **Backend**: Returns array of persons
8. **Frontend**: Renders list of persons

#### UPDATE (Edit Person)
1. **Frontend**: User clicks edit → Loads data into `PersonForm.jsx`
2. **Frontend**: User modifies and submits → `personService.updatePerson(id, data)`
3. **Backend**: Request hits `PUT /api/persons/:id` → `personRoutes.js`
4. **Backend**: Route calls `personController.updatePerson()`
5. **Backend**: Controller validates and calls `personModel.update(id, data)`
6. **Database**: Model executes `UPDATE persons SET ... WHERE id = ?`
7. **Backend**: Returns updated person
8. **Frontend**: Updates UI

#### DELETE (Remove Person)
1. **Frontend**: User clicks delete → Confirmation
2. **Frontend**: `personService.deletePerson(id)` makes DELETE request
3. **Backend**: Request hits `DELETE /api/persons/:id` → `personRoutes.js`
4. **Backend**: Route calls `personController.deletePerson()`
5. **Backend**: Controller calls `personModel.delete(id)`
6. **Database**: Model executes `DELETE FROM persons WHERE id = ?`
7. **Backend**: Returns success confirmation
8. **Frontend**: Removes person from UI

---

## 🎓 Key Concepts Explained

### 3-Tier Architecture Breakdown

#### 1. Presentation Tier (Frontend - React)
**Responsibility**: Display data and handle user interactions

**Files:**
- `components/` - React components that render UI
- `services/personService.js` - API communication layer

**Key Concepts:**
- Components receive user input
- Services make HTTP requests to backend
- State management keeps UI in sync with data
- **No business logic or direct database access**

#### 2. Business Logic Tier (Backend - Controllers & Services)
**Responsibility**: Process requests, apply business rules, coordinate operations

**Files:**
- `controllers/personController.js` - HTTP request handlers
- `services/personService.js` - Business logic and validation
- `di/container.js` - Dependency injection configuration

**Key Concepts:**
- Controllers handle HTTP concerns (status codes, responses)
- Services contain business rules and domain logic
- Dependency injection manages object dependencies
- **No direct database queries**

#### 3. Data Access Tier (Backend - Repositories & Models)
**Responsibility**: Interact with database, execute queries, manage transactions

**Files:**
- `repositories/baseRepository.js` - Generic CRUD operations
- `repositories/personRepository.js` - Person-specific data operations
- `models/personModel.js` - Sequelize model definitions
- `repositories/unitOfWork.js` - Transaction management
- `config/database.js` - Database connection

**Key Concepts:**
- Repository pattern abstracts data access
- Sequelize ORM handles SQL generation
- Unit of Work manages database transactions
- Caching improves performance
- **No business logic or HTTP handling**

### REST API Design

Our API follows REST principles:

- `GET /api/persons` - Get all persons (READ all)
- `GET /api/persons/:id` - Get one person (READ one)
- `POST /api/persons` - Create new person (CREATE)
- `PUT /api/persons/:id` - Update person (UPDATE)
- `DELETE /api/persons/:id` - Delete person (DELETE)

**HTTP Methods:**
- `GET` - Retrieve data (safe, idempotent)
- `POST` - Create new resource
- `PUT` - Update existing resource (idempotent)
- `DELETE` - Remove resource (idempotent)

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

---
## 🏛️ Design Patterns Implemented

### Repository Pattern
**Purpose**: Abstract data access logic and provide a clean interface for database operations.

**Benefits:**
- Decouples business logic from data access
- Enables easy testing with mock repositories
- Provides consistent data access API
- Supports different data sources (SQL, NoSQL, in-memory)

**Implementation:**
- `BaseRepository` - Generic CRUD operations for any Sequelize model
- `PersonRepository` - Person-specific queries and operations
- All database operations go through repositories

### Dependency Injection (DI)
**Purpose**: Manage object dependencies and improve testability and maintainability.

**Benefits:**
- Loose coupling between classes
- Easy unit testing with mocked dependencies
- Centralized dependency configuration
- Better code organization

**Implementation:**
- `Awilix` container manages all dependencies
- Controllers, services, and repositories receive dependencies via constructor injection
- Configuration in `di/container.js`

### Unit of Work Integration (Optional)

The PersonService can optionally use UnitOfWork for transactional operations:

```javascript
// In container.js
container.register({
  unitOfWork: asClass(UnitOfWork).scoped(),
  personService: asClass(PersonService).singleton(),
});

// In PersonService constructor
constructor(personRepository, unitOfWork = null) {
  this.personRepository = personRepository;
  this.unitOfWork = unitOfWork; // Optional
}

// Usage in service methods
if (this.unitOfWork) {
  return await this.unitOfWork.executeInTransaction(async (work) => {
    const repo = work.getRepository('person', PersonRepository);
    // ... transactional operations
  });
}
```

**Benefits:** Atomic operations, consistency guarantees, automatic rollback
**When to use:** Complex multi-entity operations, batch processing, future enhancements

### Service Layer Pattern
**Purpose**: Define an application's boundary and organize business logic.

**Benefits:**
- Centralizes business rules
- Provides clear separation of concerns
- Makes controllers thin and focused on HTTP concerns
- Enables reuse of business logic

**Implementation:**
- `PersonService` contains all person-related business logic
- Validates business rules (not just input validation)
- Orchestrates operations across repositories

### Base Controller Pattern
**Purpose**: Provide common HTTP functionality and error handling.

**Benefits:**
- Reduces code duplication
- Consistent error responses
- Centralized HTTP utilities

**Implementation:**
- `BaseController` with common methods like `executeAction`, `sendSuccess`, `sendError`
- `PersonController` extends `BaseController` for person-specific routes

---
## 🛠️ Development Tips

### Visual Studio Code Setup

1. **Open in VS Code:**
   ```bash
   code person-crud-app
   ```

2. **Recommended Extensions:**
   - ES7+ React/Redux/React-Native snippets
   - ESLint
   - Prettier
   - MySQL (for database management)

3. **Use Split Terminal:**
   - Terminal 1: Backend (`cd backend && npm start`)
   - Terminal 2: Frontend (`cd frontend && npm start`)

### Testing the API with Browser/Tools

- **Browser**: Open `http://localhost:5000/api/persons` to see JSON
- **Thunder Client / Postman**: Test API endpoints directly
- **curl**: Command line testing

Example curl commands:
```bash
# Get all persons
curl http://localhost:5000/api/persons

# Create person
curl -X POST http://localhost:5000/api/persons \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","surname":"User","email":"test@email.com","address":"123 St","phone":"555-1234"}'

# Update person
curl -X PUT http://localhost:5000/api/persons/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated","surname":"Name","email":"updated@email.com","address":"456 Ave","phone":"555-5678"}'

# Delete person
curl -X DELETE http://localhost:5000/api/persons/1
```

---

## 🐛 Common Issues & Solutions

### Backend won't start
- **Check MySQL**: Is MySQL running? Can you connect?
- **Check .env**: Are credentials correct?
- **Check port**: Is port 5000 already in use?

### Frontend won't connect to backend
- **CORS error**: Check if backend has CORS enabled (it does in our code)
- **Wrong URL**: Verify `http://localhost:5000` in personService.js
- **Backend not running**: Start backend first

### Database errors
- **Connection refused**: Start MySQL server
- **Access denied**: Check username/password in .env
- **Table doesn't exist**: Run the CREATE TABLE SQL script

---

## 📖 Learning Path

**Beginner:**
1. Understand the 3-tier architecture and data flow
2. Follow the data flow for one CRUD operation
3. Modify the Person form to add a new field
4. Add client-side form validation
5. Explore the Repository pattern in `baseRepository.js`

**Intermediate:**
6. Implement pagination in the person list
7. Add sorting functionality
8. Create a detailed view for each person
9. Understand Dependency Injection with Awilix
10. Add caching to repository operations

**Advanced:**
11. Add authentication with JWT
12. Implement file upload for profile pictures
13. Add unit tests for services and repositories
14. Implement the Unit of Work pattern for complex transactions
15. Deploy to production (Heroku, Vercel, etc.)

---

## 🎯 Next Steps

After mastering this CRUD:
1. Add more entities (e.g., Company, Project)
2. Create relationships between entities
3. Implement authentication & authorization
4. Add file uploads
5. Implement real-time features with WebSockets
6. Add caching with Redis
7. Create a mobile app with React Native

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Sequelize ORM Documentation](https://sequelize.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Awilix Dependency Injection](https://github.com/jeffijoe/awilix)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Dependency Injection](https://martinfowler.com/articles/injection.html)
- [REST API Best Practices](https://restfulapi.net/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## � Future Enhancement Opportunities

While the current architecture provides an excellent foundation, here are design patterns that could be considered for future enhancements:

### Observer Pattern (Event System)
**When to implement:** When adding notifications, logging, or decoupled business workflows
**Use cases:**
- Send welcome emails after user registration
- Log audit trails for compliance
- Update business metrics asynchronously
- Trigger notifications for business events

**Benefits:** Decoupled event handling, extensible architecture, asynchronous processing

### Strategy Pattern (Validation)
**When to implement:** When validation rules become complex or need to be configurable
**Use cases:**
- Multiple validation strategies (strict, lenient, custom)
- Pluggable validation rules per use case
- Business rule validation vs. input validation separation

**Benefits:** Reusable validation logic, easy rule configuration, separation of concerns

### Decorator Pattern (Cross-cutting Concerns)
**When to implement:** When adding logging, caching, or monitoring across multiple methods
**Use cases:**
- Method-level logging and performance monitoring
- Caching decorators for repository methods
- Authorization checks on service methods

**Benefits:** Clean separation of concerns, DRY principle, easy to add/remove functionality

### CQRS Pattern (Command Query Responsibility Segregation)
**When to implement:** When read and write operations have different requirements
**Use cases:**
- Optimized read models for complex queries
- Different data structures for reading vs. writing
- Event sourcing for audit trails

**Benefits:** Better performance scaling, optimized data models, improved maintainability

### Command Pattern
**When to implement:** For complex business operations that need undo/redo or queuing
**Use cases:**
- Batch operations with rollback capability
- Job queues for background processing
- Complex multi-step business workflows

**Benefits:** Encapsulated operations, undo/redo functionality, better error handling

### Business Rules Organization (Command Pattern)
**When to implement:** When business rules become complex, reusable, or have external dependencies
**Use cases:**
- Complex validation rules with multiple steps or external API calls
- Business rules used across multiple services or operations
- Rules that change frequently or have complex logic
- Rules with side effects (logging, notifications, external integrations)

**Implementation approaches:**
- **Keep in Service:** For simple, service-specific rules (current approach)
- **Extract to Commands:** For complex, reusable, or frequently changing rules

```javascript
// Simple rule - keep in service
if (!data.name || data.name.trim() === '') {
  errors.push('Name is required');
}

// Complex rule - extract to command
class ValidatePersonEligibilityCommand {
  async execute(personData, creditScore, employmentHistory) {
    // Complex logic with external API calls
  }
}
```

**Example folder structure for extracted commands:**
```
services/
├── personService.js              # Main service orchestrator
├── commands/                     # Business rule commands
│   ├── validateEmailUniqueness.js
│   ├── applyBusinessTransformations.js
│   ├── validatePersonEligibility.js
│   ├── checkSystemPersonProtection.js
│   └── validateCreditScore.js
├── handlers/                     # Command handlers/executors
│   ├── emailValidationHandler.js
│   ├── personCreationHandler.js
│   └── creditCheckHandler.js
└── validators/                   # Reusable validation logic
    ├── emailValidator.js
    └── personValidator.js
```

**Decision criteria:**
- Extract if rule > 20-30 lines or has multiple responsibilities
- Extract if rule calls external services or has side effects
- Extract if rule is used in multiple services
- Keep in service if rule is simple and service-specific

**Benefits:** Single responsibility, better testability, improved maintainability

### Current Assessment
The existing patterns (Repository + DI + Service Layer + Unit of Work) provide an excellent foundation. Consider additional patterns only when:
- Business requirements demand them
- Performance or scalability needs arise
- Code complexity justifies the abstraction

---

## �📝 License

This is a learning project. Feel free to use, modify, and share!

---

**Happy Coding! 🚀**
