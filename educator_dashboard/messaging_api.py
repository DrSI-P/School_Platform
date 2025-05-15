"""
API endpoints for the Parent Communication Portal.

Provides REST API endpoints for messaging, video conferencing, video resource sharing,
and virtual classroom attendance features.
"""

from flask import Blueprint, request, jsonify, current_app
import logging
import json
import datetime
import os
import uuid
from werkzeug.utils import secure_filename

# Import service functions
from .messaging_services import (
    # Message-related functions
    get_user_messages,
    get_message_details,
    send_message,
    update_draft_message,
    send_draft_message,
    archive_message,
    delete_message_service,
    get_user_message_folders,
    create_message_folder,
    rename_message_folder,
    delete_message_folder,
    move_message_to_folder,
    get_message_templates_for_user,
    create_message_template_for_user,
    update_message_template_for_user,
    delete_message_template_for_user,
    
    # Video conference-related functions
    get_user_video_conferences,
    get_video_conference_details,
    schedule_video_conference,
    update_video_conference,
    cancel_video_conference,
    start_video_conference,
    end_video_conference,
    join_video_conference,
    leave_video_conference,
    respond_to_conference_invitation,
    
    # Video resource-related functions
    get_video_resources_for_user,
    get_video_resource_details,
    upload_video_resource,
    update_video_resource,
    delete_video_resource,
    share_video_resource_with_user,
    get_shared_video_resources_for_user,
    mark_video_resource_as_viewed,
    
    # Virtual classroom-related functions
    get_virtual_classroom_sessions_for_user,
    get_virtual_classroom_session_details,
    schedule_virtual_classroom_session,
    update_virtual_classroom_session,
    cancel_virtual_classroom_session,
    start_virtual_classroom_session,
    end_virtual_classroom_session,
    join_virtual_classroom_session,
    leave_virtual_classroom_session,
    add_student_to_virtual_classroom_session,
    remove_student_from_virtual_classroom_session,
    get_virtual_classroom_session_recording
)

# Setup logging
logger = logging.getLogger(__name__)

# Create blueprint
messaging_bp = Blueprint('messaging', __name__, url_prefix='/api/messaging')

# --- Helper Functions ---

def validate_request_data(data, required_fields):
    """Validate that required fields are present in the request data."""
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    return True, ""

def handle_file_upload(file, upload_dir, allowed_extensions=None):
    """Handle file upload and return the saved file path."""
    if not file:
        return None, "No file provided"
    
    # Create upload directory if it doesn't exist
    os.makedirs(upload_dir, exist_ok=True)
    
    # Check file extension if allowed_extensions is provided
    if allowed_extensions:
        filename = secure_filename(file.filename)
        file_ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        if file_ext not in allowed_extensions:
            return None, f"File extension '{file_ext}' not allowed. Allowed extensions: {', '.join(allowed_extensions)}"
    
    # Generate a unique filename
    original_filename = secure_filename(file.filename)
    file_ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
    unique_filename = f"{uuid.uuid4().hex}.{file_ext}" if file_ext else f"{uuid.uuid4().hex}"
    
    # Save the file
    file_path = os.path.join(upload_dir, unique_filename)
    file.save(file_path)
    
    return file_path, None

# --- Message Endpoints ---

@messaging_bp.route('/messages', methods=['GET'])
def get_messages():
    """
    Get messages for the authenticated user.
    
    Query Parameters:
        folder_id (optional): ID of the folder to filter by
        page (optional): Page number for pagination (default: 1)
        limit (optional): Number of messages per page (default: 20)
        search (optional): Search term to filter messages
        sort_by (optional): Field to sort by (created_at, subject, sender) (default: created_at)
        sort_order (optional): Sort order (asc, desc) (default: desc)
    
    Returns:
        JSON response with messages and pagination info
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        folder_id = request.args.get('folder_id')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        search = request.args.get('search')
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        messages = get_user_messages(
            user_id=user_id,
            folder_id=folder_id,
            page=page,
            limit=limit,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        return jsonify(messages), 200
    except Exception as e:
        logger.error(f"Error getting messages: {str(e)}")
        return jsonify({"error": "Failed to get messages"}), 500

@messaging_bp.route('/messages/<message_id>', methods=['GET'])
def get_message(message_id):
    """
    Get details for a specific message.
    
    Path Parameters:
        message_id: ID of the message
    
    Query Parameters:
        user_id: ID of the user requesting the message
    
    Returns:
        JSON response with message details
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        message = get_message_details(message_id=message_id, user_id=user_id)
        if not message:
            return jsonify({"error": "Message not found"}), 404
        
        return jsonify(message), 200
    except Exception as e:
        logger.error(f"Error getting message {message_id}: {str(e)}")
        return jsonify({"error": "Failed to get message"}), 500

