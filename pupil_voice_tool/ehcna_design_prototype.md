# EHCNA and Post-16 Transition Features Design Prototype

## Overview
This document outlines the design and prototype specifications for enhancing the Pupil Voice Tool with EHCNA-specific features and post-16 transition support. The design is based on the comprehensive requirements analysis and incorporates educational psychology best practices.

## 1. EHCNA Multimodal Communication Design

### 1.1 Drawing Tools Interface

#### Design Specifications
- **Canvas Component**: Responsive drawing area with adjustable size
- **Tool Selection**: Simple icon-based toolbar with:
  - Pencil (3 thickness options)
  - Brush (3 thickness options)
  - Eraser (2 size options)
  - Color palette (8 primary colors + black/white)
  - Shape tools (circle, square, triangle, line)
  - Text insertion tool
- **Prompt Area**: Question or prompt displayed above canvas
- **Save/Clear Controls**: Prominent buttons for saving or clearing drawing
- **Example Toggle**: Option to view example drawings for inspiration

#### User Flow
1. User is presented with a question or prompt
2. Drawing canvas appears with tool selection
3. User creates drawing using available tools
4. User can save drawing or clear and start again
5. Saved drawing is stored as evidence and can be reviewed later

#### Accessibility Considerations
- Voice commands for tool selection
- Keyboard shortcuts for common actions
- High contrast mode for tool visibility
- Simplified tool set option for younger users
- Touch-optimized for tablet use

#### Prototype Mockup
```
+------------------------------------------+
|  How do you feel about school?           |
+------------------------------------------+
|  [Example]    [Save]    [Clear]          |
+------------------------------------------+
|                                          |
|                                          |
|                                          |
|           DRAWING CANVAS                 |
|                                          |
|                                          |
|                                          |
+------------------------------------------+
| 🖊️  🖌️  ⬜  ⭕  📝  🧽  |  🎨 Colors      |
+------------------------------------------+
|  Next Question >                         |
+------------------------------------------+
```

### 1.2 Emoji Selection Boards

#### Design Specifications
- **Category Tabs**: Horizontal tabs for emotion categories:
  - Basic feelings (happy, sad, angry, scared, etc.)
  - School feelings (interested, bored, confused, proud, etc.)
  - Social feelings (friendly, lonely, included, bullied, etc.)
  - Physical feelings (energetic, tired, sick, hungry, etc.)
- **Emoji Grid**: 4x4 grid of relevant emojis per category
- **Selection Mechanism**: Single or multiple selection with intensity slider
- **Comment Area**: Optional text/voice note to explain selections
- **Visual Feedback**: Selected emojis appear larger with highlight

#### User Flow
1. User is presented with a question about feelings
2. Category tabs are displayed with default on "Basic feelings"
3. User selects relevant emoji(s)
4. Intensity slider appears for each selected emoji
5. User can add optional comment to explain choices
6. Selections are saved and can be reviewed later

#### Accessibility Considerations
- Text labels on hover/focus for each emoji
- Voice descriptions of each emoji
- Keyboard navigation through grid
- Color-blind friendly selection indicators
- Screen reader optimized category navigation

#### Prototype Mockup
```
+------------------------------------------+
|  How are you feeling today?              |
+------------------------------------------+
| [Basic] [School] [Social] [Physical]     |
+------------------------------------------+
|   😊    😢    😠    😨                  |
|                                          |
|   😐    😴    🤔    😲                  |
|                                          |
|   😍    😭    😱    🤒                  |
|                                          |
|   😎    🙄    😤    😇                  |
+------------------------------------------+
| Selected: 😊 😴                          |
| Intensity: 😊 ●●●○○  😴 ●●●●●           |
+------------------------------------------+
| Add comment: [I'm happy but tired]       |
+------------------------------------------+
|  < Back         Next >                   |
+------------------------------------------+
```

### 1.3 Visual Choice Cards

#### Design Specifications
- **Card Categories**: Multiple sets of visual choice cards:
  - Activities (sports, reading, gaming, art, etc.)
  - Places (classroom, playground, home, etc.)
  - People (friends, teachers, family, etc.)
  - Feelings (using emotion illustrations)
  - Needs (communication, sensory, physical, etc.)
