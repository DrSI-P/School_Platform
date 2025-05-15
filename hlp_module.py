#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EdPsych Connect - Dynamic AI Learning Architect (DALA)
Holistic Learner Profiling (HLP) Module - Stage 3 Enhancements

This module contains the logic for:
1.  Interactive diagnostic mini-tasks for learning style/preference.
2.  Capturing student interests.
3.  Capturing student-reported struggle areas.
4.  Storing a basic learner profile.
5.  New sophisticated diagnostic mini-tasks (Stage 2).
6.  Tracking completed Learning Objectives (LOs) for prerequisite logic.
7.  Badge and achievement system (Stage 2).
8.  Persistence of learner data to SQLite database (Stage 3).
"""

import random
import time
import sys
import inspect
import datetime
import logging
import json
from typing import Optional, List, Set, Tuple, Dict, Any, Union

# Import and setup logging from config.py
from config import setup_logging
setup_logging()

# Get a logger for this module
logger = logging.getLogger(__name__)

# Import persistence manager for database operations
from persistence_manager import (
    create_learner_profile as db_create_learner_profile,
    get_learner_profile as db_get_learner_profile,
    get_full_learner_profile_data as db_get_full_learner_profile_data,
    update_learner_profile_timestamp as db_update_learner_profile_timestamp,
    add_or_update_preference as db_add_or_update_preference,
    add_interest as db_add_interest,
    add_struggle as db_add_struggle,
    add_or_update_cognitive_metric as db_add_or_update_cognitive_metric,
    add_or_update_lo_progress as db_add_or_update_lo_progress,
    add_badge_record as db_add_badge_record,
    add_activity_attempt as db_add_activity_attempt,
    get_preferences_for_learner,
    get_interests_for_learner,
    get_struggles_for_learner,
    get_cognitive_metrics_for_learner,
    get_lo_progress_for_learner,
    get_badges_for_learner,
    get_activity_attempts_for_learner,
    PreferenceData,
    InterestData,
    StruggleData,
    CognitiveMetricData,
    LearningObjectiveProgress,
    BadgeRecord,
    ActivityAttempt
)

# --- Predefined lists for HLP simulation (Restored for generate_interface.py compatibility) ---
PREDEFINED_INTERESTS: List[str] = [
    "Space Exploration", "Dinosaurs", "Ancient Civilizations", "Robotics",
    "Marine Biology", "Creative Writing", "Mythology", "Coding & Game Development",
    "Music & Instruments", "Visual Arts & Drawing", "Sports & Athletics", "Environmental Science"
]
"""A list of predefined interests for learners to choose from during HLP assessment simulation."""

PREDEFINED_STRUGGLE_AREAS: List[str] = [
    "Reading Comprehension", "Mathematical Problem Solving", "Writing Essays", "Staying Focused",
    "Understanding Fractions", "Learning New Vocabulary", "Public Speaking", "Time Management",
    "Memorizing Facts", "Scientific Concepts", "Foreign Languages", "Note Taking"
]
"""A list of predefined struggle areas for learners to identify during HLP assessment simulation."""


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
    
    In Stage 3, this class has been enhanced to persist data to a SQLite database.
    It maintains in-memory state for performance but syncs with the database for persistence.

    Attributes:
        student_id (str): The unique identifier for the student.
        learning_preferences (dict): Stores preferences like {"visual_task_1": "visual"}.
        interests (list): A list of the learner's interests.
        struggle_areas (list): A list of areas where the learner struggles.
        cognitive_metrics (dict): Stores metrics from diagnostic tasks, e.g., {"story_weaver": {"accuracy": 0.8}}.
        completed_los (set): A set of completed Learning Objective IDs.
        current_learning_objective_id (str | None): The ID of the current LO the learner is working on.
        earned_badges_data (dict): Stores detailed data for earned badges, keyed by badge_id.
        game_scores (dict): Stores game scores for various activities.
        _persistence_enabled (bool): Whether to persist changes to the database.
    """
    def __init__(self, student_id: str, load_from_db: bool = True, persistence_enabled: bool = True):
        """Initializes the LearnerProfile with a student ID.

        Args:
            student_id (str): The unique identifier for the student.
            load_from_db (bool, optional): Whether to load existing data from the database. Defaults to True.
            persistence_enabled (bool, optional): Whether to persist changes to the database. Defaults to True.
        """
        self.student_id = student_id
        self._persistence_enabled = persistence_enabled
        
        # Initialize with empty data structures
        self.learning_preferences = {}
        self.interests = []
        self.struggle_areas = []
        self.cognitive_metrics = {}
        self.completed_los = set()
        self.current_learning_objective_id = None
        self.earned_badges_data = {}
        self.game_scores = {}
        
        # If persistence is enabled and we should load from DB, try to load existing profile
        if persistence_enabled and load_from_db:
            self._load_from_database()
        else:
            # If not loading from DB, ensure the profile exists in the DB if persistence is enabled
            if persistence_enabled:
                db_create_learner_profile(student_id)
                
        logger.info(f"LearnerProfile initialized for student_id: {student_id} (persistence: {persistence_enabled})")
    
    def _load_from_database(self) -> None:
        """Loads the learner profile data from the database.
        
        This method populates the in-memory attributes with data from the database.
        If no profile exists in the database, it creates a new one.
        """
        # Try to get full profile data from database
        full_profile_data = db_get_full_learner_profile_data(self.student_id)
        
        if not full_profile_data:
            # If no profile exists, create one
            db_create_learner_profile(self.student_id)
            logger.info(f"Created new profile in database for student_id: {self.student_id}")
            return
            
        # Load preferences
        for pref_data in full_profile_data.get("preferences", []):
            self.learning_preferences[pref_data["category"]] = pref_data["value"]
            
        # Load interests
        self.interests = [interest_data["interest_name"] for interest_data in full_profile_data.get("interests", [])]
        
        # Load struggles
        self.struggle_areas = [struggle_data["struggle_description"] for struggle_data in full_profile_data.get("struggles", [])]
        
        # Load cognitive metrics
        for metric_data in full_profile_data.get("cognitive_metrics", []):
            task_name = metric_data["task_name"]
            if task_name not in self.cognitive_metrics:
                self.cognitive_metrics[task_name] = {}
            self.cognitive_metrics[task_name].update(metric_data["metric_details"])
        
        # Load completed LOs
        lo_progress_list = full_profile_data.get("learning_objective_progress", [])
        self.completed_los = {lo_prog["lo_id"] for lo_prog in lo_progress_list 
                             if lo_prog["status"] == "completed"}
        
        # Find current LO (most recent in_progress one, if any)
        in_progress_los = [lo_prog for lo_prog in lo_progress_list 
                          if lo_prog["status"] == "in_progress"]
        if in_progress_los:
            # Sort by started_at in descending order and take the first one
            in_progress_los.sort(key=lambda x: x.get("started_at", ""), reverse=True)
            self.current_learning_objective_id = in_progress_los[0]["lo_id"]
        
        # Load badges
        for badge_data in full_profile_data.get("badges", []):
            badge_id = badge_data["badge_id"]
            # Get badge definition
            badge_def = BADGE_DEFINITIONS.get(badge_id)
            if badge_def:
                # Create badge info with definition and earned date
                badge_info = badge_def.copy()
                badge_info["date_earned"] = badge_data["earned_date"].isoformat() + "Z"
                self.earned_badges_data[badge_id] = badge_info
        
        # TODO: Load game scores if we start tracking them in the database
        
        logger.info(f"Loaded profile from database for student_id: {self.student_id}")
        
    def _sync_to_database(self) -> None:
        """Syncs the current in-memory state to the database.
        
        This is a comprehensive sync that ensures all in-memory data is persisted.
        It's more expensive than individual updates, so it's used selectively.
        """
        if not self._persistence_enabled:
            return
            
        # Update timestamp
        db_update_learner_profile_timestamp(self.student_id)
        
        # Sync preferences
        for category, value in self.learning_preferences.items():
            pref = PreferenceData(learner_id=self.student_id, category=category, value=value)
            db_add_or_update_preference(pref)
        
        # Sync interests
        for interest_name in self.interests:
            interest = InterestData(learner_id=self.student_id, interest_name=interest_name)
            db_add_interest(interest)
        
        # Sync struggles
        for struggle_description in self.struggle_areas:
            struggle = StruggleData(learner_id=self.student_id, struggle_description=struggle_description)
            db_add_struggle(struggle)
        
        # Sync cognitive metrics
        for task_name, metrics in self.cognitive_metrics.items():
            metric = CognitiveMetricData(
                learner_id=self.student_id,
                task_name=task_name,
                metric_details=metrics
            )
            db_add_or_update_cognitive_metric(metric)
        
        # Sync completed LOs
        for lo_id in self.completed_los:
            progress = LearningObjectiveProgress(
                learner_id=self.student_id,
                lo_id=lo_id,
                status="completed",
                started_at=datetime.datetime.utcnow() - datetime.timedelta(days=1),  # Approximate
                completed_at=datetime.datetime.utcnow()
            )
            db_add_or_update_lo_progress(progress)
        
        # Sync current LO if set
        if self.current_learning_objective_id:
            progress = LearningObjectiveProgress(
                learner_id=self.student_id,
                lo_id=self.current_learning_objective_id,
                status="in_progress",
                started_at=datetime.datetime.utcnow()
            )
            db_add_or_update_lo_progress(progress)
        
        # Sync badges
        for badge_id, badge_info in self.earned_badges_data.items():
            # Parse the date_earned string to a datetime.date object
            date_earned_str = badge_info.get("date_earned", datetime.datetime.utcnow().isoformat() + "Z")
            try:
                # Try to parse ISO format with Z
                date_earned = datetime.datetime.fromisoformat(date_earned_str.replace("Z", "+00:00")).date()
            except ValueError:
                # Fallback to current date
                date_earned = datetime.date.today()
                
            badge = BadgeRecord(
                learner_id=self.student_id,
                badge_id=badge_id,
                badge_name=badge_info.get("name", badge_id),
                earned_date=date_earned,
                details=badge_info.get("description", "")
            )
            db_add_badge_record(badge)
        
        logger.info(f"Synced profile to database for student_id: {self.student_id}")
        
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
            "earned_badges_data": self.earned_badges_data,
            "game_scores": self.game_scores
        }

    def update_preference(self, task_name: str, preference: str) -> None:
        """Updates a learning preference based on a diagnostic task.

        Args:
            task_name (str): The name of the diagnostic task (e.g., "visual_preference_task_1").
            preference (str): The preference identified (e.g., "visual", "non-visual").
        """
        self.learning_preferences[task_name] = preference
        logger.info(f"Profile for {self.student_id}: Preference for {task_name} updated to {preference}")
        
        # Persist to database if enabled
        if self._persistence_enabled:
            pref = PreferenceData(learner_id=self.student_id, category=task_name, value=preference)
            db_add_or_update_preference(pref)

    def add_interest(self, interest: str) -> None:
        """Adds an interest to the profile if it's not already present.

        Args:
            interest (str): The interest to add (e.g., "Space Exploration").
        """
        if interest not in self.interests:
            self.interests.append(interest)
            logger.info(f"Profile for {self.student_id}: Interest '{interest}' added.")
            
            # Persist to database if enabled
            if self._persistence_enabled:
                interest_data = InterestData(learner_id=self.student_id, interest_name=interest)
                db_add_interest(interest_data)

    def add_struggle_area(self, area: str) -> None:
        """Adds a struggle area to the profile if it's not already present.

        Args:
            area (str): The struggle area to add (e.g., "Understanding fractions").
        """
        if area not in self.struggle_areas:
            self.struggle_areas.append(area)
            logger.info(f"Profile for {self.student_id}: Struggle area '{area}' added.")
            
            # Persist to database if enabled
            if self._persistence_enabled:
                struggle_data = StruggleData(learner_id=self.student_id, struggle_description=area)
                db_add_struggle(struggle_data)

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
        
        # Persist to database if enabled
        if self._persistence_enabled:
            # Get the full metrics for this task
            metric_data = CognitiveMetricData(
                learner_id=self.student_id,
                task_name=task_name,
                metric_details=self.cognitive_metrics[task_name]
            )
            db_add_or_update_cognitive_metric(metric_data)

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
            
            # Persist to database if enabled
            if self._persistence_enabled:
                progress = LearningObjectiveProgress(
                    learner_id=self.student_id,
                    lo_id=lo_id,
                    status="completed",
                    started_at=datetime.datetime.utcnow() - datetime.timedelta(hours=1),  # Approximate
                    completed_at=datetime.datetime.utcnow()
                )
                db_add_or_update_lo_progress(progress)
            
            # Potentially trigger badge check here
            check_and_award_all_relevant_badges(self)

    def has_completed_lo(self, lo_id: str) -> bool:
        """Checks if a specific Learning Objective (LO) has been completed by the learner.

        Args:
            lo_id (str): The unique identifier of the Learning Objective to check.

        Returns:
            bool: True if the LO has been completed, False otherwise.
        """
        return lo_id in self.completed_los

    def set_current_lo(self, lo_id: str) -> None:
        """Sets the current Learning Objective (LO) the learner is working on.

        Args:
            lo_id (str): The unique identifier of the Learning Objective.
        """
        self.current_learning_objective_id = lo_id
        logger.info(f"Profile for {self.student_id}: Current Learning Objective set to \'{lo_id}\'.")
        
        # Persist to database if enabled
        if self._persistence_enabled:
            progress = LearningObjectiveProgress(
                learner_id=self.student_id,
                lo_id=lo_id,
                status="in_progress",
                started_at=datetime.datetime.utcnow()
            )
            db_add_or_update_lo_progress(progress)

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
            
            # Persist to database if enabled
            if self._persistence_enabled:
                badge = BadgeRecord(
                    learner_id=self.student_id,
                    badge_id=badge_id,
                    badge_name=earned_badge_info["name"],
                    earned_date=datetime.date.today(),
                    details=earned_badge_info.get("description", "")
                )
                db_add_badge_record(badge)
            
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

    def record_activity_attempt(self, lo_id: str, activity_id: str, activity_type: str, 
                               score: Optional[float] = None, completed: bool = False, 
                               details: Optional[Dict[str, Any]] = None) -> None:
        """Records an attempt at an activity.

        Args:
            lo_id (str): The Learning Objective ID this activity belongs to.
            activity_id (str): The unique identifier for the activity.
            activity_type (str): The type of activity (e.g., "quiz", "game").
            score (Optional[float], optional): The score achieved. Defaults to None.
            completed (bool, optional): Whether the activity was completed. Defaults to False.
            details (Optional[Dict[str, Any]], optional): Additional details about the attempt. Defaults to None.
        """
        logger.info(f"Profile for {self.student_id}: Activity attempt recorded for LO {lo_id}, Activity {activity_id}")
        
        # Persist to database if enabled
        if self._persistence_enabled:
            attempt = ActivityAttempt(
                learner_id=self.student_id,
                lo_id=lo_id,
                activity_id=activity_id,
                activity_type=activity_type,
                score=score,
                completed=completed,
                attempt_details=details or {}
            )
            db_add_activity_attempt(attempt)

    def save(self) -> None:
        """Explicitly saves the current state of the profile to the database.
        
        This is useful when multiple changes have been made and you want to ensure
        they are all persisted at once, or when persistence was temporarily disabled.
        """
        if self._persistence_enabled:
            self._sync_to_database()
            logger.info(f"Profile for {self.student_id}: Explicitly saved to database.")

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
    """Executes a badge criteria check function by name.

    Args:
        check_function_name (str): The name of the function to execute.
        learner_profile (LearnerProfile): The profile of the learner.
        curriculum_store (Optional[Any], optional): The curriculum store, passed to the check function. Defaults to None.

    Returns:
        bool: The result of the check function, or False if the function doesn't exist.
    """
    # Get the function from the current module
    check_function = globals().get(check_function_name)
    if check_function and callable(check_function):
        try:
            return check_function(learner_profile, curriculum_store)
        except Exception as e:
            logger.error(f"Error executing badge criteria check function '{check_function_name}': {e}")
            return False
    else:
        logger.error(f"Badge criteria check function '{check_function_name}' not found.")
        return False

