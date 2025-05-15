# persistence_manager.py
"""
Manages CRUD (Create, Read, Update, Delete) operations for the SQLite database.
Interacts with the database schema defined in database_setup.py and uses
data models from database_models.py.
"""

import sqlite3
import json
import logging
import datetime
from typing import List, Dict, Any, Optional, Tuple
import os

from edpsychconnect_dala_prototype.config import setup_logging, BASE_DIR
from edpsychconnect_dala_prototype.database_models import (
    Student, Educator, Parent, School, LearningObjective, Activity, 
    ActivityAttempt, LearningObjectiveProgress, Badge, StudentBadge,
    EducatorNote, Recommendation, Intervention, Message, MessageAttachment,
    ResourceLibraryItem, Assessment, AssessmentAttempt, AssessmentAnalytics
)

# Setup logging
logger = logging.getLogger(__name__)

# Database connection
DB_PATH = os.path.join(BASE_DIR, "data", "edpsych_connect.db")

class PersistenceManager:
    """
    Manages database operations for the EdPsych Connect platform.
    
    This class provides methods for creating, reading, updating, and deleting
    data in the SQLite database. It serves as the data access layer for all
    components of the platform.
    """
    
    def __init__(self, db_path: str = DB_PATH):
        """
        Initialize the PersistenceManager with a database path.
        
        Args:
            db_path: Path to the SQLite database file
        """
        self.db_path = db_path
        self.logger = logger
        self.logger.info(f"PersistenceManager initialized with database at {db_path}")
        
        # Ensure the data directory exists
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    def _get_connection(self) -> sqlite3.Connection:
        """
        Get a connection to the SQLite database.
        
        Returns:
            SQLite connection object
        """
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def _execute_query(self, query: str, params: Tuple = None) -> List[Dict[str, Any]]:
        """
        Execute a SQL query and return the results as a list of dictionaries.
        
        Args:
            query: SQL query to execute
            params: Parameters for the query
            
        Returns:
            List of dictionaries representing the query results
        """
        conn = self._get_connection()
        try:
            cursor = conn.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            results = [dict(row) for row in cursor.fetchall()]
            conn.commit()
            return results
        except Exception as e:
            self.logger.error(f"Error executing query: {e}")
            conn.rollback()
            raise
        finally:
            conn.close()
    
    def _execute_insert(self, query: str, params: Tuple) -> Optional[int]:
        """
        Execute an INSERT query and return the ID of the inserted row.
        
        Args:
            query: SQL query to execute
            params: Parameters for the query
            
        Returns:
            ID of the inserted row, or None if the insert failed
        """
        conn = self._get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor.lastrowid
        except Exception as e:
            self.logger.error(f"Error executing insert: {e}")
            conn.rollback()
            return None
        finally:
            conn.close()
    
    def _execute_update(self, query: str, params: Tuple) -> bool:
        """
        Execute an UPDATE query and return whether it was successful.
        
        Args:
            query: SQL query to execute
            params: Parameters for the query
            
        Returns:
            True if the update was successful, False otherwise
        """
        conn = self._get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor.rowcount > 0
        except Exception as e:
            self.logger.error(f"Error executing update: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()
    
    def _execute_delete(self, query: str, params: Tuple) -> bool:
        """
        Execute a DELETE query and return whether it was successful.
        
        Args:
            query: SQL query to execute
            params: Parameters for the query
            
        Returns:
            True if the delete was successful, False otherwise
        """
        conn = self._get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor.rowcount > 0
        except Exception as e:
            self.logger.error(f"Error executing delete: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()
    
    # Student methods
    
    def get_student(self, student_id: str) -> Optional[Student]:
        """
        Get a student by ID.
        
        Args:
            student_id: ID of the student
            
        Returns:
            Student object if found, None otherwise
        """
        query = "SELECT * FROM students WHERE id = ?"
        results = self._execute_query(query, (student_id,))
        
        if not results:
            return None
        
        student_data = results[0]
        
        # Convert JSON strings to Python objects
        if student_data.get("preferences"):
            student_data["preferences"] = json.loads(student_data["preferences"])
        if student_data.get("learning_style"):
            student_data["learning_style"] = json.loads(student_data["learning_style"])
        if student_data.get("interests"):
            student_data["interests"] = json.loads(student_data["interests"])
        
        return Student(**student_data)
    
    def get_students(self, class_id: Optional[str] = None) -> List[Student]:
        """
        Get all students, optionally filtered by class.
        
        Args:
            class_id: Optional ID of the class to filter by
            
        Returns:
            List of Student objects
        """
        if class_id:
            query = """
                SELECT s.* FROM students s
                JOIN class_students cs ON s.id = cs.student_id
                WHERE cs.class_id = ?
            """
            results = self._execute_query(query, (class_id,))
        else:
            query = "SELECT * FROM students"
            results = self._execute_query(query)
        
        students = []
        for student_data in results:
            # Convert JSON strings to Python objects
            if student_data.get("preferences"):
                student_data["preferences"] = json.loads(student_data["preferences"])
            if student_data.get("learning_style"):
                student_data["learning_style"] = json.loads(student_data["learning_style"])
            if student_data.get("interests"):
                student_data["interests"] = json.loads(student_data["interests"])
            
            students.append(Student(**student_data))
        
        return students
    
    def create_student(self, student_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new student.
        
        Args:
            student_data: Dictionary containing student details
            
        Returns:
            ID of the created student, or None if creation failed
        """
        # Convert Python objects to JSON strings
        if "preferences" in student_data and isinstance(student_data["preferences"], dict):
            student_data["preferences"] = json.dumps(student_data["preferences"])
        if "learning_style" in student_data and isinstance(student_data["learning_style"], dict):
            student_data["learning_style"] = json.dumps(student_data["learning_style"])
        if "interests" in student_data and isinstance(student_data["interests"], list):
            student_data["interests"] = json.dumps(student_data["interests"])
        
        # Generate a unique ID if not provided
        if "id" not in student_data:
            student_data["id"] = f"student_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Prepare the query
        columns = ", ".join(student_data.keys())
        placeholders = ", ".join(["?"] * len(student_data))
        query = f"INSERT INTO students ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(student_data.values()))
        
        return student_data["id"]
    
    def update_student(self, student_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing student.
        
        Args:
            student_id: ID of the student to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Convert Python objects to JSON strings
        if "preferences" in updates and isinstance(updates["preferences"], dict):
            updates["preferences"] = json.dumps(updates["preferences"])
        if "learning_style" in updates and isinstance(updates["learning_style"], dict):
            updates["learning_style"] = json.dumps(updates["learning_style"])
        if "interests" in updates and isinstance(updates["interests"], list):
            updates["interests"] = json.dumps(updates["interests"])
        
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE students SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (student_id,)
        return self._execute_update(query, params)
    
    def delete_student(self, student_id: str) -> bool:
        """
        Delete a student.
        
        Args:
            student_id: ID of the student to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM students WHERE id = ?"
        return self._execute_delete(query, (student_id,))
    
    # Educator methods
    
    def get_educator(self, educator_id: str) -> Optional[Educator]:
        """
        Get an educator by ID.
        
        Args:
            educator_id: ID of the educator
            
        Returns:
            Educator object if found, None otherwise
        """
        query = "SELECT * FROM educators WHERE id = ?"
        results = self._execute_query(query, (educator_id,))
        
        if not results:
            return None
        
        educator_data = results[0]
        
        # Convert JSON strings to Python objects
        if educator_data.get("subjects"):
            educator_data["subjects"] = json.loads(educator_data["subjects"])
        if educator_data.get("qualifications"):
            educator_data["qualifications"] = json.loads(educator_data["qualifications"])
        
        return Educator(**educator_data)
    
    def get_educators(self, school_id: Optional[str] = None) -> List[Educator]:
        """
        Get all educators, optionally filtered by school.
        
        Args:
            school_id: Optional ID of the school to filter by
            
        Returns:
            List of Educator objects
        """
        if school_id:
            query = "SELECT * FROM educators WHERE school_id = ?"
            results = self._execute_query(query, (school_id,))
        else:
            query = "SELECT * FROM educators"
            results = self._execute_query(query)
        
        educators = []
        for educator_data in results:
            # Convert JSON strings to Python objects
            if educator_data.get("subjects"):
                educator_data["subjects"] = json.loads(educator_data["subjects"])
            if educator_data.get("qualifications"):
                educator_data["qualifications"] = json.loads(educator_data["qualifications"])
            
            educators.append(Educator(**educator_data))
        
        return educators
    
    def create_educator(self, educator_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new educator.
        
        Args:
            educator_data: Dictionary containing educator details
            
        Returns:
            ID of the created educator, or None if creation failed
        """
        # Convert Python objects to JSON strings
        if "subjects" in educator_data and isinstance(educator_data["subjects"], list):
            educator_data["subjects"] = json.dumps(educator_data["subjects"])
        if "qualifications" in educator_data and isinstance(educator_data["qualifications"], list):
            educator_data["qualifications"] = json.dumps(educator_data["qualifications"])
        
        # Generate a unique ID if not provided
        if "id" not in educator_data:
            educator_data["id"] = f"educator_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Prepare the query
        columns = ", ".join(educator_data.keys())
        placeholders = ", ".join(["?"] * len(educator_data))
        query = f"INSERT INTO educators ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(educator_data.values()))
        
        return educator_data["id"]
    
    def update_educator(self, educator_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing educator.
        
        Args:
            educator_id: ID of the educator to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Convert Python objects to JSON strings
        if "subjects" in updates and isinstance(updates["subjects"], list):
            updates["subjects"] = json.dumps(updates["subjects"])
        if "qualifications" in updates and isinstance(updates["qualifications"], list):
            updates["qualifications"] = json.dumps(updates["qualifications"])
        
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE educators SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (educator_id,)
        return self._execute_update(query, params)
    
    def delete_educator(self, educator_id: str) -> bool:
        """
        Delete an educator.
        
        Args:
            educator_id: ID of the educator to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM educators WHERE id = ?"
        return self._execute_delete(query, (educator_id,))
    
    # Class methods
    
    def get_class(self, class_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a class by ID.
        
        Args:
            class_id: ID of the class
            
        Returns:
            Dictionary containing class details if found, None otherwise
        """
        query = "SELECT * FROM classes WHERE id = ?"
        results = self._execute_query(query, (class_id,))
        
        if not results:
            return None
        
        return results[0]
    
    def get_classes(self, educator_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get all classes, optionally filtered by educator.
        
        Args:
            educator_id: Optional ID of the educator to filter by
            
        Returns:
            List of dictionaries containing class details
        """
        if educator_id:
            query = "SELECT * FROM classes WHERE educator_id = ?"
            results = self._execute_query(query, (educator_id,))
        else:
            query = "SELECT * FROM classes"
            results = self._execute_query(query)
        
        return results
    
    def create_class(self, class_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new class.
        
        Args:
            class_data: Dictionary containing class details
            
        Returns:
            ID of the created class, or None if creation failed
        """
        # Generate a unique ID if not provided
        if "id" not in class_data:
            class_data["id"] = f"class_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Prepare the query
        columns = ", ".join(class_data.keys())
        placeholders = ", ".join(["?"] * len(class_data))
        query = f"INSERT INTO classes ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(class_data.values()))
        
        return class_data["id"]
    
    def update_class(self, class_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing class.
        
        Args:
            class_id: ID of the class to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE classes SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (class_id,)
        return self._execute_update(query, params)
    
    def delete_class(self, class_id: str) -> bool:
        """
        Delete a class.
        
        Args:
            class_id: ID of the class to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM classes WHERE id = ?"
        return self._execute_delete(query, (class_id,))
    
    def add_student_to_class(self, class_id: str, student_id: str) -> bool:
        """
        Add a student to a class.
        
        Args:
            class_id: ID of the class
            student_id: ID of the student
            
        Returns:
            True if the addition was successful, False otherwise
        """
        query = "INSERT INTO class_students (class_id, student_id) VALUES (?, ?)"
        return self._execute_insert(query, (class_id, student_id)) is not None
    
    def remove_student_from_class(self, class_id: str, student_id: str) -> bool:
        """
        Remove a student from a class.
        
        Args:
            class_id: ID of the class
            student_id: ID of the student
            
        Returns:
            True if the removal was successful, False otherwise
        """
        query = "DELETE FROM class_students WHERE class_id = ? AND student_id = ?"
        return self._execute_delete(query, (class_id, student_id))
    
    def get_students_in_class(self, class_id: str) -> List[Student]:
        """
        Get all students in a class.
        
        Args:
            class_id: ID of the class
            
        Returns:
            List of Student objects
        """
        return self.get_students(class_id)
    
    # Learning objective methods
    
    def get_learning_objective(self, objective_id: str) -> Optional[LearningObjective]:
        """
        Get a learning objective by ID.
        
        Args:
            objective_id: ID of the learning objective
            
        Returns:
            LearningObjective object if found, None otherwise
        """
        query = "SELECT * FROM learning_objectives WHERE id = ?"
        results = self._execute_query(query, (objective_id,))
        
        if not results:
            return None
        
        return LearningObjective(**results[0])
    
    def get_learning_objectives(self, subject: Optional[str] = None, grade_level: Optional[str] = None) -> List[LearningObjective]:
        """
        Get all learning objectives, optionally filtered by subject and grade level.
        
        Args:
            subject: Optional subject to filter by
            grade_level: Optional grade level to filter by
            
        Returns:
            List of LearningObjective objects
        """
        if subject and grade_level:
            query = "SELECT * FROM learning_objectives WHERE subject = ? AND grade_level = ?"
            results = self._execute_query(query, (subject, grade_level))
        elif subject:
            query = "SELECT * FROM learning_objectives WHERE subject = ?"
            results = self._execute_query(query, (subject,))
        elif grade_level:
            query = "SELECT * FROM learning_objectives WHERE grade_level = ?"
            results = self._execute_query(query, (grade_level,))
        else:
            query = "SELECT * FROM learning_objectives"
            results = self._execute_query(query)
        
        return [LearningObjective(**result) for result in results]
    
    def create_learning_objective(self, objective_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new learning objective.
        
        Args:
            objective_data: Dictionary containing learning objective details
            
        Returns:
            ID of the created learning objective, or None if creation failed
        """
        # Generate a unique ID if not provided
        if "id" not in objective_data:
            objective_data["id"] = f"obj_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Prepare the query
        columns = ", ".join(objective_data.keys())
        placeholders = ", ".join(["?"] * len(objective_data))
        query = f"INSERT INTO learning_objectives ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(objective_data.values()))
        
        return objective_data["id"]
    
    def update_learning_objective(self, objective_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing learning objective.
        
        Args:
            objective_id: ID of the learning objective to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE learning_objectives SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (objective_id,)
        return self._execute_update(query, params)
    
    def delete_learning_objective(self, objective_id: str) -> bool:
        """
        Delete a learning objective.
        
        Args:
            objective_id: ID of the learning objective to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM learning_objectives WHERE id = ?"
        return self._execute_delete(query, (objective_id,))
    
    # Activity methods
    
    def get_activity(self, activity_id: str) -> Optional[Activity]:
        """
        Get an activity by ID.
        
        Args:
            activity_id: ID of the activity
            
        Returns:
            Activity object if found, None otherwise
        """
        query = "SELECT * FROM activities WHERE id = ?"
        results = self._execute_query(query, (activity_id,))
        
        if not results:
            return None
        
        activity_data = results[0]
        
        # Convert JSON strings to Python objects
        if activity_data.get("content"):
            activity_data["content"] = json.loads(activity_data["content"])
        if activity_data.get("metadata"):
            activity_data["metadata"] = json.loads(activity_data["metadata"])
        
        return Activity(**activity_data)
    
    def get_activities(self, objective_id: Optional[str] = None, subject: Optional[str] = None) -> List[Activity]:
        """
        Get all activities, optionally filtered by learning objective or subject.
        
        Args:
            objective_id: Optional ID of the learning objective to filter by
            subject: Optional subject to filter by
            
        Returns:
            List of Activity objects
        """
        if objective_id:
            query = "SELECT * FROM activities WHERE objective_id = ?"
            results = self._execute_query(query, (objective_id,))
        elif subject:
            query = "SELECT * FROM activities WHERE subject = ?"
            results = self._execute_query(query, (subject,))
        else:
            query = "SELECT * FROM activities"
            results = self._execute_query(query)
        
        activities = []
        for activity_data in results:
            # Convert JSON strings to Python objects
            if activity_data.get("content"):
                activity_data["content"] = json.loads(activity_data["content"])
            if activity_data.get("metadata"):
                activity_data["metadata"] = json.loads(activity_data["metadata"])
            
            activities.append(Activity(**activity_data))
        
        return activities
    
    def create_activity(self, activity_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new activity.
        
        Args:
            activity_data: Dictionary containing activity details
            
        Returns:
            ID of the created activity, or None if creation failed
        """
        # Convert Python objects to JSON strings
        if "content" in activity_data and isinstance(activity_data["content"], dict):
            activity_data["content"] = json.dumps(activity_data["content"])
        if "metadata" in activity_data and isinstance(activity_data["metadata"], dict):
            activity_data["metadata"] = json.dumps(activity_data["metadata"])
        
        # Generate a unique ID if not provided
        if "id" not in activity_data:
            activity_data["id"] = f"activity_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Prepare the query
        columns = ", ".join(activity_data.keys())
        placeholders = ", ".join(["?"] * len(activity_data))
        query = f"INSERT INTO activities ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(activity_data.values()))
        
        return activity_data["id"]
    
    def update_activity(self, activity_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing activity.
        
        Args:
            activity_id: ID of the activity to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Convert Python objects to JSON strings
        if "content" in updates and isinstance(updates["content"], dict):
            updates["content"] = json.dumps(updates["content"])
        if "metadata" in updates and isinstance(updates["metadata"], dict):
            updates["metadata"] = json.dumps(updates["metadata"])
        
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE activities SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (activity_id,)
        return self._execute_update(query, params)
    
    def delete_activity(self, activity_id: str) -> bool:
        """
        Delete an activity.
        
        Args:
            activity_id: ID of the activity to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM activities WHERE id = ?"
        return self._execute_delete(query, (activity_id,))
    
    # Activity attempt methods
    
    def get_activity_attempt(self, attempt_id: str) -> Optional[ActivityAttempt]:
        """
        Get an activity attempt by ID.
        
        Args:
            attempt_id: ID of the activity attempt
            
        Returns:
            ActivityAttempt object if found, None otherwise
        """
        query = "SELECT * FROM activity_attempts WHERE id = ?"
        results = self._execute_query(query, (attempt_id,))
        
        if not results:
            return None
        
        attempt_data = results[0]
        
        # Convert JSON strings to Python objects
        if attempt_data.get("responses"):
            attempt_data["responses"] = json.loads(attempt_data["responses"])
        if attempt_data.get("feedback"):
            attempt_data["feedback"] = json.loads(attempt_data["feedback"])
        
        return ActivityAttempt(**attempt_data)
    
    def get_activity_attempts(self, student_id: Optional[str] = None, activity_id: Optional[str] = None) -> List[ActivityAttempt]:
        """
        Get all activity attempts, optionally filtered by student or activity.
        
        Args:
            student_id: Optional ID of the student to filter by
            activity_id: Optional ID of the activity to filter by
            
        Returns:
            List of ActivityAttempt objects
        """
        if student_id and activity_id:
            query = "SELECT * FROM activity_attempts WHERE student_id = ? AND activity_id = ?"
            results = self._execute_query(query, (student_id, activity_id))
        elif student_id:
            query = "SELECT * FROM activity_attempts WHERE student_id = ?"
            results = self._execute_query(query, (student_id,))
        elif activity_id:
            query = "SELECT * FROM activity_attempts WHERE activity_id = ?"
            results = self._execute_query(query, (activity_id,))
        else:
            query = "SELECT * FROM activity_attempts"
            results = self._execute_query(query)
        
        attempts = []
        for attempt_data in results:
            # Convert JSON strings to Python objects
            if attempt_data.get("responses"):
                attempt_data["responses"] = json.loads(attempt_data["responses"])
            if attempt_data.get("feedback"):
                attempt_data["feedback"] = json.loads(attempt_data["feedback"])
            
            attempts.append(ActivityAttempt(**attempt_data))
        
        return attempts
    
    def create_activity_attempt(self, attempt_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new activity attempt.
        
        Args:
            attempt_data: Dictionary containing activity attempt details
            
        Returns:
            ID of the created activity attempt, or None if creation failed
        """
        # Convert Python objects to JSON strings
        if "responses" in attempt_data and isinstance(attempt_data["responses"], (dict, list)):
            attempt_data["responses"] = json.dumps(attempt_data["responses"])
        if "feedback" in attempt_data and isinstance(attempt_data["feedback"], dict):
            attempt_data["feedback"] = json.dumps(attempt_data["feedback"])
        
        # Generate a unique ID if not provided
        if "id" not in attempt_data:
            attempt_data["id"] = f"attempt_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Set timestamps if not provided
        if "started_at" not in attempt_data:
            attempt_data["started_at"] = datetime.datetime.now().isoformat()
        
        # Prepare the query
        columns = ", ".join(attempt_data.keys())
        placeholders = ", ".join(["?"] * len(attempt_data))
        query = f"INSERT INTO activity_attempts ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(attempt_data.values()))
        
        return attempt_data["id"]
    
    def update_activity_attempt(self, attempt_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing activity attempt.
        
        Args:
            attempt_id: ID of the activity attempt to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Convert Python objects to JSON strings
        if "responses" in updates and isinstance(updates["responses"], (dict, list)):
            updates["responses"] = json.dumps(updates["responses"])
        if "feedback" in updates and isinstance(updates["feedback"], dict):
            updates["feedback"] = json.dumps(updates["feedback"])
        
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE activity_attempts SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (attempt_id,)
        return self._execute_update(query, params)
    
    def delete_activity_attempt(self, attempt_id: str) -> bool:
        """
        Delete an activity attempt.
        
        Args:
            attempt_id: ID of the activity attempt to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM activity_attempts WHERE id = ?"
        return self._execute_delete(query, (attempt_id,))
    
    # Learning objective progress methods
    
    def get_learning_objective_progress(self, student_id: str, objective_id: str) -> Optional[LearningObjectiveProgress]:
        """
        Get a student's progress on a learning objective.
        
        Args:
            student_id: ID of the student
            objective_id: ID of the learning objective
            
        Returns:
            LearningObjectiveProgress object if found, None otherwise
        """
        query = "SELECT * FROM learning_objective_progress WHERE student_id = ? AND objective_id = ?"
        results = self._execute_query(query, (student_id, objective_id))
        
        if not results:
            return None
        
        return LearningObjectiveProgress(**results[0])
    
    def get_student_progress(self, student_id: str) -> List[LearningObjectiveProgress]:
        """
        Get a student's progress on all learning objectives.
        
        Args:
            student_id: ID of the student
            
        Returns:
            List of LearningObjectiveProgress objects
        """
        query = "SELECT * FROM learning_objective_progress WHERE student_id = ?"
        results = self._execute_query(query, (student_id,))
        
        return [LearningObjectiveProgress(**result) for result in results]
    
    def create_learning_objective_progress(self, progress_data: Dict[str, Any]) -> bool:
        """
        Create a new learning objective progress record.
        
        Args:
            progress_data: Dictionary containing progress details
            
        Returns:
            True if the creation was successful, False otherwise
        """
        # Prepare the query
        columns = ", ".join(progress_data.keys())
        placeholders = ", ".join(["?"] * len(progress_data))
        query = f"INSERT INTO learning_objective_progress ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        return self._execute_insert(query, tuple(progress_data.values())) is not None
    
    def update_learning_objective_progress(self, student_id: str, objective_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing learning objective progress record.
        
        Args:
            student_id: ID of the student
            objective_id: ID of the learning objective
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE learning_objective_progress SET {set_clause} WHERE student_id = ? AND objective_id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (student_id, objective_id)
        return self._execute_update(query, params)
    
    def delete_learning_objective_progress(self, student_id: str, objective_id: str) -> bool:
        """
        Delete a learning objective progress record.
        
        Args:
            student_id: ID of the student
            objective_id: ID of the learning objective
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM learning_objective_progress WHERE student_id = ? AND objective_id = ?"
        return self._execute_delete(query, (student_id, objective_id))
    
    # Badge methods
    
    def get_badge(self, badge_id: str) -> Optional[Badge]:
        """
        Get a badge by ID.
        
        Args:
            badge_id: ID of the badge
            
        Returns:
            Badge object if found, None otherwise
        """
        query = "SELECT * FROM badges WHERE id = ?"
        results = self._execute_query(query, (badge_id,))
        
        if not results:
            return None
        
        return Badge(**results[0])
    
    def get_badges(self, category: Optional[str] = None) -> List[Badge]:
        """
        Get all badges, optionally filtered by category.
        
        Args:
            category: Optional category to filter by
            
        Returns:
            List of Badge objects
        """
        if category:
            query = "SELECT * FROM badges WHERE category = ?"
            results = self._execute_query(query, (category,))
        else:
            query = "SELECT * FROM badges"
            results = self._execute_query(query)
        
        return [Badge(**result) for result in results]
    
    def create_badge(self, badge_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new badge.
        
        Args:
            badge_data: Dictionary containing badge details
            
        Returns:
            ID of the created badge, or None if creation failed
        """
        # Generate a unique ID if not provided
        if "id" not in badge_data:
            badge_data["id"] = f"badge_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Prepare the query
        columns = ", ".join(badge_data.keys())
        placeholders = ", ".join(["?"] * len(badge_data))
        query = f"INSERT INTO badges ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(badge_data.values()))
        
        return badge_data["id"]
    
    def update_badge(self, badge_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing badge.
        
        Args:
            badge_id: ID of the badge to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE badges SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (badge_id,)
        return self._execute_update(query, params)
    
    def delete_badge(self, badge_id: str) -> bool:
        """
        Delete a badge.
        
        Args:
            badge_id: ID of the badge to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM badges WHERE id = ?"
        return self._execute_delete(query, (badge_id,))
    
    # Student badge methods
    
    def get_student_badge(self, student_id: str, badge_id: str) -> Optional[StudentBadge]:
        """
        Get a student's badge.
        
        Args:
            student_id: ID of the student
            badge_id: ID of the badge
            
        Returns:
            StudentBadge object if found, None otherwise
        """
        query = "SELECT * FROM student_badges WHERE student_id = ? AND badge_id = ?"
        results = self._execute_query(query, (student_id, badge_id))
        
        if not results:
            return None
        
        return StudentBadge(**results[0])
    
    def get_student_badges(self, student_id: str) -> List[StudentBadge]:
        """
        Get all badges earned by a student.
        
        Args:
            student_id: ID of the student
            
        Returns:
            List of StudentBadge objects
        """
        query = "SELECT * FROM student_badges WHERE student_id = ?"
        results = self._execute_query(query, (student_id,))
        
        return [StudentBadge(**result) for result in results]
    
    def award_badge(self, student_id: str, badge_id: str) -> bool:
        """
        Award a badge to a student.
        
        Args:
            student_id: ID of the student
            badge_id: ID of the badge
            
        Returns:
            True if the badge was awarded successfully, False otherwise
        """
        # Check if the student already has this badge
        existing = self.get_student_badge(student_id, badge_id)
        if existing:
            return True
        
        # Prepare the data
        badge_data = {
            "student_id": student_id,
            "badge_id": badge_id,
            "awarded_at": datetime.datetime.now().isoformat()
        }
        
        # Prepare the query
        columns = ", ".join(badge_data.keys())
        placeholders = ", ".join(["?"] * len(badge_data))
        query = f"INSERT INTO student_badges ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        return self._execute_insert(query, tuple(badge_data.values())) is not None
    
    def revoke_badge(self, student_id: str, badge_id: str) -> bool:
        """
        Revoke a badge from a student.
        
        Args:
            student_id: ID of the student
            badge_id: ID of the badge
            
        Returns:
            True if the badge was revoked successfully, False otherwise
        """
        query = "DELETE FROM student_badges WHERE student_id = ? AND badge_id = ?"
        return self._execute_delete(query, (student_id, badge_id))
    
    # Educator note methods
    
    def get_educator_note(self, note_id: str) -> Optional[EducatorNote]:
        """
        Get an educator note by ID.
        
        Args:
            note_id: ID of the note
            
        Returns:
            EducatorNote object if found, None otherwise
        """
        query = "SELECT * FROM educator_notes WHERE id = ?"
        results = self._execute_query(query, (note_id,))
        
        if not results:
            return None
        
        return EducatorNote(**results[0])
    
    def get_educator_notes(self, student_id: Optional[str] = None, educator_id: Optional[str] = None) -> List[EducatorNote]:
        """
        Get all educator notes, optionally filtered by student or educator.
        
        Args:
            student_id: Optional ID of the student to filter by
            educator_id: Optional ID of the educator to filter by
            
        Returns:
            List of EducatorNote objects
        """
        if student_id and educator_id:
            query = "SELECT * FROM educator_notes WHERE student_id = ? AND educator_id = ?"
            results = self._execute_query(query, (student_id, educator_id))
        elif student_id:
            query = "SELECT * FROM educator_notes WHERE student_id = ?"
            results = self._execute_query(query, (student_id,))
        elif educator_id:
            query = "SELECT * FROM educator_notes WHERE educator_id = ?"
            results = self._execute_query(query, (educator_id,))
        else:
            query = "SELECT * FROM educator_notes"
            results = self._execute_query(query)
        
        return [EducatorNote(**result) for result in results]
    
    def create_educator_note(self, note_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new educator note.
        
        Args:
            note_data: Dictionary containing note details
            
        Returns:
            ID of the created note, or None if creation failed
        """
        # Generate a unique ID if not provided
        if "id" not in note_data:
            note_data["id"] = f"note_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Set timestamps if not provided
        if "created_at" not in note_data:
            note_data["created_at"] = datetime.datetime.now().isoformat()
        
        # Prepare the query
        columns = ", ".join(note_data.keys())
        placeholders = ", ".join(["?"] * len(note_data))
        query = f"INSERT INTO educator_notes ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(note_data.values()))
        
        return note_data["id"]
    
    def update_educator_note(self, note_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing educator note.
        
        Args:
            note_id: ID of the note to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Set update timestamp
        updates["updated_at"] = datetime.datetime.now().isoformat()
        
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE educator_notes SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (note_id,)
        return self._execute_update(query, params)
    
    def delete_educator_note(self, note_id: str) -> bool:
        """
        Delete an educator note.
        
        Args:
            note_id: ID of the note to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM educator_notes WHERE id = ?"
        return self._execute_delete(query, (note_id,))
    
    # Recommendation methods
    
    def get_recommendation(self, recommendation_id: str) -> Optional[Recommendation]:
        """
        Get a recommendation by ID.
        
        Args:
            recommendation_id: ID of the recommendation
            
        Returns:
            Recommendation object if found, None otherwise
        """
        query = "SELECT * FROM recommendations WHERE id = ?"
        results = self._execute_query(query, (recommendation_id,))
        
        if not results:
            return None
        
        recommendation_data = results[0]
        
        # Convert JSON strings to Python objects
        if recommendation_data.get("details"):
            recommendation_data["details"] = json.loads(recommendation_data["details"])
        
        return Recommendation(**recommendation_data)
    
    def get_recommendations(self, student_id: Optional[str] = None, educator_id: Optional[str] = None) -> List[Recommendation]:
        """
        Get all recommendations, optionally filtered by student or educator.
        
        Args:
            student_id: Optional ID of the student to filter by
            educator_id: Optional ID of the educator to filter by
            
        Returns:
            List of Recommendation objects
        """
        if student_id and educator_id:
            query = "SELECT * FROM recommendations WHERE student_id = ? AND educator_id = ?"
            results = self._execute_query(query, (student_id, educator_id))
        elif student_id:
            query = "SELECT * FROM recommendations WHERE student_id = ?"
            results = self._execute_query(query, (student_id,))
        elif educator_id:
            query = "SELECT * FROM recommendations WHERE educator_id = ?"
            results = self._execute_query(query, (educator_id,))
        else:
            query = "SELECT * FROM recommendations"
            results = self._execute_query(query)
        
        recommendations = []
        for recommendation_data in results:
            # Convert JSON strings to Python objects
            if recommendation_data.get("details"):
                recommendation_data["details"] = json.loads(recommendation_data["details"])
            
            recommendations.append(Recommendation(**recommendation_data))
        
        return recommendations
    
    def create_recommendation(self, recommendation_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new recommendation.
        
        Args:
            recommendation_data: Dictionary containing recommendation details
            
        Returns:
            ID of the created recommendation, or None if creation failed
        """
        # Convert Python objects to JSON strings
        if "details" in recommendation_data and isinstance(recommendation_data["details"], dict):
            recommendation_data["details"] = json.dumps(recommendation_data["details"])
        
        # Generate a unique ID if not provided
        if "id" not in recommendation_data:
            recommendation_data["id"] = f"rec_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Set timestamps if not provided
        if "created_at" not in recommendation_data:
            recommendation_data["created_at"] = datetime.datetime.now().isoformat()
        
        # Prepare the query
        columns = ", ".join(recommendation_data.keys())
        placeholders = ", ".join(["?"] * len(recommendation_data))
        query = f"INSERT INTO recommendations ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(recommendation_data.values()))
        
        return recommendation_data["id"]
    
    def update_recommendation(self, recommendation_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing recommendation.
        
        Args:
            recommendation_id: ID of the recommendation to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Convert Python objects to JSON strings
        if "details" in updates and isinstance(updates["details"], dict):
            updates["details"] = json.dumps(updates["details"])
        
        # Set update timestamp
        updates["updated_at"] = datetime.datetime.now().isoformat()
        
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE recommendations SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (recommendation_id,)
        return self._execute_update(query, params)
    
    def delete_recommendation(self, recommendation_id: str) -> bool:
        """
        Delete a recommendation.
        
        Args:
            recommendation_id: ID of the recommendation to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM recommendations WHERE id = ?"
        return self._execute_delete(query, (recommendation_id,))
    
    # Intervention methods
    
    def get_intervention(self, intervention_id: str) -> Optional[Intervention]:
        """
        Get an intervention by ID.
        
        Args:
            intervention_id: ID of the intervention
            
        Returns:
            Intervention object if found, None otherwise
        """
        query = "SELECT * FROM interventions WHERE id = ?"
        results = self._execute_query(query, (intervention_id,))
        
        if not results:
            return None
        
        intervention_data = results[0]
        
        # Convert JSON strings to Python objects
        if intervention_data.get("details"):
            intervention_data["details"] = json.loads(intervention_data["details"])
        if intervention_data.get("progress_data"):
            intervention_data["progress_data"] = json.loads(intervention_data["progress_data"])
        
        return Intervention(**intervention_data)
    
    def get_interventions(self, student_id: Optional[str] = None, educator_id: Optional[str] = None) -> List[Intervention]:
        """
        Get all interventions, optionally filtered by student or educator.
        
        Args:
            student_id: Optional ID of the student to filter by
            educator_id: Optional ID of the educator to filter by
            
        Returns:
            List of Intervention objects
        """
        if student_id and educator_id:
            query = "SELECT * FROM interventions WHERE student_id = ? AND educator_id = ?"
            results = self._execute_query(query, (student_id, educator_id))
        elif student_id:
            query = "SELECT * FROM interventions WHERE student_id = ?"
            results = self._execute_query(query, (student_id,))
        elif educator_id:
            query = "SELECT * FROM interventions WHERE educator_id = ?"
            results = self._execute_query(query, (educator_id,))
        else:
            query = "SELECT * FROM interventions"
            results = self._execute_query(query)
        
        interventions = []
        for intervention_data in results:
            # Convert JSON strings to Python objects
            if intervention_data.get("details"):
                intervention_data["details"] = json.loads(intervention_data["details"])
            if intervention_data.get("progress_data"):
                intervention_data["progress_data"] = json.loads(intervention_data["progress_data"])
            
            interventions.append(Intervention(**intervention_data))
        
        return interventions
    
    def create_intervention(self, intervention_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new intervention.
        
        Args:
            intervention_data: Dictionary containing intervention details
            
        Returns:
            ID of the created intervention, or None if creation failed
        """
        # Convert Python objects to JSON strings
        if "details" in intervention_data and isinstance(intervention_data["details"], dict):
            intervention_data["details"] = json.dumps(intervention_data["details"])
        if "progress_data" in intervention_data and isinstance(intervention_data["progress_data"], dict):
            intervention_data["progress_data"] = json.dumps(intervention_data["progress_data"])
        
        # Generate a unique ID if not provided
        if "id" not in intervention_data:
            intervention_data["id"] = f"int_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Set timestamps if not provided
        if "created_at" not in intervention_data:
            intervention_data["created_at"] = datetime.datetime.now().isoformat()
        
        # Prepare the query
        columns = ", ".join(intervention_data.keys())
        placeholders = ", ".join(["?"] * len(intervention_data))
        query = f"INSERT INTO interventions ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(intervention_data.values()))
        
        return intervention_data["id"]
    
    def update_intervention(self, intervention_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing intervention.
        
        Args:
            intervention_id: ID of the intervention to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Convert Python objects to JSON strings
        if "details" in updates and isinstance(updates["details"], dict):
            updates["details"] = json.dumps(updates["details"])
        if "progress_data" in updates and isinstance(updates["progress_data"], dict):
            updates["progress_data"] = json.dumps(updates["progress_data"])
        
        # Set update timestamp
        updates["updated_at"] = datetime.datetime.now().isoformat()
        
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE interventions SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (intervention_id,)
        return self._execute_update(query, params)
    
    def delete_intervention(self, intervention_id: str) -> bool:
        """
        Delete an intervention.
        
        Args:
            intervention_id: ID of the intervention to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM interventions WHERE id = ?"
        return self._execute_delete(query, (intervention_id,))
    
    # Message methods
    
    def get_message(self, message_id: str) -> Optional[Message]:
        """
        Get a message by ID.
        
        Args:
            message_id: ID of the message
            
        Returns:
            Message object if found, None otherwise
        """
        query = "SELECT * FROM messages WHERE id = ?"
        results = self._execute_query(query, (message_id,))
        
        if not results:
            return None
        
        message_data = results[0]
        
        # Get attachments
        attachments_query = "SELECT * FROM message_attachments WHERE message_id = ?"
        attachments_results = self._execute_query(attachments_query, (message_id,))
        
        attachments = [MessageAttachment(**attachment_data) for attachment_data in attachments_results]
        
        # Create Message object
        message = Message(**message_data)
        message.attachments = attachments
        
        return message
    
    def get_messages(self, sender_id: Optional[str] = None, recipient_id: Optional[str] = None) -> List[Message]:
        """
        Get all messages, optionally filtered by sender or recipient.
        
        Args:
            sender_id: Optional ID of the sender to filter by
            recipient_id: Optional ID of the recipient to filter by
            
        Returns:
            List of Message objects
        """
        if sender_id and recipient_id:
            query = "SELECT * FROM messages WHERE sender_id = ? AND recipient_id = ?"
            results = self._execute_query(query, (sender_id, recipient_id))
        elif sender_id:
            query = "SELECT * FROM messages WHERE sender_id = ?"
            results = self._execute_query(query, (sender_id,))
        elif recipient_id:
            query = "SELECT * FROM messages WHERE recipient_id = ?"
            results = self._execute_query(query, (recipient_id,))
        else:
            query = "SELECT * FROM messages"
            results = self._execute_query(query)
        
        messages = []
        for message_data in results:
            # Get attachments
            attachments_query = "SELECT * FROM message_attachments WHERE message_id = ?"
            attachments_results = self._execute_query(attachments_query, (message_data["id"],))
            
            attachments = [MessageAttachment(**attachment_data) for attachment_data in attachments_results]
            
            # Create Message object
            message = Message(**message_data)
            message.attachments = attachments
            
            messages.append(message)
        
        return messages
    
    def create_message(self, message_data: Dict[str, Any], attachments: List[Dict[str, Any]] = None) -> Optional[str]:
        """
        Create a new message.
        
        Args:
            message_data: Dictionary containing message details
            attachments: Optional list of dictionaries containing attachment details
            
        Returns:
            ID of the created message, or None if creation failed
        """
        # Generate a unique ID if not provided
        if "id" not in message_data:
            message_data["id"] = f"msg_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Set timestamps if not provided
        if "sent_at" not in message_data:
            message_data["sent_at"] = datetime.datetime.now().isoformat()
        
        # Prepare the query
        columns = ", ".join(message_data.keys())
        placeholders = ", ".join(["?"] * len(message_data))
        query = f"INSERT INTO messages ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        message_id = self._execute_insert(query, tuple(message_data.values()))
        
        if message_id is None:
            return None
        
        # Add attachments if provided
        if attachments:
            for attachment_data in attachments:
                attachment_data["message_id"] = message_data["id"]
                
                # Generate a unique ID if not provided
                if "id" not in attachment_data:
                    attachment_data["id"] = f"att_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
                
                # Prepare the query
                columns = ", ".join(attachment_data.keys())
                placeholders = ", ".join(["?"] * len(attachment_data))
                query = f"INSERT INTO message_attachments ({columns}) VALUES ({placeholders})"
                
                # Execute the query
                self._execute_insert(query, tuple(attachment_data.values()))
        
        return message_data["id"]
    
    def update_message(self, message_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing message.
        
        Args:
            message_id: ID of the message to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE messages SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (message_id,)
        return self._execute_update(query, params)
    
    def delete_message(self, message_id: str) -> bool:
        """
        Delete a message.
        
        Args:
            message_id: ID of the message to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        # Delete attachments first
        attachments_query = "DELETE FROM message_attachments WHERE message_id = ?"
        self._execute_delete(attachments_query, (message_id,))
        
        # Delete message
        query = "DELETE FROM messages WHERE id = ?"
        return self._execute_delete(query, (message_id,))
    
    # Resource library methods
    
    def get_resource(self, resource_id: str) -> Optional[ResourceLibraryItem]:
        """
        Get a resource by ID.
        
        Args:
            resource_id: ID of the resource
            
        Returns:
            ResourceLibraryItem object if found, None otherwise
        """
        query = "SELECT * FROM resource_library WHERE id = ?"
        results = self._execute_query(query, (resource_id,))
        
        if not results:
            return None
        
        resource_data = results[0]
        
        # Convert JSON strings to Python objects
        if resource_data.get("metadata"):
            resource_data["metadata"] = json.loads(resource_data["metadata"])
        if resource_data.get("tags"):
            resource_data["tags"] = json.loads(resource_data["tags"])
        
        return ResourceLibraryItem(**resource_data)
    
    def get_resources(self, subject: Optional[str] = None, content_type: Optional[str] = None, tag: Optional[str] = None) -> List[ResourceLibraryItem]:
        """
        Get all resources, optionally filtered by subject, content type, or tag.
        
        Args:
            subject: Optional subject to filter by
            content_type: Optional content type to filter by
            tag: Optional tag to filter by
            
        Returns:
            List of ResourceLibraryItem objects
        """
        if tag:
            query = "SELECT * FROM resource_library WHERE tags LIKE ?"
            results = self._execute_query(query, (f'%"{tag}"%',))
        elif subject and content_type:
            query = "SELECT * FROM resource_library WHERE subject = ? AND content_type = ?"
            results = self._execute_query(query, (subject, content_type))
        elif subject:
            query = "SELECT * FROM resource_library WHERE subject = ?"
            results = self._execute_query(query, (subject,))
        elif content_type:
            query = "SELECT * FROM resource_library WHERE content_type = ?"
            results = self._execute_query(query, (content_type,))
        else:
            query = "SELECT * FROM resource_library"
            results = self._execute_query(query)
        
        resources = []
        for resource_data in results:
            # Convert JSON strings to Python objects
            if resource_data.get("metadata"):
                resource_data["metadata"] = json.loads(resource_data["metadata"])
            if resource_data.get("tags"):
                resource_data["tags"] = json.loads(resource_data["tags"])
            
            resources.append(ResourceLibraryItem(**resource_data))
        
        return resources
    
    def create_resource(self, resource_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new resource.
        
        Args:
            resource_data: Dictionary containing resource details
            
        Returns:
            ID of the created resource, or None if creation failed
        """
        # Convert Python objects to JSON strings
        if "metadata" in resource_data and isinstance(resource_data["metadata"], dict):
            resource_data["metadata"] = json.dumps(resource_data["metadata"])
        if "tags" in resource_data and isinstance(resource_data["tags"], list):
            resource_data["tags"] = json.dumps(resource_data["tags"])
        
        # Generate a unique ID if not provided
        if "id" not in resource_data:
            resource_data["id"] = f"res_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Set timestamps if not provided
        if "created_at" not in resource_data:
            resource_data["created_at"] = datetime.datetime.now().isoformat()
        
        # Prepare the query
        columns = ", ".join(resource_data.keys())
        placeholders = ", ".join(["?"] * len(resource_data))
        query = f"INSERT INTO resource_library ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(resource_data.values()))
        
        return resource_data["id"]
    
    def update_resource(self, resource_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing resource.
        
        Args:
            resource_id: ID of the resource to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Convert Python objects to JSON strings
        if "metadata" in updates and isinstance(updates["metadata"], dict):
            updates["metadata"] = json.dumps(updates["metadata"])
        if "tags" in updates and isinstance(updates["tags"], list):
            updates["tags"] = json.dumps(updates["tags"])
        
        # Set update timestamp
        updates["updated_at"] = datetime.datetime.now().isoformat()
        
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE resource_library SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (resource_id,)
        return self._execute_update(query, params)
    
    def delete_resource(self, resource_id: str) -> bool:
        """
        Delete a resource.
        
        Args:
            resource_id: ID of the resource to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM resource_library WHERE id = ?"
        return self._execute_delete(query, (resource_id,))
    
    def add_tag_to_resource(self, resource_id: str, tag: str) -> bool:
        """
        Add a tag to a resource.
        
        Args:
            resource_id: ID of the resource
            tag: Tag to add
            
        Returns:
            True if the tag was added successfully, False otherwise
        """
        # Get the resource
        resource = self.get_resource(resource_id)
        if not resource:
            return False
        
        # Add the tag if it doesn't already exist
        tags = resource.tags or []
        if tag not in tags:
            tags.append(tag)
            
            # Update the resource
            return self.update_resource(resource_id, {"tags": tags})
        
        return True
    
    def remove_tag_from_resource(self, resource_id: str, tag: str) -> bool:
        """
        Remove a tag from a resource.
        
        Args:
            resource_id: ID of the resource
            tag: Tag to remove
            
        Returns:
            True if the tag was removed successfully, False otherwise
        """
        # Get the resource
        resource = self.get_resource(resource_id)
        if not resource:
            return False
        
        # Remove the tag if it exists
        tags = resource.tags or []
        if tag in tags:
            tags.remove(tag)
            
            # Update the resource
            return self.update_resource(resource_id, {"tags": tags})
        
        return True
    
    # Assessment methods
    
    def get_assessment(self, assessment_id: str) -> Optional[Dict[str, Any]]:
        """
        Get an assessment by ID.
        
        Args:
            assessment_id: ID of the assessment
            
        Returns:
            Dictionary containing assessment details if found, None otherwise
        """
        query = "SELECT * FROM assessments WHERE id = ?"
        results = self._execute_query(query, (assessment_id,))
        
        if not results:
            return None
        
        assessment_data = results[0]
        
        # Convert JSON strings to Python objects
        if assessment_data.get("questions"):
            assessment_data["questions"] = json.loads(assessment_data["questions"])
        if assessment_data.get("learning_objectives"):
            assessment_data["learning_objectives"] = json.loads(assessment_data["learning_objectives"])
        if assessment_data.get("tags"):
            assessment_data["tags"] = json.loads(assessment_data["tags"])
        if assessment_data.get("shared_with"):
            assessment_data["shared_with"] = json.loads(assessment_data["shared_with"])
        
        return assessment_data
    
    def get_educator_assessments(self, educator_id: str) -> List[Dict[str, Any]]:
        """
        Get all assessments created by a specific educator.
        
        Args:
            educator_id: ID of the educator
            
        Returns:
            List of dictionaries containing assessment details
        """
        query = "SELECT * FROM assessments WHERE created_by = ?"
        results = self._execute_query(query, (educator_id,))
        
        assessments = []
        for assessment_data in results:
            # Convert JSON strings to Python objects
            if assessment_data.get("questions"):
                assessment_data["questions"] = json.loads(assessment_data["questions"])
            if assessment_data.get("learning_objectives"):
                assessment_data["learning_objectives"] = json.loads(assessment_data["learning_objectives"])
            if assessment_data.get("tags"):
                assessment_data["tags"] = json.loads(assessment_data["tags"])
            if assessment_data.get("shared_with"):
                assessment_data["shared_with"] = json.loads(assessment_data["shared_with"])
            
            assessments.append(assessment_data)
        
        return assessments
    
    def get_shared_assessments(self, educator_id: str) -> List[Dict[str, Any]]:
        """
        Get all assessments shared with a specific educator.
        
        Args:
            educator_id: ID of the educator
            
        Returns:
            List of dictionaries containing assessment details
        """
        query = "SELECT * FROM assessments WHERE shared_with LIKE ?"
        results = self._execute_query(query, (f'%"{educator_id}"%',))
        
        assessments = []
        for assessment_data in results:
            # Convert JSON strings to Python objects
            if assessment_data.get("questions"):
                assessment_data["questions"] = json.loads(assessment_data["questions"])
            if assessment_data.get("learning_objectives"):
                assessment_data["learning_objectives"] = json.loads(assessment_data["learning_objectives"])
            if assessment_data.get("tags"):
                assessment_data["tags"] = json.loads(assessment_data["tags"])
            if assessment_data.get("shared_with"):
                assessment_data["shared_with"] = json.loads(assessment_data["shared_with"])
            
            assessments.append(assessment_data)
        
        return assessments
    
    def add_assessment(self, assessment_data: Dict[str, Any]) -> Optional[str]:
        """
        Add a new assessment.
        
        Args:
            assessment_data: Dictionary containing assessment details
            
        Returns:
            ID of the added assessment, or None if addition failed
        """
        # Convert Python objects to JSON strings
        if "questions" in assessment_data and isinstance(assessment_data["questions"], list):
            assessment_data["questions"] = json.dumps(assessment_data["questions"])
        if "learning_objectives" in assessment_data and isinstance(assessment_data["learning_objectives"], list):
            assessment_data["learning_objectives"] = json.dumps(assessment_data["learning_objectives"])
        if "tags" in assessment_data and isinstance(assessment_data["tags"], list):
            assessment_data["tags"] = json.dumps(assessment_data["tags"])
        if "shared_with" in assessment_data and isinstance(assessment_data["shared_with"], list):
            assessment_data["shared_with"] = json.dumps(assessment_data["shared_with"])
        
        # Prepare the query
        columns = ", ".join(assessment_data.keys())
        placeholders = ", ".join(["?"] * len(assessment_data))
        query = f"INSERT INTO assessments ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(assessment_data.values()))
        
        return assessment_data.get("id")
    
    def update_assessment(self, assessment_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing assessment.
        
        Args:
            assessment_id: ID of the assessment to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Convert Python objects to JSON strings
        if "questions" in updates and isinstance(updates["questions"], list):
            updates["questions"] = json.dumps(updates["questions"])
        if "learning_objectives" in updates and isinstance(updates["learning_objectives"], list):
            updates["learning_objectives"] = json.dumps(updates["learning_objectives"])
        if "tags" in updates and isinstance(updates["tags"], list):
            updates["tags"] = json.dumps(updates["tags"])
        if "shared_with" in updates and isinstance(updates["shared_with"], list):
            updates["shared_with"] = json.dumps(updates["shared_with"])
        
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE assessments SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (assessment_id,)
        return self._execute_update(query, params)
    
    def delete_assessment(self, assessment_id: str) -> bool:
        """
        Delete an assessment.
        
        Args:
            assessment_id: ID of the assessment to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM assessments WHERE id = ?"
        return self._execute_delete(query, (assessment_id,))
    
    # Assessment attempt methods
    
    def get_assessment_attempt(self, attempt_id: str) -> Optional[Dict[str, Any]]:
        """
        Get an assessment attempt by ID.
        
        Args:
            attempt_id: ID of the assessment attempt
            
        Returns:
            Dictionary containing assessment attempt details if found, None otherwise
        """
        query = "SELECT * FROM assessment_attempts WHERE id = ?"
        results = self._execute_query(query, (attempt_id,))
        
        if not results:
            return None
        
        attempt_data = results[0]
        
        # Convert JSON strings to Python objects
        if attempt_data.get("responses"):
            attempt_data["responses"] = json.loads(attempt_data["responses"])
        
        return attempt_data
    
    def get_student_assessment_attempts(self, student_id: str, assessment_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get all assessment attempts for a specific student.
        
        Args:
            student_id: ID of the student
            assessment_id: Optional ID of a specific assessment
            
        Returns:
            List of dictionaries containing assessment attempt details
        """
        if assessment_id:
            query = "SELECT * FROM assessment_attempts WHERE student_id = ? AND assessment_id = ?"
            results = self._execute_query(query, (student_id, assessment_id))
        else:
            query = "SELECT * FROM assessment_attempts WHERE student_id = ?"
            results = self._execute_query(query, (student_id,))
        
        attempts = []
        for attempt_data in results:
            # Convert JSON strings to Python objects
            if attempt_data.get("responses"):
                attempt_data["responses"] = json.loads(attempt_data["responses"])
            
            attempts.append(attempt_data)
        
        return attempts
    
    def add_assessment_attempt(self, attempt_data: Dict[str, Any]) -> Optional[str]:
        """
        Add a new assessment attempt.
        
        Args:
            attempt_data: Dictionary containing assessment attempt details
            
        Returns:
            ID of the added assessment attempt, or None if addition failed
        """
        # Convert Python objects to JSON strings
        if "responses" in attempt_data and isinstance(attempt_data["responses"], list):
            attempt_data["responses"] = json.dumps(attempt_data["responses"])
        
        # Prepare the query
        columns = ", ".join(attempt_data.keys())
        placeholders = ", ".join(["?"] * len(attempt_data))
        query = f"INSERT INTO assessment_attempts ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        self._execute_insert(query, tuple(attempt_data.values()))
        
        return attempt_data.get("id")
    
    def update_assessment_attempt(self, attempt_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing assessment attempt.
        
        Args:
            attempt_id: ID of the assessment attempt to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Convert Python objects to JSON strings
        if "responses" in updates and isinstance(updates["responses"], list):
            updates["responses"] = json.dumps(updates["responses"])
        
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE assessment_attempts SET {set_clause} WHERE id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (attempt_id,)
        return self._execute_update(query, params)
    
    def delete_assessment_attempt(self, attempt_id: str) -> bool:
        """
        Delete an assessment attempt.
        
        Args:
            attempt_id: ID of the assessment attempt to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM assessment_attempts WHERE id = ?"
        return self._execute_delete(query, (attempt_id,))
    
    # Assessment analytics methods
    
    def get_assessment_analytics(self, assessment_id: str) -> Optional[Dict[str, Any]]:
        """
        Get analytics for an assessment.
        
        Args:
            assessment_id: ID of the assessment
            
        Returns:
            Dictionary containing assessment analytics if found, None otherwise
        """
        query = "SELECT * FROM assessment_analytics WHERE assessment_id = ?"
        results = self._execute_query(query, (assessment_id,))
        
        if not results:
            return None
        
        analytics_data = results[0]
        
        # Convert JSON strings to Python objects
        if analytics_data.get("question_analytics"):
            analytics_data["question_analytics"] = json.loads(analytics_data["question_analytics"])
        
        return analytics_data
    
    def add_assessment_analytics(self, analytics_data: Dict[str, Any]) -> bool:
        """
        Add analytics for an assessment.
        
        Args:
            analytics_data: Dictionary containing assessment analytics
            
        Returns:
            True if the addition was successful, False otherwise
        """
        # Convert Python objects to JSON strings
        if "question_analytics" in analytics_data and isinstance(analytics_data["question_analytics"], list):
            analytics_data["question_analytics"] = json.dumps(analytics_data["question_analytics"])
        
        # Prepare the query
        columns = ", ".join(analytics_data.keys())
        placeholders = ", ".join(["?"] * len(analytics_data))
        query = f"INSERT INTO assessment_analytics ({columns}) VALUES ({placeholders})"
        
        # Execute the query
        return self._execute_insert(query, tuple(analytics_data.values())) is not None
    
    def update_assessment_analytics(self, assessment_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update analytics for an assessment.
        
        Args:
            assessment_id: ID of the assessment
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        # Convert Python objects to JSON strings
        if "question_analytics" in updates and isinstance(updates["question_analytics"], list):
            updates["question_analytics"] = json.dumps(updates["question_analytics"])
        
        # Prepare the query
        set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
        query = f"UPDATE assessment_analytics SET {set_clause} WHERE assessment_id = ?"
        
        # Execute the query
        params = tuple(updates.values()) + (assessment_id,)
        return self._execute_update(query, params)
    
    def delete_assessment_analytics(self, assessment_id: str) -> bool:
        """
        Delete analytics for an assessment.
        
        Args:
            assessment_id: ID of the assessment
            
        Returns:
            True if the delete was successful, False otherwise
        """
        query = "DELETE FROM assessment_analytics WHERE assessment_id = ?"
        return self._execute_delete(query, (assessment_id,))
    
    # Helper methods for the Educator Dashboard
    
    def get_full_learner_profile_data(self, student_id: str) -> Optional[Dict[str, Any]]:
        """
        Get comprehensive profile data for a student.
        
        Args:
            student_id: ID of the student
            
        Returns:
            Dictionary containing comprehensive student profile data, or None if not found
        """
        # Get basic student data
        student = self.get_student(student_id)
        if not student:
            return None
        
        # Convert to dictionary
        profile_data = student.to_dict()
        
        # Add additional data
        profile_data["badges"] = [badge.to_dict() for badge in self.get_student_badges(student_id)]
        profile_data["notes"] = [note.to_dict() for note in self.get_educator_notes(student_id=student_id)]
        
        return profile_data
    
    def get_student_progress_data(self, student_id: str) -> List[Dict[str, Any]]:
        """
        Get progress data for a student.
        
        Args:
            student_id: ID of the student
            
        Returns:
            List of dictionaries containing progress data
        """
        # Get learning objective progress
        progress_records = self.get_student_progress(student_id)
        
        # Convert to dictionaries
        progress_data = [record.to_dict() for record in progress_records]
        
        # Add objective details
        for record in progress_data:
            objective = self.get_learning_objective(record["objective_id"])
            if objective:
                record["objective_details"] = objective.to_dict()
        
        return progress_data
    
    def get_student_activity_data(self, student_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent activity data for a student.
        
        Args:
            student_id: ID of the student
            limit: Maximum number of activities to return
            
        Returns:
            List of dictionaries containing activity data
        """
        # Get activity attempts
        attempts = self.get_activity_attempts(student_id=student_id)
        
        # Sort by started_at in descending order
        attempts.sort(key=lambda a: a.started_at if a.started_at else "", reverse=True)
        
        # Limit the number of results
        attempts = attempts[:limit]
        
        # Convert to dictionaries
        activity_data = []
        for attempt in attempts:
            attempt_dict = attempt.to_dict()
            
            # Add activity details
            activity = self.get_activity(attempt.activity_id)
            if activity:
                attempt_dict["activity_details"] = activity.to_dict()
            
            activity_data.append(attempt_dict)
        
        return activity_data
    
    def get_student_intervention_data(self, student_id: str) -> List[Dict[str, Any]]:
        """
        Get intervention data for a student.
        
        Args:
            student_id: ID of the student
            
        Returns:
            List of dictionaries containing intervention data
        """
        # Get interventions
        interventions = self.get_interventions(student_id=student_id)
        
        # Convert to dictionaries
        intervention_data = [intervention.to_dict() for intervention in interventions]
        
        # Add educator details
        for record in intervention_data:
            educator = self.get_educator(record["educator_id"])
            if educator:
                record["educator_details"] = educator.to_dict()
        
        return intervention_data
    
    def get_student_recommendation_data(self, student_id: str) -> List[Dict[str, Any]]:
        """
        Get recommendation data for a student.
        
        Args:
            student_id: ID of the student
            
        Returns:
            List of dictionaries containing recommendation data
        """
        # Get recommendations
        recommendations = self.get_recommendations(student_id=student_id)
        
        # Convert to dictionaries
        recommendation_data = [recommendation.to_dict() for recommendation in recommendations]
        
        # Add educator details
        for record in recommendation_data:
            educator = self.get_educator(record["educator_id"])
            if educator:
                record["educator_details"] = educator.to_dict()
        
        return recommendation_data
    
    def get_class_data(self, class_id: str) -> Optional[Dict[str, Any]]:
        """
        Get comprehensive data for a class.
        
        Args:
            class_id: ID of the class
            
        Returns:
            Dictionary containing comprehensive class data, or None if not found
        """
        # Get basic class data
        class_data = self.get_class(class_id)
        if not class_data:
            return None
        
        # Add student data
        students = self.get_students_in_class(class_id)
        class_data["students"] = [student.to_dict() for student in students]
        
        # Add educator data
        educator_id = class_data.get("educator_id")
        if educator_id:
            educator = self.get_educator(educator_id)
            if educator:
                class_data["educator"] = educator.to_dict()
        
        return class_data
    
    def get_educator_data(self, educator_id: str) -> Optional[Dict[str, Any]]:
        """
        Get comprehensive data for an educator.
        
        Args:
            educator_id: ID of the educator
            
        Returns:
            Dictionary containing comprehensive educator data, or None if not found
        """
        # Get basic educator data
        educator = self.get_educator(educator_id)
        if not educator:
            return None
        
        # Convert to dictionary
        educator_data = educator.to_dict()
        
        # Add class data
        classes = self.get_classes(educator_id=educator_id)
        educator_data["classes"] = classes
        
        return educator_data
    
    def get_class_assessment_data(self, class_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get assessment data for a class.
        
        Args:
            class_id: ID of the class
            limit: Maximum number of assessments to return
            
        Returns:
            List of dictionaries containing assessment data
        """
        # Get student IDs for the class
        student_ids = [student.id for student in self.get_students_in_class(class_id)]
        
        # Get all assessment attempts for these students
        all_attempts = []
        for student_id in student_ids:
            attempts = self.get_student_assessment_attempts(student_id)
            all_attempts.extend(attempts)
        
        # Group attempts by assessment ID
        assessment_attempts = {}
        for attempt in all_attempts:
            assessment_id = attempt["assessment_id"]
            if assessment_id not in assessment_attempts:
                assessment_attempts[assessment_id] = []
            assessment_attempts[assessment_id].append(attempt)
        
        # Get assessment details and calculate statistics
        assessment_data = []
        for assessment_id, attempts in assessment_attempts.items():
            assessment = self.get_assessment(assessment_id)
            if not assessment:
                continue
            
            # Calculate statistics
            total_attempts = len(attempts)
            completed_attempts = sum(1 for a in attempts if a.get("status") == "completed")
            completion_rate = completed_attempts / total_attempts if total_attempts > 0 else 0
            
            scores = [a.get("percentage_score", 0) for a in attempts if a.get("percentage_score") is not None]
            average_score = sum(scores) / len(scores) if scores else 0
            
            # Create assessment data record
            record = {
                "assessment": assessment,
                "total_attempts": total_attempts,
                "completed_attempts": completed_attempts,
                "completion_rate": completion_rate,
                "average_score": average_score
            }
            
            assessment_data.append(record)
        
        # Sort by most recent and limit
        assessment_data.sort(key=lambda a: a["assessment"].get("created_at", ""), reverse=True)
        assessment_data = assessment_data[:limit]
        
        return assessment_data
    
    def get_subject_average_data(self, class_id: str) -> Dict[str, float]:
        """
        Get average progress by subject for a class.
        
        Args:
            class_id: ID of the class
            
        Returns:
            Dictionary mapping subjects to average progress
        """
        # Get student IDs for the class
        student_ids = [student.id for student in self.get_students_in_class(class_id)]
        
        # Get all progress records for these students
        all_progress = []
        for student_id in student_ids:
            progress = self.get_student_progress(student_id)
            all_progress.extend(progress)
        
        # Group progress by subject
        subject_progress = {}
        for progress in all_progress:
            # Get the objective to determine the subject
            objective = self.get_learning_objective(progress.objective_id)
            if not objective:
                continue
            
            subject = objective.subject
            if subject not in subject_progress:
                subject_progress[subject] = []
            
            # Convert status to numeric value
            if progress.status == "completed":
                value = 1.0
            elif progress.status == "in_progress":
                value = 0.5
            else:
                value = 0.0
            
            subject_progress[subject].append(value)
        
        # Calculate averages
        subject_averages = {}
        for subject, values in subject_progress.items():
            subject_averages[subject] = sum(values) / len(values) if values else 0
        
        return subject_averages
    
    def get_student_ids_for_class(self, class_id: str) -> List[str]:
        """
        Get IDs of all students in a class.
        
        Args:
            class_id: ID of the class
            
        Returns:
            List of student IDs
        """
        query = """
            SELECT student_id FROM class_students
            WHERE class_id = ?
        """
        results = self._execute_query(query, (class_id,))
        
        return [result["student_id"] for result in results]
    
    def get_student_data(self, student_id: str) -> Optional[Dict[str, Any]]:
        """
        Get basic data for a student.
        
        Args:
            student_id: ID of the student
            
        Returns:
            Dictionary containing basic student data, or None if not found
        """
        student = self.get_student(student_id)
        if not student:
            return None
        
        return student.to_dict()
    
    def create_intervention_record(self, intervention_data: Dict[str, Any]) -> Optional[str]:
        """
        Create a new intervention record.
        
        Args:
            intervention_data: Dictionary containing intervention details
            
        Returns:
            ID of the created intervention, or None if creation failed
        """
        return self.create_intervention(intervention_data)
    
    def update_intervention_record(self, intervention_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update an existing intervention record.
        
        Args:
            intervention_id: ID of the intervention to update
            updates: Dictionary of fields to update
            
        Returns:
            True if the update was successful, False otherwise
        """
        return self.update_intervention(intervention_id, updates)
    
    def get_intervention_records(self, student_id: Optional[str] = None, educator_id: Optional[str] = None) -> List[Intervention]:
        """
        Get intervention records, optionally filtered by student or educator.
        
        Args:
            student_id: Optional ID of the student to filter by
            educator_id: Optional ID of the educator to filter by
            
        Returns:
            List of Intervention objects
        """
        return self.get_interventions(student_id, educator_id)
    
    def get_intervention_record_by_id(self, intervention_id: str) -> Optional[Intervention]:
        """
        Get an intervention record by ID.
        
        Args:
            intervention_id: ID of the intervention
            
        Returns:
            Intervention object if found, None otherwise
        """
        return self.get_intervention(intervention_id)
    
    def delete_intervention_record(self, intervention_id: str) -> bool:
        """
        Delete an intervention record.
        
        Args:
            intervention_id: ID of the intervention to delete
            
        Returns:
            True if the delete was successful, False otherwise
        """
        return self.delete_intervention(intervention_id)

# Create a singleton instance
persistence_manager = PersistenceManager()
