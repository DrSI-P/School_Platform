# Persistence Layer Documentation

## 1. Overview

The persistence layer for the EdPsych Connect DALA prototype is responsible for storing and retrieving learner data, ensuring that information about student profiles, preferences, progress, and achievements is maintained across sessions. It utilizes a SQLite database for simplicity and ease of integration within the Python environment.

This document outlines the database schema, key modules involved, integration points with other parts of the application, and basic usage instructions.

## 2. Database Schema

The database, `edpsych_connect_dala.db`, is located in the `/database` directory and consists of the following tables:

*   **`learner_profiles`**: Stores core information about each learner.
    *   `id` (TEXT, Primary Key): Unique student identifier.
    *   `created_at` (TIMESTAMP): Timestamp of profile creation.
    *   `last_updated_at` (TIMESTAMP): Timestamp of the last profile update.

*   **`preferences`**: Stores learner preferences (e.g., learning style).
    *   `id` (INTEGER, Primary Key, Autoincrement)
    *   `learner_id` (TEXT, ForeignKey to `learner_profiles.id`): The student this preference belongs to.
    *   `category` (TEXT): The category of the preference (e.g., "visual_preference_task_1").
    *   `value` (TEXT): The value of the preference (e.g., "visual").
    *   `timestamp` (TIMESTAMP): When the preference was recorded/updated.
    *   UNIQUE (`learner_id`, `category`)

*   **`interests`**: Stores learner interests.
    *   `id` (INTEGER, Primary Key, Autoincrement)
    *   `learner_id` (TEXT, ForeignKey to `learner_profiles.id`)
    *   `interest_name` (TEXT): The name of the interest (e.g., "Space Exploration").
    *   `timestamp` (TIMESTAMP)
    *   UNIQUE (`learner_id`, `interest_name`)

*   **`struggles`**: Stores learner-reported struggle areas.
    *   `id` (INTEGER, Primary Key, Autoincrement)
    *   `learner_id` (TEXT, ForeignKey to `learner_profiles.id`)
    *   `struggle_description` (TEXT): Description of the struggle area.
    *   `timestamp` (TIMESTAMP)
    *   UNIQUE (`learner_id`, `struggle_description`)

*   **`cognitive_metrics`**: Stores metrics from diagnostic tasks.
    *   `id` (INTEGER, Primary Key, Autoincrement)
    *   `learner_id` (TEXT, ForeignKey to `learner_profiles.id`)
    *   `task_name` (TEXT): Name of the diagnostic task (e.g., "story_weaver").
    *   `metric_details` (JSON): A JSON object storing various metrics for the task (e.g., `{"accuracy": 0.8, "attempts": 1}`).
    *   `timestamp` (TIMESTAMP)
    *   UNIQUE (`learner_id`, `task_name`)

*   **`learning_objective_progress`**: Tracks progress on learning objectives (LOs).
    *   `id` (INTEGER, Primary Key, Autoincrement)
    *   `learner_id` (TEXT, ForeignKey to `learner_profiles.id`)
    *   `lo_id` (TEXT): Unique identifier for the learning objective.
    *   `status` (TEXT): Current status (e.g., "in_progress", "completed").
    *   `started_at` (TIMESTAMP): When the LO was started.
    *   `completed_at` (TIMESTAMP, Nullable): When the LO was completed.
    *   `score` (FLOAT, Nullable): Score achieved on the LO, if applicable.
    *   `details` (JSON, Nullable): Additional details about the progress.
    *   UNIQUE (`learner_id`, `lo_id`)

*   **`badges`**: Stores badges earned by learners.
    *   `id` (INTEGER, Primary Key, Autoincrement)
    *   `learner_id` (TEXT, ForeignKey to `learner_profiles.id`)
    *   `badge_id` (TEXT): Unique identifier for the badge (e.g., "trailblazer").
    *   `badge_name` (TEXT): Display name of the badge.
    *   `earned_date` (DATE): Date the badge was earned.
    *   `details` (TEXT, Nullable): Additional details or description of the earned badge instance.
    *   UNIQUE (`learner_id`, `badge_id`)

*   **`activity_attempts`**: Records attempts at specific learning activities.
    *   `id` (INTEGER, Primary Key, Autoincrement)
    *   `learner_id` (TEXT, ForeignKey to `learner_profiles.id`)
    *   `lo_id` (TEXT): The LO this activity belongs to.
    *   `activity_id` (TEXT): Unique identifier for the activity.
    *   `activity_type` (TEXT): Type of activity (e.g., "quiz", "game").
    *   `attempt_timestamp` (TIMESTAMP): When the attempt was made.
    *   `score` (FLOAT, Nullable): Score achieved in the attempt.
    *   `completed` (BOOLEAN): Whether the activity was completed in this attempt.
    *   `attempt_details` (JSON, Nullable): Additional details about the attempt (e.g., answers, time taken).

