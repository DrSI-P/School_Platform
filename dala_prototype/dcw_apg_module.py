#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
EdPsych Connect - Dynamic AI Learning Architect (DALA)
Dynamic Curriculum Weaving & Adaptive Pathway Generation (DCW-APG) Module - Stage 2 Enhancements

This module contains the logic for:
1.  Generating a learning pathway considering LO prerequisites.
2.  Selecting content for these LOs based on learner profile preferences, difficulty progression,
    and offering a variety of activities.
"""

import random
import logging
from typing import List, Dict, Tuple, Any, Optional, Set

from hlp_module import LearnerProfile
from curriculum_content_module import CurriculumContentStore
from config import (
    setup_logging,
    DIFFICULTY_ORDER,
    CONTENT_TYPE_PRIORITY_FOR_VARIETY,
    ALL_POSSIBLE_CONTENT_TYPES,
    VISUAL_PREFERENCE_CONTENT_TYPES,
    TEXTUAL_PREFERENCE_CONTENT_TYPES,
    DEFAULT_TARGET_LO_COUNT,
    DEFAULT_MAX_ACTIVITIES_PER_LO
)

setup_logging() # Initialize logging configuration

# Get a logger for this module
logger = logging.getLogger(__name__)

class PathwayGenerator:
    """Generates a learning pathway for a student, considering prerequisites, difficulty, and activity variety.
    
    This class analyzes a student's profile and curriculum data to create personalized learning pathways
    that respect learning objective prerequisites, match content to student preferences, and ensure
    appropriate difficulty progression and activity variety.
    
    Attributes:
        learner_profile (LearnerProfile): The student's profile containing preferences and completed LOs.
        content_store (CurriculumContentStore): Repository of curriculum and content data.
    """
    
    def __init__(self, learner_profile: LearnerProfile, content_store: CurriculumContentStore):
        """Initialize the PathwayGenerator with a learner profile and content store.
        
        Args:
            learner_profile (LearnerProfile): The student's profile with preferences and progress.
            content_store (CurriculumContentStore): Repository of curriculum and content data.
        """
        self.learner_profile = learner_profile
        self.content_store = content_store
        logger.info(f"PathwayGenerator initialized for student: {learner_profile.learner_id}")

    def _is_lo_eligible(self, lo_id: str) -> bool:
        """Checks if a Learning Objective is eligible based on completed prerequisites.
        
        Args:
            lo_id (str): The ID of the learning objective to check.
            
        Returns:
            bool: True if the LO is eligible (all prerequisites completed), False otherwise.
        """
        lo_details = self.content_store.get_lo_by_id(lo_id)
        
        if not lo_details:
            logger.warning(f"LO details not found for ID: {lo_id}. Assuming not eligible.")
            return False
            
        prerequisites = lo_details.get("prerequisites", [])
        if not prerequisites:
            return True
        
        for prereq_id in prerequisites:
            if not self.learner_profile.has_completed_lo(prereq_id):
                logger.debug(f"LO {lo_id} not eligible: Prerequisite {prereq_id} not completed by {self.learner_profile.learner_id}.")
                return False
        logger.debug(f"LO {lo_id} is eligible for {self.learner_profile.learner_id}.")
        return True

    def _get_preferred_content_types(self) -> List[str]:
        """Determines the ordered list of preferred content types based on learner profile."""
        preferred_types_ordered_list: List[str] = []
        if self.learner_profile.learning_preferences.get("visual_task_1") == "visual":
            preferred_types_ordered_list.extend(VISUAL_PREFERENCE_CONTENT_TYPES)
        if self.learner_profile.learning_preferences.get("textual_task_1") == "detailed_text": # Assuming this key exists from HLP
            preferred_types_ordered_list.extend(TEXTUAL_PREFERENCE_CONTENT_TYPES)
        
        # Add remaining types to ensure all are considered, maintaining order of preference first
        for pt_config in ALL_POSSIBLE_CONTENT_TYPES:
            if pt_config not in preferred_types_ordered_list:
                preferred_types_ordered_list.append(pt_config)
        return preferred_types_ordered_list

    def _apply_preference_driven_selection(
        self,
        lo_id: str,
        sorted_content_all: List[Dict[str, Any]],
        preferred_types_ordered_list: List[str],
        selected_activities: List[Dict[str, Any]],
        used_content_ids: Set[str],
        max_activities_per_lo: int
    ) -> None:
        """Applies preference-driven selection to choose content items."""
        for pref_type in preferred_types_ordered_list:
            if len(selected_activities) >= max_activities_per_lo:
                break
            for item in sorted_content_all:
                item_id_key = "id" if "id" in item else "content_id"
                if item.get("type") == pref_type and item.get(item_id_key) not in used_content_ids:
                    selected_activities.append(item)
                    used_content_ids.add(item[item_id_key])
                    logger.debug(f"Selected activity {item[item_id_key]} (type: {pref_type}) for LO {lo_id} based on preference.")
                    break 
            if selected_activities and selected_activities[-1].get("type") == pref_type: 
                continue

    def _apply_variety_driven_selection(
        self,
        lo_id: str,
        sorted_content_all: List[Dict[str, Any]],
        selected_activities: List[Dict[str, Any]],
        used_content_ids: Set[str],
        max_activities_per_lo: int
    ) -> None:
        """Applies variety-driven selection to fill remaining content slots."""
        current_selected_types = {act.get("type") for act in selected_activities}
        if len(selected_activities) < max_activities_per_lo:
            for activity_type in CONTENT_TYPE_PRIORITY_FOR_VARIETY:
                if len(selected_activities) >= max_activities_per_lo:
                    break
                if activity_type not in current_selected_types: 
                    for item in sorted_content_all:
                        item_id_key = "id" if "id" in item else "content_id"
                        if item.get("type") == activity_type and item.get(item_id_key) not in used_content_ids:
                            selected_activities.append(item)
                            used_content_ids.add(item[item_id_key])
                            current_selected_types.add(activity_type)
                            logger.debug(f"Selected activity {item[item_id_key]} (type: {activity_type}) for LO {lo_id} for variety.")
                            break 

    def _apply_fallback_selection(
        self,
        lo_id: str,
        sorted_content_all: List[Dict[str, Any]],
        selected_activities: List[Dict[str, Any]],
        used_content_ids: Set[str],
        max_activities_per_lo: int
    ) -> None:
        """Applies fallback selection if not enough activities are chosen."""
        if len(selected_activities) < max_activities_per_lo:
            for item in sorted_content_all:
                if len(selected_activities) >= max_activities_per_lo:
                    break
                item_id_key = "id" if "id" in item else "content_id"
                if item.get(item_id_key) not in used_content_ids:
                    selected_activities.append(item)
                    used_content_ids.add(item[item_id_key])
                    logger.debug(f"Selected activity {item[item_id_key]} (type: {item.get('type')}) for LO {lo_id} as fallback.")

        if not selected_activities and sorted_content_all: # Absolute fallback: pick the first (easiest) if nothing else selected
            selected_activities.append(sorted_content_all[0])
            item_id_key = "id" if "id" in sorted_content_all[0] else "content_id"
            used_content_ids.add(sorted_content_all[0][item_id_key]) # Ensure it's marked as used
            logger.debug(f"Selected easiest activity {sorted_content_all[0][item_id_key]} for LO {lo_id} as absolute fallback.")

    def _select_varied_content_for_lo(self, lo_id: str, available_content_for_lo: List[Dict[str, Any]], max_activities_per_lo: int = DEFAULT_MAX_ACTIVITIES_PER_LO) -> List[Dict[str, Any]]:
        """Selects a variety of appropriate content items for an LO.
        
        This method implements a sophisticated selection algorithm that:
        1. First prioritizes content matching the learner's preferences
        2. Then ensures variety by selecting different content types
        3. Falls back to easiest content if needed
        
        Args:
            lo_id (str): The ID of the learning objective.
            available_content_for_lo (List[Dict[str, Any]]): List of content items available for this LO.
            max_activities_per_lo (int, optional): Maximum number of activities to select. 
                                                 Defaults to DEFAULT_MAX_ACTIVITIES_PER_LO.
            
        Returns:
            List[Dict[str, Any]]: Selected content items for the learning objective.
        """
        if not available_content_for_lo:
            logger.info(f"No available content for LO {lo_id} to select from.")
            return []

        sorted_content_all = sorted(
            available_content_for_lo,
            key=lambda c: DIFFICULTY_ORDER.get(c.get("difficulty", "default").lower(), DIFFICULTY_ORDER["default"])
        )

        selected_activities: List[Dict[str, Any]] = []
        used_content_ids: Set[str] = set()

        preferred_types_ordered_list = self._get_preferred_content_types()
        logger.debug(f"Preferred types for {self.learner_profile.learner_id} for LO {lo_id}: {preferred_types_ordered_list}")

        self._apply_preference_driven_selection(
            lo_id, sorted_content_all, preferred_types_ordered_list,
            selected_activities, used_content_ids, max_activities_per_lo
        )
        
        self._apply_variety_driven_selection(
            lo_id, sorted_content_all, selected_activities, 
            used_content_ids, max_activities_per_lo
        )

        self._apply_fallback_selection(
            lo_id, sorted_content_all, selected_activities, 
            used_content_ids, max_activities_per_lo
        )
        
        return selected_activities[:max_activities_per_lo]

    def _get_eligible_next_los(self, max_los: int) -> List[Dict[str, Any]]:
        """Filters and selects eligible learning objectives for the next pathway.

        Args:
            max_los (int): Maximum number of learning objectives to select.

        Returns:
            List[Dict[str, Any]]: A list of selected learning objective dictionaries.
        """
        all_learning_objectives = self.content_store.get_learning_objectives()
        if not all_learning_objectives:
            logger.warning("No learning objectives found in the curriculum store for _get_eligible_next_los.")
            return []

        candidate_los = [lo for lo in all_learning_objectives if not self.learner_profile.has_completed_lo(lo['id'])]
        
        # Filter by eligibility (prerequisites)
        potential_next_los = [lo_data for lo_data in candidate_los if self._is_lo_eligible(lo_data['id'])]
        
        # Shuffle and select a subset
        random.shuffle(potential_next_los)
        selected_los = potential_next_los[:min(len(potential_next_los), max_los)]
        
        if selected_los:
            logger.info(f"Selected {len(selected_los)} eligible LOs for the pathway: {[lo['id'] for lo in selected_los]}")
        else:
            # This is a normal case if no LOs are eligible or all are completed.
            logger.info(f"No new eligible LOs found to select for the pathway for student {self.learner_profile.learner_id}.")
            
        return selected_los

    def _process_selected_lo_for_pathway(self, lo_data: Dict[str, Any], max_activities_per_lo: int) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
        """Processes a single LO to select content and prepare it for the pathway.

        Args:
            lo_data (Dict[str, Any]): The learning objective data.
            max_activities_per_lo (int): Maximum number of activities to select for this LO.

        Returns:
            Tuple[Dict[str, Any], List[Dict[str, Any]]]: A tuple containing the LO data and its selected content items.
        """
        logger.info(f"Processing LO: {lo_data['id']} - {lo_data.get('description', 'N/A')}")
        available_content = self.content_store.get_content_for_lo(lo_data['id'])
        selected_activity_list = self._select_varied_content_for_lo(lo_data['id'], available_content, max_activities_per_lo)
        
        if selected_activity_list:
            # Detailed logging of selected activities is already in _select_varied_content_for_lo or its sub-methods.
            # Here, we can log a summary if needed, or rely on the existing detailed logs.
            logger.info(f"  Successfully selected {len(selected_activity_list)} activities for LO {lo_data['id']}.")
        else:
            logger.warning(f"  No suitable content found or selected for LO: {lo_data['id']}. It will be included in pathway without activities.")
            selected_activity_list = [] # Ensure it's a list
            
        return (lo_data, selected_activity_list)

    def generate_pathway_with_prerequisites(self, max_los: int = DEFAULT_TARGET_LO_COUNT, max_activities_per_lo: int = DEFAULT_MAX_ACTIVITIES_PER_LO) -> List[Tuple[Dict[str, Any], List[Dict[str, Any]]]]:
        """
        Generates a learning pathway by selecting eligible LOs based on prerequisites
        and then selecting a variety of content for these LOs, considering difficulty.
        
        Args:
            max_los (int, optional): Maximum number of learning objectives to include. 
                                     Defaults to DEFAULT_TARGET_LO_COUNT.
            max_activities_per_lo (int, optional): Maximum activities per learning objective. 
                                                 Defaults to DEFAULT_MAX_ACTIVITIES_PER_LO.
            
        Returns:
            List[Tuple[Dict[str, Any], List[Dict[str, Any]]]]: A list of tuples, each containing:
                - A learning objective dictionary
                - A list of content item dictionaries for that learning objective
        """
        logger.info(f"--- Generating Pathway (Prerequisites, Difficulty, Variety) for {self.learner_profile.learner_id} ---")
        generated_pathway_tuples: List[Tuple[Dict[str, Any], List[Dict[str, Any]]]] = [] 

        selected_los_for_this_pathway = self._get_eligible_next_los(max_los)

        if not selected_los_for_this_pathway:
            # Message already logged in _get_eligible_next_los
            pass
        else:
            for lo_data in selected_los_for_this_pathway:
                # _process_selected_lo_for_pathway handles its own logging for the LO processing
                processed_lo_tuple = self._process_selected_lo_for_pathway(lo_data, max_activities_per_lo)
                generated_pathway_tuples.append(processed_lo_tuple)
            
            if not generated_pathway_tuples and selected_los_for_this_pathway:
                 logger.warning("Eligible LOs were selected, but the final pathway is empty. This might indicate issues in content processing for all selected LOs.")

        logger.info(f"--- Pathway Generation Complete for {self.learner_profile.learner_id}. Generated {len(generated_pathway_tuples)} LO steps. ---")
        return generated_pathway_tuples

    def generate_initial_pathway(self, target_lo_count: int = DEFAULT_TARGET_LO_COUNT, max_activities_per_lo: int = DEFAULT_MAX_ACTIVITIES_PER_LO) -> List[Dict[str, Any]]:
        """
        Generates an initial learning pathway, typically for when a student starts or needs a new set of LOs.
        
        This method:
        1. Selects a set of learning objectives based on prerequisites and student progress
        2. For each LO, selects appropriate content items based on preferences and variety
        3. Returns a list of LOs with their content items attached
        
        Args:
            target_lo_count (int, optional): Target number of learning objectives to include.
                                           Defaults to DEFAULT_TARGET_LO_COUNT.
            max_activities_per_lo (int, optional): Maximum activities per learning objective.
                                                 Defaults to DEFAULT_MAX_ACTIVITIES_PER_LO.
            
        Returns:
            List[Dict[str, Any]]: A list of learning objective dictionaries, each with a 'content_items' key
                                containing a list of selected content items.
        """
        logger.info(f"Generating initial pathway for student: {self.learner_profile.learner_id}")
        
        # Use the prerequisite-aware pathway generation
        pathway_tuples = self.generate_pathway_with_prerequisites(
            max_los=target_lo_count,
            max_activities_per_lo=max_activities_per_lo
        )
        
        # Convert the tuples to the expected format (LOs with content_items)
        pathway_los = []
        for lo_data, content_items in pathway_tuples:
            # Create a copy of the LO data to avoid modifying the original
            lo_with_content = lo_data.copy()
            # Add the content items to the LO
            lo_with_content['content_items'] = content_items
            pathway_los.append(lo_with_content)
        
        logger.info(f"Initial pathway generation complete. Generated {len(pathway_los)} LOs with content.")
        return pathway_los
