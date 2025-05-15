"""
Database schema for the Resource Library.

This script adds the necessary tables to support the resource library functionality.
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

def create_resource_library_tables():
    """Create tables for the resource library."""
    # Ensure directory exists
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Create resource_categories table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS resource_categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            parent_category_id TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (parent_category_id) REFERENCES resource_categories (id)
        )
        ''')
        
        # Create resource_tags table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS resource_tags (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at TEXT NOT NULL
        )
        ''')
        
        # Create resources table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS resources (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            content_type TEXT NOT NULL,
            file_path TEXT,
            url TEXT,
            thumbnail_path TEXT,
            creator_id TEXT NOT NULL,
            category_id TEXT,
            year_group TEXT,
            subject TEXT,
            is_public INTEGER NOT NULL DEFAULT 0,
            is_featured INTEGER NOT NULL DEFAULT 0,
            view_count INTEGER NOT NULL DEFAULT 0,
            download_count INTEGER NOT NULL DEFAULT 0,
            rating_sum INTEGER NOT NULL DEFAULT 0,
            rating_count INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (category_id) REFERENCES resource_categories (id)
        )
        ''')
        
        # Create resource_tag_mappings table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS resource_tag_mappings (
            id TEXT PRIMARY KEY,
            resource_id TEXT NOT NULL,
            tag_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (resource_id) REFERENCES resources (id),
            FOREIGN KEY (tag_id) REFERENCES resource_tags (id)
        )
        ''')
        
        # Create resource_metadata table for additional properties
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS resource_metadata (
            id TEXT PRIMARY KEY,
            resource_id TEXT NOT NULL,
            key TEXT NOT NULL,
            value TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (resource_id) REFERENCES resources (id)
        )
        ''')
        
        # Create resource_comments table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS resource_comments (
            id TEXT PRIMARY KEY,
            resource_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            comment TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (resource_id) REFERENCES resources (id)
        )
        ''')
        
        # Create resource_ratings table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS resource_ratings (
            id TEXT PRIMARY KEY,
            resource_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            rating INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (resource_id) REFERENCES resources (id)
        )
        ''')
        
        # Create resource_collections table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS resource_collections (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            creator_id TEXT NOT NULL,
            is_public INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        ''')
        
        # Create resource_collection_items table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS resource_collection_items (
            id TEXT PRIMARY KEY,
            collection_id TEXT NOT NULL,
            resource_id TEXT NOT NULL,
            position INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (collection_id) REFERENCES resource_collections (id),
            FOREIGN KEY (resource_id) REFERENCES resources (id)
        )
        ''')
        
        # Create resource_access_logs table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS resource_access_logs (
            id TEXT PRIMARY KEY,
            resource_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            access_type TEXT NOT NULL,
            accessed_at TEXT NOT NULL,
            FOREIGN KEY (resource_id) REFERENCES resources (id)
        )
        ''')
        
        # Create learning_objectives table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS learning_objectives (
            id TEXT PRIMARY KEY,
            code TEXT NOT NULL,
            description TEXT NOT NULL,
            subject TEXT NOT NULL,
            year_group TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        ''')
        
        # Create resource_learning_objectives table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS resource_learning_objectives (
            id TEXT PRIMARY KEY,
            resource_id TEXT NOT NULL,
            learning_objective_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (resource_id) REFERENCES resources (id),
            FOREIGN KEY (learning_objective_id) REFERENCES learning_objectives (id)
        )
        ''')
        
        conn.commit()
        logger.info("Resource library tables created successfully")
        
    except Exception as e:
        conn.rollback()
        logger.error(f"Error creating resource library tables: {e}")
        raise
    finally:
        conn.close()

def add_sample_resource_data():
    """Add sample data for the resource library."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if sample data already exists
        cursor.execute("SELECT COUNT(*) FROM resource_categories")
        count = cursor.fetchone()[0]
        if count > 0:
            logger.info("Sample resource data already exists")
            return
        
        now = datetime.datetime.now().isoformat()
        
        # Sample resource categories
        categories = [
            ("cat_001", "Mathematics", "Resources for mathematics education", None, now, now),
            ("cat_002", "English", "Resources for English language and literature", None, now, now),
            ("cat_003", "Science", "Resources for science education", None, now, now),
            ("cat_004", "Algebra", "Algebraic concepts and exercises", "cat_001", now, now),
            ("cat_005", "Geometry", "Geometric concepts and exercises", "cat_001", now, now),
            ("cat_006", "Biology", "Biological concepts and exercises", "cat_003", now, now),
            ("cat_007", "Chemistry", "Chemical concepts and exercises", "cat_003", now, now),
            ("cat_008", "Physics", "Physical concepts and exercises", "cat_003", now, now),
            ("cat_009", "Grammar", "Grammar rules and exercises", "cat_002", now, now),
            ("cat_010", "Literature", "Literary analysis and texts", "cat_002", now, now)
        ]
        
        # Insert categories
        cursor.executemany('''
        INSERT INTO resource_categories (id, name, description, parent_category_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', categories)
        
        # Sample resource tags
        tags = [
            ("tag_001", "Fractions", "Resources related to fractions", now),
            ("tag_002", "Equations", "Resources related to equations", now),
            ("tag_003", "Shakespeare", "Resources related to Shakespeare's works", now),
            ("tag_004", "Cells", "Resources related to cell biology", now),
            ("tag_005", "Periodic Table", "Resources related to the periodic table", now),
            ("tag_006", "Forces", "Resources related to forces and motion", now),
            ("tag_007", "Punctuation", "Resources related to punctuation", now),
            ("tag_008", "Poetry", "Resources related to poetry", now),
            ("tag_009", "Interactive", "Interactive resources", now),
            ("tag_010", "Worksheet", "Printable worksheets", now)
        ]
        
        # Insert tags
        cursor.executemany('''
        INSERT INTO resource_tags (id, name, description, created_at)
        VALUES (?, ?, ?, ?)
        ''', tags)
        
        # Sample learning objectives
        learning_objectives = [
            ("lo_001", "MATH-Y4-FRAC-1", "Understand and represent fractions", "Mathematics", "Year 4", now, now),
            ("lo_002", "MATH-Y6-ALG-1", "Solve linear equations", "Mathematics", "Year 6", now, now),
            ("lo_003", "ENG-Y5-GRAM-1", "Use correct punctuation", "English", "Year 5", now, now),
            ("lo_004", "ENG-Y9-LIT-1", "Analyze Shakespeare's plays", "English", "Year 9", now, now),
            ("lo_005", "SCI-Y7-BIO-1", "Understand cell structure and function", "Science", "Year 7", now, now),
            ("lo_006", "SCI-Y8-CHEM-1", "Understand the periodic table", "Science", "Year 8", now, now),
            ("lo_007", "SCI-Y9-PHYS-1", "Understand forces and motion", "Science", "Year 9", now, now)
        ]
        
        # Insert learning objectives
        cursor.executemany('''
        INSERT INTO learning_objectives (id, code, description, subject, year_group, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', learning_objectives)
        
        # Sample resources
        resources = [
            ("res_001", "Introduction to Fractions", "A comprehensive guide to understanding fractions for Year 4 students", 
             "document", "/uploads/resources/intro_to_fractions.pdf", None, "/uploads/thumbnails/intro_to_fractions.jpg",
             "edu_001", "cat_001", "Year 4", "Mathematics", 1, 1, 45, 20, 18, 4, now, now),
            
            ("res_002", "Shakespeare's Romeo and Juliet: Analysis", "An analysis of themes and characters in Romeo and Juliet",
             "document", "/uploads/resources/romeo_and_juliet_analysis.pdf", None, "/uploads/thumbnails/romeo_and_juliet.jpg",
             "edu_001", "cat_010", "Year 9", "English", 1, 0, 30, 15, 12, 3, now, now),
            
            ("res_003", "Cell Structure Interactive", "An interactive exploration of cell structures and functions",
             "interactive", None, "https://example.com/cell-structure", "/uploads/thumbnails/cell_structure.jpg",
             "edu_002", "cat_006", "Year 7", "Science", 1, 0, 60, 0, 24, 6, now, now),
            
            ("res_004", "Solving Linear Equations Worksheet", "Practice worksheet for solving linear equations",
             "worksheet", "/uploads/resources/linear_equations_worksheet.pdf", None, "/uploads/thumbnails/linear_equations.jpg",
             "edu_002", "cat_004", "Year 6", "Mathematics", 1, 0, 25, 18, 16, 4, now, now),
            
            ("res_005", "Punctuation Rules Guide", "Comprehensive guide to English punctuation rules",
             "document", "/uploads/resources/punctuation_rules.pdf", None, "/uploads/thumbnails/punctuation.jpg",
             "edu_003", "cat_009", "Year 5", "English", 1, 0, 35, 22, 20, 5, now, now)
        ]
        
        # Insert resources
        cursor.executemany('''
        INSERT INTO resources (
            id, title, description, content_type, file_path, url, thumbnail_path,
            creator_id, category_id, year_group, subject, is_public, is_featured,
            view_count, download_count, rating_sum, rating_count, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', resources)
        
        # Sample resource tag mappings
        tag_mappings = [
            ("rtm_001", "res_001", "tag_001", now),  # Fractions tag for Intro to Fractions
            ("rtm_002", "res_001", "tag_010", now),  # Worksheet tag for Intro to Fractions
            ("rtm_003", "res_002", "tag_003", now),  # Shakespeare tag for Romeo and Juliet
            ("rtm_004", "res_002", "tag_008", now),  # Poetry tag for Romeo and Juliet
            ("rtm_005", "res_003", "tag_004", now),  # Cells tag for Cell Structure
            ("rtm_006", "res_003", "tag_009", now),  # Interactive tag for Cell Structure
            ("rtm_007", "res_004", "tag_002", now),  # Equations tag for Linear Equations
            ("rtm_008", "res_004", "tag_010", now),  # Worksheet tag for Linear Equations
            ("rtm_009", "res_005", "tag_007", now),  # Punctuation tag for Punctuation Rules
        ]
        
        # Insert tag mappings
        cursor.executemany('''
        INSERT INTO resource_tag_mappings (id, resource_id, tag_id, created_at)
        VALUES (?, ?, ?, ?)
        ''', tag_mappings)
        
        # Sample resource learning objectives
        resource_objectives = [
            ("rlo_001", "res_001", "lo_001", now),  # Fractions objective for Intro to Fractions
            ("rlo_002", "res_002", "lo_004", now),  # Shakespeare objective for Romeo and Juliet
            ("rlo_003", "res_003", "lo_005", now),  # Cell structure objective for Cell Structure
            ("rlo_004", "res_004", "lo_002", now),  # Linear equations objective for Linear Equations
            ("rlo_005", "res_005", "lo_003", now),  # Punctuation objective for Punctuation Rules
        ]
        
        # Insert resource learning objectives
        cursor.executemany('''
        INSERT INTO resource_learning_objectives (id, resource_id, learning_objective_id, created_at)
        VALUES (?, ?, ?, ?)
        ''', resource_objectives)
        
        # Sample resource metadata
        metadata = [
            ("meta_001", "res_001", "page_count", "10", now, now),
            ("meta_002", "res_001", "difficulty", "beginner", now, now),
            ("meta_003", "res_002", "page_count", "15", now, now),
            ("meta_004", "res_002", "difficulty", "intermediate", now, now),
            ("meta_005", "res_003", "duration_minutes", "20", now, now),
            ("meta_006", "res_003", "difficulty", "intermediate", now, now),
            ("meta_007", "res_004", "page_count", "5", now, now),
            ("meta_008", "res_004", "difficulty", "intermediate", now, now),
            ("meta_009", "res_005", "page_count", "12", now, now),
            ("meta_010", "res_005", "difficulty", "beginner", now, now)
        ]
        
        # Insert metadata
        cursor.executemany('''
        INSERT INTO resource_metadata (id, resource_id, key, value, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', metadata)
        
        # Sample resource comments
        comments = [
            ("com_001", "res_001", "edu_002", "Great resource for introducing fractions!", now, now),
            ("com_002", "res_001", "edu_003", "My students found this very helpful.", now, now),
            ("com_003", "res_002", "edu_001", "Excellent analysis of the play's themes.", now, now),
            ("com_004", "res_003", "edu_002", "The interactive elements really engage the students.", now, now),
            ("com_005", "res_004", "edu_003", "Perfect for homework assignments.", now, now)
        ]
        
        # Insert comments
        cursor.executemany('''
        INSERT INTO resource_comments (id, resource_id, user_id, comment, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', comments)
        
        # Sample resource ratings
        ratings = [
            ("rat_001", "res_001", "edu_002", 5, now, now),
            ("rat_002", "res_001", "edu_003", 4, now, now),
            ("rat_003", "res_002", "edu_001", 4, now, now),
            ("rat_004", "res_003", "edu_002", 5, now, now),
            ("rat_005", "res_004", "edu_003", 4, now, now)
        ]
        
        # Insert ratings
        cursor.executemany('''
        INSERT INTO resource_ratings (id, resource_id, user_id, rating, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', ratings)
        
        # Sample resource collections
        collections = [
            ("col_001", "Mathematics Essentials", "Essential resources for teaching mathematics", "edu_001", 1, now, now),
            ("col_002", "English Literature Classics", "Classic literature resources for English classes", "edu_001", 1, now, now),
            ("col_003", "Science Fundamentals", "Fundamental resources for science education", "edu_002", 1, now, now)
        ]
        
        # Insert collections
        cursor.executemany('''
        INSERT INTO resource_collections (id, name, description, creator_id, is_public, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', collections)
        
        # Sample collection items
        collection_items = [
            ("ci_001", "col_001", "res_001", 1, now),  # Fractions in Math Essentials
            ("ci_002", "col_001", "res_004", 2, now),  # Linear Equations in Math Essentials
            ("ci_003", "col_002", "res_002", 1, now),  # Romeo and Juliet in English Classics
            ("ci_004", "col_003", "res_003", 1, now)   # Cell Structure in Science Fundamentals
        ]
        
        # Insert collection items
        cursor.executemany('''
        INSERT INTO resource_collection_items (id, collection_id, resource_id, position, created_at)
        VALUES (?, ?, ?, ?, ?)
        ''', collection_items)
        
        # Sample access logs
        access_logs = [
            ("log_001", "res_001", "edu_002", "view", (datetime.datetime.now() - datetime.timedelta(days=5)).isoformat()),
            ("log_002", "res_001", "edu_003", "download", (datetime.datetime.now() - datetime.timedelta(days=4)).isoformat()),
            ("log_003", "res_002", "edu_001", "view", (datetime.datetime.now() - datetime.timedelta(days=3)).isoformat()),
            ("log_004", "res_003", "edu_002", "view", (datetime.datetime.now() - datetime.timedelta(days=2)).isoformat()),
            ("log_005", "res_004", "edu_003", "download", (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat())
        ]
        
        # Insert access logs
        cursor.executemany('''
        INSERT INTO resource_access_logs (id, resource_id, user_id, access_type, accessed_at)
        VALUES (?, ?, ?, ?, ?)
        ''', access_logs)
        
        conn.commit()
        logger.info("Sample resource data added successfully")
        
    except Exception as e:
        conn.rollback()
        logger.error(f"Error adding sample resource data: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    create_resource_library_tables()
    add_sample_resource_data()