## 3. Key Modules

*   **`database_models.py`**: Defines the SQLAlchemy ORM models that map to the database tables described above. Each class in this file (e.g., `DBLearnerProfile`, `DBPreference`) corresponds to a table and defines its columns and relationships.

*   **`database_setup.py`**: Contains the logic to initialize the database. It uses SQLAlchemy to:
    *   Create an engine connected to the `edpsych_connect_dala.db` SQLite file.
    *   Create all tables defined in `database_models.py` if they don_t already exist.
    *   This script should be run once to set up the database structure.

*   **`persistence_manager.py`**: This is the core module for interacting with the database. It provides functions for all CRUD (Create, Read, Update, Delete) operations on the learner data. It abstracts the direct database interactions (SQLAlchemy session management, queries) from the rest of the application.
    *   **Key Functions**: Includes functions like `create_learner_profile`, `get_full_learner_profile_data`, `add_or_update_preference`, `add_interest`, `add_struggle`, `add_or_update_cognitive_metric`, `add_or_update_lo_progress`, `add_badge_record`, `add_activity_attempt`, and various getter functions.
    *   **Data Transfer Objects (DTOs)**: Uses Pydantic models (e.g., `PreferenceData`, `InterestData`) for passing data to and from its functions, ensuring type safety and clear data contracts.

## 4. Integration Points

*   **`hlp_module.py` (`LearnerProfile` class)**:
    *   The `LearnerProfile` class is the primary consumer of the `persistence_manager.py`.
    *   **Initialization (`__init__`)**: When a `LearnerProfile` object is created, it can load existing data from the database using `db_get_full_learner_profile_data` or create a new profile entry using `db_create_learner_profile`.
    *   **Data Modification Methods**: Methods like `update_preference`, `add_interest`, `add_struggle_area`, `add_cognitive_metric`, `mark_lo_completed`, `add_badge`, and `record_activity_attempt` now call corresponding functions in `persistence_manager.py` to persist changes to the database immediately after updating the in-memory state (if `_persistence_enabled` is True).
    *   **`save()` method**: Provides an explicit way to synchronize the entire in-memory profile to the database using the `_sync_to_database` internal method, which calls various `persistence_manager.py` functions.
    *   **Loading**: The `_load_from_database` method populates the `LearnerProfile` instance with data fetched via `persistence_manager.py`.

*   **`generate_interface.py`**: 
    *   This script initializes a `LearnerProfile` instance (which now handles its own loading from/saving to the DB).
    *   Crucially, before generating the HTML interface, it calls `learner_profile.save()` to ensure any modifications made during the HLP assessment simulation or pathway generation are persisted to the database.
    *   It still uses `PREDEFINED_INTERESTS` and `PREDEFINED_STRUGGLE_AREAS` (now restored in `hlp_module.py`) for the simulation of the HLP assessment part.

## 5. Usage Examples (Conceptual)

**Creating/Loading a Learner Profile:**
```python
from hlp_module import get_or_create_learner_profile

student_id = "student123"
# This will load from DB if exists, or create a new profile in DB and in memory
learner_profile = get_or_create_learner_profile(student_id)
```

**Adding an Interest:**
```python
# (Assuming learner_profile is an instance of LearnerProfile)
learner_profile.add_interest("Robotics")
# The change is automatically persisted to the database by the add_interest method.
```

**Marking an LO as Completed:**
```python
learner_profile.mark_lo_completed("MATH_LO_001")
# This also persists the change.
```

**Explicitly Saving All Changes:**
```python
# If multiple in-memory changes were made with persistence temporarily off, or for assurance:
learner_profile.save()
```

## 6. Refinements and Future Considerations

*   **Database Migrations**: For schema changes in the future, a proper database migration tool (like Alembic for SQLAlchemy) should be implemented to manage schema evolution without data loss.
*   **Error Handling**: Enhance error handling in `persistence_manager.py` for database connection issues, query failures, etc.
*   **Transaction Management**: For complex operations involving multiple database writes, ensure proper transaction management (commit/rollback) to maintain data integrity.
*   **Performance Optimization**: For larger datasets, review query performance and consider adding database indexes to frequently queried columns.
*   **Asynchronous Operations**: For a web application context, consider making database operations asynchronous to avoid blocking the main thread.
*   **Configuration**: Database connection details (e.g., file path) could be moved to `config.py` for better configurability.
*   **Security**: For sensitive data, consider encryption at rest if required, though SQLite itself offers some basic protection via file permissions.
*   **Backup Strategy**: Implement a strategy for backing up the SQLite database file regularly.

This persistence layer provides a solid foundation for managing learner data in the DALA prototype. Further refinements can be made as the platform evolves and scales.