def check_and_award_badge(learner_profile: LearnerProfile, badge_id: str, curriculum_store: Optional[Any] = None) -> bool:
    """Checks if a learner meets the criteria for a badge and awards it if they do.

    Args:
        learner_profile (LearnerProfile): The profile of the learner.
        badge_id (str): The ID of the badge to check and potentially award.
        curriculum_store (Optional[Any], optional): The curriculum store, passed to the check function. Defaults to None.

    Returns:
        bool: True if the badge was awarded (either now or previously), False otherwise.
    """
    # If the learner already has the badge, no need to check criteria
    if learner_profile.has_badge(badge_id):
        return True
    
    # Get the badge definition
    badge_definition = BADGE_DEFINITIONS.get(badge_id)
    if not badge_definition:
        logger.error(f"Badge definition for {badge_id} not found.")
        return False
    
    # Get the criteria check function name
    check_function_name = badge_definition.get("criteria_check_function")
    if not check_function_name:
        logger.error(f"No criteria check function specified for badge {badge_id}.")
        return False
    
    # Execute the criteria check
    criteria_met = _execute_badge_criteria_check(check_function_name, learner_profile, curriculum_store)
    
    # If criteria are met, award the badge
    if criteria_met:
        return learner_profile.add_badge(badge_id)
    
    return False

