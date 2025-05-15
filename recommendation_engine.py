"""
Personalized Learning Recommendations Engine for EdPsych Connect

This module provides recommendation algorithms and services for generating
personalized learning recommendations based on student performance, preferences,
and learning patterns.
"""

import logging
import datetime
from typing import List, Dict, Any, Optional
import json
import random

# Setup logging
logger = logging.getLogger(__name__)

class RecommendationEngine:
    """
    Engine for generating personalized learning recommendations based on
    student data, preferences, and performance patterns.
    """
    
    def __init__(self):
        """Initialize the recommendation engine."""
        logger.info("Initializing Personalized Learning Recommendation Engine")
    
    def generate_recommendations(self, 
                               student_id: str, 
                               student_profile: Dict[str, Any],
                               completed_los: List[str],
                               in_progress_los: List[str],
                               learning_preferences: List[Dict[str, str]],
                               interests: List[str],
                               struggle_areas: List[str],
                               recent_activities: List[Dict[str, Any]],
                               available_content: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generate personalized learning recommendations for a student.
        
        Args:
            student_id: Unique identifier for the student
            student_profile: Student profile data
            completed_los: List of completed learning objective IDs
            in_progress_los: List of in-progress learning objective IDs
            learning_preferences: List of learning preferences (e.g., visual, auditory)
            interests: List of student interests
            struggle_areas: List of areas where student has shown difficulty
            recent_activities: List of recent learning activities and performance
            available_content: List of available learning content/activities
            
        Returns:
            List of recommended learning activities/content
        """
        logger.info(f"Generating recommendations for student {student_id}")
        
        recommendations = []
        
        # 1. Prioritize content for in-progress learning objectives
        in_progress_recommendations = self._recommend_for_in_progress_los(
            in_progress_los, 
            learning_preferences,
            available_content
        )
        recommendations.extend(in_progress_recommendations)
        
        # 2. Recommend content for struggle areas
        struggle_recommendations = self._recommend_for_struggle_areas(
            struggle_areas,
            learning_preferences,
            completed_los,
            available_content
        )
        recommendations.extend(struggle_recommendations)
        
        # 3. Recommend new content based on interests
        interest_recommendations = self._recommend_based_on_interests(
            interests,
            completed_los,
            in_progress_los,
            available_content
        )
        recommendations.extend(interest_recommendations)
        
        # 4. Recommend prerequisite content for upcoming learning objectives
        prerequisite_recommendations = self._recommend_prerequisites(
            completed_los,
            in_progress_los,
            available_content
        )
        recommendations.extend(prerequisite_recommendations)
        
        # 5. Add variety based on learning preferences
        variety_recommendations = self._add_variety_based_on_preferences(
            learning_preferences,
            completed_los,
            in_progress_los,
            available_content
        )
        recommendations.extend(variety_recommendations)
        
        # Deduplicate recommendations
        unique_recommendations = self._deduplicate_recommendations(recommendations)
        
        # Sort by relevance score
        sorted_recommendations = sorted(
            unique_recommendations, 
            key=lambda x: x.get('relevance_score', 0), 
            reverse=True
        )
        
        # Limit to top recommendations
        top_recommendations = sorted_recommendations[:10]
        
        # Add timestamp and metadata
        for rec in top_recommendations:
            rec['generated_at'] = datetime.datetime.utcnow().isoformat()
            rec['recommendation_type'] = rec.get('recommendation_type', 'general')
            
        logger.info(f"Generated {len(top_recommendations)} recommendations for student {student_id}")
        return top_recommendations
    
    def _recommend_for_in_progress_los(self, 
                                     in_progress_los: List[str],
                                     learning_preferences: List[Dict[str, str]],
                                     available_content: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate recommendations for in-progress learning objectives."""
        recommendations = []
        
        # Extract preference categories and values
        preference_dict = {pref['category']: pref['value'] for pref in learning_preferences}
        
        for lo_id in in_progress_los:
            # Find content for this learning objective
            matching_content = [
                content for content in available_content 
                if content.get('lo_id') == lo_id
            ]
            
            for content in matching_content:
                # Calculate relevance score based on learning preferences
                relevance_score = 0.9  # Base score for in-progress LOs
                
                # Boost score if content matches learning preferences
                content_format = content.get('format', '').lower()
                if content_format == 'video' and preference_dict.get('learning_style') == 'visual':
                    relevance_score += 0.1
                elif content_format == 'audio' and preference_dict.get('learning_style') == 'auditory':
                    relevance_score += 0.1
                elif content_format == 'interactive' and preference_dict.get('learning_style') == 'kinesthetic':
                    relevance_score += 0.1
                
                recommendations.append({
                    'content_id': content.get('id'),
                    'title': content.get('title'),
                    'description': content.get('description'),
                    'format': content.get('format'),
                    'lo_id': lo_id,
                    'relevance_score': relevance_score,
                    'recommendation_type': 'in_progress',
                    'reason': 'Continue your progress on this learning objective'
                })
        
        return recommendations
    
    def _recommend_for_struggle_areas(self,
                                    struggle_areas: List[str],
                                    learning_preferences: List[Dict[str, str]],
                                    completed_los: List[str],
                                    available_content: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate recommendations for areas where the student struggles."""
        recommendations = []
        
        # Extract preference categories and values
        preference_dict = {pref['category']: pref['value'] for pref in learning_preferences}
        
        for struggle in struggle_areas:
            # Find content that addresses this struggle area
            matching_content = [
                content for content in available_content 
                if struggle.lower() in content.get('tags', []) or 
                struggle.lower() in content.get('description', '').lower()
            ]
            
            # Filter out content for already completed LOs
            matching_content = [
                content for content in matching_content
                if content.get('lo_id') not in completed_los
            ]
            
            for content in matching_content:
                # Calculate relevance score
                relevance_score = 0.8  # Base score for struggle areas
                
                # Boost score if content matches learning preferences
                content_format = content.get('format', '').lower()
                if content_format == 'video' and preference_dict.get('learning_style') == 'visual':
                    relevance_score += 0.1
                elif content_format == 'audio' and preference_dict.get('learning_style') == 'auditory':
                    relevance_score += 0.1
                elif content_format == 'interactive' and preference_dict.get('learning_style') == 'kinesthetic':
                    relevance_score += 0.1
                
                # Boost score if content is specifically designed for remediation
                if 'remedial' in content.get('tags', []):
                    relevance_score += 0.1
                
                recommendations.append({
                    'content_id': content.get('id'),
                    'title': content.get('title'),
                    'description': content.get('description'),
                    'format': content.get('format'),
                    'lo_id': content.get('lo_id'),
                    'relevance_score': relevance_score,
                    'recommendation_type': 'struggle_area',
                    'reason': f'Extra practice for your challenge area: {struggle}'
                })
        
        return recommendations
    
    def _recommend_based_on_interests(self,
                                    interests: List[str],
                                    completed_los: List[str],
                                    in_progress_los: List[str],
                                    available_content: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate recommendations based on student interests."""
        recommendations = []
        
        for interest in interests:
            # Find content related to this interest
            matching_content = [
                content for content in available_content 
                if interest.lower() in content.get('tags', []) or 
                interest.lower() in content.get('description', '').lower() or
                interest.lower() in content.get('title', '').lower()
            ]
            
            # Filter out content for already completed or in-progress LOs
            matching_content = [
                content for content in matching_content
                if content.get('lo_id') not in completed_los and 
                content.get('lo_id') not in in_progress_los
            ]
            
            for content in matching_content:
                # Calculate relevance score
                relevance_score = 0.7  # Base score for interest-based recommendations
                
                # Boost score if interest appears in title (stronger match)
                if interest.lower() in content.get('title', '').lower():
                    relevance_score += 0.2
                
                recommendations.append({
                    'content_id': content.get('id'),
                    'title': content.get('title'),
                    'description': content.get('description'),
                    'format': content.get('format'),
                    'lo_id': content.get('lo_id'),
                    'relevance_score': relevance_score,
                    'recommendation_type': 'interest',
                    'reason': f'Matches your interest in {interest}'
                })
        
        return recommendations
    
    def _recommend_prerequisites(self,
                               completed_los: List[str],
                               in_progress_los: List[str],
                               available_content: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Recommend prerequisite content for upcoming learning objectives."""
        recommendations = []
        
        # This would require a curriculum map with prerequisite relationships
        # For now, we'll use a simplified approach
        
        # Find content that's not for completed or in-progress LOs
        new_content = [
            content for content in available_content
            if content.get('lo_id') not in completed_los and 
            content.get('lo_id') not in in_progress_los
        ]
        
        # Sort by curriculum sequence (if available)
        if all('sequence_order' in content for content in new_content):
            new_content.sort(key=lambda x: x.get('sequence_order', 999))
        
        # Take the first few items as "prerequisites"
        for content in new_content[:3]:
            recommendations.append({
                'content_id': content.get('id'),
                'title': content.get('title'),
                'description': content.get('description'),
                'format': content.get('format'),
                'lo_id': content.get('lo_id'),
                'relevance_score': 0.6,  # Lower priority than in-progress or struggle areas
                'recommendation_type': 'prerequisite',
                'reason': 'Recommended prerequisite for upcoming learning objectives'
            })
        
        return recommendations
    
    def _add_variety_based_on_preferences(self,
                                        learning_preferences: List[Dict[str, str]],
                                        completed_los: List[str],
                                        in_progress_los: List[str],
                                        available_content: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Add variety to recommendations based on learning preferences."""
        recommendations = []
        
        # Extract preference categories and values
        preference_dict = {pref['category']: pref['value'] for pref in learning_preferences}
        
        # Find content that matches preferred formats but isn't already recommended
        preferred_formats = []
        
        if preference_dict.get('learning_style') == 'visual':
            preferred_formats.extend(['video', 'infographic', 'diagram'])
        elif preference_dict.get('learning_style') == 'auditory':
            preferred_formats.extend(['audio', 'podcast', 'discussion'])
        elif preference_dict.get('learning_style') == 'kinesthetic':
            preferred_formats.extend(['interactive', 'game', 'simulation'])
        
        # Find content in preferred formats
        for format_type in preferred_formats:
            matching_content = [
                content for content in available_content
                if content.get('format', '').lower() == format_type.lower()
            ]
            
            # Filter out content for already completed LOs
            matching_content = [
                content for content in matching_content
                if content.get('lo_id') not in completed_los
            ]
            
            # Take a few items from each format
            for content in matching_content[:2]:
                recommendations.append({
                    'content_id': content.get('id'),
                    'title': content.get('title'),
                    'description': content.get('description'),
                    'format': content.get('format'),
                    'lo_id': content.get('lo_id'),
                    'relevance_score': 0.5,  # Lower priority than other recommendations
                    'recommendation_type': 'variety',
                    'reason': f'Matches your preferred learning style: {preference_dict.get("learning_style", "")}'
                })
        
        return recommendations
    
    def _deduplicate_recommendations(self, recommendations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate recommendations, keeping the highest relevance score."""
        unique_content_ids = set()
        unique_recommendations = []
        
        # Sort by relevance score (highest first)
        sorted_recommendations = sorted(
            recommendations, 
            key=lambda x: x.get('relevance_score', 0), 
            reverse=True
        )
        
        for rec in sorted_recommendations:
            content_id = rec.get('content_id')
            if content_id not in unique_content_ids:
                unique_content_ids.add(content_id)
                unique_recommendations.append(rec)
        
        return unique_recommendations


# Mock function to simulate getting available content
def get_mock_available_content() -> List[Dict[str, Any]]:
    """Return mock available content for testing."""
    return [
        {
            "id": "content_001",
            "title": "Reading Comprehension: Character Analysis",
            "description": "Learn how to analyze characters in stories by examining their actions, dialogue, and motivations.",
            "format": "interactive",
            "lo_id": "KS2_ENG_Y34_READ_INFERENCES_PREDICTIONS",
            "tags": ["reading", "comprehension", "character analysis"],
            "sequence_order": 1
        },
        {
            "id": "content_002",
            "title": "Making Predictions in Stories",
            "description": "Practice making predictions about what might happen next in stories based on details and clues.",
            "format": "video",
            "lo_id": "KS2_ENG_Y34_READ_INFERENCES_PREDICTIONS",
            "tags": ["reading", "predictions", "inference"],
            "sequence_order": 2
        },
        {
            "id": "content_003",
            "title": "Planning Your Writing: Brainstorming Ideas",
            "description": "Learn techniques for generating and organizing ideas before writing.",
            "format": "interactive",
            "lo_id": "KS2_ENG_Y34_WRITE_PLAN_DISCUSS_RECORD",
            "tags": ["writing", "planning", "brainstorming"],
            "sequence_order": 3
        },
        {
            "id": "content_004",
            "title": "Creating Engaging Characters",
            "description": "Learn how to create interesting and believable characters for your stories.",
            "format": "video",
            "lo_id": "KS2_ENG_Y34_WRITE_DRAFT_COMPOSE_ORGANISE",
            "tags": ["writing", "characters", "creative"],
            "sequence_order": 4
        },
        {
            "id": "content_005",
            "title": "Using Conjunctions to Connect Ideas",
            "description": "Learn how to use conjunctions like 'when', 'if', 'because', and 'although' to connect ideas in sentences.",
            "format": "interactive",
            "lo_id": "KS2_ENG_Y34_GRAM_CONJUNCTIONS_TENSES_TIMECAUSE",
            "tags": ["grammar", "conjunctions", "sentences"],
            "sequence_order": 5
        },
        {
            "id": "content_006",
            "title": "Mastering Apostrophes for Possession",
            "description": "Learn how to use apostrophes correctly to show possession with singular and plural nouns.",
            "format": "video",
            "lo_id": "KS2_ENG_Y34_PUNC_FRONTEDADV_POSSESSIVES_DIRECTSPEECH",
            "tags": ["punctuation", "apostrophes", "possession", "spelling"],
            "sequence_order": 6
        },
        {
            "id": "content_007",
            "title": "Understanding Prefixes and Suffixes",
            "description": "Learn how prefixes and suffixes change the meaning of root words.",
            "format": "game",
            "lo_id": "KS2_ENG_Y34_READ_ROOTS_PREFIXES_SUFFIXES",
            "tags": ["vocabulary", "prefixes", "suffixes", "word building"],
            "sequence_order": 7
        },
        {
            "id": "content_008",
            "title": "Homophones: Words That Sound the Same",
            "description": "Learn about words that sound the same but have different meanings and spellings.",
            "format": "interactive",
            "lo_id": "KS2_ENG_Y34_SPELL_PREFIXES_SUFFIXES_HOMOPHONES_MISSPELLT",
            "tags": ["spelling", "homophones", "vocabulary"],
            "sequence_order": 8
        },
        {
            "id": "content_009",
            "title": "Effective Group Discussions",
            "description": "Learn techniques for participating effectively in group discussions and debates.",
            "format": "video",
            "lo_id": "KS2_ENG_Y34_SPOKEN_LANG_INTEGRATED",
            "tags": ["speaking", "listening", "discussion", "debate"],
            "sequence_order": 9
        },
        {
            "id": "content_010",
            "title": "Extra Practice: Spelling Commonly Misspelled Words",
            "description": "Additional practice for commonly misspelled words with memory techniques.",
            "format": "interactive",
            "lo_id": "KS2_ENG_Y34_SPELL_PREFIXES_SUFFIXES_HOMOPHONES_MISSPELLT",
            "tags": ["spelling", "remedial", "practice", "memory techniques"],
            "sequence_order": 10
        }
    ]
