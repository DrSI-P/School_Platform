"""
API endpoints for the Resource Library.

Contains RESTful endpoints to support resource management, tagging, search, and integration
with other modules of the EdPsych Connect platform.
"""

import logging
import json
import os
import uuid
import datetime
from typing import List, Dict, Optional, Any, Union
from flask import Blueprint, request, jsonify, send_file, current_app

# Setup logging
logger = logging.getLogger(__name__)

# Import service functions
from edpsychconnect_dala_prototype.educator_dashboard.resource_services import resource_library_service

# Create Blueprint
resource_api = Blueprint('resource_api', __name__)

# --- Resource Endpoints ---

@resource_api.route('/resources', methods=['GET'])
def get_resources_endpoint():
    """
    Search for resources with various filters.
    
    Query parameters:
        query: Optional search term for title and description
        category_id: Optional category ID to filter by
        tag_ids: Optional comma-separated list of tag IDs to filter by
        subject: Optional subject to filter by
        year_group: Optional year group to filter by
        content_type: Optional content type to filter by
        creator_id: Optional creator ID to filter by
        is_public: Optional public status to filter by (true/false)
        learning_objective_id: Optional learning objective ID to filter by
        sort_by: Field to sort by (default: created_at)
        sort_order: Sort order (asc, desc) (default: desc)
        page: Page number for pagination (default: 1)
        limit: Number of resources per page (default: 20)
    
    Returns:
        JSON response containing resources and pagination info
    """
    try:
        # Get query parameters
        query = request.args.get('query')
        category_id = request.args.get('category_id')
        tag_ids_str = request.args.get('tag_ids')
        subject = request.args.get('subject')
        year_group = request.args.get('year_group')
        content_type = request.args.get('content_type')
        creator_id = request.args.get('creator_id')
        is_public_str = request.args.get('is_public')
        learning_objective_id = request.args.get('learning_objective_id')
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        
        # Parse tag_ids
        tag_ids = tag_ids_str.split(',') if tag_ids_str else None
        
        # Parse is_public
        is_public = None
        if is_public_str:
            is_public = is_public_str.lower() == 'true'
        
        # Search for resources
        result = resource_library_service.search_resources(
            query=query,
            category_id=category_id,
            tag_ids=tag_ids,
            subject=subject,
            year_group=year_group,
            content_type=content_type,
            creator_id=creator_id,
            is_public=is_public,
            learning_objective_id=learning_objective_id,
            sort_by=sort_by,
            sort_order=sort_order,
            page=page,
            limit=limit
        )
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error in get_resources_endpoint: {str(e)}")
        return jsonify({"error": "Failed to retrieve resources"}), 500

@resource_api.route('/resources/<resource_id>', methods=['GET'])
def get_resource_endpoint(resource_id):
    """
    Get detailed information for a specific resource.
    
    Path parameters:
        resource_id: ID of the resource
    
    Query parameters:
        user_id: Optional ID of the user requesting the details
    
    Returns:
        JSON response containing resource details
    """
    try:
        # Get query parameters
        user_id = request.args.get('user_id')
        
        # Get resource details
        resource = resource_library_service.get_resource_details(resource_id, user_id)
        
        if not resource:
            return jsonify({"error": "Resource not found"}), 404
        
        return jsonify(resource), 200
    except Exception as e:
        logger.error(f"Error in get_resource_endpoint: {str(e)}")
        return jsonify({"error": "Failed to retrieve resource details"}), 500

@resource_api.route('/resources', methods=['POST'])
def create_resource_endpoint():
    """
    Create a new resource.
    
    Request body:
        title: Resource title
        description: Resource description
        content_type: Type of content (document, video, interactive, worksheet, etc.)
        creator_id: ID of the user creating the resource
        category_id: Optional category ID
        year_group: Optional year group
        subject: Optional subject
        is_public: Whether the resource is public (default: true)
        is_featured: Whether the resource is featured (default: false)
        file_path: Optional path to the resource file
        url: Optional URL for the resource
        thumbnail_path: Optional path to the thumbnail image
        tag_ids: Optional list of tag IDs to associate with the resource
        learning_objective_ids: Optional list of learning objective IDs to associate with the resource
        metadata: Optional dictionary of metadata key-value pairs
    
    Returns:
        JSON response containing the created resource
    """
    try:
        # Get request data
        data = request.json
        
        # Validate required fields
        required_fields = ['title', 'description', 'content_type', 'creator_id']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Validate that either file_path or url is provided
        if 'file_path' not in data and 'url' not in data:
            return jsonify({"error": "Either file_path or url must be provided"}), 400
        
        # Create the resource
        resource = resource_library_service.create_new_resource(
            title=data['title'],
            description=data['description'],
            content_type=data['content_type'],
            creator_id=data['creator_id'],
            category_id=data.get('category_id'),
            year_group=data.get('year_group'),
            subject=data.get('subject'),
            is_public=data.get('is_public', True),
            is_featured=data.get('is_featured', False),
            file_path=data.get('file_path'),
            url=data.get('url'),
            thumbnail_path=data.get('thumbnail_path'),
            tag_ids=data.get('tag_ids'),
            learning_objective_ids=data.get('learning_objective_ids'),
            metadata=data.get('metadata')
        )
        
        if not resource:
            return jsonify({"error": "Failed to create resource"}), 500
        
        return jsonify(resource), 201
    except Exception as e:
        logger.error(f"Error in create_resource_endpoint: {str(e)}")
        return jsonify({"error": "Failed to create resource"}), 500