def check_and_award_all_relevant_badges(learner_profile: LearnerProfile, curriculum_store: Optional[Any] = None) -> List[str]:
    """Checks all badge criteria and awards any badges the learner has earned but not yet received.

    Args:
        learner_profile (LearnerProfile): The profile of the learner.
        curriculum_store (Optional[Any], optional): The curriculum store, passed to the check functions. Defaults to None.

    Returns:
        List[str]: A list of badge IDs that were newly awarded.
    """
    newly_awarded_badges = []
    
    for badge_id in BADGE_DEFINITIONS:
        # Skip badges the learner already has
        if learner_profile.has_badge(badge_id):
            continue
        
        # Check and award the badge if criteria are met
        if check_and_award_badge(learner_profile, badge_id, curriculum_store):
            newly_awarded_badges.append(badge_id)
    
    return newly_awarded_badges

# --- Diagnostic Tasks ---

def run_visual_preference_task(learner_profile: LearnerProfile) -> None:
    """Simulates a diagnostic task to determine visual learning preference.

    This is a placeholder for a real interactive task that would assess
    whether the learner prefers visual learning materials.

    Args:
        learner_profile (LearnerProfile): The profile to update with the preference.
    """
    # Simulate task execution and preference determination
    logger.info(f"Running visual preference task for {learner_profile.student_id}...")
    time.sleep(0.5)  # Simulate task duration
    
    # Randomly determine preference for simulation purposes
    preference = random.choice(["visual", "non-visual"])
    
    # Update the learner profile
    learner_profile.update_preference("visual_preference_task_1", preference)
    logger.info(f"Visual preference task complete. Preference: {preference}")

