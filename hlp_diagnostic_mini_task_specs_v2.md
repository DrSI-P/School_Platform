# DALA Stage 2: HLP - Sophisticated Diagnostic Mini-Task Specifications

This document outlines the design specifications for new sophisticated diagnostic mini-tasks for the Dynamic AI Learning Architect (DALA) Holistic Learner Profiling (HLP) module. These tasks aim to provide deeper insights into a student's learning characteristics in an engaging and novel manner, aligning with the vision for EdPsych Connect as a leading-edge platform.

## Guiding Principles for Mini-Task Design:

*   **Novelty and Engagement:** Tasks should feel fresh, interactive, and not like traditional tests.
*   **Evidence-Informed:** While not clinical diagnostic tools, the tasks should be inspired by cognitive science principles to gather meaningful (though indicative) data.
*   **Brevity:** Each mini-task should be relatively short to maintain student engagement.
*   **Actionable Insights:** The data gathered should contribute meaningfully to personalizing the learning pathway.
*   **Accessibility:** Design with accessibility in mind from the outset, considering future integration of voice input/text-to-speech where applicable.

## Mini-Task Specifications:

### 1. Mini-Task: "Story Weaver" (Narrative Sequencing & Working Memory)

*   **Purpose:** To gain insights into a student's ability to hold and manipulate sequential information (indicative of working memory capacity) and their preference for narrative-based learning or logical structuring.
*   **Task Mechanics:**
    1.  The student is presented with 3-5 visual panels (like comic strip frames) or short text snippets that are out of order, representing parts of a simple story or process.
    2.  The complexity can vary (e.g., 3 panels for younger students, 5 for older, or more abstract connections for advanced tasks).
    3.  The student needs to drag and drop the panels/snippets into the correct sequence to form a coherent story or logical process.
    4.  A simple visual cue (e.g., a "Check My Story" button) allows them to submit their sequence.
    5.  (Optional Extension) After successfully sequencing, a follow-up prompt could ask: "What do you think happens next?" or "What was the main idea?" (capturing via text input or future voice input).
*   **Data Captured:**
    *   Time taken to complete the sequence.
    *   Accuracy of the sequence (number of attempts if allowed, or final correctness).
    *   The chosen sequence itself.
    *   (If extended) Response to the follow-up question.
*   **Contribution to HLP:**
    *   Provides an indicator of working memory capacity (ability to hold and reorder items).
    *   May suggest a preference for narrative/sequential learning versus holistic/spatial if they struggle or excel significantly.
    *   The follow-up can hint at comprehension and inferential skills.
*   **Novelty/Engagement Factors:**
    *   Interactive drag-and-drop interface.
    *   Story-based context can be more engaging than abstract tests.
    *   Visuals can be appealing and thematic (e.g., space adventure, animal rescue).

### 2. Mini-Task: "Mind Mapper" (Associative Thinking & Concept Organization)

*   **Purpose:** To understand how a student organizes concepts, makes connections between ideas (associative thinking), and to identify potential areas of strong interest or knowledge.
*   **Task Mechanics:**
    1.  A central concept (word or image, e.g., "Rainforest," "Energy," "Friendship") is presented in the middle of the screen.
    2.  The student is prompted to add related ideas, facts, or questions around the central concept. They can type short phrases.
    3.  Each new idea becomes a new node, and they can (optionally, for a more advanced version) draw simple lines to connect related nodes, forming a basic mind map.
    4.  A timer (e.g., 60-90 seconds) encourages quick, intuitive responses.
*   **Data Captured:**
    *   The number of distinct ideas/nodes generated.
    *   The content of each node.
    *   The connections made between nodes (if that feature is implemented).
    *   Keywords and themes emerging from the generated map.
*   **Contribution to HLP:**
    *   Indicates divergent thinking capabilities.
    *   Reveals how a student structures knowledge and what associations they make.
    *   Can highlight areas of strong existing knowledge or particular interest not captured by simple interest selection.
    *   May suggest a preference for visual-spatial learning or interconnected thinking.
*   **Novelty/Engagement Factors:**
    *   Creative and open-ended, allowing for student expression.
    *   Visually represents their thinking process.
    *   Can be adapted with various engaging central themes.

### 3. Mini-Task: "Sound Sculptor" (Auditory Processing & Pattern Recognition - Simplified)

*   **Purpose:** To gain a simplified insight into auditory processing, specifically the ability to recognize and replicate simple auditory patterns. This is a nod towards diverse learning inputs and potential auditory learning strengths.
*   **Task Mechanics:**
    1.  The student is presented with a simple interface with 3-4 distinct sound-making elements (e.g., buttons that play a high tone, a low tone, a short beat, a long beat).
    2.  A short sequence of 3-5 sounds is played (e.g., high-low-beat).
    3.  The student then needs to replicate the sequence by clicking the sound elements in the correct order.
    4.  The task can start with very simple sequences and slightly increase in length or complexity if the student is successful.
*   **Data Captured:**
    *   Accuracy of the replicated sequence.
    *   Number of attempts (if allowed).
    *   Time taken to respond.
    *   The level of complexity reached if the task adapts.
*   **Contribution to HLP:**
    *   Provides a basic indicator of auditory sequential memory and pattern recognition.
    *   May suggest a strength or preference for auditory learning modalities.
    *   Could be an early, very gentle flag for potential auditory processing challenges if consistently difficult (though this is not a diagnostic tool).
*   **Novelty/Engagement Factors:**
    *   Interactive and uses a different sensory modality (sound).
    *   Game-like feel of listening and replicating.
    *   Can use fun, non-distracting sounds.

## Next Steps:

These specifications will be used to guide the implementation of these mini-tasks within the HLP module and the student interface. Further refinement may occur during the implementation and testing phases. The visual design and theming of these tasks will be crucial for their success in engaging students.