- **Sorting Areas**: Three drop zones labeled:
  - "I like" (green background)
  - "Not sure" (yellow background)
  - "I don't like" (red background)
- **Card Design**: Simple illustrations with minimal text
- **Card Size**: Large enough for easy touch/drag interaction

#### User Flow
1. User is presented with a category of cards
2. Cards appear in a scrollable row at bottom of screen
3. User drags cards to appropriate sorting area
4. User can rearrange cards within sorting areas
5. "Done" button appears when all cards are sorted
6. Sorted choices are saved as evidence

#### Accessibility Considerations
- Voice labeling of all cards
- Keyboard controls for card selection and sorting
- Alternative text-based sorting for screen reader users
- Color-coding with patterns for color-blind users
- Option to enlarge cards for users with motor difficulties

#### Prototype Mockup
```
+------------------------------------------+
|  Sort these activities based on how      |
|  you feel about them at school           |
+------------------------------------------+
|                                          |
|  I LIKE                                  |
|  +-------------+  +-------------+        |
|  |   Reading   |  |    Art      |        |
|  +-------------+  +-------------+        |
|                                          |
+------------------------------------------+
|                                          |
|  NOT SURE                                |
|  +-------------+                         |
|  |    Math     |                         |
|  +-------------+                         |
|                                          |
+------------------------------------------+
|                                          |
|  I DON'T LIKE                            |
|  +-------------+  +-------------+        |
|  |  PE/Sports  |  |  Writing    |        |
|  +-------------+  +-------------+        |
|                                          |
+------------------------------------------+
|                                          |
|  +--------+ +--------+ +--------+        |
|  | Science | | Music  | | Break  |       |
|  +--------+ +--------+ +--------+        |
|                                          |
+------------------------------------------+
|  < Back                      Done >      |
+------------------------------------------+
```

### 1.4 Build Your Day Timeline

#### Design Specifications
- **Timeline Track**: Horizontal timeline representing a school day
- **Time Markers**: Visual indicators for key times (morning, break, lunch, etc.)
- **Activity Cards**: Draggable cards with common school activities
- **Custom Cards**: Option to create custom activity cards
- **Emotion Markers**: Option to add emotion indicators to activities
- **Help Indicators**: Option to add "need help" markers to activities

#### User Flow
1. User is presented with empty timeline and activity cards
2. User drags activities onto timeline in preferred order
3. User can add emotion markers to each activity
4. User can add "need help" markers where support is needed
5. User can review and adjust the completed timeline
6. Timeline is saved as evidence of preferences and needs

#### Accessibility Considerations
- Voice guidance for timeline construction
- Keyboard controls for card placement
- High contrast timeline markers
- Screen reader descriptions of timeline positions
- Alternative list-based ordering for motor difficulties

#### Prototype Mockup
```
+------------------------------------------+
|  Build your ideal school day             |
+------------------------------------------+
|                                          |
| 9am      10:30am    12pm      2pm      3pm
| |         |         |         |         |
| +---------+---------+---------+---------+
| |                                       |
| | +------+  +------+  +------+ +------+ |
| | |Reading|  |Break |  |Lunch | |Art   | |
| | | 😊    |  | 😎   |  | 😊   | | 😍   | |
| | +------+  +------+  +------+ +------+ |
| |                                       |
| +---------+---------+---------+---------+
|                                          |
+------------------------------------------+
| Available Activities:                    |
|                                          |
| +------+ +------+ +------+ +------+      |
| |Math  | |PE    | |Science| |Music |     |
| +------+ +------+ +------+ +------+      |
|                                          |
| +------+ +------+ +------+ +------+      |
| |Writing| |Group | |Computer| |Create|   |
| |      | |Work  | |       | |Custom|     |
| +------+ +------+ +------+ +------+      |
+------------------------------------------+
|  < Back                      Save >      |
+------------------------------------------+
```

## 2. Post-16 Transition Support Design

### 2.1 Interest-Based Career Explorer

#### Design Specifications
- **Activity-Based Assessment**: Interactive mini-games instead of direct questions:
  - Problem-solving scenarios
  - Creative challenges
  - Social situation responses
  - Information processing tasks
  - Physical/spatial puzzles
- **Interest Profile**: Visual representation of interest areas:
  - Creative
  - Analytical
  - Practical
  - Social
  - Enterprising
  - Investigative
