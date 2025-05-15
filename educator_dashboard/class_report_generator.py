"""
Class Report Generator for EdPsych Connect.

This module provides functionality for generating comprehensive class reports
with visualizations, insights, and recommendations for educators.
"""

import logging
import json
import uuid
import datetime
from typing import List, Dict, Optional, Any, Union
import os
import base64
from io import BytesIO
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import seaborn as sns

# Use reportlab instead of fpdf2 to avoid dependency issues
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet

# Setup logging
logger = logging.getLogger(__name__)

# Import necessary modules
from edpsychconnect_dala_prototype.persistence_manager import persistence_manager

# Import analytics modules for integration
from edpsychconnect_dala_prototype.educator_dashboard.learning_gaps_analytics import (
    analyze_class_learning_gaps,
    analyze_activity_effectiveness
)

# --- Data Models ---

class ClassReport:
    """Model for a class report."""
    
    def __init__(self,
                 id: str,
                 class_id: str,
                 title: str,
                 description: str,
                 created_by: str,
                 report_date: str,
                 time_period: str,
                 sections: List[Dict[str, Any]] = None,
                 visualizations: List[Dict[str, Any]] = None,
                 insights: List[str] = None,
                 recommendations: List[str] = None,
                 metadata: Dict[str, Any] = None,
                 created_at: str = None,
                 updated_at: str = None):
        """
        Initialize a class report.
        
        Args:
            id: Unique identifier for the report
            class_id: ID of the class
            title: Title of the report
            description: Description of the report
            created_by: ID of the user who created the report
            report_date: Date of the report
            time_period: Time period covered by the report
            sections: List of report sections
            visualizations: List of visualizations included in the report
            insights: List of insights derived from the data
            recommendations: List of recommendations based on the insights
            metadata: Additional metadata about the report
            created_at: Timestamp when the report was created
            updated_at: Timestamp when the report was last updated
        """
        self.id = id
        self.class_id = class_id
        self.title = title
        self.description = description
        self.created_by = created_by
        self.report_date = report_date
        self.time_period = time_period
        self.sections = sections or []
        self.visualizations = visualizations or []
        self.insights = insights or []
        self.recommendations = recommendations or []
        self.metadata = metadata or {}
        self.created_at = created_at or datetime.datetime.now().isoformat()
        self.updated_at = updated_at or datetime.datetime.now().isoformat()
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert the class report to a dictionary."""
        return {
            "id": self.id,
            "class_id": self.class_id,
            "title": self.title,
            "description": self.description,
            "created_by": self.created_by,
            "report_date": self.report_date,
            "time_period": self.time_period,
            "sections": self.sections,
            "visualizations": self.visualizations,
            "insights": self.insights,
            "recommendations": self.recommendations,
            "metadata": self.metadata,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ClassReport':
        """Create a class report from a dictionary."""
        return cls(**data)


class ReportTemplate:
    """Model for a report template."""
    
    def __init__(self,
                 id: str,
                 title: str,
                 description: str,
                 created_by: str,
                 sections: List[Dict[str, Any]] = None,
                 metadata: Dict[str, Any] = None,
                 is_default: bool = False,
                 created_at: str = None,
                 updated_at: str = None):
        """
        Initialize a report template.
        
        Args:
            id: Unique identifier for the template
            title: Title of the template
            description: Description of the template
            created_by: ID of the user who created the template
            sections: List of template sections
            metadata: Additional metadata about the template
            is_default: Whether this is a default template
            created_at: Timestamp when the template was created
            updated_at: Timestamp when the template was last updated
        """
        self.id = id
        self.title = title
        self.description = description
        self.created_by = created_by
        self.sections = sections or []
        self.metadata = metadata or {}
        self.is_default = is_default
        self.created_at = created_at or datetime.datetime.now().isoformat()
        self.updated_at = updated_at or datetime.datetime.now().isoformat()
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert the report template to a dictionary."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "created_by": self.created_by,
            "sections": self.sections,
            "metadata": self.metadata,
            "is_default": self.is_default,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ReportTemplate':
        """Create a report template from a dictionary."""
        return cls(**data)


# --- Report Generation Functions ---

def generate_comprehensive_class_report(class_id: str, time_period: str, created_by: str) -> Dict[str, Any]:
    """
    Generate a comprehensive class report with analytics, visualizations, and recommendations.
    
    Args:
        class_id: ID of the class
        time_period: Time period for the report (e.g., "term1", "semester2", "year")
        created_by: ID of the user generating the report
        
    Returns:
        Dictionary containing the generated report
    """
    try:
        # Create a title and description for the report
        title = f"Comprehensive Class Report - {class_id}"
        description = f"Comprehensive analysis of class performance and engagement for {time_period}"
        
        # Create the base report
        report = create_class_report(
            class_id=class_id,
            title=title,
            description=description,
            created_by=created_by,
            time_period=time_period
        )
        
        if not report:
            logger.error(f"Failed to create base report for class {class_id}")
            return {}
        
        # Get learning gaps analysis
        learning_gaps = analyze_class_learning_gaps(class_id, time_period)
        
        # Get engagement analysis
        engagement = analyze_activity_effectiveness(class_id, time_period)
        
        # Create visualizations
        visualizations = []
        
        # Learning gaps visualization
        if learning_gaps and 'data' in learning_gaps:
            fig, ax = plt.subplots(figsize=(10, 6))
            data = learning_gaps['data']
            
            # Create a bar chart of learning gaps by subject/topic
            subjects = [item['subject'] for item in data]
            gap_scores = [item['gap_score'] for item in data]
            
            ax.bar(subjects, gap_scores, color='skyblue')
            ax.set_xlabel('Subject/Topic')
            ax.set_ylabel('Gap Score')
            ax.set_title('Learning Gaps by Subject/Topic')
            plt.xticks(rotation=45, ha='right')
            plt.tight_layout()
            
            # Save the figure to a BytesIO object
            buf = BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            
            # Encode the image as base64
            img_str = base64.b64encode(buf.read()).decode('utf-8')
            
            # Add the visualization to the list
            visualizations.append({
                'id': f"viz_{uuid.uuid4().hex[:8]}",
                'title': 'Learning Gaps by Subject/Topic',
                'description': 'Bar chart showing learning gaps across different subjects and topics',
                'type': 'bar_chart',
                'image_data': img_str,
                'data': data
            })
            
            plt.close(fig)
        
        # Engagement visualization
        if engagement and 'data' in engagement:
            fig, ax = plt.subplots(figsize=(10, 6))
            data = engagement['data']
            
            # Create a line chart of engagement over time
            dates = [item['date'] for item in data]
            engagement_scores = [item['engagement_score'] for item in data]
            
            ax.plot(dates, engagement_scores, marker='o', linestyle='-', color='green')
            ax.set_xlabel('Date')
            ax.set_ylabel('Engagement Score')
            ax.set_title('Class Engagement Over Time')
            plt.xticks(rotation=45, ha='right')
            plt.tight_layout()
            
            # Save the figure to a BytesIO object
            buf = BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            
            # Encode the image as base64
            img_str = base64.b64encode(buf.read()).decode('utf-8')
            
            # Add the visualization to the list
            visualizations.append({
                'id': f"viz_{uuid.uuid4().hex[:8]}",
                'title': 'Class Engagement Over Time',
                'description': 'Line chart showing class engagement levels over time',
                'type': 'line_chart',
                'image_data': img_str,
                'data': data
            })
            
            plt.close(fig)
        
        # Add sections to the report
        sections = [
            {
                'id': f"sec_{uuid.uuid4().hex[:8]}",
                'title': 'Learning Gaps Analysis',
                'content': learning_gaps.get('summary', 'No learning gaps analysis available'),
                'order': 1
            },
            {
                'id': f"sec_{uuid.uuid4().hex[:8]}",
                'title': 'Engagement Analysis',
                'content': engagement.get('summary', 'No engagement analysis available'),
                'order': 2
            },
            {
                'id': f"sec_{uuid.uuid4().hex[:8]}",
                'title': 'Recommendations',
                'content': 'Based on the analysis, the following recommendations are provided:\n\n' + 
                          '\n'.join([f"- {rec}" for rec in learning_gaps.get('recommendations', []) + engagement.get('recommendations', [])]),
                'order': 3
            }
        ]
        
        # Update the report with sections and visualizations
        report_id = report['id']
        
        # In a real implementation, we would update the report in the database
        # For now, we'll just update our local copy
        report['sections'] = sections
        report['visualizations'] = visualizations
        report['insights'] = learning_gaps.get('insights', []) + engagement.get('insights', [])
        report['recommendations'] = learning_gaps.get('recommendations', []) + engagement.get('recommendations', [])
        
        return report
    except Exception as e:
        logger.error(f"Error generating comprehensive class report: {str(e)}")
        return {}


def export_report_to_pdf(report: Dict[str, Any], output_path: str) -> bool:
    """
    Export a class report to PDF format using reportlab.
    
    Args:
        report: Dictionary containing the report data
        output_path: Path where the PDF file should be saved
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Create a PDF document
        doc = SimpleDocTemplate(output_path, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []
        
        # Add title
        title_style = styles['Title']
        elements.append(Paragraph(report.get('title', 'Class Report'), title_style))
        elements.append(Spacer(1, 12))
        
        # Add description
        normal_style = styles['Normal']
        elements.append(Paragraph(report.get('description', ''), normal_style))
        elements.append(Spacer(1, 12))
        
        # Add date and time period
        elements.append(Paragraph(f"Report Date: {report.get('report_date', '')}", normal_style))
        elements.append(Paragraph(f"Time Period: {report.get('time_period', '')}", normal_style))
        elements.append(Spacer(1, 24))
        
        # Add sections
        heading_style = styles['Heading2']
        
        for section in sorted(report.get('sections', []), key=lambda x: x.get('order', 0)):
            elements.append(Paragraph(section.get('title', ''), heading_style))
            elements.append(Spacer(1, 12))
            
            # Split content into paragraphs
            content = section.get('content', '')
            paragraphs = content.split('\n\n')
            for para in paragraphs:
                elements.append(Paragraph(para, normal_style))
                elements.append(Spacer(1, 6))
            
            elements.append(Spacer(1, 12))
        
        # Add visualizations
        if report.get('visualizations', []):
            elements.append(Paragraph("Visualizations", heading_style))
            elements.append(Spacer(1, 12))
            
            for viz in report.get('visualizations', []):
                elements.append(Paragraph(viz.get('title', ''), styles['Heading3']))
                elements.append(Spacer(1, 6))
                elements.append(Paragraph(viz.get('description', ''), normal_style))
                elements.append(Spacer(1, 6))
                
                # Add the visualization image if available
                if 'image_data' in viz:
                    img_data = base64.b64decode(viz['image_data'])
                    img_file = f"/tmp/{uuid.uuid4().hex}.png"
                    
                    with open(img_file, 'wb') as f:
                        f.write(img_data)
                    
                    img = Image(img_file, width=450, height=300)
                    elements.append(img)
                    elements.append(Spacer(1, 12))
                    
                    # Clean up the temporary file
                    os.remove(img_file)
        
        # Add insights and recommendations
        if report.get('insights', []):
            elements.append(Paragraph("Key Insights", heading_style))
            elements.append(Spacer(1, 12))
            
            for insight in report.get('insights', []):
                elements.append(Paragraph(f"• {insight}", normal_style))
                elements.append(Spacer(1, 6))
            
            elements.append(Spacer(1, 12))
        
        if report.get('recommendations', []):
            elements.append(Paragraph("Recommendations", heading_style))
            elements.append(Spacer(1, 12))
            
            for recommendation in report.get('recommendations', []):
                elements.append(Paragraph(f"• {recommendation}", normal_style))
                elements.append(Spacer(1, 6))
        
        # Build the PDF
        doc.build(elements)
        
        return True
    except Exception as e:
        logger.error(f"Error exporting report to PDF: {str(e)}")
        return False


def create_class_report(class_id: str,
                      title: str,
                      description: str,
                      created_by: str,
                      time_period: str,
                      template_id: str = None,
                      sections: List[Dict[str, Any]] = None,
                      metadata: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
    """
    Create a class report.
    
    Args:
        class_id: ID of the class
        title: Title of the report
        description: Description of the report
        created_by: ID of the user who created the report
        time_period: Time period covered by the report
        template_id: Optional ID of the template to use
        sections: Optional list of report sections (if not using a template)
        metadata: Optional additional metadata about the report
        
    Returns:
        Dictionary containing the created report or None if failed
    """
    try:
        # Generate a unique report ID
        report_id = f"rep_{uuid.uuid4().hex[:12]}"
        report_date = datetime.datetime.now().isoformat()
        
        # If using a template, get the template sections
        if template_id:
            template = get_report_template(template_id)
            if template:
                sections = template.get("sections", [])
        
        # Create the report
        report = ClassReport(
            id=report_id,
            class_id=class_id,
            title=title,
            description=description,
            created_by=created_by,
            report_date=report_date,
            time_period=time_period,
            sections=sections,
            metadata=metadata
        )
        
        # Convert to dictionary for storage
        report_dict = report.to_dict()
        
        # TODO: Store in database using persistence manager
        # For now, we'll just return the dictionary
        return report_dict
    except Exception as e:
        logger.error(f"Error creating class report: {str(e)}")
        return None


def get_class_reports(class_id: str = None, created_by: str = None) -> List[Dict[str, Any]]:
    """
    Get class reports, optionally filtered by various criteria.
    
    Args:
        class_id: Optional ID of the class
        created_by: Optional ID of the user who created the reports
        
    Returns:
        List of report dictionaries
    """
    try:
        # TODO: Retrieve from database using persistence manager
        # For now, we'll return an empty list
        return []
    except Exception as e:
        logger.error(f"Error getting class reports: {str(e)}")
        return []


def update_class_report(report_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Update a class report.
    
    Args:
        report_id: ID of the report to update
        updates: Dictionary of fields to update
        
    Returns:
        Dictionary containing the updated report or None if failed
    """
    try:
        # TODO: Implement this function
        return None
    except Exception as e:
        logger.error(f"Error updating class report {report_id}: {str(e)}")
        return None


def add_report_section(report_id: str, section: Dict[str, Any]) -> bool:
    """
    Add a section to a class report.
    
    Args:
        report_id: ID of the report
        section: Dictionary containing section details
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Get the report
        reports = get_class_reports(report_id=report_id)
        if not reports or len(reports) == 0:
            return False
        
        report = reports[0]
        
        # Add the section
        sections = report.get("sections", [])
        sections.append(section)
        
        # Update the report
        updates = {
            "sections": sections,
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Update the report
        updated_report = update_class_report(report_id, updates)
        return updated_report is not None
    except Exception as e:
        logger.error(f"Error adding section to class report {report_id}: {str(e)}")
        return False


def add_report_visualization(report_id: str, visualization: Dict[str, Any]) -> bool:
    """
    Add a visualization to a class report.
    
    Args:
        report_id: ID of the report
        visualization: Dictionary containing visualization details
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Get the report
        reports = get_class_reports(report_id=report_id)
        if not reports or len(reports) == 0:
            return False
        
        report = reports[0]
        
        # Add the visualization
        visualizations = report.get("visualizations", [])
        visualizations.append(visualization)
        
        # Update the report
        updates = {
            "visualizations": visualizations,
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Update the report
        updated_report = update_class_report(report_id, updates)
        return updated_report is not None
    except Exception as e:
        logger.error(f"Error adding visualization to class report {report_id}: {str(e)}")
        return False


def add_report_insights(report_id: str, insights: List[str]) -> bool:
    """
    Add insights to a class report.
    
    Args:
        report_id: ID of the report
        insights: List of insights
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Get the report
        reports = get_class_reports(report_id=report_id)
        if not reports or len(reports) == 0:
            return False
        
        report = reports[0]
        
        # Add the insights
        current_insights = report.get("insights", [])
        for insight in insights:
            if insight not in current_insights:
                current_insights.append(insight)
        
        # Update the report
        updates = {
            "insights": current_insights,
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Update the report
        updated_report = update_class_report(report_id, updates)
        return updated_report is not None
    except Exception as e:
        logger.error(f"Error adding insights to class report {report_id}: {str(e)}")
        return False


def add_report_recommendations(report_id: str, recommendations: List[str]) -> bool:
    """
    Add recommendations to a class report.
    
    Args:
        report_id: ID of the report
        recommendations: List of recommendations
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Get the report
        reports = get_class_reports(report_id=report_id)
        if not reports or len(reports) == 0:
            return False
        
        report = reports[0]
        
        # Add the recommendations
        current_recommendations = report.get("recommendations", [])
        for recommendation in recommendations:
            if recommendation not in current_recommendations:
                current_recommendations.append(recommendation)
        
        # Update the report
        updates = {
            "recommendations": current_recommendations,
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Update the report
        updated_report = update_class_report(report_id, updates)
        return updated_report is not None
    except Exception as e:
        logger.error(f"Error adding recommendations to class report {report_id}: {str(e)}")
        return False


# --- Report Template Functions ---

def create_report_template(title: str,
                         description: str,
                         created_by: str,
                         sections: List[Dict[str, Any]] = None,
                         metadata: Dict[str, Any] = None,
                         is_default: bool = False) -> Optional[Dict[str, Any]]:
    """
    Create a report template.
    
    Args:
        title: Title of the template
        description: Description of the template
        created_by: ID of the user who created the template
        sections: Optional list of template sections
        metadata: Optional additional metadata about the template
        is_default: Optional flag indicating whether this is a default template
        
    Returns:
        Dictionary containing the created template or None if failed
    """
    try:
        # Generate a unique template ID
        template_id = f"tpl_{uuid.uuid4().hex[:12]}"
        
        # Create the template
        template = ReportTemplate(
            id=template_id,
            title=title,
            description=description,
            created_by=created_by,
            sections=sections,
            metadata=metadata,
            is_default=is_default
        )
        
        # Convert to dictionary for storage
        template_dict = template.to_dict()
        
        # TODO: Store in database using persistence manager
        # For now, we'll just return the dictionary
        return template_dict
    except Exception as e:
        logger.error(f"Error creating report template: {str(e)}")
        return None


def get_report_templates(created_by: str = None, is_default: bool = None) -> List[Dict[str, Any]]:
    """
    Get report templates, optionally filtered by various criteria.
    
    Args:
        created_by: Optional ID of the user who created the templates
        is_default: Optional flag indicating whether to get default templates
        
    Returns:
        List of template dictionaries
    """
    try:
        # TODO: Retrieve from database using persistence manager
        # For now, we'll return an empty list
        return []
    except Exception as e:
        logger.error(f"Error getting report templates: {str(e)}")
        return []


def get_report_template(template_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a specific report template.
    
    Args:
        template_id: ID of the template to get
        
    Returns:
        Dictionary containing the template or None if not found
    """
    try:
        # TODO: Retrieve from database using persistence manager
        # For now, we'll return None
        return None
    except Exception as e:
        logger.error(f"Error getting report template {template_id}: {str(e)}")
        return None


def update_report_template(template_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Update a report template.
    
    Args:
        template_id: ID of the template to update
        updates: Dictionary of fields to update
        
    Returns:
        Dictionary containing the updated template or None if failed
    """
    try:
        # TODO: Implement this function
        return None
    except Exception as e:
        logger.error(f"Error updating report template {template_id}: {str(e)}")
        return None


def add_template_section(template_id: str, section: Dict[str, Any]) -> bool:
    """
    Add a section to a report template.
    
    Args:
        template_id: ID of the template
        section: Dictionary containing section details
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Get the template
        template = get_report_template(template_id)
        if not template:
            return False
        
        # Add the section
        sections = template.get("sections", [])
        sections.append(section)
        
        # Update the template
        updates = {
            "sections": sections,
            "updated_at": datetime.datetime.now().isoformat()
        }
        
        # Update the template
        updated_template = update_report_template(template_id, updates)
        return updated_template is not None
    except Exception as e:
        logger.error(f"Error adding section to report template {template_id}: {str(e)}")
        return False
