# DALA Stage 2: DCW-APG - Prerequisite Logic Design

This document outlines the design for implementing basic prerequisite logic within the Dynamic Curriculum Weaving & Adaptive Pathway Generation (DCW-APG) module (`dcw_apg_module.py`) for the DALA prototype.

## 1. Goals

*   Ensure that learning objectives (LOs) are presented to the student in a logical order, respecting foundational knowledge requirements.
*   Prevent students from encountering advanced topics before mastering the necessary prerequisites.
*   Allow for more coherent and effective learning pathways.

## 2. Data Structure Modifications

### 2.1. Learning Objectives (LOs) in `curriculum_content_module.py`

Each Learning Objective in the `CURRICULUM_SLICE` will need a new optional field: `prerequisites`.

*   **`prerequisites`**: A list of LO `id` strings. If an LO has prerequisites, this list will contain the `id`s of all LOs that must be completed before this LO can be suggested.
    *   Example: `"prerequisites": ["Y3MD_LO1", "Y3MD_LO2"]`
    *   If an LO has no prerequisites, this field can be omitted or be an empty list.

**Example LO with prerequisites:**

```python
{
    "id": "Y4MD_LO3",
    "year_group": "Y4",
    "subject": "Mathematics",
    "strand": "Multiplication and Division",
    "sub_strand": "Properties of numbers",
    "description": "Recognise and use factor pairs and commutativity in mental calculations.",
    "keywords": ["factor pairs", "commutativity", "mental calculation"],
    "prerequisites": ["Y4MD_LO1", "Y4MD_LO2"] # Assumes Y4MD_LO1 and Y4MD_LO2 are foundational
}
```

### 2.2. Learner Profile (`hlp_module.py`)

The `LearnerProfile` will need a way to track completed Learning Objectives.

*   **`completed_los`**: A `set` of LO `id` strings. When a student is deemed to have mastered or completed an LO (perhaps through an assessment or completing all associated activities), its `id` will be added to this set.

**Example `LearnerProfile` modification (conceptual):**

```python
class LearnerProfile:
    def __init__(self, student_id):
        # ... existing attributes ...
        self.completed_los = set() # Initialize as an empty set

    def mark_lo_completed(self, lo_id):
        self.completed_los.add(lo_id)

    def has_completed_lo(self, lo_id):
        return lo_id in self.completed_los
```

## 3. PathwayGenerator Modifications (`dcw_apg_module.py`)

The `PathwayGenerator` will be the primary module for implementing the prerequisite logic.

### 3.1. `generate_simple_pathway` (or a new method like `generate_pathway_with_prerequisites`)

When selecting the next LO for the pathway, the generator must:

1.  **Identify Candidate LOs**: Start with a pool of potential LOs (e.g., based on the student's current year group, identified struggle areas, or next in a sequence).
2.  **Filter by Prerequisites**: For each candidate LO:
    *   Check its `prerequisites` list.
    *   If the list is not empty, verify that *all* LO `id`s in the `prerequisites` list are present in the student's `learner_profile.completed_los` set.
    *   If any prerequisite is missing, this candidate LO is *not* eligible to be added to the pathway at this time.
3.  **Select Eligible LO**: From the filtered list of eligible LOs (those whose prerequisites are met or have no prerequisites), select the next LO based on other existing logic (e.g., relevance, student interest, difficulty progression).
4.  **Avoid Cycles**: Ensure that prerequisite definitions do not create circular dependencies (e.g., LO_A requires LO_B, and LO_B requires LO_A). This is primarily a curriculum design consideration but the system should be robust enough not to get stuck in an infinite loop if such a case inadvertently occurs (e.g., by having a maximum pathway generation depth or by detecting cycles).

### 3.2. Conceptual Flow for Selecting an LO:

```python
# Inside PathwayGenerator

def is_lo_eligible(self, lo_id, learner_profile, curriculum_data):
    lo_details = curriculum_data.get_lo_by_id(lo_id) # Assume this method exists
    if not lo_details or not lo_details.get("prerequisites"):
        return True # No prerequisites, or LO not found (handle error appropriately)
    
    for prereq_id in lo_details["prerequisites"]:
        if not learner_profile.has_completed_lo(prereq_id):
            return False # Missing a prerequisite
    return True # All prerequisites met

def get_next_eligible_lo(self, candidate_lo_ids, learner_profile, curriculum_data):
    eligible_los = []
    for lo_id in candidate_lo_ids:
        if self.is_lo_eligible(lo_id, learner_profile, curriculum_data):
            eligible_los.append(lo_id)
    
    if not eligible_los:
        return None # No LOs can be taught right now based on prerequisites
    
    # Apply other selection logic (e.g., random choice for now, or more sophisticated)
    return random.choice(eligible_los) 
```

## 4. Content Association

*   The association of content items (videos, games, worksheets) with LOs remains the same. The prerequisite logic focuses on the sequencing of LOs themselves.

## 5. Assumptions for Stage 2 Implementation

*   **Manual Prerequisite Tagging**: For Stage 2, prerequisites will be manually defined in the `CURRICULUM_SLICE` data.
*   **Simulated LO Completion**: The mechanism for marking an LO as `completed` in the `LearnerProfile` will be simulated or based on simple heuristics (e.g., assuming an LO is complete after the student is presented with its associated content). A more robust assessment/completion tracking mechanism is for a later stage.
*   **Focus on Direct Prerequisites**: The initial implementation will focus on direct prerequisites. More complex dependency chains (A requires B, B requires C) will be handled implicitly if the direct links are defined correctly.

## 6. Testing and Validation

*   Create test cases with various LOs, some with and some without prerequisites.
*   Simulate different `LearnerProfile` states (e.g., no LOs completed, some LOs completed).
*   Verify that the `PathwayGenerator` only suggests LOs for which prerequisites are met.
*   Test edge cases (e.g., an LO whose prerequisites are never met, an LO with many prerequisites).

This design provides a foundational approach to prerequisite handling. Future enhancements could include more sophisticated prerequisite analysis, automatic prerequisite discovery, or allowing for optional prerequisites.
