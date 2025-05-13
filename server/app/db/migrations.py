from sqlalchemy import create_engine, Column, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Import the database connection
from .database import SQLALCHEMY_DATABASE_URL, engine, Base

def run_migrations():
    """Run database migrations"""
    # Create a connection to the database
    conn = engine.connect()
    
    try:
        # Check if is_admin column exists in users table
        result = conn.execute("PRAGMA table_info(users)")
        columns = [row[1] for row in result.fetchall()]
        
        # Add is_admin column if it doesn't exist
        if 'is_admin' not in columns:
            print("Adding is_admin column to users table...")
            conn.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0")
            print("Migration completed successfully.")
        else:
            print("is_admin column already exists in users table.")
    
    except Exception as e:
        print(f"Error during migration: {e}")
    
    finally:
        # Close the connection
        conn.close()
