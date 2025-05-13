# Library Management System: System Architecture and Implementation Report

## 1. Introduction

This report describes the architecture, design, and implementation of an online Library Management System. The system is built using a client-server architecture with React for the frontend and FastAPI for the backend. The system allows users to search for books, borrow and return books, and view their borrowing history.

## 2. System Architecture

The Library Management System follows a modern client-server architecture with a clear separation between the frontend and backend components. This separation allows for better maintainability, scalability, and the potential for multiple client applications to interact with the same backend.

### 2.1 High-Level Architecture

```
┌─────────────────┐      HTTP/JSON      ┌─────────────────┐
│                 │  ◄───────────────►  │                 │
│  React Frontend │                     │ FastAPI Backend │
│  (Client)       │                     │ (Server)        │
│                 │                     │                 │
└─────────────────┘                     └────────┬────────┘
                                                 │
                                                 │ ORM
                                                 ▼
                                        ┌─────────────────┐
                                        │                 │
                                        │  SQLite         │
                                        │  Database       │
                                        │                 │
                                        └─────────────────┘
```

### 2.2 Component Interaction

1. **Client-Server Communication**: The React frontend communicates with the FastAPI backend through RESTful API calls using HTTP and JSON.

2. **Authentication Flow**: JWT (JSON Web Tokens) are used for authentication. When a user logs in, the server generates a token that is stored in the client's local storage and sent with subsequent requests.

3. **Data Flow**: 
   - Client sends requests to the server for operations like searching, borrowing, and returning books
   - Server processes these requests, interacts with the database, and returns responses
   - Client renders the responses in a user-friendly interface

## 3. Database Design

The database is designed to store information about books, users, and borrowing records. SQLAlchemy is used as the ORM (Object-Relational Mapping) tool to interact with the SQLite database.

### 3.1 Entity-Relationship Diagram

```
┌───────────────┐       ┌───────────────────┐       ┌───────────────┐
│     User      │       │   BorrowRecord    │       │     Book      │
├───────────────┤       ├───────────────────┤       ├───────────────┤
│ id            │       │ id                │       │ id            │
│ username      │◄──────┤ user_id           │       │ title         │
│ email         │       │ book_id           ├───────►│ author        │
│ hashed_password│       │ borrow_date       │       │ genre         │
│ is_active     │       │ return_date       │       │ available_copies│
│ is_admin      │       │ is_returned       │       │ total_copies  │
└───────────────┘       └───────────────────┘       └───────────────┘
```

### 3.2 Database Schema

#### User Table
- **id**: Integer, Primary Key
- **username**: String, Unique
- **email**: String, Unique
- **hashed_password**: String
- **is_active**: Boolean
- **is_admin**: Boolean

#### Book Table
- **id**: Integer, Primary Key
- **title**: String
- **author**: String
- **genre**: String
- **available_copies**: Integer
- **total_copies**: Integer

#### BorrowRecord Table
- **id**: Integer, Primary Key
- **user_id**: Integer, Foreign Key to User
- **book_id**: Integer, Foreign Key to Book
- **borrow_date**: DateTime
- **return_date**: DateTime, Nullable
- **is_returned**: Boolean

### 3.3 Relationships

- One User can have many BorrowRecords (One-to-Many)
- One Book can have many BorrowRecords (One-to-Many)
- BorrowRecord connects Users and Books (Many-to-Many through BorrowRecord)

## 4. Backend Implementation

The backend is implemented using FastAPI, a modern, fast web framework for building APIs with Python. It provides automatic validation, serialization, and documentation.

### 4.1 API Endpoints

