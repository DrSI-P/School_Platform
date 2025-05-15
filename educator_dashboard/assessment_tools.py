"""
Collaborative Assessment Tools for the Educator Dashboard.

This module provides functionality for educators to create, share, and analyze
assessments for students.
"""

import datetime
import json
import logging
from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field

class AssessmentQuestion(BaseModel):
    """Model representing a question in an assessment."""
    id: str
    question_text: str
    question_type: str  # multiple_choice, short_answer, essay, matching, etc.
    options: Optional[List[Dict[str, str]]] = None  # For multiple choice, matching, etc.
    correct_answer: Optional[Union[str, List[str]]] = None  # May be null for subjective questions
    points: int = 1
    difficulty_level: Optional[str] = None  # easy, medium, hard
    tags: List[str] = []
    learning_objective_id: Optional[str] = None

class Assessment(BaseModel):
    """Model representing a complete assessment."""
    id: str
    title: str
    description: str
    created_by: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    status: str = "draft"  # draft, published, archived
    time_limit_minutes: Optional[int] = None
    passing_score: Optional[int] = None
    questions: List[AssessmentQuestion]
    tags: List[str] = []
    learning_objectives: List[str] = []
    grade_level: Optional[str] = None
    subject: Optional[str] = None
    is_template: bool = False
    shared_with: List[str] = []  # List of educator IDs

class StudentResponse(BaseModel):
    """Model representing a student's response to an assessment question."""
    question_id: str
    response: Union[str, List[str]]
    score: Optional[float] = None
    feedback: Optional[str] = None
    time_spent_seconds: Optional[int] = None

class AssessmentAttempt(BaseModel):
    """Model representing a student's attempt at an assessment."""
    id: str
    assessment_id: str
    student_id: str
    started_at: datetime.datetime
    completed_at: Optional[datetime.datetime] = None
    status: str = "in_progress"  # in_progress, completed, abandoned
    responses: List[StudentResponse] = []
    total_score: Optional[float] = None
    percentage_score: Optional[float] = None
    time_spent_minutes: Optional[int] = None
    graded_by: Optional[str] = None
    graded_at: Optional[datetime.datetime] = None

class AssessmentAnalytics(BaseModel):
    """Model representing analytics for an assessment."""
    assessment_id: str
    total_attempts: int
    average_score: float
    median_score: float
    highest_score: float
    lowest_score: float
    completion_rate: float  # Percentage of students who completed the assessment
    average_time_minutes: float
    question_analytics: List[Dict[str, Any]]  # Analytics per question
    generated_at: datetime.datetime

class CollaborativeAssessmentTools:
    """
    System for managing collaborative assessments.
    
    Provides functionality to create, share, and analyze assessments
    for students.
    """
    
    def __init__(self, persistence_manager):
        """
        Initialize the collaborative assessment tools.
        
        Args:
            persistence_manager: Database interface for storing assessment data
        """
        self.persistence_manager = persistence_manager
        self.logger = logging.getLogger(__name__)
        self.logger.info("Collaborative Assessment Tools initialized")
    
    def create_assessment(self, assessment_data: Dict[str, Any]) -> Assessment:
        """
        Create a new assessment.
        
        Args:
            assessment_data: Dictionary containing assessment details
            
        Returns:
            The created assessment
        """
        # Generate a unique ID for the assessment
        assessment_id = f"assess_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Set creation and update timestamps
        now = datetime.datetime.now()
        assessment_data["id"] = assessment_id
        assessment_data["created_at"] = now
        assessment_data["updated_at"] = now
        
        # Create the assessment object
        assessment = Assessment(**assessment_data)
        
        # Store in database
        self.persistence_manager.add_assessment(assessment.dict())
        
        self.logger.info(f"Created assessment {assessment_id} by educator {assessment.created_by}")
        return assessment
    
    def get_assessment(self, assessment_id: str) -> Optional[Assessment]:
        """
        Retrieve an assessment by ID.
        
        Args:
            assessment_id: ID of the assessment to retrieve
            
        Returns:
            The assessment if found, None otherwise
        """
        assessment_data = self.persistence_manager.get_assessment(assessment_id)
        if not assessment_data:
            return None
        
        return Assessment(**assessment_data)
    
    def get_educator_assessments(self, educator_id: str) -> List[Assessment]:
        """
        Retrieve all assessments created by a specific educator.
        
        Args:
            educator_id: ID of the educator
            
        Returns:
            List of assessments created by the educator
        """
        assessments_data = self.persistence_manager.get_educator_assessments(educator_id)
        return [Assessment(**assessment_data) for assessment_data in assessments_data]
    
    def get_shared_assessments(self, educator_id: str) -> List[Assessment]:
        """
        Retrieve all assessments shared with a specific educator.
        
        Args:
            educator_id: ID of the educator
            
        Returns:
            List of assessments shared with the educator
        """
        assessments_data = self.persistence_manager.get_shared_assessments(educator_id)
        return [Assessment(**assessment_data) for assessment_data in assessments_data]
    
    def update_assessment(self, assessment_id: str, updates: Dict[str, Any]) -> Optional[Assessment]:
        """
        Update an existing assessment.
        
        Args:
            assessment_id: ID of the assessment to update
            updates: Dictionary of fields to update
            
        Returns:
            The updated assessment if successful, None otherwise
        """
        # Get the current assessment
        assessment_data = self.persistence_manager.get_assessment(assessment_id)
        if not assessment_data:
            self.logger.warning(f"Attempted to update non-existent assessment: {assessment_id}")
            return None
        
        # Update the assessment data
        assessment_data.update(updates)
        assessment_data["updated_at"] = datetime.datetime.now()
        
        # Update in database
        self.persistence_manager.update_assessment(assessment_id, assessment_data)
        
        self.logger.info(f"Updated assessment {assessment_id}")
        return Assessment(**assessment_data)
    
    def share_assessment(self, assessment_id: str, educator_ids: List[str]) -> Optional[Assessment]:
        """
        Share an assessment with other educators.
        
        Args:
            assessment_id: ID of the assessment to share
            educator_ids: List of educator IDs to share with
            
        Returns:
            The updated assessment if successful, None otherwise
        """
        # Get the current assessment
        assessment = self.get_assessment(assessment_id)
        if not assessment:
            return None
        
        # Add educators to shared_with list (avoid duplicates)
        current_shared = set(assessment.shared_with)
        current_shared.update(educator_ids)
        
        # Update the assessment
        assessment_dict = assessment.dict()
        assessment_dict["shared_with"] = list(current_shared)
        assessment_dict["updated_at"] = datetime.datetime.now()
        
        # Update in database
        self.persistence_manager.update_assessment(assessment_id, assessment_dict)
        
        self.logger.info(f"Shared assessment {assessment_id} with {len(educator_ids)} educators")
        return Assessment(**assessment_dict)

# Create an instance of the tools
# This will be initialized with the persistence_manager when imported
collaborative_assessment_tools = None
