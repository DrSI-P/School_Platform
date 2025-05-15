#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
EdPsych Connect - Dynamic AI Learning Architect (DALA)
Curriculum and Content Module

This module contains:
1.  Representations of digitized curriculum slices.
2.  Sets of tagged learning content.
3.  Logic to store and retrieve this information.
"""

import json
import os
import logging
from typing import Dict, List, Any, Optional

# Import and setup logging and data file paths from config.py
from config import (
    setup_logging,
    CURRICULUM_SLICE_MATH_Y4_FILE,
    LEARNING_CONTENT_SET_MATH_Y4_FILE,
    CURRICULUM_SLICE_KS2_ENGLISH_Y34_FILE,
    KS2_ENGLISH_ACTIVITIES_SET2_FILE,
    DATA_DIR # For saving files in the main block
)
setup_logging() # Initialize logging configuration

# Get a logger for this module
logger = logging.getLogger(__name__)

# --- Helper function to load JSON data ---
def load_json_data(file_path: str, data_description: str) -> Optional[Any]:
    """Loads JSON data from a file.

    Args:
        file_path (str): The path to the JSON file.
        data_description (str): A description of the data being loaded (for logging).

    Returns:
        Optional[Any]: The loaded JSON data as a Python object (dict or list),
                       or None if an error occurs.
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            logger.info(f"Successfully loaded {data_description} from {file_path}")
            return data
    except FileNotFoundError:
        logger.error(f"Error: {data_description} file not found at {file_path}")
        return None
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON from {file_path} for {data_description}: {e}")
        return None
    except Exception as e:
        logger.error(f"An unexpected error occurred while loading {data_description} from {file_path}: {e}")
        return None

# --- Storage and Retrieval Logic (Simplified) ---