- **Career Connections**: Visual web connecting interests to career paths
- **Video Library**: Searchable collection of career testimonial videos
- **Local Opportunities**: Map-based view of relevant local options

#### User Flow
1. User completes series of engaging mini-activities
2. System generates visual interest profile
3. Profile connects to potential career pathways
4. User can explore careers through videos and information
5. Local opportunities related to interests are highlighted
6. User can save favorites and create exploration plan

#### Accessibility Considerations
- Multiple activity types for different learning styles
- Text alternatives for all visual elements
- Closed captions and transcripts for videos
- Adjustable pace for timed activities
- Alternative text-based assessment option

#### Prototype Mockup
```
+------------------------------------------+
|  Your Interest Profile                   |
+------------------------------------------+
|                                          |
|           CREATIVE                       |
|              ●●●●○                       |
|              /   \                       |
|             /     \                      |
| PRACTICAL  /       \  ANALYTICAL         |
|    ●●●○○  /         \  ●●○○○            |
|          /           \                   |
|         /             \                  |
|        /               \                 |
|  SOCIAL                ENTERPRISING      |
|   ●●●●●                  ●●●○○           |
|                                          |
+------------------------------------------+
| Suggested Career Paths:                  |
|                                          |
| +--------------+  +--------------+       |
| | Art Therapy  |  | Teaching     |       |
| | Watch Video ▶|  | Watch Video ▶|       |
| +--------------+  +--------------+       |
|                                          |
| +--------------+  +--------------+       |
| | Social Work  |  | Counseling   |       |
| | Watch Video ▶|  | Watch Video ▶|       |
| +--------------+  +--------------+       |
+------------------------------------------+
| Local Opportunities:  [View Map]         |
+------------------------------------------+
|  < Back                 Save Profile >   |
+------------------------------------------+
```

### 2.2 Branching Narrative Explorer

#### Design Specifications
- **Story Framework**: Interactive narrative with decision points
- **Timeframe Structure**: Short-term (next term), medium-term (next year), long-term (after school)
- **Decision Points**: Key choices that affect story progression
- **Outcome Visualization**: Visual representation of different paths
- **Reality Checks**: Information about requirements for different paths
- **Resource Links**: Connections to real-world information and support

#### User Flow
1. User begins narrative at current life stage
2. User makes choices at key decision points
3. Story branches based on choices
4. User can explore multiple paths and outcomes
5. Reality checks provide practical information
6. User can save preferred paths and create action plan

#### Accessibility Considerations
- Text-to-speech for all narrative content
- Simple language option with visual supports
- Keyboard navigation through all choices
- Ability to pause and save progress
- Alternative text-based exploration mode

#### Prototype Mockup
```
+------------------------------------------+
|  Your Future Path Explorer               |
+------------------------------------------+
|                                          |
|  You've just finished Year 11. What      |
|  would you like to do next?              |
|                                          |
|  +----------------------------------+    |
|  | [1] Stay at school for A-Levels  |    |
|  +----------------------------------+    |
|                                          |
|  +----------------------------------+    |
|  | [2] Go to college for a BTEC     |    |
|  +----------------------------------+    |
|                                          |
|  +----------------------------------+    |
|  | [3] Look for an apprenticeship   |    |
|  +----------------------------------+    |
|                                          |
|  +----------------------------------+    |
|  | [4] Get a job                    |    |
|  +----------------------------------+    |
|                                          |
+------------------------------------------+
| Reality Check: For A-Levels, you usually |
| need at least 5 GCSEs at grades 9-4     |
| including English and Maths.             |
+------------------------------------------+
|  < Back                  Choose >        |
+------------------------------------------+
```

### 2.3 Strength-Based Portfolio

#### Design Specifications
- **Skill Categories**: Organized sections for different skill types:
  - Academic skills
  - Practical skills
  - Social skills
  - Self-management skills
  - Creative skills
- **Evidence Collection**: Multiple ways to add evidence:
  - Photo upload
  - Video recording
  - Audio recording
  - Text description
  - Certificate upload
- **Peer Recognition**: System for others to add positive comments
- **Strength Visualization**: Growing tree or other visual metaphor
- **Skill Gap Identification**: Supportive identification of development areas

