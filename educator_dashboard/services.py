# educator_dashboard/services.py
"""
Service layer for the Educator Dashboard.
Contains business logic to support API endpoints, interacting with the persistence layer.
"""

import datetime
from typing import List, Optional, Dict, Any
from collections import defaultdict
import logging

# Setup logging
logger = logging.getLogger(__name__)

# Use absolute imports
from edpsychconnect_dala_prototype.persistence_manager import persistence_manager
from edpsychconnect_dala_prototype.educator_dashboard.models import (
    StudentDetails,
    ClassOverview,
    StudentProgress,
    InterventionRecord
)

def get_student_details(student_id: str) -> Optional[Dict[str, Any]]:
    """
    Get detailed information about a student.
    
    Args:
        student_id: ID of the student
        
    Returns:
        Dictionary containing student details or None if not found
    """
    try:
        # Get student profile data
        student_data = persistence_manager.get_full_learner_profile_data(student_id)
        if not student_data:
            logger.warning(f"Student not found: {student_id}")
            return None
        
        # Get progress data
        progress_data = persistence_manager.get_student_progress_data(student_id)
        
        # Get recent activity data
        activity_data = persistence_manager.get_student_activity_data(student_id, limit=5)
        
        # Get intervention data
        intervention_data = persistence_manager.get_student_intervention_data(student_id)
        
        # Get recommendation data
        recommendation_data = persistence_manager.get_student_recommendation_data(student_id)
        
        # Create StudentDetails object
        student_details = StudentDetails(
            student=student_data,
            progress=progress_data,
            recent_activities=activity_data,
            interventions=intervention_data,
            recommendations=recommendation_data
        )
        
        # Convert to dictionary
        return student_details.to_dict()
    except Exception as e:
        logger.error(f"Error getting student details for {student_id}: {str(e)}")
        return None

def get_class_overview(class_id: str) -> Optional[Dict[str, Any]]:
    """
    Get overview information about a class.
    
    Args:
        class_id: ID of the class
        
    Returns:
        Dictionary containing class overview or None if not found
    """
    try:
        # Get class data
        class_data = persistence_manager.get_class_data(class_id)
        if not class_data:
            logger.warning(f"Class not found: {class_id}")
            return None
        
        # Get educator data
        educator_id = class_data.get("educator_id")
        educator_data = persistence_manager.get_educator_data(educator_id) if educator_id else None
        
        # Get student count
        student_ids = persistence_manager.get_student_ids_for_class(class_id)
        student_count = len(student_ids) if student_ids else 0
        
        # Get average progress
        total_progress = 0.0
        for student_id in student_ids:
            progress_data = persistence_manager.get_student_progress_data(student_id)
            if progress_data:
                # Calculate average progress for this student
                completed = sum(1 for p in progress_data if p.status == "completed")
                total = len(progress_data) if progress_data else 1  # Avoid division by zero
                student_progress = completed / total
                total_progress += student_progress
        
        average_progress = total_progress / student_count if student_count > 0 else 0.0
        
        # Get subject averages
        subject_averages = persistence_manager.get_subject_average_data(class_id)
        
        # Get recent assessments
        recent_assessments = persistence_manager.get_class_assessment_data(class_id, limit=3)
        
        # Create ClassOverview object
        class_overview = ClassOverview(
            class_id=class_id,
            class_name=class_data.get("name", f"Class {class_id}"),
            educator=educator_data,
            student_count=student_count,
            average_progress=average_progress,
            subject_averages=subject_averages,
            recent_assessments=recent_assessments
        )
        
        # Convert to dictionary
        return class_overview.to_dict()
    except Exception as e:
        logger.error(f"Error getting class overview for {class_id}: {str(e)}")
        return None