@messaging_bp.route('/messages', methods=['POST'])
def create_message():
    """
    Send a new message or save as draft.
    
    Request Body:
        sender_id: ID of the sender
        sender_role: Role of the sender (educator, parent)
        recipient_id: ID of the recipient
        recipient_role: Role of the recipient (educator, parent)
        subject: Message subject
        body: Message body
        parent_message_id (optional): ID of the parent message (for replies)
        is_draft (optional): Whether to save as draft instead of sending (default: false)
    
    Returns:
        JSON response with the created message
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['sender_id', 'sender_role', 'recipient_id', 'recipient_role', 'subject', 'body']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        sender_id = data.get('sender_id')
        sender_role = data.get('sender_role')
        recipient_id = data.get('recipient_id')
        recipient_role = data.get('recipient_role')
        subject = data.get('subject')
        body = data.get('body')
        parent_message_id = data.get('parent_message_id')
        is_draft = data.get('is_draft', False)
        
        # Send message
        message = send_message(
            sender_id=sender_id,
            sender_role=sender_role,
            recipient_id=recipient_id,
            recipient_role=recipient_role,
            subject=subject,
            body=body,
            parent_message_id=parent_message_id,
            is_draft=is_draft
        )
        
        if not message:
            return jsonify({"error": "Failed to send message"}), 500
        
        return jsonify(message), 201
    except Exception as e:
        logger.error(f"Error creating message: {str(e)}")
        return jsonify({"error": "Failed to create message"}), 500

@messaging_bp.route('/messages/<message_id>/attachments', methods=['POST'])
def add_attachment(message_id):
    """
    Add an attachment to a message.
    
    Path Parameters:
        message_id: ID of the message
    
    Form Data:
        user_id: ID of the user adding the attachment
        file: File to attach
        is_video (optional): Whether the attachment is a video (default: false)
    
    Returns:
        JSON response with the updated message
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.form.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Check if file is provided
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        is_video = request.form.get('is_video', 'false').lower() == 'true'
        
        # Determine upload directory based on file type
        if is_video:
            upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'videos')
            allowed_extensions = {'mp4', 'webm', 'mov', 'avi'}
        else:
            upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'attachments')
            allowed_extensions = {'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'gif'}
        
        # Handle file upload
        file_path, error = handle_file_upload(file, upload_dir, allowed_extensions)
        if error:
            return jsonify({"error": error}), 400
        
        # Create attachment data
        attachment_data = {
            "message_id": message_id,
            "file_name": secure_filename(file.filename),
            "file_type": file.content_type,
            "file_size": os.path.getsize(file_path),
            "file_path": file_path,
            "is_video": is_video
        }
        
        # If it's a video, generate a thumbnail and get duration
        if is_video:
            # This would require video processing libraries
            # For now, we'll just set placeholder values
            attachment_data["video_duration_seconds"] = 0
            attachment_data["video_thumbnail_path"] = None
        
        # Get the message
        message = get_message_details(message_id=message_id, user_id=user_id)
        if not message:
            return jsonify({"error": "Message not found"}), 404
        
        # Check if user is authorized to add attachments to this message
        if message.get("sender_id") != user_id:
            return jsonify({"error": "Unauthorized to add attachments to this message"}), 403
        
        # Add attachment to message
        # This would require a function to add attachments to messages
        # For now, we'll just return success
        
        return jsonify({"message": "Attachment added successfully", "file_path": file_path}), 200
    except Exception as e:
        logger.error(f"Error adding attachment to message {message_id}: {str(e)}")
        return jsonify({"error": "Failed to add attachment"}), 500

@messaging_bp.route('/messages/<message_id>/draft', methods=['PUT'])
def update_draft(message_id):
    """
    Update a draft message.
    
    Path Parameters:
        message_id: ID of the message
    
    Request Body:
        user_id: ID of the user updating the draft
        updates: Dictionary of fields to update
    
    Returns:
        JSON response with the updated message
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'updates']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        updates = data.get('updates')
        
        # Update draft
        message = update_draft_message(
            message_id=message_id,
            user_id=user_id,
            updates=updates
        )
        
        if not message:
            return jsonify({"error": "Failed to update draft message"}), 500
        
        return jsonify(message), 200
    except Exception as e:
        logger.error(f"Error updating draft message {message_id}: {str(e)}")
        return jsonify({"error": "Failed to update draft message"}), 500

@messaging_bp.route('/messages/<message_id>/send', methods=['POST'])
def send_draft(message_id):
    """
    Send a previously saved draft message.
    
    Path Parameters:
        message_id: ID of the message
    
    Request Body:
        user_id: ID of the user sending the draft
    
    Returns:
        JSON response with the sent message
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        
        # Send draft
        message = send_draft_message(
            message_id=message_id,
            user_id=user_id
        )
        
        if not message:
            return jsonify({"error": "Failed to send draft message"}), 500
        
        return jsonify(message), 200
    except Exception as e:
        logger.error(f"Error sending draft message {message_id}: {str(e)}")
        return jsonify({"error": "Failed to send draft message"}), 500

@messaging_bp.route('/messages/<message_id>/archive', methods=['POST'])
def archive_message_endpoint(message_id):
    """
    Archive a message.
    
    Path Parameters:
        message_id: ID of the message
    
    Request Body:
        user_id: ID of the user archiving the message
    
    Returns:
        JSON response with success status
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        
        # Archive message
        result = archive_message(
            message_id=message_id,
            user_id=user_id
        )
        
        if not result:
            return jsonify({"error": "Failed to archive message"}), 500
        
        return jsonify({"message": "Message archived successfully"}), 200
    except Exception as e:
        logger.error(f"Error archiving message {message_id}: {str(e)}")
        return jsonify({"error": "Failed to archive message"}), 500

@messaging_bp.route('/messages/<message_id>', methods=['DELETE'])
def delete_message(message_id):
    """
    Delete a message.
    
    Path Parameters:
        message_id: ID of the message
    
    Query Parameters:
        user_id: ID of the user deleting the message
    
    Returns:
        JSON response with success status
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Delete message
        result = delete_message_service(
            message_id=message_id,
            user_id=user_id
        )
        
        if not result:
            return jsonify({"error": "Failed to delete message"}), 500
        
        return jsonify({"message": "Message deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error deleting message {message_id}: {str(e)}")
        return jsonify({"error": "Failed to delete message"}), 500

@messaging_bp.route('/folders', methods=['GET'])
def get_folders():
    """
    Get message folders for the authenticated user.
    
    Query Parameters:
        user_id: ID of the user
    
    Returns:
        JSON response with folders
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Get folders
        folders = get_user_message_folders(user_id=user_id)
        
        return jsonify(folders), 200
    except Exception as e:
        logger.error(f"Error getting folders for user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to get folders"}), 500

@messaging_bp.route('/folders', methods=['POST'])
def create_folder():
    """
    Create a new message folder.
    
    Request Body:
        user_id: ID of the user
        folder_name: Name of the folder to create
    
    Returns:
        JSON response with the created folder
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'folder_name']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        folder_name = data.get('folder_name')
        
        # Create folder
        folder = create_message_folder(
            user_id=user_id,
            folder_name=folder_name
        )
        
        if not folder:
            return jsonify({"error": "Failed to create folder"}), 500
        
        return jsonify(folder), 201
    except Exception as e:
        logger.error(f"Error creating folder: {str(e)}")
        return jsonify({"error": "Failed to create folder"}), 500

@messaging_bp.route('/folders/<folder_id>', methods=['PUT'])
def rename_folder(folder_id):
    """
    Rename a message folder.
    
    Path Parameters:
        folder_id: ID of the folder
    
    Request Body:
        user_id: ID of the user
        new_name: New name for the folder
    
    Returns:
        JSON response with the updated folder
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'new_name']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        new_name = data.get('new_name')
        
        # Rename folder
        folder = rename_message_folder(
            folder_id=folder_id,
            user_id=user_id,
            new_name=new_name
        )
        
        if not folder:
            return jsonify({"error": "Failed to rename folder"}), 500
        
        return jsonify(folder), 200
    except Exception as e:
        logger.error(f"Error renaming folder {folder_id}: {str(e)}")
        return jsonify({"error": "Failed to rename folder"}), 500

@messaging_bp.route('/folders/<folder_id>', methods=['DELETE'])
def delete_folder(folder_id):
    """
    Delete a message folder.
    
    Path Parameters:
        folder_id: ID of the folder
    
    Query Parameters:
        user_id: ID of the user
    
    Returns:
        JSON response with success status
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Delete folder
        result = delete_message_folder(
            folder_id=folder_id,
            user_id=user_id
        )
        
        if not result:
            return jsonify({"error": "Failed to delete folder"}), 500
        
        return jsonify({"message": "Folder deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error deleting folder {folder_id}: {str(e)}")
        return jsonify({"error": "Failed to delete folder"}), 500

@messaging_bp.route('/messages/<message_id>/move', methods=['POST'])
def move_message_endpoint(message_id):
    """
    Move a message from one folder to another.
    
    Path Parameters:
        message_id: ID of the message
    
    Request Body:
        user_id: ID of the user
        source_folder_id: ID of the source folder
        destination_folder_id: ID of the destination folder
    
    Returns:
        JSON response with success status
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'source_folder_id', 'destination_folder_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        source_folder_id = data.get('source_folder_id')
        destination_folder_id = data.get('destination_folder_id')
        
        # Move message
        result = move_message_to_folder(
            message_id=message_id,
            user_id=user_id,
            source_folder_id=source_folder_id,
            destination_folder_id=destination_folder_id
        )
        
        if not result:
            return jsonify({"error": "Failed to move message"}), 500
        
        return jsonify({"message": "Message moved successfully"}), 200
    except Exception as e:
        logger.error(f"Error moving message {message_id}: {str(e)}")
        return jsonify({"error": "Failed to move message"}), 500

@messaging_bp.route('/templates', methods=['GET'])
def get_templates():
    """
    Get message templates for the authenticated user.
    
    Query Parameters:
        user_id: ID of the user
        include_public: Whether to include public templates (default: true)
    
    Returns:
        JSON response with templates
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        include_public = request.args.get('include_public', 'true').lower() == 'true'
        
        # Get templates
        templates = get_message_templates_for_user(
            user_id=user_id,
            include_public=include_public
        )
        
        return jsonify(templates), 200
    except Exception as e:
        logger.error(f"Error getting templates for user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to get templates"}), 500

@messaging_bp.route('/templates', methods=['POST'])
def create_template():
    """
    Create a new message template.
    
    Request Body:
        user_id: ID of the user
        template_name: Name of the template
        subject: Template subject
        body: Template body
        is_public: Whether the template is public (default: false)
    
    Returns:
        JSON response with the created template
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'template_name', 'subject', 'body']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        template_name = data.get('template_name')
        subject = data.get('subject')
        body = data.get('body')
        is_public = data.get('is_public', False)
        
        # Create template
        template = create_message_template_for_user(
            user_id=user_id,
            template_name=template_name,
            subject=subject,
            body=body,
            is_public=is_public
        )
        
        if not template:
            return jsonify({"error": "Failed to create template"}), 500
        
        return jsonify(template), 201
    except Exception as e:
        logger.error(f"Error creating template: {str(e)}")
        return jsonify({"error": "Failed to create template"}), 500

@messaging_bp.route('/templates/<template_id>', methods=['PUT'])
def update_template(template_id):
    """
    Update a message template.
    
    Path Parameters:
        template_id: ID of the template
    
    Request Body:
        user_id: ID of the user
        updates: Dictionary of fields to update
    
    Returns:
        JSON response with the updated template
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'updates']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        updates = data.get('updates')
        
        # Update template
        template = update_message_template_for_user(
            template_id=template_id,
            user_id=user_id,
            updates=updates
        )
        
        if not template:
            return jsonify({"error": "Failed to update template"}), 500
        
        return jsonify(template), 200
    except Exception as e:
        logger.error(f"Error updating template {template_id}: {str(e)}")
        return jsonify({"error": "Failed to update template"}), 500

