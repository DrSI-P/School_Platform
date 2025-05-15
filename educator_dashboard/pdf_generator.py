"""
PDF Generator for Educator Dashboard reports.
Handles the creation of PDF reports for student details and class progress.
"""

import os
import datetime
import logging
from io import BytesIO
from flask import send_file
import tempfile
from weasyprint import HTML, CSS
from jinja2 import Environment, FileSystemLoader

# Set up logging
logger = logging.getLogger(__name__)

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
# Set up the templates directory
templates_dir = os.path.join(os.path.dirname(current_dir), 'templates')
# Ensure the templates directory exists
os.makedirs(templates_dir, exist_ok=True)

# Initialize Jinja2 environment
env = Environment(loader=FileSystemLoader(templates_dir))

def generate_student_pdf_report(student_data):
    """
    Generate a PDF report for a student using WeasyPrint.
    
    Args:
        student_data: StudentDetailResponse object containing all student details
        
    Returns:
        BytesIO: PDF file as a bytes stream
    """
    try:
        logger.info(f"Starting PDF generation for student {student_data.student_id}")
        
        # Prepare data for the template
        template_data = {
            'student': student_data,
            'generated_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            'school_year': get_current_school_year()
        }
        
        # Render the HTML template
        template = env.get_template('student_report_template.html')
        html_content = template.render(**template_data)
        
        # Create PDF from HTML
        css = CSS(string='''
            @page {
                size: letter;
                margin: 1cm;
            }
            body {
                font-family: Arial, sans-serif;
                line-height: 1.5;
                color: #333;
            }
            h1 {
                color: #2c3e50;
                border-bottom: 2px solid #3498db;
                padding-bottom: 10px;
            }
            h2 {
                color: #2980b9;
                margin-top: 20px;
            }
            h3 {
                color: #3498db;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
                border: 2px solid #3498db;
                border-radius: 5px;
                padding: 15px;
                background-color: #f8f9fa;
            }
            .section {
                margin-bottom: 20px;
                border: 1px solid #bdc3c7;
                border-radius: 5px;
                padding: 15px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .section h2 {
                background-color: #f8f9fa;
                padding: 8px;
                margin-top: 0;
                border-bottom: 1px solid #bdc3c7;
                border-radius: 4px 4px 0 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
                border: 2px solid #bdc3c7;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
                border-bottom: 2px solid #bdc3c7;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            .badge {
                display: inline-block;
                padding: 5px 10px;
                margin: 5px;
                background-color: #3498db;
                color: white;
                border-radius: 5px;
                border: 1px solid #2980b9;
            }
            .progress-bar {
                background-color: #eee;
                border-radius: 4px;
                height: 20px;
                width: 100%;
                border: 1px solid #ddd;
            }
            .progress-fill {
                background-color: #3498db;
                height: 100%;
                border-radius: 3px;
                text-align: center;
                color: white;
                font-size: 12px;
                line-height: 20px;
            }
            .footer {
                text-align: center;
                font-size: 10px;
                color: #777;
                margin-top: 30px;
                border-top: 1px solid #bdc3c7;
                padding-top: 10px;
            }
            ul, ol {
                margin-left: 20px;
            }
            li {
                margin-bottom: 5px;
            }
            .alert {
                padding: 10px;
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
                border-radius: 4px;
                margin: 10px 0;
            }
        ''')
        
        # Generate PDF
        pdf_bytes = BytesIO()
        HTML(string=html_content).write_pdf(pdf_bytes, stylesheets=[css])
        pdf_bytes.seek(0)
        
        logger.info(f"PDF generation completed for student {student_data.student_id}")
        return pdf_bytes
    except Exception as e:
        logger.error(f"Error generating PDF for student {student_data.student_id}: {str(e)}")
        raise

def get_current_school_year():
    """
    Calculate the current school year (e.g., "2024-2025")
    """
    now = datetime.datetime.now()
    year = now.year
    month = now.month
    
    # In the UK, the school year typically starts in September
    if month >= 9:  # September or later
        return f"{year}-{year + 1}"
    else:
        return f"{year - 1}-{year}"

def create_student_report_template():
    """
    Create the HTML template for student reports if it doesn't exist.
    """
    template_path = os.path.join(templates_dir, 'student_report_template.html')
    
    # Only create if it doesn't exist
    if not os.path.exists(template_path):
        template_content = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Student Report - {{ student.name }}</title>
