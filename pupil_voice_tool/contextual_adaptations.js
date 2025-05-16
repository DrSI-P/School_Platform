/**
 * EdPsych Connect - Pupil Voice Tool
 * Contextual Adaptations Component
 * 
 * This module implements contextual adaptations for EHCNA pupil voice collection,
 * including familiar contexts, personalized prompts, and session management.
 */

class ContextualAdaptations {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            containerId: options.containerId || 'contextual-adaptations',
            width: options.width || '100%',
            targetAge: options.targetAge || 'primary', // primary, secondary, post16
            characterSet: options.characterSet || 'standard', // standard, inclusive, custom
            allowCustomCharacters: options.allowCustomCharacters !== undefined ? options.allowCustomCharacters : true,
            allowTeacherRecordings: options.allowTeacherRecordings !== undefined ? options.allowTeacherRecordings : true,
            sessionDuration: options.sessionDuration || 15, // minutes
            breakReminders: options.breakReminders !== undefined ? options.breakReminders : true,
            accessibilityMode: options.accessibilityMode || false,
            onSave: options.onSave || null,
            onComplete: options.onComplete || null,
            customCharacters: options.customCharacters || null,
            customPrompts: options.customPrompts || null,
            theme: options.theme || 'standard', // standard, playful, formal
            language: options.language || 'en-GB'
        };

        // State variables
        this.state = {
            selectedCharacter: null,
            customCharacterUrl: null,
            teacherPrompts: {},
            sessionStartTime: null,
            breakTimes: [],
            currentEnvironment: 'classroom', // classroom, playground, home, other
            sessionActive: false,
            sessionPaused: false
        };

        // Character sets
        this.characterSets = this.config.customCharacters || this.getDefaultCharacters();

        // Environment backgrounds
        this.environments = this.getEnvironments();

        // Initialize the component
        this.init();
    }

    /**
     * Initialize the contextual adaptations component
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
        this.container.classList.add('contextual-adaptations');
        this.container.setAttribute('role', 'application');
        this.container.setAttribute('aria-label', 'Contextual Adaptations for Pupil Voice');
        this.container.style.width = this.config.width;

        // Add theme class
        this.container.classList.add(`theme-${this.config.theme}`);

        // Create the UI
        this.createUI();

        // Set up event listeners
        this.setupEventListeners();

        // Set up accessibility features if enabled
        if (this.config.accessibilityMode) {
            this.setupAccessibilityFeatures();
        }

        // Start session
        this.startSession();
    }

    /**
     * Get default characters based on age group and character set
     */
    getDefaultCharacters() {
        const characters = {
            primary: {
                standard: [
                    {
                        id: 'primary_standard_1',
                        name: 'Alex',
                        image: 'characters/primary_alex.png',
                        description: 'Alex loves reading and playing football.',
                        voice: 'voices/primary_alex.mp3'
                    },
                    {
                        id: 'primary_standard_2',
                        name: 'Jasmine',
                        image: 'characters/primary_jasmine.png',
                        description: 'Jasmine enjoys art and helping others.',
                        voice: 'voices/primary_jasmine.mp3'
                    },
                    {
                        id: 'primary_standard_3',
                        name: 'Sam',
                        image: 'characters/primary_sam.png',
                        description: 'Sam likes science experiments and video games.',
                        voice: 'voices/primary_sam.mp3'
                    },
                    {
                        id: 'primary_standard_4',
                        name: 'Zoe',
                        image: 'characters/primary_zoe.png',
                        description: 'Zoe loves music and dancing.',
                        voice: 'voices/primary_zoe.mp3'
                    }
                ],
                inclusive: [
                    {
                        id: 'primary_inclusive_1',
                        name: 'Raj',
                        image: 'characters/primary_raj.png',
                        description: 'Raj uses a wheelchair and loves solving puzzles.',
                        voice: 'voices/primary_raj.mp3'
                    },
                    {
                        id: 'primary_inclusive_2',
                        name: 'Maya',
                        image: 'characters/primary_maya.png',
                        description: 'Maya has hearing aids and enjoys storytelling.',
                        voice: 'voices/primary_maya.mp3'
                    },
                    {
                        id: 'primary_inclusive_3',
                        name: 'Leo',
                        image: 'characters/primary_leo.png',
                        description: 'Leo has autism and is great at remembering facts.',
                        voice: 'voices/primary_leo.mp3'
                    },
                    {
                        id: 'primary_inclusive_4',
                        name: 'Ava',
                        image: 'characters/primary_ava.png',
                        description: 'Ava uses communication cards and loves animals.',
                        voice: 'voices/primary_ava.mp3'
                    }
                ]
            },
            secondary: {
                standard: [
                    // Secondary school characters
                ],
                inclusive: [
                    // Inclusive secondary school characters
                ]
            },
            post16: {
                standard: [
                    // Post-16 characters
                ],
                inclusive: [
                    // Inclusive post-16 characters
                ]
            }
        };

        return characters;
    }

    /**
     * Get environment backgrounds
     */
    getEnvironments() {
        return {
            classroom: {
                id: 'environment_classroom',
                name: 'Classroom',
                image: 'environments/classroom.png',
                description: 'A friendly classroom environment',
                soundEffect: 'sounds/classroom_ambient.mp3'
            },
            playground: {
                id: 'environment_playground',
                name: 'Playground',
                image: 'environments/playground.png',
                description: 'An outdoor playground',
                soundEffect: 'sounds/playground_ambient.mp3'
            },
            home: {
                id: 'environment_home',
                name: 'Home',
                image: 'environments/home.png',
                description: 'A comfortable home setting',
                soundEffect: 'sounds/home_ambient.mp3'
            },
            library: {
                id: 'environment_library',
                name: 'Library',
                image: 'environments/library.png',
                description: 'A quiet library',
                soundEffect: 'sounds/library_ambient.mp3'
            },
            sensory: {
                id: 'environment_sensory',
                name: 'Sensory Room',
                image: 'environments/sensory.png',
                description: 'A calming sensory room',
                soundEffect: 'sounds/sensory_ambient.mp3'
            }
        };
    }

    /**
     * Create the user interface
     */
    createUI() {
        // Clear the container
        this.container.innerHTML = '';

        // Create header
        const header = document.createElement('div');
        header.classList.add('contextual-adaptations-header');
        
        const title = document.createElement('h2');
        title.classList.add('contextual-adaptations-title');
        title.textContent = 'Choose Your Helper';
        header.appendChild(title);
        
        const subtitle = document.createElement('div');
        subtitle.classList.add('contextual-adaptations-subtitle');
        subtitle.textContent = 'Select a character to help you answer questions';
        header.appendChild(subtitle);
        
        this.container.appendChild(header);

        // Create character selection
        this.createCharacterSelection();

        // Create environment selection
        this.createEnvironmentSelection();

        // Create teacher prompt section if enabled
        if (this.config.allowTeacherRecordings) {
            this.createTeacherPromptSection();
        }

        // Create session management section
        this.createSessionManagement();

        // Create status message area for accessibility
        const statusArea = document.createElement('div');
        statusArea.classList.add('contextual-adaptations-status');
        statusArea.setAttribute('role', 'status');
        statusArea.setAttribute('aria-live', 'polite');
        this.container.appendChild(statusArea);
        this.statusArea = statusArea;
    }

    /**
     * Create character selection section
     */
    createCharacterSelection() {
        const characterSection = document.createElement('div');
        characterSection.classList.add('contextual-adaptations-section');
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = 'Choose a Character';
        characterSection.appendChild(sectionTitle);
        
        const characterGrid = document.createElement('div');
        characterGrid.classList.add('character-grid');
        
        // Get characters for current age group and set
        const characters = this.characterSets[this.config.targetAge]?.[this.config.characterSet] || [];
        
        characters.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.classList.add('character-card');
            characterCard.setAttribute('data-character-id', character.id);
            
            if (this.state.selectedCharacter === character.id) {
                characterCard.classList.add('selected');
            }
            
            const characterImage = document.createElement('div');
            characterImage.classList.add('character-image');
            
            const img = document.createElement('img');
            img.src = character.image;
            img.alt = character.name;
            characterImage.appendChild(img);
            
            const characterInfo = document.createElement('div');
            characterInfo.classList.add('character-info');
            
            const characterName = document.createElement('div');
            characterName.classList.add('character-name');
            characterName.textContent = character.name;
            characterInfo.appendChild(characterName);
            
            const characterDesc = document.createElement('div');
            characterDesc.classList.add('character-description');
            characterDesc.textContent = character.description;
            characterInfo.appendChild(characterDesc);
            
            characterCard.appendChild(characterImage);
            characterCard.appendChild(characterInfo);
            
            // Add select button
            const selectButton = document.createElement('button');
            selectButton.classList.add('character-select-button');
            selectButton.textContent = 'Choose';
            selectButton.setAttribute('aria-label', `Choose ${character.name}`);
            
            selectButton.addEventListener('click', () => {
                this.selectCharacter(character.id);
            });
            
            characterCard.appendChild(selectButton);
            
            // Add listen button if voice is available
            if (character.voice) {
                const listenButton = document.createElement('button');
                listenButton.classList.add('character-listen-button');
                listenButton.innerHTML = '🔊 Listen';
                listenButton.setAttribute('aria-label', `Listen to ${character.name}'s voice`);
                
                listenButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.playCharacterVoice(character.voice);
                });
                
                characterCard.appendChild(listenButton);
            }
            
            characterGrid.appendChild(characterCard);
        });
        
        characterSection.appendChild(characterGrid);
        
        // Add custom character upload if allowed
        if (this.config.allowCustomCharacters) {
            const customCharacterSection = document.createElement('div');
            customCharacterSection.classList.add('custom-character-section');
            
            const customTitle = document.createElement('h4');
            customTitle.textContent = 'Or Upload Your Own Character';
            customCharacterSection.appendChild(customTitle);
            
            const customUpload = document.createElement('div');
            customUpload.classList.add('custom-character-upload');
            
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'custom-character-upload';
            fileInput.accept = 'image/*';
            fileInput.setAttribute('aria-label', 'Upload your own character image');
            
            fileInput.addEventListener('change', (e) => {
                this.handleCustomCharacterUpload(e);
            });
            
            const fileLabel = document.createElement('label');
            fileLabel.htmlFor = 'custom-character-upload';
            fileLabel.classList.add('custom-upload-button');
            fileLabel.textContent = 'Upload Image';
            
            customUpload.appendChild(fileInput);
            customUpload.appendChild(fileLabel);
            
            // Preview area for custom character
            const previewArea = document.createElement('div');
            previewArea.classList.add('custom-character-preview');
            previewArea.style.display = 'none';
            
            const previewImage = document.createElement('img');
            previewImage.id = 'custom-character-preview-image';
            previewImage.alt = 'Custom character preview';
            
            const previewName = document.createElement('input');
            previewName.type = 'text';
            previewName.placeholder = 'Character Name';
            previewName.classList.add('custom-character-name-input');
            
            const selectCustomButton = document.createElement('button');
            selectCustomButton.classList.add('select-custom-character-button');
            selectCustomButton.textContent = 'Use This Character';
            selectCustomButton.addEventListener('click', () => {
                this.selectCustomCharacter(previewName.value || 'Custom Character');
            });
            
            previewArea.appendChild(previewImage);
            previewArea.appendChild(previewName);
            previewArea.appendChild(selectCustomButton);
            
            customCharacterSection.appendChild(customUpload);
            customCharacterSection.appendChild(previewArea);
            
            characterSection.appendChild(customCharacterSection);
            
            this.customPreviewArea = previewArea;
            this.customPreviewImage = previewImage;
            this.customNameInput = previewName;
        }
        
        this.container.appendChild(characterSection);
    }

    /**
     * Create environment selection section
     */
    createEnvironmentSelection() {
        const environmentSection = document.createElement('div');
        environmentSection.classList.add('contextual-adaptations-section');
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = 'Choose Your Environment';
        environmentSection.appendChild(sectionTitle);
        
        const environmentGrid = document.createElement('div');
        environmentGrid.classList.add('environment-grid');
        
        Object.values(this.environments).forEach(environment => {
            const environmentCard = document.createElement('div');
            environmentCard.classList.add('environment-card');
            environmentCard.setAttribute('data-environment-id', environment.id);
            
            if (this.state.currentEnvironment === environment.id) {
                environmentCard.classList.add('selected');
            }
            
            const environmentImage = document.createElement('div');
            environmentImage.classList.add('environment-image');
            
            const img = document.createElement('img');
            img.src = environment.image;
            img.alt = environment.name;
            environmentImage.appendChild(img);
            
            const environmentInfo = document.createElement('div');
            environmentInfo.classList.add('environment-info');
            
            const environmentName = document.createElement('div');
            environmentName.classList.add('environment-name');
            environmentName.textContent = environment.name;
            environmentInfo.appendChild(environmentName);
            
            const environmentDesc = document.createElement('div');
            environmentDesc.classList.add('environment-description');
            environmentDesc.textContent = environment.description;
            environmentInfo.appendChild(environmentDesc);
            
            environmentCard.appendChild(environmentImage);
            environmentCard.appendChild(environmentInfo);
            
            // Add select button
            const selectButton = document.createElement('button');
            selectButton.classList.add('environment-select-button');
            selectButton.textContent = 'Choose';
            selectButton.setAttribute('aria-label', `Choose ${environment.name} environment`);
            
            selectButton.addEventListener('click', () => {
                this.selectEnvironment(environment.id);
            });
            
            environmentCard.appendChild(selectButton);
            
            // Add listen button if sound effect is available
            if (environment.soundEffect) {
                const listenButton = document.createElement('button');
                listenButton.classList.add('environment-listen-button');
                listenButton.innerHTML = '🔊 Listen';
                listenButton.setAttribute('aria-label', `Listen to ${environment.name} sounds`);
                
                listenButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.playEnvironmentSound(environment.soundEffect);
                });
                
                environmentCard.appendChild(listenButton);
            }
            
            environmentGrid.appendChild(environmentCard);
        });
        
        environmentSection.appendChild(environmentGrid);
        this.container.appendChild(environmentSection);
    }

    /**
     * Create teacher prompt section
     */
    createTeacherPromptSection() {
        const promptSection = document.createElement('div');
        promptSection.classList.add('contextual-adaptations-section');
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = 'Teacher Voice Prompts';
        promptSection.appendChild(sectionTitle);
        
        const promptDescription = document.createElement('p');
        promptDescription.textContent = 'Record or upload voice prompts from a familiar teacher or adult';
        promptSection.appendChild(promptDescription);
        
        const promptControls = document.createElement('div');
        promptControls.classList.add('teacher-prompt-controls');
        
        // Record new prompt
        const recordContainer = document.createElement('div');
        recordContainer.classList.add('teacher-prompt-record');
        
        const promptLabel = document.createElement('input');
        promptLabel.type = 'text';
        promptLabel.placeholder = 'Prompt Label (e.g., "Welcome" or "Great job!")';
        promptLabel.classList.add('teacher-prompt-label');
        recordContainer.appendChild(promptLabel);
        
        const recordButton = document.createElement('button');
        recordButton.classList.add('teacher-prompt-record-button');
        recordButton.innerHTML = '🎤 Record Prompt';
        recordButton.setAttribute('aria-label', 'Record a teacher voice prompt');
        
        recordButton.addEventListener('click', () => {
            if (promptLabel.value.trim()) {
                this.recordTeacherPrompt(promptLabel.value.trim());
            } else {
                this.updateStatus('Please enter a label for the prompt');
            }
        });
        
        recordContainer.appendChild(recordButton);
        promptControls.appendChild(recordContainer);
        
        // Upload prompt
        const uploadContainer = document.createElement('div');
        uploadContainer.classList.add('teacher-prompt-upload');
        
        const uploadLabel = document.createElement('input');
        uploadLabel.type = 'text';
        uploadLabel.placeholder = 'Prompt Label (e.g., "Instructions" or "Question")';
        uploadLabel.classList.add('teacher-prompt-label');
        uploadContainer.appendChild(uploadLabel);
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'teacher-prompt-upload';
        fileInput.accept = 'audio/*';
        fileInput.setAttribute('aria-label', 'Upload a teacher voice prompt');
        
        fileInput.addEventListener('change', (e) => {
            if (uploadLabel.value.trim()) {
                this.handleTeacherPromptUpload(e, uploadLabel.value.trim());
            } else {
                this.updateStatus('Please enter a label for the prompt');
                fileInput.value = '';
            }
        });
        
        const fileLabel = document.createElement('label');
        fileLabel.htmlFor = 'teacher-prompt-upload';
        fileLabel.classList.add('teacher-prompt-upload-button');
        fileLabel.textContent = 'Upload Audio';
        
        uploadContainer.appendChild(fileInput);
        uploadContainer.appendChild(fileLabel);
        promptControls.appendChild(uploadContainer);
        
        promptSection.appendChild(promptControls);
        
        // Saved prompts list
        const savedPromptsContainer = document.createElement('div');
        savedPromptsContainer.classList.add('saved-prompts-container');
        
        const savedPromptsTitle = document.createElement('h4');
        savedPromptsTitle.textContent = 'Saved Prompts';
        savedPromptsContainer.appendChild(savedPromptsTitle);
        
        const savedPromptsList = document.createElement('div');
        savedPromptsList.classList.add('saved-prompts-list');
        
        // Add saved prompts if any
        if (Object.keys(this.state.teacherPrompts).length > 0) {
            Object.entries(this.state.teacherPrompts).forEach(([label, url]) => {
                const promptItem = this.createPromptListItem(label, url);
                savedPromptsList.appendChild(promptItem);
            });
        } else {
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-prompts-message');
            emptyMessage.textContent = 'No prompts saved yet';
            savedPromptsList.appendChild(emptyMessage);
        }
        
        savedPromptsContainer.appendChild(savedPromptsList);
        promptSection.appendChild(savedPromptsContainer);
        
        this.container.appendChild(promptSection);
        this.savedPromptsList = savedPromptsList;
    }

    /**
     * Create a prompt list item
     */
    createPromptListItem(label, url) {
        const promptItem = document.createElement('div');
        promptItem.classList.add('saved-prompt-item');
        
        const promptLabel = document.createElement('div');
        promptLabel.classList.add('saved-prompt-label');
        promptLabel.textContent = label;
        promptItem.appendChild(promptLabel);
        
        const promptControls = document.createElement('div');
        promptControls.classList.add('saved-prompt-controls');
        
        const playButton = document.createElement('button');
        playButton.classList.add('saved-prompt-play');
        playButton.innerHTML = '▶️';
        playButton.setAttribute('aria-label', `Play ${label} prompt`);
        
        playButton.addEventListener('click', () => {
            this.playTeacherPrompt(url);
        });
        
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('saved-prompt-delete');
        deleteButton.innerHTML = '🗑️';
        deleteButton.setAttribute('aria-label', `Delete ${label} prompt`);
        
        deleteButton.addEventListener('click', () => {
            this.deleteTeacherPrompt(label);
        });
        
        promptControls.appendChild(playButton);
        promptControls.appendChild(deleteButton);
        promptItem.appendChild(promptControls);
        
        return promptItem;
    }

    /**
     * Create session management section
     */
    createSessionManagement() {
        const sessionSection = document.createElement('div');
        sessionSection.classList.add('contextual-adaptations-section');
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = 'Session Management';
        sessionSection.appendChild(sectionTitle);
        
        const sessionControls = document.createElement('div');
        sessionControls.classList.add('session-controls');
        
        // Session duration setting
        const durationContainer = document.createElement('div');
        durationContainer.classList.add('session-duration-container');
        
        const durationLabel = document.createElement('label');
        durationLabel.htmlFor = 'session-duration';
        durationLabel.textContent = 'Session Duration (minutes):';
        durationContainer.appendChild(durationLabel);
        
        const durationInput = document.createElement('input');
        durationInput.type = 'number';
        durationInput.id = 'session-duration';
        durationInput.min = '5';
        durationInput.max = '60';
        durationInput.value = this.config.sessionDuration;
        durationInput.classList.add('session-duration-input');
        
        durationInput.addEventListener('change', () => {
            const value = parseInt(durationInput.value);
            if (value >= 5 && value <= 60) {
                this.config.sessionDuration = value;
            } else {
                durationInput.value = this.config.sessionDuration;
            }
        });
        
        durationContainer.appendChild(durationInput);
        sessionControls.appendChild(durationContainer);
        
        // Break reminder toggle
        const reminderContainer = document.createElement('div');
        reminderContainer.classList.add('break-reminder-container');
        
        const reminderCheckbox = document.createElement('input');
        reminderCheckbox.type = 'checkbox';
        reminderCheckbox.id = 'break-reminder';
        reminderCheckbox.checked = this.config.breakReminders;
        reminderCheckbox.classList.add('break-reminder-checkbox');
        
        reminderCheckbox.addEventListener('change', () => {
            this.config.breakReminders = reminderCheckbox.checked;
        });
        
        const reminderLabel = document.createElement('label');
        reminderLabel.htmlFor = 'break-reminder';
        reminderLabel.textContent = 'Show break reminders';
        
        reminderContainer.appendChild(reminderCheckbox);
        reminderContainer.appendChild(reminderLabel);
        sessionControls.appendChild(reminderContainer);
        
        // Session buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('session-button-container');
        
        const startButton = document.createElement('button');
        startButton.classList.add('session-start-button');
        startButton.textContent = 'Start Session';
        startButton.disabled = this.state.sessionActive;
        
        startButton.addEventListener('click', () => {
            this.startSession();
        });
        
        const pauseButton = document.createElement('button');
        pauseButton.classList.add('session-pause-button');
        pauseButton.textContent = this.state.sessionPaused ? 'Resume Session' : 'Pause Session';
        pauseButton.disabled = !this.state.sessionActive;
        
        pauseButton.addEventListener('click', () => {
            if (this.state.sessionPaused) {
                this.resumeSession();
            } else {
                this.pauseSession();
            }
        });
        
        const endButton = document.createElement('button');
        endButton.classList.add('session-end-button');
        endButton.textContent = 'End Session';
        endButton.disabled = !this.state.sessionActive;
        
        endButton.addEventListener('click', () => {
            this.endSession();
        });
        
        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(pauseButton);
        buttonContainer.appendChild(endButton);
        sessionControls.appendChild(buttonContainer);
        
        sessionSection.appendChild(sessionControls);
        
        // Session timer display
        const timerDisplay = document.createElement('div');
        timerDisplay.classList.add('session-timer-display');
        
        const timeElapsed = document.createElement('div');
        timeElapsed.classList.add('time-elapsed');
        timeElapsed.innerHTML = '<span>Time Elapsed:</span> <span class="time-value">00:00</span>';
        timerDisplay.appendChild(timeElapsed);
        
        const timeRemaining = document.createElement('div');
        timeRemaining.classList.add('time-remaining');
        timeRemaining.innerHTML = '<span>Time Remaining:</span> <span class="time-value">00:00</span>';
        timerDisplay.appendChild(timeRemaining);
        
        sessionSection.appendChild(timerDisplay);
        this.container.appendChild(sessionSection);
        
        // Save references for updating
        this.timeElapsedValue = timeElapsed.querySelector('.time-value');
        this.timeRemainingValue = timeRemaining.querySelector('.time-value');
        this.startButton = startButton;
        this.pauseButton = pauseButton;
        this.endButton = endButton;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only process if the adaptations container is focused
            if (!this.container.contains(document.activeElement) && document.activeElement !== document.body) {
                return;
            }
            
            if (e.key === 'Escape') {
                // ESC key to pause session
                if (this.state.sessionActive && !this.state.sessionPaused) {
                    this.pauseSession();
                }
            }
        });
    }

    /**
     * Set up accessibility features
     */
    setupAccessibilityFeatures() {
        // Add keyboard navigation instructions
        const instructions = document.createElement('div');
        instructions.classList.add('contextual-adaptations-keyboard-instructions');
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
     * Select a character
     */
    selectCharacter(characterId) {
        this.state.selectedCharacter = characterId;
        this.state.customCharacterUrl = null;
        
        // Update UI
        const characterCards = this.container.querySelectorAll('.character-card');
        characterCards.forEach(card => {
            if (card.getAttribute('data-character-id') === characterId) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        
        // Find character details
        const characters = this.characterSets[this.config.targetAge]?.[this.config.characterSet] || [];
        const character = characters.find(c => c.id === characterId);
        
        if (character) {
            this.updateStatus(`Selected character: ${character.name}`);
        }
        
        // Save state
        this.saveState();
    }

    /**
     * Handle custom character upload
     */
    handleCustomCharacterUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            this.updateStatus('Please upload an image file');
            event.target.value = '';
            return;
        }
        
        // Create object URL
        const url = URL.createObjectURL(file);
        
        // Update preview
        this.customPreviewImage.src = url;
        this.customPreviewArea.style.display = 'block';
        this.customNameInput.focus();
        
        // Save URL for later use
        this.tempCustomCharacterUrl = url;
    }

    /**
     * Select custom character
     */
    selectCustomCharacter(name) {
        if (!this.tempCustomCharacterUrl) {
            this.updateStatus('Please upload an image first');
            return;
        }
        
        // Set as selected character
        this.state.selectedCharacter = 'custom';
        this.state.customCharacterUrl = this.tempCustomCharacterUrl;
        this.state.customCharacterName = name;
        
        // Update UI
        const characterCards = this.container.querySelectorAll('.character-card');
        characterCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        this.updateStatus(`Selected custom character: ${name}`);
        
        // Save state
        this.saveState();
    }

    /**
     * Play character voice
     */
    playCharacterVoice(voiceUrl) {
        const audio = new Audio(voiceUrl);
        audio.play();
    }

    /**
     * Select an environment
     */
    selectEnvironment(environmentId) {
        this.state.currentEnvironment = environmentId;
        
        // Update UI
        const environmentCards = this.container.querySelectorAll('.environment-card');
        environmentCards.forEach(card => {
            if (card.getAttribute('data-environment-id') === environmentId) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        
        // Find environment details
        const environment = this.environments[environmentId];
        
        if (environment) {
            this.updateStatus(`Selected environment: ${environment.name}`);
        }
        
        // Save state
        this.saveState();
    }

    /**
     * Play environment sound
     */
    playEnvironmentSound(soundUrl) {
        const audio = new Audio(soundUrl);
        audio.play();
    }

    /**
     * Record teacher prompt
     */
    recordTeacherPrompt(label) {
        // Check if browser supports recording
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.updateStatus('Voice recording is not supported in this browser');
            return;
        }
        
        // Request microphone access
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.updateStatus('Recording started. Speak now.');
                
                // Create media recorder
                const mediaRecorder = new MediaRecorder(stream);
                const audioChunks = [];
                
                // Collect data
                mediaRecorder.addEventListener('dataavailable', event => {
                    audioChunks.push(event.data);
                });
                
                // When recording stops
                mediaRecorder.addEventListener('stop', () => {
                    // Create blob and URL
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    
                    // Save prompt
                    this.saveTeacherPrompt(label, audioUrl);
                    
                    // Stop all tracks
                    stream.getTracks().forEach(track => track.stop());
                });
                
                // Start recording
                mediaRecorder.start();
                
                // Create recording UI
                this.showRecordingUI(mediaRecorder);
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
                this.updateStatus('Error accessing microphone. Please check permissions.');
            });
    }

    /**
     * Show recording UI
     */
    showRecordingUI(mediaRecorder) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.classList.add('recording-overlay');
        
        const recordingBox = document.createElement('div');
        recordingBox.classList.add('recording-box');
        
        const recordingTitle = document.createElement('h3');
        recordingTitle.textContent = 'Recording in Progress';
        recordingBox.appendChild(recordingTitle);
        
        const recordingAnimation = document.createElement('div');
        recordingAnimation.classList.add('recording-animation');
        recordingBox.appendChild(recordingAnimation);
        
        const recordingTimer = document.createElement('div');
        recordingTimer.classList.add('recording-timer');
        recordingTimer.textContent = '00:00';
        recordingBox.appendChild(recordingTimer);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('recording-buttons');
        
        const stopButton = document.createElement('button');
        stopButton.classList.add('recording-stop-button');
        stopButton.textContent = 'Stop Recording';
        
        stopButton.addEventListener('click', () => {
            mediaRecorder.stop();
            document.body.removeChild(overlay);
            clearInterval(timerInterval);
        });
        
        buttonContainer.appendChild(stopButton);
        recordingBox.appendChild(buttonContainer);
        
        overlay.appendChild(recordingBox);
        document.body.appendChild(overlay);
        
        // Start timer
        let seconds = 0;
        const timerInterval = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            recordingTimer.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            
            // Auto-stop after 2 minutes
            if (seconds >= 120) {
                mediaRecorder.stop();
                document.body.removeChild(overlay);
                clearInterval(timerInterval);
            }
        }, 1000);
    }

    /**
     * Handle teacher prompt upload
     */
    handleTeacherPromptUpload(event, label) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Check if file is audio
        if (!file.type.startsWith('audio/')) {
            this.updateStatus('Please upload an audio file');
            event.target.value = '';
            return;
        }
        
        // Create object URL
        const url = URL.createObjectURL(file);
        
        // Save prompt
        this.saveTeacherPrompt(label, url);
        
        // Reset file input
        event.target.value = '';
    }

    /**
     * Save teacher prompt
     */
    saveTeacherPrompt(label, url) {
        // Save to state
        this.state.teacherPrompts[label] = url;
        
        // Update UI
        this.updateTeacherPromptsList();
        
        // Save state
        this.saveState();
        
        this.updateStatus(`Saved prompt: ${label}`);
    }

    /**
     * Play teacher prompt
     */
    playTeacherPrompt(url) {
        const audio = new Audio(url);
        audio.play();
    }

    /**
     * Delete teacher prompt
     */
    deleteTeacherPrompt(label) {
        // Remove from state
        delete this.state.teacherPrompts[label];
        
        // Update UI
        this.updateTeacherPromptsList();
        
        // Save state
        this.saveState();
        
        this.updateStatus(`Deleted prompt: ${label}`);
    }

    /**
     * Update teacher prompts list
     */
    updateTeacherPromptsList() {
        if (!this.savedPromptsList) return;
        
        // Clear list
        this.savedPromptsList.innerHTML = '';
        
        // Add saved prompts if any
        if (Object.keys(this.state.teacherPrompts).length > 0) {
            Object.entries(this.state.teacherPrompts).forEach(([label, url]) => {
                const promptItem = this.createPromptListItem(label, url);
                this.savedPromptsList.appendChild(promptItem);
            });
        } else {
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-prompts-message');
            emptyMessage.textContent = 'No prompts saved yet';
            this.savedPromptsList.appendChild(emptyMessage);
        }
    }

    /**
     * Start a session
     */
    startSession() {
        if (this.state.sessionActive) return;
        
        this.state.sessionActive = true;
        this.state.sessionPaused = false;
        this.state.sessionStartTime = new Date();
        this.state.breakTimes = [];
        
        // Update UI
        if (this.startButton) this.startButton.disabled = true;
        if (this.pauseButton) {
            this.pauseButton.disabled = false;
            this.pauseButton.textContent = 'Pause Session';
        }
        if (this.endButton) this.endButton.disabled = false;
        
        // Start timer
        this.startTimer();
        
        // Set up break reminders if enabled
        if (this.config.breakReminders) {
            this.setupBreakReminders();
        }
        
        this.updateStatus('Session started');
        
        // Save state
        this.saveState();
    }

    /**
     * Pause a session
     */
    pauseSession() {
        if (!this.state.sessionActive || this.state.sessionPaused) return;
        
        this.state.sessionPaused = true;
        
        // Record break start time
        this.state.breakTimes.push({
            start: new Date(),
            end: null
        });
        
        // Update UI
        if (this.pauseButton) {
            this.pauseButton.textContent = 'Resume Session';
        }
        
        // Stop timer
        clearInterval(this.timerInterval);
        
        this.updateStatus('Session paused');
        
        // Save state
        this.saveState();
    }

    /**
     * Resume a session
     */
    resumeSession() {
        if (!this.state.sessionActive || !this.state.sessionPaused) return;
        
        this.state.sessionPaused = false;
        
        // Record break end time
        if (this.state.breakTimes.length > 0) {
            const lastBreak = this.state.breakTimes[this.state.breakTimes.length - 1];
            if (lastBreak && !lastBreak.end) {
                lastBreak.end = new Date();
            }
        }
        
        // Update UI
        if (this.pauseButton) {
            this.pauseButton.textContent = 'Pause Session';
        }
        
        // Restart timer
        this.startTimer();
        
        this.updateStatus('Session resumed');
        
        // Save state
        this.saveState();
    }

    /**
     * End a session
     */
    endSession() {
        if (!this.state.sessionActive) return;
        
        this.state.sessionActive = false;
        this.state.sessionPaused = false;
        
        // Stop timer
        clearInterval(this.timerInterval);
        
        // Update UI
        if (this.startButton) this.startButton.disabled = false;
        if (this.pauseButton) {
            this.pauseButton.disabled = true;
            this.pauseButton.textContent = 'Pause Session';
        }
        if (this.endButton) this.endButton.disabled = true;
        
        // Calculate session statistics
        const sessionStats = this.calculateSessionStats();
        
        // Show session summary
        this.showSessionSummary(sessionStats);
        
        this.updateStatus('Session ended');
        
        // Save state
        this.saveState();
        
        // Call onComplete callback if provided
        if (this.config.onComplete) {
            this.config.onComplete(sessionStats);
        }
    }

    /**
     * Start timer
     */
    startTimer() {
        // Clear existing timer
        clearInterval(this.timerInterval);
        
        // Update immediately
        this.updateTimerDisplay();
        
        // Set up interval
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        if (!this.timeElapsedValue || !this.timeRemainingValue) return;
        
        // Calculate elapsed time
        const now = new Date();
        let elapsedMs = now - this.state.sessionStartTime;
        
        // Subtract break times
        this.state.breakTimes.forEach(breakTime => {
            if (breakTime.end) {
                elapsedMs -= (breakTime.end - breakTime.start);
            } else {
                elapsedMs -= (now - breakTime.start);
            }
        });
        
        // Calculate remaining time
        const sessionDurationMs = this.config.sessionDuration * 60 * 1000;
        const remainingMs = Math.max(0, sessionDurationMs - elapsedMs);
        
        // Format times
        const elapsedMinutes = Math.floor(elapsedMs / 60000);
        const elapsedSeconds = Math.floor((elapsedMs % 60000) / 1000);
        
        const remainingMinutes = Math.floor(remainingMs / 60000);
        const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
        
        // Update displays
        this.timeElapsedValue.textContent = `${elapsedMinutes.toString().padStart(2, '0')}:${elapsedSeconds.toString().padStart(2, '0')}`;
        this.timeRemainingValue.textContent = `${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        
        // Check if session time is up
        if (remainingMs <= 0 && this.state.sessionActive && !this.state.sessionPaused) {
            this.endSession();
        }
    }

    /**
     * Set up break reminders
     */
    setupBreakReminders() {
        // Clear existing reminders
        this.breakReminders = [];
        
        // Calculate reminder times (at 1/3 and 2/3 of session)
        const sessionDurationMs = this.config.sessionDuration * 60 * 1000;
        
        const firstReminderTime = sessionDurationMs / 3;
        const secondReminderTime = (sessionDurationMs * 2) / 3;
        
        // Set timeouts
        this.breakReminders.push(
            setTimeout(() => {
                if (this.state.sessionActive && !this.state.sessionPaused) {
                    this.showBreakReminder(1);
                }
            }, firstReminderTime)
        );
        
        this.breakReminders.push(
            setTimeout(() => {
                if (this.state.sessionActive && !this.state.sessionPaused) {
                    this.showBreakReminder(2);
                }
            }, secondReminderTime)
        );
    }

    /**
     * Show break reminder
     */
    showBreakReminder(reminderNumber) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.classList.add('break-reminder-overlay');
        
        const reminderBox = document.createElement('div');
        reminderBox.classList.add('break-reminder-box');
        
        const reminderTitle = document.createElement('h3');
        reminderTitle.textContent = 'Time for a Break?';
        reminderBox.appendChild(reminderTitle);
        
        const reminderMessage = document.createElement('p');
        reminderMessage.textContent = 'Would you like to take a short break? It\'s good to rest your mind.';
        reminderBox.appendChild(reminderMessage);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('reminder-buttons');
        
        const takeBreakButton = document.createElement('button');
        takeBreakButton.classList.add('take-break-button');
        takeBreakButton.textContent = 'Take a Break';
        
        takeBreakButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
            this.pauseSession();
        });
        
        const continueButton = document.createElement('button');
        continueButton.classList.add('continue-button');
        continueButton.textContent = 'Continue Session';
        
        continueButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        buttonContainer.appendChild(takeBreakButton);
        buttonContainer.appendChild(continueButton);
        reminderBox.appendChild(buttonContainer);
        
        overlay.appendChild(reminderBox);
        document.body.appendChild(overlay);
        
        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 30000);
    }

    /**
     * Calculate session statistics
     */
    calculateSessionStats() {
        const now = new Date();
        const sessionEndTime = now;
        
        // Calculate total session duration
        let totalDurationMs = sessionEndTime - this.state.sessionStartTime;
        
        // Calculate active time (excluding breaks)
        let activeTimeMs = totalDurationMs;
        
        this.state.breakTimes.forEach(breakTime => {
            const breakEnd = breakTime.end || now;
            activeTimeMs -= (breakEnd - breakTime.start);
        });
        
        // Calculate number of breaks
        const breakCount = this.state.breakTimes.length;
        
        // Calculate total break time
        let totalBreakTimeMs = 0;
        
        this.state.breakTimes.forEach(breakTime => {
            const breakEnd = breakTime.end || now;
            totalBreakTimeMs += (breakEnd - breakTime.start);
        });
        
        return {
            sessionStartTime: this.state.sessionStartTime,
            sessionEndTime: sessionEndTime,
            totalDurationMs: totalDurationMs,
            activeTimeMs: activeTimeMs,
            breakCount: breakCount,
            totalBreakTimeMs: totalBreakTimeMs,
            selectedCharacter: this.state.selectedCharacter,
            customCharacterName: this.state.customCharacterName,
            environment: this.state.currentEnvironment
        };
    }

    /**
     * Show session summary
     */
    showSessionSummary(stats) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.classList.add('session-summary-overlay');
        
        const summaryBox = document.createElement('div');
        summaryBox.classList.add('session-summary-box');
        
        const summaryTitle = document.createElement('h3');
        summaryTitle.textContent = 'Session Summary';
        summaryBox.appendChild(summaryTitle);
        
        const summaryContent = document.createElement('div');
        summaryContent.classList.add('session-summary-content');
        
        // Format times
        const totalMinutes = Math.floor(stats.totalDurationMs / 60000);
        const totalSeconds = Math.floor((stats.totalDurationMs % 60000) / 1000);
        
        const activeMinutes = Math.floor(stats.activeTimeMs / 60000);
        const activeSeconds = Math.floor((stats.activeTimeMs % 60000) / 1000);
        
        const breakMinutes = Math.floor(stats.totalBreakTimeMs / 60000);
        const breakSeconds = Math.floor((stats.totalBreakTimeMs % 60000) / 1000);
        
        // Create summary items
        const totalTimeItem = document.createElement('div');
        totalTimeItem.classList.add('summary-item');
        totalTimeItem.innerHTML = `<span class="summary-label">Total Session Time:</span> <span class="summary-value">${totalMinutes}m ${totalSeconds}s</span>`;
        summaryContent.appendChild(totalTimeItem);
        
        const activeTimeItem = document.createElement('div');
        activeTimeItem.classList.add('summary-item');
        activeTimeItem.innerHTML = `<span class="summary-label">Active Time:</span> <span class="summary-value">${activeMinutes}m ${activeSeconds}s</span>`;
        summaryContent.appendChild(activeTimeItem);
        
        const breakCountItem = document.createElement('div');
        breakCountItem.classList.add('summary-item');
        breakCountItem.innerHTML = `<span class="summary-label">Number of Breaks:</span> <span class="summary-value">${stats.breakCount}</span>`;
        summaryContent.appendChild(breakCountItem);
        
        const breakTimeItem = document.createElement('div');
        breakTimeItem.classList.add('summary-item');
        breakTimeItem.innerHTML = `<span class="summary-label">Total Break Time:</span> <span class="summary-value">${breakMinutes}m ${breakSeconds}s</span>`;
        summaryContent.appendChild(breakTimeItem);
        
        // Add character and environment info
        let characterName = 'None selected';
        
        if (stats.selectedCharacter === 'custom') {
            characterName = stats.customCharacterName || 'Custom Character';
        } else if (stats.selectedCharacter) {
            const characters = this.characterSets[this.config.targetAge]?.[this.config.characterSet] || [];
            const character = characters.find(c => c.id === stats.selectedCharacter);
            if (character) {
                characterName = character.name;
            }
        }
        
        const characterItem = document.createElement('div');
        characterItem.classList.add('summary-item');
        characterItem.innerHTML = `<span class="summary-label">Selected Character:</span> <span class="summary-value">${characterName}</span>`;
        summaryContent.appendChild(characterItem);
        
        let environmentName = 'None selected';
        
        if (stats.environment) {
            const environment = this.environments[stats.environment];
            if (environment) {
                environmentName = environment.name;
            }
        }
        
        const environmentItem = document.createElement('div');
        environmentItem.classList.add('summary-item');
        environmentItem.innerHTML = `<span class="summary-label">Selected Environment:</span> <span class="summary-value">${environmentName}</span>`;
        summaryContent.appendChild(environmentItem);
        
        summaryBox.appendChild(summaryContent);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.classList.add('summary-close-button');
        closeButton.textContent = 'Close';
        
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        summaryBox.appendChild(closeButton);
        overlay.appendChild(summaryBox);
        document.body.appendChild(overlay);
    }

    /**
     * Save current state
     */
    saveState() {
        const state = {
            selectedCharacter: this.state.selectedCharacter,
            customCharacterUrl: this.state.customCharacterUrl,
            customCharacterName: this.state.customCharacterName,
            teacherPrompts: this.state.teacherPrompts,
            currentEnvironment: this.state.currentEnvironment,
            sessionDuration: this.config.sessionDuration,
            breakReminders: this.config.breakReminders
        };
        
        // Call onSave callback if provided
        if (this.config.onSave) {
            this.config.onSave(state);
        }
        
        // Save to local storage as fallback
        try {
            localStorage.setItem('contextualAdaptationsState', JSON.stringify(state));
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
                const savedState = localStorage.getItem('contextualAdaptationsState');
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
        
        // Apply state
        this.state.selectedCharacter = state.selectedCharacter || null;
        this.state.customCharacterUrl = state.customCharacterUrl || null;
        this.state.customCharacterName = state.customCharacterName || null;
        this.state.teacherPrompts = state.teacherPrompts || {};
        this.state.currentEnvironment = state.currentEnvironment || 'classroom';
        
        if (state.sessionDuration) {
            this.config.sessionDuration = state.sessionDuration;
        }
        
        if (state.breakReminders !== undefined) {
            this.config.breakReminders = state.breakReminders;
        }
        
        return true;
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
    module.exports = { ContextualAdaptations };
} else {
    window.ContextualAdaptations = ContextualAdaptations;
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .contextual-adaptations {
        font-family: 'Open Sans', sans-serif;
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    .contextual-adaptations-header {
        text-align: center;
        margin-bottom: 20px;
    }

    .contextual-adaptations-title {
        font-size: 24px;
        color: #34495e;
        margin: 0 0 5px 0;
    }

    .contextual-adaptations-subtitle {
        font-size: 16px;
        color: #7f8c8d;
    }

    .contextual-adaptations-section {
        margin-bottom: 30px;
        padding: 15px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
    }

    .contextual-adaptations-section h3 {
        font-size: 18px;
        color: #34495e;
        margin-top: 0;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ecf0f1;
    }

    .contextual-adaptations-section h4 {
        font-size: 16px;
        color: #34495e;
        margin-top: 15px;
        margin-bottom: 10px;
    }

    /* Character Selection */
    .character-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
    }

    .character-card {
        border: 2px solid #ecf0f1;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .character-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .character-card.selected {
        border-color: #3498db;
    }

    .character-image {
        height: 150px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
    }

    .character-image img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }

    .character-info {
        padding: 10px;
    }

    .character-name {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 5px;
        color: #34495e;
    }

    .character-description {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 10px;
    }

    .character-select-button {
        width: 100%;
        padding: 8px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .character-select-button:hover {
        background-color: #2980b9;
    }

    .character-listen-button {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        background-color: #95a5a6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .character-listen-button:hover {
        background-color: #7f8c8d;
    }

    /* Custom Character Upload */
    .custom-character-section {
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px dashed #ecf0f1;
    }

    .custom-character-upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 15px;
    }

    .custom-upload-button {
        display: inline-block;
        padding: 8px 15px;
        background-color: #3498db;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .custom-upload-button:hover {
        background-color: #2980b9;
    }

    input[type="file"] {
        display: none;
    }

    .custom-character-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 15px;
    }

    #custom-character-preview-image {
        max-width: 150px;
        max-height: 150px;
        margin-bottom: 10px;
        border-radius: 8px;
    }

    .custom-character-name-input {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ecf0f1;
        border-radius: 4px;
    }

    .select-custom-character-button {
        width: 100%;
        padding: 8px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .select-custom-character-button:hover {
        background-color: #2980b9;
    }

    /* Environment Selection */
    .environment-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
    }

    .environment-card {
        border: 2px solid #ecf0f1;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .environment-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .environment-card.selected {
        border-color: #3498db;
    }

    .environment-image {
        height: 120px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
    }

    .environment-image img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
    }

    .environment-info {
        padding: 10px;
    }

    .environment-name {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 5px;
        color: #34495e;
    }

    .environment-description {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 10px;
    }

    .environment-select-button {
        width: 100%;
        padding: 8px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .environment-select-button:hover {
        background-color: #2980b9;
    }

    .environment-listen-button {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        background-color: #95a5a6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .environment-listen-button:hover {
        background-color: #7f8c8d;
    }

    /* Teacher Prompt Section */
    .teacher-prompt-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 20px;
    }

    .teacher-prompt-record,
    .teacher-prompt-upload {
        flex: 1;
        min-width: 250px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .teacher-prompt-label {
        width: 100%;
        padding: 8px;
        border: 1px solid #ecf0f1;
        border-radius: 4px;
    }

    .teacher-prompt-record-button,
    .teacher-prompt-upload-button {
        padding: 8px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
        text-align: center;
    }

    .teacher-prompt-record-button:hover,
    .teacher-prompt-upload-button:hover {
        background-color: #2980b9;
    }

    .saved-prompts-container {
        margin-top: 20px;
    }

    .saved-prompts-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .saved-prompt-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
    }

    .saved-prompt-label {
        font-weight: bold;
        color: #34495e;
    }

    .saved-prompt-controls {
        display: flex;
        gap: 5px;
    }

    .saved-prompt-play,
    .saved-prompt-delete {
        width: 30px;
        height: 30px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .saved-prompt-play {
        background-color: #2ecc71;
        color: white;
    }

    .saved-prompt-delete {
        background-color: #e74c3c;
        color: white;
    }

    .empty-prompts-message {
        padding: 10px;
        text-align: center;
        color: #7f8c8d;
        font-style: italic;
    }

    /* Recording Overlay */
    .recording-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .recording-box {
        width: 300px;
        padding: 20px;
        background-color: white;
        border-radius: 8px;
        text-align: center;
    }

    .recording-animation {
        width: 60px;
        height: 60px;
        margin: 20px auto;
        border-radius: 50%;
        background-color: #e74c3c;
        animation: pulse 1s infinite alternate;
    }

    @keyframes pulse {
        from { transform: scale(1); opacity: 1; }
        to { transform: scale(1.2); opacity: 0.8; }
    }

    .recording-timer {
        font-size: 24px;
        margin-bottom: 20px;
    }

    .recording-buttons {
        display: flex;
        justify-content: center;
    }

    .recording-stop-button {
        padding: 10px 20px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    /* Session Management */
    .session-controls {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 20px;
    }

    .session-duration-container,
    .break-reminder-container {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .session-duration-input {
        width: 60px;
        padding: 5px;
        border: 1px solid #ecf0f1;
        border-radius: 4px;
    }

    .break-reminder-checkbox {
        width: 18px;
        height: 18px;
    }

    .session-button-container {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }

    .session-start-button,
    .session-pause-button,
    .session-end-button {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .session-start-button {
        background-color: #2ecc71;
        color: white;
    }

    .session-start-button:hover {
        background-color: #27ae60;
    }

    .session-pause-button {
        background-color: #f39c12;
        color: white;
    }

    .session-pause-button:hover {
        background-color: #d35400;
    }

    .session-end-button {
        background-color: #e74c3c;
        color: white;
    }

    .session-end-button:hover {
        background-color: #c0392b;
    }

    .session-button-container button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    .session-timer-display {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
    }

    .time-elapsed,
    .time-remaining {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .time-value {
        font-size: 20px;
        font-weight: bold;
        color: #34495e;
    }

    /* Break Reminder Overlay */
    .break-reminder-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .break-reminder-box {
        width: 300px;
        padding: 20px;
        background-color: white;
        border-radius: 8px;
        text-align: center;
    }

    .reminder-buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    }

    .take-break-button,
    .continue-button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .take-break-button {
        background-color: #3498db;
        color: white;
    }

    .continue-button {
        background-color: #95a5a6;
        color: white;
    }

    /* Session Summary Overlay */
    .session-summary-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .session-summary-box {
        width: 400px;
        padding: 20px;
        background-color: white;
        border-radius: 8px;
    }

    .session-summary-content {
        margin: 20px 0;
    }

    .summary-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #ecf0f1;
    }

    .summary-label {
        font-weight: bold;
        color: #34495e;
    }

    .summary-value {
        color: #7f8c8d;
    }

    .summary-close-button {
        width: 100%;
        padding: 10px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
    }

    /* Accessibility */
    .contextual-adaptations-status {
        position: absolute;
        left: -9999px;
        height: 1px;
        width: 1px;
        overflow: hidden;
    }

    .contextual-adaptations-keyboard-instructions {
        margin-top: 20px;
        font-size: 14px;
        color: #7f8c8d;
    }

    .contextual-adaptations-keyboard-instructions summary {
        cursor: pointer;
        color: #3498db;
    }

    .contextual-adaptations-keyboard-instructions ul {
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

    .theme-playful .contextual-adaptations-title {
        color: #e67e22;
    }

    .theme-playful .character-card.selected,
    .theme-playful .environment-card.selected {
        border-color: #e67e22;
    }

    .theme-playful .character-select-button,
    .theme-playful .environment-select-button,
    .theme-playful .teacher-prompt-record-button,
    .theme-playful .teacher-prompt-upload-button,
    .theme-playful .custom-upload-button,
    .theme-playful .select-custom-character-button,
    .theme-playful .summary-close-button {
        background-color: #e67e22;
    }

    .theme-playful .character-select-button:hover,
    .theme-playful .environment-select-button:hover,
    .theme-playful .teacher-prompt-record-button:hover,
    .theme-playful .teacher-prompt-upload-button:hover,
    .theme-playful .custom-upload-button:hover,
    .theme-playful .select-custom-character-button:hover,
    .theme-playful .summary-close-button:hover {
        background-color: #d35400;
    }

    /* Theme: Formal */
    .theme-formal {
        background-color: #f5f5f5;
        border: 1px solid #34495e;
    }

    .theme-formal .contextual-adaptations-title {
        color: #2c3e50;
    }

    .theme-formal .character-card.selected,
    .theme-formal .environment-card.selected {
        border-color: #34495e;
    }

    .theme-formal .character-select-button,
    .theme-formal .environment-select-button,
    .theme-formal .teacher-prompt-record-button,
    .theme-formal .teacher-prompt-upload-button,
    .theme-formal .custom-upload-button,
    .theme-formal .select-custom-character-button,
    .theme-formal .summary-close-button {
        background-color: #34495e;
    }

    .theme-formal .character-select-button:hover,
    .theme-formal .environment-select-button:hover,
    .theme-formal .teacher-prompt-record-button:hover,
    .theme-formal .teacher-prompt-upload-button:hover,
    .theme-formal .custom-upload-button:hover,
    .theme-formal .select-custom-character-button:hover,
    .theme-formal .summary-close-button:hover {
        background-color: #2c3e50;
    }

    /* High contrast mode */
    .high-contrast {
        background-color: black;
        color: white;
        border-color: yellow;
    }

    .high-contrast .contextual-adaptations-title,
    .high-contrast .contextual-adaptations-section h3,
    .high-contrast .contextual-adaptations-section h4,
    .high-contrast .character-name,
    .high-contrast .environment-name,
    .high-contrast .saved-prompt-label,
    .high-contrast .summary-label,
    .high-contrast .time-value {
        color: white;
    }

    .high-contrast .contextual-adaptations-subtitle,
    .high-contrast .character-description,
    .high-contrast .environment-description,
    .high-contrast .summary-value {
        color: #cccccc;
    }

    .high-contrast .contextual-adaptations-section {
        background-color: #222222;
        box-shadow: 0 1px 5px rgba(255, 255, 255, 0.1);
    }

    .high-contrast .contextual-adaptations-section h3 {
        border-bottom-color: #444444;
    }

    .high-contrast .character-card,
    .high-contrast .environment-card {
        border-color: #444444;
        background-color: #222222;
    }

    .high-contrast .character-card.selected,
    .high-contrast .environment-card.selected {
        border-color: yellow;
    }

    .high-contrast .character-image,
    .high-contrast .environment-image {
        background-color: #333333;
    }

    .high-contrast .teacher-prompt-label,
    .high-contrast .custom-character-name-input,
    .high-contrast .session-duration-input {
        background-color: black;
        color: white;
        border-color: #444444;
    }

    .high-contrast .saved-prompt-item {
        background-color: #333333;
    }

    .high-contrast .session-timer-display {
        background-color: #333333;
    }

    .high-contrast .character-select-button,
    .high-contrast .environment-select-button,
    .high-contrast .teacher-prompt-record-button,
    .high-contrast .teacher-prompt-upload-button,
    .high-contrast .custom-upload-button,
    .high-contrast .select-custom-character-button,
    .high-contrast .session-start-button,
    .high-contrast .session-pause-button,
    .high-contrast .session-end-button,
    .high-contrast .summary-close-button {
        background-color: #555555;
        color: white;
        border: 1px solid white;
    }

    .high-contrast .character-select-button:hover,
    .high-contrast .environment-select-button:hover,
    .high-contrast .teacher-prompt-record-button:hover,
    .high-contrast .teacher-prompt-upload-button:hover,
    .high-contrast .custom-upload-button:hover,
    .high-contrast .select-custom-character-button:hover,
    .high-contrast .session-start-button:hover,
    .high-contrast .session-pause-button:hover,
    .high-contrast .session-end-button:hover,
    .high-contrast .summary-close-button:hover {
        background-color: #777777;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
        .contextual-adaptations {
            padding: 15px;
        }

        .character-grid,
        .environment-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }

        .teacher-prompt-controls {
            flex-direction: column;
        }

        .session-button-container {
            flex-direction: column;
        }

        .session-timer-display {
            flex-direction: column;
            gap: 10px;
            align-items: center;
        }
    }

    @media (max-width: 480px) {
        .contextual-adaptations-title {
            font-size: 20px;
        }

        .character-grid,
        .environment-grid {
            grid-template-columns: 1fr;
        }

        .session-duration-container,
        .break-reminder-container {
            flex-direction: column;
            align-items: flex-start;
        }
    }
`;

document.head.appendChild(style);
