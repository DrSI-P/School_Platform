/**
 * EdPsych Connect - Pupil Voice Tool
 * Graduated Question Flow Component
 * 
 * This module implements a graduated question approach for EHCNA pupil voice collection,
 * starting with concrete questions and gradually moving to more abstract concepts.
 */

class GraduatedQuestionFlow {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            containerId: options.containerId || 'graduated-question-flow',
            width: options.width || '100%',
            targetAge: options.targetAge || 'primary', // primary, secondary, post16
            ehcpSection: options.ehcpSection || 'A', // EHCP section (A, B, C, D, E, F, G, H)
            startLevel: options.startLevel || 1, // Starting complexity level (1-5)
            maxLevel: options.maxLevel || 5, // Maximum complexity level
            allowSkip: options.allowSkip !== undefined ? options.allowSkip : true,
            allowMultiSession: options.allowMultiSession !== undefined ? options.allowMultiSession : true,
            visualScales: options.visualScales !== undefined ? options.visualScales : true,
            accessibilityMode: options.accessibilityMode || false,
            voiceInput: options.voiceInput !== undefined ? options.voiceInput : true,
            onSave: options.onSave || null,
            onComplete: options.onComplete || null,
            customQuestions: options.customQuestions || null,
            theme: options.theme || 'standard', // standard, playful, formal
            language: options.language || 'en-GB'
        };

        // State variables
        this.state = {
            currentLevel: this.config.startLevel,
            currentQuestionIndex: 0,
            responses: {},
            completedLevels: [],
            sessionActive: false,
            sessionStartTime: null,
            sessionBreaks: [],
            visualScaleType: 'thermometer', // thermometer, ladder, smiley, stars
            isRecording: false
        };

        // Question sets by age group, section, and level
        this.questionSets = this.config.customQuestions || this.getDefaultQuestions();

        // Initialize the component
        this.init();
    }

    /**
     * Initialize the graduated question flow component
     */
    init() {
        // Create container if it doesn't exist
        this.container = document.getElementById(this.config.containerId);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = this.config.containerId;
            document.body.appendChild(this.container);
        }

        // Set up the container
        this.container.classList.add('graduated-question-flow');
        this.container.setAttribute('role', 'application');
        this.container.setAttribute('aria-label', 'Graduated Question Flow for Pupil Voice');
        this.container.style.width = this.config.width;

        // Add theme class
        this.container.classList.add(`theme-${this.config.theme}`);

        // Create the UI
        this.createUI();

        // Set up event listeners
        this.setupEventListeners();

        // Set up voice input if enabled
        if (this.config.voiceInput) {
            this.setupVoiceInput();
        }

        // Set up accessibility features if enabled
        if (this.config.accessibilityMode) {
            this.setupAccessibilityFeatures();
        }

        // Start session
        this.startSession();
    }

    /**
     * Get default questions based on age group, EHCP section, and complexity level
     */
    getDefaultQuestions() {
        const questions = {
            primary: {
                'A': { // Section A: The views, interests and aspirations of the child and their parents
                    1: [ // Level 1: Most concrete, immediate
                        {
                            id: 'primary_A_1_1',
                            text: 'What do you like doing at school?',
                            type: 'open',
                            visualPrompt: 'school_activities.png',
                            visualScale: false,
                            supportText: 'Tell me about the things you enjoy at school.'
                        },
                        {
                            id: 'primary_A_1_2',
                            text: 'What do you like doing at home?',
                            type: 'open',
                            visualPrompt: 'home_activities.png',
                            visualScale: false,
                            supportText: 'Tell me about the things you enjoy at home.'
                        },
                        {
                            id: 'primary_A_1_3',
                            text: 'Who helps you the most at school?',
                            type: 'open',
                            visualPrompt: 'school_helpers.png',
                            visualScale: false,
                            supportText: 'This could be a teacher, a friend, or someone else.'
                        }
                    ],
                    2: [ // Level 2: Slightly more abstract
                        {
                            id: 'primary_A_2_1',
                            text: 'How do you feel when you are at school?',
                            type: 'scale',
                            visualPrompt: 'feelings_school.png',
                            visualScale: true,
                            scaleType: 'smiley',
                            supportText: 'Choose the face that shows how you feel at school.'
                        },
                        {
                            id: 'primary_A_2_2',
                            text: 'What makes you happy at school?',
                            type: 'open',
                            visualPrompt: 'happy_school.png',
                            visualScale: false,
                            supportText: 'Tell me about things that make you smile at school.'
                        },
                        {
                            id: 'primary_A_2_3',
                            text: 'What makes school difficult for you?',
                            type: 'open',
                            visualPrompt: 'difficult_school.png',
                            visualScale: false,
                            supportText: 'Tell me about things that you find hard at school.'
                        }
                    ],
                    3: [ // Level 3: Medium abstraction
                        {
                            id: 'primary_A_3_1',
                            text: 'What would make school better for you?',
                            type: 'open',
                            visualPrompt: 'better_school.png',
                            visualScale: false,
                            supportText: 'If you could change something about school, what would it be?'
                        },
                        {
                            id: 'primary_A_3_2',
                            text: 'How well do you think you are doing at school?',
                            type: 'scale',
                            visualPrompt: 'school_progress.png',
                            visualScale: true,
                            scaleType: 'ladder',
                            supportText: 'Choose a step on the ladder to show how well you think you are doing.'
                        },
                        {
                            id: 'primary_A_3_3',
                            text: 'What do you want to get better at?',
                            type: 'open',
                            visualPrompt: 'improvement.png',
                            visualScale: false,
                            supportText: 'Tell me about things you want to learn or improve.'
                        }
                    ],
                    4: [ // Level 4: More abstract
                        {
                            id: 'primary_A_4_1',
                            text: 'What do you want to do when you are older?',
                            type: 'open',
                            visualPrompt: 'future_job.png',
                            visualScale: false,
                            supportText: 'Tell me about what job or activities you might like to do when you grow up.'
                        },
                        {
                            id: 'primary_A_4_2',
                            text: 'What helps you learn best?',
                            type: 'multiselect',
                            visualPrompt: 'learning_styles.png',
                            options: [
                                { id: 'reading', text: 'Reading books', icon: '📚' },
                                { id: 'listening', text: 'Listening to someone explain', icon: '👂' },
                                { id: 'watching', text: 'Watching videos', icon: '📺' },
                                { id: 'doing', text: 'Doing activities', icon: '🧩' },
                                { id: 'talking', text: 'Talking about it', icon: '🗣️' },
                                { id: 'drawing', text: 'Drawing or making things', icon: '🎨' }
                            ],
                            visualScale: false,
                            supportText: 'Choose all the ways that help you learn best.'
                        },
                        {
                            id: 'primary_A_4_3',
                            text: 'How do you feel about trying new things?',
                            type: 'scale',
                            visualPrompt: 'new_things.png',
                            visualScale: true,
                            scaleType: 'thermometer',
                            supportText: 'Show on the thermometer how you feel about trying new things.'
                        }
                    ],
                    5: [ // Level 5: Most abstract
                        {
                            id: 'primary_A_5_1',
                            text: 'What are your hopes and dreams for the future?',
                            type: 'open',
                            visualPrompt: 'hopes_dreams.png',
                            visualScale: false,
                            supportText: 'Tell me about what you hope will happen in your future.'
                        },
                        {
                            id: 'primary_A_5_2',
                            text: 'What do you think is special about you?',
                            type: 'open',
                            visualPrompt: 'special_qualities.png',
                            visualScale: false,
                            supportText: 'Tell me about the things that make you unique or different from others.'
                        },
                        {
                            id: 'primary_A_5_3',
                            text: 'If you could give advice to your teachers, what would you tell them?',
                            type: 'open',
                            visualPrompt: 'advice_teachers.png',
                            visualScale: false,
                            supportText: 'What would you like your teachers to know or do differently?'
                        }
                    ]
                },
                'B': { // Section B: The child's special educational needs (SEN)
                    1: [ // Level 1: Most concrete, immediate
                        {
                            id: 'primary_B_1_1',
                            text: 'What subjects do you find easy at school?',
                            type: 'multiselect',
                            visualPrompt: 'easy_subjects.png',
                            options: [
                                { id: 'english', text: 'English', icon: '📝' },
                                { id: 'maths', text: 'Maths', icon: '🔢' },
                                { id: 'science', text: 'Science', icon: '🔬' },
                                { id: 'art', text: 'Art', icon: '🎨' },
                                { id: 'pe', text: 'PE', icon: '⚽' },
                                { id: 'music', text: 'Music', icon: '🎵' },
                                { id: 'computing', text: 'Computing', icon: '💻' },
                                { id: 'history', text: 'History', icon: '📜' },
                                { id: 'geography', text: 'Geography', icon: '🌍' }
                            ],
                            visualScale: false,
                            supportText: 'Choose all the subjects you find easy.'
                        },
                        {
                            id: 'primary_B_1_2',
                            text: 'What subjects do you find difficult at school?',
                            type: 'multiselect',
                            visualPrompt: 'difficult_subjects.png',
                            options: [
                                { id: 'english', text: 'English', icon: '📝' },
                                { id: 'maths', text: 'Maths', icon: '🔢' },
                                { id: 'science', text: 'Science', icon: '🔬' },
                                { id: 'art', text: 'Art', icon: '🎨' },
                                { id: 'pe', text: 'PE', icon: '⚽' },
                                { id: 'music', text: 'Music', icon: '🎵' },
                                { id: 'computing', text: 'Computing', icon: '💻' },
                                { id: 'history', text: 'History', icon: '📜' },
                                { id: 'geography', text: 'Geography', icon: '🌍' }
                            ],
                            visualScale: false,
                            supportText: 'Choose all the subjects you find difficult.'
                        },
                        {
                            id: 'primary_B_1_3',
                            text: 'Do you find it easy or difficult to sit still in class?',
                            type: 'scale',
                            visualPrompt: 'sitting_still.png',
                            visualScale: true,
                            scaleType: 'smiley',
                            supportText: 'Choose the face that shows how easy or difficult it is to sit still.'
                        }
                    ],
                    // Additional levels for Section B would be defined here
                    // ...
                },
                // Additional sections would be defined here
                // ...
            },
            secondary: {
                'A': {
                    // Questions for secondary school pupils for Section A
                    // ...
                },
                // Additional sections for secondary would be defined here
                // ...
            },
            post16: {
                'A': {
                    // Questions for post-16 pupils for Section A
                    // ...
                },
                // Additional sections for post16 would be defined here
                // ...
            }
        };

        return questions;
    }

    /**
     * Create the user interface
     */
    createUI() {
        // Clear the container
        this.container.innerHTML = '';

        // Create header
        const header = document.createElement('div');
        header.classList.add('graduated-question-header');
        
        const title = document.createElement('h2');
        title.classList.add('graduated-question-title');
        title.textContent = this.getHeaderTitle();
        header.appendChild(title);
        
        const subtitle = document.createElement('div');
        subtitle.classList.add('graduated-question-subtitle');
        subtitle.textContent = this.getHeaderSubtitle();
        header.appendChild(subtitle);
        
        this.container.appendChild(header);

        // Create progress indicator
        const progressContainer = document.createElement('div');
        progressContainer.classList.add('graduated-question-progress-container');
        
        const progressBar = document.createElement('div');
        progressBar.classList.add('graduated-question-progress-bar');
        
        const progressPercentage = this.calculateProgress();
        const progressFill = document.createElement('div');
        progressFill.classList.add('graduated-question-progress-fill');
        progressFill.style.width = `${progressPercentage}%`;
        progressBar.appendChild(progressFill);
        
        const progressText = document.createElement('div');
        progressText.classList.add('graduated-question-progress-text');
        progressText.textContent = `${progressPercentage}% Complete`;
        
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);
        this.container.appendChild(progressContainer);

        // Create level indicator
        const levelContainer = document.createElement('div');
        levelContainer.classList.add('graduated-question-level-container');
        
        const levelLabel = document.createElement('div');
        levelLabel.classList.add('graduated-question-level-label');
        levelLabel.textContent = 'Current Level:';
        levelContainer.appendChild(levelLabel);
        
        const levelIndicator = document.createElement('div');
        levelIndicator.classList.add('graduated-question-level-indicator');
        
        for (let i = 1; i <= this.config.maxLevel; i++) {
            const levelDot = document.createElement('div');
            levelDot.classList.add('graduated-question-level-dot');
            
            if (i === this.state.currentLevel) {
                levelDot.classList.add('current');
            } else if (this.state.completedLevels.includes(i)) {
                levelDot.classList.add('completed');
            }
            
            levelDot.setAttribute('data-level', i);
            levelDot.setAttribute('aria-label', `Level ${i}`);
            
            levelIndicator.appendChild(levelDot);
        }
        
        levelContainer.appendChild(levelIndicator);
        this.container.appendChild(levelContainer);

        // Create main content area
        const mainContent = document.createElement('div');
        mainContent.classList.add('graduated-question-main-content');
        
        // Get current question
        const currentQuestion = this.getCurrentQuestion();
        
        if (currentQuestion) {
            // Create question container
            const questionContainer = document.createElement('div');
            questionContainer.classList.add('graduated-question-container');
            questionContainer.setAttribute('data-question-id', currentQuestion.id);
            
            // Add visual prompt if available
            if (currentQuestion.visualPrompt) {
                const visualPrompt = document.createElement('div');
                visualPrompt.classList.add('graduated-question-visual-prompt');
                
                const promptImage = document.createElement('img');
                promptImage.src = `images/prompts/${currentQuestion.visualPrompt}`;
                promptImage.alt = `Visual prompt for: ${currentQuestion.text}`;
                promptImage.setAttribute('aria-hidden', 'true');
                
                visualPrompt.appendChild(promptImage);
                questionContainer.appendChild(visualPrompt);
            }
            
            // Add question text
            const questionText = document.createElement('div');
            questionText.classList.add('graduated-question-text');
            questionText.textContent = currentQuestion.text;
            questionContainer.appendChild(questionText);
            
            // Add support text if available
            if (currentQuestion.supportText) {
                const supportText = document.createElement('div');
                supportText.classList.add('graduated-question-support-text');
                supportText.textContent = currentQuestion.supportText;
                questionContainer.appendChild(supportText);
            }
            
            // Add response area based on question type
            const responseArea = document.createElement('div');
            responseArea.classList.add('graduated-question-response-area');
            
            switch (currentQuestion.type) {
                case 'open':
                    this.createOpenResponseArea(responseArea, currentQuestion);
                    break;
                case 'scale':
                    this.createScaleResponseArea(responseArea, currentQuestion);
                    break;
                case 'multiselect':
                    this.createMultiselectResponseArea(responseArea, currentQuestion);
                    break;
                case 'yesno':
                    this.createYesNoResponseArea(responseArea, currentQuestion);
                    break;
                default:
                    this.createOpenResponseArea(responseArea, currentQuestion);
            }
            
            questionContainer.appendChild(responseArea);
            mainContent.appendChild(questionContainer);
        } else {
            // No more questions at this level
            const completionMessage = document.createElement('div');
            completionMessage.classList.add('graduated-question-completion');
            
            const completionIcon = document.createElement('div');
            completionIcon.classList.add('graduated-question-completion-icon');
            completionIcon.innerHTML = '✅';
            completionMessage.appendChild(completionIcon);
            
            const completionTitle = document.createElement('h3');
            completionTitle.textContent = 'Level Complete!';
            completionMessage.appendChild(completionTitle);
            
            const completionText = document.createElement('p');
            
            if (this.state.currentLevel < this.config.maxLevel) {
                completionText.textContent = 'Well done! You have completed all questions at this level. Would you like to continue to the next level?';
                
                const nextLevelButton = document.createElement('button');
                nextLevelButton.classList.add('graduated-question-next-level-button');
                nextLevelButton.textContent = 'Continue to Next Level';
                nextLevelButton.addEventListener('click', () => {
                    this.moveToNextLevel();
                });
                
                completionMessage.appendChild(completionText);
                completionMessage.appendChild(nextLevelButton);
            } else {
                completionText.textContent = 'Congratulations! You have completed all questions. Thank you for sharing your thoughts.';
                
                const finishButton = document.createElement('button');
                finishButton.classList.add('graduated-question-finish-button');
                finishButton.textContent = 'Finish';
                finishButton.addEventListener('click', () => {
                    this.finishQuestionnaire();
                });
                
                completionMessage.appendChild(completionText);
                completionMessage.appendChild(finishButton);
            }
            
            mainContent.appendChild(completionMessage);
        }
        
        this.container.appendChild(mainContent);

        // Create navigation buttons
        if (currentQuestion) {
            const navigationArea = document.createElement('div');
            navigationArea.classList.add('graduated-question-navigation-area');
            
            // Back button
            const backButton = document.createElement('button');
            backButton.classList.add('graduated-question-nav-button', 'graduated-question-back-button');
            backButton.textContent = '< Back';
            backButton.setAttribute('aria-label', 'Go back to previous question');
            
            if (this.state.currentQuestionIndex > 0) {
                backButton.addEventListener('click', () => {
                    this.navigateToPreviousQuestion();
                });
            } else {
                backButton.disabled = true;
            }
            
            navigationArea.appendChild(backButton);
            
            // Skip button (if allowed)
            if (this.config.allowSkip) {
                const skipButton = document.createElement('button');
                skipButton.classList.add('graduated-question-nav-button', 'graduated-question-skip-button');
                skipButton.textContent = 'Skip';
                skipButton.setAttribute('aria-label', 'Skip this question');
                
                skipButton.addEventListener('click', () => {
                    this.skipCurrentQuestion();
                });
                
                navigationArea.appendChild(skipButton);
            }
            
            // Next button
            const nextButton = document.createElement('button');
            nextButton.classList.add('graduated-question-nav-button', 'graduated-question-next-button');
            nextButton.textContent = 'Next >';
            nextButton.setAttribute('aria-label', 'Go to next question');
            
            nextButton.addEventListener('click', () => {
                this.saveAndNavigateToNextQuestion();
            });
            
            navigationArea.appendChild(nextButton);
            this.container.appendChild(navigationArea);
        }

        // Create voice input button if enabled
        if (this.config.voiceInput && currentQuestion && currentQuestion.type === 'open') {
            const voiceButtonContainer = document.createElement('div');
            voiceButtonContainer.classList.add('graduated-question-voice-container');
            
            const voiceButton = document.createElement('button');
            voiceButton.classList.add('graduated-question-voice-button');
            voiceButton.innerHTML = '<span class="voice-icon">🎤</span> Record Answer';
            voiceButton.setAttribute('aria-label', 'Record your answer using your voice');
            
            voiceButton.addEventListener('click', () => {
                this.toggleVoiceRecording();
            });
            
            voiceButtonContainer.appendChild(voiceButton);
            this.container.appendChild(voiceButtonContainer);
            
            this.voiceButton = voiceButton;
        }

        // Create status message area for accessibility
        const statusArea = document.createElement('div');
        statusArea.classList.add('graduated-question-status');
        statusArea.setAttribute('role', 'status');
        statusArea.setAttribute('aria-live', 'polite');
        this.container.appendChild(statusArea);
        this.statusArea = statusArea;

        // Create session controls if multi-session is allowed
        if (this.config.allowMultiSession) {
            const sessionControls = document.createElement('div');
            sessionControls.classList.add('graduated-question-session-controls');
            
            const pauseButton = document.createElement('button');
            pauseButton.classList.add('graduated-question-pause-button');
            pauseButton.textContent = 'Pause Session';
            pauseButton.setAttribute('aria-label', 'Pause this session and continue later');
            
            pauseButton.addEventListener('click', () => {
                this.pauseSession();
            });
            
            sessionControls.appendChild(pauseButton);
            this.container.appendChild(sessionControls);
        }
    }

    /**
     * Create an open response area for text input
     */
    createOpenResponseArea(container, question) {
        const responseInput = document.createElement('textarea');
        responseInput.classList.add('graduated-question-open-response');
        responseInput.placeholder = 'Type your answer here...';
        responseInput.setAttribute('aria-label', `Your answer to: ${question.text}`);
        
        // Set existing response if available
        if (this.state.responses[question.id]) {
            responseInput.value = this.state.responses[question.id];
        }
        
        // Auto-resize textarea as user types
        responseInput.addEventListener('input', () => {
            responseInput.style.height = 'auto';
            responseInput.style.height = (responseInput.scrollHeight) + 'px';
        });
        
        container.appendChild(responseInput);
        
        // Focus the input after rendering
        setTimeout(() => {
            responseInput.focus();
            responseInput.style.height = 'auto';
            responseInput.style.height = (responseInput.scrollHeight) + 'px';
        }, 100);
        
        this.responseInput = responseInput;
    }

    /**
     * Create a scale response area (thermometer, ladder, smiley, stars)
     */
    createScaleResponseArea(container, question) {
        const scaleType = question.scaleType || this.state.visualScaleType;
        const scaleContainer = document.createElement('div');
        scaleContainer.classList.add('graduated-question-scale-container');
        scaleContainer.classList.add(`scale-type-${scaleType}`);
        
        let scaleItems;
        
        switch (scaleType) {
            case 'smiley':
                scaleItems = [
                    { value: 1, icon: '😢', label: 'Very unhappy' },
                    { value: 2, icon: '🙁', label: 'Unhappy' },
                    { value: 3, icon: '😐', label: 'Neutral' },
                    { value: 4, icon: '🙂', label: 'Happy' },
                    { value: 5, icon: '😄', label: 'Very happy' }
                ];
                break;
            case 'stars':
                scaleItems = [
                    { value: 1, icon: '⭐', label: '1 star' },
                    { value: 2, icon: '⭐⭐', label: '2 stars' },
                    { value: 3, icon: '⭐⭐⭐', label: '3 stars' },
                    { value: 4, icon: '⭐⭐⭐⭐', label: '4 stars' },
                    { value: 5, icon: '⭐⭐⭐⭐⭐', label: '5 stars' }
                ];
                break;
            case 'ladder':
                scaleItems = [
                    { value: 5, icon: '5️⃣', label: 'Top step' },
                    { value: 4, icon: '4️⃣', label: 'Step 4' },
                    { value: 3, icon: '3️⃣', label: 'Step 3' },
                    { value: 2, icon: '2️⃣', label: 'Step 2' },
                    { value: 1, icon: '1️⃣', label: 'Bottom step' }
                ];
                break;
            case 'thermometer':
            default:
                scaleItems = [
                    { value: 5, icon: '🔴', label: 'Very high' },
                    { value: 4, icon: '🟠', label: 'High' },
                    { value: 3, icon: '🟡', label: 'Medium' },
                    { value: 2, icon: '🟢', label: 'Low' },
                    { value: 1, icon: '🔵', label: 'Very low' }
                ];
                break;
        }
        
        // Create scale visualization
        const scaleVisual = document.createElement('div');
        scaleVisual.classList.add('graduated-question-scale-visual');
        
        scaleItems.forEach(item => {
            const scaleItem = document.createElement('div');
            scaleItem.classList.add('graduated-question-scale-item');
            scaleItem.setAttribute('data-value', item.value);
            scaleItem.setAttribute('tabindex', '0');
            scaleItem.setAttribute('role', 'radio');
            scaleItem.setAttribute('aria-checked', 'false');
            scaleItem.setAttribute('aria-label', item.label);
            
            const itemIcon = document.createElement('div');
            itemIcon.classList.add('scale-item-icon');
            itemIcon.textContent = item.icon;
            scaleItem.appendChild(itemIcon);
            
            const itemLabel = document.createElement('div');
            itemLabel.classList.add('scale-item-label');
            itemLabel.textContent = item.label;
            scaleItem.appendChild(itemLabel);
            
            // Set as selected if this is the saved response
            if (this.state.responses[question.id] === item.value) {
                scaleItem.classList.add('selected');
                scaleItem.setAttribute('aria-checked', 'true');
            }
            
            scaleItem.addEventListener('click', () => {
                this.selectScaleItem(question.id, item.value);
            });
            
            scaleItem.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.selectScaleItem(question.id, item.value);
                }
            });
            
            scaleVisual.appendChild(scaleItem);
        });
        
        scaleContainer.appendChild(scaleVisual);
        container.appendChild(scaleContainer);
    }

    /**
     * Create a multiselect response area
     */
    createMultiselectResponseArea(container, question) {
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('graduated-question-multiselect-container');
        
        question.options.forEach(option => {
            const optionItem = document.createElement('div');
            optionItem.classList.add('graduated-question-multiselect-item');
            optionItem.setAttribute('data-option-id', option.id);
            optionItem.setAttribute('tabindex', '0');
            optionItem.setAttribute('role', 'checkbox');
            
            // Check if this option is already selected
            const isSelected = Array.isArray(this.state.responses[question.id]) && 
                              this.state.responses[question.id].includes(option.id);
            
            if (isSelected) {
                optionItem.classList.add('selected');
                optionItem.setAttribute('aria-checked', 'true');
            } else {
                optionItem.setAttribute('aria-checked', 'false');
            }
            
            if (option.icon) {
                const optionIcon = document.createElement('div');
                optionIcon.classList.add('multiselect-item-icon');
                optionIcon.textContent = option.icon;
                optionItem.appendChild(optionIcon);
            }
            
            const optionText = document.createElement('div');
            optionText.classList.add('multiselect-item-text');
            optionText.textContent = option.text;
            optionItem.appendChild(optionText);
            
            optionItem.addEventListener('click', () => {
                this.toggleMultiselectOption(question.id, option.id);
            });
            
            optionItem.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.toggleMultiselectOption(question.id, option.id);
                }
            });
            
            optionsContainer.appendChild(optionItem);
        });
        
        container.appendChild(optionsContainer);
    }

    /**
     * Create a yes/no response area
     */
    createYesNoResponseArea(container, question) {
        const yesNoContainer = document.createElement('div');
        yesNoContainer.classList.add('graduated-question-yesno-container');
        
        const options = [
            { value: 'yes', text: 'Yes', icon: '✓' },
            { value: 'no', text: 'No', icon: '✗' }
        ];
        
        options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.classList.add('graduated-question-yesno-button');
            optionButton.classList.add(`yesno-${option.value}`);
            optionButton.setAttribute('data-value', option.value);
            
            // Check if this option is already selected
            if (this.state.responses[question.id] === option.value) {
                optionButton.classList.add('selected');
            }
            
            const optionIcon = document.createElement('span');
            optionIcon.classList.add('yesno-icon');
            optionIcon.textContent = option.icon;
            optionButton.appendChild(optionIcon);
            
            const optionText = document.createElement('span');
            optionText.classList.add('yesno-text');
            optionText.textContent = option.text;
            optionButton.appendChild(optionText);
            
            optionButton.addEventListener('click', () => {
                this.selectYesNoOption(question.id, option.value);
            });
            
            yesNoContainer.appendChild(optionButton);
        });
        
        container.appendChild(yesNoContainer);
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only process if the question flow is focused
            if (!this.container.contains(document.activeElement) && document.activeElement !== document.body) {
                return;
            }
            
            if (e.key === 'Escape') {
                // ESC key to pause session
                if (this.config.allowMultiSession) {
                    this.pauseSession();
                }
            }
        });
    }

    /**
     * Set up voice input
     */
    setupVoiceInput() {
        // Check if the Web Speech API is available
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Voice input is not supported in this browser');
            return;
        }
        
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.config.language;
        
        // Handle voice input
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Update response input
            if (this.responseInput) {
                if (finalTranscript) {
                    this.responseInput.value += finalTranscript + ' ';
                    this.responseInput.dispatchEvent(new Event('input'));
                }
                
                // Show interim results
                if (interimTranscript) {
                    const currentValue = this.responseInput.value;
                    this.responseInput.value = currentValue + interimTranscript;
                    
                    // Restore original value after interim display
                    setTimeout(() => {
                        if (this.responseInput.value === currentValue + interimTranscript) {
                            this.responseInput.value = currentValue;
                        }
                    }, 1000);
                }
            }
        };
        
        // Handle errors
        this.recognition.onerror = (event) => {
            console.error('Voice input error:', event.error);
            this.updateStatus(`Voice input error: ${event.error}`);
            this.stopVoiceRecording();
        };
        
        // Handle end of recognition
        this.recognition.onend = () => {
            this.state.isRecording = false;
            if (this.voiceButton) {
                this.voiceButton.innerHTML = '<span class="voice-icon">🎤</span> Record Answer';
                this.voiceButton.classList.remove('recording');
            }
            this.updateStatus('Voice recording stopped');
        };
    }

    /**
     * Toggle voice recording
     */
    toggleVoiceRecording() {
        if (!this.recognition) {
            this.updateStatus('Voice recording is not supported in this browser');
            return;
        }
        
        if (this.state.isRecording) {
            this.stopVoiceRecording();
        } else {
            this.startVoiceRecording();
        }
    }

    /**
     * Start voice recording
     */
    startVoiceRecording() {
        this.recognition.start();
        this.state.isRecording = true;
        
        if (this.voiceButton) {
            this.voiceButton.innerHTML = '<span class="voice-icon">⏹️</span> Stop Recording';
            this.voiceButton.classList.add('recording');
        }
        
        this.updateStatus('Voice recording started. Speak your answer.');
    }

    /**
     * Stop voice recording
     */
    stopVoiceRecording() {
        if (this.state.isRecording) {
            this.recognition.stop();
            this.state.isRecording = false;
            
            if (this.voiceButton) {
                this.voiceButton.innerHTML = '<span class="voice-icon">🎤</span> Record Answer';
                this.voiceButton.classList.remove('recording');
            }
            
            this.updateStatus('Voice recording stopped');
        }
    }

    /**
     * Set up accessibility features
     */
    setupAccessibilityFeatures() {
        // Add keyboard navigation instructions
        const instructions = document.createElement('div');
        instructions.classList.add('graduated-question-keyboard-instructions');
        instructions.innerHTML = `
            <details>
                <summary>Accessibility Options</summary>
                <ul>
                    <li>Tab: Navigate between elements</li>
                    <li>Space/Enter: Select or activate focused element</li>
                    <li>Escape: Pause session</li>
                </ul>
                <div class="accessibility-controls">
                    <button class="font-size-increase">Increase Text Size</button>
                    <button class="font-size-decrease">Decrease Text Size</button>
                    <button class="high-contrast-toggle">Toggle High Contrast</button>
                </div>
            </details>
        `;
        
        // Add event listeners for accessibility controls
        instructions.querySelector('.font-size-increase').addEventListener('click', () => {
            this.increaseFontSize();
        });
        
        instructions.querySelector('.font-size-decrease').addEventListener('click', () => {
            this.decreaseFontSize();
        });
        
        instructions.querySelector('.high-contrast-toggle').addEventListener('click', () => {
            this.toggleHighContrast();
        });
        
        this.container.appendChild(instructions);
    }

    /**
     * Increase font size
     */
    increaseFontSize() {
        const currentSize = parseFloat(getComputedStyle(this.container).fontSize);
        this.container.style.fontSize = `${currentSize * 1.2}px`;
        this.updateStatus('Font size increased');
    }

    /**
     * Decrease font size
     */
    decreaseFontSize() {
        const currentSize = parseFloat(getComputedStyle(this.container).fontSize);
        this.container.style.fontSize = `${currentSize / 1.2}px`;
        this.updateStatus('Font size decreased');
    }

    /**
     * Toggle high contrast mode
     */
    toggleHighContrast() {
        this.container.classList.toggle('high-contrast');
        const isHighContrast = this.container.classList.contains('high-contrast');
        this.updateStatus(`High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`);
    }

    /**
     * Get header title based on current state
     */
    getHeaderTitle() {
        const ageGroup = this.config.targetAge.charAt(0).toUpperCase() + this.config.targetAge.slice(1);
        return `${ageGroup} Pupil Voice - EHCP Section ${this.config.ehcpSection}`;
    }

    /**
     * Get header subtitle based on current state
     */
    getHeaderSubtitle() {
        const sectionDescriptions = {
            'A': 'Your views, interests and hopes for the future',
            'B': 'Your special educational needs',
            'C': 'Your health needs',
            'D': 'Your social care needs',
            'E': 'Outcomes - what you want to achieve',
            'F': 'The support you need',
            'G': 'Health provision',
            'H': 'Social care provision'
        };
        
        return sectionDescriptions[this.config.ehcpSection] || `Section ${this.config.ehcpSection}`;
    }

    /**
     * Calculate progress percentage
     */
    calculateProgress() {
        const totalQuestions = this.getTotalQuestions();
        const answeredQuestions = Object.keys(this.state.responses).length;
        
        if (totalQuestions === 0) return 0;
        
        return Math.round((answeredQuestions / totalQuestions) * 100);
    }

    /**
     * Get total number of questions
     */
    getTotalQuestions() {
        let total = 0;
        
        for (let level = 1; level <= this.config.maxLevel; level++) {
            const questions = this.getQuestionsForLevel(level);
            total += questions.length;
        }
        
        return total;
    }

    /**
     * Get questions for a specific level
     */
    getQuestionsForLevel(level) {
        const questions = this.questionSets[this.config.targetAge]?.[this.config.ehcpSection]?.[level] || [];
        return questions;
    }

    /**
     * Get current question
     */
    getCurrentQuestion() {
        const questions = this.getQuestionsForLevel(this.state.currentLevel);
        return questions[this.state.currentQuestionIndex] || null;
    }

    /**
     * Select a scale item
     */
    selectScaleItem(questionId, value) {
        // Update response
        this.state.responses[questionId] = value;
        
        // Update UI
        const scaleItems = this.container.querySelectorAll('.graduated-question-scale-item');
        scaleItems.forEach(item => {
            const itemValue = parseInt(item.getAttribute('data-value'));
            
            if (itemValue === value) {
                item.classList.add('selected');
                item.setAttribute('aria-checked', 'true');
            } else {
                item.classList.remove('selected');
                item.setAttribute('aria-checked', 'false');
            }
        });
        
        this.updateStatus(`Selected: ${value}`);
    }

    /**
     * Toggle a multiselect option
     */
    toggleMultiselectOption(questionId, optionId) {
        // Initialize response array if not exists
        if (!Array.isArray(this.state.responses[questionId])) {
            this.state.responses[questionId] = [];
        }
        
        // Toggle option
        const index = this.state.responses[questionId].indexOf(optionId);
        
        if (index === -1) {
            // Add option
            this.state.responses[questionId].push(optionId);
            this.updateStatus(`Selected: ${optionId}`);
        } else {
            // Remove option
            this.state.responses[questionId].splice(index, 1);
            this.updateStatus(`Removed: ${optionId}`);
        }
        
        // Update UI
        const optionItem = this.container.querySelector(`.graduated-question-multiselect-item[data-option-id="${optionId}"]`);
        if (optionItem) {
            optionItem.classList.toggle('selected');
            optionItem.setAttribute('aria-checked', index === -1 ? 'true' : 'false');
        }
    }

    /**
     * Select a yes/no option
     */
    selectYesNoOption(questionId, value) {
        // Update response
        this.state.responses[questionId] = value;
        
        // Update UI
        const yesNoButtons = this.container.querySelectorAll('.graduated-question-yesno-button');
        yesNoButtons.forEach(button => {
            const buttonValue = button.getAttribute('data-value');
            
            if (buttonValue === value) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
        
        this.updateStatus(`Selected: ${value}`);
    }

    /**
     * Save current response and navigate to next question
     */
    saveAndNavigateToNextQuestion() {
        const currentQuestion = this.getCurrentQuestion();
        
        if (!currentQuestion) {
            return;
        }
        
        // Save response based on question type
        if (currentQuestion.type === 'open') {
            const responseInput = this.container.querySelector('.graduated-question-open-response');
            if (responseInput) {
                this.state.responses[currentQuestion.id] = responseInput.value.trim();
            }
        }
        
        // Check if response is valid
        if (!this.validateResponse(currentQuestion)) {
            this.updateStatus('Please provide an answer before continuing');
            return;
        }
        
        // Navigate to next question
        this.navigateToNextQuestion();
    }

    /**
     * Validate the current response
     */
    validateResponse(question) {
        const response = this.state.responses[question.id];
        
        // Skip validation if question can be skipped
        if (this.config.allowSkip) {
            return true;
        }
        
        // Validate based on question type
        switch (question.type) {
            case 'open':
                return response && response.trim().length > 0;
            case 'scale':
                return response !== undefined;
            case 'multiselect':
                return Array.isArray(response) && response.length > 0;
            case 'yesno':
                return response === 'yes' || response === 'no';
            default:
                return true;
        }
    }

    /**
     * Navigate to next question
     */
    navigateToNextQuestion() {
        const questions = this.getQuestionsForLevel(this.state.currentLevel);
        
        if (this.state.currentQuestionIndex < questions.length - 1) {
            // Move to next question in current level
            this.state.currentQuestionIndex++;
            this.createUI();
            this.updateStatus('Moved to next question');
        } else {
            // End of questions for this level
            if (!this.state.completedLevels.includes(this.state.currentLevel)) {
                this.state.completedLevels.push(this.state.currentLevel);
            }
            
            this.createUI();
            this.updateStatus('Level complete');
        }
    }

    /**
     * Navigate to previous question
     */
    navigateToPreviousQuestion() {
        if (this.state.currentQuestionIndex > 0) {
            this.state.currentQuestionIndex--;
            this.createUI();
            this.updateStatus('Moved to previous question');
        }
    }

    /**
     * Skip current question
     */
    skipCurrentQuestion() {
        const currentQuestion = this.getCurrentQuestion();
        
        if (currentQuestion) {
            // Mark as skipped
            this.state.responses[currentQuestion.id] = 'SKIPPED';
            this.navigateToNextQuestion();
            this.updateStatus('Question skipped');
        }
    }

    /**
     * Move to next level
     */
    moveToNextLevel() {
        if (this.state.currentLevel < this.config.maxLevel) {
            this.state.currentLevel++;
            this.state.currentQuestionIndex = 0;
            this.createUI();
            this.updateStatus(`Moved to level ${this.state.currentLevel}`);
        }
    }

    /**
     * Start a new session
     */
    startSession() {
        this.state.sessionActive = true;
        this.state.sessionStartTime = new Date();
        this.updateStatus('Session started');
    }

    /**
     * Pause the current session
     */
    pauseSession() {
        if (this.state.sessionActive) {
            this.state.sessionActive = false;
            this.state.sessionBreaks.push({
                startTime: new Date(),
                endTime: null
            });
            
            // Save current state
            this.saveState();
            
            // Show pause screen
            this.showPauseScreen();
            
            this.updateStatus('Session paused');
        }
    }

    /**
     * Resume a paused session
     */
    resumeSession() {
        if (!this.state.sessionActive) {
            this.state.sessionActive = true;
            
            // Update last break end time
            if (this.state.sessionBreaks.length > 0) {
                const lastBreak = this.state.sessionBreaks[this.state.sessionBreaks.length - 1];
                if (lastBreak && !lastBreak.endTime) {
                    lastBreak.endTime = new Date();
                }
            }
            
            // Recreate UI
            this.createUI();
            
            this.updateStatus('Session resumed');
        }
    }

    /**
     * Show pause screen
     */
    showPauseScreen() {
        // Clear the container
        this.container.innerHTML = '';
        
        // Create pause screen
        const pauseScreen = document.createElement('div');
        pauseScreen.classList.add('graduated-question-pause-screen');
        
        const pauseIcon = document.createElement('div');
        pauseIcon.classList.add('pause-icon');
        pauseIcon.innerHTML = '⏸️';
        pauseScreen.appendChild(pauseIcon);
        
        const pauseTitle = document.createElement('h2');
        pauseTitle.textContent = 'Session Paused';
        pauseScreen.appendChild(pauseTitle);
        
        const pauseMessage = document.createElement('p');
        pauseMessage.textContent = 'Your progress has been saved. You can continue later.';
        pauseScreen.appendChild(pauseMessage);
        
        const resumeButton = document.createElement('button');
        resumeButton.classList.add('graduated-question-resume-button');
        resumeButton.textContent = 'Resume Session';
        resumeButton.addEventListener('click', () => {
            this.resumeSession();
        });
        
        pauseScreen.appendChild(resumeButton);
        this.container.appendChild(pauseScreen);
    }

    /**
     * Save current state
     */
    saveState() {
        const state = {
            targetAge: this.config.targetAge,
            ehcpSection: this.config.ehcpSection,
            currentLevel: this.state.currentLevel,
            currentQuestionIndex: this.state.currentQuestionIndex,
            responses: this.state.responses,
            completedLevels: this.state.completedLevels,
            sessionStartTime: this.state.sessionStartTime,
            sessionBreaks: this.state.sessionBreaks
        };
        
        // Call onSave callback if provided
        if (this.config.onSave) {
            this.config.onSave(state);
        }
        
        // Save to local storage as fallback
        try {
            localStorage.setItem('graduatedQuestionState', JSON.stringify(state));
        } catch (e) {
            console.warn('Failed to save state to local storage:', e);
        }
        
        return state;
    }

    /**
     * Load saved state
     */
    loadState(state) {
        if (!state) {
            // Try to load from local storage
            try {
                const savedState = localStorage.getItem('graduatedQuestionState');
                if (savedState) {
                    state = JSON.parse(savedState);
                }
            } catch (e) {
                console.warn('Failed to load state from local storage:', e);
                return false;
            }
        }
        
        if (!state) {
            return false;
        }
        
        // Validate state
        if (state.targetAge !== this.config.targetAge || state.ehcpSection !== this.config.ehcpSection) {
            return false;
        }
        
        // Apply state
        this.state.currentLevel = state.currentLevel || this.config.startLevel;
        this.state.currentQuestionIndex = state.currentQuestionIndex || 0;
        this.state.responses = state.responses || {};
        this.state.completedLevels = state.completedLevels || [];
        this.state.sessionStartTime = state.sessionStartTime ? new Date(state.sessionStartTime) : new Date();
        this.state.sessionBreaks = state.sessionBreaks || [];
        
        return true;
    }

    /**
     * Finish the questionnaire
     */
    finishQuestionnaire() {
        // Save final state
        const finalState = this.saveState();
        
        // Call onComplete callback if provided
        if (this.config.onComplete) {
            this.config.onComplete(finalState);
        }
        
        // Show completion screen
        this.showCompletionScreen();
    }

    /**
     * Show completion screen
     */
    showCompletionScreen() {
        // Clear the container
        this.container.innerHTML = '';
        
        // Create completion screen
        const completionScreen = document.createElement('div');
        completionScreen.classList.add('graduated-question-completion-screen');
        
        const completionIcon = document.createElement('div');
        completionIcon.classList.add('completion-icon');
        completionIcon.innerHTML = '🎉';
        completionScreen.appendChild(completionIcon);
        
        const completionTitle = document.createElement('h2');
        completionTitle.textContent = 'Thank You!';
        completionScreen.appendChild(completionTitle);
        
        const completionMessage = document.createElement('p');
        completionMessage.textContent = 'Your voice has been heard. Thank you for sharing your thoughts and feelings.';
        completionScreen.appendChild(completionMessage);
        
        const statsContainer = document.createElement('div');
        statsContainer.classList.add('completion-stats');
        
        const questionsAnswered = Object.keys(this.state.responses).filter(key => this.state.responses[key] !== 'SKIPPED').length;
        const totalQuestions = this.getTotalQuestions();
        
        const statsMessage = document.createElement('p');
        statsMessage.textContent = `You answered ${questionsAnswered} out of ${totalQuestions} questions.`;
        statsContainer.appendChild(statsMessage);
        
        completionScreen.appendChild(statsContainer);
        
        this.container.appendChild(completionScreen);
    }

    /**
     * Update status message for accessibility
     */
    updateStatus(message) {
        if (!this.statusArea) return;
        
        this.statusArea.textContent = message;
        
        // Clear after 5 seconds
        setTimeout(() => {
            if (this.statusArea.textContent === message) {
                this.statusArea.textContent = '';
            }
        }, 5000);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GraduatedQuestionFlow };
} else {
    window.GraduatedQuestionFlow = GraduatedQuestionFlow;
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .graduated-question-flow {
        font-family: 'Open Sans', sans-serif;
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    .graduated-question-header {
        text-align: center;
        margin-bottom: 20px;
    }

    .graduated-question-title {
        font-size: 24px;
        color: #34495e;
        margin: 0 0 5px 0;
    }

    .graduated-question-subtitle {
        font-size: 16px;
        color: #7f8c8d;
    }

    .graduated-question-progress-container {
        margin-bottom: 20px;
    }

    .graduated-question-progress-bar {
        height: 10px;
        background-color: #ecf0f1;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 5px;
    }

    .graduated-question-progress-fill {
        height: 100%;
        background-color: #3498db;
        border-radius: 5px;
        transition: width 0.3s ease;
    }

    .graduated-question-progress-text {
        font-size: 14px;
        color: #7f8c8d;
        text-align: right;
    }

    .graduated-question-level-container {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .graduated-question-level-label {
        font-size: 14px;
        color: #7f8c8d;
        margin-right: 10px;
    }

    .graduated-question-level-indicator {
        display: flex;
        gap: 5px;
    }

    .graduated-question-level-dot {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #ecf0f1;
    }

    .graduated-question-level-dot.current {
        background-color: #3498db;
    }

    .graduated-question-level-dot.completed {
        background-color: #2ecc71;
    }

    .graduated-question-main-content {
        margin-bottom: 30px;
    }

    .graduated-question-container {
        animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .graduated-question-visual-prompt {
        text-align: center;
        margin-bottom: 20px;
    }

    .graduated-question-visual-prompt img {
        max-width: 100%;
        max-height: 200px;
        border-radius: 8px;
    }

    .graduated-question-text {
        font-size: 18px;
        margin-bottom: 10px;
        color: #34495e;
    }

    .graduated-question-support-text {
        font-size: 14px;
        color: #7f8c8d;
        font-style: italic;
        margin-bottom: 20px;
    }

    .graduated-question-response-area {
        margin-bottom: 20px;
    }

    .graduated-question-open-response {
        width: 100%;
        min-height: 100px;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-family: 'Open Sans', sans-serif;
        font-size: 16px;
        resize: vertical;
    }

    .graduated-question-open-response:focus {
        outline: 2px solid #3498db;
        border-color: #3498db;
    }

    .graduated-question-scale-container {
        margin-bottom: 20px;
    }

    .graduated-question-scale-visual {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .scale-type-smiley .graduated-question-scale-visual,
    .scale-type-stars .graduated-question-scale-visual {
        flex-direction: row;
        justify-content: space-between;
    }

    .graduated-question-scale-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .graduated-question-scale-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .graduated-question-scale-item.selected {
        border-color: #3498db;
        background-color: #ebf5fb;
    }

    .graduated-question-scale-item:focus {
        outline: 2px solid #9b59b6;
    }

    .scale-item-icon {
        font-size: 24px;
        margin-right: 10px;
    }

    .scale-item-label {
        font-size: 16px;
        color: #34495e;
    }

    .scale-type-smiley .scale-item-icon {
        font-size: 32px;
    }

    .scale-type-stars .scale-item-icon {
        font-size: 24px;
    }

    .scale-type-smiley .scale-item-label,
    .scale-type-stars .scale-item-label {
        display: none;
    }

    .scale-type-smiley .graduated-question-scale-item,
    .scale-type-stars .graduated-question-scale-item {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .graduated-question-multiselect-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }

    .graduated-question-multiselect-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .graduated-question-multiselect-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .graduated-question-multiselect-item.selected {
        border-color: #3498db;
        background-color: #ebf5fb;
    }

    .graduated-question-multiselect-item:focus {
        outline: 2px solid #9b59b6;
    }

    .multiselect-item-icon {
        font-size: 24px;
        margin-right: 10px;
    }

    .multiselect-item-text {
        font-size: 16px;
        color: #34495e;
    }

    .graduated-question-yesno-container {
        display: flex;
        gap: 20px;
        justify-content: center;
    }

    .graduated-question-yesno-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 15px 30px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        background-color: white;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .graduated-question-yesno-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .graduated-question-yesno-button.selected {
        border-color: #3498db;
        background-color: #ebf5fb;
    }

    .graduated-question-yesno-button:focus {
        outline: 2px solid #9b59b6;
    }

    .yesno-yes {
        color: #2ecc71;
    }

    .yesno-no {
        color: #e74c3c;
    }

    .yesno-icon {
        font-size: 32px;
        margin-bottom: 10px;
    }

    .yesno-text {
        font-size: 18px;
        font-weight: bold;
    }

    .graduated-question-completion {
        text-align: center;
        padding: 20px;
        background-color: #ebf5fb;
        border-radius: 8px;
    }

    .graduated-question-completion-icon {
        font-size: 48px;
        margin-bottom: 10px;
    }

    .graduated-question-next-level-button,
    .graduated-question-finish-button {
        padding: 10px 20px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        margin-top: 20px;
        transition: background-color 0.2s;
    }

    .graduated-question-next-level-button:hover,
    .graduated-question-finish-button:hover {
        background-color: #2980b9;
    }

    .graduated-question-navigation-area {
        display: flex;
        justify-content: space-between;
    }

    .graduated-question-nav-button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s;
    }

    .graduated-question-back-button {
        background-color: #7f8c8d;
        color: white;
    }

    .graduated-question-back-button:hover {
        background-color: #6c7a7a;
    }

    .graduated-question-back-button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    .graduated-question-skip-button {
        background-color: #95a5a6;
        color: white;
    }

    .graduated-question-skip-button:hover {
        background-color: #7f8c8d;
    }

    .graduated-question-next-button {
        background-color: #3498db;
        color: white;
    }

    .graduated-question-next-button:hover {
        background-color: #2980b9;
    }

    .graduated-question-voice-container {
        text-align: center;
        margin-top: 20px;
    }

    .graduated-question-voice-button {
        padding: 10px 20px;
        background-color: #9b59b6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s;
    }

    .graduated-question-voice-button:hover {
        background-color: #8e44ad;
    }

    .graduated-question-voice-button.recording {
        background-color: #e74c3c;
    }

    .voice-icon {
        margin-right: 5px;
    }

    .graduated-question-session-controls {
        text-align: center;
        margin-top: 20px;
    }

    .graduated-question-pause-button {
        padding: 8px 15px;
        background-color: #95a5a6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }

    .graduated-question-pause-button:hover {
        background-color: #7f8c8d;
    }

    .graduated-question-pause-screen {
        text-align: center;
        padding: 40px 20px;
    }

    .pause-icon {
        font-size: 48px;
        margin-bottom: 20px;
    }

    .graduated-question-resume-button {
        padding: 10px 20px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 20px;
        transition: background-color 0.2s;
    }

    .graduated-question-resume-button:hover {
        background-color: #2980b9;
    }

    .graduated-question-completion-screen {
        text-align: center;
        padding: 40px 20px;
    }

    .completion-icon {
        font-size: 48px;
        margin-bottom: 20px;
    }

    .completion-stats {
        margin-top: 20px;
        padding: 15px;
        background-color: #ebf5fb;
        border-radius: 8px;
    }

    .graduated-question-status {
        position: absolute;
        left: -9999px;
        height: 1px;
        width: 1px;
        overflow: hidden;
    }

    .graduated-question-keyboard-instructions {
        margin-top: 20px;
        font-size: 14px;
        color: #7f8c8d;
    }

    .graduated-question-keyboard-instructions summary {
        cursor: pointer;
        color: #3498db;
    }

    .graduated-question-keyboard-instructions ul {
        margin-top: 10px;
        padding-left: 20px;
    }

    .accessibility-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
    }

    .accessibility-controls button {
        padding: 5px 10px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background-color 0.2s;
    }

    .accessibility-controls button:hover {
        background-color: #2980b9;
    }

    /* Theme: Playful */
    .theme-playful {
        background-color: #f9f7e8;
        border: 3px solid #f1c40f;
    }

    .theme-playful .graduated-question-title {
        color: #e67e22;
    }

    .theme-playful .graduated-question-progress-fill {
        background-color: #f1c40f;
    }

    .theme-playful .graduated-question-level-dot.current {
        background-color: #e67e22;
    }

    .theme-playful .graduated-question-level-dot.completed {
        background-color: #f1c40f;
    }

    .theme-playful .graduated-question-scale-item.selected,
    .theme-playful .graduated-question-multiselect-item.selected,
    .theme-playful .graduated-question-yesno-button.selected {
        border-color: #e67e22;
        background-color: #fef9e7;
    }

    .theme-playful .graduated-question-next-button,
    .theme-playful .graduated-question-next-level-button,
    .theme-playful .graduated-question-finish-button,
    .theme-playful .graduated-question-resume-button {
        background-color: #e67e22;
    }

    .theme-playful .graduated-question-next-button:hover,
    .theme-playful .graduated-question-next-level-button:hover,
    .theme-playful .graduated-question-finish-button:hover,
    .theme-playful .graduated-question-resume-button:hover {
        background-color: #d35400;
    }

    /* Theme: Formal */
    .theme-formal {
        background-color: #f5f5f5;
        border: 1px solid #34495e;
    }

    .theme-formal .graduated-question-title {
        color: #2c3e50;
    }

    .theme-formal .graduated-question-progress-fill {
        background-color: #34495e;
    }

    .theme-formal .graduated-question-level-dot.current {
        background-color: #34495e;
    }

    .theme-formal .graduated-question-level-dot.completed {
        background-color: #7f8c8d;
    }

    .theme-formal .graduated-question-scale-item.selected,
    .theme-formal .graduated-question-multiselect-item.selected,
    .theme-formal .graduated-question-yesno-button.selected {
        border-color: #34495e;
        background-color: #f8f9fa;
    }

    .theme-formal .graduated-question-next-button,
    .theme-formal .graduated-question-next-level-button,
    .theme-formal .graduated-question-finish-button,
    .theme-formal .graduated-question-resume-button {
        background-color: #34495e;
    }

    .theme-formal .graduated-question-next-button:hover,
    .theme-formal .graduated-question-next-level-button:hover,
    .theme-formal .graduated-question-finish-button:hover,
    .theme-formal .graduated-question-resume-button:hover {
        background-color: #2c3e50;
    }

    /* High contrast mode */
    .high-contrast {
        background-color: black;
        color: white;
        border-color: yellow;
    }

    .high-contrast .graduated-question-title,
    .high-contrast .graduated-question-text,
    .high-contrast .scale-item-label,
    .high-contrast .multiselect-item-text {
        color: white;
    }

    .high-contrast .graduated-question-subtitle,
    .high-contrast .graduated-question-progress-text,
    .high-contrast .graduated-question-level-label,
    .high-contrast .graduated-question-support-text {
        color: #cccccc;
    }

    .high-contrast .graduated-question-progress-bar {
        background-color: #444444;
    }

    .high-contrast .graduated-question-progress-fill {
        background-color: yellow;
    }

    .high-contrast .graduated-question-level-dot {
        background-color: #444444;
    }

    .high-contrast .graduated-question-level-dot.current {
        background-color: yellow;
    }

    .high-contrast .graduated-question-level-dot.completed {
        background-color: white;
    }

    .high-contrast .graduated-question-scale-item,
    .high-contrast .graduated-question-multiselect-item,
    .high-contrast .graduated-question-yesno-button {
        background-color: black;
        border-color: white;
    }

    .high-contrast .graduated-question-scale-item.selected,
    .high-contrast .graduated-question-multiselect-item.selected,
    .high-contrast .graduated-question-yesno-button.selected {
        border-color: yellow;
        background-color: #333333;
    }

    .high-contrast .graduated-question-open-response {
        background-color: black;
        color: white;
        border-color: white;
    }

    .high-contrast .graduated-question-nav-button,
    .high-contrast .graduated-question-voice-button,
    .high-contrast .graduated-question-pause-button,
    .high-contrast .graduated-question-resume-button,
    .high-contrast .graduated-question-next-level-button,
    .high-contrast .graduated-question-finish-button {
        background-color: #333333;
        color: white;
        border: 1px solid white;
    }

    .high-contrast .graduated-question-nav-button:hover,
    .high-contrast .graduated-question-voice-button:hover,
    .high-contrast .graduated-question-pause-button:hover,
    .high-contrast .graduated-question-resume-button:hover,
    .high-contrast .graduated-question-next-level-button:hover,
    .high-contrast .graduated-question-finish-button:hover {
        background-color: #555555;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
        .graduated-question-flow {
            padding: 15px;
        }

        .graduated-question-multiselect-container {
            grid-template-columns: 1fr;
        }

        .graduated-question-scale-visual {
            flex-direction: column;
        }

        .scale-type-smiley .graduated-question-scale-visual,
        .scale-type-stars .graduated-question-scale-visual {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
        }

        .scale-type-smiley .graduated-question-scale-item,
        .scale-type-stars .graduated-question-scale-item {
            flex: 0 0 auto;
            margin: 5px;
        }
    }

    @media (max-width: 480px) {
        .graduated-question-title {
            font-size: 20px;
        }

        .graduated-question-text {
            font-size: 16px;
        }

        .graduated-question-yesno-container {
            flex-direction: column;
            gap: 10px;
        }

        .graduated-question-navigation-area {
            flex-direction: column;
            gap: 10px;
        }

        .graduated-question-nav-button {
            width: 100%;
        }
    }
`;

document.head.appendChild(style);
