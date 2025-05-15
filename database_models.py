"""
Database models for the EdPsych Connect platform.

This module defines the database models and schema for the EdPsych Connect platform,
including tables for users, students, educators, learning objectives, activities,
and other core entities.
"""

import datetime
import json
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field, asdict

@dataclass
class User:
    """Base user model for the EdPsych Connect platform."""
    id: str
    username: str
    email: str
    password_hash: str
    first_name: str
    last_name: str
    role: str
    created_at: datetime.datetime
    last_login: Optional[datetime.datetime] = None
    is_active: bool = True
    profile_image_url: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the User object to a dictionary."""
        return asdict(self)

@dataclass
class Student:
    """Student user model."""
    id: str
    username: str
    email: str
    password_hash: str
    first_name: str
    last_name: str
    role: str
    created_at: datetime.datetime
    year_group: str
    last_login: Optional[datetime.datetime] = None
    is_active: bool = True
    profile_image_url: Optional[str] = None
    date_of_birth: Optional[datetime.date] = None
    school_id: Optional[str] = None
    parent_ids: List[str] = field(default_factory=list)
    educator_ids: List[str] = field(default_factory=list)
    preferences: Dict[str, Any] = field(default_factory=dict)
    needs: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the Student object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['date_of_birth']:
            result['date_of_birth'] = result['date_of_birth'].isoformat()
        if result['created_at']:
            result['created_at'] = result['created_at'].isoformat()
        if result['last_login']:
            result['last_login'] = result['last_login'].isoformat()
        return result

@dataclass
class Educator:
    """Educator user model."""
    id: str
    username: str
    email: str
    password_hash: str
    first_name: str
    last_name: str
    role: str
    created_at: datetime.datetime
    last_login: Optional[datetime.datetime] = None
    is_active: bool = True
    profile_image_url: Optional[str] = None
    school_id: Optional[str] = None
    department: Optional[str] = None
    subjects: List[str] = field(default_factory=list)
    year_groups: List[str] = field(default_factory=list)
    student_ids: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the Educator object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['created_at']:
            result['created_at'] = result['created_at'].isoformat()
        if result['last_login']:
            result['last_login'] = result['last_login'].isoformat()
        return result

@dataclass
class Parent:
    """Parent user model."""
    id: str
    username: str
    email: str
    password_hash: str
    first_name: str
    last_name: str
    role: str
    created_at: datetime.datetime
    last_login: Optional[datetime.datetime] = None
    is_active: bool = True
    profile_image_url: Optional[str] = None
    student_ids: List[str] = field(default_factory=list)
    phone_number: Optional[str] = None
    preferred_contact_method: str = "email"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the Parent object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['created_at']:
            result['created_at'] = result['created_at'].isoformat()
        if result['last_login']:
            result['last_login'] = result['last_login'].isoformat()
        return result

@dataclass
class School:
    """School model for the EdPsych Connect platform."""
    id: str
    name: str
    address: str
    city: str
    postcode: str
    country: str = "United Kingdom"
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    admin_ids: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the School object to a dictionary."""
        return asdict(self)

@dataclass
class LearningObjective:
    """Learning objective model for the curriculum."""
    id: str
    code: str
    description: str
    subject: str
    year_group: str
    curriculum_area: str
    difficulty_level: str
    prerequisites: List[str] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the LearningObjective object to a dictionary."""
        return asdict(self)

@dataclass
class Activity:
    """Activity model for learning content."""
    id: str
    title: str
    description: str
    activity_type: str
    subject: str
    year_group: str
    difficulty_level: str
    duration_minutes: int
    learning_objective_ids: List[str] = field(default_factory=list)
    content_url: Optional[str] = None
    content_data: Optional[Dict[str, Any]] = None
    tags: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the Activity object to a dictionary."""
        return asdict(self)

