#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EdPsych Connect - Dynamic AI Learning Architect (DALA)
Holistic Learner Profiling (HLP) Module - Stage 2 Enhancements

This module contains the logic for:
1.  Interactive diagnostic mini-tasks for learning style/preference.
2.  Capturing student interests.
3.  Capturing student-reported struggle areas.
4.  Storing a basic learner profile.
5.  New sophisticated diagnostic mini-tasks (Stage 2).
6.  Tracking completed Learning Objectives (LOs) for prerequisite logic.
7.  Badge and achievement system (Stage 2).
"""

import random
import time
import sys
import inspect
import datetime # Added for timestamping earned badges
import logging # Added for structured logging
from typing import Optional, List, Set, Tuple, Dict, Any # Updated for Dict, Any

# Import and setup logging from config.py
from config import setup_logging
setup_logging() # Initialize logging configuration

# Get a logger for this module
logger = logging.getLogger(__name__)

# --- Badge Definitions ---
# Defines all available badges, their properties, and how to check their criteria.
BADGE_DEFINITIONS = {
    "trailblazer": {
        "id": "trailblazer",
        "name": "Trailblazer",
        "description": "You've taken the first step on your learning adventure! (Completed HLP Introduction)",
        "image_url": "assets/badges/trailblazer_badge.png",
        "criteria_check_function": "check_trailblazer_badge"
    },
    "topic_tackler_numeria_novice": {
        "id": "topic_tackler_numeria_novice",
        "name": "Numeria Novice Tackler",
        "description": "Well done! You've successfully navigated the initial challenges of Numeria!",
        "image_url": "assets/badges/topic_tackler_badge.png", # Using generic Topic Tackler image
        "criteria_check_function": "check_topic_tackler_numeria_novice_badge"
    },
    "quest_completer_intro": {
        "id": "quest_completer_intro",
        "name": "Introductory Quest Completer",
        "description": "You've completed your first full quest! Adventure awaits!",
        "image_url": "assets/badges/quest_completer_badge.png",
        "criteria_check_function": "check_quest_completer_intro_badge"
    },
    "curiosity_spark": {
        "id": "curiosity_spark",
        "name": "Curiosity Spark",
        "description": "Your curiosity is shining bright! You've explored beyond the beaten path!",
        "image_url": "assets/badges/curiosity_spark_badge.png",
        "criteria_check_function": "check_curiosity_spark_badge"
    },
    "helping_hand": {
        "id": "helping_hand",
        "name": "Helping Hand",
        "description": "Well done for identifying areas to grow! Understanding your learning is a superpower!",
        "image_url": "assets/badges/helping_hand_badge.png",
        "criteria_check_function": "check_helping_hand_badge"
    }
}

class LearnerProfile:
    """Represents a learner's profile, storing their preferences, progress, and achievements.

    Attributes:
        student_id (str): The unique identifier for the student.
        learning_preferences (dict): Stores preferences like {"visual_task_1": "visual"}.
        interests (list): A list of the learner's interests.
        struggle_areas (list): A list of areas where the learner struggles.
        cognitive_metrics (dict): Stores metrics from diagnostic tasks, e.g., {"story_weaver": {"accuracy": 0.8}}.
        completed_los (set): A set of completed Learning Objective IDs.
        current_learning_objective_id (str | None): The ID of the current LO the learner is working on.
        earned_badges_data (dict): Stores detailed data for earned badges, keyed by badge_id.
    """
    def __init__(self, student_id: str):
        """Initializes the LearnerProfile with a student ID.

        Args:
            student_id (str): The unique identifier for the student.
        """
        self.student_id = student_id
        self.learning_preferences = {} # Stores preferences like {"visual_task_1": "visual"}
        self.interests = []
        self.struggle_areas = []
        self.cognitive_metrics = {} # For new diagnostic tasks e.g. {"story_weaver": {"accuracy": 0.8}}
        self.completed_los = set()  # For tracking completed Learning Objectives
        self.current_learning_objective_id = None # Added for pathway tracking
        self.game_scores = {} # Added to resolve AttributeError
        # Stores detailed data for earned badges, keyed by badge_id
        # Example: {"trailblazer": {"id": "trailblazer", "name": "Trailblazer", ..., "date_earned": "..."}}
        self.earned_badges_data = {} 
        logger.info(f"LearnerProfile initialized for student_id: {student_id}")
        
    @property
    def learner_id(self) -> str:
        """Returns the student_id as learner_id for compatibility with other modules.
        
        Returns:
            str: The student's unique identifier.
        """
        return self.student_id

    @property
    def badges_earned(self) -> Dict[str, Any]:
        """Returns earned_badges_data for backward compatibility.
        
        Returns:
            Dict[str, Any]: A dictionary containing the earned badges data.
        """
        return self.earned_badges_data

    def to_dict(self) -> Dict[str, Any]:
        """Returns a dictionary representation of the learner profile for serialization.

        This is useful for saving the profile to JSON or other formats.

        Returns:
            Dict[str, Any]: A dictionary containing the learner profile data.
        """
        return {
            "student_id": self.student_id,
            "learning_preferences": self.learning_preferences,
            "interests": self.interests,
            "struggle_areas": self.struggle_areas,
            "cognitive_metrics": self.cognitive_metrics,
            "completed_los": list(self.completed_los),  # Convert set to list for JSON
            "current_learning_objective_id": self.current_learning_objective_id,
            "earned_badges_data": self.earned_badges_data
        }

    def update_preference(self, task_name: str, preference: str) -> None:
        """Updates a learning preference based on a diagnostic task.

        Args:
            task_name (str): The name of the diagnostic task (e.g., "visual_preference_task_1").
            preference (str): The preference identified (e.g., "visual", "non-visual").
        """
        self.learning_preferences[task_name] = preference
        logger.info(f"Profile for {self.student_id}: Preference for {task_name} updated to {preference}")

    def add_interest(self, interest: str) -> None:
        """Adds an interest to the profile if it's not already present.

        Args:
            interest (str): The interest to add (e.g., "Space Exploration").
        """
        if interest not in self.interests:
            self.interests.append(interest)
            logger.info(f"Profile for {self.student_id}: Interest '{interest}' added.")

    def add_struggle_area(self, area: str) -> None:
        """Adds a struggle area to the profile if it's not already present.

        Args:
            area (str): The struggle area to add (e.g., "Understanding fractions").
        """
        if area not in self.struggle_areas:
            self.struggle_areas.append(area)
            logger.info(f"Profile for {self.student_id}: Struggle area '{area}' added.")

    def add_cognitive_metric(self, task_name: str, metric_name: str, value: Any) -> None:
        """Adds a metric from a sophisticated diagnostic task or simple preference tasks.

        Args:
            task_name (str): The name of the task (e.g., "story_weaver").
            metric_name (str): The name of the metric (e.g., "accuracy", "attempts").
            value (Any): The value of the metric.
        """
        if task_name not in self.cognitive_metrics:
            self.cognitive_metrics[task_name] = {}
        self.cognitive_metrics[task_name][metric_name] = value
        logger.info(f"Profile for {self.student_id}: Cognitive metric for {task_name} - {metric_name} updated to {value}")

    def mark_lo_completed(self, lo_id: str) -> None:
        """Marks a Learning Objective (LO) as completed for the learner.

        If the LO is successfully marked as completed, it also triggers a check
        for any relevant badges that might be awarded due to this completion.

        Args:
            lo_id (str): The unique identifier of the Learning Objective to mark as completed.
        """
        if lo_id not in self.completed_los:
            self.completed_los.add(lo_id)
            logger.info(f"Profile for {self.student_id}: Learning Objective \'{lo_id}\' marked as completed.")
            # Potentially trigger badge check here
            check_and_award_all_relevant_badges(self) # Assuming curriculum_store might be needed later

    def has_completed_lo(self, lo_id: str) -> bool:
        """Checks if a specific Learning Objective (LO) has been completed by the learner.

        Args:
            lo_id (str): The unique identifier of the Learning Objective to check.

        Returns:
            bool: True if the LO has been completed, False otherwise.
        """
        return lo_id in self.completed_los

    def add_badge(self, badge_id: str) -> bool:
        """Adds a badge to the profile if not already earned, storing its details.

        If the badge is successfully added (i.e., it was not already earned and the
        badge definition exists), its details (including name, description, image URL,
        and earned date) are stored in `self.earned_badges_data`.

        Args:
            badge_id (str): The unique identifier of the badge to add (e.g., "trailblazer").

        Returns:
            bool: True if the badge was successfully added, False otherwise (e.g., if already
                  earned or badge definition not found).
        """
        if badge_id not in self.earned_badges_data:
            badge_definition = BADGE_DEFINITIONS.get(badge_id)
            if not badge_definition:
                logger.error(f"Badge definition for {badge_id} not found.")
                return False
            
            earned_badge_info = badge_definition.copy() # Start with all definition info
            earned_badge_info["date_earned"] = datetime.datetime.utcnow().isoformat() + "Z"
            
            self.earned_badges_data[badge_id] = earned_badge_info
            logger.info(f"Profile for {self.student_id}: Badge '{earned_badge_info['name']}' earned!")
            return True
        return False

    def has_badge(self, badge_id: str) -> bool:
        """Checks if a specific badge has been earned by the learner.

        Args:
            badge_id (str): The unique identifier of the badge to check.

        Returns:
            bool: True if the badge has been earned, False otherwise.
        """
        return badge_id in self.earned_badges_data

    def __str__(self) -> str:
        """Returns a string representation of the LearnerProfile object.

        This is primarily for debugging and logging purposes.

        Returns:
            str: A string summarizing the learner profile's attributes.
        """
        earned_badges_summary = {bid: data.get('name', bid) for bid, data in self.earned_badges_data.items()}
        return (
            f"LearnerProfile(student_id='{self.student_id}', "
            f"preferences={self.learning_preferences}, "
            f"interests={self.interests}, "
            f"struggle_areas={self.struggle_areas}, "
            f"cognitive_metrics={self.cognitive_metrics}, "
            f"completed_los={self.completed_los}, "
            f"earned_badges_data={earned_badges_summary})"
        )

# --- Badge Criteria Checking Functions ---

def check_trailblazer_badge(learner_profile: LearnerProfile, curriculum_store: Optional[Any] = None) -> bool:
    """Checks if the learner has met the criteria for the 'Trailblazer' badge.

    Criteria: Completed initial HLP tasks (simulated by having preferences for both
              visual and textual tasks, and having at least one interest defined).

    Args:
        learner_profile (LearnerProfile): The profile of the learner.
        curriculum_store (Optional[Any], optional): The curriculum store, not used by this specific
                                                  badge but included for consistency with other
                                                  badge checking functions. Defaults to None.

    Returns:
        bool: True if criteria are met, False otherwise.
    """
    return bool(learner_profile.learning_preferences.get("visual_preference_task_1") and 
                learner_profile.learning_preferences.get("textual_preference_task_1") and 
                learner_profile.interests)

def check_topic_tackler_numeria_novice_badge(learner_profile: LearnerProfile, curriculum_store: Optional[Any] = None) -> bool:
    """Checks if the learner has met the criteria for the 'Numeria Novice Tackler' badge.

    Criteria: Completed the first two math Learning Objectives (LOs) as defined by
              `numeria_novice_los` (simulated).

    Args:
        learner_profile (LearnerProfile): The profile of the learner.
        curriculum_store (Optional[Any], optional): The curriculum store, not used by this specific
                                                  badge but included for consistency. Defaults to None.

    Returns:
        bool: True if criteria are met, False otherwise.
    """
    numeria_novice_los = ["MA4_N1a", "MA4_N1b"] # Example LO IDs
    return all(learner_profile.has_completed_lo(lo_id) for lo_id in numeria_novice_los)

def check_quest_completer_intro_badge(learner_profile: LearnerProfile, curriculum_store: Optional[Any] = None) -> bool:
    """Checks if the learner has met the criteria for the 'Introductory Quest Completer' badge.

    Criteria: Completed a certain number of Learning Objectives (LOs) (e.g., 3 LOs for an intro quest).

    Args:
        learner_profile (LearnerProfile): The profile of the learner.
        curriculum_store (Optional[Any], optional): The curriculum store, not used by this specific
                                                  badge but included for consistency. Defaults to None.

    Returns:
        bool: True if criteria are met, False otherwise.
    """
    return len(learner_profile.completed_los) >= 3

def check_curiosity_spark_badge(learner_profile: LearnerProfile, curriculum_store: Optional[Any] = None) -> bool:
    """Checks if the learner has met the criteria for the 'Curiosity Spark' badge.

    Criteria: Student explored optional content, indicated by having more than one attempt
              on a task like 'story_weaver'.

    Args:
        learner_profile (LearnerProfile): The profile of the learner.
        curriculum_store (Optional[Any], optional): The curriculum store, not used by this specific
                                                  badge but included for consistency. Defaults to None.

    Returns:
        bool: True if criteria are met, False otherwise.
    """
    return learner_profile.cognitive_metrics.get("story_weaver", {}).get("attempts", 0) > 1

def check_helping_hand_badge(learner_profile: LearnerProfile, curriculum_store: Optional[Any] = None) -> bool:
    """Checks if the learner has met the criteria for the 'Helping Hand' badge.

    Criteria: Student has identified at least one struggle area.

    Args:
        learner_profile (LearnerProfile): The profile of the learner.
        curriculum_store (Optional[Any], optional): The curriculum store, not used by this specific
                                                  badge but included for consistency. Defaults to None.

    Returns:
        bool: True if criteria are met, False otherwise.
    """
    return bool(learner_profile.struggle_areas)

# --- Badge Awarding Logic ---

def _execute_badge_criteria_check(check_function_name: str, learner_profile: LearnerProfile, curriculum_store: Optional[Any] = None) -> bool:
    """Dynamically executes a badge criteria checking function.

    Args:
        check_function_name (str): The name of the criteria checking function.
        learner_profile (LearnerProfile): The learner's profile.
        curriculum_store (Optional[Any]): The curriculum store, passed if needed by the check function.

    Returns:
        bool: True if criteria are met, False otherwise or if the function is not found.
    """
    if not hasattr(sys.modules[__name__], check_function_name):
        logger.warning(f"Criteria check function '{check_function_name}' not found in module.")
        return False

    check_function = getattr(sys.modules[__name__], check_function_name)
    sig = inspect.signature(check_function)

    try:
        # Check if 'curriculum_store' is an expected parameter by the specific check_function
        if "curriculum_store" in sig.parameters:
            return check_function(learner_profile, curriculum_store=curriculum_store)
        else:
            # If 'curriculum_store' is not a parameter, call without it
            return check_function(learner_profile)
    except Exception as e:
        logger.error(f"Error executing badge criteria function {check_function_name}: {e}")
        return False

def award_badge_if_criteria_met(learner_profile: LearnerProfile, badge_id: str, curriculum_store: Optional[Any] = None) -> Optional[Dict[str, Any]]:
    """Awards a specific badge if criteria are met and it hasn't been earned yet.

    This function checks if the learner has already earned the badge. If not, it retrieves
    the badge definition and calls the associated criteria checking function using a helper.
    If the criteria are met, the badge is added to the learner's profile.

    Args:
        learner_profile (LearnerProfile): The profile of the learner.
        badge_id (str): The unique identifier of the badge to check and potentially award.
        curriculum_store (Optional[Any], optional): The curriculum store, which might be needed by
                                                  some badge criteria checking functions.
                                                  Defaults to None.

    Returns:
        Optional[Dict[str, Any]]: The badge definition dictionary if the badge was newly awarded,
                                  None otherwise (if already earned, criteria not met, or badge
                                  definition/criteria function not found).
    """
    if learner_profile.has_badge(badge_id):
        return None # Already earned

    badge_info = BADGE_DEFINITIONS.get(badge_id)
    if not badge_info:
        logger.warning(f"Badge ID '{badge_id}' not found in BADGE_DEFINITIONS.")
        return None

    check_function_name = badge_info.get("criteria_check_function")
    if not check_function_name:
        logger.warning(f"No criteria_check_function defined for badge '{badge_id}'.")
        return None

    criteria_met = _execute_badge_criteria_check(check_function_name, learner_profile, curriculum_store)
            
    if criteria_met:
        if learner_profile.add_badge(badge_id):
            return badge_info # Return definition of newly awarded badge
    return None

def check_and_award_all_relevant_badges(learner_profile: LearnerProfile, curriculum_store: Optional[Any] = None) -> List[str]:
    """Checks all defined badges and awards them if criteria are met.

    Iterates through all badges defined in `BADGE_DEFINITIONS`. For each badge,
    it calls `award_badge_if_criteria_met` to determine if the learner qualifies.
    Logs newly awarded badges.

    Args:
        learner_profile (LearnerProfile): The profile of the learner.
        curriculum_store (Optional[Any], optional): The curriculum store, passed to
                                                  `award_badge_if_criteria_met`.
                                                  Defaults to None.

    Returns:
        List[str]: A list of names of badges that were newly awarded in this check.
    """
    logger.info(f"Checking all relevant badges for {learner_profile.student_id}...")
    awarded_badges_in_this_check = []
    for badge_id in BADGE_DEFINITIONS.keys():
        awarded_badge_info = award_badge_if_criteria_met(learner_profile, badge_id, curriculum_store)
        if awarded_badge_info:
            awarded_badges_in_this_check.append(awarded_badge_info['name'])
    if awarded_badges_in_this_check:
        logger.info(f"Newly awarded badges in this check: {', '.join(awarded_badges_in_this_check)}")
    else:
        logger.info("No new badges awarded in this check.")
    return awarded_badges_in_this_check

# --- Diagnostic Mini-Tasks (Simplified Simulations) ---

def run_visual_preference_task(profile: LearnerProfile) -> Dict[str, Any]:
    """Simulates a visual preference diagnostic task for the learner.

    A random choice is made between "visual" and "textual/auditory".
    The learner's profile is updated with this preference, and badge checks are triggered.

    Args:
        profile (LearnerProfile): The profile of the learner to update.

    Returns:
        Dict[str, Any]: A dictionary containing a simulated score and the preference value.
                        Example: {"score": 10, "preference": "visual"}
    """
    task_id = "visual_preference_task_1"
    logger.info(f"Running Visual Preference Task for {profile.student_id}...")
    simulated_choice = random.choice(["visual", "textual/auditory"])
    preference_value = "visual" if simulated_choice == "visual" else "non-visual"
    profile.update_preference(task_id, preference_value)
    # Trigger badge check after HLP tasks
    check_and_award_all_relevant_badges(profile)
    return {"score": 10 if preference_value == "visual" else 5, "preference": preference_value}

def run_textual_preference_task(profile: LearnerProfile) -> Dict[str, Any]:
    """Simulates a textual preference diagnostic task for the learner.

    A random choice is made between "detailed_text" and "summary_bullets".
    The learner's profile is updated with this preference, and badge checks are triggered.

    Args:
        profile (LearnerProfile): The profile of the learner to update.

    Returns:
        Dict[str, Any]: A dictionary containing a simulated score and the preference value.
                        Example: {"score": 10, "preference": "detailed_text"}
    """
    task_id = "textual_preference_task_1"
    logger.info(f"Running Textual Preference Task for {profile.student_id}...")
    simulated_choice = random.choice(["detailed_text", "summary_bullets"])
    preference_value = "detailed_text" if simulated_choice == "detailed_text" else "concise_text"
    profile.update_preference(task_id, preference_value)
    # Trigger badge check after HLP tasks
    check_and_award_all_relevant_badges(profile)
    return {"score": 10 if preference_value == "detailed_text" else 5, "preference": preference_value}

def capture_student_interests(profile: LearnerProfile, num_interests_to_select: int = 3) -> List[str]:
    """Simulates capturing student interests from a predefined list.

    Randomly selects a specified number of interests from `PREDEFINED_INTERESTS`
    and adds them to the learner's profile. Triggers badge checks afterwards.

    Args:
        profile (LearnerProfile): The profile of the learner to update.
        num_interests_to_select (int, optional): The number of interests to randomly select.
                                                 Defaults to 3.

    Returns:
        List[str]: A list of the selected interests that were added to the profile.
    """
    logger.info(f"Capturing Interests for {profile.student_id}...")
    selected_interests = random.sample(PREDEFINED_INTERESTS, k=min(num_interests_to_select, len(PREDEFINED_INTERESTS)))
    for interest in selected_interests:
        profile.add_interest(interest)
    # Trigger badge check after HLP tasks
    check_and_award_all_relevant_badges(profile)
    return selected_interests

def capture_student_struggles(profile: LearnerProfile, num_struggles_to_select: int = 2) -> List[str]:
    """Simulates capturing student-reported struggle areas from a predefined list.

    Randomly selects a specified number of struggle areas from `PREDEFINED_STRUGGLE_AREAS`
    and adds them to the learner's profile. Triggers badge checks afterwards, which might
    award the 'Helping Hand' badge.

    Args:
        profile (LearnerProfile): The profile of the learner to update.
        num_struggles_to_select (int, optional): The number of struggle areas to randomly select.
                                                 Defaults to 2.

    Returns:
        List[str]: A list of the selected struggle areas that were added to the profile.
    """
    logger.info(f"Capturing Struggle Areas for {profile.student_id}...")
    selected_struggles = random.sample(PREDEFINED_STRUGGLE_AREAS, k=min(num_struggles_to_select, len(PREDEFINED_STRUGGLE_AREAS)))
    for area in selected_struggles:
        profile.add_struggle_area(area)
    # Trigger badge check for 'Helping Hand'
    check_and_award_all_relevant_badges(profile)
    return selected_struggles

PREDEFINED_INTERESTS = [
    "Space Exploration", "Dinosaurs", "Ancient Civilizations", 
    "Robotics", "Marine Biology", "Creative Writing", 
    "Music Composition", "Environmental Science", "Mythology"
]
PREDEFINED_STRUGGLE_AREAS = [
    "Understanding fractions", "Writing long essays", "Remembering historical dates",
    "Solving word problems in math", "Staying focused during lectures", "Public speaking",
    "Learning new vocabulary", "Organizing my study time"
]

def run_story_weaver_task(profile: LearnerProfile) -> Dict[str, Any]:
    """Simulates the 'Story Weaver' sophisticated diagnostic task for the learner.

    This task might involve sequencing story panels. This simulation randomly determines
    the number of panels, accuracy, and attempts. The learner's profile is updated
    with these cognitive metrics, and badge checks are triggered (e.g., for 'Curiosity Spark').

    Args:
        profile (LearnerProfile): The profile of the learner to update.

    Returns:
        Dict[str, Any]: A dictionary containing the task name, simulated accuracy, and attempts.
                        Example: {"task_name": "story_weaver", "accuracy": 0.8, "attempts": 1}
    """
    task_name = "story_weaver"
    logger.info(f"Running '{task_name}' Task for {profile.student_id}...")
    num_panels = random.choice([3, 4, 5])
    simulated_accuracy = random.choice([0.6, 0.8, 1.0])
    simulated_attempts = random.randint(1, 3) if simulated_accuracy < 1.0 else 1
    profile.add_cognitive_metric(task_name, "num_panels", num_panels)
    profile.add_cognitive_metric(task_name, "accuracy", simulated_accuracy)
    profile.add_cognitive_metric(task_name, "attempts", simulated_attempts)
    # Trigger badge check, e.g., for 'Curiosity Spark'
    check_and_award_all_relevant_badges(profile)
    return {"task_name": task_name, "accuracy": simulated_accuracy, "attempts": simulated_attempts}

def run_mind_mapper_task(profile: LearnerProfile) -> Dict[str, Any]:
    """Simulates the 'Mind Mapper' sophisticated diagnostic task for the learner.

    This task might involve generating ideas related to a central concept. This simulation
    randomly determines the number of ideas generated. The learner's profile is updated
    with this cognitive metric, and badge checks are triggered.

    Args:
        profile (LearnerProfile): The profile of the learner to update.

    Returns:
        Dict[str, Any]: A dictionary containing the task name and other simulated metrics (if any).
                        Example: {"task_name": "mind_mapper", "ideas_generated": 5}
    """
    task_name = "mind_mapper"
    logger.info(f"Running '{task_name}' Task for {profile.student_id}...")
    # ... (rest of the function as before, simplified for brevity) ...
    profile.add_cognitive_metric(task_name, "ideas_generated", random.randint(3,8))
    # Trigger badge check
    check_and_award_all_relevant_badges(profile)
    return {"task_name": task_name}

# --- Main HLP Process Simulation (Example Usage) ---

def run_full_hlp_assessment(student_id: str) -> LearnerProfile:
    """Simulates a full Holistic Learner Profiling (HLP) assessment process for a student.

    This function orchestrates the execution of various diagnostic tasks (both simple
    preference tasks and more sophisticated ones like Story Weaver and Mind Mapper),
    captures student interests and struggle areas, and simulates the completion of
    some Learning Objectives (LOs). A LearnerProfile object is created and populated
    throughout this process. Badge checks are triggered at various points.

    Args:
        student_id (str): The unique identifier for the student undergoing the assessment.

    Returns:
        LearnerProfile: The populated LearnerProfile object containing all gathered data
                        and earned badges from the simulated assessment.
    """
    logger.info(f"--- Starting Full HLP Assessment for Student: {student_id} ---")
    profile = LearnerProfile(student_id)

    # Initial HLP tasks (can trigger Trailblazer)
    run_visual_preference_task(profile)
    run_textual_preference_task(profile)
    capture_student_interests(profile)
    capture_student_struggles(profile) # Can trigger Helping Hand

    # Sophisticated diagnostic tasks (can trigger Curiosity Spark)
    run_story_weaver_task(profile)
    run_mind_mapper_task(profile)

    # Simulate completing some Learning Objectives (can trigger Topic Tackler, Quest Completer)
    # These LO IDs should align with curriculum_content_module.py if using real curriculum data
    profile.mark_lo_completed("MA4_N1a")
    profile.mark_lo_completed("MA4_N1b") # Trigger Topic Tackler Numeria Novice
    profile.mark_lo_completed("EN4_R1a") # To help trigger Quest Completer Intro (needs 3)
    
    # Final check for any badges that might now be awardable
    # curriculum_store could be passed if needed by any badge criteria
    check_and_award_all_relevant_badges(profile, curriculum_store=None) 

    logger.info(f"--- Completed Full HLP Assessment for Student: {student_id} ---")
    logger.info(f"Final Profile: {profile}")
    return profile

if __name__ == '__main__':
    # Example of how to run the HLP assessment and see the profile
    test_student_id = "test_student_007"
    final_profile = run_full_hlp_assessment(test_student_id)
    # The final_profile object now contains all the simulated data and badges.
    # You can inspect it, for example:
    # logger.info(f"Earned Badges for {test_student_id}: {final_profile.earned_badges_data}")
    # logger.info(f"Cognitive Metrics for {test_student_id}: {final_profile.cognitive_metrics}")

