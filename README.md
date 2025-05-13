# Library Management System

A modern library management system built with React and FastAPI. This web application allows users to browse books, borrow and return them, and keep track of their borrowing history.

## Parallel and Distributed Computing Group Assignment

## Assignment Question

Design and implement a client-server system for an online library management system. The system should allow clients to:

1. **Search for books**: By title, author, or genre
2. **Borrow books**: Check availability and borrow books
3. **Return books**: Return borrowed books
4. **View borrowed books**: View list of borrowed books

### Server Requirements
1. **Database Management**: Design and implement a database to store book information and borrowing records.
2. **Client Request Handling**: Handle client requests for searching, borrowing, returning, and viewing books.
3. **Data Validation**: Validate client requests and ensure data consistency.

### Client Requirements
1. **User Interface**: Design a user-friendly interface for clients to interact with the system.
2. **Request Sending**: Send requests to the server for searching, borrowing, returning, and viewing books.
3. **Response Handling**: Handle server responses and display results to the user.

### Deliverables
1. A written report (2-3 pages) describing the system architecture, database design, and client-server implementation.
2. Code implementation of the client-server system (in a language of your choice, e.g., Java, Python).
3. A diagram illustrating the system architecture and data flow.

## Features

- **User Authentication**: Register, login, and logout functionality
- **Book Browsing**: View all available books in the library
- **Search Functionality**: Search for books by title, author, or genre with real-time results as you type
- **Book Borrowing**: Borrow available books with a single click
- **Book Returns**: Return borrowed books when finished
- **Borrowing History**: View your complete borrowing history, including active and returned books
- **Due Dates**: Automatic calculation of due dates (14 days from borrowing)
- **Responsive Design**: Works on desktop and mobile devices
- **Admin Panel**: Manage books, users, and view all borrow records
- **Borrowing Restrictions**: Prevents users from borrowing multiple copies of the same book

## Technologies Used

### Frontend
- **React**: JavaScript library for building the user interface
- **React Router**: For navigation between pages
- **Axios**: For making API requests
- **Bootstrap**: CSS framework for responsive design
- **Bootstrap Icons**: Icon library

### Backend
- **FastAPI**: Modern, fast web framework for building APIs with Python
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation and settings management
- **JWT**: For authentication
- **SQLite**: Database for storing book and user information

## Project Structure

```
library/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # Source code
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── services/       # API service functions
│       ├── context/        # React context for state management
│       └── App.js          # Main application component
│
└── server/                 # FastAPI backend
    ├── app/                # Application code
    │   ├── api/            # API routes
    │   ├── core/           # Core functionality
    │   ├── db/             # Database models and connection
    │   ├── schemas/        # Pydantic schemas
    │   └── main.py         # FastAPI application entry point
    └── requirements.txt    # Backend dependencies
```

## Installation and Setup

### Backend (FastAPI)

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

6. The API will be available at http://localhost:8000

### Frontend (React)

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm start
   ```

4. The application will be available at http://localhost:3000

## API Documentation

Once the backend server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Default User

A default test user is created when the application starts:
- Username: testuser
- Password: password123
- This user has admin privileges

## Admin Users

The system includes an admin panel for managing books, users, and viewing all borrow records. There are several ways to create admin users:

### Option 1: Use the Default Admin User
The default test user (testuser) already has admin privileges. Log in with this user to access the admin panel.

### Option 2: Create an Admin User via API
You can create a new admin user by making a POST request to the `/api/v1/admin/create-admin` endpoint:

```bash
curl -X POST "http://localhost:8000/api/v1/admin/create-admin" \
     -H "Content-Type: application/json" \
     -d '{"username":"newadmin","email":"newadmin@example.com","password":"adminpassword"}'
```

### Option 3: Promote a User to Admin
If you're already logged in as an admin:
1. Go to the admin panel by clicking the "Admin" link in the navigation bar
2. Navigate to the "Manage Users" tab
3. Find the user you want to make an admin
4. Click the "Make Admin" button next to that user

## Admin Panel Features

The admin panel provides the following functionality:

1. **Manage Books**:
   - View all books in the library
   - Add new books
   - Edit existing books
   - Delete books (if they don't have active borrows)

2. **Manage Users**:
   - View all users
   - Toggle admin status for users

3. **View Borrows**:
   - View all borrow records across all users
   - See borrow status, due dates, and return dates

## License

This project is open source and available under the MIT License.