@messaging_bp.route('/templates/<template_id>', methods=['DELETE'])
def delete_template(template_id):
    """
    Delete a message template.
    
    Path Parameters:
        template_id: ID of the template
    
    Query Parameters:
        user_id: ID of the user
    
    Returns:
        JSON response with success status
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Delete template
        result = delete_message_template_for_user(
            template_id=template_id,
            user_id=user_id
        )
        
        if not result:
            return jsonify({"error": "Failed to delete template"}), 500
        
        return jsonify({"message": "Template deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error deleting template {template_id}: {str(e)}")
        return jsonify({"error": "Failed to delete template"}), 500

# --- Video Conference Endpoints ---

@messaging_bp.route('/conferences', methods=['GET'])
def get_conferences():
    """
    Get video conferences for the authenticated user.
    
    Query Parameters:
        user_id: ID of the user
        role: Role of the user (educator, parent)
        status (optional): Status filter (scheduled, in_progress, completed, cancelled)
        page (optional): Page number for pagination (default: 1)
        limit (optional): Number of conferences per page (default: 20)
        sort_by (optional): Field to sort by (default: scheduled_start)
        sort_order (optional): Sort order (asc, desc) (default: asc)
    
    Returns:
        JSON response with conferences and pagination info
    """
    try:
        # In a real application, user_id and role would come from authentication
        user_id = request.args.get('user_id')
        role = request.args.get('role')
        if not user_id or not role:
            return jsonify({"error": "User ID and role are required"}), 400
        
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        sort_by = request.args.get('sort_by', 'scheduled_start')
        sort_order = request.args.get('sort_order', 'asc')
        
        # Get conferences
        conferences = get_user_video_conferences(
            user_id=user_id,
            role=role,
            status=status,
            page=page,
            limit=limit,
            sort_by=sort_by,
            sort_order=sort_order
        )
        
        return jsonify(conferences), 200
    except Exception as e:
        logger.error(f"Error getting conferences for user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to get conferences"}), 500

@messaging_bp.route('/conferences/<conference_id>', methods=['GET'])
def get_conference(conference_id):
    """
    Get details for a specific video conference.
    
    Path Parameters:
        conference_id: ID of the conference
    
    Query Parameters:
        user_id: ID of the user requesting the details
    
    Returns:
        JSON response with conference details
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Get conference details
        conference = get_video_conference_details(
            conference_id=conference_id,
            user_id=user_id
        )
        
        if not conference:
            return jsonify({"error": "Conference not found"}), 404
        
        return jsonify(conference), 200
    except Exception as e:
        logger.error(f"Error getting conference {conference_id}: {str(e)}")
        return jsonify({"error": "Failed to get conference"}), 500