class CurriculumContentStore:
    """Manages curriculum slices and learning content sets.

    This class provides methods to load, store, and retrieve curriculum
    information, including learning objectives and associated content items.
    It also handles mapping between learning objectives and content.

    Attributes:
        curriculum (Dict[str, Any]): The raw curriculum data (e.g., a subject slice).
        content_library (Dict[str, Dict[str, Any]]): A dictionary of all content items, keyed by content ID.
        lo_to_content_map (Dict[str, List[str]]): Maps Learning Objective IDs to a list of content item IDs.
        lo_details_map (Dict[str, Dict[str, Any]]): Maps Learning Objective IDs to their detailed definitions.
    """
    def __init__(self, curriculum_data: Dict[str, Any], content_data: List[Dict[str, Any]]):
        """Initializes the CurriculumContentStore.

        Args:
            curriculum_data (Dict[str, Any]): The curriculum slice data.
            content_data (List[Dict[str, Any]]): The list of learning content items.
        """
        self.curriculum = curriculum_data if curriculum_data else {}
        self.content_library = {item["id"]: item for item in content_data} if content_data else {}
        self.lo_to_content_map = self._build_lo_to_content_map(content_data if content_data else [])
        self.lo_details_map = {lo["id"]: lo for lo in self.curriculum.get("learning_objectives", [])}
        if curriculum_data and content_data:
            logger.info(f"CurriculumContentStore initialized with {len(self.lo_details_map)} LOs and {len(self.content_library)} content items.")
        else:
            logger.warning("CurriculumContentStore initialized with empty or missing curriculum/content data.")

    def _build_lo_to_content_map(self, content_data: List[Dict[str, Any]]) -> Dict[str, List[str]]:
        """Helper method to map learning objectives to content items.
        
        Creates a dictionary where keys are Learning Objective IDs and values are
        lists of content item IDs that cover those learning objectives.
        
        Args:
            content_data (List[Dict[str, Any]]): List of content items to process.
            
        Returns:
            Dict[str, List[str]]: Mapping from Learning Objective IDs to lists of content item IDs.
        """
        mapping: Dict[str, List[str]] = {}
        for item in content_data:
            for lo_id in item.get("learning_objectives_covered", []):
                if lo_id not in mapping:
                    mapping[lo_id] = []
                mapping[lo_id].append(item["id"])
        return mapping

    def get_learning_objectives(self) -> List[Dict[str, Any]]:
        """Returns all learning objectives in the current curriculum slice.

        Returns:
            List[Dict[str, Any]]: A list of learning objective dictionaries.
                                  Returns an empty list if no objectives are found.
        """
        return self.curriculum.get("learning_objectives", [])
        
    def get_all_learning_objectives(self) -> List[Dict[str, Any]]:
        """Alias for get_learning_objectives() to maintain compatibility.
        
        Returns:
            List[Dict[str, Any]]: A list of all learning objective dictionaries.
        """
        return self.get_learning_objectives()

    def get_lo_by_id(self, lo_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves details for a specific learning objective ID.
        
        Args:
            lo_id (str): The unique identifier of the learning objective to retrieve.
            
        Returns:
            Optional[Dict[str, Any]]: The learning objective dictionary if found, None otherwise.
        """
        return self.lo_details_map.get(lo_id)

    def get_content_by_id(self, content_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a specific content item by its ID.
        
        Args:
            content_id (str): The unique identifier of the content item to retrieve.
            
        Returns:
            Optional[Dict[str, Any]]: The content item dictionary if found, None otherwise.
        """
        return self.content_library.get(content_id)

    def get_content_for_lo(self, lo_id: str) -> List[Dict[str, Any]]:
        """Retrieves all content items tagged for a specific learning objective ID.
        
        Args:
            lo_id (str): The unique identifier of the learning objective.
            
        Returns:
            List[Dict[str, Any]]: A list of content item dictionaries that cover the specified
                                 learning objective. Returns an empty list if no content is found or content items are missing.
        """
        content_ids = self.lo_to_content_map.get(lo_id, [])
        # Ensure that we only return content that actually exists in the library
        return [content for cid in content_ids if (content := self.get_content_by_id(cid)) is not None]

    def save_to_json(self, curriculum_filepath: str = "curriculum_slice.json", content_filepath: str = "learning_content.json") -> None:
        """Saves the current curriculum and content library to JSON files.

        Args:
            curriculum_filepath (str, optional): The file path to save the curriculum slice.
                                                 Defaults to "curriculum_slice.json".
            content_filepath (str, optional): The file path to save the learning content set.
                                              Defaults to "learning_content.json".
        """
        try:
            # Ensure the directory exists
            os.makedirs(os.path.dirname(curriculum_filepath), exist_ok=True)
            os.makedirs(os.path.dirname(content_filepath), exist_ok=True)

            with open(curriculum_filepath, "w", encoding="utf-8") as f_curr:
                json.dump(self.curriculum, f_curr, indent=4)
            logger.info(f"Curriculum slice saved to {curriculum_filepath}")

            with open(content_filepath, "w", encoding="utf-8") as f_cont:
                json.dump(list(self.content_library.values()), f_cont, indent=4)
            logger.info(f"Learning content set saved to {content_filepath}")
        except IOError as e:
            logger.error(f"Error saving data to JSON: {e}")
        except Exception as e:
            logger.error(f"An unexpected error occurred during save_to_json: {e}")

# --- Main execution for testing --- 
if __name__ == "__main__":
    logger.info("--- Initializing DALA Curriculum & Content Module (Standalone Test) ---")
    
    # Load data from JSON files using paths from config
    curriculum_slice_math_y4_data = load_json_data(CURRICULUM_SLICE_MATH_Y4_FILE, "Year 4 Mathematics Curriculum Slice")
    learning_content_set_math_y4_data = load_json_data(LEARNING_CONTENT_SET_MATH_Y4_FILE, "Year 4 Mathematics Learning Content")
    curriculum_slice_ks2_english_y34_data = load_json_data(CURRICULUM_SLICE_KS2_ENGLISH_Y34_FILE, "KS2 English Years 3-4 Curriculum Slice")
    ks2_english_activities_set2_data = load_json_data(KS2_ENGLISH_ACTIVITIES_SET2_FILE, "KS2 English Activities Set 2")

    # --- Test Year 4 Mathematics Slice ---
    if curriculum_slice_math_y4_data and learning_content_set_math_y4_data:
        logger.info("--- Testing Year 4 Mathematics Slice ---")
        math_store = CurriculumContentStore(curriculum_data=curriculum_slice_math_y4_data, content_data=learning_content_set_math_y4_data)
        all_math_los = math_store.get_learning_objectives()
        logger.info(f"Total Math Learning Objectives: {len(all_math_los)}")
        if all_math_los:
            logger.info(f"First Math LO: {all_math_los[0].get('description')}")
            math_lo_to_test = all_math_los[0].get('id')
            if math_lo_to_test:
                content_for_math_lo1 = math_store.get_content_for_lo(math_lo_to_test)
                logger.info(f"Content items for Math LO {math_lo_to_test} ({all_math_los[0].get('description')}):")
                for content_item in content_for_math_lo1:
                    logger.info(f"  - {content_item.get('title')} (ID: {content_item.get('id')})")
        # Test saving (optional, ensure DATA_DIR is correctly configured for output)
        # math_store.save_to_json(
        #     curriculum_filepath=os.path.join(DATA_DIR, "math_y4_curriculum_test_save.json"),
        #     content_filepath=os.path.join(DATA_DIR, "math_y4_content_test_save.json")
        # )
    else:
        logger.error("Could not test Year 4 Mathematics Slice due to missing data.")

    # --- Test KS2 English Slice ---
    if curriculum_slice_ks2_english_y34_data and ks2_english_activities_set2_data:
        logger.info("--- Testing KS2 English (Years 3-4) Slice ---")
        # Note: The original KS2_ENGLISH_LEARNING_OBJECTIVES included LOs from NEW_KS2_ENGLISH_ACTIVITIES_SET2.
        # For a clean load, the curriculum_slice_ks2_english_y34.json should ideally contain ALL relevant LOs.
        # Or, we need to merge them after loading if they are in separate files/structures.
        # For this refactoring, we assume curriculum_slice_ks2_english_y34.json is comprehensive or
        # NEW_KS2_ENGLISH_ACTIVITIES_SET2 provides the content and its LOs are already in the curriculum slice.
        
        # If NEW_KS2_ENGLISH_ACTIVITIES_SET2 also defines LOs that should be part of the curriculum slice,
        # they need to be merged. For now, we assume the curriculum JSON is the source of truth for LOs.
        # The ks2_english_activities_set2.json is just content.

        english_store = CurriculumContentStore(curriculum_data=curriculum_slice_ks2_english_y34_data, content_data=ks2_english_activities_set2_data)
        all_english_los = english_store.get_learning_objectives()
        logger.info(f"Total English Learning Objectives (from JSON): {len(all_english_los)}")
        if all_english_los:
            english_lo_to_test = all_english_los[0].get('id') # Test with the first LO from the JSON
            if english_lo_to_test:
                content_for_english_lo = english_store.get_content_for_lo(english_lo_to_test)
                logger.info(f"Content items for English LO {english_lo_to_test} ({english_store.get_lo_by_id(english_lo_to_test).get('description')}):")
                for content_item in content_for_english_lo:
                    logger.info(f"  - {content_item.get('title')} (ID: {content_item.get('id')})")
        # Test saving (optional)
        # english_store.save_to_json(
        #     curriculum_filepath=os.path.join(DATA_DIR, "ks2_english_curriculum_test_save.json"),
        #     content_filepath=os.path.join(DATA_DIR, "ks2_english_content_test_save.json")
        # )
    else:
        logger.error("Could not test KS2 English Slice due to missing data.")

    logger.info("--- DALA Curriculum & Content Module (Standalone Test) Finished ---")

