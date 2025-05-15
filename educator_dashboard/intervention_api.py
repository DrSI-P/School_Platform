"""
API endpoints for the Intervention Tracking System.

This module defines the routes for accessing intervention tracking functionality.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import MessageResponse
from .services import get_intervention_tracking_system

# Create Blueprint for intervention tracking
interventions_bp = Blueprint('interventions', __name__)

@interventions_bp.route("/plans", methods=["GET"])
@jwt_required()
def get_educator_intervention_plans():
    """
    Get all intervention plans created by the current educator.
    
    Returns:
        JSON response with list of intervention plans
    """
    educator_id = get_jwt_identity()
    try:
        intervention_system = get_intervention_tracking_system()
        plans = intervention_system.get_educator_intervention_plans(educator_id)
        return jsonify([plan.dict() for plan in plans]), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving intervention plans: {str(e)}"}), 500

@interventions_bp.route("/plans/student/<string:student_id>", methods=["GET"])
@jwt_required()
def get_student_intervention_plans(student_id):
    """
    Get all intervention plans for a specific student.
    
    Args:
        student_id: ID of the student
        
    Returns:
        JSON response with list of intervention plans for the student
    """
    try:
        intervention_system = get_intervention_tracking_system()
        plans = intervention_system.get_student_intervention_plans(student_id)
        return jsonify([plan.dict() for plan in plans]), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving student intervention plans: {str(e)}"}), 500

@interventions_bp.route("/plans/<string:plan_id>", methods=["GET"])
@jwt_required()
def get_intervention_plan(plan_id):
    """
    Get a specific intervention plan by ID.
    
    Args:
        plan_id: ID of the intervention plan
        
    Returns:
        JSON response with the intervention plan details
    """
    try:
        intervention_system = get_intervention_tracking_system()
        plan = intervention_system.get_intervention_plan(plan_id)
        if not plan:
            return jsonify({"message": "Intervention plan not found"}), 404
        return jsonify(plan.dict()), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving intervention plan: {str(e)}"}), 500

@interventions_bp.route("/plans", methods=["POST"])
@jwt_required()
def create_intervention_plan():
    """
    Create a new intervention plan.
    
    Request body:
        JSON object with intervention plan details
        
    Returns:
        JSON response with the created intervention plan
    """
    educator_id = get_jwt_identity()
    try:
        plan_data = request.json
        plan_data["created_by"] = educator_id
        
        intervention_system = get_intervention_tracking_system()
        plan = intervention_system.create_intervention_plan(plan_data)
        return jsonify(plan.dict()), 201
    except Exception as e:
        return jsonify({"message": f"Error creating intervention plan: {str(e)}"}), 500

@interventions_bp.route("/plans/<string:plan_id>", methods=["PUT"])
@jwt_required()
def update_intervention_plan(plan_id):
    """
    Update an existing intervention plan.
    
    Args:
        plan_id: ID of the intervention plan to update
        
    Request body:
        JSON object with fields to update
        
    Returns:
        JSON response with the updated intervention plan
    """
    try:
        updates = request.json
        intervention_system = get_intervention_tracking_system()
        plan = intervention_system.update_intervention_plan(plan_id, updates)
        if not plan:
            return jsonify({"message": "Intervention plan not found"}), 404
        return jsonify(plan.dict()), 200
    except Exception as e:
        return jsonify({"message": f"Error updating intervention plan: {str(e)}"}), 500

@interventions_bp.route("/plans/<string:plan_id>/goals", methods=["POST"])
@jwt_required()
def add_goal_to_plan(plan_id):
    """
    Add a new goal to an intervention plan.
    
    Args:
        plan_id: ID of the intervention plan
        
    Request body:
        JSON object with goal details
        
    Returns:
        JSON response with the updated intervention plan
    """
    try:
        goal_data = request.json
        intervention_system = get_intervention_tracking_system()
        plan = intervention_system.add_goal_to_plan(plan_id, goal_data)
        if not plan:
            return jsonify({"message": "Intervention plan not found"}), 404
        return jsonify(plan.dict()), 200
    except Exception as e:
        return jsonify({"message": f"Error adding goal to plan: {str(e)}"}), 500

@interventions_bp.route("/plans/<string:plan_id>/goals/<string:goal_id>/status", methods=["PUT"])
@jwt_required()
def update_goal_status(plan_id, goal_id):
    """
    Update the status of a goal in an intervention plan.
    
    Args:
        plan_id: ID of the intervention plan
        goal_id: ID of the goal to update
        
    Request body:
        JSON object with status and optional note
        
    Returns:
        JSON response with the updated intervention plan
    """
    try:
        data = request.json
        status = data.get("status")
        note = data.get("note")
        
        if not status:
            return jsonify({"message": "Status is required"}), 400
        
        intervention_system = get_intervention_tracking_system()
        plan = intervention_system.update_goal_status(plan_id, goal_id, status, note)
        if not plan:
            return jsonify({"message": "Intervention plan or goal not found"}), 404
        return jsonify(plan.dict()), 200
    except Exception as e:
        return jsonify({"message": f"Error updating goal status: {str(e)}"}), 500

@interventions_bp.route("/plans/<string:plan_id>/strategies", methods=["POST"])
@jwt_required()
def add_strategy_to_plan(plan_id):
    """
    Add a new strategy to an intervention plan.
    
    Args:
        plan_id: ID of the intervention plan
        
    Request body:
        JSON object with strategy details
        
    Returns:
        JSON response with the updated intervention plan
    """
    try:
        strategy_data = request.json
        intervention_system = get_intervention_tracking_system()
        plan = intervention_system.add_strategy_to_plan(plan_id, strategy_data)
        if not plan:
            return jsonify({"message": "Intervention plan not found"}), 404
        return jsonify(plan.dict()), 200
    except Exception as e:
        return jsonify({"message": f"Error adding strategy to plan: {str(e)}"}), 500

@interventions_bp.route("/plans/<string:plan_id>/notes", methods=["POST"])
@jwt_required()
def add_plan_note(plan_id):
    """
    Add a general note to an intervention plan.
    
    Args:
        plan_id: ID of the intervention plan
        
    Request body:
        JSON object with note text
        
    Returns:
        JSON response with the updated intervention plan
    """
    try:
        data = request.json
        note = data.get("note")
        
        if not note:
            return jsonify({"message": "Note text is required"}), 400
        
        intervention_system = get_intervention_tracking_system()
        plan = intervention_system.add_plan_note(plan_id, note)
        if not plan:
            return jsonify({"message": "Intervention plan not found"}), 404
        return jsonify(plan.dict()), 200
    except Exception as e:
        return jsonify({"message": f"Error adding note to plan: {str(e)}"}), 500

@interventions_bp.route("/plans/<string:plan_id>/complete", methods=["PUT"])
@jwt_required()
def complete_intervention_plan(plan_id):
    """
    Mark an intervention plan as completed.
    
    Args:
        plan_id: ID of the intervention plan
        
    Request body:
        JSON object with optional completion note
        
    Returns:
        JSON response with the updated intervention plan
    """
    try:
        data = request.json
        completion_note = data.get("note")
        
        intervention_system = get_intervention_tracking_system()
        plan = intervention_system.complete_intervention_plan(plan_id, completion_note)
        if not plan:
            return jsonify({"message": "Intervention plan not found"}), 404
        return jsonify(plan.dict()), 200
    except Exception as e:
        return jsonify({"message": f"Error completing intervention plan: {str(e)}"}), 500

@interventions_bp.route("/plans/<string:plan_id>/effectiveness", methods=["GET"])
@jwt_required()
def get_intervention_effectiveness(plan_id):
    """
    Generate a report on the effectiveness of an intervention plan.
    
    Args:
        plan_id: ID of the intervention plan
        
    Returns:
        JSON response with effectiveness metrics and insights
    """
    try:
        intervention_system = get_intervention_tracking_system()
        report = intervention_system.generate_intervention_effectiveness_report(plan_id)
        if "error" in report:
            return jsonify({"message": report["error"]}), 404
        return jsonify(report), 200
    except Exception as e:
        return jsonify({"message": f"Error generating effectiveness report: {str(e)}"}), 500

@interventions_bp.route("/plans/active", methods=["GET"])
@jwt_required()
def get_active_intervention_plans():
    """
    Get all active intervention plans.
    
    Returns:
        JSON response with list of active intervention plans
    """
    try:
        intervention_system = get_intervention_tracking_system()
        plans = intervention_system.get_active_intervention_plans()
        return jsonify([plan.dict() for plan in plans]), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving active intervention plans: {str(e)}"}), 500

@interventions_bp.route("/plans/area/<string:area>", methods=["GET"])
@jwt_required()
def get_intervention_plans_by_area(area):
    """
    Get intervention plans addressing a specific area of concern.
    
    Args:
        area: Area of concern to filter by
        
    Returns:
        JSON response with list of matching intervention plans
    """
    try:
        intervention_system = get_intervention_tracking_system()
        plans = intervention_system.get_intervention_plans_by_area(area)
        return jsonify([plan.dict() for plan in plans]), 200
    except Exception as e:
        return jsonify({"message": f"Error retrieving intervention plans by area: {str(e)}"}), 500
