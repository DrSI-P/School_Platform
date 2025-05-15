# Data Persistence Model for Learner Profiles and Progress

## 1. Introduction

This document outlines the design for a simple data model to persist learner profiles and progress for the EdPsych Connect DALA prototype. The primary goal is to allow learner data to be saved and loaded, enabling continuity between sessions.

## 2. Requirements

Based on the analysis of the existing `hlp_module.py`, `curriculum_content_module.py`, and `dcw_apg_module.py`, the following data needs to be persisted for each learner:

*   **Student Identifier:** A unique ID for each student (e.g., `student_id`).
*   **Learning Preferences:** Data captured from diagnostic mini-tasks (e.g., visual vs. textual preferences).
    *   Example: `{"visual_preference_task_1": "visual", "textual_preference_task_1": "detailed_text"}`
*   **Interests:** A list of selected interests.
    *   Example: `["Space Exploration", "Dinosaurs"]`
*   **Struggle Areas:** A list of self-reported areas where the learner needs support.
    *   Example: `["Understanding fractions", "Writing long essays"]`
*   **Cognitive Metrics:** Results from more sophisticated diagnostic tasks.
    *   Example: `{"story_weaver": {"accuracy": 0.8, "attempts": 1}, "mind_mapper": {"ideas_generated": 5}}`
*   **Completed Learning Objectives (LOs):** A list of LO IDs that the learner has successfully completed.
    *   Example: `["Y4MD_LO1", "KS2_ENG_Y34_READ_INFERENCES_PREDICTIONS"]`
*   **Current Learning Objective ID:** The ID of the learning objective the student is currently focused on within their pathway (can be null if no active LO).
    *   Example: `"Y4MD_LO2"` or `null`
*   **Earned Badges:** A collection of badges earned by the learner, including badge details and the date earned.
    *   Example: `{"trailblazer": {"id": "trailblazer", "name": "Trailblazer", "description": "...", "image_url": "...", "date_earned": "2025-05-15T10:57:00Z"}}`

## 3. Chosen Storage Option: JSON Files

For the current prototype stage, **JSON files** are selected as the storage mechanism. Each learner's profile and progress will be stored in a separate JSON file.

*   **Rationale:**
    *   **Simplicity:** JSON is easy to implement, human-readable, and aligns well with Python's dictionary structures. The existing `LearnerProfile` class in `hlp_module.py` already includes a `to_dict()` method that serializes the profile into a suitable dictionary format.
    *   **Prototype Suitability:** For a prototype, especially one primarily focused on single-user interaction or simulated multi-user scenarios without complex concurrency, JSON files offer a quick and effective way to achieve persistence.
    *   **No External Dependencies:** This approach doesn't require setting up external databases or installing additional libraries beyond standard Python.

*   **Future Considerations:** While JSON is suitable now, for a production system with many users, a more robust database solution (e.g., SQLite for simplicity, or a more scalable NoSQL/SQL database like PostgreSQL or MongoDB) would be necessary to handle scalability, concurrent access, and complex querying.

## 4. Data Model Schema (per JSON file)

Each JSON file will represent a single learner's profile. The structure of the JSON will directly mirror the dictionary output by the `LearnerProfile.to_dict()` method. An example structure is as follows:

```json
{
  "student_id": "student_test_001",
  "learning_preferences": {
    "visual_preference_task_1": "visual",
    "textual_preference_task_1": "detailed_text"
  },
  "interests": [
    "Space Exploration",
    "Creative Writing"
  ],
  "struggle_areas": [
    "Solving word problems in math"
  ],
  "cognitive_metrics": {
    "story_weaver": {
      "num_panels": 4,
      "accuracy": 0.8,
      "attempts": 1
    },
    "mind_mapper": {
      "ideas_generated": 6
    }
  },
  "completed_los": [
    "Y4MD_LO1",
    "KS2_ENG_Y34_READ_INFERENCES_PREDICTIONS"
  ],
  "current_learning_objective_id": "Y4MD_LO2",
  "earned_badges_data": {
    "trailblazer": {
      "id": "trailblazer",
      "name": "Trailblazer",
      "description": "You've taken the first step on your learning adventure! (Completed HLP Introduction)",
      "image_url": "assets/badges/trailblazer_badge.png",
      "criteria_check_function": "check_trailblazer_badge",
      "date_earned": "2025-05-15T10:57:00.123Z"
    },
    "helping_hand": {
      "id": "helping_hand",
      "name": "Helping Hand",
      "description": "Well done for identifying areas to grow! Understanding your learning is a superpower!",
      "image_url": "assets/badges/helping_hand_badge.png",
      "criteria_check_function": "check_helping_hand_badge",
      "date_earned": "2025-05-15T10:58:00.456Z"
    }
  }
}
```

**Notes on Data Types:**
*   `completed_los` will be stored as a list of strings (converted from a set for JSON serialization).
*   Timestamps (like `date_earned` for badges) will be stored in ISO 8601 format.

## 5. Implementation Approach (Conceptual)

1.  **Directory Structure:** A dedicated directory (e.g., `data/learner_profiles/`) will store the JSON files. Each file will be named using the `student_id` (e.g., `student_test_001.json`).
2.  **Saving Profiles:**
    *   When a learner's profile needs to be saved (e.g., after completing an HLP task, finishing an LO, earning a badge), the `LearnerProfile.to_dict()` method will be called.
    *   The resulting dictionary will be written to the corresponding student's JSON file, overwriting the previous version.
3.  **Loading Profiles:**
    *   When the system needs to load a profile (e.g., at the start of a session), it will check for the existence of a JSON file matching the `student_id`.
    *   If found, the JSON data will be read and used to reconstruct a `LearnerProfile` object. A new method, `LearnerProfile.from_dict(data)`, might be added to the `LearnerProfile` class to facilitate this.
    *   If not found, a new `LearnerProfile` can be created.

This approach provides a simple yet effective way to manage learner data persistence for the current stage of the DALA prototype.

