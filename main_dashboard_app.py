# main_dashboard_app.py
"""
Main Flask application to run the Educator Dashboard API.
Registers all blueprints and configures necessary extensions like JWT.
"""

import datetime # Added to fix NameError
from flask import Flask, jsonify # Added jsonify
from flask_jwt_extended import JWTManager
import os

# Import blueprints from the educator_dashboard module
from educator_dashboard.api import (
    auth_bp, dashboard_bp, students_bp, 
    curriculum_bp, activities_bp, reports_bp
)
from educator_dashboard.assessment_api import assessments_bp
from educator_dashboard.recommendation_api import recommendations_bp
from educator_dashboard import bcrypt # For initializing bcrypt if needed elsewhere
from config import setup_logging, BASE_DIR # For logging and base directory

# Setup logging
setup_logging()

app = Flask(__name__)

# --- JWT Configuration ---
# In a real application, this secret key should be complex and stored securely, e.g., in environment variables.
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "super-secret-dev-key") # Change this!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=1) # Example: token expires in 1 hour

jwt = JWTManager(app)

# --- Bcrypt Initialization (if used for hashing passwords directly in app) ---
# bcrypt.init_app(app) # Initialize bcrypt with the Flask app if you are hashing passwords here

# --- Register Blueprints ---
app.register_blueprint(auth_bp, url_prefix='/api/educator/auth')
app.register_blueprint(dashboard_bp, url_prefix='/api/educator/dashboard')
app.register_blueprint(students_bp, url_prefix='/api/educator/students')
app.register_blueprint(curriculum_bp, url_prefix='/api/educator/curriculum')
app.register_blueprint(activities_bp, url_prefix='/api/educator/activities')
app.register_blueprint(reports_bp, url_prefix='/api/educator/reports')
app.register_blueprint(recommendations_bp, url_prefix='/api/educator/recommendations')
app.register_blueprint(assessments_bp, url_prefix='/api/educator/assessments')

@app.route("/api/educator/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "Educator Dashboard API is running."}), 200

if __name__ == "__main__":
    # Ensure the database directory exists (especially if DB is created on first run by setup)
    db_dir = os.path.join(BASE_DIR, "database")
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
        print(f"Created database directory: {db_dir}")

    # You might want to run database_setup.py here if it hasn't been run
    # import database_setup
    # database_setup.create_tables() # Or a function that checks and creates if not exists

    app.run(host="0.0.0.0", port=5001, debug=True) # Using port 5001 to avoid conflict if main app runs on 5000