</head>
<body>
    <div class="header">
        <h1>EdPsych Connect - Student Report</h1>
        <p>Student: {{ student.name }} | Year Group: {{ student.year_group }} | School Year: {{ school_year }}</p>
        <p>Report Generated: {{ generated_date }}</p>
    </div>
    
    <div class="section">
        <h2>Overview</h2>
        <p>Student ID: {{ student.student_id }}</p>
        <p>Last Active: {{ student.last_active.strftime('%Y-%m-%d %H:%M') if student.last_active else 'N/A' }}</p>
        <p>Overall Progress: {{ student.overall_progress }}%</p>
        <div class="progress-bar">
            <div class="progress-fill" style="width: {{ student.overall_progress }}%">
                {{ student.overall_progress }}%
            </div>
        </div>
        
        {% if student.requires_attention %}
        <div class="alert">
            <strong>Attention Required:</strong> {{ student.attention_reason }}
        </div>
        {% endif %}
    </div>
    
    <div class="section">
        <h2>Learning Progress</h2>
        
        <h3>Completed Learning Objectives ({{ student.completed_los|length }})</h3>
        {% if student.completed_los %}
        <ul>
            {% for lo in student.completed_los %}
            <li>{{ lo }}</li>
            {% endfor %}
        </ul>
        {% else %}
        <p>No learning objectives completed yet.</p>
        {% endif %}
        
        {% if student.current_lo_id %}
        <h3>Current Learning Objective</h3>
        <p>{{ student.current_lo_id }}</p>
        {% endif %}
    </div>
    
    <div class="section">
        <h2>Learning Profile</h2>
        
        <h3>Learning Preferences</h3>
        <table>
            <tr>
                <th>Category</th>
                <th>Value</th>
            </tr>
            {% for pref in student.learning_preferences %}
            <tr>
                <td>{{ pref.category }}</td>
                <td>{{ pref.value }}</td>
            </tr>
            {% endfor %}
        </table>
        
        <h3>Interests</h3>
        <p>
            {% for interest in student.interests %}
            <span class="badge">{{ interest }}</span>
            {% endfor %}
        </p>
        
        {% if student.struggle_areas %}
        <h3>Areas Requiring Support</h3>
        <ul>
            {% for struggle in student.struggle_areas %}
            <li>{{ struggle }}</li>
            {% endfor %}
        </ul>
        {% endif %}
    </div>
    
    {% if student.cognitive_metrics %}
    <div class="section">
        <h2>Cognitive Metrics</h2>
        
        <table>
            <tr>
                <th>Task</th>
                <th>Metrics</th>
            </tr>
            {% for metric in student.cognitive_metrics %}
            <tr>
                <td>{{ metric.task_name }}</td>
                <td>
                    <ul>
                    {% for key, value in metric.metrics.items() %}
                        <li>{{ key }}: {{ value }}</li>
                    {% endfor %}
                    </ul>
                </td>
            </tr>
            {% endfor %}
        </table>
    </div>
    {% endif %}
    
    {% if student.activity_history %}
    <div class="section">
        <h2>Recent Activity</h2>
        
        <table>
            <tr>
                <th>Date</th>
                <th>Activity</th>
                <th>Type</th>
                <th>Score</th>
                <th>Status</th>
            </tr>
            {% for activity in student.activity_history|sort(attribute='timestamp', reverse=True) %}
            <tr>
                <td>{{ activity.timestamp.strftime('%Y-%m-%d') if activity.timestamp else 'N/A' }}</td>
                <td>{{ activity.activity_id }}</td>
                <td>{{ activity.activity_type }}</td>
                <td>{{ activity.score if activity.score is not none else 'N/A' }}</td>
                <td>{{ 'Completed' if activity.completed else 'In Progress' }}</td>
            </tr>
            {% endfor %}
        </table>
    </div>
    {% endif %}
    
    {% if student.badges_earned %}
    <div class="section">
        <h2>Badges Earned</h2>
        <table>
            <tr>
                <th>Badge</th>
                <th>Description</th>
                <th>Date Earned</th>
            </tr>
            {% for badge in student.badges_earned|sort(attribute='date_earned', reverse=True) %}
            <tr>
                <td>{{ badge.badge_name }}</td>
                <td>{{ badge.description }}</td>
                <td>{{ badge.date_earned.strftime('%Y-%m-%d') if badge.date_earned else 'N/A' }}</td>
            </tr>
            {% endfor %}
        </table>
    </div>
    {% endif %}
    
    <div class="footer">
        <p>EdPsych Connect - Empowering learners through tailored, evidence-based support</p>
        <p>This report is confidential and intended for educational purposes only.</p>
    </div>
</body>
</html>"""
        
        with open(template_path, 'w') as f:
            f.write(template_content)
            
    return template_path

# Create the template when the module is imported
create_student_report_template()
