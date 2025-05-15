# DALA Stage 2: DCW-APG - Varied Activities Selection Logic Design

This document outlines the design for enhancing the Dynamic Curriculum Weaving & Adaptive Pathway Generation (DCW-APG) module (`dcw_apg_module.py`) to select and present multiple, varied learning activities for a single learning objective (LO).

## 1. Goals

*   Provide students with a richer learning experience by offering a choice or a sequence of different types of activities for a single LO.
*   Cater to diverse learning preferences by presenting content in multiple formats (e.g., video, game, text).
*   Increase engagement by offering variety and reducing monotony.
*   Allow for deeper understanding by approaching an LO from different angles (e.g., conceptual explanation via video, practice via game, application via worksheet).
*   Ensure the selection considers learner profile, content availability, and difficulty.

## 2. Data Structure Considerations

### 2.1. Learning Content (`curriculum_content_module.py`)

Existing structure is suitable. Key fields:
*   `"content_id"`
*   `"title"`
*   `"type"` (e.g., "game", "video", "worksheet_pdf", "interactive_quiz", "text_explanation")
*   `"learning_objectives_covered"`
*   `"target_preferences"`
*   `"difficulty"`

### 2.2. Learner Profile (`hlp_module.py`)

Existing structure is suitable. Key fields:
*   `learning_preferences` (e.g., `{"visual_task_1": "visual"}`)
*   `completed_los`
*   Potentially, in the future: `interaction_history_with_content_types` (e.g., student tends to skip videos but completes games).

## 3. PathwayGenerator Modifications (`dcw_apg_module.py`)

The core logic change will be in how `PathwayGenerator` selects and structures content for an LO within the `generate_pathway_with_prerequisites` method (or a refactored version of its content selection part).

### 3.1. Retrieving All Content for an LO

This is already handled by `self.content_store.get_content_for_lo(lo_id)` which returns a list of all content items for that LO.

### 3.2. Logic for Selecting a Variety of Activities

Instead of selecting just one `preferred_content` item, the goal is to select a small set (e.g., 2-3) of varied activities.

1.  **Get All Suitable Content**: Retrieve all content items for the current LO.
2.  **Filter by Availability/Basic Criteria**: (Already implicitly done by `get_content_for_lo`).
3.  **Sort by Difficulty**: Sort all available content for the LO by difficulty ("easy" -> "medium" -> "hard") as implemented in Task 2.2.2. This helps in potentially offering easier options first or ensuring a mix that isn't overwhelmingly hard.
4.  **Categorize by Type**: Group the sorted content items by their `"type"`.
5.  **Preference-Driven Selection (Primary Choice)**:
    *   Identify the student's primary learning preference(s) from `self.learner_profile.learning_preferences`.
    *   Try to pick one content item that strongly matches a primary preference (e.g., if preference is "visual", pick a "video" or a visually-oriented "game"). Choose the easiest available that matches.
6.  **Variety-Driven Selection (Secondary Choices)**:
    *   After the primary (preference-matched) choice, select 1-2 additional activities of *different types* than the primary choice and from each other, if possible.
    *   Prioritize types that offer different engagement modalities (e.g., if primary was a video (passive), a secondary could be a game (interactive) or a worksheet (constructive)).
    *   When selecting these additional activities, still consider difficulty. If multiple options of a desired type exist, pick an easier one first, or one that offers a slight step up if the primary was very easy.
7.  **Limit the Number**: Limit the total number of activities presented for a single LO to a manageable number (e.g., max 2 or 3) to avoid overwhelming the student.
8.  **Fallback**: If very little content is available, present what is there. If only one item, present that. If no content, handle as current (None).

### 3.3. Structuring the Output in the Pathway

The `generated_pathway` currently stores tuples of `(lo_data, selected_content_item)`. This will need to change if multiple content items are associated with one LO.

**Option A: Nested List of Content**
`generated_pathway` becomes `[(lo_data, [content_item1, content_item2]), ...]`

**Option B: Flattened with LO Repeated (less ideal for display logic later)**
`[(lo_data, content_item1), (lo_data, content_item2), ...]` - This might make it harder to group them visually under one LO in the interface.

**Chosen Approach: Option A** seems cleaner for representing that multiple activities serve the *same* LO.

### 3.4. Conceptual Flow for `_select_varied_content_for_lo` (New Helper Method)

