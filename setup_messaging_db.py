"""
Database schema updates for the Parent Communication Portal.

This script adds the necessary tables to support the messaging functionality,
including video messaging and conferencing features.
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

def create_messaging_tables():
    """Create tables for the parent communication portal."""
    # Ensure directory exists
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Create messages table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            sender_id TEXT NOT NULL,
            sender_role TEXT NOT NULL,
            recipient_id TEXT NOT NULL,
            recipient_role TEXT NOT NULL,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            created_at TEXT NOT NULL,
            read_at TEXT,
            parent_message_id TEXT,
            is_draft INTEGER NOT NULL DEFAULT 0,
            is_archived INTEGER NOT NULL DEFAULT 0,
            is_flagged INTEGER NOT NULL DEFAULT 0,
            has_video INTEGER NOT NULL DEFAULT 0
        )
        ''')
        
        # Create message_attachments table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS message_attachments (
            id TEXT PRIMARY KEY,
            message_id TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size INTEGER NOT NULL,
            file_path TEXT NOT NULL,
            uploaded_at TEXT NOT NULL,
            is_video INTEGER NOT NULL DEFAULT 0,
            video_duration_seconds INTEGER,
            video_thumbnail_path TEXT,
            FOREIGN KEY (message_id) REFERENCES messages (id)
        )
        ''')
        
        # Create message_folders table for organizing messages
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS message_folders (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            folder_name TEXT NOT NULL,
            created_at TEXT NOT NULL,
            is_system INTEGER NOT NULL DEFAULT 0
        )
        ''')
        
        # Create message_folder_items table for mapping messages to folders
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS message_folder_items (
            id TEXT PRIMARY KEY,
            folder_id TEXT NOT NULL,
            message_id TEXT NOT NULL,
            added_at TEXT NOT NULL,
            FOREIGN KEY (folder_id) REFERENCES message_folders (id),
            FOREIGN KEY (message_id) REFERENCES messages (id)
        )
        ''')
        
        # Create message_templates table for educators to use common templates
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS message_templates (
            id TEXT PRIMARY KEY,
            creator_id TEXT NOT NULL,
            template_name TEXT NOT NULL,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            is_public INTEGER NOT NULL DEFAULT 0
        )
        ''')
        
        # Create notification_preferences table for message notifications
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS notification_preferences (
            user_id TEXT PRIMARY KEY,
            email_notifications INTEGER NOT NULL DEFAULT 1,
            in_app_notifications INTEGER NOT NULL DEFAULT 1,
            digest_frequency TEXT DEFAULT 'daily',
            updated_at TEXT NOT NULL
        )
        ''')
        
        # Create video_conferences table for live video meetings
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS video_conferences (
            id TEXT PRIMARY KEY,
            creator_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            scheduled_start TEXT NOT NULL,
            scheduled_end TEXT NOT NULL,
            actual_start TEXT,
            actual_end TEXT,
            status TEXT NOT NULL DEFAULT 'scheduled',
            conference_url TEXT,
            conference_password TEXT,
            recording_available INTEGER NOT NULL DEFAULT 0,
            recording_path TEXT,
            created_at TEXT NOT NULL
        )
        ''')
        
        # Create video_conference_participants table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS video_conference_participants (
            id TEXT PRIMARY KEY,
            conference_id TEXT NOT NULL,
            participant_id TEXT NOT NULL,
            participant_role TEXT NOT NULL,
            invitation_sent_at TEXT,
            invitation_status TEXT DEFAULT 'pending',
            joined_at TEXT,
            left_at TEXT,
            FOREIGN KEY (conference_id) REFERENCES video_conferences (id)
        )
        ''')
        
        # Create video_resources table for educational video content
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS video_resources (
            id TEXT PRIMARY KEY,
            creator_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            video_path TEXT NOT NULL,
            thumbnail_path TEXT,
            duration_seconds INTEGER,
            file_size INTEGER NOT NULL,
            subject TEXT,
            year_group TEXT,
            tags TEXT,
            learning_objective_ids TEXT,
            created_at TEXT NOT NULL,
            view_count INTEGER NOT NULL DEFAULT 0,
            is_public INTEGER NOT NULL DEFAULT 0
        )
        ''')
        
        # Create video_resource_shares table to track who videos are shared with
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS video_resource_shares (
            id TEXT PRIMARY KEY,
            resource_id TEXT NOT NULL,
            shared_by TEXT NOT NULL,
            shared_with TEXT NOT NULL,
            shared_at TEXT NOT NULL,
            viewed_at TEXT,
            message_id TEXT,
            FOREIGN KEY (resource_id) REFERENCES video_resources (id),
            FOREIGN KEY (message_id) REFERENCES messages (id)
        )
        ''')
        
        conn.commit()
        logger.info("Messaging and video tables created successfully")
        
    except Exception as e:
        conn.rollback()
        logger.error(f"Error creating messaging tables: {e}")
        raise
    finally:
        conn.close()

def add_sample_messages():
    """Add sample messages for testing."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if sample messages already exist
        cursor.execute("SELECT COUNT(*) FROM messages")
        count = cursor.fetchone()[0]
        if count > 0:
            logger.info("Sample messages already exist")
            return
        
        # Create sample system folders for users
        now = datetime.datetime.now().isoformat()
        
        # Sample folders for an educator
        educator_folders = [
            ("folder_edu_inbox", "edu_001", "Inbox", now, 1),
            ("folder_edu_sent", "edu_001", "Sent", now, 1),
            ("folder_edu_drafts", "edu_001", "Drafts", now, 1),
            ("folder_edu_archived", "edu_001", "Archived", now, 1),
            ("folder_edu_important", "edu_001", "Important", now, 0)
        ]
        
        # Sample folders for a parent
        parent_folders = [
            ("folder_parent_inbox", "parent_001", "Inbox", now, 1),
            ("folder_parent_sent", "parent_001", "Sent", now, 1),
            ("folder_parent_drafts", "parent_001", "Drafts", now, 1),
            ("folder_parent_archived", "parent_001", "Archived", now, 1)
        ]
        
        # Insert folders
        cursor.executemany('''
        INSERT INTO message_folders (id, user_id, folder_name, created_at, is_system)
        VALUES (?, ?, ?, ?, ?)
        ''', educator_folders + parent_folders)
        
        # Sample messages
        messages = [
            # Message from educator to parent
            ("msg_001", "edu_001", "educator", "parent_001", "parent", 
             "Student Progress Update", 
             "Dear Parent,\n\nI wanted to update you on your child's recent progress in class. They have been doing very well in mathematics and have shown significant improvement in reading comprehension.\n\nPlease let me know if you have any questions or would like to schedule a meeting to discuss further.\n\nBest regards,\nDr. Eleanor Vance",
             (datetime.datetime.now() - datetime.timedelta(days=5)).isoformat(),
             (datetime.datetime.now() - datetime.timedelta(days=4)).isoformat(),
             None, 0, 0, 0, 0),
            
            # Reply from parent to educator
            ("msg_002", "parent_001", "parent", "edu_001", "educator", 
             "Re: Student Progress Update", 
             "Dear Dr. Vance,\n\nThank you for the update on my child's progress. I'm very pleased to hear about their improvements in mathematics and reading comprehension.\n\nI would appreciate the opportunity to discuss this further. Would you be available for a meeting next Tuesday afternoon?\n\nKind regards,\nMr. Johnson",
             (datetime.datetime.now() - datetime.timedelta(days=3)).isoformat(),
             (datetime.datetime.now() - datetime.timedelta(days=3)).isoformat(),
             "msg_001", 0, 0, 0, 0),
            
            # Follow-up from educator to parent
            ("msg_003", "edu_001", "educator", "parent_001", "parent", 
             "Re: Student Progress Update", 
             "Dear Mr. Johnson,\n\nI would be happy to meet with you next Tuesday. How about 3:30 PM?\n\nI'll prepare some examples of your child's recent work to show you during our meeting.\n\nBest regards,\nDr. Eleanor Vance",
             (datetime.datetime.now() - datetime.timedelta(days=2)).isoformat(),
             None,
             "msg_002", 0, 0, 0, 0),
            
            # New message from educator to parent about upcoming assessment
            ("msg_004", "edu_001", "educator", "parent_001", "parent", 
             "Upcoming Mathematics Assessment", 
             "Dear Parent,\n\nI wanted to inform you that we will be conducting a mathematics assessment next Friday. The assessment will cover the topics we've been studying over the past month, including fractions, decimals, and basic geometry.\n\nTo help your child prepare, I've attached a study guide with practice problems.\n\nPlease ensure your child gets adequate rest before the assessment day.\n\nBest regards,\nDr. Eleanor Vance",
             (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat(),
             None,
             None, 0, 0, 0, 0),
            
            # Draft message from educator
            ("msg_005", "edu_001", "educator", "parent_001", "parent", 
             "Class Field Trip Permission", 
             "Dear Parent,\n\nOur class is planning a field trip to the Science Museum on [DATE]. This trip will complement our current science curriculum and provide hands-on learning experiences.\n\nPlease complete the attached permission form and return it by [DEADLINE].\n\nThe cost of the trip will be [AMOUNT], which covers transportation and admission.\n\nIf you have any questions or concerns, please don't hesitate to contact me.\n\nBest regards,\nDr. Eleanor Vance",
             datetime.datetime.now().isoformat(),
             None,
             None, 1, 0, 0, 0),
             
            # Message with video attachment from educator to parent
            ("msg_006", "edu_001", "educator", "parent_001", "parent", 
             "Video Update: Class Project Presentation", 
             "Dear Parent,\n\nI'm pleased to share a video of your child's recent project presentation in class. They did an excellent job explaining their science experiment and answering questions from their classmates.\n\nThe video demonstrates their growing confidence in public speaking and their understanding of the scientific concepts we've been studying.\n\nBest regards,\nDr. Eleanor Vance",
             (datetime.datetime.now() - datetime.timedelta(hours=12)).isoformat(),
             None,
             None, 0, 0, 0, 1)
        ]
        
        # Insert messages
        cursor.executemany('''
        INSERT INTO messages (
            id, sender_id, sender_role, recipient_id, recipient_role, 
            subject, body, created_at, read_at, parent_message_id,
            is_draft, is_archived, is_flagged, has_video
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', messages)
        
        # Sample message folder items (mapping messages to folders)
        folder_items = [
            ("folder_item_001", "folder_edu_sent", "msg_001", (datetime.datetime.now() - datetime.timedelta(days=5)).isoformat()),
            ("folder_item_002", "folder_parent_inbox", "msg_001", (datetime.datetime.now() - datetime.timedelta(days=5)).isoformat()),
            ("folder_item_003", "folder_parent_sent", "msg_002", (datetime.datetime.now() - datetime.timedelta(days=3)).isoformat()),
            ("folder_item_004", "folder_edu_inbox", "msg_002", (datetime.datetime.now() - datetime.timedelta(days=3)).isoformat()),
            ("folder_item_005", "folder_edu_sent", "msg_003", (datetime.datetime.now() - datetime.timedelta(days=2)).isoformat()),
            ("folder_item_006", "folder_parent_inbox", "msg_003", (datetime.datetime.now() - datetime.timedelta(days=2)).isoformat()),
            ("folder_item_007", "folder_edu_sent", "msg_004", (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat()),
            ("folder_item_008", "folder_parent_inbox", "msg_004", (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat()),
            ("folder_item_009", "folder_edu_drafts", "msg_005", datetime.datetime.now().isoformat()),
            ("folder_item_010", "folder_edu_sent", "msg_006", (datetime.datetime.now() - datetime.timedelta(hours=12)).isoformat()),
            ("folder_item_011", "folder_parent_inbox", "msg_006", (datetime.datetime.now() - datetime.timedelta(hours=12)).isoformat())
        ]
        
        # Insert folder items
        cursor.executemany('''
        INSERT INTO message_folder_items (id, folder_id, message_id, added_at)
        VALUES (?, ?, ?, ?)
        ''', folder_items)
        
        # Sample message attachments
        attachments = [
            # Regular PDF attachment
            ("attachment_001", "msg_004", "Math_Study_Guide.pdf", "application/pdf", 
             256000, "/uploads/attachments/Math_Study_Guide.pdf", 
             (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat(),
             0, None, None),
             
            # Video attachment
            ("attachment_002", "msg_006", "Student_Presentation.mp4", "video/mp4", 
             15000000, "/uploads/videos/Student_Presentation.mp4", 
             (datetime.datetime.now() - datetime.timedelta(hours=12)).isoformat(),
             1, 180, "/uploads/videos/thumbnails/Student_Presentation.jpg")
        ]
        
        # Insert attachments
        cursor.executemany('''
        INSERT INTO message_attachments (
            id, message_id, file_name, file_type, file_size, file_path, uploaded_at,
            is_video, video_duration_seconds, video_thumbnail_path
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', attachments)
        
        # Sample message templates
        templates = [
            ("template_001", "edu_001", "Progress Update", "Student Progress Update", 
             "Dear Parent,\n\nI wanted to update you on your child's recent progress in class. [STUDENT_NAME] has been [PERFORMANCE_DESCRIPTION].\n\n[ADDITIONAL_COMMENTS]\n\nPlease let me know if you have any questions or would like to schedule a meeting to discuss further.\n\nBest regards,\n[EDUCATOR_NAME]",
             (datetime.datetime.now() - datetime.timedelta(days=30)).isoformat(),
             (datetime.datetime.now() - datetime.timedelta(days=30)).isoformat(),
             1),
            
            ("template_002", "edu_001", "Assessment Notification", "Upcoming [SUBJECT] Assessment", 
             "Dear Parent,\n\nI wanted to inform you that we will be conducting a [SUBJECT] assessment on [DATE]. The assessment will cover [TOPICS].\n\n[PREPARATION_INSTRUCTIONS]\n\nPlease ensure your child gets adequate rest before the assessment day.\n\nBest regards,\n[EDUCATOR_NAME]",
             (datetime.datetime.now() - datetime.timedelta(days=25)).isoformat(),
             (datetime.datetime.now() - datetime.timedelta(days=25)).isoformat(),
             1),
            
            ("template_003", "edu_001", "Field Trip Permission", "Class Field Trip to [DESTINATION]", 
             "Dear Parent,\n\nOur class is planning a field trip to [DESTINATION] on [DATE]. This trip will [PURPOSE].\n\nPlease complete the attached permission form and return it by [DEADLINE].\n\nThe cost of the trip will be [AMOUNT], which covers [COST_DETAILS].\n\nIf you have any questions or concerns, please don't hesitate to contact me.\n\nBest regards,\n[EDUCATOR_NAME]",
             (datetime.datetime.now() - datetime.timedelta(days=20)).isoformat(),
             (datetime.datetime.now() - datetime.timedelta(days=20)).isoformat(),
             1),
             
            ("template_004", "edu_001", "Video Update", "Video Update: [SUBJECT]", 
             "Dear Parent,\n\nI'm pleased to share a video of [STUDENT_NAME]'s recent [ACTIVITY] in class. [PERFORMANCE_DESCRIPTION]\n\n[ADDITIONAL_COMMENTS]\n\nBest regards,\n[EDUCATOR_NAME]",
             (datetime.datetime.now() - datetime.timedelta(days=15)).isoformat(),
             (datetime.datetime.now() - datetime.timedelta(days=15)).isoformat(),
             1)
        ]
        
        # Insert templates
        cursor.executemany('''
        INSERT INTO message_templates (
            id, creator_id, template_name, subject, body, created_at, updated_at, is_public
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', templates)
        
        # Sample notification preferences
        notification_prefs = [
            ("edu_001", 1, 1, "daily", datetime.datetime.now().isoformat()),
            ("parent_001", 1, 1, "immediate", datetime.datetime.now().isoformat())
        ]
        
        # Insert notification preferences
        cursor.executemany('''
        INSERT INTO notification_preferences (
            user_id, email_notifications, in_app_notifications, digest_frequency, updated_at
        )
        VALUES (?, ?, ?, ?, ?)
        ''', notification_prefs)
        
        # Sample video conferences
        conferences = [
            ("conf_001", "edu_001", "Parent-Teacher Meeting: Term Progress Review", 
             "Discussion of student's progress this term and areas for improvement", 
             (datetime.datetime.now() + datetime.timedelta(days=3)).isoformat(), 
             (datetime.datetime.now() + datetime.timedelta(days=3, hours=1)).isoformat(),
             None, None, "scheduled", "https://meet.edpsychconnect.com/conf_001", 
             "pass123", 0, None, datetime.datetime.now().isoformat())
        ]
        
        # Insert video conferences
        cursor.executemany('''
        INSERT INTO video_conferences (
            id, creator_id, title, description, scheduled_start, scheduled_end,
            actual_start, actual_end, status, conference_url, conference_password,
            recording_available, recording_path, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', conferences)
        
        # Sample conference participants
        participants = [
            ("part_001", "conf_001", "edu_001", "educator", 
             datetime.datetime.now().isoformat(), "accepted", None, None),
            ("part_002", "conf_001", "parent_001", "parent", 
             datetime.datetime.now().isoformat(), "pending", None, None)
        ]
        
        # Insert conference participants
        cursor.executemany('''
        INSERT INTO video_conference_participants (
            id, conference_id, participant_id, participant_role,
            invitation_sent_at, invitation_status, joined_at, left_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', participants)
        
        # Sample video resources
        resources = [
            ("res_001", "edu_001", "Introduction to Fractions", 
             "A comprehensive introduction to fractions for Year 4 students", 
             "/uploads/resources/videos/intro_to_fractions.mp4",
             "/uploads/resources/thumbnails/intro_to_fractions.jpg",
             720, 45000000, "Mathematics", "Year 4",
             json.dumps(["fractions", "mathematics", "introduction"]),
             json.dumps(["LO_MATH_Y4_FRAC_1", "LO_MATH_Y4_FRAC_2"]),
             (datetime.datetime.now() - datetime.timedelta(days=10)).isoformat(),
             12, 1)
        ]
        
        # Insert video resources
        cursor.executemany('''
        INSERT INTO video_resources (
            id, creator_id, title, description, video_path, thumbnail_path,
            duration_seconds, file_size, subject, year_group, tags,
            learning_objective_ids, created_at, view_count, is_public
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', resources)
        
        # Sample video resource shares
        shares = [
            ("share_001", "res_001", "edu_001", "parent_001", 
             (datetime.datetime.now() - datetime.timedelta(days=5)).isoformat(),
             (datetime.datetime.now() - datetime.timedelta(days=4)).isoformat(),
             "msg_001")
        ]
        
        # Insert video resource shares
        cursor.executemany('''
        INSERT INTO video_resource_shares (
            id, resource_id, shared_by, shared_with, shared_at, viewed_at, message_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', shares)
        
        conn.commit()
        logger.info("Sample messaging and video data added successfully")
        
    except Exception as e:
        conn.rollback()
        logger.error(f"Error adding sample messaging data: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    create_messaging_tables()
    add_sample_messages()
