"""
EdPsych Connect - Dynamic AI Learning Architect (DALA)
Simple Student Interface Prototype - HTML Generator (Stage 2 Enhancements)

This script generates a basic HTML page to simulate the student interface for:
1.  HLP diagnostic tasks (simulated choices).
2.  Interest selection (simulated choices).
3.  Struggle area identification (interactive selection and display).
4.  Learning goal setting (interactive input and display).
5.  New Stage 2 HLP Sophisticated Diagnostic Mini-Tasks.
6.  Displaying a personalized learning pathway.
7.  Includes a simple "Star Collector" mini-game as a reward.
8.  Integrates the "Adventure Quest Saga" visual progress tracking system with image assets.
9.  Integrates a badge and achievement system (display and awarding logic).
10. Includes a basic prototype for voice input using Web Speech API.
11. Integrates basic text-to-speech (TTS) capability using Web Speech API.

It will use the existing hlp_module and dcw_apg_module.
Visual enhancements are applied for better engagement.
"""

import os
import html
import random
import datetime # For formatting badge earned date
import json # For learner profile data in JS
import logging # Added for structured logging
from typing import List, Dict, Any, Tuple # For type hinting

# Import and setup logging from config.py
from config import (
    setup_logging, DEFAULT_OUTPUT_HTML_FILENAME, DEFAULT_OUTPUT_DIR_NAME,
    ASSET_DIR_NAME, ADVENTURE_QUEST_ASSETS_SUBDIR, DEFAULT_STUDENT_ID,
    DEFAULT_INITIAL_CONTENT_SET_KEY, DEFAULT_NEW_CONTENT_SET_KEY,
    DEFAULT_TARGET_LO_COUNT, DEFAULT_MAX_ACTIVITIES_PER_LO,
    CURRICULUM_SLICE_MATH_Y4_FILE, LEARNING_CONTENT_SET_MATH_Y4_FILE,
    CURRICULUM_SLICE_KS2_ENGLISH_Y34_FILE, KS2_ENGLISH_ACTIVITIES_SET2_FILE,
    BASE_DIR
)
setup_logging() # Initialize logging configuration

# Get a logger for this module
logger = logging.getLogger(__name__)

from hlp_module import (
    LearnerProfile, PREDEFINED_INTERESTS, PREDEFINED_STRUGGLE_AREAS,
    run_visual_preference_task, run_textual_preference_task,
    capture_student_interests, capture_student_struggles,
    run_story_weaver_task, run_mind_mapper_task,
    BADGE_DEFINITIONS, check_and_award_all_relevant_badges, run_full_hlp_assessment
)
# Assuming curriculum_content_module.py is in the same directory or accessible via PYTHONPATH
from curriculum_content_module import CurriculumContentStore # Removed direct data imports
from dcw_apg_module import PathwayGenerator

# --- Load Curriculum Data ---
def load_curriculum_data(curriculum_file_path: str, content_file_path: str) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
    """Loads curriculum and content data from specified JSON files."""
    try:
        with open(curriculum_file_path, 'r', encoding='utf-8') as f:
            curriculum_data = json.load(f)
        with open(content_file_path, 'r', encoding='utf-8') as f:
            content_data = json.load(f)
        return curriculum_data, content_data
    except FileNotFoundError as e:
        logger.error(f"Error loading curriculum/content data: {e}")
        raise
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON from curriculum/content data: {e}")
        raise

# --- Load HTML Template ---
def load_html_template(template_path: str) -> str:
    """Loads an HTML template from a file.
    
    Args:
        template_path (str): Path to the HTML template file.
        
    Returns:
        str: The HTML template as a string.
        
    Raises:
        FileNotFoundError: If the template file doesn't exist.
    """
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()
        logger.info(f"Successfully loaded HTML template from {template_path}")
        return template
    except FileNotFoundError as e:
        logger.error(f"Error loading HTML template: {e}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error loading HTML template: {e}")
        raise

# Load the initial Math curriculum and content
initial_curriculum_data, initial_content_data = load_curriculum_data(
    CURRICULUM_SLICE_MATH_Y4_FILE,
    LEARNING_CONTENT_SET_MATH_Y4_FILE
)

# Load the new KS2 English curriculum and content
new_curriculum_data, new_content_data = load_curriculum_data(
    CURRICULUM_SLICE_KS2_ENGLISH_Y34_FILE,
    KS2_ENGLISH_ACTIVITIES_SET2_FILE
)

# Path to the HTML template
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")
HTML_TEMPLATE_PATH = os.path.join(TEMPLATE_DIR, "student_interface_template_v15_tts.html")

