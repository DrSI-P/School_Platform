# educator_dashboard/utils.py
"""
Utility functions for the Educator Dashboard module.
"""

import datetime
from typing import Optional, Any, List, Dict

def format_datetime_for_display(dt: Optional[datetime.datetime]) -> Optional[str]:
    """Formats a datetime object into a user-friendly string."""
    if dt:
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    return None

def format_date_for_display(d: Optional[datetime.date]) -> Optional[str]:
    """Formats a date object into a user-friendly string."""
    if d:
        return d.strftime("%Y-%m-%d")
    return None

def calculate_percentage(part: float, whole: float) -> Optional[float]:
    """Calculates percentage, returns None if whole is zero."""
    if whole > 0:
        return round((part / whole) * 100, 1)
    return None

def get_mock_student_name(student_id: str) -> str:
    """Generates a mock student name based on ID."""
    parts = student_id.split("_")
    if len(parts) > 1:
        return f"Student {parts[-1].capitalize()}"
    return f"Student {student_id.capitalize()}"

# Example: Helper for pagination calculations if needed more broadly
class PaginationHelper:
    def __init__(self, items: List[Any], page: int, limit: int):
        self.items = items
        self.page = page
        self.limit = limit
        self.total_count = len(items)

    def get_paginated_items(self) -> List[Any]:
        start_index = (self.page - 1) * self.limit
        end_index = start_index + self.limit
        return self.items[start_index:end_index]

    def get_response_dict(self) -> Dict[str, Any]:
        return {
            "total_count": self.total_count,
            "items": self.get_paginated_items(),
            "page": self.page,
            "limit": self.limit,
            "total_pages": (self.total_count + self.limit - 1) // self.limit if self.limit > 0 else 0
        }

# Add other utility functions as needed, for example:
# - Data validation helpers (beyond Pydantic)
# - Complex data transformation functions not fitting in services
# - Helpers for interacting with external services (if any)


