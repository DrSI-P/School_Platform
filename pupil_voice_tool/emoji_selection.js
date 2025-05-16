/**
 * EdPsych Connect - Pupil Voice Tool
 * Emoji Selection Component for EHCNA Multimodal Communication
 * 
 * This module implements the emoji selection interface for pupils to express
 * their emotions and feelings during EHCNA processes and other pupil voice activities.
 */

class EmojiSelection {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            containerId: options.containerId || 'emoji-selection-container',
            width: options.width || '100%',
            categories: options.categories || [
                {
                    id: 'basic',
                    name: 'Basic Feelings',
                    emojis: [
                        { code: '😊', name: 'happy', description: 'Happy, joyful, pleased' },
                        { code: '😢', name: 'sad', description: 'Sad, unhappy, upset' },
                        { code: '😠', name: 'angry', description: 'Angry, cross, mad' },
                        { code: '😨', name: 'scared', description: 'Scared, afraid, frightened' },
                        { code: '😐', name: 'neutral', description: 'Neutral, okay, fine' },
                        { code: '😴', name: 'tired', description: 'Tired, sleepy, exhausted' },
                        { code: '🤔', name: 'thinking', description: 'Thinking, wondering, confused' },
                        { code: '😲', name: 'surprised', description: 'Surprised, shocked, amazed' },
                        { code: '😍', name: 'love', description: 'Love, adore, really like' },
                        { code: '😭', name: 'crying', description: 'Crying, very sad, upset' },
                        { code: '😱', name: 'terrified', description: 'Terrified, very scared' },
                        { code: '🤒', name: 'sick', description: 'Sick, ill, unwell' },
                        { code: '😎', name: 'cool', description: 'Cool, confident, relaxed' },
                        { code: '🙄', name: 'bored', description: 'Bored, uninterested' },
                        { code: '😤', name: 'frustrated', description: 'Frustrated, annoyed' },
                        { code: '😇', name: 'innocent', description: 'Innocent, angelic, good' }
                    ]
                },
                {
                    id: 'school',
                    name: 'School Feelings',
                    emojis: [
                        { code: '📚', name: 'studying', description: 'Studying, learning' },
                        { code: '🤓', name: 'clever', description: 'Clever, smart, knowledgeable' },
                        { code: '😫', name: 'stressed', description: 'Stressed, overwhelmed' },
                        { code: '🙋', name: 'participating', description: 'Participating, engaged' },
                        { code: '😶', name: 'quiet', description: 'Quiet, not speaking' },
                        { code: '😕', name: 'confused', description: 'Confused, not understanding' },
                        { code: '😞', name: 'disappointed', description: 'Disappointed, let down' },
                        { code: '😌', name: 'relieved', description: 'Relieved, task completed' },
                        { code: '🏆', name: 'achieving', description: 'Achieving, successful' },
                        { code: '😳', name: 'embarrassed', description: 'Embarrassed, self-conscious' },
                        { code: '😖', name: 'worried', description: 'Worried about work or tests' },
                        { code: '🤯', name: 'mind-blown', description: 'Mind blown, overwhelmed' },
                        { code: '😏', name: 'smug', description: 'Smug, pleased with self' },
                        { code: '😔', name: 'thoughtful', description: 'Thoughtful, reflective' },
                        { code: '😬', name: 'nervous', description: 'Nervous, anxious' },
                        { code: '🥱', name: 'bored-school', description: 'Bored in lessons' }
                    ]
                },
                {
                    id: 'social',
                    name: 'Social Feelings',
                    emojis: [
                        { code: '👫', name: 'friends', description: 'Friends, friendship' },
                        { code: '😥', name: 'lonely', description: 'Lonely, left out' },
                        { code: '🤗', name: 'included', description: 'Included, welcomed' },
                        { code: '😟', name: 'worried-social', description: 'Worried about friends' },
                        { code: '😈', name: 'mischievous', description: 'Mischievous, naughty' },
                        { code: '😰', name: 'anxious-social', description: 'Anxious in social situations' },
                        { code: '🙂', name: 'getting-along', description: 'Getting along with others' },
                        { code: '😠', name: 'bullied', description: 'Being bullied or picked on' },
                        { code: '😡', name: 'angry-others', description: 'Angry with others' },
                        { code: '🤝', name: 'helping', description: 'Helping others' },
                        { code: '👊', name: 'fighting', description: 'Fighting or arguing' },
                        { code: '🤐', name: 'secret', description: 'Keeping secrets' },
                        { code: '🥰', name: 'loved', description: 'Feeling loved' },
                        { code: '😒', name: 'annoyed-others', description: 'Annoyed with others' },
                        { code: '🤥', name: 'lying', description: 'Lying or not telling truth' },
                        { code: '🤔', name: 'unsure-social', description: 'Unsure about others' }
                    ]
                },
                {
                    id: 'physical',
                    name: 'Physical Feelings',
                    emojis: [
                        { code: '🏃', name: 'energetic', description: 'Energetic, active' },
                        { code: '😴', name: 'tired-physical', description: 'Tired, no energy' },
                        { code: '🤒', name: 'ill', description: 'Ill, sick, unwell' },
                        { code: '🤕', name: 'hurt', description: 'Hurt, in pain' },
                        { code: '🤢', name: 'sick-nauseous', description: 'Feeling sick, nauseous' },
                        { code: '🥵', name: 'hot', description: 'Hot, warm, sweaty' },
                        { code: '🥶', name: 'cold', description: 'Cold, chilly, freezing' },
                        { code: '🤤', name: 'hungry', description: 'Hungry, want food' },
                        { code: '🥴', name: 'dizzy', description: 'Dizzy, woozy, unsteady' },
                        { code: '🤧', name: 'sneezing', description: 'Sneezing, having a cold' },
                        { code: '🤮', name: 'vomiting', description: 'Vomiting, being sick' },
                        { code: '🥱', name: 'yawning', description: 'Yawning, very tired' },
                        { code: '💪', name: 'strong', description: 'Strong, powerful' },
                        { code: '🦵', name: 'leg-pain', description: 'Leg pain or injury' },
                        { code: '🦾', name: 'arm-pain', description: 'Arm pain or injury' },
                        { code: '🧠', name: 'headache', description: 'Headache, head hurting' }
                    ]
                }
            ],
            defaultCategory: options.defaultCategory || 'basic',
            multipleSelection: options.multipleSelection !== undefined ? options.multipleSelection : true,
            showIntensity: options.showIntensity !== undefined ? options.showIntensity : true,
            intensityLevels: options.intensityLevels || 5,
            allowComments: options.allowComments !== undefined ? options.allowComments : true,
            prompt: options.prompt || 'How are you feeling?',
            onSave: options.onSave || null,
            accessibilityMode: options.accessibilityMode || false,
            voiceCommands: options.voiceCommands !== undefined ? options.voiceCommands : true,
            keyboardShortcuts: options.keyboardShortcuts !== undefined ? options.keyboardShortcuts : true
        };

        // State variables
        this.state = {
            currentCategory: this.config.defaultCategory,
            selectedEmojis: [],
            intensities: {},
            comment: ''
        };

        // Initialize the component
        this.init();
    }

    /**
     * Initialize the emoji selection component
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
        this.container.classList.add('emoji-selection-container');
        this.container.setAttribute('role', 'application');
        this.container.setAttribute('aria-label', 'Emoji Selection Tool');
        this.container.style.width = this.config.width;

        // Create the UI
        this.createUI();

        // Set up event listeners
        this.setupEventListeners();

        // Set up keyboard shortcuts if enabled
        if (this.config.keyboardShortcuts) {
            this.setupKeyboardShortcuts();
        }

        // Set up voice commands if enabled
        if (this.config.voiceCommands) {
            this.setupVoiceCommands();
        }

        // Set up accessibility features if enabled
        if (this.config.accessibilityMode) {
            this.setupAccessibilityFeatures();
        }
    }

    /**
     * Create the user interface
     */
    createUI() {
        // Clear the container
        this.container.innerHTML = '';

        // Create the prompt area
        const promptArea = document.createElement('div');
        promptArea.classList.add('emoji-prompt');
        promptArea.textContent = this.config.prompt;
        this.container.appendChild(promptArea);

        // Create category tabs
        const categoryTabs = document.createElement('div');
        categoryTabs.classList.add('emoji-category-tabs');
        categoryTabs.setAttribute('role', 'tablist');
        
        this.config.categories.forEach(category => {
            const tab = document.createElement('button');
            tab.classList.add('emoji-category-tab');
            tab.setAttribute('data-category', category.id);
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', category.id === this.state.currentCategory ? 'true' : 'false');
            tab.setAttribute('aria-controls', `emoji-grid-${category.id}`);
            tab.textContent = category.name;
            
            if (category.id === this.state.currentCategory) {
                tab.classList.add('active');
            }
            
            tab.addEventListener('click', () => this.selectCategory(category.id));
            categoryTabs.appendChild(tab);
        });
        
        this.container.appendChild(categoryTabs);

        // Create emoji grid container
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('emoji-grid-container');
        
        // Create emoji grids for each category
        this.config.categories.forEach(category => {
            const grid = document.createElement('div');
            grid.id = `emoji-grid-${category.id}`;
            grid.classList.add('emoji-grid');
            grid.setAttribute('role', 'tabpanel');
            grid.setAttribute('aria-labelledby', `emoji-category-tab-${category.id}`);
            
            if (category.id !== this.state.currentCategory) {
                grid.style.display = 'none';
            }
            
            // Create emoji items
            category.emojis.forEach(emoji => {
                const emojiItem = document.createElement('button');
                emojiItem.classList.add('emoji-item');
                emojiItem.setAttribute('data-emoji', emoji.code);
                emojiItem.setAttribute('data-name', emoji.name);
                emojiItem.setAttribute('aria-label', emoji.description);
                emojiItem.setAttribute('role', 'checkbox');
                emojiItem.setAttribute('aria-checked', 'false');
                
                // Check if this emoji is selected
                if (this.state.selectedEmojis.some(e => e.code === emoji.code)) {
                    emojiItem.classList.add('selected');
                    emojiItem.setAttribute('aria-checked', 'true');
                }
                
                // Create emoji display
                const emojiDisplay = document.createElement('span');
                emojiDisplay.classList.add('emoji-display');
                emojiDisplay.textContent = emoji.code;
                emojiItem.appendChild(emojiDisplay);
                
                // Create emoji name
                const emojiName = document.createElement('span');
                emojiName.classList.add('emoji-name');
                emojiName.textContent = this.capitalizeFirstLetter(emoji.name.replace(/-/g, ' '));
                emojiItem.appendChild(emojiName);
                
                emojiItem.addEventListener('click', () => this.toggleEmoji(emoji));
                grid.appendChild(emojiItem);
            });
            
            gridContainer.appendChild(grid);
        });
        
        this.container.appendChild(gridContainer);

        // Create selected emojis area
        const selectedArea = document.createElement('div');
        selectedArea.classList.add('emoji-selected-area');
        
        const selectedLabel = document.createElement('div');
        selectedLabel.classList.add('emoji-selected-label');
        selectedLabel.textContent = 'Selected:';
        selectedArea.appendChild(selectedLabel);
        
        const selectedEmojis = document.createElement('div');
        selectedEmojis.classList.add('emoji-selected-emojis');
        
        if (this.state.selectedEmojis.length === 0) {
            const noSelection = document.createElement('span');
            noSelection.classList.add('emoji-no-selection');
            noSelection.textContent = 'No emojis selected';
            selectedEmojis.appendChild(noSelection);
        } else {
            this.state.selectedEmojis.forEach(emoji => {
                const selectedItem = document.createElement('div');
                selectedItem.classList.add('emoji-selected-item');
                
                const emojiCode = document.createElement('span');
                emojiCode.classList.add('emoji-selected-code');
                emojiCode.textContent = emoji.code;
                selectedItem.appendChild(emojiCode);
                
                const emojiRemove = document.createElement('button');
                emojiRemove.classList.add('emoji-remove-button');
                emojiRemove.setAttribute('aria-label', `Remove ${emoji.description}`);
                emojiRemove.innerHTML = '&times;';
                emojiRemove.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeEmoji(emoji);
                });
                selectedItem.appendChild(emojiRemove);
                
                selectedEmojis.appendChild(selectedItem);
            });
        }
        
        selectedArea.appendChild(selectedEmojis);
        this.container.appendChild(selectedArea);

        // Create intensity sliders if enabled
        if (this.config.showIntensity && this.state.selectedEmojis.length > 0) {
            const intensityArea = document.createElement('div');
            intensityArea.classList.add('emoji-intensity-area');
            
            const intensityLabel = document.createElement('div');
            intensityLabel.classList.add('emoji-intensity-label');
            intensityLabel.textContent = 'Intensity:';
            intensityArea.appendChild(intensityLabel);
            
            const intensitySliders = document.createElement('div');
            intensitySliders.classList.add('emoji-intensity-sliders');
            
            this.state.selectedEmojis.forEach(emoji => {
                const sliderContainer = document.createElement('div');
                sliderContainer.classList.add('emoji-intensity-container');
                
                const emojiLabel = document.createElement('span');
                emojiLabel.classList.add('emoji-intensity-emoji');
                emojiLabel.textContent = emoji.code;
                sliderContainer.appendChild(emojiLabel);
                
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '1';
                slider.max = this.config.intensityLevels.toString();
                slider.value = this.state.intensities[emoji.code] || '3';
                slider.classList.add('emoji-intensity-slider');
                slider.setAttribute('aria-label', `Intensity for ${emoji.description}`);
                
                slider.addEventListener('input', () => {
                    this.setIntensity(emoji.code, parseInt(slider.value));
                });
                
                sliderContainer.appendChild(slider);
                
                const valueDisplay = document.createElement('div');
                valueDisplay.classList.add('emoji-intensity-value');
                
                // Create visual dots for intensity
                for (let i = 1; i <= this.config.intensityLevels; i++) {
                    const dot = document.createElement('span');
                    dot.classList.add('emoji-intensity-dot');
                    if (i <= (this.state.intensities[emoji.code] || 3)) {
                        dot.classList.add('active');
                    }
                    valueDisplay.appendChild(dot);
                }
                
                sliderContainer.appendChild(valueDisplay);
                intensitySliders.appendChild(sliderContainer);
            });
            
            intensityArea.appendChild(intensitySliders);
            this.container.appendChild(intensityArea);
        }

        // Create comment area if enabled
        if (this.config.allowComments) {
            const commentArea = document.createElement('div');
            commentArea.classList.add('emoji-comment-area');
            
            const commentLabel = document.createElement('label');
            commentLabel.classList.add('emoji-comment-label');
            commentLabel.textContent = 'Add comment:';
            commentLabel.setAttribute('for', 'emoji-comment-input');
            commentArea.appendChild(commentLabel);
            
            const commentInput = document.createElement('textarea');
            commentInput.id = 'emoji-comment-input';
            commentInput.classList.add('emoji-comment-input');
            commentInput.value = this.state.comment;
            commentInput.placeholder = 'Type your comment here...';
            commentInput.setAttribute('aria-label', 'Add a comment about your feelings');
            
            commentInput.addEventListener('input', () => {
                this.state.comment = commentInput.value;
            });
            
            commentArea.appendChild(commentInput);
            
            // Add voice input button for comments
            if (this.config.voiceCommands) {
                const voiceButton = document.createElement('button');
                voiceButton.classList.add('emoji-voice-comment-button');
                voiceButton.textContent = 'Speak';
                voiceButton.setAttribute('aria-label', 'Speak your comment');
                
                voiceButton.addEventListener('click', () => {
                    this.startVoiceComment();
                });
                
                commentArea.appendChild(voiceButton);
            }
            
            this.container.appendChild(commentArea);
        }

        // Create navigation buttons
        const navigationArea = document.createElement('div');
        navigationArea.classList.add('emoji-navigation-area');
        
        const backButton = document.createElement('button');
        backButton.classList.add('emoji-nav-button', 'emoji-back-button');
        backButton.textContent = '< Back';
        backButton.setAttribute('aria-label', 'Go back');
        
        backButton.addEventListener('click', () => {
            if (this.config.onBack) {
                this.config.onBack();
            }
        });
        
        navigationArea.appendChild(backButton);
        
        const saveButton = document.createElement('button');
        saveButton.classList.add('emoji-nav-button', 'emoji-save-button');
        saveButton.textContent = 'Save >';
        saveButton.setAttribute('aria-label', 'Save your selection');
        
        saveButton.addEventListener('click', () => {
            this.saveSelection();
        });
        
        navigationArea.appendChild(saveButton);
        this.container.appendChild(navigationArea);

        // Create status message area for accessibility
        const statusArea = document.createElement('div');
        statusArea.classList.add('emoji-status');
        statusArea.setAttribute('role', 'status');
        statusArea.setAttribute('aria-live', 'polite');
        this.container.appendChild(statusArea);
        this.statusArea = statusArea;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Event delegation for emoji grid container
        const gridContainer = this.container.querySelector('.emoji-grid-container');
        if (gridContainer) {
            gridContainer.addEventListener('keydown', (e) => {
                if (e.target.classList.contains('emoji-item')) {
                    // Space or Enter to select emoji
                    if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        const emojiCode = e.target.getAttribute('data-emoji');
                        const emojiName = e.target.getAttribute('data-name');
                        const category = this.getCurrentCategory();
                        const emoji = category.emojis.find(e => e.code === emojiCode);
                        if (emoji) {
                            this.toggleEmoji(emoji);
                        }
                    }
                }
            });
        }
    }

    /**
     * Set up keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only process shortcuts when the emoji selection tool is focused
            if (!this.container.contains(document.activeElement) && document.activeElement !== document.body) {
                return;
            }
            
            // Ctrl+S: Save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveSelection();
            }
            
            // Tab category switching (when not in input fields)
            if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                // 1-4: Switch categories
                if (e.key >= '1' && e.key <= '4' && (parseInt(e.key) <= this.config.categories.length)) {
                    const categoryIndex = parseInt(e.key) - 1;
                    this.selectCategory(this.config.categories[categoryIndex].id);
                }
            }
        });
    }

    /**
     * Set up voice commands
     */
    setupVoiceCommands() {
        // Check if the Web Speech API is available
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Voice commands are not supported in this browser');
            return;
        }
        
        // Create voice command button
        const voiceButton = document.createElement('button');
        voiceButton.classList.add('emoji-voice-command-button');
        voiceButton.textContent = 'Voice Commands';
        voiceButton.setAttribute('aria-label', 'Activate voice commands');
        
        // Add to container
        this.container.appendChild(voiceButton);
        
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-GB'; // UK English
        
        // Handle voice commands
        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            this.processVoiceCommand(command);
        };
        
        // Handle errors
        this.recognition.onerror = (event) => {
            console.error('Voice command error:', event.error);
            this.updateStatus(`Voice command error: ${event.error}`);
        };
        
        // Start listening on button click
        voiceButton.addEventListener('click', () => {
            this.recognition.start();
            this.updateStatus('Listening for voice commands...');
            voiceButton.disabled = true;
            
            // Re-enable button after 5 seconds (timeout for listening)
            setTimeout(() => {
                voiceButton.disabled = false;
                this.updateStatus('Voice command listening stopped');
            }, 5000);
        });
    }

    /**
     * Start voice input for comment
     */
    startVoiceComment() {
        // Check if the Web Speech API is available
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Voice input is not supported in this browser');
            this.updateStatus('Voice input is not supported in this browser');
            return;
        }
        
        // Initialize speech recognition if not already done
        if (!this.commentRecognition) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.commentRecognition = new SpeechRecognition();
            this.commentRecognition.continuous = true;
            this.commentRecognition.interimResults = true;
            this.commentRecognition.lang = 'en-GB'; // UK English
            
            // Handle voice input
            this.commentRecognition.onresult = (event) => {
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
                
                // Update comment input
                const commentInput = this.container.querySelector('#emoji-comment-input');
                if (commentInput) {
                    if (finalTranscript) {
                        this.state.comment = (this.state.comment + ' ' + finalTranscript).trim();
                        commentInput.value = this.state.comment;
                    }
                    
                    // Show interim results
                    if (interimTranscript) {
                        commentInput.value = this.state.comment + ' ' + interimTranscript;
                    }
                }
            };
            
            // Handle errors
            this.commentRecognition.onerror = (event) => {
                console.error('Voice input error:', event.error);
                this.updateStatus(`Voice input error: ${event.error}`);
            };
            
            // Handle end of recognition
            this.commentRecognition.onend = () => {
                const voiceButton = this.container.querySelector('.emoji-voice-comment-button');
                if (voiceButton) {
                    voiceButton.textContent = 'Speak';
                    voiceButton.disabled = false;
                }
                this.updateStatus('Voice input stopped');
            };
        }
        
        // Toggle recognition
        const voiceButton = this.container.querySelector('.emoji-voice-comment-button');
        
        if (this.commentRecognition.isStarted) {
            this.commentRecognition.stop();
            this.commentRecognition.isStarted = false;
            if (voiceButton) {
                voiceButton.textContent = 'Speak';
            }
        } else {
            this.commentRecognition.start();
            this.commentRecognition.isStarted = true;
            if (voiceButton) {
                voiceButton.textContent = 'Stop';
            }
            this.updateStatus('Listening for your comment...');
        }
    }

    /**
     * Process voice commands
     */
    processVoiceCommand(command) {
        this.updateStatus(`Voice command: "${command}"`);
        
        // Category commands
        if (command.includes('basic') || command.includes('feeling')) {
            this.selectCategory('basic');
        } else if (command.includes('school')) {
            this.selectCategory('school');
        } else if (command.includes('social') || command.includes('friend')) {
            this.selectCategory('social');
        } else if (command.includes('physical') || command.includes('body')) {
            this.selectCategory('physical');
        }
        
        // Emotion selection commands
        else if (command.includes('happy') || command.includes('joy')) {
            this.selectEmojiByName('happy');
        } else if (command.includes('sad') || command.includes('unhappy')) {
            this.selectEmojiByName('sad');
        } else if (command.includes('angry') || command.includes('mad')) {
            this.selectEmojiByName('angry');
        } else if (command.includes('scared') || command.includes('afraid')) {
            this.selectEmojiByName('scared');
        } else if (command.includes('tired') || command.includes('sleepy')) {
            this.selectEmojiByName('tired');
        } else if (command.includes('confused') || command.includes('thinking')) {
            this.selectEmojiByName('thinking');
        } else if (command.includes('surprised') || command.includes('shocked')) {
            this.selectEmojiByName('surprised');
        } else if (command.includes('love') || command.includes('adore')) {
            this.selectEmojiByName('love');
        }
        
        // Intensity commands
        else if (command.includes('very') || command.includes('really') || command.includes('extremely')) {
            this.setIntensityForLastEmoji(5);
        } else if (command.includes('quite') || command.includes('rather')) {
            this.setIntensityForLastEmoji(4);
        } else if (command.includes('somewhat') || command.includes('a bit')) {
            this.setIntensityForLastEmoji(2);
        } else if (command.includes('slightly') || command.includes('a little')) {
            this.setIntensityForLastEmoji(1);
        }
        
        // Action commands
        else if (command.includes('save')) {
            this.saveSelection();
        } else if (command.includes('clear') || command.includes('reset')) {
            this.clearSelection();
        } else if (command.includes('comment')) {
            this.startVoiceComment();
        } else {
            this.updateStatus(`Command not recognized: "${command}"`);
        }
    }

    /**
     * Set up accessibility features
     */
    setupAccessibilityFeatures() {
        // Add keyboard navigation instructions
        const instructions = document.createElement('div');
        instructions.classList.add('emoji-keyboard-instructions');
        instructions.innerHTML = `
            <details>
                <summary>Keyboard Instructions</summary>
                <ul>
                    <li>Tab: Navigate between elements</li>
                    <li>Space/Enter: Select or activate focused element</li>
                    <li>1-4: Switch between emotion categories</li>
                    <li>Arrow keys: Navigate within emoji grid</li>
                    <li>Ctrl+S: Save selection</li>
                </ul>
            </details>
        `;
        
        this.container.appendChild(instructions);
        
        // Enhance tab navigation
        const tablist = this.container.querySelector('.emoji-category-tabs');
        if (tablist) {
            const tabs = tablist.querySelectorAll('.emoji-category-tab');
            
            tabs.forEach((tab, index) => {
                tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
                
                tab.addEventListener('keydown', (e) => {
                    let newIndex = -1;
                    
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                        newIndex = (index + 1) % tabs.length;
                        e.preventDefault();
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        newIndex = (index - 1 + tabs.length) % tabs.length;
                        e.preventDefault();
                    } else if (e.key === 'Home') {
                        newIndex = 0;
                        e.preventDefault();
                    } else if (e.key === 'End') {
                        newIndex = tabs.length - 1;
                        e.preventDefault();
                    }
                    
                    if (newIndex !== -1) {
                        tabs.forEach(t => t.setAttribute('tabindex', '-1'));
                        tabs[newIndex].setAttribute('tabindex', '0');
                        tabs[newIndex].focus();
                        this.selectCategory(tabs[newIndex].getAttribute('data-category'));
                    }
                });
            });
        }
        
        // Enhance emoji grid navigation
        const grids = this.container.querySelectorAll('.emoji-grid');
        
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.emoji-item');
            const rows = Math.ceil(Math.sqrt(items.length));
            const cols = Math.ceil(items.length / rows);
            
            items.forEach((item, index) => {
                const row = Math.floor(index / cols);
                const col = index % cols;
                
                item.setAttribute('data-row', row);
                item.setAttribute('data-col', col);
                
                item.addEventListener('keydown', (e) => {
                    let newRow = row;
                    let newCol = col;
                    
                    if (e.key === 'ArrowRight') {
                        newCol = (col + 1) % cols;
                        e.preventDefault();
                    } else if (e.key === 'ArrowLeft') {
                        newCol = (col - 1 + cols) % cols;
                        e.preventDefault();
                    } else if (e.key === 'ArrowDown') {
                        newRow = (row + 1) % rows;
                        e.preventDefault();
                    } else if (e.key === 'ArrowUp') {
                        newRow = (row - 1 + rows) % rows;
                        e.preventDefault();
                    }
                    
                    if (newRow !== row || newCol !== col) {
                        const newIndex = newRow * cols + newCol;
                        if (newIndex < items.length) {
                            items[newIndex].focus();
                        }
                    }
                });
            });
        });
    }

    /**
     * Select a category
     */
    selectCategory(categoryId) {
        // Update state
        this.state.currentCategory = categoryId;
        
        // Update UI
        const tabs = this.container.querySelectorAll('.emoji-category-tab');
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-category') === categoryId;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        
        const grids = this.container.querySelectorAll('.emoji-grid');
        grids.forEach(grid => {
            grid.style.display = grid.id === `emoji-grid-${categoryId}` ? 'grid' : 'none';
        });
        
        // Update status for accessibility
        const category = this.config.categories.find(c => c.id === categoryId);
        if (category) {
            this.updateStatus(`Selected category: ${category.name}`);
        }
    }

    /**
     * Toggle emoji selection
     */
    toggleEmoji(emoji) {
        const index = this.state.selectedEmojis.findIndex(e => e.code === emoji.code);
        
        if (index === -1) {
            // Add emoji if not already selected
            if (!this.config.multipleSelection) {
                // If multiple selection is not allowed, clear previous selection
                this.state.selectedEmojis = [];
                this.state.intensities = {};
            }
            
            this.state.selectedEmojis.push(emoji);
            this.state.intensities[emoji.code] = 3; // Default intensity
            this.updateStatus(`Selected: ${emoji.description}`);
        } else {
            // Remove emoji if already selected
            this.state.selectedEmojis.splice(index, 1);
            delete this.state.intensities[emoji.code];
            this.updateStatus(`Removed: ${emoji.description}`);
        }
        
        // Rebuild UI to reflect changes
        this.createUI();
    }

    /**
     * Remove an emoji from selection
     */
    removeEmoji(emoji) {
        const index = this.state.selectedEmojis.findIndex(e => e.code === emoji.code);
        
        if (index !== -1) {
            this.state.selectedEmojis.splice(index, 1);
            delete this.state.intensities[emoji.code];
            this.updateStatus(`Removed: ${emoji.description}`);
            
            // Rebuild UI to reflect changes
            this.createUI();
        }
    }

    /**
     * Set intensity for an emoji
     */
    setIntensity(emojiCode, intensity) {
        this.state.intensities[emojiCode] = intensity;
        
        // Update UI
        const dots = this.container.querySelectorAll(`.emoji-intensity-container:has(.emoji-intensity-emoji:contains('${emojiCode}')) .emoji-intensity-dot`);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index < intensity);
        });
        
        // Find emoji description for accessibility message
        const emoji = this.findEmojiByCode(emojiCode);
        if (emoji) {
            this.updateStatus(`Set intensity for ${emoji.description} to ${intensity} out of ${this.config.intensityLevels}`);
        }
    }

    /**
     * Set intensity for the last selected emoji
     */
    setIntensityForLastEmoji(intensity) {
        if (this.state.selectedEmojis.length > 0) {
            const lastEmoji = this.state.selectedEmojis[this.state.selectedEmojis.length - 1];
            this.setIntensity(lastEmoji.code, intensity);
            
            // Rebuild UI to reflect changes
            this.createUI();
        } else {
            this.updateStatus('No emoji selected to set intensity');
        }
    }

    /**
     * Select emoji by name
     */
    selectEmojiByName(name) {
        // Search in all categories
        for (const category of this.config.categories) {
            const emoji = category.emojis.find(e => e.name === name);
            if (emoji) {
                // Switch to the category if needed
                if (category.id !== this.state.currentCategory) {
                    this.selectCategory(category.id);
                }
                
                // Toggle the emoji
                this.toggleEmoji(emoji);
                return;
            }
        }
        
        this.updateStatus(`Emoji "${name}" not found`);
    }

    /**
     * Clear all selections
     */
    clearSelection() {
        this.state.selectedEmojis = [];
        this.state.intensities = {};
        this.state.comment = '';
        
        // Rebuild UI to reflect changes
        this.createUI();
        
        this.updateStatus('Selection cleared');
    }

    /**
     * Save the current selection
     */
    saveSelection() {
        const result = {
            emojis: this.state.selectedEmojis.map(emoji => ({
                code: emoji.code,
                name: emoji.name,
                description: emoji.description,
                intensity: this.state.intensities[emoji.code] || 3
            })),
            comment: this.state.comment
        };
        
        if (this.config.onSave) {
            this.config.onSave(result);
        }
        
        this.updateStatus('Selection saved');
        return result;
    }

    /**
     * Get the current category object
     */
    getCurrentCategory() {
        return this.config.categories.find(c => c.id === this.state.currentCategory);
    }

    /**
     * Find emoji by code
     */
    findEmojiByCode(code) {
        for (const category of this.config.categories) {
            const emoji = category.emojis.find(e => e.code === code);
            if (emoji) {
                return emoji;
            }
        }
        return null;
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

    /**
     * Capitalize the first letter of a string
     */
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EmojiSelection };
} else {
    window.EmojiSelection = EmojiSelection;
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .emoji-selection-container {
        font-family: 'Open Sans', sans-serif;
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .emoji-prompt {
        font-size: 18px;
        margin-bottom: 15px;
        color: #34495e;
    }

    .emoji-category-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 15px;
        border-bottom: 1px solid #e0e0e0;
    }

    .emoji-category-tab {
        padding: 10px 15px;
        background-color: #ecf0f1;
        border: none;
        border-radius: 8px 8px 0 0;
        cursor: pointer;
        font-size: 14px;
        color: #7f8c8d;
        transition: background-color 0.2s;
    }

    .emoji-category-tab.active {
        background-color: #3498db;
        color: white;
    }

    .emoji-category-tab:hover {
        background-color: #d5dbdb;
    }

    .emoji-category-tab.active:hover {
        background-color: #2980b9;
    }

    .emoji-category-tab:focus {
        outline: 2px solid #9b59b6;
    }

    .emoji-grid-container {
        margin-bottom: 20px;
    }

    .emoji-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        margin-bottom: 15px;
    }

    .emoji-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px;
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .emoji-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .emoji-item.selected {
        background-color: #e0f7fa;
        border-color: #3498db;
    }

    .emoji-item:focus {
        outline: 2px solid #9b59b6;
    }

    .emoji-display {
        font-size: 32px;
        margin-bottom: 5px;
    }

    .emoji-name {
        font-size: 12px;
        color: #7f8c8d;
        text-align: center;
    }

    .emoji-selected-area {
        margin-bottom: 15px;
        padding: 10px;
        background-color: #ecf0f1;
        border-radius: 8px;
    }

    .emoji-selected-label {
        font-weight: bold;
        margin-bottom: 10px;
        color: #34495e;
    }

    .emoji-selected-emojis {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .emoji-no-selection {
        color: #7f8c8d;
        font-style: italic;
    }

    .emoji-selected-item {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        background-color: white;
        border-radius: 20px;
        border: 1px solid #e0e0e0;
    }

    .emoji-selected-code {
        font-size: 24px;
        margin-right: 5px;
    }

    .emoji-remove-button {
        background: none;
        border: none;
        color: #e74c3c;
        font-size: 18px;
        cursor: pointer;
        padding: 0 5px;
    }

    .emoji-remove-button:hover {
        color: #c0392b;
    }

    .emoji-intensity-area {
        margin-bottom: 15px;
        padding: 10px;
        background-color: #ecf0f1;
        border-radius: 8px;
    }

    .emoji-intensity-label {
        font-weight: bold;
        margin-bottom: 10px;
        color: #34495e;
    }

    .emoji-intensity-sliders {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .emoji-intensity-container {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .emoji-intensity-emoji {
        font-size: 24px;
        width: 30px;
        text-align: center;
    }

    .emoji-intensity-slider {
        flex-grow: 1;
        height: 10px;
        -webkit-appearance: none;
        appearance: none;
        background: #d5dbdb;
        border-radius: 5px;
        outline: none;
    }

    .emoji-intensity-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3498db;
        cursor: pointer;
    }

    .emoji-intensity-slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3498db;
        cursor: pointer;
        border: none;
    }

    .emoji-intensity-value {
        display: flex;
        gap: 3px;
    }

    .emoji-intensity-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #d5dbdb;
    }

    .emoji-intensity-dot.active {
        background-color: #3498db;
    }

    .emoji-comment-area {
        margin-bottom: 15px;
        padding: 10px;
        background-color: #ecf0f1;
        border-radius: 8px;
    }

    .emoji-comment-label {
        font-weight: bold;
        margin-bottom: 10px;
        color: #34495e;
        display: block;
    }

    .emoji-comment-input {
        width: 100%;
        min-height: 80px;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        resize: vertical;
    }

    .emoji-comment-input:focus {
        outline: 2px solid #3498db;
        border-color: #3498db;
    }

    .emoji-voice-comment-button {
        margin-top: 10px;
        padding: 8px 12px;
        background-color: #9b59b6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }

    .emoji-voice-comment-button:hover {
        background-color: #8e44ad;
    }

    .emoji-voice-comment-button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    .emoji-navigation-area {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .emoji-nav-button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s;
    }

    .emoji-back-button {
        background-color: #7f8c8d;
        color: white;
    }

    .emoji-back-button:hover {
        background-color: #6c7a7a;
    }

    .emoji-save-button {
        background-color: #2ecc71;
        color: white;
    }

    .emoji-save-button:hover {
        background-color: #27ae60;
    }

    .emoji-nav-button:focus {
        outline: 2px solid #9b59b6;
    }

    .emoji-status {
        position: absolute;
        left: -9999px;
        height: 1px;
        width: 1px;
        overflow: hidden;
    }

    .emoji-voice-command-button {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 8px 12px;
        background-color: #9b59b6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }

    .emoji-voice-command-button:hover {
        background-color: #8e44ad;
    }

    .emoji-voice-command-button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    .emoji-keyboard-instructions {
        margin-top: 15px;
        font-size: 14px;
        color: #7f8c8d;
    }

    .emoji-keyboard-instructions summary {
        cursor: pointer;
        color: #3498db;
    }

    .emoji-keyboard-instructions ul {
        margin-top: 10px;
        padding-left: 20px;
    }

    /* High contrast mode */
    .high-contrast .emoji-selection-container {
        background-color: black;
        color: white;
    }

    .high-contrast .emoji-prompt,
    .high-contrast .emoji-selected-label,
    .high-contrast .emoji-intensity-label,
    .high-contrast .emoji-comment-label {
        color: white;
    }

    .high-contrast .emoji-category-tab {
        background-color: black;
        color: white;
        border: 1px solid white;
    }

    .high-contrast .emoji-category-tab.active {
        background-color: white;
        color: black;
    }

    .high-contrast .emoji-item {
        background-color: black;
        border-color: white;
    }

    .high-contrast .emoji-item.selected {
        background-color: white;
        border-color: yellow;
    }

    .high-contrast .emoji-name {
        color: white;
    }

    .high-contrast .emoji-selected-area,
    .high-contrast .emoji-intensity-area,
    .high-contrast .emoji-comment-area {
        background-color: #333;
    }

    .high-contrast .emoji-intensity-slider {
        background: #666;
    }

    .high-contrast .emoji-intensity-slider::-webkit-slider-thumb {
        background: white;
    }

    .high-contrast .emoji-intensity-slider::-moz-range-thumb {
        background: white;
    }

    .high-contrast .emoji-intensity-dot {
        background-color: #666;
        border: 1px solid white;
    }

    .high-contrast .emoji-intensity-dot.active {
        background-color: white;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
        .emoji-selection-container {
            padding: 10px;
        }

        .emoji-category-tabs {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 5px;
        }

        .emoji-category-tab {
            flex: 0 0 auto;
            white-space: nowrap;
        }

        .emoji-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .emoji-intensity-container {
            flex-direction: column;
            align-items: flex-start;
        }

        .emoji-intensity-emoji {
            margin-bottom: 5px;
        }

        .emoji-intensity-slider {
            width: 100%;
        }
    }
`;

document.head.appendChild(style);
