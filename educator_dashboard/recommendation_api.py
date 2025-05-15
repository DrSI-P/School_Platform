"""
API endpoints for the Personalized Learning Recommendations feature.

This module defines the routes for accessing recommendation functionality.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import (
    StudentRecommendationsResponse,
    MessageResponse
)
from .recommendation_services import (
    get_student_recommendations,
    get_class_recommendations
)

# Create Blueprint for recommendations
recommendations_bp = Blueprint('recommendations', __name__, url_prefix='/recommendations')

@recommendations_bp.route("/students/<string:student_id>", methods=["GET"])
@jwt_required()
def get_recommendations_for_student(student_id: str):
    """
    Get personalized learning recommendations for a specific student.
    
    Args:
        student_id: ID of the student to get recommendations for
        
    Returns:
        JSON response with personalized recommendations
    """
    educator_id = get_jwt_identity()
    try:
        recommendations_data = get_student_recommendations(student_id, educator_id)
        if recommendations_data:
            return jsonify(StudentRecommendationsResponse(**recommendations_data).dict()), 200
        return jsonify(MessageResponse(message="Failed to generate recommendations").dict()), 404
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error generating recommendations: {str(e)}").dict()), 500

@recommendations_bp.route("/class", methods=["GET"])
@jwt_required()
def get_recommendations_for_class():
    """
    Get class-wide recommendations and insights for an educator's students.
    
    Returns:
        JSON response with class-wide recommendations and insights
    """
    educator_id = get_jwt_identity()
    try:
        class_recommendations = get_class_recommendations(educator_id)
        return jsonify(class_recommendations), 200
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error generating class recommendations: {str(e)}").dict()), 500
