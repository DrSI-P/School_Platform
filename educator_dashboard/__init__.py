# educator_dashboard/__init__.py
"""
Initialization file for the Educator Dashboard Flask application and module.
"""

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

# Import configurations (assuming a central config.py or similar)
# from ..config import Config # Adjust path as needed

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app(config_class=None):
    """Application factory function to create and configure the Flask app."""
    app = Flask(__name__)

    # Load configuration
    # if config_class:
    #     app.config.from_object(config_class)
    # else:
        # Default configuration (can be loaded from environment variables or a default class)
        # Example: app.config.from_object('yourapp.config.DevelopmentConfig')
        # For now, using some sensible defaults for JWT and SQLAlchemy
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'database', 'edpsych_connect_dala.db')}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "your-super-secret-jwt-key-change-this!"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False # For simplicity, no expiration for now

    # Initialize Flask extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Import and register Blueprints (API routes)
    from .api import auth_bp, dashboard_bp, students_bp, curriculum_bp, activities_bp, reports_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(curriculum_bp, url_prefix='/api/curriculum')
    app.register_blueprint(activities_bp, url_prefix='/api/activities')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')

    # Create database tables if they don_t exist (within app context)
    # This is usually handled by migrations in larger apps (e.g., Flask-Migrate)
    with app.app_context():
        # We assume tables are already created by database_setup.py from the main DALA prototype
        # If this dashboard were to manage its own tables or extend them, we'd add: db.create_all()
        pass

    return app