```python
# New helper method in PathwayGenerator
def _select_varied_content_for_lo(self, lo_id: str, available_content_for_lo: list, max_activities_per_lo=2) -> list:
    if not available_content_for_lo:
        return []

    # Sort all available content by difficulty
    DIFFICULTY_ORDER = {"easy": 1, "medium": 2, "hard": 3, "default": 99}
    sorted_content_all = sorted(
        available_content_for_lo,
        key=lambda c: DIFFICULTY_ORDER.get(c.get("difficulty", "default").lower(), DIFFICULTY_ORDER["default"])
    )

    selected_activities = []
    used_content_ids = set()

    # 1. Preference-Driven Selection (Primary Choice)
    primary_preference_type = None # Determine this based on learner_profile, e.g., "video" if visual, "game" if kinesthetic
    # Simplified example: (actual preference mapping would be more robust)
    if self.learner_profile.learning_preferences.get("visual_task_1") == "visual":
        # Look for video, then interactive_quiz, then game (visual types)
        preferred_types_order = ["video", "interactive_quiz", "game"]
    elif self.learner_profile.learning_preferences.get("textual_task_1") == "detailed_text":
        preferred_types_order = ["text_explanation", "worksheet_pdf"]
    else:
        preferred_types_order = [] # No strong preference to guide initial type

    for pref_type in preferred_types_order:
        for item in sorted_content_all:
            if item["type"] == pref_type and item["content_id"] not in used_content_ids:
                selected_activities.append(item)
                used_content_ids.add(item["content_id"])
                break
        if selected_activities: # Found one based on preference
            break

    # 2. Variety-Driven Selection (Secondary Choices)
    # Try to add different types of activities, up to max_activities_per_lo
    # Prioritize types not already selected.
    # Example: if video selected, now try game, then worksheet etc.
    general_type_priority = ["game", "interactive_quiz", "video", "worksheet_pdf", "text_explanation"] # General order to pick for variety

    current_selected_types = {act["type"] for act in selected_activities}

    for activity_type in general_type_priority:
        if len(selected_activities) >= max_activities_per_lo:
            break
        if activity_type not in current_selected_types:
            for item in sorted_content_all: # Iterate through all, sorted by difficulty
                if item["type"] == activity_type and item["content_id"] not in used_content_ids:
                    selected_activities.append(item)
                    used_content_ids.add(item["content_id"])
                    current_selected_types.add(activity_type)
                    break # Found one of this type
    
    # 3. Fallback: If still haven't reached max_activities and have unused content, fill with easiest available unique types
    if len(selected_activities) < max_activities_per_lo and len(used_content_ids) < len(sorted_content_all):
        for item in sorted_content_all:
            if len(selected_activities) >= max_activities_per_lo:
                break
            if item["content_id"] not in used_content_ids:
                 # Optional: ensure it's a new type if possible, otherwise just add it
                if item["type"] not in current_selected_types:
                    selected_activities.append(item)
                    used_content_ids.add(item["content_id"])
                    current_selected_types.add(item["type"])
                elif len(current_selected_types) >= len(set(c["type"] for c in sorted_content_all)): # if all available types are already selected
                    selected_activities.append(item) # add duplicate type if no new types are available
                    used_content_ids.add(item["content_id"])

    # Final check: if nothing selected despite content, pick the absolute easiest one
    if not selected_activities and sorted_content_all:
        selected_activities.append(sorted_content_all[0])

    return selected_activities[:max_activities_per_lo]
```

### 3.5. Integration into `generate_pathway_with_prerequisites`

The loop that processes `selected_los_for_this_pathway` will call `_select_varied_content_for_lo`:

```python
# Inside generate_pathway_with_prerequisites
# ...
for lo_data in selected_los_for_this_pathway:
    print(f"Processing LO: {lo_data['id']} - {lo_data['description']}")
    available_content = self.content_store.get_content_for_lo(lo_data['id'])
    
    # Get a list of varied activities for this LO
    selected_activity_list = self._select_varied_content_for_lo(lo_data['id'], available_content, max_activities_per_lo=2) # e.g., max 2
    
    if selected_activity_list:
        print(f"  Selected activities for LO {lo_data['id']}:")
        for act_item in selected_activity_list:
            print(f"    - {act_item['title']} (Type: {act_item['type']}, Difficulty: {act_item['difficulty']})")
        generated_pathway.append((lo_data, selected_activity_list)) # Append list of activities
    else:
        print(f"  No suitable content found for LO: {lo_data['id']}")
        generated_pathway.append((lo_data, [])) # Append empty list
# ...
```

### 3.6. Updating `display_pathway`

The `display_pathway` method will need to iterate through the list of content items for each LO.

```python
# Inside display_pathway
# ...
for i, (lo, content_items_list) in enumerate(pathway_to_display):
    print(f"Step {i+1}: Learning Objective: {lo['description']} (ID: {lo['id']})")
    if content_items_list:
        for idx, content_item in enumerate(content_items_list):
            print(f"  Activity {idx+1}: {content_item['title']} (Type: {content_item['type']}, Difficulty: {content_item['difficulty']}, Access at: {content_item['url_path']})")
    else:
        print("  Activity: No suitable content found for this objective based on current criteria.")
# ...
```

## 4. UI/UX Considerations (`generate_interface.py`)

When the HTML interface is generated, it will need to be updated to display multiple activities for a single LO. This might involve:
*   Listing them under the LO.
*   Allowing the student to choose which one to engage with first, or presenting them in a suggested sequence.
*   For Stage 2, a simple sequential listing under the LO in the HTML output would be sufficient.

## 5. Testing and Validation

*   Ensure LOs in `LEARNING_CONTENT_SET` have multiple content items of different types and difficulties.
*   Test with different learner profiles (various preferences, no preferences).
*   Verify that a variety of content types are selected (up to the defined maximum).
*   Verify that preference-matching influences the primary choice.
*   Verify that difficulty sorting influences the choices (e.g., easier preferred types are chosen over harder ones).
*   Test edge cases: LOs with only one type of content, LOs with very few content items, LOs with many content items.

This design aims to significantly enhance the richness of the learning pathways by offering more diverse engagement options for each learning objective.