#### User Flow
1. User explores different skill categories
2. User adds evidence of skills through preferred method
3. Teachers/peers can add recognition and feedback
4. Visual representation grows as evidence is added
5. System suggests potential areas for development
6. Portfolio can be exported for applications/interviews

#### Accessibility Considerations
- Multiple evidence formats for different communication preferences
- Text alternatives for all visual elements
- Simple upload process with clear guidance
- Screen reader optimized portfolio review
- Alternative text-based portfolio option

#### Prototype Mockup
```
+------------------------------------------+
|  Your Skills Portfolio                   |
+------------------------------------------+
|                                          |
|             SKILLS TREE                  |
|                                          |
|                 🌳                       |
|               /  |  \                    |
|              /   |   \                   |
|             /    |    \                  |
|         🍎      🍎      🍎               |
|      Academic  Social  Creative          |
|                                          |
+------------------------------------------+
| Selected Skill: Creative                 |
+------------------------------------------+
| Evidence:                                |
|                                          |
| +-------------+  +-------------+         |
| | Art Project |  | Music Video |         |
| | [View]      |  | [View]      |         |
| +-------------+  +-------------+         |
|                                          |
| +-------------+                          |
| | Add New     |                          |
| | Evidence    |                          |
| +-------------+                          |
+------------------------------------------+
| Feedback:                                |
| "Great creativity in your art project!"  |
| - Ms. Johnson (Art Teacher)              |
+------------------------------------------+
|  < Back                 Export >         |
+------------------------------------------+
```

### 2.4 Preparation for Adulthood Navigator

#### Design Specifications
- **Four Domains**: Clear sections for each PfA domain:
  - Employment
  - Independent Living
  - Community Inclusion
  - Health
- **Visual Roadmaps**: Step-by-step pathways with progress tracking
- **Life Skills Assessment**: Interactive assessment of practical skills
- **Resource Directory**: Searchable database of support services
- **Goal Setting**: SMART goal templates with tracking

#### User Flow
1. User explores the four PfA domains
2. User completes life skills self-assessment
3. System generates personalized roadmaps
4. User sets SMART goals in each domain
5. Progress is tracked visually over time
6. Local resources are suggested based on needs

#### Accessibility Considerations
- Clear domain distinctions with consistent navigation
- Video demonstrations with captions for life skills
- Text-to-speech for all written content
- Simplified language option with visual supports
- Alternative text-based navigation

#### Prototype Mockup
```
+------------------------------------------+
|  Preparation for Adulthood               |
+------------------------------------------+
|                                          |
| [Employment] [Living] [Community] [Health]
+------------------------------------------+
|  EMPLOYMENT DOMAIN                       |
|                                          |
|  Your Roadmap:                           |
|                                          |
|  ●───○───○───○───○                      |
|  |   |   |   |   |                       |
|  |   |   |   |   |                       |
| Explore Develop Apply  Get   Career      |
| Options Skills  for   Work  Growth       |
|                Jobs                      |
|                                          |
+------------------------------------------+
| Current Focus: Develop Skills            |
|                                          |
| Suggested Activities:                    |
| ✓ Complete skills assessment             |
| □ Create CV                              |
| □ Practice interview skills              |
| □ Research training opportunities        |
+------------------------------------------+
| Local Resources: [View 5 nearby options] |
+------------------------------------------+
|  < Back                 Set Goals >      |
+------------------------------------------+
```

## 3. EHCP Section A Alignment Design

### 3.1 Child-Friendly EHCP Explainer

#### Design Specifications
- **Age-Appropriate Versions**: Three versions for different age groups:
  - Early years (4-7): Simple animations and minimal text
  - Primary (8-11): More detailed but still visual
  - Secondary (12+): More comprehensive with less animation
- **Interactive Elements**: Clickable elements to explore EHCP sections
- **Character Guide**: Friendly character to guide through explanation
- **Progress Tracking**: Visual indication of completed sections
- **Key Vocabulary**: Simple explanations of important terms

#### User Flow
1. User selects age-appropriate version
2. Character introduces concept of EHCP
3. Interactive elements explain different sections
4. Section A is highlighted as "your voice"
5. User can ask questions through guided options
6. User confirms understanding before proceeding

