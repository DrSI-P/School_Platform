"""
Assessment tools API for the Educator Dashboard.

This module provides API functions for the Collaborative Assessment Tools.
"""

from typing import Dict, List, Optional, Any, Union
import datetime
import logging

# Import the CollaborativeAssessmentTools class
from edpsychconnect_dala_prototype.educator_dashboard.assessment_tools import (
    CollaborativeAssessmentTools, 
    Assessment,
    AssessmentQuestion,
    AssessmentAttempt,
    StudentResponse,
    AssessmentAnalytics
)

# Import the persistence manager
from edpsychconnect_dala_prototype.persistence_manager import persistence_manager

# Initialize the collaborative assessment tools with the persistence manager
assessment_tools = CollaborativeAssessmentTools(persistence_manager)

# Setup logging
logger = logging.getLogger(__name__)

# Export top-level functions that wrap the CollaborativeAssessmentTools methods

def create_assessment(title: str, description: str, created_by: str, questions: List[Dict[str, Any]], 
                     subject: Optional[str] = None, grade_level: Optional[str] = None, 
                     time_limit_minutes: Optional[int] = None, passing_score: Optional[int] = None,
                     tags: List[str] = None, learning_objectives: List[str] = None) -> str:
    """
    Create a new assessment.
    
    Args:
        title: Title of the assessment
        description: Description of the assessment
        created_by: ID of the educator creating the assessment
        questions: List of question dictionaries
        subject: Optional subject of the assessment
        grade_level: Optional grade level of the assessment
        time_limit_minutes: Optional time limit in minutes
        passing_score: Optional passing score
        tags: Optional list of tags
        learning_objectives: Optional list of learning objective IDs
        
    Returns:
        ID of the created assessment
    """
    assessment_data = {
        "title": title,
        "description": description,
        "created_by": created_by,
        "questions": questions,
        "status": "draft"
    }
    
    if subject:
        assessment_data["subject"] = subject
    if grade_level:
        assessment_data["grade_level"] = grade_level
    if time_limit_minutes:
        assessment_data["time_limit_minutes"] = time_limit_minutes
    if passing_score:
        assessment_data["passing_score"] = passing_score
    if tags:
        assessment_data["tags"] = tags
    if learning_objectives:
        assessment_data["learning_objectives"] = learning_objectives
    
    assessment = assessment_tools.create_assessment(assessment_data)
    return assessment.id