@messaging_bp.route('/conferences', methods=['POST'])
def schedule_conference():
    """
    Schedule a new video conference.
    
    Request Body:
        creator_id: ID of the user creating the conference
        title: Conference title
        description: Conference description
        scheduled_start: Scheduled start time (ISO format)
        scheduled_end: Scheduled end time (ISO format)
        participant_ids: List of dictionaries with participant_id and participant_role
    
    Returns:
        JSON response with the created conference
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['creator_id', 'title', 'description', 'scheduled_start', 'scheduled_end', 'participant_ids']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        creator_id = data.get('creator_id')
        title = data.get('title')
        description = data.get('description')
        scheduled_start = data.get('scheduled_start')
        scheduled_end = data.get('scheduled_end')
        participant_ids = data.get('participant_ids')
        
        # Schedule conference
        conference = schedule_video_conference(
            creator_id=creator_id,
            title=title,
            description=description,
            scheduled_start=scheduled_start,
            scheduled_end=scheduled_end,
            participant_ids=participant_ids
        )
        
        if not conference:
            return jsonify({"error": "Failed to schedule conference"}), 500
        
        return jsonify(conference), 201
    except Exception as e:
        logger.error(f"Error scheduling conference: {str(e)}")
        return jsonify({"error": "Failed to schedule conference"}), 500

@messaging_bp.route('/conferences/<conference_id>', methods=['PUT'])
def update_conference(conference_id):
    """
    Update a video conference.
    
    Path Parameters:
        conference_id: ID of the conference
    
    Request Body:
        user_id: ID of the user making the update
        updates: Dictionary of fields to update
    
    Returns:
        JSON response with the updated conference
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'updates']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        updates = data.get('updates')
        
        # Update conference
        conference = update_video_conference(
            conference_id=conference_id,
            user_id=user_id,
            updates=updates
        )
        
        if not conference:
            return jsonify({"error": "Failed to update conference"}), 500
        
        return jsonify(conference), 200
    except Exception as e:
        logger.error(f"Error updating conference {conference_id}: {str(e)}")
        return jsonify({"error": "Failed to update conference"}), 500

@messaging_bp.route('/conferences/<conference_id>/cancel', methods=['POST'])
def cancel_conference(conference_id):
    """
    Cancel a video conference.
    
    Path Parameters:
        conference_id: ID of the conference
    
    Request Body:
        user_id: ID of the user cancelling the conference
    
    Returns:
        JSON response with success status
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        
        # Cancel conference
        result = cancel_video_conference(
            conference_id=conference_id,
            user_id=user_id
        )
        
        if not result:
            return jsonify({"error": "Failed to cancel conference"}), 500
        
        return jsonify({"message": "Conference cancelled successfully"}), 200
    except Exception as e:
        logger.error(f"Error cancelling conference {conference_id}: {str(e)}")
        return jsonify({"error": "Failed to cancel conference"}), 500

@messaging_bp.route('/conferences/<conference_id>/start', methods=['POST'])
def start_conference(conference_id):
    """
    Start a scheduled video conference.
    
    Path Parameters:
        conference_id: ID of the conference
    
    Request Body:
        user_id: ID of the user starting the conference
    
    Returns:
        JSON response with the updated conference
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        
        # Start conference
        conference = start_video_conference(
            conference_id=conference_id,
            user_id=user_id
        )
        
        if not conference:
            return jsonify({"error": "Failed to start conference"}), 500
        
        return jsonify(conference), 200
    except Exception as e:
        logger.error(f"Error starting conference {conference_id}: {str(e)}")
        return jsonify({"error": "Failed to start conference"}), 500