def generate_html_interface(student_id: str = DEFAULT_STUDENT_ID, output_filename: str = DEFAULT_OUTPUT_HTML_FILENAME) -> str:
    """
    Generates an HTML interface for the student based on their profile and learning pathway.
    
    Args:
        student_id (str, optional): The ID of the student. Defaults to DEFAULT_STUDENT_ID.
        output_filename (str, optional): The filename for the output HTML. Defaults to DEFAULT_OUTPUT_HTML_FILENAME.
        
    Returns:
        str: The path to the generated HTML file.
    """
    logger.info(f"Generating interface for student: {student_id}")
    
    # Create output directory if it doesn't exist
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), DEFAULT_OUTPUT_DIR_NAME)
    os.makedirs(output_dir, exist_ok=True)
    
    # Create assets directory if it doesn't exist
    assets_dir = os.path.join(output_dir, ASSET_DIR_NAME)
    os.makedirs(assets_dir, exist_ok=True)
    
    # Create adventure quest assets subdirectory if it doesn't exist
    adventure_quest_assets_dir = os.path.join(assets_dir, ADVENTURE_QUEST_ASSETS_SUBDIR)
    os.makedirs(adventure_quest_assets_dir, exist_ok=True)
    
    # Copy sample adventure quest assets (placeholder for actual implementation)
    # In a real implementation, you would copy actual asset files here
    
    # Initialize the learner profile
    learner_profile = LearnerProfile(student_id=student_id)
    
    # Run the HLP assessment to populate the learner profile
    run_full_hlp_assessment(learner_profile)
    
    # Initialize the curriculum content store with the initial curriculum data
    content_store = CurriculumContentStore(
        learning_objectives_data=initial_curriculum_data,
        learning_content_data=initial_content_data
    )
    
    # Generate an initial learning pathway
    pathway_generator = PathwayGenerator(learner_profile, content_store)
    initial_pathway = pathway_generator.generate_initial_pathway(
        target_lo_count=DEFAULT_TARGET_LO_COUNT,
        max_activities_per_lo=DEFAULT_MAX_ACTIVITIES_PER_LO
    )
    
    # Simulate completing some LOs to demonstrate progress
    if initial_pathway and len(initial_pathway) > 0:
        # Mark the first LO as completed
        first_lo_id = initial_pathway[0]['id']
        learner_profile.mark_lo_completed(first_lo_id)
        logger.info(f"Marked LO {first_lo_id} as completed for demonstration")
        
        # If there's a second LO, mark it as in progress
        if len(initial_pathway) > 1:
            second_lo_id = initial_pathway[1]['id']
            learner_profile.current_learning_objective_id = second_lo_id
            logger.info(f"Set LO {second_lo_id} as current for demonstration")
    
    # Add the new curriculum content to demonstrate switching subjects
    content_store.add_learning_objectives(new_curriculum_data)
    content_store.add_learning_content(new_content_data)
    logger.info("Added new curriculum content (KS2 English)")
    
    # Generate a new pathway with the combined curriculum
    combined_pathway = pathway_generator.generate_initial_pathway(
        target_lo_count=DEFAULT_TARGET_LO_COUNT,
        max_activities_per_lo=DEFAULT_MAX_ACTIVITIES_PER_LO
    )
    
    # Award some badges for demonstration
    learner_profile.earned_badges_data["first_step"] = {
        "earned_date": datetime.datetime.now().strftime("%Y-%m-%d"),
        "details": "Awarded for starting your learning journey!"
    }
    learner_profile.earned_badges_data["hlp_explorer"] = {
        "earned_date": datetime.datetime.now().strftime("%Y-%m-%d"),
        "details": "Awarded for completing the learning profile assessment!"
    }
    
    # Check for any additional badges that might be earned
    check_and_award_all_relevant_badges(learner_profile)
    
    # Generate HTML for the learning objectives and content items
    learning_objectives_html = ""
    for lo in combined_pathway:
        lo_html = f"""
        <li>
            <div class="lo-title-container">
                <div class="lo-title">{html.escape(lo.get('description', 'No description'))}</div>
                <div>Subject: {html.escape(lo.get('subject', 'N/A'))} | Year: {html.escape(lo.get('year_group', 'N/A'))}</div>
            </div>
            <button class="tts-button" title="Read aloud">🔊</button>
        </li>
        """
        
        # Add content items if available
        content_items = lo.get('content_items', [])
        if content_items:
            for item in content_items:
                content_html = f"""
                <li style="margin-left: 30px;">
                    <div class="content-title-container">
                        <div class="content-title">{html.escape(item.get('title', 'No title'))} <em>({html.escape(item.get('type', 'unknown type'))})</em></div>
                        <div>Difficulty: {html.escape(item.get('difficulty', 'N/A'))}</div>
                    </div>
                    <button class="tts-button" title="Read aloud">🔊</button>
                </li>
                """
                lo_html += content_html
        
        learning_objectives_html += lo_html
    
    # Generate HTML for interests
    interests_html = ""
    for interest in learner_profile.interests:
        interests_html += f'<span class="selected-item-tag">{html.escape(interest)}</span>'
    
    # Generate HTML for struggles
    struggles_html = ""
    for struggle in learner_profile.struggle_areas:
        struggles_html += f'<span class="selected-item-tag">{html.escape(struggle)}</span>'
    
    # Generate HTML for adventure map nodes
    adventure_map_nodes_html = ""
    map_nodes_for_js = []
    
    # Create nodes for each LO in the pathway
    for i, lo in enumerate(combined_pathway):
        # Calculate position (simplified for demonstration)
        pos_x = 5 + (90 * i / len(combined_pathway))  # Spread across 5% to 95% of width
        pos_y = 50 + (random.randint(-15, 15))  # Center line with some variation
        
        # Determine node status
        status = "normal"
        if learner_profile.has_completed_lo(lo['id']):
            status = "completed"
        elif learner_profile.current_learning_objective_id == lo['id']:
            status = "current"
        
        # Create node HTML
        node_html = f"""
        <div class="map-node {status}" style="left: {pos_x}%; top: {pos_y}%;">
            {i+1}
            <div class="map-node-tooltip">{html.escape(lo.get('description', 'Learning Objective'))}</div>
        </div>
        """
        adventure_map_nodes_html += node_html
        
        # Add to JS data
        map_nodes_for_js.append({
            "id": lo['id'],
            "position": {"x": pos_x, "y": pos_y},
            "number": i+1,
            "status": status,
            "description": lo.get('description', 'Learning Objective')
        })
    
    # Generate HTML for badges
    badges_html = ""
    for badge_id, badge_info in BADGE_DEFINITIONS.items():
        badge_name = badge_info.get('name', 'Unknown Badge')
        badge_description = badge_info.get('description', 'No description available')
        badge_image = badge_info.get('image', 'default_badge.png')
        
        # Check if the badge is earned
        is_earned = badge_id in learner_profile.earned_badges_data
        badge_class = "earned" if is_earned else "locked"
        
        # Get earned date if available
        earned_date_html = ""
        if is_earned:
            earned_date = learner_profile.earned_badges_data[badge_id].get('earned_date', 'Unknown date')
            earned_date_html = f'<div class="badge-earned-date">Earned: {earned_date}</div>'
        
        # Create badge HTML
        badge_html = f"""
        <div class="badge-item {badge_class}">
            <img src="./assets/{badge_image}" alt="{badge_name}" class="badge-image">
            <div class="badge-name">{html.escape(badge_name)}</div>
            <div class="badge-description">{html.escape(badge_description)}</div>
            {earned_date_html}
            {'' if is_earned else '<div class="badge-locked-overlay"><span class="badge-locked-icon">🔒</span></div>'}
        </div>
        """
        badges_html += badge_html
    
    # Load the HTML template
    html_template = load_html_template(HTML_TEMPLATE_PATH)
    
    # Fill in the template with the generated content
    filled_template = html_template.format(
        student_id=html.escape(student_id),
        visual_preference_result=html.escape(learner_profile.learning_preferences.get('visual_task_1', 'Not assessed')),
        textual_preference_result=html.escape(learner_profile.learning_preferences.get('textual_task_1', 'Not assessed')),
        story_weaver_result=html.escape(learner_profile.learning_preferences.get('story_weaver', 'Not assessed')),
        mind_mapper_result=html.escape(learner_profile.learning_preferences.get('mind_mapper', 'Not assessed')),
        interests_html=interests_html,
        struggles_html=struggles_html,
        learning_objectives_html=learning_objectives_html,
        adventure_map_nodes_html=adventure_map_nodes_html,
        current_quest_name="Math and English Fundamentals",
        quest_progress=f"{len(learner_profile.completed_los)} / {len(combined_pathway)} objectives completed",
        badges_html=badges_html,
        learner_profile_json=json.dumps(learner_profile.to_dict()),
        all_badge_definitions_json=json.dumps(BADGE_DEFINITIONS),
        map_nodes_json_for_js=json.dumps(map_nodes_for_js)
    )
    
    # Write the filled template to the output file
    output_path = os.path.join(output_dir, output_filename)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(filled_template)
    
    logger.info(f"Generated interface saved to: {output_path}")
    return output_path

def generate_logged_interface() -> str:
    """
    Generates an interface with logging enabled and a modified filename.
    
    Returns:
        str: The path to the generated HTML file.
    """
    # Generate with default student ID but a modified filename to indicate logging
    return generate_html_interface(
        student_id=DEFAULT_STUDENT_ID,
        output_filename="dala_student_interface_v15_tts_logged.html"
    )

if __name__ == "__main__":
    # When run directly, generate the interface with logging
    output_path = generate_logged_interface()
    print(f"Interface generated at: {output_path}")
    
    # You could open the file in a browser automatically here if desired
    # import webbrowser
    # webbrowser.open('file://' + os.path.abspath(output_path))
