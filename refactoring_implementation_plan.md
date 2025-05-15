# Refactoring Implementation Plan

## 1. Introduction

This document outlines the implementation plan for refactoring the core Python modules of the EdPsych Connect DALA prototype, based on the previously approved `module_refactoring_recommendations.md`. The goal is to improve code clarity, modularity, maintainability, and overall quality in a structured and phased manner.

## 2. Guiding Principles for Refactoring

*   **Incremental Changes:** Apply changes in small, manageable steps to minimize disruption and allow for easier testing and verification.
*   **Testing:** After each significant refactoring step, ensure the system remains functional. (Manual testing for now, with an eye towards future automated tests).
*   **Version Control:** Commit changes frequently with clear messages to track progress and facilitate rollbacks if necessary.
*   **Clarity and Readability:** Prioritize making the code easier to understand and maintain.

## 3. Proposed Refactoring Phases and Tasks

This plan is divided into phases, starting with foundational changes and then moving to module-specific refactoring. The `generate_interface.py` module, being the most complex and in need of significant overhaul, will be addressed in a dedicated later phase.

### Phase 1: Foundational Improvements (General Recommendations)

*   **Task 1.1: Implement Structured Logging**
    *   **Objective:** Replace `print()` statements with Python's `logging` module across all relevant modules (`hlp_module.py`, `curriculum_content_module.py`, `dcw_apg_module.py`, `generate_interface.py`).
    *   **Steps:**
        1.  Set up a basic logging configuration (e.g., in a `config.py` or at the start of each script if a central config is too early).
        2.  Identify and replace `print()` statements used for debugging, info, warnings, and errors with appropriate `logging.debug()`, `logging.info()`, `logging.warning()`, `logging.error()` calls.
        3.  Ensure log messages are informative.
    *   **Affected Modules:** All.
*   **Task 1.2: Enhance Docstrings and Comments**
    *   **Objective:** Improve inline documentation for better understanding.
    *   **Steps:**
        1.  Review each module for functions/classes lacking detailed docstrings or complex code blocks needing explanatory comments.
        2.  Update docstrings to a consistent format (e.g., Google style), detailing parameters, return values, and purpose.
        3.  Add inline comments for non-obvious logic.
    *   **Affected Modules:** All.
*   **Task 1.3: Consistent Type Hinting**
    *   **Objective:** Ensure comprehensive type hinting for improved readability and static analysis.
    *   **Steps:**
        1.  Review all function signatures and key variable declarations.
        2.  Add or correct type hints as needed.
    *   **Affected Modules:** All.

### Phase 2: Configuration and Data Externalization

*   **Task 2.1: Externalize `BADGE_DEFINITIONS` and Other HLP Constants**
    *   **Objective:** Move `BADGE_DEFINITIONS`, `PREDEFINED_INTERESTS`, `PREDEFINED_STRUGGLE_AREAS` from `hlp_module.py` to a configuration file (e.g., `hlp_config.json` or a new `config.py`).
    *   **Steps:**
        1.  Create the configuration file (e.g., `hlp_config.json`).
        2.  Move the data structures to this file.
        3.  Modify `hlp_module.py` to load this configuration at startup.
    *   **Affected Modules:** `hlp_module.py`.
*   **Task 2.2: Externalize Curriculum and Content Data**
    *   **Objective:** Load curriculum slices and learning content sets from external files (e.g., JSON) instead of defining them in `curriculum_content_module.py` or importing from other Python files like `ks2_english_digitized_activities_set2.py`.
    *   **Steps:**
        1.  Convert existing `CURRICULUM_SLICE`, `LEARNING_CONTENT_SET`, and the content of `ks2_english_digitized_activities_set2.py` into JSON format (e.g., `curriculum_data.json`, `learning_content.json`).
        2.  Modify `CurriculumContentStore` in `curriculum_content_module.py` to load data from these JSON files during initialization.
        3.  Remove the direct Python definitions and the import of `ks2_english_digitized_activities_set2.py`.
    *   **Affected Modules:** `curriculum_content_module.py`, `generate_interface.py` (due to how content store is initialized).
*   **Task 2.3: Externalize `DIFFICULTY_ORDER`**
    *   **Objective:** Move `DIFFICULTY_ORDER` from `dcw_apg_module.py` to a configuration file.
    *   **Steps:**
        1.  Add `DIFFICULTY_ORDER` to a general `config.json` or `dcw_apg_config.json`.
        2.  Modify `dcw_apg_module.py` to load this configuration.
    *   **Affected Modules:** `dcw_apg_module.py`.

### Phase 3: Module-Specific Refactoring (`hlp_module.py`, `dcw_apg_module.py`)

*   **Task 3.1: Refactor `hlp_module.py` - `LearnerProfile` Enhancements**
    *   **Objective:** Add `from_dict` method to `LearnerProfile`.
    *   **Steps:**
        1.  Implement `from_dict(cls, data: dict)` class method in `LearnerProfile`.
    *   **Affected Modules:** `hlp_module.py`.