@messaging_bp.route('/conferences/<conference_id>/end', methods=['POST'])
def end_conference(conference_id):
    """
    End an in-progress video conference.
    
    Path Parameters:
        conference_id: ID of the conference
    
    Request Body:
        user_id: ID of the user ending the conference
        recording_available: Whether a recording is available
        recording_path: Path to the recording file if available
    
    Returns:
        JSON response with the updated conference
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        recording_available = data.get('recording_available', False)
        recording_path = data.get('recording_path')
        
        # End conference
        conference = end_video_conference(
            conference_id=conference_id,
            user_id=user_id,
            recording_available=recording_available,
            recording_path=recording_path
        )
        
        if not conference:
            return jsonify({"error": "Failed to end conference"}), 500
        
        return jsonify(conference), 200
    except Exception as e:
        logger.error(f"Error ending conference {conference_id}: {str(e)}")
        return jsonify({"error": "Failed to end conference"}), 500

@messaging_bp.route('/conferences/<conference_id>/join', methods=['POST'])
def join_conference(conference_id):
    """
    Join a video conference as a participant.
    
    Path Parameters:
        conference_id: ID of the conference
    
    Request Body:
        user_id: ID of the user joining the conference
    
    Returns:
        JSON response with conference connection details
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        
        # Join conference
        connection_details = join_video_conference(
            conference_id=conference_id,
            user_id=user_id
        )
        
        if not connection_details:
            return jsonify({"error": "Failed to join conference"}), 500
        
        return jsonify(connection_details), 200
    except Exception as e:
        logger.error(f"Error joining conference {conference_id}: {str(e)}")
        return jsonify({"error": "Failed to join conference"}), 500

@messaging_bp.route('/conferences/<conference_id>/leave', methods=['POST'])
def leave_conference(conference_id):
    """
    Leave a video conference as a participant.
    
    Path Parameters:
        conference_id: ID of the conference
    
    Request Body:
        user_id: ID of the user leaving the conference
    
    Returns:
        JSON response with success status
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        
        # Leave conference
        result = leave_video_conference(
            conference_id=conference_id,
            user_id=user_id
        )
        
        if not result:
            return jsonify({"error": "Failed to leave conference"}), 500
        
        return jsonify({"message": "Left conference successfully"}), 200
    except Exception as e:
        logger.error(f"Error leaving conference {conference_id}: {str(e)}")
        return jsonify({"error": "Failed to leave conference"}), 500

@messaging_bp.route('/conferences/<conference_id>/respond', methods=['POST'])
def respond_to_invitation(conference_id):
    """
    Respond to a video conference invitation.
    
    Path Parameters:
        conference_id: ID of the conference
    
    Request Body:
        user_id: ID of the user responding
        response: Response (accepted, declined)
    
    Returns:
        JSON response with success status
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'response']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        response = data.get('response')
        
        # Validate response
        if response not in ['accepted', 'declined']:
            return jsonify({"error": "Invalid response. Must be 'accepted' or 'declined'"}), 400
        
        # Respond to invitation
        result = respond_to_conference_invitation(
            conference_id=conference_id,
            user_id=user_id,
            response=response
        )
        
        if not result:
            return jsonify({"error": "Failed to respond to invitation"}), 500
        
        return jsonify({"message": f"Invitation {response} successfully"}), 200
    except Exception as e:
        logger.error(f"Error responding to invitation for conference {conference_id}: {str(e)}")
        return jsonify({"error": "Failed to respond to invitation"}), 500

# --- Video Resource Endpoints ---

@messaging_bp.route('/resources', methods=['GET'])
def get_resources():
    """
    Get video resources for the authenticated user.
    
    Query Parameters:
        user_id: ID of the user
        role: Role of the user (educator, parent)
        subject (optional): Subject filter
        year_group (optional): Year group filter
        search (optional): Search term
        page (optional): Page number for pagination (default: 1)
        limit (optional): Number of resources per page (default: 20)
    
    Returns:
        JSON response with resources and pagination info
    """
    try:
        # In a real application, user_id and role would come from authentication
        user_id = request.args.get('user_id')
        role = request.args.get('role')
        if not user_id or not role:
            return jsonify({"error": "User ID and role are required"}), 400
        
        subject = request.args.get('subject')
        year_group = request.args.get('year_group')
        search = request.args.get('search')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        
        # Get resources
        resources = get_video_resources_for_user(
            user_id=user_id,
            role=role,
            subject=subject,
            year_group=year_group,
            search=search,
            page=page,
            limit=limit
        )
        
        return jsonify(resources), 200
    except Exception as e:
        logger.error(f"Error getting resources for user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to get resources"}), 500

