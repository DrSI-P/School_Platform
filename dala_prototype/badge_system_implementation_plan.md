# Badge System Implementation Plan (Task 2.3.4)

This document outlines the plan for implementing the badging and achievement system within the DALA prototype.

## 1. Overview

The goal is to implement the badging system designed in Task 2.3.3, allowing students to earn badges based on their achievements and view their earned badges in the interface.

## 2. Data Storage

### 2.1. Learner Profile Extension

Badge data will be stored as part of the learner's profile. The existing learner profile, managed conceptually by `hlp_module.py`, will be extended to include a new section for badges.

*   **Proposed Structure (within learner profile JSON or Python dictionary):**
    ```json
    {
      // ... other profile data ...
      "badges_earned": [
        {
          "badge_id": "trailblazer_badge",
          "name": "Trailblazer",
          "description": "Awarded for being among the first to try a new DALA feature or module.",
          "image_url": "assets/badges/trailblazer_badge.png",
          "date_earned": "YYYY-MM-DDTHH:MM:SSZ"
        },
        {
          "badge_id": "topic_tackler_badge_math_algebra", // Potentially more specific IDs if badges are topic-related
          "name": "Topic Tackler - Math Algebra",
          "description": "Awarded for successfully completing all core activities in a specific topic (e.g., Math - Algebra Basics).",
          "image_url": "assets/badges/topic_tackler_badge.png",
          "date_earned": "YYYY-MM-DDTHH:MM:SSZ"
        }
        // ... other earned badges
      ]
    }
    ```
*   Each entry in `badges_earned` will be an object containing:
    *   `badge_id`: A unique identifier for the badge (e.g., `trailblazer_badge`, `topic_tackler_badge`).
    *   `name`: The display name of the badge.
    *   `description`: A brief description of how the badge is earned.
    *   `image_url`: Path to the badge's visual asset.
    *   `date_earned`: Timestamp of when the badge was awarded.

### 2.2. Badge Definitions

A separate configuration or data structure (potentially a Python dictionary or a JSON file) will define all available badges, their criteria, names, descriptions, and image URLs. This will make it easier to manage and add new badges in the future.

*   **Proposed Structure (e.g., `badges_definitions.json` or a dictionary in a Python module):**
    ```json
    {
      "trailblazer_badge": {
        "name": "Trailblazer",
        "description": "Awarded for being among the first to try a new DALA feature or module.",
        "criteria_type": "event_trigger", // e.g., event_trigger, progress_milestone, completion
        "criteria_details": {"event_name": "new_feature_accessed"}, // Specifics for the criteria type
        "image_url": "assets/badges/trailblazer_badge.png"
      },
      "topic_tackler_badge": {
        "name": "Topic Tackler",
        "description": "Awarded for successfully completing all core activities in a specific topic.",
        "criteria_type": "topic_completion",
        "criteria_details": {"completion_threshold": 1.0}, // e.g., 100% completion of topic activities
        "image_url": "assets/badges/topic_tackler_badge.png"
      },
      "quest_completer_badge": {
        "name": "Quest Completer",
        "description": "Awarded for completing a significant learning quest or a set of related topics.",
        "criteria_type": "quest_completion",
        "criteria_details": {"quest_id": "main_story_quest_1"},
        "image_url": "assets/badges/quest_completer_badge.png"
      },
      "curiosity_spark_badge": {
        "name": "Curiosity Spark",
        "description": "Awarded for exploring optional learning paths or asking insightful questions (manual award or future AI trigger).",
        "criteria_type": "exploration_or_manual",
        "criteria_details": {},
        "image_url": "assets/badges/curiosity_spark_badge.png"
      },
      "helping_hand_badge": {
        "name": "Helping Hand",
        "description": "Awarded for assisting other learners or contributing positively to the learning community (future feature).",
        "criteria_type": "community_contribution_or_manual",
        "criteria_details": {},
        "image_url": "assets/badges/helping_hand_badge.png"
      }
    }
    ```

## 3. Badge Awarding Logic

### 3.1. Trigger Points

