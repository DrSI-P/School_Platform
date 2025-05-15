"""
Database schema updates for the Collaborative Assessment Tools.

This script adds the necessary tables to support assessment functionality.
"""

import sqlite3
import json
import datetime
import logging
import os
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database path - use absolute path
DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database")
DB_PATH = os.path.join(DB_DIR, "edpsych_connect_dala.db")

logger.info(f"Using database path: {DB_PATH}")

def create_assessment_tables():
    """Create tables for the collaborative assessment tools."""
    # Ensure directory exists
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Create assessments table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS assessments (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            created_by TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            status TEXT NOT NULL,
            time_limit_minutes INTEGER,
            passing_score INTEGER,
            questions TEXT NOT NULL,  -- JSON array of questions
            tags TEXT,  -- JSON array of tags
            learning_objectives TEXT,  -- JSON array of learning objective IDs
            grade_level TEXT,
            subject TEXT,
            is_template INTEGER NOT NULL DEFAULT 0,
            shared_with TEXT  -- JSON array of educator IDs
        )
        ''')
        
        # Create assessment_attempts table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS assessment_attempts (
            id TEXT PRIMARY KEY,
            assessment_id TEXT NOT NULL,
            student_id TEXT NOT NULL,
            started_at TEXT NOT NULL,
            completed_at TEXT,
            status TEXT NOT NULL,
            responses TEXT,  -- JSON array of responses
            total_score REAL,
            percentage_score REAL,
            time_spent_minutes INTEGER,
            graded_by TEXT,
            graded_at TEXT,
            FOREIGN KEY (assessment_id) REFERENCES assessments (id)
        )
        ''')
        
        # Create assessment_analytics table for caching analytics
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS assessment_analytics (
            assessment_id TEXT PRIMARY KEY,
            analytics_data TEXT NOT NULL,  -- JSON object with analytics
            generated_at TEXT NOT NULL,
            FOREIGN KEY (assessment_id) REFERENCES assessments (id)
        )
        ''')
        
        conn.commit()
        logger.info("Assessment tables created successfully")
        
    except Exception as e:
        conn.rollback()
        logger.error(f"Error creating assessment tables: {e}")
        raise
    finally:
        conn.close()

def add_sample_assessment():
    """Add a sample assessment for testing."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if sample assessment already exists
        cursor.execute("SELECT id FROM assessments WHERE id = 'sample_assessment_001'")
        if cursor.fetchone():
            logger.info("Sample assessment already exists")
            return
        
        # Create a sample assessment
        now = datetime.datetime.now().isoformat()
        
        # Sample questions
        questions = [
            {
                "id": "q_001",
                "question_text": "What is the main idea of the story?",
                "question_type": "multiple_choice",
                "options": [
                    {"id": "a", "text": "The importance of friendship"},
                    {"id": "b", "text": "The value of perseverance"},
                    {"id": "c", "text": "The beauty of nature"},
                    {"id": "d", "text": "The power of imagination"}
                ],
                "correct_answer": "b",
                "points": 2,
                "difficulty_level": "medium",
                "tags": ["reading", "comprehension"],
                "learning_objective_id": "LO_ENG_3_1"
            },
            {
                "id": "q_002",
                "question_text": "Write a short paragraph describing your favorite character and why you like them.",
                "question_type": "essay",
                "points": 5,
                "difficulty_level": "medium",
                "tags": ["writing", "character analysis"],
                "learning_objective_id": "LO_ENG_3_2"
            },
            {
                "id": "q_003",
                "question_text": "Match the vocabulary word with its definition.",
                "question_type": "matching",
                "options": [
                    {"id": "1", "text": "Perseverance"},
                    {"id": "2", "text": "Imagination"},
                    {"id": "3", "text": "Courage"},
                    {"id": "4", "text": "Compassion"}
                ],
                "matches": [
                    {"id": "a", "text": "The ability to form pictures in your mind"},
                    {"id": "b", "text": "Feeling concern for others who are suffering"},
                    {"id": "c", "text": "Continuing to try despite difficulties"},
                    {"id": "d", "text": "The ability to face fear or danger"}
                ],
                "correct_answer": {"1": "c", "2": "a", "3": "d", "4": "b"},
                "points": 4,
                "difficulty_level": "easy",
                "tags": ["vocabulary"],
                "learning_objective_id": "LO_ENG_3_3"
            }
        ]
        
        # Insert sample assessment
        cursor.execute('''
        INSERT INTO assessments (
            id, title, description, created_by, created_at, updated_at, status,
            time_limit_minutes, passing_score, questions, tags, learning_objectives,
            grade_level, subject, is_template, shared_with
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            "sample_assessment_001",
            "Reading Comprehension Assessment",
            "A sample assessment for testing reading comprehension skills",
            "educator1@example.com",
            now,
            now,
            "published",
            30,  # 30 minutes time limit
            70,  # 70% passing score
            json.dumps(questions),
            json.dumps(["reading", "comprehension", "vocabulary"]),
            json.dumps(["LO_ENG_3_1", "LO_ENG_3_2", "LO_ENG_3_3"]),
            "Year 3",
            "English",
            0,  # Not a template
            json.dumps(["educator2@example.com"])  # Shared with another educator
        ))
        
        # Add a sample assessment attempt
        cursor.execute('''
        INSERT INTO assessment_attempts (
            id, assessment_id, student_id, started_at, completed_at, status,
            responses, total_score, percentage_score, time_spent_minutes,
            graded_by, graded_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            "attempt_001",
            "sample_assessment_001",
            "test_student_001",
            (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat(),
            datetime.datetime.now().isoformat(),
            "completed",
            json.dumps([
                {
                    "question_id": "q_001",
                    "response": "b",
                    "score": 2.0,
                    "feedback": "Excellent choice! The story clearly emphasizes perseverance."
                },
                {
                    "question_id": "q_002",
                    "response": "I like the main character because they never give up, even when things get difficult. They show that with hard work and determination, you can overcome challenges.",
                    "score": 4.0,
                    "feedback": "Good analysis, but could provide more specific examples from the story."
                },
                {
                    "question_id": "q_003",
                    "response": {"1": "c", "2": "a", "3": "d", "4": "b"},
                    "score": 4.0,
                    "feedback": "Perfect matching!"
                }
            ]),
            10.0,  # Total score
            90.9,  # Percentage score (10/11)
            25,  # Time spent in minutes
            "educator1@example.com",
            datetime.datetime.now().isoformat()
        ))
        
        conn.commit()
        logger.info("Sample assessment and attempt added successfully")
        
    except Exception as e:
        conn.rollback()
        logger.error(f"Error adding sample assessment: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    create_assessment_tables()
    add_sample_assessment()