def get_student_progress(student_id: str) -> Optional[Dict[str, Any]]:
    """
    Get progress information for a student.
    
    Args:
        student_id: ID of the student
        
    Returns:
        Dictionary containing student progress or None if not found
    """
    try:
        # Get student data
        student_data = persistence_manager.get_student_data(student_id)
        if not student_data:
            logger.warning(f"Student not found: {student_id}")
            return None
        
        # Get progress data
        progress_data = persistence_manager.get_student_progress_data(student_id)
        
        # Calculate overall progress
        completed = sum(1 for p in progress_data if p.status == "completed")
        in_progress = sum(1 for p in progress_data if p.status == "in_progress")
        not_started = sum(1 for p in progress_data if p.status == "not_started")
        total = len(progress_data) if progress_data else 1  # Avoid division by zero
        overall_progress = completed / total
        
        # Calculate subject progress
        subject_progress = defaultdict(list)
        for p in progress_data:
            # Assuming each learning objective has a subject attribute
            subject = getattr(p, "subject", "unknown")
            status = p.status
            subject_progress[subject].append(status)
        
        subject_progress_percentages = {}
        for subject, statuses in subject_progress.items():
            completed_count = sum(1 for s in statuses if s == "completed")
            total_count = len(statuses)
            subject_progress_percentages[subject] = completed_count / total_count if total_count > 0 else 0.0
        
        # Get recent activities
        activity_data = persistence_manager.get_student_activity_data(student_id, limit=5)
        recent_activities = [a.to_dict() for a in activity_data] if activity_data else []
        
        # Create StudentProgress object
        student_progress = StudentProgress(
            student_id=student_id,
            student_name=f"{student_data.first_name} {student_data.last_name}",
            overall_progress=overall_progress,
            subject_progress=subject_progress_percentages,
            completed_objectives=completed,
            in_progress_objectives=in_progress,
            not_started_objectives=not_started,
            recent_activities=recent_activities
        )
        
        # Convert to dictionary
        return student_progress.to_dict()
    except Exception as e:
        logger.error(f"Error getting student progress for {student_id}: {str(e)}")
        return None

def create_intervention(student_id: str, educator_id: str, intervention_data: Dict[str, Any]) -> Optional[str]:
    """
    Create a new intervention for a student.
    
    Args:
        student_id: ID of the student
        educator_id: ID of the educator creating the intervention
        intervention_data: Dictionary containing intervention details
        
    Returns:
        ID of the created intervention or None if failed
    """
    try:
        # Validate required fields
        required_fields = ["title", "description", "start_date", "intervention_type"]
        for field in required_fields:
            if field not in intervention_data:
                logger.warning(f"Missing required field for intervention: {field}")
                return None
        
        # Add student and educator IDs
        intervention_data["student_id"] = student_id
        intervention_data["educator_id"] = educator_id
        
        # Create intervention record
        intervention_id = persistence_manager.create_intervention_record(intervention_data)
        
        return intervention_id
    except Exception as e:
        logger.error(f"Error creating intervention for student {student_id}: {str(e)}")
        return None

def update_intervention(intervention_id: str, updates: Dict[str, Any]) -> bool:
    """
    Update an existing intervention.
    
    Args:
        intervention_id: ID of the intervention
        updates: Dictionary containing fields to update
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Update intervention record
        success = persistence_manager.update_intervention_record(intervention_id, updates)
        
        return success
    except Exception as e:
        logger.error(f"Error updating intervention {intervention_id}: {str(e)}")
        return False

def get_interventions(student_id: Optional[str] = None, educator_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Get interventions, optionally filtered by student or educator.
    
    Args:
        student_id: Optional ID of the student
        educator_id: Optional ID of the educator
        
    Returns:
        List of intervention dictionaries
    """
    try:
        # Get intervention records
        intervention_records = persistence_manager.get_intervention_records(student_id=student_id, educator_id=educator_id)
        
        # Convert to dictionaries
        return [record.to_dict() for record in intervention_records] if intervention_records else []
    except Exception as e:
        logger.error(f"Error getting interventions: {str(e)}")
        return []

def get_intervention(intervention_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a specific intervention.
    
    Args:
        intervention_id: ID of the intervention
        
    Returns:
        Dictionary containing intervention details or None if not found
    """
    try:
        # Get intervention record
        intervention_record = persistence_manager.get_intervention_record_by_id(intervention_id)
        
        # Convert to dictionary
        return intervention_record.to_dict() if intervention_record else None
    except Exception as e:
        logger.error(f"Error getting intervention {intervention_id}: {str(e)}")
        return None

def delete_intervention(intervention_id: str) -> bool:
    """
    Delete an intervention.
    
    Args:
        intervention_id: ID of the intervention
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Delete intervention record
        success = persistence_manager.delete_intervention_record(intervention_id)
        
        return success
    except Exception as e:
        logger.error(f"Error deleting intervention {intervention_id}: {str(e)}")
        return False
