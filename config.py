"""
Configuration module for the EdPsych Connect platform.

This module contains configuration settings and utility functions
used throughout the platform.
"""

import os
import logging
import json
from datetime import datetime

# Base directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Database configuration
DB_CONFIG = {
    "host": "localhost",
    "database": "edpsych_connect",
    "user": "edpsych_user",
    "password": "edpsych_password"
}

# API configuration
API_CONFIG = {
    "base_url": "http://localhost:5000/api",
    "version": "v1",
    "timeout": 30
}

# Logging configuration
LOG_CONFIG = {
    "level": logging.INFO,
    "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    "file": os.path.join(BASE_DIR, "logs", "edpsych_connect.log")
}

# File storage configuration
STORAGE_CONFIG = {
    "upload_dir": os.path.join(BASE_DIR, "uploads"),
    "max_file_size": 10 * 1024 * 1024,  # 10 MB
    "allowed_extensions": ["pdf", "doc", "docx", "jpg", "jpeg", "png", "mp4", "mp3"]
}

# Video conferencing configuration
VIDEO_CONFIG = {
    "max_duration": 60,  # minutes
    "max_participants": 20,
    "recording_enabled": True,
    "recording_storage": os.path.join(BASE_DIR, "recordings")
}

# Resource library configuration
RESOURCE_CONFIG = {
    "max_resources_per_page": 20,
    "storage_dir": os.path.join(BASE_DIR, "resources"),
    "thumbnail_size": (200, 200)
}

# Assessment configuration
ASSESSMENT_CONFIG = {
    "max_questions_per_assessment": 50,
    "max_options_per_question": 6,
    "default_time_limit": 60  # minutes
}

# Report generation configuration
REPORT_CONFIG = {
    "output_dir": os.path.join(BASE_DIR, "reports"),
    "template_dir": os.path.join(BASE_DIR, "report_templates"),
    "max_visualizations_per_report": 10
}

# Feature flags
FEATURE_FLAGS = {
    "enable_video_conferencing": True,
    "enable_virtual_classroom": True,
    "enable_resource_library": True,
    "enable_assessment_tools": True,
    "enable_parent_communication": True,
    "enable_ta_collaboration": True,
    "enable_headteacher_oversight": True,
    "enable_senco_module": True,
    "enable_learning_gaps_analytics": True,
    "enable_class_reports": True
}

def setup_logging():
    """Set up logging configuration."""
    log_dir = os.path.dirname(LOG_CONFIG["file"])
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    logging.basicConfig(
        level=LOG_CONFIG["level"],
        format=LOG_CONFIG["format"],
        handlers=[
            logging.FileHandler(LOG_CONFIG["file"]),
            logging.StreamHandler()
        ]
    )

def get_feature_flag(feature_name):
    """
    Get the status of a feature flag.
    
    Args:
        feature_name: Name of the feature flag
        
    Returns:
        Boolean indicating whether the feature is enabled
    """
    return FEATURE_FLAGS.get(feature_name, False)

def ensure_directory_exists(directory):
    """
    Ensure that a directory exists, creating it if necessary.
    
    Args:
        directory: Path to the directory
    """
    if not os.path.exists(directory):
        os.makedirs(directory)

def get_timestamp():
    """
    Get the current timestamp as a string.
    
    Returns:
        String representation of the current timestamp
    """
    return datetime.now().isoformat()

def load_json_file(file_path):
    """
    Load a JSON file.
    
    Args:
        file_path: Path to the JSON file
        
    Returns:
        Dictionary containing the JSON data, or None if the file doesn't exist
    """
    if not os.path.exists(file_path):
        return None
    
    with open(file_path, "r") as f:
        return json.load(f)

def save_json_file(file_path, data):
    """
    Save data to a JSON file.
    
    Args:
        file_path: Path to the JSON file
        data: Data to save
        
    Returns:
        True if successful, False otherwise
    """
    try:
        directory = os.path.dirname(file_path)
        if not os.path.exists(directory):
            os.makedirs(directory)
        
        with open(file_path, "w") as f:
            json.dump(data, f, indent=2)
        
        return True
    except Exception as e:
        logging.error(f"Error saving JSON file: {str(e)}")
        return False

# Initialize logging
setup_logging()