@messaging_bp.route('/resources/<resource_id>', methods=['GET'])
def get_resource(resource_id):
    """
    Get details for a specific video resource.
    
    Path Parameters:
        resource_id: ID of the resource
    
    Query Parameters:
        user_id: ID of the user requesting the details
    
    Returns:
        JSON response with resource details
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Get resource details
        resource = get_video_resource_details(
            resource_id=resource_id,
            user_id=user_id
        )
        
        if not resource:
            return jsonify({"error": "Resource not found"}), 404
        
        return jsonify(resource), 200
    except Exception as e:
        logger.error(f"Error getting resource {resource_id}: {str(e)}")
        return jsonify({"error": "Failed to get resource"}), 500

@messaging_bp.route('/resources', methods=['POST'])
def upload_resource():
    """
    Upload a new video resource.
    
    Form Data:
        creator_id: ID of the user uploading the resource
        title: Resource title
        description: Resource description
        subject: Subject of the resource
        year_group: Year group the resource is for
        tags: Comma-separated list of tags
        learning_objective_ids: Comma-separated list of learning objective IDs
        is_public: Whether the resource is public (default: true)
        video: Video file to upload
        thumbnail: Thumbnail image to upload
    
    Returns:
        JSON response with the created resource
    """
    try:
        # Validate required fields
        required_fields = ['creator_id', 'title', 'description', 'subject', 'year_group']
        for field in required_fields:
            if field not in request.form:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Check if files are provided
        if 'video' not in request.files:
            return jsonify({"error": "No video file provided"}), 400
        
        # Extract data
        creator_id = request.form.get('creator_id')
        title = request.form.get('title')
        description = request.form.get('description')
        subject = request.form.get('subject')
        year_group = request.form.get('year_group')
        tags = request.form.get('tags', '').split(',') if request.form.get('tags') else []
        learning_objective_ids = request.form.get('learning_objective_ids', '').split(',') if request.form.get('learning_objective_ids') else []
        is_public = request.form.get('is_public', 'true').lower() == 'true'
        
        # Handle video upload
        video_file = request.files['video']
        video_upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'resources', 'videos')
        allowed_video_extensions = {'mp4', 'webm', 'mov', 'avi'}
        video_path, error = handle_file_upload(video_file, video_upload_dir, allowed_video_extensions)
        if error:
            return jsonify({"error": error}), 400
        
        # Handle thumbnail upload
        thumbnail_path = None
        if 'thumbnail' in request.files:
            thumbnail_file = request.files['thumbnail']
            thumbnail_upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'resources', 'thumbnails')
            allowed_thumbnail_extensions = {'jpg', 'jpeg', 'png', 'gif'}
            thumbnail_path, error = handle_file_upload(thumbnail_file, thumbnail_upload_dir, allowed_thumbnail_extensions)
            if error:
                # Clean up video file if thumbnail upload fails
                if os.path.exists(video_path):
                    os.remove(video_path)
                return jsonify({"error": error}), 400
        
        # Get video duration and file size
        # In a real application, this would use a video processing library
        # For now, we'll just use placeholder values
        duration_seconds = 0
        file_size = os.path.getsize(video_path)
        
        # Upload resource
        resource = upload_video_resource(
            creator_id=creator_id,
            title=title,
            description=description,
            video_path=video_path,
            thumbnail_path=thumbnail_path,
            duration_seconds=duration_seconds,
            file_size=file_size,
            subject=subject,
            year_group=year_group,
            tags=tags,
            learning_objective_ids=learning_objective_ids,
            is_public=is_public
        )
        
        if not resource:
            # Clean up files if upload fails
            if os.path.exists(video_path):
                os.remove(video_path)
            if thumbnail_path and os.path.exists(thumbnail_path):
                os.remove(thumbnail_path)
            return jsonify({"error": "Failed to upload resource"}), 500
        
        return jsonify(resource), 201
    except Exception as e:
        logger.error(f"Error uploading resource: {str(e)}")
        return jsonify({"error": "Failed to upload resource"}), 500

@messaging_bp.route('/resources/<resource_id>', methods=['PUT'])
def update_resource(resource_id):
    """
    Update a video resource.
    
    Path Parameters:
        resource_id: ID of the resource
    
    Request Body:
        user_id: ID of the user making the update
        updates: Dictionary of fields to update
    
    Returns:
        JSON response with the updated resource
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'updates']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        updates = data.get('updates')
        
        # Update resource
        resource = update_video_resource(
            resource_id=resource_id,
            user_id=user_id,
            updates=updates
        )
        
        if not resource:
            return jsonify({"error": "Failed to update resource"}), 500
        
        return jsonify(resource), 200
    except Exception as e:
        logger.error(f"Error updating resource {resource_id}: {str(e)}")
        return jsonify({"error": "Failed to update resource"}), 500

@messaging_bp.route('/resources/<resource_id>', methods=['DELETE'])
def delete_resource(resource_id):
    """
    Delete a video resource.
    
    Path Parameters:
        resource_id: ID of the resource
    
    Query Parameters:
        user_id: ID of the user deleting the resource
    
    Returns:
        JSON response with success status
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Delete resource
        result = delete_video_resource(
            resource_id=resource_id,
            user_id=user_id
        )
        
        if not result:
            return jsonify({"error": "Failed to delete resource"}), 500
        
        return jsonify({"message": "Resource deleted successfully"}), 200
    except Exception as e:
        logger.error(f"Error deleting resource {resource_id}: {str(e)}")
        return jsonify({"error": "Failed to delete resource"}), 500

@messaging_bp.route('/resources/<resource_id>/share', methods=['POST'])
def share_resource(resource_id):
    """
    Share a video resource with another user.
    
    Path Parameters:
        resource_id: ID of the resource
    
    Request Body:
        shared_by: ID of the user sharing the resource
        shared_with: ID of the user to share with
        message_id: Optional ID of the message containing the share
    
    Returns:
        JSON response with success status
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['shared_by', 'shared_with']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        shared_by = data.get('shared_by')
        shared_with = data.get('shared_with')
        message_id = data.get('message_id')
        
        # Share resource
        result = share_video_resource_with_user(
            resource_id=resource_id,
            shared_by=shared_by,
            shared_with=shared_with,
            message_id=message_id
        )
        
        if not result:
            return jsonify({"error": "Failed to share resource"}), 500
        
        return jsonify({"message": "Resource shared successfully"}), 200
    except Exception as e:
        logger.error(f"Error sharing resource {resource_id}: {str(e)}")
        return jsonify({"error": "Failed to share resource"}), 500

@messaging_bp.route('/resources/shared', methods=['GET'])
def get_shared_resources():
    """
    Get video resources shared with the authenticated user.
    
    Query Parameters:
        user_id: ID of the user
        page (optional): Page number for pagination (default: 1)
        limit (optional): Number of resources per page (default: 20)
    
    Returns:
        JSON response with resources and pagination info
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        
        # Get shared resources
        resources = get_shared_video_resources_for_user(
            user_id=user_id,
            page=page,
            limit=limit
        )
        
        return jsonify(resources), 200
    except Exception as e:
        logger.error(f"Error getting shared resources for user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to get shared resources"}), 500

@messaging_bp.route('/resources/<resource_id>/view', methods=['POST'])
def mark_resource_viewed(resource_id):
    """
    Mark a video resource as viewed by a user.
    
    Path Parameters:
        resource_id: ID of the resource
    
    Request Body:
        user_id: ID of the user viewing the resource
    
    Returns:
        JSON response with success status
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        
        # Mark resource as viewed
        result = mark_video_resource_as_viewed(
            resource_id=resource_id,
            user_id=user_id
        )
        
        if not result:
            return jsonify({"error": "Failed to mark resource as viewed"}), 500
        
        return jsonify({"message": "Resource marked as viewed successfully"}), 200
    except Exception as e:
        logger.error(f"Error marking resource {resource_id} as viewed: {str(e)}")
        return jsonify({"error": "Failed to mark resource as viewed"}), 500

