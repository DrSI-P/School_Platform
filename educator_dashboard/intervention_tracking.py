"""
Intervention Tracking System for the Educator Dashboard.

This module provides functionality for educators to create, monitor, and manage
intervention plans for students requiring additional support.
"""

import datetime
import json
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

class InterventionGoal(BaseModel):
    """Model representing a specific goal within an intervention plan."""
    id: str
    title: str
    description: str
    target_date: datetime.date
    success_criteria: str
    status: str = "not_started"  # not_started, in_progress, completed
    progress_notes: List[Dict[str, Any]] = []

class InterventionStrategy(BaseModel):
    """Model representing a specific strategy used in an intervention plan."""
    id: str
    title: str
    description: str
    frequency: str  # daily, weekly, etc.
    resources_needed: List[str] = []
    responsible_staff: List[str] = []
    effectiveness_rating: Optional[int] = None  # 1-5 scale

class InterventionPlan(BaseModel):
    """Model representing a complete intervention plan for a student."""
    id: str
    student_id: str
    title: str
    created_by: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    start_date: datetime.date
    end_date: Optional[datetime.date] = None
    status: str = "active"  # active, completed, cancelled
    areas_of_concern: List[str]
    goals: List[InterventionGoal]
    strategies: List[InterventionStrategy]
    review_dates: List[datetime.date]
    overall_notes: List[Dict[str, Any]] = []

