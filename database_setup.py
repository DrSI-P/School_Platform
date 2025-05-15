"""
Database setup script for EdPsych Connect DALA prototype.
Creates SQLite database and tables if they don't exist.
"""

import os
import sqlite3
import logging
from config import setup_logging, BASE_DIR

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Define the database directory and file
DATABASE_DIR = os.path.join(BASE_DIR, "database")
DATABASE_NAME = "edpsych_connect_dala.db"
DATABASE_PATH = os.path.join(DATABASE_DIR, DATABASE_NAME)

def setup_database():
    """Creates the database directory and tables if they don't exist."""
    # Create database directory if it doesn't exist
    if not os.path.exists(DATABASE_DIR):
        os.makedirs(DATABASE_DIR)
        logger.info(f"Created database directory: {DATABASE_DIR}")
    
    # Connect to database (creates file if it doesn't exist)
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    logger.info(f"Connected to database: {DATABASE_PATH}")
    
    try:
        # Create tables if they don't exist
        
        # Learner Profiles table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS learner_profiles (
            learner_id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            last_updated_at TEXT NOT NULL
        )
        ''')
        
        # Preferences table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS preferences (
            preference_id INTEGER PRIMARY KEY AUTOINCREMENT,
            learner_id TEXT NOT NULL,
            category TEXT NOT NULL,
            value TEXT NOT NULL,
            FOREIGN KEY (learner_id) REFERENCES learner_profiles (learner_id)
        )
        ''')
        
        # Interests table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS interests (
            interest_id INTEGER PRIMARY KEY AUTOINCREMENT,
            learner_id TEXT NOT NULL,
            interest TEXT NOT NULL,
            FOREIGN KEY (learner_id) REFERENCES learner_profiles (learner_id)
        )
        ''')
        
        # Struggles table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS struggles (
            struggle_id INTEGER PRIMARY KEY AUTOINCREMENT,
            learner_id TEXT NOT NULL,
            struggle TEXT NOT NULL,
            FOREIGN KEY (learner_id) REFERENCES learner_profiles (learner_id)
        )
        ''')
        
        # Cognitive Metrics table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS cognitive_metrics (
            metric_id INTEGER PRIMARY KEY AUTOINCREMENT,
            learner_id TEXT NOT NULL,
            task_name TEXT NOT NULL,
            metrics_json TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (learner_id) REFERENCES learner_profiles (learner_id)
        )
        ''')
        
        # Learning Objective Progress table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS learning_objective_progress (
            progress_id INTEGER PRIMARY KEY AUTOINCREMENT,
            learner_id TEXT NOT NULL,
            lo_id TEXT NOT NULL,
            status TEXT NOT NULL,
            started_at TEXT,
            completed_at TEXT,
            details_json TEXT,
            FOREIGN KEY (learner_id) REFERENCES learner_profiles (learner_id)
        )
        ''')
        
        # Badge Records table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS badge_records (
            badge_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
            learner_id TEXT NOT NULL,
            badge_id TEXT NOT NULL,
            badge_name TEXT NOT NULL,
            earned_date TEXT,
            details TEXT,
            FOREIGN KEY (learner_id) REFERENCES learner_profiles (learner_id)
        )
        ''')
        
        # Activity Attempts table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS activity_attempts (
            attempt_id INTEGER PRIMARY KEY AUTOINCREMENT,
            learner_id TEXT NOT NULL,
            lo_id TEXT NOT NULL,
            activity_id TEXT NOT NULL,
            activity_type TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            score REAL,
            completed INTEGER NOT NULL,
            attempt_details_json TEXT,
            FOREIGN KEY (learner_id) REFERENCES learner_profiles (learner_id)
        )
        ''')
        
        # Educator Notes table (NEW)
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS educator_notes (
            note_id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL,
            educator_id TEXT NOT NULL,
            note_text TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            FOREIGN KEY (student_id) REFERENCES learner_profiles (learner_id)
        )
        ''')
        
        conn.commit()
        logger.info("Database tables created successfully")
        
    except sqlite3.Error as e:
        logger.error(f"SQLite error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    setup_database()
    logger.info("Database setup complete")