#### Accessibility Considerations
- Voice narration for all content
- Sign language video option
- Simple language with visual supports
- Ability to pause and repeat sections
- Text-based alternative for screen readers

#### Prototype Mockup
```
+------------------------------------------+
|  Understanding Your EHCP                 |
+------------------------------------------+
|                                          |
|       +-------------------+              |
|       |                   |              |
|       |  Animation Area   |              |
|       |                   |              |
|       +-------------------+              |
|                                          |
|  "An EHCP is a plan that helps make      |
|   sure you get the right support at      |
|   school and at home."                   |
|                                          |
+------------------------------------------+
|  EHCP Sections:                          |
|                                          |
|  [A] YOUR VIEWS - This section is all    |
|      about what YOU think and want       |
|                                          |
|  [B] [C] [D] [E] [F] [G] [H] [I] [J] [K]|
|                                          |
+------------------------------------------+
|  Questions:                              |
|  [Who sees my EHCP?] [How long does it   |
|  last?] [Can I change it?]               |
+------------------------------------------+
|  < Back                 Continue >       |
+------------------------------------------+
```

### 3.2 Section A Response Collector

#### Design Specifications
- **Question Categories**: Organized by EHCP Section A requirements:
  - About me
  - What's important to me
  - What's working well
  - What I find difficult
  - My hopes and dreams
  - The help I need
- **Response Options**: Multiple ways to respond to each question:
  - Text entry
  - Voice recording
  - Drawing
  - Photo upload
  - Emoji selection
  - Card sorting
- **Progress Visualization**: Clear indication of completed sections
- **Review Mode**: Ability to review and edit previous responses

#### User Flow
1. User navigates through question categories
2. For each question, user chooses preferred response method
3. User provides response using chosen method
4. System saves response and marks question as complete
5. User can review all responses before final submission
6. Completed responses are formatted for EHCP Section A

#### Accessibility Considerations
- Multiple response options for different communication preferences
- Clear, simple questions with visual supports
- Option to complete over multiple sessions
- Text-to-speech for all written content
- Alternative text-based response collection

#### Prototype Mockup
```
+------------------------------------------+
|  Your Voice for Section A                |
+------------------------------------------+
|                                          |
| [About] [Important] [Working] [Difficult]
|  Me      To Me       Well      For Me    |
|                                          |
| [Hopes]  [Help]                          |
| & Dreams I Need                          |
+------------------------------------------+
|  ABOUT ME                                |
|                                          |
|  Question 2 of 5:                        |
|  "What are you good at?"                 |
|                                          |
|  How would you like to answer?           |
|                                          |
|  [Text] [Voice] [Drawing] [Photos]       |
|  [Emoji] [Cards]                         |
|                                          |
+------------------------------------------+
| Previous answers:                        |
| Q1: "My name is Sam and I am 14..."      |
| [Edit]                                   |
+------------------------------------------+
|  < Back                 Next >           |
+------------------------------------------+
```

### 3.3 Annual Review Mode

#### Design Specifications
- **Timeline View**: Visual timeline of previous reviews
- **Response Comparison**: Side-by-side view of current and previous responses
- **Change Tracking**: Visual indication of changes over time
- **Progress Celebration**: Positive visualization of progress made
- **Goal Review**: Review of previously set goals and outcomes
- **New Goal Setting**: Interface for setting goals for next period

#### User Flow
1. User selects annual review mode
2. Timeline of previous reviews is displayed
3. User can view previous responses to each question
4. System highlights changes and progress
5. User provides updated responses
6. User reviews progress on previous goals and sets new ones

#### Accessibility Considerations
- Clear visual distinction between current and previous responses
- Text-to-speech for all written content
- Simple language with visual supports
- Option to complete over multiple sessions
- Alternative text-based review mode

#### Prototype Mockup
```
+------------------------------------------+
|  Annual Review - Your Voice              |
+------------------------------------------+
|                                          |
| Timeline:                                |
| [2023] --- [2024] --- [2025 (Current)]   |
|                                          |
+------------------------------------------+
|  Question: "What are you good at?"       |
+------------------------------------------+
|  Your answer last year (2024):           |
|                                          |
|  "I am good at art and using computers.  |
|   I like making digital art."            |
|                                          |
+------------------------------------------+
|  Your answer now (2025):                 |
|                                          |
|  [Text] [Voice] [Drawing] [Photos]       |
|  [Emoji] [Cards]                         |
|                                          |
|  "I am still good at digital art. Now I  |
|   also make animations and I've started  |
|   learning coding."                      |
|                                          |
+------------------------------------------+
|  Progress on last year's goals:          |
|  ✓ Learn new digital art skills          |
|  ✓ Join the computer club                |
|  □ Show my art in the school exhibition  |
+------------------------------------------+
|  < Back                 Next >           |
+------------------------------------------+
```