def run_textual_preference_task(learner_profile: LearnerProfile) -> None:
    """Simulates a diagnostic task to determine textual learning preference.

    This is a placeholder for a real interactive task that would assess
    whether the learner prefers text-based learning materials.

    Args:
        learner_profile (LearnerProfile): The profile to update with the preference.
    """
    # Simulate task execution and preference determination
    logger.info(f"Running textual preference task for {learner_profile.student_id}...")
    time.sleep(0.5)  # Simulate task duration
    
    # Randomly determine preference for simulation purposes
    preference = random.choice(["textual", "non-textual"])
    
    # Update the learner profile
    learner_profile.update_preference("textual_preference_task_1", preference)
    logger.info(f"Textual preference task complete. Preference: {preference}")

def run_story_weaver_task(learner_profile: LearnerProfile) -> None:
    """Simulates a sophisticated diagnostic task for narrative comprehension.

    This is a placeholder for a real interactive task that would assess
    the learner's ability to understand and construct narratives.

    Args:
        learner_profile (LearnerProfile): The profile to update with the metrics.
    """
    # Simulate task execution and metric collection
    logger.info(f"Running Story Weaver task for {learner_profile.student_id}...")
    time.sleep(1)  # Simulate longer task duration
    
    # Get current attempts or default to 0
    current_attempts = learner_profile.cognitive_metrics.get("story_weaver", {}).get("attempts", 0)
    
    # Simulate metrics for the task
    metrics = {
        "accuracy": round(random.uniform(0.6, 1.0), 2),
        "completion_time": random.randint(60, 180),
        "panels_created": random.randint(3, 7),
        "attempts": current_attempts + 1
    }
    
    # Update the learner profile with each metric
    for metric_name, value in metrics.items():
        learner_profile.add_cognitive_metric("story_weaver", metric_name, value)
    
    logger.info(f"Story Weaver task complete. Metrics: {metrics}")

