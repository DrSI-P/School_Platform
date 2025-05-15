"""#!/usr/bin/env python3
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
        
        This is essentially a wrapper for generate_pathway_with_prerequisites with specific defaults,
        but returns the data in a format suitable for the interface.
        
        Args:
            target_lo_count (int, optional): Target number of learning objectives. Defaults to DEFAULT_TARGET_LO_COUNT.
            max_activities_per_lo (int, optional): Maximum activities per learning objective. Defaults to DEFAULT_MAX_ACTIVITIES_PER_LO.
            
        Returns:
            List[Dict[str, Any]]: A list of learning objective dictionaries, each with a 'content_items' key
                                 containing a list of content item dictionaries.
        """
        logger.info(f"--- Generating Initial Pathway (target_lo_count={target_lo_count}) for {self.learner_profile.learner_id} ---")
        pathway_tuples = self.generate_pathway_with_prerequisites(max_los=target_lo_count, max_activities_per_lo=max_activities_per_lo)
        
        interface_pathway: List[Dict[str, Any]] = []
        for lo_data, content_list in pathway_tuples:
            lo_for_interface = lo_data.copy()
            lo_for_interface['content_items'] = content_list
            interface_pathway.append(lo_for_interface)
            
        return interface_pathway

    def display_pathway(self, pathway_to_display: Any, student_id: str) -> None:
        """
        Displays a learning pathway in a human-readable format.
        
        Args:
            pathway_to_display (Any): The pathway to display, either as tuples or interface format.
            student_id (str): The ID of the student for whom the pathway was generated.
        """
        logger.info(f"--- Learning Pathway for {student_id} ---")
        if not pathway_to_display:
            logger.info("No pathway generated or pathway is empty.")
            return
        
        # Determine format (tuple based or interface list of dicts)
        is_tuple_format = False
        if pathway_to_display and isinstance(pathway_to_display[0], tuple) and len(pathway_to_display[0]) == 2:
            first_element, second_element = pathway_to_display[0]
            if isinstance(first_element, dict) and isinstance(second_element, list):
                is_tuple_format = True

        if is_tuple_format:
            # Assumes pathway_to_display is List[Tuple[Dict[str, Any], List[Dict[str, Any]]]]
            for i, (lo, content_items_list) in enumerate(pathway_to_display):
                logger.info(f"Step {i+1}: Learning Objective: {lo.get('description', 'N/A')} (ID: {lo.get('id', 'N/A')})")
                if content_items_list:
                    for idx, content_item in enumerate(content_items_list):
                        logger.info(f"  Activity {idx+1}: {content_item.get('title', 'N/A')} (Type: {content_item.get('type', 'N/A')}, Difficulty: {content_item.get('difficulty', 'N/A')})")
                else:
                    logger.info("  No activities selected for this LO.")
        else:
            # Assumes pathway_to_display is List[Dict[str, Any]] (interface format)
            for i, lo_with_content in enumerate(pathway_to_display):
                logger.info(f"Step {i+1}: Learning Objective: {lo_with_content.get('description', 'N/A')} (ID: {lo_with_content.get('id', 'N/A')})")
                content_items_list = lo_with_content.get('content_items', [])
                if content_items_list:
                    for idx, content_item in enumerate(content_items_list):
                        logger.info(f"  Activity {idx+1}: {content_item.get('title', 'N/A')} (Type: {content_item.get('type', 'N/A')}, Difficulty: {content_item.get('difficulty', 'N/A')})")
                else:
                    logger.info("  No activities selected for this LO.")
        logger.info("--- End of Pathway Display ---")

# Example Usage (for testing or demonstration)
if __name__ == "__main__":
    # This block is for testing the module directly.
    # It requires dummy LearnerProfile and CurriculumContentStore setup.
    
    # Setup basic LearnerProfile
    test_student_id = "dcw_apg_test_student"
    lp = LearnerProfile(student_id=test_student_id)
    lp.learning_preferences = {"visual_task_1": "visual", "textual_task_1": "detailed_text"} # Example preferences
    lp.mark_lo_completed("MA3_N1a") # Example completed LO for prerequisite testing

    # Setup basic CurriculumContentStore with some sample data
    sample_los = [
        {"id": "MA3_N1a", "description": "Math Year 3 - Prereq LO", "subject": "Math", "year_group": "Year 3", "prerequisites": []},
        {"id": "MA4_N1a", "description": "Math Year 4 - Counting", "subject": "Math", "year_group": "Year 4", "prerequisites": ["MA3_N1a"]},
        {"id": "MA4_N1b", "description": "Math Year 4 - Place Value", "subject": "Math", "year_group": "Year 4", "prerequisites": ["MA3_N1a"]},
        {"id": "EN4_R1a", "description": "English Year 4 - Reading Comprehension", "subject": "English", "year_group": "Year 4", "prerequisites": []}
    ]
    sample_content = [
        {"id": "content_m4_n1a_vid", "lo_id": "MA4_N1a", "title": "Counting Fun Video", "type": "video", "difficulty": "easy"},
        {"id": "content_m4_n1a_quiz", "lo_id": "MA4_N1a", "title": "Counting Quiz", "type": "interactive_quiz", "difficulty": "medium"},
        {"id": "content_m4_n1b_game", "lo_id": "MA4_N1b", "title": "Place Value Game", "type": "game", "difficulty": "medium"},
        {"id": "content_m4_n1b_text", "lo_id": "MA4_N1b", "title": "Place Value Explained", "type": "text_explanation", "difficulty": "easy"},
        {"id": "content_e4_r1a_pdf", "lo_id": "EN4_R1a", "title": "Reading Practice PDF", "type": "worksheet_pdf", "difficulty": "medium"}
    ]
    ccs = CurriculumContentStore(learning_objectives_data=sample_los, learning_content_data=sample_content)

    # Initialize PathwayGenerator
    pathway_gen = PathwayGenerator(learner_profile=lp, content_store=ccs)

    # Generate a pathway using the refactored method
    logger.info("\n--- Testing generate_pathway_with_prerequisites ---")
    generated_pathway = pathway_gen.generate_pathway_with_prerequisites(max_los=2, max_activities_per_lo=1)
    pathway_gen.display_pathway(generated_pathway, test_student_id)

    # Test generate_initial_pathway (which uses the refactored method)
    logger.info("\n--- Testing generate_initial_pathway ---")
    initial_pathway_interface_format = pathway_gen.generate_initial_pathway(target_lo_count=3, max_activities_per_lo=2)
    pathway_gen.display_pathway(initial_pathway_interface_format, test_student_id)

    # Simulate completing an LO and regenerating
    if generated_pathway and generated_pathway[0][0]:
        first_lo_id_in_pathway = generated_pathway[0][0]['id']
        logger.info(f"\n--- Simulating completion of LO: {first_lo_id_in_pathway} ---")
        lp.mark_lo_completed(first_lo_id_in_pathway)
        logger.info(f"Completed LOs for {test_student_id}: {lp.completed_los}")
        
        logger.info("\n--- Regenerating pathway after LO completion ---")
        regenerated_pathway = pathway_gen.generate_pathway_with_prerequisites(max_los=2, max_activities_per_lo=1)
        pathway_gen.display_pathway(regenerated_pathway, test_student_id)
    
    logger.info("\n--- DCW-APG Module Test Run Complete ---")

"""
