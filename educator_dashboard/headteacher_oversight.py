"""
Headteacher Oversight and Communication Module for EdPsych Connect.

This module provides functionality for headteachers to oversee teacher-TA collaborations,
provide feedback, allocate resources, and communicate with staff.
"""

import logging
import json
import uuid
import datetime
from typing import List, Dict, Optional, Any, Union

# Setup logging
logger = logging.getLogger(__name__)

# Import necessary modules
from edpsychconnect_dala_prototype.persistence_manager import persistence_manager

# --- Data Models ---

class HeadteacherFeedback:
    """Model for headteacher feedback on lesson plans and collaborations."""
    
    def __init__(self,
                 id: str,
                 headteacher_id: str,
                 target_id: str,
                 target_type: str,
                 feedback_text: str,
                 strengths: List[str],
                 areas_for_improvement: List[str],
                 action_points: List[str],
                 status: str = "provided",
                 created_at: str = None,
                 updated_at: str = None):
        """
        Initialize headteacher feedback.
        
        Args:
            id: Unique identifier for the feedback
            headteacher_id: ID of the headteacher providing feedback
            target_id: ID of the target (lesson plan, teacher, TA, etc.)
            target_type: Type of the target (lesson_plan, teacher, ta, etc.)
            feedback_text: General feedback text
            strengths: List of identified strengths
            areas_for_improvement: List of areas for improvement
            action_points: List of action points
            status: Status of the feedback (provided, acknowledged, implemented)
            created_at: Timestamp when the feedback was created
            updated_at: Timestamp when the feedback was last updated
        """
        self.id = id
        self.headteacher_id = headteacher_id
        self.target_id = target_id
        self.target_type = target_type
        self.feedback_text = feedback_text
        self.strengths = strengths
        self.areas_for_improvement = areas_for_improvement
        self.action_points = action_points
        self.status = status
        self.created_at = created_at or datetime.datetime.now().isoformat()
        self.updated_at = updated_at or datetime.datetime.now().isoformat()
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert the headteacher feedback to a dictionary."""
        return {
            "id": self.id,
            "headteacher_id": self.headteacher_id,
            "target_id": self.target_id,
            "target_type": self.target_type,
            "feedback_text": self.feedback_text,
            "strengths": self.strengths,
            "areas_for_improvement": self.areas_for_improvement,
            "action_points": self.action_points,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'HeadteacherFeedback':
        """Create headteacher feedback from a dictionary."""
        return cls(**data)


class ResourceAllocation:
    """Model for headteacher resource allocation decisions."""
    
    def __init__(self,
                 id: str,
                 headteacher_id: str,
                 resource_type: str,
                 resource_id: str,
                 allocated_to: str,
                 allocated_to_type: str,
                 start_date: str,
                 end_date: str = None,
                 hours_per_week: float = None,
                 purpose: str = "",
                 notes: str = "",
                 status: str = "active",
                 created_at: str = None,
                 updated_at: str = None):
        """
        Initialize resource allocation.
        
        Args:
            id: Unique identifier for the allocation
            headteacher_id: ID of the headteacher making the allocation
            resource_type: Type of resource (ta, equipment, budget, etc.)
            resource_id: ID of the resource
            allocated_to: ID of the recipient (teacher, class, student, etc.)
            allocated_to_type: Type of the recipient (teacher, class, student, etc.)
            start_date: Start date of the allocation
            end_date: Optional end date of the allocation
            hours_per_week: Optional hours per week (for staff allocations)
            purpose: Purpose of the allocation
            notes: Additional notes
            status: Status of the allocation (active, completed, cancelled)
            created_at: Timestamp when the allocation was created
            updated_at: Timestamp when the allocation was last updated
        """
        self.id = id
        self.headteacher_id = headteacher_id
        self.resource_type = resource_type
        self.resource_id = resource_id
        self.allocated_to = allocated_to
        self.allocated_to_type = allocated_to_type
        self.start_date = start_date
        self.end_date = end_date
        self.hours_per_week = hours_per_week
        self.purpose = purpose
        self.notes = notes
        self.status = status
        self.created_at = created_at or datetime.datetime.now().isoformat()
        self.updated_at = updated_at or datetime.datetime.now().isoformat()
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert the resource allocation to a dictionary."""
        return {
            "id": self.id,
            "headteacher_id": self.headteacher_id,
            "resource_type": self.resource_type,
            "resource_id": self.resource_id,
            "allocated_to": self.allocated_to,
            "allocated_to_type": self.allocated_to_type,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "hours_per_week": self.hours_per_week,
            "purpose": self.purpose,
            "notes": self.notes,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ResourceAllocation':
        """Create resource allocation from a dictionary."""
        return cls(**data)


# --- Service Functions ---

def get_school_dashboard(headteacher_id: str) -> Dict[str, Any]:
    """
    Get the school-wide dashboard for a headteacher.
    
    Args:
        headteacher_id: ID of the headteacher
        
    Returns:
        Dictionary containing dashboard data
    """
    try:
        # This would normally fetch data from the database
        # For now, return mock data for testing
        return {
            "teacher_ta_collaborations": {
                "total": 15,
                "active": 10,
                "by_department": {
                    "Mathematics": 3,
                    "English": 4,
                    "Science": 2,
                    "Other": 1
                }
            },
            "lesson_plans": {
                "total": 45,
                "pending_review": 8,
                "approved": 32,
                "needs_revision": 5
            },
            "resource_allocations": {
                "ta_hours": {
                    "total": 120,
                    "allocated": 95,
                    "available": 25
                },
                "budget": {
                    "total": 5000,
                    "allocated": 3200,
                    "available": 1800
                }
            },
            "student_support": {
                "sen_students": 28,
                "with_ta_support": 22,
                "pending_assessment": 6
            }
        }
    except Exception as e:
        logger.error(f"Error getting school dashboard: {str(e)}")
        return {}

def provide_lesson_feedback(headteacher_id: str, lesson_plan_id: str, 
                          feedback: str, rating: int) -> str:
    """
    Provide feedback on a lesson plan.
    
    Args:
        headteacher_id: ID of the headteacher providing feedback
        lesson_plan_id: ID of the lesson plan
        feedback: Feedback text
        rating: Rating (1-5)
        
    Returns:
        ID of the created feedback
    """
    try:
        # Generate a unique feedback ID
        feedback_id = f"fb_{uuid.uuid4().hex[:12]}"
        
        # Create feedback data
        feedback_data = {
            "id": feedback_id,
            "headteacher_id": headteacher_id,
            "target_id": lesson_plan_id,
            "target_type": "lesson_plan",
            "feedback_text": feedback,
            "strengths": ["Good planning", "Clear objectives"],
            "areas_for_improvement": ["Consider differentiation"],
            "action_points": ["Update plan with differentiation strategies"],
            "status": "provided",
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Store in database (would use persistence_manager in real implementation)
        logger.info(f"Headteacher {headteacher_id} provided feedback on lesson plan {lesson_plan_id}")
        
        return feedback_id
    except Exception as e:
        logger.error(f"Error providing lesson feedback: {str(e)}")
        return ""

def get_resource_allocation_analytics(headteacher_id: str) -> Dict[str, Any]:
    """
    Get analytics on resource allocation.
    
    Args:
        headteacher_id: ID of the headteacher
        
    Returns:
        Dictionary containing resource allocation analytics
    """
    try:
        # This would normally fetch data from the database
        # For now, return mock data for testing
        return {
            "ta_allocations": {
                "by_department": {
                    "Mathematics": 25,
                    "English": 30,
                    "Science": 20,
                    "Other": 20
                },
                "by_year_group": {
                    "Year 1": 15,
                    "Year 2": 15,
                    "Year 3": 20,
                    "Year 4": 20,
                    "Year 5": 15,
                    "Year 6": 10
                },
                "by_need_type": {
                    "SEN": 40,
                    "EAL": 20,
                    "Behavior": 15,
                    "General": 25
                }
            },
            "budget_allocations": {
                "by_department": {
                    "Mathematics": 1000,
                    "English": 1200,
                    "Science": 1500,
                    "Other": 1300
                },
                "by_category": {
                    "Staff": 2000,
                    "Materials": 1500,
                    "Equipment": 1000,
                    "Training": 500
                }
            },
            "effectiveness_metrics": {
                "ta_impact_score": 4.2,
                "budget_roi_score": 3.8,
                "resource_utilization": 0.85
            }
        }
    except Exception as e:
        logger.error(f"Error getting resource allocation analytics: {str(e)}")
        return {}

def allocate_ta_to_class(headteacher_id: str, ta_id: str, class_id: str, 
                       hours_per_week: float, purpose: str) -> str:
    """
    Allocate a teaching assistant to a class.
    
    Args:
        headteacher_id: ID of the headteacher making the allocation
        ta_id: ID of the teaching assistant
        class_id: ID of the class
        hours_per_week: Hours per week for the allocation
        purpose: Purpose of the allocation
        
    Returns:
        ID of the created allocation
    """
    try:
        # Generate a unique allocation ID
        allocation_id = f"alloc_{uuid.uuid4().hex[:12]}"
        
        # Create allocation data
        allocation_data = {
            "id": allocation_id,
            "headteacher_id": headteacher_id,
            "resource_type": "ta",
            "resource_id": ta_id,
            "allocated_to": class_id,
            "allocated_to_type": "class",
            "start_date": datetime.datetime.now().strftime("%Y-%m-%d"),
            "end_date": (datetime.datetime.now() + datetime.timedelta(days=90)).strftime("%Y-%m-%d"),
            "hours_per_week": hours_per_week,
            "purpose": purpose,
            "status": "active",
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Store in database (would use persistence_manager in real implementation)
        logger.info(f"Headteacher {headteacher_id} allocated TA {ta_id} to class {class_id}")
        
        return allocation_id
    except Exception as e:
        logger.error(f"Error allocating TA to class: {str(e)}")
        return ""

def create_school_announcement(headteacher_id: str, title: str, content: str, 
                             target_audience: List[str], priority: str = "normal",
                             expiry_date: str = None) -> str:
    """
    Create a school-wide announcement.
    
    Args:
        headteacher_id: ID of the headteacher creating the announcement
        title: Title of the announcement
        content: Content of the announcement
        target_audience: List of audience types (all_staff, teachers, tas, etc.)
        priority: Priority of the announcement (low, normal, high, urgent)
        expiry_date: Optional expiry date for the announcement
        
    Returns:
        ID of the created announcement
    """
    try:
        # Generate a unique announcement ID
        announcement_id = f"announce_{uuid.uuid4().hex[:12]}"
        
        # Set default expiry date if not provided
        if expiry_date is None:
            expiry_date = (datetime.datetime.now() + datetime.timedelta(days=14)).strftime("%Y-%m-%d")
        
        # Create announcement data
        announcement_data = {
            "id": announcement_id,
            "headteacher_id": headteacher_id,
            "title": title,
            "content": content,
            "target_audience": target_audience,
            "priority": priority,
            "expiry_date": expiry_date,
            "attachments": [],
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Store in database (would use persistence_manager in real implementation)
        logger.info(f"Headteacher {headteacher_id} created announcement {announcement_id}")
        
        return announcement_id
    except Exception as e:
        logger.error(f"Error creating school announcement: {str(e)}")
        return ""

def schedule_observation(headteacher_id: str, teacher_id: str, 
                       scheduled_date: str, scheduled_time: str,
                       focus_areas: List[str] = None, ta_id: str = None) -> str:
    """
    Schedule a classroom observation.
    
    Args:
        headteacher_id: ID of the headteacher scheduling the observation
        teacher_id: ID of the teacher to observe
        scheduled_date: Date for the observation
        scheduled_time: Time for the observation
        focus_areas: Optional list of focus areas for the observation
        ta_id: Optional ID of the TA to observe
        
    Returns:
        ID of the created observation
    """
    try:
        # Generate a unique observation ID
        observation_id = f"obs_{uuid.uuid4().hex[:12]}"
        
        # Set defaults for optional parameters
        if focus_areas is None:
            focus_areas = ["Teaching quality", "Classroom management", "Student engagement"]
        
        # Create observation data
        observation_data = {
            "id": observation_id,
            "headteacher_id": headteacher_id,
            "teacher_id": teacher_id,
            "ta_id": ta_id,
            "scheduled_date": scheduled_date,
            "scheduled_time": scheduled_time,
            "duration_minutes": 60,
            "focus_areas": focus_areas,
            "pre_observation_notes": "",
            "observation_notes": "",
            "status": "scheduled",
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Store in database (would use persistence_manager in real implementation)
        logger.info(f"Headteacher {headteacher_id} scheduled observation {observation_id} for teacher {teacher_id}")
        
        return observation_id
    except Exception as e:
        logger.error(f"Error scheduling observation: {str(e)}")
        return ""

def create_performance_review(headteacher_id: str, staff_id: str, staff_role: str,
                           review_period_start: str, review_period_end: str,
                           overall_rating: int, strengths: List[str],
                           development_areas: List[str], goals: List[Dict[str, Any]],
                           comments: str) -> str:
    """
    Create a performance review for a staff member.
    
    Args:
        headteacher_id: ID of the headteacher creating the review
        staff_id: ID of the staff member
        staff_role: Role of the staff member (teacher, ta)
        review_period_start: Start date of the review period
        review_period_end: End date of the review period
        overall_rating: Overall performance rating (1-5)
        strengths: List of identified strengths
        development_areas: List of development areas
        goals: List of goals for the next period
        comments: Additional comments
        
    Returns:
        ID of the created review
    """
    try:
        # Generate a unique review ID
        review_id = f"review_{uuid.uuid4().hex[:12]}"
        
        # Create review data
        review_data = {
            "id": review_id,
            "headteacher_id": headteacher_id,
            "staff_id": staff_id,
            "staff_role": staff_role,
            "review_period_start": review_period_start,
            "review_period_end": review_period_end,
            "overall_rating": overall_rating,
            "strengths": strengths,
            "development_areas": development_areas,
            "goals": goals,
            "comments": comments,
            "status": "draft",
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Store in database (would use persistence_manager in real implementation)
        logger.info(f"Headteacher {headteacher_id} created performance review {review_id} for {staff_role} {staff_id}")
        
        return review_id
    except Exception as e:
        logger.error(f"Error creating performance review: {str(e)}")
        return ""

def get_staff_performance_analytics(headteacher_id: str) -> Dict[str, Any]:
    """
    Get analytics on staff performance.
    
    Args:
        headteacher_id: ID of the headteacher
        
    Returns:
        Dictionary containing staff performance analytics
    """
    try:
        # This would normally fetch data from the database
        # For now, return mock data for testing
        return {
            "teacher_performance": {
                "average_rating": 4.2,
                "by_department": {
                    "Mathematics": 4.3,
                    "English": 4.1,
                    "Science": 4.4,
                    "Other": 4.0
                },
                "top_strengths": [
                    {"strength": "Subject knowledge", "count": 15},
                    {"strength": "Student engagement", "count": 12},
                    {"strength": "Assessment practices", "count": 10}
                ],
                "top_development_areas": [
                    {"area": "Differentiation", "count": 8},
                    {"area": "Technology integration", "count": 7},
                    {"area": "Behavior management", "count": 5}
                ]
            },
            "ta_performance": {
                "average_rating": 4.0,
                "by_role": {
                    "General": 3.9,
                    "SEN": 4.2,
                    "EAL": 4.0
                },
                "top_strengths": [
                    {"strength": "Student support", "count": 12},
                    {"strength": "Collaboration", "count": 10},
                    {"strength": "Resource preparation", "count": 8}
                ],
                "top_development_areas": [
                    {"area": "Subject knowledge", "count": 6},
                    {"area": "Initiative", "count": 5},
                    {"area": "Assessment support", "count": 4}
                ]
            },
            "goal_completion": {
                "teachers": 0.75,
                "tas": 0.70
            }
        }
    except Exception as e:
        logger.error(f"Error getting staff performance analytics: {str(e)}")
        return {}
