import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const Admin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New book form state
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    genre: '',
    available_copies: 1,
    total_copies: 1
  });
  
  // Edit book state
  const [editingBook, setEditingBook] = useState(null);
  
  useEffect(() => {
    // Redirect if not admin
    if (currentUser && !currentUser.isAdmin) {
      navigate('/');
    }
    
    if (currentUser && currentUser.isAdmin) {
      fetchData();
    }
  }, [currentUser, navigate, activeTab]);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      if (activeTab === 'books') {
        const response = await axios.get(`${API_URL}/admin/books`, { headers });
        setBooks(response.data);
      } else if (activeTab === 'users') {
        const response = await axios.get(`${API_URL}/admin/users`, { headers });
        setUsers(response.data);
      } else if (activeTab === 'borrows') {
        const response = await axios.get(`${API_URL}/admin/borrows`, { headers });
        setBorrows(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: name === 'available_copies' || name === 'total_copies' 
        ? parseInt(value, 10) 
        : value
    });
  };
  
  const handleCreateBook = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      await axios.post(`${API_URL}/admin/books`, newBook, { headers });
      
      // Reset form and refresh books
      setNewBook({
        title: '',
        author: '',
        genre: '',
        available_copies: 1,
        total_copies: 1
      });
      
      fetchData();
    } catch (error) {
      console.error('Error creating book:', error);
      setError('Failed to create book. Please try again.');
    }
  };
  
  const handleEditBook = (book) => {
    setEditingBook({
      ...book
    });
  };
  
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingBook({
      ...editingBook,
      [name]: name === 'available_copies' || name === 'total_copies' 
        ? parseInt(value, 10) 
        : value
    });
  };
  
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      await axios.put(`${API_URL}/admin/books/${editingBook.id}`, {
        title: editingBook.title,
        author: editingBook.author,
        genre: editingBook.genre,
        available_copies: editingBook.available_copies,
        total_copies: editingBook.total_copies
      }, { headers });
      
      setEditingBook(null);
      fetchData();
    } catch (error) {
      console.error('Error updating book:', error);
      setError('Failed to update book. Please try again.');
    }
  };
  
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      await axios.delete(`${API_URL}/admin/books/${bookId}`, { headers });
      fetchData();
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('Failed to delete book. Please try again.');
    }
  };
  
  const handleToggleAdmin = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      await axios.put(`${API_URL}/admin/users/${userId}/admin`, {}, { headers });
      fetchData();
    } catch (error) {
      console.error('Error toggling admin status:', error);
      setError('Failed to update user. Please try again.');
    }
  };
  
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="text-center py-5">
        <h1 className="h3 mb-3">Admin Access Required</h1>
        <p className="text-muted">You don't have permission to access this page.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="h2 mb-4">Admin Dashboard</h1>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            Manage Books
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'borrows' ? 'active' : ''}`}
            onClick={() => setActiveTab('borrows')}
          >
            View Borrows
          </button>
        </li>
      </ul>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'books' && (
            <div>
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Add New Book</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleCreateBook}>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          name="title"
                          value={newBook.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="author" className="form-label">Author</label>
                        <input
                          type="text"
                          className="form-control"
                          id="author"
                          name="author"
                          value={newBook.author}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="genre" className="form-label">Genre</label>
                        <input
                          type="text"
                          className="form-control"
                          id="genre"
                          name="genre"
                          value={newBook.genre}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="available_copies" className="form-label">Available Copies</label>
                        <input
                          type="number"
                          className="form-control"
                          id="available_copies"
                          name="available_copies"
                          min="0"
                          value={newBook.available_copies}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="total_copies" className="form-label">Total Copies</label>
                        <input
                          type="number"
                          className="form-control"
                          id="total_copies"
                          name="total_copies"
                          min="1"
                          value={newBook.total_copies}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Book</button>
                  </form>
                </div>
              </div>
              
              <h3 className="h5 mb-3">Book List</h3>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Genre</th>
                      <th>Available</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id}>
                        <td>{book.id}</td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre}</td>
                        <td>{book.available_copies}</td>
                        <td>{book.total_copies}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditBook(book)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Edit Book Modal */}
              {editingBook && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Edit Book</h5>
                        <button type="button" className="btn-close" onClick={() => setEditingBook(null)}></button>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={handleUpdateBook}>
                          <div className="mb-3">
                            <label htmlFor="edit-title" className="form-label">Title</label>
                            <input
                              type="text"
                              className="form-control"
                              id="edit-title"
                              name="title"
                              value={editingBook.title}
                              onChange={handleEditInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="edit-author" className="form-label">Author</label>
                            <input
                              type="text"
                              className="form-control"
                              id="edit-author"
                              name="author"
                              value={editingBook.author}
                              onChange={handleEditInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="edit-genre" className="form-label">Genre</label>
                            <input
                              type="text"
                              className="form-control"
                              id="edit-genre"
                              name="genre"
                              value={editingBook.genre}
                              onChange={handleEditInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="edit-available" className="form-label">Available Copies</label>
                            <input
                              type="number"
                              className="form-control"
                              id="edit-available"
                              name="available_copies"
                              min="0"
                              value={editingBook.available_copies}
                              onChange={handleEditInputChange}
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="edit-total" className="form-label">Total Copies</label>
                            <input
                              type="number"
                              className="form-control"
                              id="edit-total"
                              name="total_copies"
                              min="1"
                              value={editingBook.total_copies}
                              onChange={handleEditInputChange}
                              required
                            />
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setEditingBook(null)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save Changes</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'users' && (
            <div>
              <h3 className="h5 mb-3">User List</h3>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Admin</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.is_active ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-danger">Inactive</span>
                          )}
                        </td>
                        <td>
                          {user.is_admin ? (
                            <span className="badge bg-primary">Admin</span>
                          ) : (
                            <span className="badge bg-secondary">User</span>
                          )}
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleToggleAdmin(user.id)}
                          >
                            {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'borrows' && (
            <div>
              <h3 className="h5 mb-3">Borrow Records</h3>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Book</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                      <th>Return Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrows.map(borrow => (
                      <tr key={borrow.id}>
                        <td>{borrow.id}</td>
                        <td>{borrow.user?.username || borrow.user_id}</td>
                        <td>{borrow.book?.title || borrow.book_id}</td>
                        <td>{new Date(borrow.borrow_date).toLocaleDateString()}</td>
                        <td>{new Date(borrow.due_date).toLocaleDateString()}</td>
                        <td>
                          {borrow.return_date 
                            ? new Date(borrow.return_date).toLocaleDateString() 
                            : '-'}
                        </td>
                        <td>
                          {borrow.is_returned ? (
                            <span className="badge bg-success">Returned</span>
                          ) : (
                            <span className="badge bg-warning text-dark">Active</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
