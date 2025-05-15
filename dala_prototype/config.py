#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
EdPsych Connect - Central Configuration File

This module centralizes all shared configurations for the EdPsych Connect DALA prototype.
It includes settings for logging, file paths, directory structures, default values for simulations,
and configurations specific to various modules like DCW-APG.

Properly documenting and typing these configurations is crucial for maintainability and clarity
as the project grows.
"""

import logging
import sys
import os
from typing import Dict, List, Union

# --- Logging Configuration ---
LOGGING_LEVEL: int = logging.INFO
"""The global logging level for the application (e.g., logging.DEBUG, logging.INFO)."""

LOGGING_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(funcName)s - %(lineno)d - %(message)s"
"""The format string for log messages."""

LOGGING_DATE_FORMAT: str = "%Y-%m-%d %H:%M:%S"
"""The format string for timestamps in log messages."""

def setup_logging() -> None:
    """Configures the root logger for the application.
    
    Sets up basic logging to stream to stdout with the defined level, format, and date format.
    This function should be called once at the beginning of the application or main script.
    """
    logging.basicConfig(
        level=LOGGING_LEVEL,
        format=LOGGING_FORMAT,
        datefmt=LOGGING_DATE_FORMAT,
        handlers=[
            logging.StreamHandler(sys.stdout) # Output logs to standard output
        ]
    )

# --- File and Directory Configurations ---
DEFAULT_OUTPUT_HTML_FILENAME: str = "dala_student_interface_v15_tts.html"
"""Default filename for the generated student interface HTML file."""

DEFAULT_OUTPUT_DIR_NAME: str = "interface_prototype"
"""Default name for the directory where generated interface files are stored (relative to script execution)."""

ASSET_DIR_NAME: str = "assets"
"""Name of the directory containing static assets (relative to script execution or a base path)."""

ADVENTURE_QUEST_ASSETS_SUBDIR: str = "adventure_quest_saga"
"""Subdirectory within the asset directory for adventure quest specific assets."""

# --- Data Directory Configuration ---
BASE_DIR: str = os.path.dirname(os.path.abspath(__file__))
"""Absolute path to the directory containing this config.py file."""

DATA_DIR: str = os.path.join(BASE_DIR, "data")
"""Absolute path to the directory where data files (like JSON curriculum) are stored."""

# --- Curriculum Content Module Configurations: File Paths ---
CURRICULUM_SLICE_MATH_Y4_FILE: str = os.path.join(DATA_DIR, "curriculum_slice_math_y4.json")
"""Path to the JSON file for the Year 4 Math curriculum slice."""

LEARNING_CONTENT_SET_MATH_Y4_FILE: str = os.path.join(DATA_DIR, "learning_content_set_math_y4.json")
"""Path to the JSON file for the Year 4 Math learning content set."""

CURRICULUM_SLICE_KS2_ENGLISH_Y34_FILE: str = os.path.join(DATA_DIR, "curriculum_slice_ks2_english_y34.json")
"""Path to the JSON file for the KS2 English (Years 3-4) curriculum slice."""

KS2_ENGLISH_ACTIVITIES_SET2_FILE: str = os.path.join(DATA_DIR, "ks2_english_activities_set2.json")
"""Path to the JSON file for the KS2 English activities set 2."""

# --- HTML Template Configuration (Placeholder) ---
# For larger templates, consider loading from external files.
# Example: HTML_TEMPLATE_FILE: str = "student_interface_template.html"

# --- Default Test/Simulation Values ---
DEFAULT_STUDENT_ID: str = "test_student_001"
"""Default student ID used for testing and simulations."""

DEFAULT_INITIAL_CONTENT_SET_KEY: str = "math_y4_set1"
"""Default key for the initial content set in simulations."""

DEFAULT_NEW_CONTENT_SET_KEY: str = "ks2_english_set2"
"""Default key for a new content set in simulations."""

DEFAULT_TARGET_LO_COUNT: int = 3
"""Default target number of Learning Objectives for pathway generation."""

DEFAULT_MAX_ACTIVITIES_PER_LO: int = 2
"""Default maximum number of activities to select per Learning Objective."""


# --- DCW-APG Module Configurations ---
DIFFICULTY_ORDER: Dict[str, int] = {"easy": 1, "medium": 2, "hard": 3, "default": 99}
"""Mapping of difficulty levels (lowercase) to numerical order for sorting content. Lower is easier."""

CONTENT_TYPE_PRIORITY_FOR_VARIETY: List[str] = ["game", "interactive_quiz", "video", "worksheet_pdf", "text_explanation"]
"""Ordered list defining the priority for selecting diverse content types to ensure variety."""

ALL_POSSIBLE_CONTENT_TYPES: List[str] = ["video", "interactive_quiz", "game", "text_explanation", "worksheet_pdf"]
"""A comprehensive list of all possible content types available in the system."""

VISUAL_PREFERENCE_CONTENT_TYPES: List[str] = ["video", "interactive_quiz", "game"]
"""Content types considered suitable for learners with a visual preference."""

TEXTUAL_PREFERENCE_CONTENT_TYPES: List[str] = ["text_explanation", "worksheet_pdf"]
"""Content types considered suitable for learners with a textual preference."""


if __name__ == "__main__":
    # Setup logging when this module is run directly (e.g., for testing config)
    setup_logging()
    logger: logging.Logger = logging.getLogger(__name__)
    logger.info("Logging configuration loaded and test message sent from config.py.")
    logger.debug("This is a debug message (should not appear if LOGGING_LEVEL is INFO).")
    logger.warning("This is a warning message from config.py.")
    logger.error("This is an error message from config.py.")
    logger.info(f"Default HTML Filename: {DEFAULT_OUTPUT_HTML_FILENAME}")
    logger.info(f"Default Output Directory Name: {DEFAULT_OUTPUT_DIR_NAME}")
    logger.info(f"Data Directory: {DATA_DIR}")
    logger.info(f"Math Curriculum File: {CURRICULUM_SLICE_MATH_Y4_FILE}")