## 4. Technical Architecture Design

### 4.1 Component Architecture

```
+-----------------------------------------------------+
|                  User Interface Layer                |
+-----------------------------------------------------+
|                                                     |
|  +----------------+  +----------------+  +--------+ |
|  | EHCNA          |  | Post-16        |  | EHCP   | |
|  | Multimodal     |  | Transition     |  | Section| |
|  | Communication  |  | Support        |  | A      | |
|  +----------------+  +----------------+  +--------+ |
|                                                     |
+-----------------------------------------------------+
|                  Core Services Layer                 |
+-----------------------------------------------------+
|                                                     |
|  +----------------+  +----------------+  +--------+ |
|  | Data           |  | User           |  | Media  | |
|  | Persistence    |  | Authentication |  | Storage| |
|  +----------------+  +----------------+  +--------+ |
|                                                     |
|  +----------------+  +----------------+  +--------+ |
|  | Accessibility  |  | Analytics      |  | Export | |
|  | Services       |  | Engine         |  | Engine | |
|  +----------------+  +----------------+  +--------+ |
|                                                     |
+-----------------------------------------------------+
|                 Integration Layer                    |
+-----------------------------------------------------+
|                                                     |
|  +----------------+  +----------------+  +--------+ |
|  | SENCo          |  | Dashboard      |  | Parent | |
|  | Module         |  | Integration    |  | Portal | |
|  | Integration    |  |                |  |        | |
|  +----------------+  +----------------+  +--------+ |
|                                                     |
|  +----------------+  +----------------+             |
|  | Teacher-TA     |  | External       |             |
|  | Collaboration  |  | API            |             |
|  |                |  | Connectors     |             |
|  +----------------+  +----------------+             |
|                                                     |
+-----------------------------------------------------+
```

### 4.2 Data Model

```
+------------------+       +------------------+
| User             |       | Response         |
+------------------+       +------------------+
| id               |<----->| id               |
| name             |       | userId           |
| role             |       | questionId       |
| preferences      |       | responseType     |
| accessibilityNeeds|      | content          |
| lastLogin        |       | mediaUrl         |
+------------------+       | timestamp        |
        |                  | reviewId         |
        |                  +------------------+
        |                          |
        |                          |
+------------------+       +------------------+
| Question         |<----->| Review           |
+------------------+       +------------------+
| id               |       | id               |
| category         |       | userId           |
| text             |       | type             |
| responseOptions  |       | date             |
| ehcpSection      |       | status           |
| ageRange         |       | notes            |
+------------------+       +------------------+
        |                          |
        |                          |
+------------------+       +------------------+
| Media            |       | Goal             |
+------------------+       +------------------+
| id               |       | id               |
| userId           |       | userId           |
| responseId       |       | reviewId         |
| type             |       | description      |
| url              |       | status           |
| transcription    |       | targetDate       |
| metadata         |       | completionDate   |
+------------------+       +------------------+
```

## 5. Implementation Plan

### 5.1 Phase One Implementation (2 weeks)
1. Core EHCNA multimodal communication components:
   - Drawing tools interface
   - Emoji selection boards
   - Basic EHCP Section A alignment
2. Core Post-16 transition components:
   - Interest-based career explorer framework
   - Basic strength-based portfolio
3. Foundational technical architecture:
   - Component structure
   - Data persistence
   - Basic integration with platform

### 5.2 Phase Two Implementation (2 weeks)
1. Advanced EHCNA components:
   - Visual choice cards
   - Build your day timeline
   - Complete EHCP Section A alignment
2. Advanced Post-16 components:
   - Branching narrative explorer
   - Preparation for Adulthood navigator
3. Enhanced technical features:
   - Full platform integration
   - Advanced accessibility features
   - Analytics and reporting