The system will need functions to check for badge criteria at relevant points:
*   After completing a learning activity.
*   After completing a topic or quest.
*   When specific events occur (e.g., accessing a new feature for the "Trailblazer" badge).
*   Periodically, or when the learner profile is updated.

### 3.2. Checking Criteria

Functions will be developed to:
1.  Iterate through the defined badges.
2.  For each badge, check if the student has already earned it.
3.  If not earned, check if the student now meets the criteria for that badge based on their current progress, activity history, and profile data.
4.  If criteria are met, award the badge by adding it to the `badges_earned` list in their profile with the current timestamp.

### 3.3. Initial Badge Criteria Implementation (Examples):

*   **Topic Tackler:** Awarded when a student achieves 100% completion in all core activities of a defined topic. This will require tracking activity completion status within the learner profile.
*   **Quest Completer:** Awarded upon completion of a predefined sequence of topics or a major learning milestone in the "Adventure Quest Saga".
*   **Trailblazer, Curiosity Spark, Helping Hand:** For the prototype, these might be triggered by simpler, placeholder events or even manually simulated, with more complex AI-driven or community-based triggers planned for the future.

## 4. Interface Display

### 4.1. Location

A new section or tab will be added to the student interface (`dala_student_interface_v9_adventure_quest.html`) to display earned badges. This could be:
*   A dedicated "Badges" or "Achievements" page/section accessible from the main navigation.
*   Integrated into the student's profile view.

For the initial implementation, a simple list or grid display of earned badges within the main interface or a pop-up triggered by a new "My Badges" button would be sufficient.

### 4.2. Visual Representation

Each earned badge will be displayed using its image (`image_url`), name, and description. Hovering over a badge could show the `date_earned`.

### 4.3. `generate_interface.py` Updates

The `generate_interface.py` script will be modified to:
*   Read the `badges_earned` data from the (simulated or loaded) learner profile.
*   Generate the HTML structure to display these badges in the chosen location.

## 5. Module Updates

*   **`hlp_module.py` (Holistic Learner Profile Module):**
    *   Update the learner profile data structure to include `badges_earned`.
    *   Add functions to award a badge (i.e., add it to the `badges_earned` list).
    *   Add functions to check if a specific badge has already been earned.
    *   (Potentially) Add functions to check criteria for earning badges, or this logic might reside in a new dedicated badge module.

*   **`curriculum_content_module.py` / `dcw_apg_module.py`:**
    *   These modules might need to provide data or trigger events that are used by the badge awarding logic (e.g., signaling topic completion, activity completion).

*   **`generate_interface.py`:**
    *   Modify to fetch and display earned badges in the HTML output.

*   **New Module (Optional): `badge_logic_module.py`**
    *   If the badge awarding logic becomes complex, it might be beneficial to encapsulate it in a new module. This module would contain the badge definitions and the functions for checking and awarding badges.

## 6. Implementation Steps (High-Level)

1.  **Define Badge Data Structures:** Finalize the structure for `badges_earned` in the learner profile and the structure for `badge_definitions`.
2.  **Update `hlp_module.py`:** Implement functions for managing `badges_earned` in the learner profile.
3.  **Implement Badge Awarding Logic:** Create functions to check criteria and award badges. For the prototype, this might initially focus on 1-2 badges with clear triggers (e.g., Topic Tackler based on simulated topic completion).
4.  **Update `generate_interface.py`:** Add code to display earned badges in the student interface.
5.  **Create/Update HTML:** Modify `dala_student_interface_v9_adventure_quest.html` (or its generation logic) to include the badge display area.
6.  **Testing:** Simulate student progress and events to test if badges are awarded correctly and displayed properly.

## 7. Considerations for Prototyping

*   For the initial prototype, the learner profile and badge data might be simulated or hardcoded in `generate_interface.py` or `hlp_module.py` for testing purposes before full dynamic integration.
*   Focus on implementing a few badges end-to-end to demonstrate the system.
*   The visual display can be simple initially, with refinements in later iterations.

This plan provides a roadmap for implementing the badging system. Adjustments may be made as development progresses.