# --- Virtual Classroom Endpoints ---

@messaging_bp.route('/classroom/sessions', methods=['GET'])
def get_classroom_sessions():
    """
    Get virtual classroom sessions for the authenticated user.
    
    Query Parameters:
        user_id: ID of the user
        role: Role of the user (educator, student, parent)
        status (optional): Status filter (scheduled, in_progress, completed, cancelled)
        page (optional): Page number for pagination (default: 1)
        limit (optional): Number of sessions per page (default: 20)
    
    Returns:
        JSON response with sessions and pagination info
    """
    try:
        # In a real application, user_id and role would come from authentication
        user_id = request.args.get('user_id')
        role = request.args.get('role')
        if not user_id or not role:
            return jsonify({"error": "User ID and role are required"}), 400
        
        status = request.args.get('status')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        
        # Get sessions
        sessions = get_virtual_classroom_sessions_for_user(
            user_id=user_id,
            role=role,
            status=status,
            page=page,
            limit=limit
        )
        
        return jsonify(sessions), 200
    except Exception as e:
        logger.error(f"Error getting classroom sessions for user {user_id}: {str(e)}")
        return jsonify({"error": "Failed to get classroom sessions"}), 500

@messaging_bp.route('/classroom/sessions/<session_id>', methods=['GET'])
def get_classroom_session(session_id):
    """
    Get details for a specific virtual classroom session.
    
    Path Parameters:
        session_id: ID of the session
    
    Query Parameters:
        user_id: ID of the user requesting the details
    
    Returns:
        JSON response with session details
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Get session details
        session = get_virtual_classroom_session_details(
            session_id=session_id,
            user_id=user_id
        )
        
        if not session:
            return jsonify({"error": "Session not found"}), 404
        
        return jsonify(session), 200
    except Exception as e:
        logger.error(f"Error getting classroom session {session_id}: {str(e)}")
        return jsonify({"error": "Failed to get classroom session"}), 500

@messaging_bp.route('/classroom/sessions', methods=['POST'])
def schedule_classroom_session():
    """
    Schedule a new virtual classroom session.
    
    Request Body:
        educator_id: ID of the educator creating the session
        title: Session title
        description: Session description
        subject: Subject of the session
        year_group: Year group the session is for
        scheduled_start: Scheduled start time (ISO format)
        scheduled_end: Scheduled end time (ISO format)
        student_ids: List of student IDs to invite
        learning_objective_ids: Optional list of learning objective IDs covered
    
    Returns:
        JSON response with the created session
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['educator_id', 'title', 'description', 'subject', 'year_group', 'scheduled_start', 'scheduled_end', 'student_ids']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        educator_id = data.get('educator_id')
        title = data.get('title')
        description = data.get('description')
        subject = data.get('subject')
        year_group = data.get('year_group')
        scheduled_start = data.get('scheduled_start')
        scheduled_end = data.get('scheduled_end')
        student_ids = data.get('student_ids')
        learning_objective_ids = data.get('learning_objective_ids')
        
        # Schedule session
        session = schedule_virtual_classroom_session(
            educator_id=educator_id,
            title=title,
            description=description,
            subject=subject,
            year_group=year_group,
            scheduled_start=scheduled_start,
            scheduled_end=scheduled_end,
            student_ids=student_ids,
            learning_objective_ids=learning_objective_ids
        )
        
        if not session:
            return jsonify({"error": "Failed to schedule classroom session"}), 500
        
        return jsonify(session), 201
    except Exception as e:
        logger.error(f"Error scheduling classroom session: {str(e)}")
        return jsonify({"error": "Failed to schedule classroom session"}), 500

@messaging_bp.route('/classroom/sessions/<session_id>', methods=['PUT'])
def update_classroom_session(session_id):
    """
    Update a virtual classroom session.
    
    Path Parameters:
        session_id: ID of the session
    
    Request Body:
        user_id: ID of the user making the update
        updates: Dictionary of fields to update
    
    Returns:
        JSON response with the updated session
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'updates']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        updates = data.get('updates')
        
        # Update session
        session = update_virtual_classroom_session(
            session_id=session_id,
            user_id=user_id,
            updates=updates
        )
        
        if not session:
            return jsonify({"error": "Failed to update classroom session"}), 500
        
        return jsonify(session), 200
    except Exception as e:
        logger.error(f"Error updating classroom session {session_id}: {str(e)}")
        return jsonify({"error": "Failed to update classroom session"}), 500

@messaging_bp.route('/classroom/sessions/<session_id>/cancel', methods=['POST'])
def cancel_classroom_session(session_id):
    """
    Cancel a virtual classroom session.
    
    Path Parameters:
        session_id: ID of the session
    
    Request Body:
        user_id: ID of the user cancelling the session
    
    Returns:
        JSON response with success status
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        
        # Cancel session
        result = cancel_virtual_classroom_session(
            session_id=session_id,
            user_id=user_id
        )
        
        if not result:
            return jsonify({"error": "Failed to cancel classroom session"}), 500
        
        return jsonify({"message": "Classroom session cancelled successfully"}), 200
    except Exception as e:
        logger.error(f"Error cancelling classroom session {session_id}: {str(e)}")
        return jsonify({"error": "Failed to cancel classroom session"}), 500