def get_assessment(assessment_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve an assessment by ID.
    
    Args:
        assessment_id: ID of the assessment to retrieve
        
    Returns:
        Dictionary containing assessment details or None if not found
    """
    assessment = assessment_tools.get_assessment(assessment_id)
    if assessment:
        return assessment.dict()
    return None

def get_educator_assessments(educator_id: str) -> List[Dict[str, Any]]:
    """
    Retrieve all assessments created by a specific educator.
    
    Args:
        educator_id: ID of the educator
        
    Returns:
        List of assessment dictionaries
    """
    assessments = assessment_tools.get_educator_assessments(educator_id)
    return [assessment.dict() for assessment in assessments]

def get_shared_assessments(educator_id: str) -> List[Dict[str, Any]]:
    """
    Retrieve all assessments shared with a specific educator.
    
    Args:
        educator_id: ID of the educator
        
    Returns:
        List of assessment dictionaries
    """
    assessments = assessment_tools.get_shared_assessments(educator_id)
    return [assessment.dict() for assessment in assessments]

def update_assessment(assessment_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Update an existing assessment.
    
    Args:
        assessment_id: ID of the assessment to update
        updates: Dictionary of fields to update
        
    Returns:
        Dictionary containing updated assessment details or None if not found
    """
    assessment = assessment_tools.update_assessment(assessment_id, updates)
    if assessment:
        return assessment.dict()
    return None

def share_assessment(assessment_id: str, educator_ids: List[str]) -> Optional[Dict[str, Any]]:
    """
    Share an assessment with other educators.
    
    Args:
        assessment_id: ID of the assessment to share
        educator_ids: List of educator IDs to share with
        
    Returns:
        Dictionary containing updated assessment details or None if not found
    """
    assessment = assessment_tools.share_assessment(assessment_id, educator_ids)
    if assessment:
        return assessment.dict()
    return None

def publish_assessment(assessment_id: str) -> Optional[Dict[str, Any]]:
    """
    Publish an assessment, making it available for students.
    
    Args:
        assessment_id: ID of the assessment to publish
        
    Returns:
        Dictionary containing updated assessment details or None if not found
    """
    assessment = assessment_tools.publish_assessment(assessment_id)
    if assessment:
        return assessment.dict()
    return None

def archive_assessment(assessment_id: str) -> Optional[Dict[str, Any]]:
    """
    Archive an assessment, making it inactive.
    
    Args:
        assessment_id: ID of the assessment to archive
        
    Returns:
        Dictionary containing updated assessment details or None if not found
    """
    assessment = assessment_tools.archive_assessment(assessment_id)
    if assessment:
        return assessment.dict()
    return None

def add_question_to_assessment(assessment_id: str, question_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Add a new question to an assessment.
    
    Args:
        assessment_id: ID of the assessment
        question_data: Dictionary containing question details
        
    Returns:
        Dictionary containing updated assessment details or None if not found
    """
    assessment = assessment_tools.add_question_to_assessment(assessment_id, question_data)
    if assessment:
        return assessment.dict()
    return None

def update_question(assessment_id: str, question_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Update a question in an assessment.
    
    Args:
        assessment_id: ID of the assessment
        question_id: ID of the question to update
        updates: Dictionary of fields to update
        
    Returns:
        Dictionary containing updated assessment details or None if not found
    """
    assessment = assessment_tools.update_question(assessment_id, question_id, updates)
    if assessment:
        return assessment.dict()
    return None

def remove_question(assessment_id: str, question_id: str) -> Optional[Dict[str, Any]]:
    """
    Remove a question from an assessment.
    
    Args:
        assessment_id: ID of the assessment
        question_id: ID of the question to remove
        
    Returns:
        Dictionary containing updated assessment details or None if not found
    """
    assessment = assessment_tools.remove_question(assessment_id, question_id)
    if assessment:
        return assessment.dict()
    return None

def create_assessment_attempt(assessment_id: str, student_id: str) -> str:
    """
    Create a new assessment attempt for a student.
    
    Args:
        assessment_id: ID of the assessment
        student_id: ID of the student
        
    Returns:
        ID of the created assessment attempt
    """
    attempt_data = {
        "assessment_id": assessment_id,
        "student_id": student_id,
        "status": "in_progress",
        "responses": []
    }
    attempt = assessment_tools.create_assessment_attempt(attempt_data)
    return attempt.id

def get_assessment_attempt(attempt_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve an assessment attempt by ID.
    
    Args:
        attempt_id: ID of the assessment attempt to retrieve
        
    Returns:
        Dictionary containing assessment attempt details or None if not found
    """
    attempt = assessment_tools.get_assessment_attempt(attempt_id)
    if attempt:
        return attempt.dict()
    return None

def get_student_assessment_attempts(student_id: str, assessment_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Retrieve all assessment attempts for a specific student.
    
    Args:
        student_id: ID of the student
        assessment_id: Optional ID of a specific assessment
        
    Returns:
        List of assessment attempt dictionaries
    """
    attempts = assessment_tools.get_student_assessment_attempts(student_id, assessment_id)
    return [attempt.dict() for attempt in attempts]

def submit_assessment_attempt(assessment_id: str, student_id: str, answers: List[Dict[str, Any]]) -> Optional[str]:
    """
    Submit a completed assessment attempt.
    
    Args:
        assessment_id: ID of the assessment
        student_id: ID of the student
        answers: List of answer dictionaries with question_index and answer
        
    Returns:
        ID of the submitted assessment attempt or None if failed
    """
    # Create a new attempt
    attempt_data = {
        "assessment_id": assessment_id,
        "student_id": student_id,
        "status": "completed",
        "completed_at": datetime.datetime.now(),
        "responses": []
    }
    
    # Get the assessment to access questions
    assessment = assessment_tools.get_assessment(assessment_id)
    if not assessment:
        logger.warning(f"Assessment {assessment_id} not found")
        return None
    
    # Process answers
    total_score = 0
    for answer in answers:
        question_index = answer.get("question_index")
        if question_index is None or question_index < 0 or question_index >= len(assessment.questions):
            logger.warning(f"Invalid question index: {question_index}")
            continue
        
        question = assessment.questions[question_index]
        response_data = {
            "question_id": question.id,
            "response": answer.get("answer")
        }
        
        # Auto-grade if possible
        if question.correct_answer is not None:
            if isinstance(question.correct_answer, list):
                is_correct = response_data["response"] in question.correct_answer
            else:
                is_correct = response_data["response"] == question.correct_answer
            
            response_data["score"] = question.points if is_correct else 0
            total_score += response_data["score"]
        
        attempt_data["responses"].append(response_data)
    
    # Calculate percentage score if all questions have been graded
    if all(response.get("score") is not None for response in attempt_data["responses"]):
        total_possible = sum(question.points for question in assessment.questions)
        attempt_data["total_score"] = total_score
        attempt_data["percentage_score"] = (total_score / total_possible) * 100 if total_possible > 0 else 0
    
    # Create the attempt
    attempt = assessment_tools.create_assessment_attempt(attempt_data)
    return attempt.id

def grade_assessment_attempt(attempt_id: str, grades: List[Dict[str, Any]], graded_by: str) -> Optional[Dict[str, Any]]:
    """
    Grade an assessment attempt.
    
    Args:
        attempt_id: ID of the assessment attempt
        grades: List of grade dictionaries with question_id, score, and feedback
        graded_by: ID of the educator grading the attempt
        
    Returns:
        Dictionary containing updated assessment attempt details or None if not found
    """
    # Get the current attempt
    attempt = assessment_tools.get_assessment_attempt(attempt_id)
    if not attempt:
        logger.warning(f"Assessment attempt {attempt_id} not found")
        return None
    
    # Update responses with grades
    updates = {
        "graded_by": graded_by,
        "graded_at": datetime.datetime.now()
    }
    
    total_score = 0
    for grade in grades:
        question_id = grade.get("question_id")
        score = grade.get("score")
        feedback = grade.get("feedback")
        
        # Find the response for this question
        for i, response in enumerate(attempt.responses):
            if response.question_id == question_id:
                attempt.responses[i].score = score
                attempt.responses[i].feedback = feedback
                total_score += score
                break
    
    # Calculate total and percentage score
    assessment = assessment_tools.get_assessment(attempt.assessment_id)
    if assessment:
        total_possible = sum(question.points for question in assessment.questions)
        updates["total_score"] = total_score
        updates["percentage_score"] = (total_score / total_possible) * 100 if total_possible > 0 else 0
    
    # Update the attempt
    updated_attempt = assessment_tools.update_assessment_attempt(attempt_id, updates)
    if updated_attempt:
        return updated_attempt.dict()
    return None

def get_assessment_analytics(assessment_id: str) -> Optional[Dict[str, Any]]:
    """
    Get analytics for an assessment.
    
    Args:
        assessment_id: ID of the assessment
        
    Returns:
        Dictionary containing assessment analytics or None if not found
    """
    analytics = assessment_tools.get_assessment_analytics(assessment_id)
    if analytics:
        return analytics.dict()
    return None

def get_class_assessment_analytics(class_id: str) -> List[Dict[str, Any]]:
    """
    Get analytics for all assessments taken by a class.
    
    Args:
        class_id: ID of the class
        
    Returns:
        List of assessment analytics dictionaries
    """
    analytics_list = assessment_tools.get_class_assessment_analytics(class_id)
    return [analytics.dict() for analytics in analytics_list]
