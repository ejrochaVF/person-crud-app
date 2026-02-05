# Common Module

This directory contains shared utilities and classes used across the entire application.

## Errors (`errors.js`)

### Overview
The `errors.js` module provides a set of standardized error classes that can be used across all services and controllers. This ensures consistent error handling and HTTP status code mapping throughout the application.

### Error Classes

#### `BusinessError` (Base Class)
Generic business logic error for domain rule violations.

```javascript
throw new BusinessError('Custom business error message', 'ERROR_CODE');
```

#### `ValidationError`
Used for input validation failures and business rule validations.

```javascript
throw new ValidationError('Invalid input data', 'fieldName');
```

#### `NotFoundError`
Used when a requested resource cannot be found.

```javascript
throw new NotFoundError('User', userId); // "User with ID 123 not found"
```

#### `ConflictError`
Used for resource conflicts (duplicates, constraint violations).

```javascript
throw new ConflictError('Email already exists');
```

#### `ForbiddenError`
Used for authorization failures or business rule restrictions.

```javascript
throw new ForbiddenError('Operation not allowed');
```

### Usage in Services

```javascript
const { ValidationError, NotFoundError, ConflictError } = require('../common/errors');

class UserService {
  async createUser(userData) {
    // Validation error
    if (!userData.email) {
      throw new ValidationError('Email is required', 'email');
    }

    // Check for existing user
    const existing = await this.findByEmail(userData.email);
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    // User not found
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }
  }
}
```

### Usage in Controllers

```javascript
const { BusinessError } = require('../common/errors');

class BaseController {
  handleError(error, res) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error instanceof ConflictError) {
      return res.status(409).json({ success: false, message: error.message });
    }
    // ... handle other error types
  }
}
```

### Benefits

1. **Consistency**: Standardized error handling across the application
2. **Type Safety**: Specific error types for different scenarios
3. **HTTP Mapping**: Automatic conversion to appropriate HTTP status codes
4. **Maintainability**: Centralized error definitions
5. **Testing**: Easier to test specific error conditions
6. **Documentation**: Self-documenting error types

### Error Code Conventions

- Use `UPPER_SNAKE_CASE` for error codes
- Prefix with domain when needed: `USER_NOT_FOUND`, `EMAIL_DUPLICATE`
- Keep codes descriptive but concise

### Adding New Error Types

When adding new error types, consider:

1. What HTTP status code should it map to?
2. Is it a specific type of existing error (inherit from appropriate base)?
3. Does it need additional properties (like `field` for ValidationError)?
4. Update the controller error handling to map it to HTTP responses