### 5.3 Phase Three Implementation (1 week)
1. Final components:
   - Annual review mode
   - Advanced visual design and animations
   - Complete psychological framework implementation
2. Testing and refinement:
   - User acceptance testing
   - Performance optimization
   - Final accessibility review

## 6. User Interface Style Guide

### 6.1 Color Palette
- **Primary Colors**:
  - Blue (#3498db): Headers, primary buttons, progress indicators
  - Green (#2ecc71): Positive feedback, success indicators
  - Purple (#9b59b6): Navigation elements, secondary accents
- **Secondary Colors**:
  - Yellow (#f1c40f): Highlights, attention elements
  - Red (#e74c3c): Alerts, negative feedback (used sparingly)
  - Orange (#e67e22): Warnings, secondary buttons
- **Neutral Colors**:
  - Dark Gray (#34495e): Text, icons
  - Medium Gray (#7f8c8d): Secondary text, borders
  - Light Gray (#ecf0f1): Backgrounds, inactive elements
  - White (#ffffff): Content backgrounds

### 6.2 Typography
- **Primary Font**: Open Sans (sans-serif)
  - Regular (400) for body text
  - Semibold (600) for subheadings
  - Bold (700) for headings
- **Alternative Fonts**:
  - OpenDyslexic for dyslexia-friendly mode
  - Comic Sans MS for early years interface
- **Font Sizes**:
  - Headings: 24px (mobile), 32px (desktop)
  - Subheadings: 18px (mobile), 24px (desktop)
  - Body text: 16px (mobile), 18px (desktop)
  - Small text: 14px (mobile), 16px (desktop)

### 6.3 Interface Elements
- **Buttons**:
  - Rounded corners (8px radius)
  - Clear hover and active states
  - Icon + text for primary actions
  - Consistent positioning (Next/Back always bottom)
- **Cards**:
  - Subtle shadow (2px blur, 10% opacity)
  - Rounded corners (8px radius)
  - Clear content hierarchy
  - Consistent padding (16px)
- **Forms**:
  - Large input fields (minimum 44px height)
  - Clear focus states
  - Inline validation
  - Grouped related fields

### 6.4 Iconography
- **Style**: Rounded, friendly, consistent stroke width
- **Size**: 24px standard, 32px for primary actions
- **Usage**: Always with text labels (visible or as tooltip)
- **Animation**: Subtle animations for state changes
- **Consistency**: Same icon always represents same action

### 6.5 Accessibility Variants
- **High Contrast Mode**:
  - Black (#000000) text on white (#ffffff) background
  - Yellow (#ffff00) focus indicators
  - Simplified interface with increased spacing
- **Reduced Motion Mode**:
  - No animations or transitions
  - Static alternatives for animated elements
- **Screen Reader Optimized**:
  - Enhanced ARIA labels
  - Logical tab order
  - Descriptive link text
  - Proper heading hierarchy

## 7. Testing Strategy

### 7.1 Functional Testing
- Unit tests for all components
- Integration tests for component interactions
- End-to-end tests for complete user flows
- API tests for backend services
- Database tests for data persistence

### 7.2 Accessibility Testing
- Automated testing with axe-core
- Manual testing with screen readers (NVDA, VoiceOver)
- Keyboard navigation testing
- Color contrast verification
- Testing with users with different accessibility needs

### 7.3 User Acceptance Testing
- Testing with educational psychologists
- Testing with teachers and SENCos
- Testing with students of different ages and needs
- Testing with parents and carers
- Feedback collection and implementation

### 7.4 Performance Testing
- Load time testing
- Memory usage monitoring
- CPU utilization testing
- Network request optimization
- Offline functionality testing

## 8. Conclusion

This design prototype provides a comprehensive blueprint for enhancing the Pupil Voice Tool with EHCNA-specific features and post-16 transition support. The design prioritizes accessibility, engagement, and educational psychology best practices while ensuring seamless integration with the existing EdPsych Connect platform.

The implementation will proceed in phases, with regular testing and refinement to ensure the final product meets all requirements and provides an exceptional user experience for both students and educational professionals.

---

Next steps:
1. Review and approve design prototype
2. Begin Phase One implementation
3. Conduct initial testing with representative users
4. Refine design based on feedback
5. Proceed with Phase Two implementation
