# educator_dashboard/api.py
"""
API endpoint definitions for the Educator Dashboard.
Uses Flask Blueprints to organize routes.
"""

from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from .services import (
    authenticate_educator, get_dashboard_overview_data, 
    get_student_list_data, get_student_detail_data,
    add_student_note_data, get_student_notes_data,
    get_curriculum_progress_data, get_lo_student_progress_data,
    get_learning_gaps_data, get_activity_engagement_data,
    generate_student_report_data, generate_class_report_data
)
from .models import (
    LoginRequest, AuthSuccessResponse, TokenData, EducatorResponse,
    DashboardOverviewResponse, StudentListResponse, StudentDetailResponse,
    StudentNoteRequest, StudentNoteResponse, StudentNoteListResponse,
    CurriculumProgressResponse, LoStudentProgressResponse, LearningGapsResponse,
    ActivityEngagementResponse, MessageResponse
)
from . import bcrypt # For password hashing (if storing educator creds directly)

# --- Blueprints --- 
auth_bp = Blueprint("auth", __name__)
dashboard_bp = Blueprint("dashboard", __name__)
students_bp = Blueprint("students", __name__)
curriculum_bp = Blueprint("curriculum", __name__)
activities_bp = Blueprint("activities", __name__)
reports_bp = Blueprint("reports", __name__)

# --- Authentication Endpoints ---
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = LoginRequest(**request.json)
        educator = authenticate_educator(data.username, data.password)
        if educator:
            # In a real app, educator.id would be a unique ID from your educator DB table
            # For now, using email as identity for JWT
            access_token = create_access_token(identity=educator.email)
            return jsonify({
                "token": access_token,
                "educator": educator.dict()
            }), 200
        return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"message": f"Login error: {str(e)}"}), 400

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # JWTs are typically stateless. Logout can be handled client-side by deleting the token.
    # If using a token blocklist, you would add the token JTI here.
    return jsonify(MessageResponse(message="Logout successful. Please clear token client-side.").dict()), 200

# --- Dashboard Overview Endpoints ---
@dashboard_bp.route("/overview", methods=["GET"])
@jwt_required()
def get_dashboard_overview():
    educator_id = get_jwt_identity() # Assuming JWT identity is educator_id/email
    # In a real app, you might get educator_id from a DB lookup based on JWT identity
    try:
        overview_data = get_dashboard_overview_data(educator_id_param=educator_id)
        if overview_data:
            return jsonify(DashboardOverviewResponse(**overview_data).dict()), 200
        return jsonify(MessageResponse(message="Overview data not found").dict()), 404
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error fetching overview: {str(e)}").dict()), 500

# --- Student Management Endpoints ---
@students_bp.route("", methods=["GET"])
@jwt_required()
def get_students():
    educator_id = get_jwt_identity()
    search_query = request.args.get("search")
    sort_by = request.args.get("sort_by")
    sort_order = request.args.get("sort_order", "asc")
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 10, type=int)
    try:
        student_data = get_student_list_data(
            educator_id_param=educator_id, 
            search=search_query, 
            sort_by=sort_by, 
            sort_order=sort_order,
            page=page,
            limit=limit
        )
        return jsonify(student_data.dict()), 200
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error fetching students: {str(e)}").dict()), 500

@students_bp.route("/<string:student_id>", methods=["GET"])
@jwt_required()
def get_student_details(student_id: str):
    educator_id = get_jwt_identity()
    try:
        student_detail = get_student_detail_data(student_id_param=student_id, educator_id_param=educator_id)
        if student_detail:
            return jsonify(student_detail.dict()), 200
        return jsonify(MessageResponse(message="Student not found or not accessible").dict()), 404
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error fetching student details: {str(e)}").dict()), 500

@students_bp.route("/<string:student_id>/notes", methods=["POST"])
@jwt_required()
def add_student_note(student_id: str):
    educator_id = get_jwt_identity()
    try:
        data = StudentNoteRequest(**request.json)
        note = add_student_note_data(student_id_param=student_id, educator_id_param=educator_id, note_text=data.note_text)
        if note:
            return jsonify(StudentNoteResponse(**note).dict()), 201
        return jsonify(MessageResponse(message="Failed to add note").dict()), 400
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error adding note: {str(e)}").dict()), 500

