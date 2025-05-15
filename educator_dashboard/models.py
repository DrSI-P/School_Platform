"""
Models for the Educator Dashboard.

This module defines the data models used in the Educator Dashboard component
of the EdPsych Connect platform.
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field, asdict
import datetime
import json

# Use absolute imports
from edpsychconnect_dala_prototype.database_models import (
    Student, Educator, LearningObjectiveProgress, ActivityAttempt,
    Intervention, Recommendation, Assessment, AssessmentAttempt
)

@dataclass
class StudentDetails:
    """Detailed student information for the Educator Dashboard."""
    student: Student
    progress: List[LearningObjectiveProgress]
    recent_activities: List[ActivityAttempt]
    interventions: List[Intervention]
    recommendations: List[Recommendation]
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the StudentDetails object to a dictionary."""
        return {
            "student": self.student.to_dict() if self.student else {},
            "progress": [p.to_dict() for p in self.progress] if self.progress else [],
            "recent_activities": [a.to_dict() for a in self.recent_activities] if self.recent_activities else [],
            "interventions": [i.to_dict() for i in self.interventions] if self.interventions else [],
            "recommendations": [r.to_dict() for r in self.recommendations] if self.recommendations else []
        }

@dataclass
class ClassOverview:
    """Class overview information for the Educator Dashboard."""
    class_id: str
    class_name: str
    educator: Educator
    student_count: int
    average_progress: float
    subject_averages: Dict[str, float]
    recent_assessments: List[Assessment]
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the ClassOverview object to a dictionary."""
        return {
            "class_id": self.class_id,
            "class_name": self.class_name,
            "educator": self.educator.to_dict() if self.educator else {},
            "student_count": self.student_count,
            "average_progress": self.average_progress,
            "subject_averages": self.subject_averages,
            "recent_assessments": [a.to_dict() for a in self.recent_assessments] if self.recent_assessments else []
        }

@dataclass
class StudentProgress:
    """Student progress information for the Educator Dashboard."""
    student_id: str
    student_name: str
    overall_progress: float
    subject_progress: Dict[str, float]
    completed_objectives: int
    in_progress_objectives: int
    not_started_objectives: int
    recent_activities: List[Dict[str, Any]]
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the StudentProgress object to a dictionary."""
        return asdict(self)

@dataclass
class InterventionRecord:
    """Intervention record for the Educator Dashboard."""
    intervention: Intervention
    student_name: str
    educator_name: str
    days_active: int
    progress_percentage: float
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the InterventionRecord object to a dictionary."""
        return {
            "intervention": self.intervention.to_dict() if self.intervention else {},
            "student_name": self.student_name,
            "educator_name": self.educator_name,
            "days_active": self.days_active,
            "progress_percentage": self.progress_percentage
        }

@dataclass
class AssessmentResult:
    """Assessment result for the Educator Dashboard."""
    assessment: Assessment
    attempts: List[AssessmentAttempt]
    average_score: float
    completion_rate: float
    highest_score: float
    lowest_score: float
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the AssessmentResult object to a dictionary."""
        return {
            "assessment": self.assessment.to_dict() if self.assessment else {},
            "attempts": [a.to_dict() for a in self.attempts] if self.attempts else [],
            "average_score": self.average_score,
            "completion_rate": self.completion_rate,
            "highest_score": self.highest_score,
            "lowest_score": self.lowest_score
        }

@dataclass
class LearningGap:
    """Learning gap model for the Educator Dashboard."""
    student_id: str
    student_name: str
    objective_id: str
    objective_description: str
    subject: str
    gap_level: float  # 0-1 scale, higher means bigger gap
    recommended_activities: List[str]
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the LearningGap object to a dictionary."""
        return asdict(self)

@dataclass
class ActivityEngagement:
    """Activity engagement model for the Educator Dashboard."""
    activity_id: str
    activity_title: str
    completion_rate: float
    average_time_spent: float
    student_attempts: int
    effectiveness_score: float
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the ActivityEngagement object to a dictionary."""
        return asdict(self)
