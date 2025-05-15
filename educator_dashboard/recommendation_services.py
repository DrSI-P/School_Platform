"""
Service functions for the Personalized Learning Recommendations feature.

This module integrates the recommendation engine with the educator dashboard.
"""

import logging
from typing import List, Dict, Any, Optional
import datetime
import sys
sys.path.append("..")  # Add parent directory to path
from recommendation_engine import RecommendationEngine, get_mock_available_content
from persistence_manager import get_full_learner_profile_data

# Setup logging
logger = logging.getLogger(__name__)

# Initialize recommendation engine
recommendation_engine = RecommendationEngine()

def get_student_recommendations(student_id: str, educator_id: str) -> Dict[str, Any]:
    """
    Generate personalized learning recommendations for a specific student.
    
    Args:
        student_id: ID of the student to generate recommendations for
        educator_id: ID of the requesting educator (for access control)
        
    Returns:
        Dictionary containing student information and recommendations
    """
    logger.info(f"Generating recommendations for student {student_id} requested by educator {educator_id}")
    
    # Get student profile data
    student_profile = get_full_learner_profile_data(student_id)
    if not student_profile:
        logger.error(f"Failed to retrieve profile data for student {student_id}")
        return None
    
    # Extract relevant data for recommendation generation
    completed_los = [lo["lo_id"] for lo in student_profile.get("learning_objective_progress", []) 
                    if lo["status"] == "completed"]
    
    in_progress_los = [lo["lo_id"] for lo in student_profile.get("learning_objective_progress", []) 
                      if lo["status"] == "in_progress"]
    
    learning_preferences = [{"category": p["category"], "value": p["value"]} 
                           for p in student_profile.get("preferences", [])]
    
    interests = [i["interest_name"] for i in student_profile.get("interests", [])]
    
    struggle_areas = [s["struggle_description"] for s in student_profile.get("struggles", [])]
    
    recent_activities = [
        {
            "activity_id": a["activity_id"],
            "lo_id": a["lo_id"],
            "activity_type": a["activity_type"],
            "score": a.get("score"),
            "completed": a["completed"],
            "timestamp": a.get("timestamp"),
            "attempt_details": a.get("attempt_details")
        }
        for a in student_profile.get("activity_attempts", [])
    ]
    
    # Get available content (in production, this would come from a content repository)
    available_content = get_mock_available_content()
    
    # Generate recommendations
    recommendations = recommendation_engine.generate_recommendations(
        student_id=student_id,
        student_profile=student_profile,
        completed_los=completed_los,
        in_progress_los=in_progress_los,
        learning_preferences=learning_preferences,
        interests=interests,
        struggle_areas=struggle_areas,
        recent_activities=recent_activities,
        available_content=available_content
    )
    
    # Prepare response
    response = {
        "student_id": student_id,
        "student_name": f"Student {student_id.split('_')[-1]}",  # In production, get actual name
        "recommendations": recommendations,
        "generated_at": datetime.datetime.utcnow().isoformat()
    }
    
    return response

def get_class_recommendations(educator_id: str) -> Dict[str, Any]:
    """
    Generate class-wide recommendations for an educator's students.
    
    Args:
        educator_id: ID of the requesting educator
        
    Returns:
        Dictionary containing class-wide recommendations and insights
    """
    # This would be implemented to provide class-level insights and recommendations
    # For now, return a placeholder response
    return {
        "educator_id": educator_id,
        "class_insights": [
            {
                "insight_type": "common_struggle",
                "description": "Several students are struggling with apostrophe usage",
                "affected_students": 5,
                "recommended_resources": [
                    {
                        "content_id": "content_006",
                        "title": "Mastering Apostrophes for Possession",
                        "description": "Learn how to use apostrophes correctly to show possession with singular and plural nouns.",
                        "format": "video"
                    }
                ]
            },
            {
                "insight_type": "learning_gap",
                "description": "Class shows uneven progress in reading comprehension skills",
                "affected_students": 8,
                "recommended_group_activities": [
                    {
                        "activity_id": "group_001",
                        "title": "Collaborative Reading Circle",
                        "description": "Students work in groups to analyze and discuss text passages, focusing on inference and prediction skills.",
                        "format": "group_activity"
                    }
                ]
            }
        ],
        "generated_at": datetime.datetime.utcnow().isoformat()
    }