@students_bp.route("/<string:student_id>/notes", methods=["GET"])
@jwt_required()
def get_student_notes(student_id: str):
    educator_id = get_jwt_identity()
    try:
        notes_data = get_student_notes_data(student_id_param=student_id, educator_id_param=educator_id)
        return jsonify(StudentNoteListResponse(**notes_data).dict()), 200
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error fetching notes: {str(e)}").dict()), 500

# --- Curriculum Progress Endpoints ---
@curriculum_bp.route("/progress", methods=["GET"])
@jwt_required()
def get_curriculum_progress():
    educator_id = get_jwt_identity()
    subject = request.args.get("subject")
    year_group = request.args.get("year_group")
    try:
        progress_data = get_curriculum_progress_data(educator_id_param=educator_id, subject_param=subject, year_group_param=year_group)
        # progress_data is already a CurriculumProgressResponse object, no need to unpack it
        return jsonify(progress_data.dict()), 200
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error fetching curriculum progress: {str(e)}").dict()), 500

@curriculum_bp.route("/los/<string:lo_id>/students", methods=["GET"])
@jwt_required()
def get_lo_students(lo_id: str):
    educator_id = get_jwt_identity()
    try:
        lo_student_data = get_lo_student_progress_data(lo_id_param=lo_id, educator_id_param=educator_id)
        if lo_student_data:
            return jsonify(LoStudentProgressResponse(**lo_student_data).dict()), 200
        return jsonify(MessageResponse(message="LO progress data not found").dict()), 404
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error fetching LO student progress: {str(e)}").dict()), 500

@curriculum_bp.route("/gaps", methods=["GET"])
@jwt_required()
def get_learning_gaps():
    educator_id = get_jwt_identity()
    try:
        gaps_data = get_learning_gaps_data(educator_id_param=educator_id)
        return jsonify(LearningGapsResponse(**gaps_data).dict()), 200
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error fetching learning gaps: {str(e)}").dict()), 500

# --- Activity Engagement Endpoints ---
@activities_bp.route("/engagement", methods=["GET"])
@jwt_required()
def get_activity_engagement():
    educator_id = get_jwt_identity()
    subject = request.args.get("subject")
    year_group = request.args.get("year_group")
    try:
        engagement_data = get_activity_engagement_data(educator_id_param=educator_id, subject_param=subject, year_group_param=year_group)
        return jsonify(ActivityEngagementResponse(**engagement_data).dict()), 200
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error fetching activity engagement: {str(e)}").dict()), 500

# --- Reporting Endpoints ---
@reports_bp.route("/student/<string:student_id>", methods=["GET"])
@jwt_required()
def get_student_report(student_id: str):
    educator_id = get_jwt_identity()
    report_format = request.args.get("format", "json")
    try:
        report_data = generate_student_report_data(student_id_param=student_id, educator_id_param=educator_id, format_param=report_format)
        if report_format == "pdf":
            if "pdf_bytes" in report_data:
                student_name = report_data.get("student_name", "student")
                filename = f"{student_name.replace(' ', '_')}_report.pdf"
                return send_file(
                    report_data["pdf_bytes"],
                    mimetype='application/pdf',
                    as_attachment=True,
                    download_name=filename
                )
            else:
                return jsonify(MessageResponse(message=report_data.get("message", "Error generating PDF")).dict()), 500
        return jsonify(report_data), 200 # Assuming JSON for now
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error generating student report: {str(e)}").dict()), 500

@reports_bp.route("/class", methods=["GET"])
@jwt_required()
def get_class_report():
    educator_id = get_jwt_identity()
    report_format = request.args.get("format", "json")
    try:
        report_data = generate_class_report_data(educator_id_param=educator_id, format_param=report_format)
        if report_format == "pdf":
            return jsonify(MessageResponse(message="PDF reporting not yet implemented").dict()), 501
        return jsonify(report_data), 200 # Assuming JSON for now
    except Exception as e:
        return jsonify(MessageResponse(message=f"Error generating class report: {str(e)}").dict()), 500