*   **Task 3.2: Refactor `dcw_apg_module.py` - `_select_varied_content_for_lo`**
    *   **Objective:** Break down the `_select_varied_content_for_lo` method in `PathwayGenerator` for clarity.
    *   **Steps:**
        1.  Identify logical sub-parts (preference-driven, variety-driven, fallback).
        2.  Create new private helper methods for these sub-parts.
        3.  Refactor `_select_varied_content_for_lo` to call these new helper methods.
    *   **Affected Modules:** `dcw_apg_module.py`.
*   **Task 3.3: (Optional - Defer if too complex for now) Badge System Separation**
    *   **Objective:** Consider moving badge definitions (already externalized in Task 2.1) and awarding logic to a separate `badge_system.py`.
    *   **Steps:** (This is more involved)
        1.  Create `badge_system.py`.
        2.  Move badge criteria checking functions (e.g., `check_trailblazer_badge`) to this new module.
        3.  Modify `hlp_module.py` to call these functions from `badge_system.py`.
    *   **Affected Modules:** `hlp_module.py`, new `badge_system.py`.

### Phase 4: Major Refactoring of `generate_interface.py`

This is the most significant refactoring effort and will likely be broken down further.

*   **Task 4.1: Separate CSS to External File**
    *   **Objective:** Move all CSS from the `<style>` tag in `HTML_TEMPLATE_V15_TTS` to an external `styles.css` file.
    *   **Steps:**
        1.  Create `interface_prototype/assets/css/styles.css`.
        2.  Copy CSS rules from the Python string to `styles.css`.
        3.  Modify `HTML_TEMPLATE_V15_TTS` to link to this external stylesheet in the `<head>`.
    *   **Affected Modules:** `generate_interface.py`.
*   **Task 4.2: Separate JavaScript to External Files**
    *   **Objective:** Move JavaScript functions to external `.js` files.
    *   **Steps:**
        1.  Identify distinct blocks of JavaScript functionality (e.g., HLP interactions, game logic, voice input, TTS).
        2.  Create corresponding `.js` files in `interface_prototype/assets/js/` (e.g., `hlp_interactions.js`, `star_collector.js`, `speech_features.js`).
        3.  Move JavaScript code to these files.
        4.  Modify `HTML_TEMPLATE_V15_TTS` to include these scripts, likely before the closing `</body>` tag.
        5.  Ensure data passing (like `learner_profile_json`) is still handled correctly (e.g., by reading from a `<script type="application/json">` tag or `data-*` attributes).
    *   **Affected Modules:** `generate_interface.py`.
*   **Task 4.3: Introduce Templating Engine (e.g., Jinja2) - Foundational Step**
    *   **Objective:** Replace f-string based HTML generation with a templating engine for `generate_interface.py`.
    *   **Steps:**
        1.  Choose and set up a templating engine (Jinja2 is a good candidate).
        2.  Convert the main `HTML_TEMPLATE_V15_TTS` into a base template file (e.g., `base.html.j2`).
        3.  Identify reusable HTML components and create them as separate template partials/includes (e.g., `_hlp_section.html.j2`, `_pathway_section.html.j2`).
        4.  Modify `generate_interface.py` to use the templating engine to render the HTML, passing necessary data to the templates.
    *   **Affected Modules:** `generate_interface.py` (major rewrite of HTML generation logic).
*   **Task 4.4: Refactor HTML Generation Functions**
    *   **Objective:** Adapt existing `generate_..._section` functions to work with the templating engine, or replace them with logic that prepares data for templates.
    *   **Steps:**
        1.  Review each `generate_..._section` function.
        2.  Instead of returning HTML strings, these functions should prepare context dictionaries to be passed to their respective template partials.
    *   **Affected Modules:** `generate_interface.py`.
*   **Task 4.5: Refactor Main Generation Logic in `generate_interface.py`**
    *   **Objective:** Clean up the `if __name__ == "__main__":` block.
    *   **Steps:**
        1.  Move the main logic into a `main_generate_interface()` function.
        2.  Address the `MockPathway` class by ensuring consistent data structures or creating a proper data transformation utility if needed, rather than an inline mock.
        3.  Centralize asset path management if not already done.
    *   **Affected Modules:** `generate_interface.py`.

## 4. Prioritization and Phasing (Initial Thoughts)

*   **Highest Priority:** Phase 1 (Foundational Improvements) as these benefit all modules and improve developer experience immediately.
*   **Next Priority:** Phase 2 (Configuration and Data Externalization) as this significantly improves maintainability of content and configurations.
*   **Followed By:** Phase 3 (Module-Specific Refactoring for `hlp_module.py` and `dcw_apg_module.py`). Task 3.3 (Badge System Separation) can be lower priority within this phase or deferred if it proves too complex initially.
*   **Largest Effort / Later Phase:** Phase 4 (Major Refactoring of `generate_interface.py`). This should be tackled carefully, perhaps starting with CSS/JS separation (Tasks 4.1, 4.2) as they are less disruptive than introducing a templating engine (Task 4.3).

## 5. Next Steps

This implementation plan will be presented to the user for approval. Upon approval, refactoring will commence according to the prioritized phases.