def run_mind_mapper_task(learner_profile: LearnerProfile) -> None:
    """Simulates a sophisticated diagnostic task for conceptual mapping.

    This is a placeholder for a real interactive task that would assess
    the learner's ability to connect and organize concepts.

    Args:
        learner_profile (LearnerProfile): The profile to update with the metrics.
    """
    # Simulate task execution and metric collection
    logger.info(f"Running Mind Mapper task for {learner_profile.student_id}...")
    time.sleep(1)  # Simulate longer task duration
    
    # Get current attempts or default to 0
    current_attempts = learner_profile.cognitive_metrics.get("mind_mapper", {}).get("attempts", 0)
    
    # Simulate metrics for the task
    metrics = {
        "nodes_created": random.randint(5, 12),
        "connections_made": random.randint(4, 10),
        "complexity_score": round(random.uniform(0.4, 0.9), 2),
        "attempts": current_attempts + 1
    }
    
    # Update the learner profile with each metric
    for metric_name, value in metrics.items():
        learner_profile.add_cognitive_metric("mind_mapper", metric_name, value)
    
    logger.info(f"Mind Mapper task complete. Metrics: {metrics}")

# --- Interest and Struggle Area Collection ---

def capture_student_interests(learner_profile: LearnerProfile, available_interests: List[str]) -> None:
    """Simulates capturing student interests from a predefined list.

    Args:
        learner_profile (LearnerProfile): The profile to update with interests.
        available_interests (List[str]): A list of interests for the student to choose from.
    """
    # Simulate student selecting a few interests
    num_interests_to_select = random.randint(1, min(3, len(available_interests)))
    selected_interests = random.sample(available_interests, num_interests_to_select)
    
    for interest in selected_interests:
        learner_profile.add_interest(interest)
    logger.info(f"Captured {len(selected_interests)} interests for {learner_profile.student_id}: {selected_interests}")

