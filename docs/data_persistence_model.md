# Data Persistence Model for EdPsych Connect DALA

## Overview

This document outlines a simple data persistence model for the EdPsych Connect DALA platform, focusing on learner profiles and progress tracking. The model is designed to be lightweight yet extensible, allowing for future growth as the platform evolves.

## Design Goals

1. **Simplicity**: Easy to implement and maintain
2. **Flexibility**: Adaptable to changing requirements
3. **Scalability**: Capable of growing with the user base
4. **Integrity**: Maintains data consistency and reliability
5. **Accessibility**: Provides straightforward access patterns for common operations

## Data Storage Approach

For the initial implementation, we recommend a **file-based JSON approach** with the following structure:

```
/data/
  /learners/
    {learner_id}.json       # Individual learner profile files
  /curriculum/
    curriculum_slices.json  # Curriculum definitions (already implemented)
    learning_content.json   # Learning content (already implemented)
  /analytics/
    {learner_id}_activity.json  # Optional: Activity logs for analytics
```

### Rationale for File-based Approach

1. **Low Barrier to Entry**: No database setup required
2. **Human-Readable**: JSON files can be inspected and modified directly if needed
3. **Portability**: Easy to backup, transfer, or version control
4. **Simplicity**: Aligns with the current approach for curriculum data

## Core Data Models

### 1. Learner Profile (`{learner_id}.json`)

```json
{
  "learner_id": "string",
  "personal_info": {
    "name": "string",
    "year_group": "string",
    "created_at": "ISO-8601 timestamp",
    "last_active": "ISO-8601 timestamp"
  },
  "learning_preferences": {
    "visual_task_1": "string",
    "textual_task_1": "string",
    "story_weaver": "string",
    "mind_mapper": "string",
    "additional_preferences": {}
  },
  "interests": ["string", "string", ...],
  "struggle_areas": ["string", "string", ...],
  "learning_goals": ["string", "string", ...],
  "completed_los": ["lo_id_1", "lo_id_2", ...],
  "current_learning_objective_id": "string or null",
  "progress": {
    "lo_id_1": {
      "status": "enum: not_started|in_progress|completed",
      "started_at": "ISO-8601 timestamp",
      "completed_at": "ISO-8601 timestamp or null",
      "activities_completed": ["activity_id_1", "activity_id_2", ...],
      "assessment_results": {},
      "notes": "string"
    },
    "lo_id_2": { ... }
  },
  "earned_badges_data": {
    "badge_id_1": {
      "earned_date": "YYYY-MM-DD",
      "details": "string"
    },
    "badge_id_2": { ... }
  },
  "game_scores": {
    "star_collector": {
      "high_score": "number",
      "last_played": "ISO-8601 timestamp",
      "total_plays": "number"
    },
    "other_games": { ... }
  },
  "pathway_history": [
    {
      "generated_at": "ISO-8601 timestamp",
      "learning_objectives": ["lo_id_1", "lo_id_2", ...],
      "completed": "boolean"
    }
  ],
  "metadata": {
    "version": "string",
    "last_updated": "ISO-8601 timestamp"
  }
}
```

### 2. Activity Log (`{learner_id}_activity.json`) - Optional for Analytics

```json
{
  "learner_id": "string",
  "activities": [
    {
      "timestamp": "ISO-8601 timestamp",
      "action": "string",
      "details": {},
      "session_id": "string"
    }
  ]
}
```

## Data Access Patterns

### LearnerProfilePersistence Class

```python
class LearnerProfilePersistence:
    """Handles persistence operations for learner profiles."""
    
    def __init__(self, data_dir: str = "/path/to/data"):
        """Initialize with path to data directory."""
        self.learners_dir = os.path.join(data_dir, "learners")
        os.makedirs(self.learners_dir, exist_ok=True)
    
    def save_learner_profile(self, profile: LearnerProfile) -> bool:
        """Serialize and save a learner profile to JSON."""
        # Implementation
        
    def load_learner_profile(self, learner_id: str) -> Optional[LearnerProfile]:
        """Load a learner profile from JSON."""
        # Implementation
        
    def update_learner_progress(self, learner_id: str, lo_id: str, status: str, **kwargs) -> bool:
        """Update progress for a specific learning objective."""
        # Implementation
        
    def record_activity(self, learner_id: str, action: str, details: Dict[str, Any]) -> bool:
        """Record a learner activity for analytics (optional)."""
        # Implementation
        
    def list_learners(self) -> List[str]:
        """List all learner IDs with saved profiles."""
        # Implementation
        
    def backup_learner_data(self, learner_id: str, backup_dir: str) -> bool:
        """Create a backup of a learner's data."""
        # Implementation
```

## Integration with Existing Code

### Modifications to LearnerProfile Class

```python
class LearnerProfile:
    # Existing implementation...
    
    def save(self) -> bool:
        """Save the current state of the learner profile."""
        persistence = LearnerProfilePersistence()
        return persistence.save_learner_profile(self)
    
    @classmethod
    def load(cls, learner_id: str) -> Optional['LearnerProfile']:
        """Load a learner profile from persistent storage."""
        persistence = LearnerProfilePersistence()
        return persistence.load_learner_profile(learner_id)
    
    # Additional methods...
```

### Usage in generate_interface.py

```python
# Example usage in generate_interface.py
def generate_html_interface(student_id: str = DEFAULT_STUDENT_ID, output_filename: str = DEFAULT_OUTPUT_HTML_FILENAME) -> str:
    """Generate an HTML interface for the student."""
    
    # Try to load existing profile, or create new one if not found
    learner_profile = LearnerProfile.load(student_id)
    if not learner_profile:
        learner_profile = LearnerProfile(student_id=student_id)
        # Initialize with default values...
    
    # Use the profile as before...
    
    # Save changes before returning
    learner_profile.save()
    
    # Rest of the implementation...
```

## Future Enhancements

1. **Database Migration**: As the platform grows, consider migrating to a proper database system (SQLite for simplicity, or MongoDB/PostgreSQL for more complex needs)
2. **User Authentication**: Integrate with an authentication system for secure access
3. **Multi-device Sync**: Enable synchronization across multiple devices
4. **Backup and Recovery**: Implement automated backup and recovery procedures
5. **Data Versioning**: Track changes to learner profiles over time
6. **Performance Optimization**: Implement caching and other performance enhancements for larger datasets

## Implementation Plan

1. **Phase 1**: Implement the basic file-based persistence model
   - Create the LearnerProfilePersistence class
   - Modify LearnerProfile to use persistence
   - Update generate_interface.py to load/save profiles

2. **Phase 2**: Add analytics and activity logging
   - Implement activity recording
   - Create basic analytics views

3. **Phase 3**: Enhance with additional features
   - Implement backup/recovery
   - Add data versioning
   - Consider database migration if needed

## Conclusion

This simple data persistence model provides a solid foundation for storing and retrieving learner profiles and progress data in the EdPsych Connect DALA platform. The file-based JSON approach offers simplicity and flexibility while allowing for future growth and enhancement as the platform evolves.