@dataclass
class ActivityAttempt:
    """Activity attempt model for tracking student progress."""
    id: str
    student_id: str
    activity_id: str
    started_at: datetime.datetime
    completed_at: Optional[datetime.datetime] = None
    status: str = "in_progress"  # in_progress, completed, abandoned
    score: Optional[float] = None
    max_score: Optional[float] = None
    time_spent_seconds: Optional[int] = None
    responses: Optional[Dict[str, Any]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the ActivityAttempt object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['started_at']:
            result['started_at'] = result['started_at'].isoformat()
        if result['completed_at']:
            result['completed_at'] = result['completed_at'].isoformat()
        return result

@dataclass
class LearningObjectiveProgress:
    """Learning objective progress model for tracking student achievement."""
    id: str
    student_id: str
    lo_id: str
    status: str  # not_started, in_progress, completed
    started_at: Optional[datetime.datetime] = None
    completed_at: Optional[datetime.datetime] = None
    mastery_level: Optional[float] = None
    activity_attempts: List[str] = field(default_factory=list)
    details_json: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the LearningObjectiveProgress object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['started_at']:
            result['started_at'] = result['started_at'].isoformat()
        if result['completed_at']:
            result['completed_at'] = result['completed_at'].isoformat()
        # Parse details_json if it exists
        if result['details_json']:
            try:
                result['details'] = json.loads(result['details_json'])
                del result['details_json']
            except json.JSONDecodeError:
                result['details'] = {}
                del result['details_json']
        return result

@dataclass
class Badge:
    """Badge model for student achievements and rewards."""
    id: str
    name: str
    description: str
    image_url: str
    criteria: Dict[str, Any]
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the Badge object to a dictionary."""
        return asdict(self)

@dataclass
class StudentBadge:
    """Student badge model for tracking earned badges."""
    id: str
    student_id: str
    badge_id: str
    earned_at: datetime.datetime
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the StudentBadge object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['earned_at']:
            result['earned_at'] = result['earned_at'].isoformat()
        return result

@dataclass
class EducatorNote:
    """Educator note model for tracking notes about students."""
    id: str
    student_id: str
    educator_id: str
    note_text: str
    created_at: datetime.datetime
    updated_at: Optional[datetime.datetime] = None
    category: Optional[str] = None
    is_private: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the EducatorNote object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['created_at']:
            result['created_at'] = result['created_at'].isoformat()
        if result['updated_at']:
            result['updated_at'] = result['updated_at'].isoformat()
        return result

@dataclass
class Recommendation:
    """Recommendation model for personalized learning suggestions."""
    id: str
    student_id: str
    activity_id: Optional[str] = None
    lo_id: Optional[str] = None
    resource_id: Optional[str] = None
    reason: str = ""
    priority: int = 1
    created_at: datetime.datetime = field(default_factory=datetime.datetime.now)
    status: str = "active"  # active, completed, dismissed
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the Recommendation object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['created_at']:
            result['created_at'] = result['created_at'].isoformat()
        return result

@dataclass
class Intervention:
    """Intervention model for tracking support strategies."""
    id: str
    student_id: str
    educator_id: str
    title: str
    description: str
    start_date: datetime.date
    end_date: Optional[datetime.date] = None
    status: str = "planned"  # planned, active, completed, cancelled
    intervention_type: str = "academic"  # academic, behavioral, social, emotional
    goals: List[Dict[str, Any]] = field(default_factory=list)
    progress_notes: List[Dict[str, Any]] = field(default_factory=list)
    effectiveness_rating: Optional[int] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the Intervention object to a dictionary."""
        result = asdict(self)
        # Convert date objects to ISO format strings for JSON serialization
        if result['start_date']:
            result['start_date'] = result['start_date'].isoformat()
        if result['end_date']:
            result['end_date'] = result['end_date'].isoformat()
        return result

@dataclass
class Message:
    """Message model for the parent communication portal."""
    id: str
    sender_id: str
    sender_role: str  # educator, parent, system
    recipient_id: str
    recipient_role: str  # educator, parent
    subject: str
    body: str
    created_at: datetime.datetime
    read_at: Optional[datetime.datetime] = None
    parent_message_id: Optional[str] = None  # For threaded conversations
    attachments: List[Dict[str, Any]] = field(default_factory=list)
    is_draft: bool = False
    is_archived: bool = False
    is_flagged: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the Message object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['created_at']:
            result['created_at'] = result['created_at'].isoformat()
        if result['read_at']:
            result['read_at'] = result['read_at'].isoformat()
        return result

@dataclass
class MessageAttachment:
    """Attachment model for messages in the parent communication portal."""
    id: str
    message_id: str
    file_name: str
    file_type: str
    file_size: int
    file_path: str
    uploaded_at: datetime.datetime
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the MessageAttachment object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['uploaded_at']:
            result['uploaded_at'] = result['uploaded_at'].isoformat()
        return result

@dataclass
class ResourceLibraryItem:
    """Resource library item model for educational resources."""
    id: str
    title: str
    description: str
    resource_type: str  # document, video, link, worksheet, etc.
    subject: str
    year_group: str
    url: str
    created_by: str
    created_at: datetime.datetime
    updated_at: Optional[datetime.datetime] = None
    tags: List[str] = field(default_factory=list)
    learning_objective_ids: List[str] = field(default_factory=list)
    is_public: bool = True
    download_count: int = 0
    rating: Optional[float] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the ResourceLibraryItem object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['created_at']:
            result['created_at'] = result['created_at'].isoformat()
        if result['updated_at']:
            result['updated_at'] = result['updated_at'].isoformat()
        return result

@dataclass
class Assessment:
    """Assessment model for collaborative assessment tools."""
    id: str
    title: str
    description: str
    created_by: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    status: str  # draft, published, archived
    time_limit_minutes: Optional[int] = None
    passing_score: Optional[int] = None
    questions: List[Dict[str, Any]] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    learning_objectives: List[str] = field(default_factory=list)
    grade_level: Optional[str] = None
    subject: Optional[str] = None
    is_template: bool = False
    shared_with: List[str] = field(default_factory=list)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the Assessment object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['created_at']:
            result['created_at'] = result['created_at'].isoformat()
        if result['updated_at']:
            result['updated_at'] = result['updated_at'].isoformat()
        return result

@dataclass
class AssessmentAttempt:
    """Assessment attempt model for tracking student assessment progress."""
    id: str
    assessment_id: str
    student_id: str
    started_at: datetime.datetime
    completed_at: Optional[datetime.datetime] = None
    status: str = "in_progress"  # in_progress, completed, abandoned
    responses: List[Dict[str, Any]] = field(default_factory=list)
    total_score: Optional[float] = None
    percentage_score: Optional[float] = None
    time_spent_minutes: Optional[int] = None
    graded_by: Optional[str] = None
    graded_at: Optional[datetime.datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the AssessmentAttempt object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['started_at']:
            result['started_at'] = result['started_at'].isoformat()
        if result['completed_at']:
            result['completed_at'] = result['completed_at'].isoformat()
        if result['graded_at']:
            result['graded_at'] = result['graded_at'].isoformat()
        return result

@dataclass
class AssessmentAnalytics:
    """Assessment analytics model for storing assessment performance data."""
    assessment_id: str
    analytics_data: Dict[str, Any]
    generated_at: datetime.datetime
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert the AssessmentAnalytics object to a dictionary."""
        result = asdict(self)
        # Convert datetime objects to ISO format strings for JSON serialization
        if result['generated_at']:
            result['generated_at'] = result['generated_at'].isoformat()
        return result
