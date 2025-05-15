"""
Learning Gaps and Engagement Analytics Module for EdPsych Connect.

This module provides functionality for analyzing student learning gaps,
tracking engagement patterns, and generating actionable insights for educators.
"""

import logging
import json
import uuid
import datetime
from typing import List, Dict, Optional, Any, Union
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64

# Setup logging
logger = logging.getLogger(__name__)

# Import necessary modules
from edpsychconnect_dala_prototype.persistence_manager import persistence_manager

# --- Data Models ---

class LearningGap:
    """Model for student learning gaps."""
    
    def __init__(self,
                 id: str,
                 student_id: str,
                 subject: str,
                 topic: str,
                 learning_objective_id: str,
                 learning_objective_description: str,
                 gap_level: str,
                 evidence: List[Dict[str, Any]],
                 identified_date: str,
                 identified_by: str,
                 status: str = "identified",
                 intervention_ids: List[str] = None,
                 notes: str = "",
                 created_at: str = None,
                 updated_at: str = None):
        """
        Initialize a learning gap.
        
        Args:
            id: Unique identifier for the learning gap
            student_id: ID of the student
            subject: Subject area of the gap
            topic: Specific topic within the subject
            learning_objective_id: ID of the learning objective
            learning_objective_description: Description of the learning objective
            gap_level: Level of the gap (minor, moderate, significant)
            evidence: List of evidence supporting the gap identification
            identified_date: Date when the gap was identified
            identified_by: ID of the user who identified the gap
            status: Status of the gap (identified, addressed, resolved)
            intervention_ids: List of intervention IDs applied to address the gap
            notes: Additional notes about the gap
            created_at: Timestamp when the gap was created
            updated_at: Timestamp when the gap was last updated
        """
        self.id = id
        self.student_id = student_id
        self.subject = subject
        self.topic = topic
        self.learning_objective_id = learning_objective_id
        self.learning_objective_description = learning_objective_description
        self.gap_level = gap_level
        self.evidence = evidence
        self.identified_date = identified_date
        self.identified_by = identified_by
        self.status = status
        self.intervention_ids = intervention_ids or []
        self.notes = notes
        self.created_at = created_at or datetime.datetime.now().isoformat()
        self.updated_at = updated_at or datetime.datetime.now().isoformat()
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert the learning gap to a dictionary."""
        return {
            "id": self.id,
            "student_id": self.student_id,
            "subject": self.subject,
            "topic": self.topic,
            "learning_objective_id": self.learning_objective_id,
            "learning_objective_description": self.learning_objective_description,
            "gap_level": self.gap_level,
            "evidence": self.evidence,
            "identified_date": self.identified_date,
            "identified_by": self.identified_by,
            "status": self.status,
            "intervention_ids": self.intervention_ids,
            "notes": self.notes,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'LearningGap':
        """Create a learning gap from a dictionary."""
        return cls(**data)


class EngagementRecord:
    """Model for student engagement records."""
    
    def __init__(self,
                 id: str,
                 student_id: str,
                 activity_id: str,
                 activity_type: str,
                 activity_name: str,
                 subject: str,
                 topic: str,
                 start_time: str,
                 end_time: str = None,
                 duration_seconds: int = None,
                 completion_percentage: float = None,
                 engagement_level: str = None,
                 interaction_count: int = None,
                 correct_answers: int = None,
                 total_questions: int = None,
                 metadata: Dict[str, Any] = None,
                 created_at: str = None,
                 updated_at: str = None):
        """
        Initialize an engagement record.
        
        Args:
            id: Unique identifier for the engagement record
            student_id: ID of the student
            activity_id: ID of the activity
            activity_type: Type of activity (video, quiz, game, etc.)
            activity_name: Name of the activity
            subject: Subject of the activity
            topic: Topic within the subject
            start_time: Time when the student started the activity
            end_time: Time when the student ended the activity
            duration_seconds: Duration of engagement in seconds
            completion_percentage: Percentage of the activity completed
            engagement_level: Level of engagement (low, medium, high)
            interaction_count: Number of interactions during the activity
            correct_answers: Number of correct answers (for quizzes)
            total_questions: Total number of questions (for quizzes)
            metadata: Additional metadata about the engagement
            created_at: Timestamp when the record was created
            updated_at: Timestamp when the record was last updated
        """
        self.id = id
        self.student_id = student_id
        self.activity_id = activity_id
        self.activity_type = activity_type
        self.activity_name = activity_name
        self.subject = subject
        self.topic = topic
        self.start_time = start_time
        self.end_time = end_time
        self.duration_seconds = duration_seconds
        self.completion_percentage = completion_percentage
        self.engagement_level = engagement_level
        self.interaction_count = interaction_count
        self.correct_answers = correct_answers
        self.total_questions = total_questions
        self.metadata = metadata or {}
        self.created_at = created_at or datetime.datetime.now().isoformat()
        self.updated_at = updated_at or datetime.datetime.now().isoformat()
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert the engagement record to a dictionary."""
        return {
            "id": self.id,
            "student_id": self.student_id,
            "activity_id": self.activity_id,
            "activity_type": self.activity_type,
            "activity_name": self.activity_name,
            "subject": self.subject,
            "topic": self.topic,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "duration_seconds": self.duration_seconds,
            "completion_percentage": self.completion_percentage,
            "engagement_level": self.engagement_level,
            "interaction_count": self.interaction_count,
            "correct_answers": self.correct_answers,
            "total_questions": self.total_questions,
            "metadata": self.metadata,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'EngagementRecord':
        """Create an engagement record from a dictionary."""
        return cls(**data)


class AnalyticsReport:
    """Model for analytics reports."""
    
    def __init__(self,
                 id: str,
                 report_type: str,
                 title: str,
                 description: str,
                 target_id: str,
                 target_type: str,
                 time_period: str,
                 data: Dict[str, Any],
                 visualizations: List[Dict[str, Any]] = None,
                 insights: List[str] = None,
                 recommendations: List[str] = None,
                 created_by: str = None,
                 created_at: str = None,
                 updated_at: str = None):
        """
        Initialize an analytics report.
        
        Args:
            id: Unique identifier for the report
            report_type: Type of report (learning_gaps, engagement, progress, etc.)
            title: Title of the report
            description: Description of the report
            target_id: ID of the target (student, class, school, etc.)
            target_type: Type of the target (student, class, school, etc.)
            time_period: Time period covered by the report
            data: Raw data for the report
            visualizations: List of visualizations included in the report
            insights: List of insights derived from the data
            recommendations: List of recommendations based on the insights
            created_by: ID of the user who created the report
            created_at: Timestamp when the report was created
            updated_at: Timestamp when the report was last updated
        """
        self.id = id
        self.report_type = report_type
        self.title = title
        self.description = description
        self.target_id = target_id
        self.target_type = target_type
        self.time_period = time_period
        self.data = data
        self.visualizations = visualizations or []
        self.insights = insights or []
        self.recommendations = recommendations or []
        self.created_by = created_by
        self.created_at = created_at or datetime.datetime.now().isoformat()
        self.updated_at = updated_at or datetime.datetime.now().isoformat()
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert the analytics report to a dictionary."""
        return {
            "id": self.id,
            "report_type": self.report_type,
            "title": self.title,
            "description": self.description,
            "target_id": self.target_id,
            "target_type": self.target_type,
            "time_period": self.time_period,
            "data": self.data,
            "visualizations": self.visualizations,
            "insights": self.insights,
            "recommendations": self.recommendations,
            "created_by": self.created_by,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'AnalyticsReport':
        """Create an analytics report from a dictionary."""
        return cls(**data)


# --- Learning Gaps Service Functions ---

def identify_learning_gap(student_id: str,
                         subject: str,
                         topic: str,
                         learning_objective_id: str,
                         learning_objective_description: str,
                         gap_level: str,
                         evidence: List[Dict[str, Any]],
                         identified_by: str,
                         notes: str = "") -> Optional[Dict[str, Any]]:
    """
    Identify a learning gap for a student.
    
    Args:
        student_id: ID of the student
        subject: Subject area of the gap
        topic: Specific topic within the subject
        learning_objective_id: ID of the learning objective
        learning_objective_description: Description of the learning objective
        gap_level: Level of the gap (minor, moderate, significant)
        evidence: List of evidence supporting the gap identification
        identified_by: ID of the user who identified the gap
        notes: Additional notes about the gap
        
    Returns:
        Dictionary containing the created learning gap or None if failed
    """
    try:
        # Generate a unique learning gap ID
        gap_id = f"gap_{uuid.uuid4().hex[:12]}"
        
        # Create the learning gap
        gap = LearningGap(
            id=gap_id,
            student_id=student_id,
            subject=subject,
            topic=topic,
            learning_objective_id=learning_objective_id,
            learning_objective_description=learning_objective_description,
            gap_level=gap_level,
            evidence=evidence,
            identified_date=datetime.datetime.now().isoformat(),
            identified_by=identified_by,
            notes=notes
        )
        
        # Convert to dictionary for storage
        gap_dict = gap.to_dict()
        
        # TODO: Store in database using persistence manager
        # For now, we'll just return the dictionary
        return gap_dict
    except Exception as e:
        logger.error(f"Error identifying learning gap: {str(e)}")
        return None


def get_learning_gaps(student_id: str = None, subject: str = None,
                    topic: str = None, status: str = None) -> List[Dict[str, Any]]:
    """
    Get learning gaps, optionally filtered by various criteria.
    
    Args:
        student_id: Optional ID of the student
        subject: Optional subject area
        topic: Optional topic within the subject
        status: Optional status of the gap
        
    Returns:
        List of learning gap dictionaries
    """
    try:
        # TODO: Retrieve from database using persistence manager
        # For now, we'll return an empty list
        return []
    except Exception as e:
        logger.error(f"Error getting learning gaps: {str(e)}")
        return []


def update_learning_gap(gap_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Update a learning gap.
    
    Args:
        gap_id: ID of the gap to update
        updates: Dictionary of fields to update
        
    Returns:
        Dictionary containing the updated learning gap or None if failed
    """
    try:
        # TODO: Implement this function
        return None
    except Exception as e:
        logger.error(f"Error updating learning gap {gap_id}: {str(e)}")
        return None


def add_intervention_to_gap(gap_id: str, intervention_id: str) -> bool:
    """
    Add an intervention to a learning gap.
    
    Args:
        gap_id: ID of the gap
        intervention_id: ID of the intervention to add
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Get the learning gap
        gaps = get_learning_gaps(gap_id=gap_id)
        if not gaps or len(gaps) == 0:
            return False
        
        gap = gaps[0]
        
        # Add the intervention ID if not already present
        if intervention_id not in gap.get("intervention_ids", []):
            intervention_ids = gap.get("intervention_ids", []) + [intervention_id]
            
            # Update the gap
            updates = {
                "intervention_ids": intervention_ids,
                "updated_at": datetime.datetime.now().isoformat()
            }
            
            # Update the gap
            updated_gap = update_learning_gap(gap_id, updates)
            return updated_gap is not None
        
        return True
    except Exception as e:
        logger.error(f"Error adding intervention {intervention_id} to gap {gap_id}: {str(e)}")
        return False


def resolve_learning_gap(gap_id: str, resolution_notes: str = "") -> bool:
    """
    Mark a learning gap as resolved.
    
    Args:
        gap_id: ID of the gap to resolve
        resolution_notes: Optional notes about the resolution
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Update the gap
        updates = {
            "status": "resolved",
            "notes": resolution_notes,
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Update the gap
        updated_gap = update_learning_gap(gap_id, updates)
        return updated_gap is not None
    except Exception as e:
        logger.error(f"Error resolving learning gap {gap_id}: {str(e)}")
        return False


def analyze_learning_gaps(student_id: str = None, class_id: str = None) -> Dict[str, Any]:
    """
    Analyze learning gaps for a student or class.
    
    Args:
        student_id: Optional ID of the student
        class_id: Optional ID of the class
        
    Returns:
        Dictionary containing analysis results
    """
    try:
        # Get the learning gaps
        gaps = []
        if student_id:
            gaps = get_learning_gaps(student_id=student_id)
        elif class_id:
            # TODO: Get all students in the class and their gaps
            pass
        
        # Analyze the gaps
        if not gaps:
            return {
                "total_gaps": 0,
                "by_subject": {},
                "by_topic": {},
                "by_level": {},
                "by_status": {},
                "recommendations": []
            }
        
        # Count gaps by various criteria
        by_subject = {}
        by_topic = {}
        by_level = {}
        by_status = {}
        
        for gap in gaps:
            # By subject
            subject = gap.get("subject", "Unknown")
            by_subject[subject] = by_subject.get(subject, 0) + 1
            
            # By topic
            topic = gap.get("topic", "Unknown")
            by_topic[topic] = by_topic.get(topic, 0) + 1
            
            # By level
            level = gap.get("gap_level", "Unknown")
            by_level[level] = by_level.get(level, 0) + 1
            
            # By status
            status = gap.get("status", "Unknown")
            by_status[status] = by_status.get(status, 0) + 1
        
        # Generate recommendations
        recommendations = []
        
        # If there are significant gaps, recommend interventions
        if by_level.get("significant", 0) > 0:
            recommendations.append("Consider targeted interventions for significant learning gaps.")
        
        # If there are many gaps in a specific subject, recommend subject focus
        max_subject = max(by_subject.items(), key=lambda x: x[1]) if by_subject else ("", 0)
        if max_subject[1] > 2:
            recommendations.append(f"Focus on {max_subject[0]} as it has the most learning gaps.")
        
        # Return the analysis
        return {
            "total_gaps": len(gaps),
            "by_subject": by_subject,
            "by_topic": by_topic,
            "by_level": by_level,
            "by_status": by_status,
            "recommendations": recommendations
        }
    except Exception as e:
        logger.error(f"Error analyzing learning gaps: {str(e)}")
        return {}


def analyze_student_learning_gaps(student_id: str, time_period: str = "all") -> Dict[str, Any]:
    """
    Analyze learning gaps for a specific student.
    
    Args:
        student_id: ID of the student
        time_period: Time period for analysis (all, last_week, last_month, last_term)
        
    Returns:
        Dictionary containing analysis results
    """
    try:
        logger.info(f"Analyzing learning gaps for student {student_id} over {time_period}")
        
        # Get student details
        # In a real implementation, we would fetch this from the database
        student_name = f"Student {student_id}"
        
        # Get learning gaps for the student
        gaps = get_learning_gaps(student_id=student_id)
        
        # Filter by time period if needed
        if time_period != "all":
            now = datetime.datetime.now()
            
            if time_period == "last_week":
                cutoff = now - datetime.timedelta(days=7)
            elif time_period == "last_month":
                cutoff = now - datetime.timedelta(days=30)
            elif time_period == "last_term":
                cutoff = now - datetime.timedelta(days=90)
            else:
                cutoff = now - datetime.timedelta(days=365)
                
            cutoff_str = cutoff.isoformat()
            gaps = [g for g in gaps if g.get("identified_date", "") >= cutoff_str]
        
        # Perform basic analysis
        gap_analysis = analyze_learning_gaps(student_id=student_id)
        
        # Add student-specific insights
        insights = []
        recommendations = []
        
        # Add basic insights
        if gap_analysis["total_gaps"] > 0:
            insights.append(f"{student_name} has {gap_analysis['total_gaps']} identified learning gaps.")
            
            # Add subject-specific insights
            by_subject = gap_analysis.get("by_subject", {})
            if by_subject:
                for subject, count in by_subject.items():
                    insights.append(f"{count} learning gaps in {subject}.")
            
            # Add level-specific insights
            by_level = gap_analysis.get("by_level", {})
            if by_level.get("significant", 0) > 0:
                insights.append(f"{by_level.get('significant')} significant learning gaps requiring immediate attention.")
            
            # Add status-specific insights
            by_status = gap_analysis.get("by_status", {})
            resolved = by_status.get("resolved", 0)
            identified = by_status.get("identified", 0)
            addressed = by_status.get("addressed", 0)
            
            if resolved > 0:
                insights.append(f"{resolved} learning gaps have been successfully resolved.")
            
            if identified > 0:
                insights.append(f"{identified} learning gaps have been identified but not yet addressed.")
            
            # Add recommendations
            recommendations.extend(gap_analysis.get("recommendations", []))
            
            # Add personalized recommendations
            if identified > 0:
                recommendations.append("Create targeted interventions for newly identified gaps.")
            
            if addressed > 0:
                recommendations.append("Review progress on addressed gaps to determine if they can be marked as resolved.")
        else:
            insights.append(f"No learning gaps identified for {student_name} in the selected time period.")
            recommendations.append("Continue monitoring for potential learning gaps.")
        
        # Return the comprehensive analysis
        return {
            "student_id": student_id,
            "student_name": student_name,
            "time_period": time_period,
            "analysis": gap_analysis,
            "insights": insights,
            "recommendations": recommendations
        }
    except Exception as e:
        logger.error(f"Error analyzing student learning gaps: {str(e)}")
        return {
            "student_id": student_id,
            "error": str(e)
        }


def analyze_class_learning_gaps(class_id: str, time_period: str = "all") -> Dict[str, Any]:
    """
    Analyze learning gaps for an entire class.
    
    Args:
        class_id: ID of the class
        time_period: Time period for analysis (all, last_week, last_month, last_term)
        
    Returns:
        Dictionary containing analysis results
    """
    try:
        logger.info(f"Analyzing learning gaps for class {class_id} over {time_period}")
        
        # Get class details
        # In a real implementation, we would fetch this from the database
        class_name = f"Class {class_id}"
        
        # Get students in the class
        # In a real implementation, we would fetch this from the database
        student_ids = [f"student_{i}" for i in range(1, 6)]  # Mock 5 students
        
        # Analyze each student's learning gaps
        student_analyses = {}
        all_gaps = []
        
        for student_id in student_ids:
            student_analysis = analyze_student_learning_gaps(student_id, time_period)
            student_analyses[student_id] = student_analysis
            
            # Collect all gaps for class-wide analysis
            student_gaps = get_learning_gaps(student_id=student_id)
            all_gaps.extend(student_gaps)
        
        # Perform class-wide analysis
        # Count gaps by various criteria
        by_subject = {}
        by_topic = {}
        by_level = {}
        by_status = {}
        by_student = {}
        
        for gap in all_gaps:
            # By subject
            subject = gap.get("subject", "Unknown")
            by_subject[subject] = by_subject.get(subject, 0) + 1
            
            # By topic
            topic = gap.get("topic", "Unknown")
            by_topic[topic] = by_topic.get(topic, 0) + 1
            
            # By level
            level = gap.get("gap_level", "Unknown")
            by_level[level] = by_level.get(level, 0) + 1
            
            # By status
            status = gap.get("status", "Unknown")
            by_status[status] = by_status.get(status, 0) + 1
            
            # By student
            student_id = gap.get("student_id", "Unknown")
            by_student[student_id] = by_student.get(student_id, 0) + 1
        
        # Generate class-wide insights
        insights = []
        recommendations = []
        
        # Add basic insights
        if all_gaps:
            insights.append(f"{class_name} has {len(all_gaps)} identified learning gaps across {len(student_ids)} students.")
            
            # Add subject-specific insights
            if by_subject:
                max_subject = max(by_subject.items(), key=lambda x: x[1]) if by_subject else ("", 0)
                insights.append(f"Most common subject with gaps: {max_subject[0]} ({max_subject[1]} gaps).")
            
            # Add level-specific insights
            if by_level.get("significant", 0) > 0:
                insights.append(f"{by_level.get('significant')} significant learning gaps requiring immediate attention.")
            
            # Add student distribution insights
            if by_student:
                max_student = max(by_student.items(), key=lambda x: x[1]) if by_student else ("", 0)
                insights.append(f"Student with most gaps: {max_student[0]} ({max_student[1]} gaps).")
            
            # Add recommendations
            if by_subject:
                max_subject = max(by_subject.items(), key=lambda x: x[1]) if by_subject else ("", 0)
                recommendations.append(f"Focus class-wide instruction on {max_subject[0]} to address common gaps.")
            
            if by_level.get("significant", 0) > 0:
                recommendations.append("Consider small group interventions for students with significant gaps.")
            
            if by_student:
                max_student = max(by_student.items(), key=lambda x: x[1]) if by_student else ("", 0)
                if max_student[1] > 3:
                    recommendations.append(f"Provide additional support for {max_student[0]} who has multiple learning gaps.")
        else:
            insights.append(f"No learning gaps identified for {class_name} in the selected time period.")
            recommendations.append("Continue monitoring for potential learning gaps.")
        
        # Return the comprehensive analysis
        return {
            "class_id": class_id,
            "class_name": class_name,
            "time_period": time_period,
            "total_gaps": len(all_gaps),
            "student_count": len(student_ids),
            "by_subject": by_subject,
            "by_topic": by_topic,
            "by_level": by_level,
            "by_status": by_status,
            "by_student": by_student,
            "student_analyses": student_analyses,
            "insights": insights,
            "recommendations": recommendations
        }
    except Exception as e:
        logger.error(f"Error analyzing class learning gaps: {str(e)}")
        return {
            "class_id": class_id,
            "error": str(e)
        }


def analyze_activity_effectiveness(activity_id: str, time_period: str = "all") -> Dict[str, Any]:
    """
    Analyze the effectiveness of a learning activity in addressing learning gaps.
    
    Args:
        activity_id: ID of the activity
        time_period: Time period for analysis (all, last_week, last_month, last_term)
        
    Returns:
        Dictionary containing analysis results
    """
    try:
        logger.info(f"Analyzing effectiveness of activity {activity_id} over {time_period}")
        
        # Get activity details
        # In a real implementation, we would fetch this from the database
        activity_name = f"Activity {activity_id}"
        activity_type = "quiz"  # Mock activity type
        activity_subject = "Mathematics"  # Mock subject
        
        # Get engagement records for the activity
        # In a real implementation, we would fetch this from the database
        engagement_records = []  # Mock empty list for now
        
        # Get learning gaps addressed by this activity
        # In a real implementation, we would fetch this from the database
        addressed_gaps = []  # Mock empty list for now
        
        # Calculate effectiveness metrics
        completion_rate = 0
        average_score = 0
        engagement_level = "medium"
        gap_resolution_rate = 0
        
        if engagement_records:
            # Calculate completion rate
            completion_values = [r.get("completion_percentage", 0) or 0 for r in engagement_records]
            completion_rate = sum(completion_values) / len(completion_values) if completion_values else 0
            
            # Calculate average score for quizzes
            if activity_type == "quiz":
                scores = []
                for record in engagement_records:
                    correct = record.get("correct_answers", 0) or 0
                    total = record.get("total_questions", 0) or 0
                    if total > 0:
                        score = (correct / total) * 100
                        scores.append(score)
                
                average_score = sum(scores) / len(scores) if scores else 0
            
            # Determine engagement level
            engagement_levels = [r.get("engagement_level", "medium") for r in engagement_records]
            level_counts = {
                "low": engagement_levels.count("low"),
                "medium": engagement_levels.count("medium"),
                "high": engagement_levels.count("high")
            }
            engagement_level = max(level_counts.items(), key=lambda x: x[1])[0] if level_counts else "medium"
        
        if addressed_gaps:
            # Calculate gap resolution rate
            resolved_gaps = [g for g in addressed_gaps if g.get("status") == "resolved"]
            gap_resolution_rate = (len(resolved_gaps) / len(addressed_gaps)) * 100 if addressed_gaps else 0
        
        # Generate insights
        insights = []
        recommendations = []
        
        # Add basic insights
        insights.append(f"Activity '{activity_name}' ({activity_type}) for {activity_subject}.")
        
        if engagement_records:
            insights.append(f"Engaged {len(engagement_records)} students with {completion_rate:.1f}% average completion rate.")
            
            if activity_type == "quiz":
                insights.append(f"Average quiz score: {average_score:.1f}%.")
            
            insights.append(f"Overall engagement level: {engagement_level}.")
        else:
            insights.append("No engagement records found for this activity.")
        
        if addressed_gaps:
            insights.append(f"Addressed {len(addressed_gaps)} learning gaps with {gap_resolution_rate:.1f}% resolution rate.")
        else:
            insights.append("No learning gaps have been addressed by this activity.")
        
        # Generate recommendations
        if engagement_records:
            if completion_rate < 80:
                recommendations.append("Consider shortening the activity to improve completion rates.")
            
            if activity_type == "quiz" and average_score < 70:
                recommendations.append("Review quiz difficulty as average score is below 70%.")
            
            if engagement_level == "low":
                recommendations.append("Redesign activity to increase engagement levels.")
        
        if addressed_gaps:
            if gap_resolution_rate < 50:
                recommendations.append("Activity is not effectively resolving learning gaps. Consider alternative approaches.")
        
        # Return the comprehensive analysis
        return {
            "activity_id": activity_id,
            "activity_name": activity_name,
            "activity_type": activity_type,
            "activity_subject": activity_subject,
            "time_period": time_period,
            "engagement_count": len(engagement_records),
            "addressed_gaps_count": len(addressed_gaps),
            "metrics": {
                "completion_rate": completion_rate,
                "average_score": average_score,
                "engagement_level": engagement_level,
                "gap_resolution_rate": gap_resolution_rate
            },
            "insights": insights,
            "recommendations": recommendations
        }
    except Exception as e:
        logger.error(f"Error analyzing activity effectiveness: {str(e)}")
        return {
            "activity_id": activity_id,
            "error": str(e)
        }


def generate_learning_gaps_visualization(analysis: Dict[str, Any], output_format: str = "base64") -> Optional[str]:
    """
    Generate a visualization of learning gaps analysis.
    
    Args:
        analysis: Dictionary containing analysis results
        output_format: Format of the output (base64, file)
        
    Returns:
        Base64-encoded image or file path, depending on output_format
    """
    try:
        # Create a figure with subplots
        fig, axs = plt.subplots(2, 2, figsize=(12, 10))
        
        # Plot gaps by subject
        by_subject = analysis.get("by_subject", {})
        if by_subject:
            subjects = list(by_subject.keys())
            counts = list(by_subject.values())
            axs[0, 0].bar(subjects, counts)
            axs[0, 0].set_title("Learning Gaps by Subject")
            axs[0, 0].set_xlabel("Subject")
            axs[0, 0].set_ylabel("Number of Gaps")
            axs[0, 0].tick_params(axis='x', rotation=45)
        
        # Plot gaps by level
        by_level = analysis.get("by_level", {})
        if by_level:
            levels = list(by_level.keys())
            counts = list(by_level.values())
            axs[0, 1].bar(levels, counts)
            axs[0, 1].set_title("Learning Gaps by Level")
            axs[0, 1].set_xlabel("Level")
            axs[0, 1].set_ylabel("Number of Gaps")
        
        # Plot gaps by status
        by_status = analysis.get("by_status", {})
        if by_status:
            statuses = list(by_status.keys())
            counts = list(by_status.values())
            axs[1, 0].bar(statuses, counts)
            axs[1, 0].set_title("Learning Gaps by Status")
            axs[1, 0].set_xlabel("Status")
            axs[1, 0].set_ylabel("Number of Gaps")
        
        # Plot gaps by topic (top 5)
        by_topic = analysis.get("by_topic", {})
        if by_topic:
            # Sort topics by count and take top 5
            sorted_topics = sorted(by_topic.items(), key=lambda x: x[1], reverse=True)[:5]
            topics = [t[0] for t in sorted_topics]
            counts = [t[1] for t in sorted_topics]
            axs[1, 1].bar(topics, counts)
            axs[1, 1].set_title("Top 5 Topics with Learning Gaps")
            axs[1, 1].set_xlabel("Topic")
            axs[1, 1].set_ylabel("Number of Gaps")
            axs[1, 1].tick_params(axis='x', rotation=45)
        
        # Adjust layout
        plt.tight_layout()
        
        # Return the visualization
        if output_format == "base64":
            # Save to a BytesIO object
            buf = BytesIO()
            plt.savefig(buf, format="png")
            buf.seek(0)
            
            # Convert to base64
            img_str = base64.b64encode(buf.read()).decode("utf-8")
            plt.close(fig)
            return img_str
        else:
            # Save to a file
            file_path = f"/tmp/learning_gaps_{uuid.uuid4().hex[:8]}.png"
            plt.savefig(file_path)
            plt.close(fig)
            return file_path
    except Exception as e:
        logger.error(f"Error generating learning gaps visualization: {str(e)}")
        return None


# --- Engagement Analytics Service Functions ---

def record_engagement(student_id: str,
                     activity_id: str,
                     activity_type: str,
                     activity_name: str,
                     subject: str,
                     topic: str,
                     start_time: str,
                     end_time: str = None,
                     duration_seconds: int = None,
                     completion_percentage: float = None,
                     engagement_level: str = None,
                     interaction_count: int = None,
                     correct_answers: int = None,
                     total_questions: int = None,
                     metadata: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
    """
    Record a student's engagement with an activity.
    
    Args:
        student_id: ID of the student
        activity_id: ID of the activity
        activity_type: Type of activity (video, quiz, game, etc.)
        activity_name: Name of the activity
        subject: Subject of the activity
        topic: Topic within the subject
        start_time: Time when the student started the activity
        end_time: Optional time when the student ended the activity
        duration_seconds: Optional duration of engagement in seconds
        completion_percentage: Optional percentage of the activity completed
        engagement_level: Optional level of engagement (low, medium, high)
        interaction_count: Optional number of interactions during the activity
        correct_answers: Optional number of correct answers (for quizzes)
        total_questions: Optional total number of questions (for quizzes)
        metadata: Optional additional metadata about the engagement
        
    Returns:
        Dictionary containing the created engagement record or None if failed
    """
    try:
        # Generate a unique engagement record ID
        record_id = f"eng_{uuid.uuid4().hex[:12]}"
        
        # Create the engagement record
        record = EngagementRecord(
            id=record_id,
            student_id=student_id,
            activity_id=activity_id,
            activity_type=activity_type,
            activity_name=activity_name,
            subject=subject,
            topic=topic,
            start_time=start_time,
            end_time=end_time,
            duration_seconds=duration_seconds,
            completion_percentage=completion_percentage,
            engagement_level=engagement_level,
            interaction_count=interaction_count,
            correct_answers=correct_answers,
            total_questions=total_questions,
            metadata=metadata
        )
        
        # Convert to dictionary for storage
        record_dict = record.to_dict()
        
        # TODO: Store in database using persistence manager
        # For now, we'll just return the dictionary
        return record_dict
    except Exception as e:
        logger.error(f"Error recording engagement: {str(e)}")
        return None


def get_engagement_records(student_id: str = None, activity_id: str = None,
                         activity_type: str = None, subject: str = None,
                         topic: str = None, start_date: str = None,
                         end_date: str = None) -> List[Dict[str, Any]]:
    """
    Get engagement records, optionally filtered by various criteria.
    
    Args:
        student_id: Optional ID of the student
        activity_id: Optional ID of the activity
        activity_type: Optional type of activity
        subject: Optional subject of the activity
        topic: Optional topic within the subject
        start_date: Optional start date for filtering
        end_date: Optional end date for filtering
        
    Returns:
        List of engagement record dictionaries
    """
    try:
        # TODO: Retrieve from database using persistence manager
        # For now, we'll return an empty list
        return []
    except Exception as e:
        logger.error(f"Error getting engagement records: {str(e)}")
        return []


def analyze_engagement(student_id: str = None, class_id: str = None,
                     start_date: str = None, end_date: str = None) -> Dict[str, Any]:
    """
    Analyze engagement for a student or class.
    
    Args:
        student_id: Optional ID of the student
        class_id: Optional ID of the class
        start_date: Optional start date for filtering
        end_date: Optional end date for filtering
        
    Returns:
        Dictionary containing analysis results
    """
    try:
        # Get the engagement records
        records = []
        if student_id:
            records = get_engagement_records(student_id=student_id, start_date=start_date, end_date=end_date)
        elif class_id:
            # TODO: Get all students in the class and their engagement records
            pass
        
        # Analyze the records
        if not records:
            return {
                "total_activities": 0,
                "total_time_seconds": 0,
                "average_completion": 0,
                "by_activity_type": {},
                "by_subject": {},
                "by_topic": {},
                "by_engagement_level": {},
                "quiz_performance": {
                    "average_score": 0,
                    "by_subject": {}
                },
                "recommendations": []
            }
        
        # Calculate metrics
        total_activities = len(records)
        total_time_seconds = sum(r.get("duration_seconds", 0) or 0 for r in records)
        completion_values = [r.get("completion_percentage", 0) or 0 for r in records]
        average_completion = sum(completion_values) / len(completion_values) if completion_values else 0
        
        # Count by various criteria
        by_activity_type = {}
        by_subject = {}
        by_topic = {}
        by_engagement_level = {}
        
        # Quiz performance
        quiz_records = [r for r in records if r.get("activity_type") == "quiz"]
        quiz_scores = []
        quiz_by_subject = {}
        
        for record in records:
            # By activity type
            activity_type = record.get("activity_type", "Unknown")
            by_activity_type[activity_type] = by_activity_type.get(activity_type, 0) + 1
            
            # By subject
            subject = record.get("subject", "Unknown")
            by_subject[subject] = by_subject.get(subject, 0) + 1
            
            # By topic
            topic = record.get("topic", "Unknown")
            by_topic[topic] = by_topic.get(topic, 0) + 1
            
            # By engagement level
            level = record.get("engagement_level", "Unknown")
            if level != "Unknown":
                by_engagement_level[level] = by_engagement_level.get(level, 0) + 1
            
            # Quiz performance
            if record.get("activity_type") == "quiz":
                correct = record.get("correct_answers", 0) or 0
                total = record.get("total_questions", 0) or 0
                if total > 0:
                    score = (correct / total) * 100
                    quiz_scores.append(score)
                    
                    # By subject
                    subject = record.get("subject", "Unknown")
                    if subject not in quiz_by_subject:
                        quiz_by_subject[subject] = []
                    quiz_by_subject[subject].append(score)
        
        # Calculate average quiz scores by subject
        quiz_by_subject_avg = {}
        for subject, scores in quiz_by_subject.items():
            quiz_by_subject_avg[subject] = sum(scores) / len(scores) if scores else 0
        
        # Generate recommendations
        recommendations = []
        
        # If engagement is low, recommend more engaging activities
        if by_engagement_level.get("low", 0) > by_engagement_level.get("high", 0):
            recommendations.append("Consider more interactive activities to increase engagement.")
        
        # If quiz performance is low in a subject, recommend additional support
        for subject, avg_score in quiz_by_subject_avg.items():
            if avg_score < 70:
                recommendations.append(f"Provide additional support for {subject} as quiz performance is below 70%.")
        
        # If completion rates are low, recommend shorter activities
        if average_completion < 80:
            recommendations.append("Consider shorter activities to improve completion rates.")
        
        # Return the analysis
        return {
            "total_activities": total_activities,
            "total_time_seconds": total_time_seconds,
            "average_completion": average_completion,
            "by_activity_type": by_activity_type,
            "by_subject": by_subject,
            "by_topic": by_topic,
            "by_engagement_level": by_engagement_level,
            "quiz_performance": {
                "average_score": sum(quiz_scores) / len(quiz_scores) if quiz_scores else 0,
                "by_subject": quiz_by_subject_avg
            },
            "recommendations": recommendations
        }
    except Exception as e:
        logger.error(f"Error analyzing engagement: {str(e)}")
        return {}


def generate_engagement_visualization(analysis: Dict[str, Any], output_format: str = "base64") -> Optional[str]:
    """
    Generate a visualization of engagement analysis.
    
    Args:
        analysis: Dictionary containing analysis results
        output_format: Format of the output (base64, file)
        
    Returns:
        Base64-encoded image or file path, depending on output_format
    """
    try:
        # Create a figure with subplots
        fig, axs = plt.subplots(2, 2, figsize=(12, 10))
        
        # Plot activities by type
        by_activity_type = analysis.get("by_activity_type", {})
        if by_activity_type:
            types = list(by_activity_type.keys())
            counts = list(by_activity_type.values())
            axs[0, 0].bar(types, counts)
            axs[0, 0].set_title("Activities by Type")
            axs[0, 0].set_xlabel("Activity Type")
            axs[0, 0].set_ylabel("Number of Activities")
            axs[0, 0].tick_params(axis='x', rotation=45)
        
        # Plot activities by subject
        by_subject = analysis.get("by_subject", {})
        if by_subject:
            subjects = list(by_subject.keys())
            counts = list(by_subject.values())
            axs[0, 1].bar(subjects, counts)
            axs[0, 1].set_title("Activities by Subject")
            axs[0, 1].set_xlabel("Subject")
            axs[0, 1].set_ylabel("Number of Activities")
            axs[0, 1].tick_params(axis='x', rotation=45)
        
        # Plot engagement levels
        by_engagement_level = analysis.get("by_engagement_level", {})
        if by_engagement_level:
            levels = list(by_engagement_level.keys())
            counts = list(by_engagement_level.values())
            axs[1, 0].bar(levels, counts)
            axs[1, 0].set_title("Engagement Levels")
            axs[1, 0].set_xlabel("Engagement Level")
            axs[1, 0].set_ylabel("Number of Activities")
        
        # Plot quiz performance by subject
        quiz_performance = analysis.get("quiz_performance", {})
        by_subject = quiz_performance.get("by_subject", {})
        if by_subject:
            subjects = list(by_subject.keys())
            scores = list(by_subject.values())
            axs[1, 1].bar(subjects, scores)
            axs[1, 1].set_title("Quiz Performance by Subject")
            axs[1, 1].set_xlabel("Subject")
            axs[1, 1].set_ylabel("Average Score (%)")
            axs[1, 1].set_ylim(0, 100)
            axs[1, 1].tick_params(axis='x', rotation=45)
        
        # Adjust layout
        plt.tight_layout()
        
        # Return the visualization
        if output_format == "base64":
            # Save to a BytesIO object
            buf = BytesIO()
            plt.savefig(buf, format="png")
            buf.seek(0)
            
            # Convert to base64
            img_str = base64.b64encode(buf.read()).decode("utf-8")
            plt.close(fig)
            return img_str
        else:
            # Save to a file
            file_path = f"/tmp/engagement_{uuid.uuid4().hex[:8]}.png"
            plt.savefig(file_path)
            plt.close(fig)
            return file_path
    except Exception as e:
        logger.error(f"Error generating engagement visualization: {str(e)}")
        return None


# --- Analytics Report Service Functions ---

def create_analytics_report(report_type: str,
                          title: str,
                          description: str,
                          target_id: str,
                          target_type: str,
                          time_period: str,
                          data: Dict[str, Any],
                          visualizations: List[Dict[str, Any]] = None,
                          insights: List[str] = None,
                          recommendations: List[str] = None,
                          created_by: str = None) -> Optional[Dict[str, Any]]:
    """
    Create an analytics report.
    
    Args:
        report_type: Type of report (learning_gaps, engagement, progress, etc.)
        title: Title of the report
        description: Description of the report
        target_id: ID of the target (student, class, school, etc.)
        target_type: Type of the target (student, class, school, etc.)
        time_period: Time period covered by the report
        data: Raw data for the report
        visualizations: Optional list of visualizations included in the report
        insights: Optional list of insights derived from the data
        recommendations: Optional list of recommendations based on the insights
        created_by: Optional ID of the user who created the report
        
    Returns:
        Dictionary containing the created report or None if failed
    """
    try:
        # Generate a unique report ID
        report_id = f"report_{uuid.uuid4().hex[:12]}"
        
        # Create the report
        report = AnalyticsReport(
            id=report_id,
            report_type=report_type,
            title=title,
            description=description,
            target_id=target_id,
            target_type=target_type,
            time_period=time_period,
            data=data,
            visualizations=visualizations,
            insights=insights,
            recommendations=recommendations,
            created_by=created_by
        )
        
        # Convert to dictionary for storage
        report_dict = report.to_dict()
        
        # TODO: Store in database using persistence manager
        # For now, we'll just return the dictionary
        return report_dict
    except Exception as e:
        logger.error(f"Error creating analytics report: {str(e)}")
        return None


def get_analytics_reports(target_id: str = None, target_type: str = None,
                        report_type: str = None) -> List[Dict[str, Any]]:
    """
    Get analytics reports, optionally filtered by various criteria.
    
    Args:
        target_id: Optional ID of the target
        target_type: Optional type of the target
        report_type: Optional type of report
        
    Returns:
        List of report dictionaries
    """
    try:
        # TODO: Retrieve from database using persistence manager
        # For now, we'll return an empty list
        return []
    except Exception as e:
        logger.error(f"Error getting analytics reports: {str(e)}")
        return []


def generate_comprehensive_report(student_id: str = None, class_id: str = None,
                                time_period: str = "last_month") -> Optional[Dict[str, Any]]:
    """
    Generate a comprehensive analytics report for a student or class.
    
    Args:
        student_id: Optional ID of the student
        class_id: Optional ID of the class
        time_period: Time period for the report (last_week, last_month, last_term, etc.)
        
    Returns:
        Dictionary containing the comprehensive report or None if failed
    """
    try:
        # Determine target type and ID
        if student_id:
            target_type = "student"
            target_id = student_id
            title = f"Comprehensive Student Report"
            description = f"Comprehensive analytics report for student {student_id} for {time_period}"
        elif class_id:
            target_type = "class"
            target_id = class_id
            title = f"Comprehensive Class Report"
            description = f"Comprehensive analytics report for class {class_id} for {time_period}"
        else:
            logger.error("Either student_id or class_id must be provided")
            return None
        
        # Get learning gaps analysis
        learning_gaps_analysis = analyze_learning_gaps(student_id=student_id, class_id=class_id)
        
        # Get engagement analysis
        engagement_analysis = analyze_engagement(student_id=student_id, class_id=class_id)
        
        # Generate visualizations
        visualizations = []
        
        # Learning gaps visualization
        learning_gaps_viz = generate_learning_gaps_visualization(learning_gaps_analysis)
        if learning_gaps_viz:
            visualizations.append({
                "type": "learning_gaps",
                "format": "base64",
                "data": learning_gaps_viz
            })
        
        # Engagement visualization
        engagement_viz = generate_engagement_visualization(engagement_analysis)
        if engagement_viz:
            visualizations.append({
                "type": "engagement",
                "format": "base64",
                "data": engagement_viz
            })
        
        # Combine insights and recommendations
        insights = []
        recommendations = []
        
        # Add learning gaps insights and recommendations
        if learning_gaps_analysis.get("total_gaps", 0) > 0:
            insights.append(f"Identified {learning_gaps_analysis.get('total_gaps')} learning gaps.")
            
            # Add subject-specific insights
            by_subject = learning_gaps_analysis.get("by_subject", {})
            if by_subject:
                max_subject = max(by_subject.items(), key=lambda x: x[1]) if by_subject else ("", 0)
                if max_subject[1] > 0:
                    insights.append(f"Most learning gaps are in {max_subject[0]} ({max_subject[1]} gaps).")
            
            # Add recommendations
            recommendations.extend(learning_gaps_analysis.get("recommendations", []))
        
        # Add engagement insights and recommendations
        if engagement_analysis.get("total_activities", 0) > 0:
            insights.append(f"Engaged with {engagement_analysis.get('total_activities')} activities.")
            
            # Add engagement level insights
            by_engagement_level = engagement_analysis.get("by_engagement_level", {})
            if by_engagement_level:
                high_engagement = by_engagement_level.get("high", 0)
                low_engagement = by_engagement_level.get("low", 0)
                if high_engagement > low_engagement:
                    insights.append(f"Shows high engagement with {high_engagement} activities.")
                elif low_engagement > 0:
                    insights.append(f"Shows low engagement with {low_engagement} activities.")
            
            # Add quiz performance insights
            quiz_performance = engagement_analysis.get("quiz_performance", {})
            average_score = quiz_performance.get("average_score", 0)
            if average_score > 0:
                insights.append(f"Average quiz score is {average_score:.1f}%.")
                
                # Add subject-specific insights
                by_subject = quiz_performance.get("by_subject", {})
                if by_subject:
                    min_subject = min(by_subject.items(), key=lambda x: x[1]) if by_subject else ("", 0)
                    max_subject = max(by_subject.items(), key=lambda x: x[1]) if by_subject else ("", 0)
                    if min_subject[1] > 0 and max_subject[1] > 0 and min_subject[0] != max_subject[0]:
                        insights.append(f"Strongest quiz performance in {max_subject[0]} ({max_subject[1]:.1f}%).")
                        insights.append(f"Weakest quiz performance in {min_subject[0]} ({min_subject[1]:.1f}%).")
            
            # Add recommendations
            recommendations.extend(engagement_analysis.get("recommendations", []))
        
        # Create the comprehensive report
        report_data = {
            "learning_gaps": learning_gaps_analysis,
            "engagement": engagement_analysis
        }
        
        # Create the report
        report = create_analytics_report(
            report_type="comprehensive",
            title=title,
            description=description,
            target_id=target_id,
            target_type=target_type,
            time_period=time_period,
            data=report_data,
            visualizations=visualizations,
            insights=insights,
            recommendations=recommendations
        )
        
        return report
    except Exception as e:
        logger.error(f"Error generating comprehensive report: {str(e)}")
        return None
