# Educator Dashboard API Design

## 1. Overview

This document outlines the API design for the Educator Dashboard backend. The API will provide the necessary endpoints to retrieve data about students, classes, learning progress, and other metrics needed by the dashboard frontend.

## 2. API Endpoints

### 2.1. Authentication

```
POST /api/auth/login
- Request: { "username": string, "password": string }
- Response: { "token": string, "user": EducatorObject }
```

```
POST /api/auth/logout
- Request: { "token": string }
- Response: { "success": boolean }
```

### 2.2. Dashboard Overview

```
GET /api/dashboard/overview
- Query Parameters: 
  - educator_id: string
- Response: {
    "active_students_count": integer,
    "average_los_completed": float,
    "students_requiring_attention": integer,
    "recent_achievements": [
      {
        "student_id": string,
        "student_name": string,
        "achievement_type": string,
        "achievement_description": string,
        "timestamp": datetime
      }
    ],
    "alerts": [
      {
        "alert_type": string,
        "alert_message": string,
        "related_student_id": string,
        "timestamp": datetime
      }
    ]
  }
```

### 2.3. Student Management

```
GET /api/students
- Query Parameters:
  - educator_id: string
  - search: string (optional)
  - sort_by: string (optional)
  - sort_order: string (optional)
  - page: integer (optional)
  - limit: integer (optional)
- Response: {
    "total_count": integer,
    "students": [
      {
        "student_id": string,
        "name": string,
        "year_group": string,
        "last_active": datetime,
        "overall_progress": float,
        "requires_attention": boolean,
        "attention_reason": string
      }
    ]
  }
```

```
GET /api/students/{student_id}
- Response: {
    "student_id": string,
    "name": string,
    "year_group": string,
    "last_active": datetime,
    "learning_preferences": {
      "preference_category": string,
      "value": string
    },
    "interests": [string],
    "struggle_areas": [string],
    "cognitive_metrics": {
      "task_name": {
        "metric_name": value
      }
    },
    "completed_los": [string],
    "current_lo": string,
    "badges_earned": [
      {
        "badge_id": string,
        "badge_name": string,
        "description": string,
        "date_earned": datetime
      }
    ],
    "activity_history": [
      {
        "activity_id": string,
        "lo_id": string,
        "activity_type": string,
        "score": float,
        "completed": boolean,
        "timestamp": datetime
      }
    ]
  }
```

```
POST /api/students/{student_id}/notes
- Request: {
    "note_text": string
  }
- Response: {
    "note_id": string,
    "note_text": string,
    "created_at": datetime
  }
```

```
GET /api/students/{student_id}/notes
- Response: {
    "notes": [
      {
        "note_id": string,
        "note_text": string,
        "created_at": datetime,
        "updated_at": datetime
      }
    ]
  }
```

### 2.4. Curriculum Progress

```
GET /api/curriculum/progress
- Query Parameters:
  - educator_id: string
  - subject: string (optional)
  - year_group: string (optional)
- Response: {
    "curriculum_slices": [
      {
        "slice_id": string,
        "slice_name": string,
        "subject": string,
        "year_group": string,
        "learning_objectives": [
          {
            "lo_id": string,
            "lo_description": string,
            "completion_rate": float,
            "students_completed": integer,
            "students_in_progress": integer,
            "students_not_started": integer,
            "average_time_to_complete": float
          }
        ]
      }
    ]
  }
```

```
GET /api/curriculum/los/{lo_id}/students
- Response: {
    "lo_id": string,
    "lo_description": string,
    "students_completed": [
      {
        "student_id": string,
        "name": string,
        "completed_at": datetime
      }
    ],
    "students_in_progress": [
      {
        "student_id": string,
        "name": string,
        "started_at": datetime
      }
    ],
    "students_not_started": [
      {
        "student_id": string,
        "name": string
      }
    ]
  }
```

```
GET /api/curriculum/gaps
- Query Parameters:
  - educator_id: string
- Response: {
    "common_struggle_los": [
      {
        "lo_id": string,
        "lo_description": string,
        "struggle_count": integer,
        "prerequisite_los": [
          {
            "lo_id": string,
            "lo_description": string,
            "completion_rate": float
          }
        ]
      }
    ]
  }
```

### 2.5. Activity Engagement

```
GET /api/activities/engagement
- Query Parameters:
  - educator_id: string
  - subject: string (optional)
  - year_group: string (optional)
- Response: {
    "activities": [
      {
        "activity_id": string,
        "activity_name": string,
        "activity_type": string,
        "lo_id": string,
        "usage_count": integer,
        "average_score": float,
        "completion_rate": float
      }
    ]
  }
```

### 2.6. Reporting

```
GET /api/reports/student/{student_id}
- Query Parameters:
  - format: string (pdf, json)
- Response: File or JSON object with comprehensive student report
```

```
GET /api/reports/class
- Query Parameters:
  - educator_id: string
  - format: string (pdf, json)
- Response: File or JSON object with comprehensive class report
```

## 3. Data Models

### 3.1. Educator

```python
class Educator:
    id: str
    name: str
    email: str
    role: str
    classes: List[str]
```

### 3.2. Student

```python
class Student:
    id: str
    name: str
    year_group: str
    last_active: datetime
    learning_preferences: Dict[str, str]
    interests: List[str]
    struggle_areas: List[str]
    cognitive_metrics: Dict[str, Dict[str, Any]]
    completed_los: List[str]
    current_lo: Optional[str]
    badges_earned: Dict[str, Dict[str, Any]]
    activity_history: List[Dict[str, Any]]
```

### 3.3. Note

```python
class Note:
    id: str
    student_id: str
    educator_id: str
    text: str
    created_at: datetime
    updated_at: datetime
```

### 3.4. LearningObjective

```python
class LearningObjective:
    id: str
    description: str
    subject: str
    year_group: str
    prerequisites: List[str]
```

### 3.5. Activity

```python
class Activity:
    id: str
    name: str
    type: str
    lo_id: str
    difficulty: str
```

### 3.6. ActivityAttempt

```python
class ActivityAttempt:
    id: str
    student_id: str
    activity_id: str
    lo_id: str
    score: Optional[float]
    completed: bool
    timestamp: datetime
    details: Dict[str, Any]
```

## 4. Implementation Approach

The API will be implemented using Flask, a lightweight web framework for Python. The implementation will follow these steps:

1. Create a new module `educator_dashboard` with the following structure:
   - `__init__.py`
   - `api.py` - API endpoint definitions
   - `models.py` - Data models
   - `services.py` - Business logic
   - `utils.py` - Utility functions

2. Implement authentication using JWT (JSON Web Tokens) for secure access.

3. Create database models and queries to retrieve the necessary data from the SQLite database.

4. Implement the API endpoints as defined above.

5. Add comprehensive error handling and logging.

6. Create a simple frontend to test the API endpoints.

## 5. Security Considerations

- All API endpoints will require authentication.
- Sensitive data will be encrypted in transit using HTTPS.
- Input validation will be performed on all API endpoints.
- Rate limiting will be implemented to prevent abuse.
- Proper error handling will be implemented to avoid leaking sensitive information.

## 6. Future Enhancements

- Real-time updates using WebSockets.
- More advanced analytics and reporting capabilities.
- Integration with external assessment tools.
- Support for parent access to student data (with appropriate permissions).