class InterventionTrackingSystem:
    """
    System for managing student intervention plans.
    
    Provides functionality to create, update, and monitor intervention plans
    for students requiring additional support.
    """
    
    def __init__(self, persistence_manager):
        """
        Initialize the intervention tracking system.
        
        Args:
            persistence_manager: Database interface for storing intervention data
        """
        self.persistence_manager = persistence_manager
        self.logger = persistence_manager.logger
        self.logger.info("Intervention Tracking System initialized")
    
    def create_intervention_plan(self, plan_data: Dict[str, Any]) -> InterventionPlan:
        """
        Create a new intervention plan for a student.
        
        Args:
            plan_data: Dictionary containing intervention plan details
            
        Returns:
            The created intervention plan
        """
        # Generate a unique ID for the plan
        plan_id = f"int_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Set creation and update timestamps
        now = datetime.datetime.now()
        plan_data["id"] = plan_id
        plan_data["created_at"] = now
        plan_data["updated_at"] = now
        
        # Create the plan object
        plan = InterventionPlan(**plan_data)
        
        # Store in database
        self.persistence_manager.add_intervention_plan(plan.dict())
        
        self.logger.info(f"Created intervention plan {plan_id} for student {plan.student_id}")
        return plan
    
    def get_intervention_plan(self, plan_id: str) -> Optional[InterventionPlan]:
        """
        Retrieve an intervention plan by ID.
        
        Args:
            plan_id: ID of the intervention plan to retrieve
            
        Returns:
            The intervention plan if found, None otherwise
        """
        plan_data = self.persistence_manager.get_intervention_plan(plan_id)
        if not plan_data:
            return None
        
        return InterventionPlan(**plan_data)
    
    def get_student_intervention_plans(self, student_id: str) -> List[InterventionPlan]:
        """
        Retrieve all intervention plans for a specific student.
        
        Args:
            student_id: ID of the student
            
        Returns:
            List of intervention plans for the student
        """
        plans_data = self.persistence_manager.get_student_intervention_plans(student_id)
        return [InterventionPlan(**plan_data) for plan_data in plans_data]
    
    def update_intervention_plan(self, plan_id: str, updates: Dict[str, Any]) -> Optional[InterventionPlan]:
        """
        Update an existing intervention plan.
        
        Args:
            plan_id: ID of the plan to update
            updates: Dictionary of fields to update
            
        Returns:
            The updated intervention plan if successful, None otherwise
        """
        # Get the current plan
        plan_data = self.persistence_manager.get_intervention_plan(plan_id)
        if not plan_data:
            self.logger.warning(f"Attempted to update non-existent intervention plan: {plan_id}")
            return None
        
        # Update the plan data
        plan_data.update(updates)
        plan_data["updated_at"] = datetime.datetime.now()
        
        # Update in database
        self.persistence_manager.update_intervention_plan(plan_id, plan_data)
        
        self.logger.info(f"Updated intervention plan {plan_id}")
        return InterventionPlan(**plan_data)
    
    def add_goal_to_plan(self, plan_id: str, goal_data: Dict[str, Any]) -> Optional[InterventionPlan]:
        """
        Add a new goal to an intervention plan.
        
        Args:
            plan_id: ID of the intervention plan
            goal_data: Dictionary containing goal details
            
        Returns:
            The updated intervention plan if successful, None otherwise
        """
        # Get the current plan
        plan = self.get_intervention_plan(plan_id)
        if not plan:
            return None
        
        # Generate a unique ID for the goal
        goal_id = f"goal_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        goal_data["id"] = goal_id
        
        # Create the goal
        goal = InterventionGoal(**goal_data)
        
        # Add to plan and update
        plan_dict = plan.dict()
        plan_dict["goals"].append(goal.dict())
        plan_dict["updated_at"] = datetime.datetime.now()
        
        # Update in database
        self.persistence_manager.update_intervention_plan(plan_id, plan_dict)
        
        self.logger.info(f"Added goal {goal_id} to intervention plan {plan_id}")
        return InterventionPlan(**plan_dict)
    
    def update_goal_status(self, plan_id: str, goal_id: str, status: str, note: Optional[str] = None) -> Optional[InterventionPlan]:
        """
        Update the status of a goal in an intervention plan.
        
        Args:
            plan_id: ID of the intervention plan
            goal_id: ID of the goal to update
            status: New status for the goal
            note: Optional note about the status change
            
        Returns:
            The updated intervention plan if successful, None otherwise
        """
        # Get the current plan
        plan = self.get_intervention_plan(plan_id)
        if not plan:
            return None
        
        # Find the goal
        plan_dict = plan.dict()
        goal_found = False
        
        for i, goal in enumerate(plan_dict["goals"]):
            if goal["id"] == goal_id:
                plan_dict["goals"][i]["status"] = status
                
                # Add progress note if provided
                if note:
                    progress_note = {
                        "date": datetime.datetime.now().isoformat(),
                        "note": note,
                        "status_change": status
                    }
                    plan_dict["goals"][i]["progress_notes"].append(progress_note)
                
                goal_found = True
                break
        
        if not goal_found:
            self.logger.warning(f"Goal {goal_id} not found in plan {plan_id}")
            return None
        
        # Update timestamp
        plan_dict["updated_at"] = datetime.datetime.now()
        
        # Update in database
        self.persistence_manager.update_intervention_plan(plan_id, plan_dict)
        
        self.logger.info(f"Updated status of goal {goal_id} to {status} in plan {plan_id}")
        return InterventionPlan(**plan_dict)
    
    def add_strategy_to_plan(self, plan_id: str, strategy_data: Dict[str, Any]) -> Optional[InterventionPlan]:
        """
        Add a new strategy to an intervention plan.
        
        Args:
            plan_id: ID of the intervention plan
            strategy_data: Dictionary containing strategy details
            
        Returns:
            The updated intervention plan if successful, None otherwise
        """
        # Get the current plan
        plan = self.get_intervention_plan(plan_id)
        if not plan:
            return None
        
        # Generate a unique ID for the strategy
        strategy_id = f"strat_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        strategy_data["id"] = strategy_id
        
        # Create the strategy
        strategy = InterventionStrategy(**strategy_data)
        
        # Add to plan and update
        plan_dict = plan.dict()
        plan_dict["strategies"].append(strategy.dict())
        plan_dict["updated_at"] = datetime.datetime.now()
        
        # Update in database
        self.persistence_manager.update_intervention_plan(plan_id, plan_dict)
        
        self.logger.info(f"Added strategy {strategy_id} to intervention plan {plan_id}")
        return InterventionPlan(**plan_dict)
    
    def add_plan_note(self, plan_id: str, note: str) -> Optional[InterventionPlan]:
        """
        Add a general note to an intervention plan.
        
        Args:
            plan_id: ID of the intervention plan
            note: Note text to add
            
        Returns:
            The updated intervention plan if successful, None otherwise
        """
        # Get the current plan
        plan = self.get_intervention_plan(plan_id)
        if not plan:
            return None
        
        # Create note object
        note_obj = {
            "date": datetime.datetime.now().isoformat(),
            "note": note
        }
        
        # Add to plan and update
        plan_dict = plan.dict()
        plan_dict["overall_notes"].append(note_obj)
        plan_dict["updated_at"] = datetime.datetime.now()
        
        # Update in database
        self.persistence_manager.update_intervention_plan(plan_id, plan_dict)
        
        self.logger.info(f"Added note to intervention plan {plan_id}")
        return InterventionPlan(**plan_dict)
    
    def complete_intervention_plan(self, plan_id: str, completion_note: Optional[str] = None) -> Optional[InterventionPlan]:
        """
        Mark an intervention plan as completed.
        
        Args:
            plan_id: ID of the intervention plan
            completion_note: Optional note about plan completion
            
        Returns:
            The updated intervention plan if successful, None otherwise
        """
        # Get the current plan
        plan = self.get_intervention_plan(plan_id)
        if not plan:
            return None
        
        # Update plan status and end date
        updates = {
            "status": "completed",
            "end_date": datetime.date.today()
        }
        
        # Add completion note if provided
        if completion_note:
            note_obj = {
                "date": datetime.datetime.now().isoformat(),
                "note": completion_note,
                "type": "completion"
            }
            plan_dict = plan.dict()
            plan_dict["overall_notes"].append(note_obj)
            plan_dict.update(updates)
            
            # Update in database
            self.persistence_manager.update_intervention_plan(plan_id, plan_dict)
            
            self.logger.info(f"Marked intervention plan {plan_id} as completed with note")
            return InterventionPlan(**plan_dict)
        else:
            # Update without adding note
            return self.update_intervention_plan(plan_id, updates)
    
    def get_educator_intervention_plans(self, educator_id: str) -> List[InterventionPlan]:
        """
        Retrieve all intervention plans created by a specific educator.
        
        Args:
            educator_id: ID of the educator
            
        Returns:
            List of intervention plans created by the educator
        """
        plans_data = self.persistence_manager.get_educator_intervention_plans(educator_id)
        return [InterventionPlan(**plan_data) for plan_data in plans_data]
    
    def get_active_intervention_plans(self) -> List[InterventionPlan]:
        """
        Retrieve all active intervention plans.
        
        Returns:
            List of active intervention plans
        """
        plans_data = self.persistence_manager.get_active_intervention_plans()
        return [InterventionPlan(**plan_data) for plan_data in plans_data]
    
    def get_intervention_plans_by_area(self, area_of_concern: str) -> List[InterventionPlan]:
        """
        Retrieve intervention plans addressing a specific area of concern.
        
        Args:
            area_of_concern: Area of concern to filter by
            
        Returns:
            List of intervention plans addressing the specified area
        """
        plans_data = self.persistence_manager.get_intervention_plans_by_area(area_of_concern)
        return [InterventionPlan(**plan_data) for plan_data in plans_data]
    
    def generate_intervention_effectiveness_report(self, plan_id: str) -> Dict[str, Any]:
        """
        Generate a report on the effectiveness of an intervention plan.
        
        Args:
            plan_id: ID of the intervention plan
            
        Returns:
            Dictionary containing effectiveness metrics and insights
        """
        plan = self.get_intervention_plan(plan_id)
        if not plan:
            return {"error": "Plan not found"}
        
        # Calculate goal completion rate
        total_goals = len(plan.goals)
        completed_goals = sum(1 for goal in plan.goals if goal.status == "completed")
        completion_rate = completed_goals / total_goals if total_goals > 0 else 0
        
        # Calculate average strategy effectiveness
        strategy_ratings = [s.effectiveness_rating for s in plan.strategies if s.effectiveness_rating is not None]
        avg_effectiveness = sum(strategy_ratings) / len(strategy_ratings) if strategy_ratings else None
        
        # Calculate plan duration
        end_date = plan.end_date or datetime.date.today()
        duration_days = (end_date - plan.start_date).days
        
        # Compile report
        report = {
            "plan_id": plan.id,
            "student_id": plan.student_id,
            "title": plan.title,
            "status": plan.status,
            "duration_days": duration_days,
            "goal_completion_rate": completion_rate,
            "goals_total": total_goals,
            "goals_completed": completed_goals,
            "average_strategy_effectiveness": avg_effectiveness,
            "strategies_with_ratings": len(strategy_ratings),
            "strategies_total": len(plan.strategies),
            "generated_at": datetime.datetime.now().isoformat()
        }
        
        self.logger.info(f"Generated effectiveness report for plan {plan_id}")
        return report
