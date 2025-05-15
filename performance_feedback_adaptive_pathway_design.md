# DALA Stage 2: Conceptual Design - Performance Feedback-Driven Pathway Adaptation

This document outlines the conceptual design for how student performance feedback (e.g., on quizzes, interactive tasks) could influence the subsequent steps in their DALA-generated learning pathway.

## 1. Goals

*   Make learning pathways more responsive to individual student understanding and progress.
*   Provide timely support or challenges based on demonstrated mastery or struggle.
*   Reinforce learning by revisiting concepts if needed, or accelerate learning if concepts are grasped quickly.
*   Create a more personalized and effective learning experience.

## 2. Key Concepts

### 2.1. Performance Data Points

What data will be captured from learning activities?
*   **Quiz/Assessment Scores:** Percentage correct, specific questions missed.
*   **Interactive Task Completion:** Success/failure, time taken, number of attempts, specific errors made.
*   **Game Performance:** Score, levels completed, specific challenges failed.
*   **Self-Reported Understanding:** (e.g., student indicates if they found an activity easy/difficult after completion - already partially in UI design).

### 2.2. Feedback Granularity

*   **Activity-Level Feedback:** Performance on a single learning activity.
*   **LO-Level Feedback:** Aggregated performance across multiple activities related to the same Learning Objective (LO).

### 2.3. Pathway Adaptation Triggers

What levels of performance trigger an adaptation?
*   **Mastery Threshold:** e.g., >85% on a quiz, successful completion of a game on first try.
*   **Struggle Threshold:** e.g., <50% on a quiz, multiple failed attempts on an interactive task, specific error patterns.
*   **Partial Understanding Threshold:** e.g., 50-84% on a quiz, successful completion with some difficulty.

## 3. Adaptation Strategies

How will the pathway change based on feedback?

### 3.1. If Mastery is Demonstrated for an LO:
*   **Accelerate:** Mark the current LO as "mastered" in the learner profile.
    *   Potentially skip remaining planned activities for this LO if multiple were offered.
    *   Move more quickly to the next LO in the sequence.
    *   If the next LO has prerequisites that are now met, it becomes eligible.
*   **Offer Enrichment:** Provide optional, more challenging activities related to the mastered LO or related extension topics.

### 3.2. If Struggle is Indicated for an LO:
*   **Remediate/Reinforce:**
    *   Offer alternative activities for the *same LO* but of a different type or easier difficulty (e.g., if a quiz was failed, offer a video explanation or an easier game).
    *   Break down the LO into smaller sub-skills if possible and offer activities for those (requires more granular LOs/content tagging).
    *   Re-present prerequisite LOs/content if performance suggests a foundational gap.
*   **Adjust Pace:** Slow down the introduction of new LOs.
*   **Flag for Educator:** In a future educator dashboard, flag persistent struggle for human intervention.

### 3.3. If Partial Understanding is Demonstrated:
*   **Offer Targeted Practice:** Provide additional practice activities for the same LO, perhaps focusing on areas where errors were made (if data is granular enough).
*   **Offer a Different Modality:** Present the same concept in a different format to reinforce understanding.
*   **Proceed with Caution:** Move to the next LO but perhaps select easier introductory activities for it.

## 4. Learner Profile Updates (`hlp_module.py`)

The `LearnerProfile` will need to be enhanced to store and utilize performance data.
*   **New Attributes (Conceptual):**
    *   `performance_history`: A list or dictionary storing records of activity performance. Each record might include:
        *   `activity_id`
        *   `lo_id_associated`
        *   `timestamp`
        *   `score` (if applicable)
        *   `status` (e.g., "completed_mastery", "completed_struggle", "attempted")
        *   `specific_errors` (e.g., list of question IDs missed)
    *   `lo_mastery_status`: A dictionary mapping LO IDs to a mastery level (e.g., "not_started", "in_progress", "partial_understanding", "mastered", "struggling"). This would be more nuanced than just `completed_los`.

