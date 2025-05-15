# DALA Stage 2: DCW-APG - Difficulty Progression Logic Design

This document outlines the design for implementing logic for smoother difficulty progression within the Dynamic Curriculum Weaving & Adaptive Pathway Generation (DCW-APG) module (`dcw_apg_module.py`) for the DALA prototype.

## 1. Goals

*   Ensure that learning activities are presented to the student in an order that reflects a gradual increase in difficulty, where appropriate.
*   Prevent students from encountering overly challenging content too early within a topic or for a specific learning objective (LO).
*   Enhance learner engagement and reduce frustration by providing a scaffolded learning experience.
*   Allow for selection of easier activities first when multiple options are available for an LO.

## 2. Data Structure Considerations

### 2.1. Learning Content (`curriculum_content_module.py`)

Each learning content item in `LEARNING_CONTENT_SET` already has a `"difficulty"` field (e.g., "easy", "medium", "hard"). This existing field will be central to the difficulty progression logic.

*   **`difficulty`**: A string indicating the perceived difficulty of the content. We will assume an ordinal relationship: "easy" < "medium" < "hard".

**Example Content Item (existing structure):**
```python
{
    "content_id": "CONT_MD_001",
    "title": "Times Tables Practice Game (Up to 12x12)",
    "type": "game",
    "learning_objectives_covered": ["Y4MD_LO1"],
    "target_preferences": ["kinesthetic", "visual"],
    "difficulty": "medium", # This field is key
    "url_path": "/content/games/timestables_y4.html"
}
```

### 2.2. Learning Objectives (LOs) (`curriculum_content_module.py`)

Learning Objectives themselves might not have an inherent difficulty level in the same way content does, as their difficulty is realized through the activities associated with them. However, the sequence of LOs (handled by prerequisite logic) can also contribute to overall difficulty progression.

For this task, the focus is on selecting content *within* an LO or for closely related LOs in a sequence.

### 2.3. Learner Profile (`hlp_module.py`)

The `LearnerProfile` could potentially track a student's current performance or comfort level with certain difficulties. For Stage 2, this will be kept simple:

*   **Implicit Tracking**: The system might implicitly assume that if a student successfully completes content, they might be ready for slightly more challenging content next.
*   **No Explicit Difficulty Preference Yet**: We are not yet capturing an explicit "preferred difficulty" from the student, but this could be a future enhancement.

## 3. PathwayGenerator Modifications (`dcw_apg_module.py`)

The `PathwayGenerator` will be modified to incorporate difficulty progression when selecting content for a given LO.

### 3.1. Content Selection within an LO

When `generate_pathway_with_prerequisites` (or a similar method) selects an LO and then needs to choose content for that LO from `available_content_for_lo`:

1.  **Sort by Difficulty**: If multiple content items are available for an LO, sort them based on their `difficulty` field. The order should be "easy", then "medium", then "hard".
2.  **Initial Selection**: Select the easiest available content item that also matches other criteria (e.g., learner preferences, if applicable and if multiple easy options exist).
3.  **Progression (Conceptual for now)**: If a student revisits an LO or if the pathway includes multiple activities for the same LO over time (not fully implemented yet), the system could then select the next difficulty level.
    *   For Stage 2, the primary implementation will be to pick the *easiest suitable* content when an LO is first introduced in the pathway.

**Difficulty Mapping for Sorting:**
To facilitate sorting, a simple mapping can be used:
```python
DIFFICULTY_ORDER = {"easy": 1, "medium": 2, "hard": 3}
```
Content items can then be sorted using `key=lambda x: DIFFICULTY_ORDER.get(x.get("difficulty"), 99)` (99 for unknown/unspecified difficulty, placing it last).

### 3.2. Conceptual Flow for Content Selection with Difficulty Progression:

```python
# Inside PathwayGenerator, when selecting content for a specific LO

# available_content_for_lo = self.content_store.get_content_for_lo(lo['id'])

if not available_content_for_lo:
    # ... handle no content ...
    return None

# Sort available content by difficulty (easy -> medium -> hard)
DIFFICULTY_ORDER = {"easy": 1, "medium": 2, "hard": 3, "default": 99}
sorted_content = sorted(
    available_content_for_lo,
    key=lambda c: DIFFICULTY_ORDER.get(c.get("difficulty", "default").lower(), DIFFICULTY_ORDER["default"])
)

preferred_content = None

# Attempt to match preferences, starting with the easiest content
# This is a simplified preference matching; could be more complex
if self.learner_profile.learning_preferences.get("visual_task_1") == "visual":
    for content_item in sorted_content:
        if "visual" in content_item.get("target_preferences", []):
            preferred_content = content_item
            break

if not preferred_content and self.learner_profile.learning_preferences.get("textual_task_1") == "detailed_text":
    for content_item in sorted_content:
        if "textual" in content_item.get("target_preferences", []):
            preferred_content = content_item
            break

# If no preference match or no preferences set, pick the absolute easiest from the sorted list
if not preferred_content and sorted_content:
    preferred_content = sorted_content[0]

# If still no content (e.g., all lists were empty), handle appropriately
if not preferred_content and available_content_for_lo: # Fallback if sorting/preference somehow failed
    preferred_content = available_content_for_lo[0]

# return preferred_content
```

### 3.3. Difficulty Progression Across Topics (More Conceptual for Stage 2)

*   **Topic-Level Difficulty**: While individual content has difficulty, entire topics or LOs could also be implicitly ordered by difficulty (e.g., foundational topics before advanced ones). This is largely handled by the prerequisite system.
*   **Inter-LO Difficulty**: If the pathway generator is selecting the *next LO* (not just content for a current LO), and multiple LOs are eligible (prerequisites met), it could potentially consider the typical difficulty of content associated with those LOs. For Stage 2, this is likely too complex. The primary focus will be on content selection *for* a chosen LO.

## 4. Assumptions for Stage 2 Implementation

*   **Reliable Difficulty Tags**: The `difficulty` tags on content items are assumed to be meaningful and consistently applied.
*   **Focus on Content Selection**: The primary implementation will affect how content is chosen for an LO, not necessarily the order of LOs themselves beyond prerequisite handling.
*   **Simple Progression**: The progression will be to select the easiest available suitable content. More complex adaptive difficulty based on ongoing performance is a future enhancement.

## 5. Testing and Validation

*   Create test LOs that have multiple associated content items with varying difficulties ("easy", "medium", "hard").
*   Simulate different `LearnerProfile` states (e.g., with and without specific learning preferences).
*   Verify that the `PathwayGenerator` selects the easiest content item first when no strong preferences dictate otherwise.
*   Verify that if preferences are set, the easiest content matching that preference is chosen.
*   Test edge cases: LOs with only hard content, LOs with no difficulty tags on content.

This design aims to introduce a foundational layer of difficulty progression, making the learning pathways feel more considered and less random in terms of challenge. Future stages can build upon this by incorporating more dynamic adjustments based on real-time student performance data.