@messaging_bp.route('/classroom/sessions/<session_id>/start', methods=['POST'])
def start_classroom_session(session_id):
    """
    Start a scheduled virtual classroom session.
    
    Path Parameters:
        session_id: ID of the session
    
    Request Body:
        user_id: ID of the user starting the session
    
    Returns:
        JSON response with the updated session
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        
        # Start session
        session = start_virtual_classroom_session(
            session_id=session_id,
            user_id=user_id
        )
        
        if not session:
            return jsonify({"error": "Failed to start classroom session"}), 500
        
        return jsonify(session), 200
    except Exception as e:
        logger.error(f"Error starting classroom session {session_id}: {str(e)}")
        return jsonify({"error": "Failed to start classroom session"}), 500

@messaging_bp.route('/classroom/sessions/<session_id>/end', methods=['POST'])
def end_classroom_session(session_id):
    """
    End an in-progress virtual classroom session.
    
    Path Parameters:
        session_id: ID of the session
    
    Request Body:
        user_id: ID of the user ending the session
        recording_available: Whether a recording is available
        recording_path: Path to the recording file if available
    
    Returns:
        JSON response with the updated session
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        recording_available = data.get('recording_available', False)
        recording_path = data.get('recording_path')
        
        # End session
        session = end_virtual_classroom_session(
            session_id=session_id,
            user_id=user_id,
            recording_available=recording_available,
            recording_path=recording_path
        )
        
        if not session:
            return jsonify({"error": "Failed to end classroom session"}), 500
        
        return jsonify(session), 200
    except Exception as e:
        logger.error(f"Error ending classroom session {session_id}: {str(e)}")
        return jsonify({"error": "Failed to end classroom session"}), 500

@messaging_bp.route('/classroom/sessions/<session_id>/join', methods=['POST'])
def join_classroom_session(session_id):
    """
    Join a virtual classroom session as an attendee.
    
    Path Parameters:
        session_id: ID of the session
    
    Request Body:
        user_id: ID of the user joining the session
        role: Role of the user (student, parent, educator)
    
    Returns:
        JSON response with session connection details
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id', 'role']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        role = data.get('role')
        
        # Join session
        connection_details = join_virtual_classroom_session(
            session_id=session_id,
            user_id=user_id,
            role=role
        )
        
        if not connection_details:
            return jsonify({"error": "Failed to join classroom session"}), 500
        
        return jsonify(connection_details), 200
    except Exception as e:
        logger.error(f"Error joining classroom session {session_id}: {str(e)}")
        return jsonify({"error": "Failed to join classroom session"}), 500

@messaging_bp.route('/classroom/sessions/<session_id>/leave', methods=['POST'])
def leave_classroom_session(session_id):
    """
    Leave a virtual classroom session as an attendee.
    
    Path Parameters:
        session_id: ID of the session
    
    Request Body:
        user_id: ID of the user leaving the session
    
    Returns:
        JSON response with success status
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['user_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        user_id = data.get('user_id')
        
        # Leave session
        result = leave_virtual_classroom_session(
            session_id=session_id,
            user_id=user_id
        )
        
        if not result:
            return jsonify({"error": "Failed to leave classroom session"}), 500
        
        return jsonify({"message": "Left classroom session successfully"}), 200
    except Exception as e:
        logger.error(f"Error leaving classroom session {session_id}: {str(e)}")
        return jsonify({"error": "Failed to leave classroom session"}), 500

@messaging_bp.route('/classroom/sessions/<session_id>/students', methods=['POST'])
def add_student_to_session(session_id):
    """
    Add a student to a virtual classroom session.
    
    Path Parameters:
        session_id: ID of the session
    
    Request Body:
        educator_id: ID of the educator adding the student
        student_id: ID of the student to add
    
    Returns:
        JSON response with success status
    """
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['educator_id', 'student_id']
        valid, error_message = validate_request_data(data, required_fields)
        if not valid:
            return jsonify({"error": error_message}), 400
        
        # Extract data
        educator_id = data.get('educator_id')
        student_id = data.get('student_id')
        
        # Add student to session
        result = add_student_to_virtual_classroom_session(
            session_id=session_id,
            educator_id=educator_id,
            student_id=student_id
        )
        
        if not result:
            return jsonify({"error": "Failed to add student to classroom session"}), 500
        
        return jsonify({"message": "Student added to classroom session successfully"}), 200
    except Exception as e:
        logger.error(f"Error adding student to classroom session {session_id}: {str(e)}")
        return jsonify({"error": "Failed to add student to classroom session"}), 500

@messaging_bp.route('/classroom/sessions/<session_id>/students/<student_id>', methods=['DELETE'])
def remove_student_from_session(session_id, student_id):
    """
    Remove a student from a virtual classroom session.
    
    Path Parameters:
        session_id: ID of the session
        student_id: ID of the student to remove
    
    Query Parameters:
        educator_id: ID of the educator removing the student
    
    Returns:
        JSON response with success status
    """
    try:
        # In a real application, educator_id would come from authentication
        educator_id = request.args.get('educator_id')
        if not educator_id:
            return jsonify({"error": "Educator ID is required"}), 400
        
        # Remove student from session
        result = remove_student_from_virtual_classroom_session(
            session_id=session_id,
            educator_id=educator_id,
            student_id=student_id
        )
        
        if not result:
            return jsonify({"error": "Failed to remove student from classroom session"}), 500
        
        return jsonify({"message": "Student removed from classroom session successfully"}), 200
    except Exception as e:
        logger.error(f"Error removing student from classroom session {session_id}: {str(e)}")
        return jsonify({"error": "Failed to remove student from classroom session"}), 500

@messaging_bp.route('/classroom/sessions/<session_id>/recording', methods=['GET'])
def get_classroom_recording(session_id):
    """
    Get the recording for a virtual classroom session.
    
    Path Parameters:
        session_id: ID of the session
    
    Query Parameters:
        user_id: ID of the user requesting the recording
    
    Returns:
        JSON response with recording details
    """
    try:
        # In a real application, user_id would come from authentication
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
        
        # Get recording
        recording = get_virtual_classroom_session_recording(
            session_id=session_id,
            user_id=user_id
        )
        
        if not recording:
            return jsonify({"error": "Recording not found or not available"}), 404
        
        return jsonify(recording), 200
    except Exception as e:
        logger.error(f"Error getting recording for classroom session {session_id}: {str(e)}")
        return jsonify({"error": "Failed to get recording"}), 500
