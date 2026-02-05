# Service Layer Architecture

## 🏗️ Architecture Overview

This application now follows a **Service Layer Pattern** with clear separation of concerns:

```
📁 backend/src/
├── controllers/     # HTTP Layer - Request/Response handling
├── services/        # Business Logic Layer - Domain rules & workflows
├── repositories/    # Data Access Layer - Database operations
├── models/         # Data Models - Entity definitions
└── routes/         # Routing Layer - URL mappings
```

## 🎯 Layer Responsibilities

### 🖥️ Controllers (HTTP Layer)
**Purpose**: Handle HTTP requests and responses
**Concerns**:
- Parse request data (params, body, query)
- Basic input sanitization
- Format HTTP responses
- HTTP status codes and headers
- Error handling for HTTP context

**What controllers DO**:
```javascript
// ✅ GOOD: HTTP concerns only
const personController = {
  createPerson: async (req, res) => {
    const data = sanitizeInput(req.body);  // Basic sanitization
    const result = await personService.createPerson(data);  // Delegate business logic
    res.status(201).json({ success: true, data: result });  // HTTP response
  }
};
```

**What controllers DON'T do**:
- ❌ Business validation rules
- ❌ Domain logic
- ❌ Database queries
- ❌ Complex calculations

### 🏢 Services (Business Logic Layer)
**Purpose**: Implement business rules and orchestrate operations
**Concerns**:
- Business validation rules
- Domain logic and workflows
- Coordinate multiple repositories
- Business error handling
- Data transformations

**What services DO**:
```javascript
// ✅ GOOD: Business logic
class PersonService {
  async createPerson(data) {
    this.validateBusinessRules(data);        // Business validation
    await this.checkEmailUniqueness(data);   // Business constraints
    const transformed = this.applyBusinessTransformations(data); // Business logic
    return await personRepository.create(transformed); // Data access
  }
}
```

### 🗄️ Repositories (Data Access Layer)
**Purpose**: Abstract database operations
**Concerns**:
- Database queries and operations
- Data mapping and caching
- Transaction management
- Query optimization

## 🔄 Request Flow

```
HTTP Request → Routes → Controller → Service → Repository → Database
                                       ↓
Response ← Controller ← Service ← Repository ← Database
```

### Detailed Flow:
1. **Routes**: Map URL to controller method
2. **Controller**: Parse HTTP request, sanitize input, call service
3. **Service**: Apply business rules, orchestrate operations, handle business errors
4. **Repository**: Execute database operations, handle data access errors
5. **Controller**: Format HTTP response, handle HTTP errors

## 🚨 Error Handling

### Business Errors (Service Layer)
```javascript
class BusinessError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code; // e.g., 'DUPLICATE_EMAIL', 'VALIDATION_ERROR'
  }
}

// Service throws business errors
throw new BusinessError('Email already exists', 'DUPLICATE_EMAIL');
```

### HTTP Error Handling (Controller Layer)
```javascript
const handleBusinessError = (error, res) => {
  if (error instanceof BusinessError) {
    const statusCode = getHttpStatusForBusinessError(error.code);
    return res.status(statusCode).json({
      success: false,
      message: error.message,
      code: error.code
    });
  }
  // Handle technical errors
  res.status(500).json({ success: false, message: 'Internal error' });
};
```

## 📋 Business Rules Examples

### Person Service Business Rules:
- ✅ All fields required for business operations
- ✅ Email must be unique
- ✅ Email format validation
- ✅ Name and surname cannot be identical
- ✅ Temporary email domains blocked
- ✅ Auto-generate display names
- ✅ Phone number normalization
- ✅ System persons cannot be deleted

### Controller HTTP Rules:
- ✅ Parse request parameters
- ✅ Basic input sanitization (trim strings)
- ✅ HTTP status code mapping
- ✅ Response formatting
- ✅ Request validation (ID format, etc.)

## 🧪 Testing Benefits

### Unit Testing:
- **Controllers**: Test HTTP behavior (status codes, response format)
- **Services**: Test business logic in isolation
- **Repositories**: Test data access operations

### Mocking:
- Services can be tested without HTTP concerns
- Controllers can be tested with mocked services
- Repositories can be tested with mocked databases

## 🔄 Migration from Old Architecture

### Before (Mixed Concerns):
```javascript
// Old controller - mixed HTTP + business logic
const createPerson = async (req, res) => {
  const data = req.body;

  // Business validation mixed with HTTP
  if (!data.name) {
    return res.status(400).json({ error: 'Name required' });
  }

  // Business logic mixed with HTTP
  const person = await Person.create(data);
  res.json(person);
};
```

### After (Separated Concerns):
```javascript
// New controller - HTTP only
const createPerson = async (req, res) => {
  try {
    const result = await personService.createPerson(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    handleBusinessError(error, res);
  }
};

// New service - business logic only
async createPerson(data) {
  this.validateBusinessRules(data);
  await this.checkEmailUniqueness(data.email);
  return await personRepository.create(data);
}
```

## 🎯 Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Testability**: Each layer can be tested independently
3. **Maintainability**: Changes to business logic don't affect HTTP handling
4. **Reusability**: Services can be reused across different controllers
5. **Scalability**: Easy to add new features without affecting existing code
6. **Error Handling**: Clear distinction between business and technical errors

## 🚀 Next Steps

- Add more services for different business domains
- Implement service interfaces for dependency injection
- Add middleware for cross-cutting concerns (logging, authentication)
- Consider adding a validation service for complex validation logic
- Add integration tests for the full request flow