## 5. DCW-APG Module Modifications (`dcw_apg_module.py`)

The `PathwayGenerator` will need significant enhancements:

### 5.1. Receiving Performance Feedback
*   A mechanism will be needed for the interface/activity player to send performance data back to the DALA core (this is beyond Stage 2 implementation but key for the concept).
*   For Stage 2 design, we assume this data is available to the `PathwayGenerator` when it next generates/updates a pathway.

### 5.2. Processing Feedback and Updating Learner Profile
*   Before generating a new pathway segment, the `PathwayGenerator` (or a dedicated HLP update service) would process recent performance feedback and update the `learner_profile.lo_mastery_status` and `performance_history`.

### 5.3. Adapting Pathway Generation
*   The `_is_lo_eligible` method would check `learner_profile.lo_mastery_status` for prerequisites.
*   The logic for selecting LOs would prioritize:
    *   Revisiting LOs marked as "struggling" or "partial_understanding".
    *   Moving to new LOs if current ones are "mastered".
*   The `_select_varied_content_for_lo` method would be influenced by `lo_mastery_status`:
    *   If LO is "struggling", select easier, more foundational, or different modality content.
    *   If LO is "partial_understanding", select practice-focused content.
    *   If LO is "mastered" (but somehow being revisited, e.g., for review), offer enrichment or skip.

## 6. Example Scenarios

*   **Scenario 1: Student aces a quiz for LO1.**
    *   Feedback: Score 95% on quiz_LO1.
    *   Profile Update: `lo_mastery_status[LO1] = "mastered"`.
    *   Pathway Adaptation: DALA skips other planned activities for LO1 and moves to LO2 (if prerequisites met).

*   **Scenario 2: Student struggles with a game for LO2 (fails multiple times).**
    *   Feedback: Game_LO2 status "attempted_struggle".
    *   Profile Update: `lo_mastery_status[LO2] = "struggling"`.
    *   Pathway Adaptation: DALA offers an alternative, easier video explaining the concepts of LO2, or re-offers content for a prerequisite LO if analysis suggests a foundational gap.

*   **Scenario 3: Student gets 60% on an interactive task for LO3.**
    *   Feedback: Score 60% on task_LO3.
    *   Profile Update: `lo_mastery_status[LO3] = "partial_understanding"`.
    *   Pathway Adaptation: DALA offers an additional worksheet for LO3 focusing on practice, before moving to LO4.

## 7. Data Flow (Conceptual)

1.  Student interacts with a learning activity in the DALA interface.
2.  Interface captures performance data.
3.  (Future) Interface sends performance data to a DALA backend/HLP update service.
4.  HLP service processes data, updates `LearnerProfile` (specifically `lo_mastery_status`, `performance_history`).
5.  When student requests next part of pathway (or DALA proactively updates):
    *   `PathwayGenerator` reads the updated `LearnerProfile`.
    *   Applies adaptation strategies based on `lo_mastery_status` to select/sequence LOs and content.
6.  New/adapted pathway segment is presented to the student.

## 8. Stage 2 Focus

*   This document serves as the **conceptual design** for Task 2.2.4.
*   No Python implementation of the feedback loop or these specific adaptation strategies is planned for Stage 2 core development, as it requires a more robust backend and activity interaction framework.
*   The design will inform future development stages (Stage 3+).
*   The `LearnerProfile` and `PathwayGenerator` can be structured with these future enhancements in mind, even if the full dynamic adaptation based on real-time feedback is not yet active.

## 9. Open Questions/Future Considerations

*   How to handle conflicting feedback from multiple activities for the same LO?
*   What is the optimal number of remediation attempts before flagging for an educator?
*   How to design activities to provide granular feedback that DALA can use effectively?
*   Integrating more sophisticated AI/machine learning to predict struggle or infer understanding from more complex interactions.