#### Authentication
- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/token`: Login and get access token

#### Books
- `GET /api/v1/books`: Get all books with optional search query
- `GET /api/v1/books/{book_id}`: Get a specific book
- `POST /api/v1/books`: Create a new book (admin only)

#### Borrowing
- `GET /api/v1/borrow`: Get user's borrowed books
- `POST /api/v1/borrow/borrow/{book_id}`: Borrow a book
- `POST /api/v1/borrow/return/{borrow_id}`: Return a book

#### Admin
- `GET /api/v1/admin/books`: Get all books (admin only)
- `POST /api/v1/admin/books`: Create a new book (admin only)
- `PUT /api/v1/admin/books/{book_id}`: Update a book (admin only)
- `DELETE /api/v1/admin/books/{book_id}`: Delete a book (admin only)
- `GET /api/v1/admin/users`: Get all users (admin only)
- `PUT /api/v1/admin/users/{user_id}/admin`: Toggle admin status (admin only)
- `GET /api/v1/admin/borrows`: Get all borrow records (admin only)
- `POST /api/v1/admin/create-admin`: Create a new admin user

### 4.2 Data Validation

Pydantic is used for data validation, ensuring that all incoming data conforms to the expected schema. This provides:

- Type checking
- Data validation
- Automatic error messages
- Schema documentation

### 4.3 Authentication and Authorization

- JWT tokens are used for authentication
- Middleware checks for valid tokens on protected routes
- Role-based access control for admin functionality

## 5. Frontend Implementation

The frontend is implemented using React, a popular JavaScript library for building user interfaces. It provides a component-based architecture and efficient rendering.

### 5.1 Component Structure

```
App
├── Layout
│   ├── Navigation
│   └── Footer
├── Pages
│   ├── Home
│   ├── Login
│   ├── Register
│   ├── Search
│   ├── BorrowedBooks
│   └── Admin
└── Components
    ├── BookCard
    ├── BookList
    └── BorrowTable
```

### 5.2 State Management

- React Context API is used for global state management (authentication)
- Local component state for UI-specific state
- API services for data fetching and manipulation

### 5.3 User Interface Features

- Responsive design using Bootstrap
- Real-time search with debounce
- Loading indicators for async operations
- Error messages for failed operations
- Form validation for user input

## 6. Key Features Implementation

### 6.1 Search Functionality

The search functionality allows users to search for books by title, author, or genre. The implementation includes:

- Real-time search as the user types
- Debouncing to prevent excessive API calls
- Backend filtering using SQLAlchemy's `or_` and `ilike` operators
- Responsive UI updates with loading states

### 6.2 Book Borrowing

The book borrowing system includes several key features:

- Availability checking before allowing borrows
- Prevention of borrowing multiple copies of the same book
- Automatic updating of available copies
- Error handling for edge cases

### 6.3 Book Returns

The return functionality allows users to return borrowed books:

- Only books borrowed by the current user can be returned
- Automatic updating of return date and status
- Incrementing available copies when a book is returned

### 6.4 Admin Panel

The admin panel provides administrative functionality:

- Book management (CRUD operations)
- User management (view users, toggle admin status)
- Borrow record viewing across all users

## 7. Data Flow

### 7.1 Search Flow

1. User types in the search box
2. Frontend debounces input and sends request to `/api/v1/books?query={query}`
3. Backend filters books based on query
4. Frontend displays results

### 7.2 Borrow Flow

1. User clicks "Borrow" on a book
2. Frontend sends request to `/api/v1/borrow/borrow/{book_id}`
3. Backend checks availability and user's existing borrows
4. Backend creates borrow record and updates book availability
5. Frontend refreshes book list and borrow history

### 7.3 Return Flow

1. User clicks "Return" on a borrowed book
2. Frontend sends request to `/api/v1/borrow/return/{borrow_id}`
3. Backend updates borrow record and book availability
4. Frontend refreshes borrow history

## 8. Security Considerations

The system implements several security measures:

- Password hashing using bcrypt
- JWT authentication with expiration
- Role-based access control
- Input validation using Pydantic
- CORS configuration to prevent unauthorized access

## 9. Conclusion

The Library Management System successfully implements all the required functionality in a modern, maintainable architecture. The separation of concerns between frontend and backend, along with the use of modern frameworks and libraries, provides a solid foundation for future enhancements.

The system meets all the requirements specified in the assignment:
- Search for books by title, author, or genre
- Borrow books with availability checking
- Return borrowed books
- View borrowed books
- Admin functionality for system management

The implementation demonstrates good practices in software development, including:
- Clean architecture with separation of concerns
- Data validation and error handling
- Security considerations
- User experience design
- Documentation