def capture_student_struggles(learner_profile: LearnerProfile, available_struggles: List[str]) -> None:
    """Simulates capturing student-reported struggle areas from a predefined list.

    Args:
        learner_profile (LearnerProfile): The profile to update with struggle areas.
        available_struggles (List[str]): A list of struggle areas for the student to choose from.
    """
    # Simulate student selecting a few struggle areas
    num_struggles_to_select = random.randint(0, min(2, len(available_struggles))) # Can select 0
    selected_struggles = random.sample(available_struggles, num_struggles_to_select)
    
    for area in selected_struggles:
        learner_profile.add_struggle_area(area)
    logger.info(f"Captured {len(selected_struggles)} struggle areas for {learner_profile.student_id}: {selected_struggles}")

# --- Full HLP Assessment Flow ---

def run_full_hlp_assessment(learner_profile: LearnerProfile) -> None:
    """Runs the full Holistic Learner Profiling assessment flow.

    This includes initial diagnostics, interest/struggle capture, and advanced diagnostics.

    Args:
        learner_profile (LearnerProfile): The learner's profile to populate.
    """
    logger.info(f"Starting full HLP assessment for {learner_profile.student_id}...")
    
    # Run initial preference tasks
    run_visual_preference_task(learner_profile)
    run_textual_preference_task(learner_profile)
    
    # Capture interests and struggles using the predefined lists
    capture_student_interests(learner_profile, PREDEFINED_INTERESTS)
    capture_student_struggles(learner_profile, PREDEFINED_STRUGGLE_AREAS)
    
    # Run advanced diagnostic tasks
    run_story_weaver_task(learner_profile)
    run_mind_mapper_task(learner_profile)
    
    logger.info(f"Full HLP assessment completed for {learner_profile.student_id}.")
    
    # Award Trailblazer badge if criteria met (e.g., after initial HLP tasks)
    # This is a good place to check for badges related to HLP completion.
    check_and_award_badge(learner_profile, "trailblazer")
    check_and_award_badge(learner_profile, "helping_hand") # If they identified struggles

# --- Helper Functions ---

def get_or_create_learner_profile(student_id: str, load_from_db: bool = True, persistence_enabled: bool = True) -> LearnerProfile:
    """Gets an existing learner profile or creates a new one.

    Args:
        student_id (str): The unique identifier for the student.
        load_from_db (bool, optional): Whether to load existing data from the database. Defaults to True.
        persistence_enabled (bool, optional): Whether to persist changes to the database. Defaults to True.

    Returns:
        LearnerProfile: The learner profile for the student.
    """
    return LearnerProfile(student_id, load_from_db, persistence_enabled)

# --- Main Test Function ---

def main_test():
    """Main function to test the HLP module functionality."""
    logger.info("Starting HLP module test...")
    
    # Create a test learner profile
    test_student_id = "test_student_001"
    learner_profile = get_or_create_learner_profile(test_student_id)
    
    # Run the full HLP assessment
    run_full_hlp_assessment(learner_profile)
        
    # Mark some LOs as completed
    learner_profile.mark_lo_completed("MA4_N1a")
    learner_profile.mark_lo_completed("MA4_N1b")
    learner_profile.mark_lo_completed("ENG4_R1")
    
    # Set current LO
    learner_profile.set_current_lo("MA4_N2a")
    
    # Record an activity attempt
    learner_profile.record_activity_attempt(
        lo_id="MA4_N1a",
        activity_id="QUIZ_001",
        activity_type="quiz",
        score=85.0,
        completed=True,
        details={"questions_answered": 10, "correct_answers": 8.5}
    )
    
    # Check and award badges (some might have been awarded during HLP assessment)
    newly_awarded = check_and_award_all_relevant_badges(learner_profile)
    logger.info(f"Newly awarded badges after LO completion: {newly_awarded}")
    
    # Ensure all changes are saved to the database
    learner_profile.save()
    
    # Print the final profile
    logger.info(f"Final learner profile: {learner_profile}")
    
    # Test loading the profile again
    logger.info("\n--- Testing loading profile from DB ---")
    loaded_profile = get_or_create_learner_profile(test_student_id, load_from_db=True)
    logger.info(f"Loaded learner profile: {loaded_profile}")
    logger.info(f"Loaded interests: {loaded_profile.interests}")
    logger.info(f"Loaded struggles: {loaded_profile.struggle_areas}")
    logger.info(f"Loaded completed LOs: {loaded_profile.completed_los}")
    logger.info(f"Loaded badges: {loaded_profile.earned_badges_data.keys()}")

    logger.info("HLP module test completed.")

if __name__ == "__main__":
    main_test()

