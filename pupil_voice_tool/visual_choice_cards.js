/**
 * EdPsych Connect - Pupil Voice Tool
 * Visual Choice Cards Component for EHCNA Multimodal Communication
 * 
 * This module implements visual choice cards for pupils to express preferences
 * and make selections during EHCNA processes and other pupil voice activities.
 */

class VisualChoiceCards {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            containerId: options.containerId || 'visual-choice-container',
            width: options.width || '100%',
            categories: options.categories || [
                {
                    id: 'school',
                    name: 'School Activities',
                    cards: [
                        { id: 'reading', image: 'reading.png', label: 'Reading', description: 'Reading books or stories' },
                        { id: 'writing', image: 'writing.png', label: 'Writing', description: 'Writing stories or notes' },
                        { id: 'maths', image: 'maths.png', label: 'Maths', description: 'Working with numbers' },
                        { id: 'science', image: 'science.png', label: 'Science', description: 'Doing experiments' },
                        { id: 'art', image: 'art.png', label: 'Art', description: 'Drawing and painting' },
                        { id: 'pe', image: 'pe.png', label: 'PE', description: 'Sports and exercise' },
                        { id: 'music', image: 'music.png', label: 'Music', description: 'Playing instruments or singing' },
                        { id: 'computing', image: 'computing.png', label: 'Computing', description: 'Using computers' },
                        { id: 'groupwork', image: 'groupwork.png', label: 'Group Work', description: 'Working with others' },
                        { id: 'individual', image: 'individual.png', label: 'Working Alone', description: 'Working by yourself' },
                        { id: 'listening', image: 'listening.png', label: 'Listening', description: 'Listening to teacher' },
                        { id: 'talking', image: 'talking.png', label: 'Talking', description: 'Talking in class' }
                    ]
                },
                {
                    id: 'support',
                    name: 'Support Preferences',
                    cards: [
                        { id: 'teacher_help', image: 'teacher_help.png', label: 'Teacher Help', description: 'Getting help from teacher' },
                        { id: 'ta_help', image: 'ta_help.png', label: 'TA Help', description: 'Getting help from teaching assistant' },
                        { id: 'friend_help', image: 'friend_help.png', label: 'Friend Help', description: 'Getting help from friends' },
                        { id: 'visual_aids', image: 'visual_aids.png', label: 'Visual Aids', description: 'Using pictures or diagrams' },
                        { id: 'written_instructions', image: 'written_instructions.png', label: 'Written Instructions', description: 'Having instructions written down' },
                        { id: 'verbal_instructions', image: 'verbal_instructions.png', label: 'Verbal Instructions', description: 'Having instructions explained' },
                        { id: 'extra_time', image: 'extra_time.png', label: 'Extra Time', description: 'Having more time to finish' },
                        { id: 'quiet_space', image: 'quiet_space.png', label: 'Quiet Space', description: 'Working in a quiet area' },
                        { id: 'movement_breaks', image: 'movement_breaks.png', label: 'Movement Breaks', description: 'Taking breaks to move around' },
                        { id: 'fidget_tools', image: 'fidget_tools.png', label: 'Fidget Tools', description: 'Using fidget toys or tools' },
                        { id: 'computer_use', image: 'computer_use.png', label: 'Computer Use', description: 'Using a computer to work' },
                        { id: 'scribe', image: 'scribe.png', label: 'Scribe', description: 'Someone writing for you' }
                    ]
                },
                {
                    id: 'environment',
                    name: 'Learning Environment',
                    cards: [
                        { id: 'classroom', image: 'classroom.png', label: 'Classroom', description: 'Working in the main classroom' },
                        { id: 'small_group', image: 'small_group.png', label: 'Small Group Room', description: 'Working in a small group room' },
                        { id: 'one_to_one', image: 'one_to_one.png', label: 'One-to-One', description: 'Working one-to-one with adult' },
                        { id: 'library', image: 'library.png', label: 'Library', description: 'Working in the library' },
                        { id: 'outdoor', image: 'outdoor.png', label: 'Outdoor Learning', description: 'Learning outside' },
                        { id: 'bright', image: 'bright.png', label: 'Bright Room', description: 'Working in a bright room' },
                        { id: 'dim', image: 'dim.png', label: 'Dim Room', description: 'Working in a dimly lit room' },
                        { id: 'quiet', image: 'quiet.png', label: 'Quiet Room', description: 'Working in a quiet room' },
                        { id: 'music_background', image: 'music_background.png', label: 'Background Music', description: 'Having music playing' },
                        { id: 'sitting_desk', image: 'sitting_desk.png', label: 'Sitting at Desk', description: 'Sitting at a desk' },
                        { id: 'sitting_floor', image: 'sitting_floor.png', label: 'Sitting on Floor', description: 'Sitting on the floor' },
                        { id: 'standing', image: 'standing.png', label: 'Standing', description: 'Standing while working' }
                    ]
                },
                {
                    id: 'feelings',
                    name: 'School Feelings',
                    cards: [
                        { id: 'happy_school', image: 'happy_school.png', label: 'Happy at School', description: 'Feeling happy at school' },
                        { id: 'sad_school', image: 'sad_school.png', label: 'Sad at School', description: 'Feeling sad at school' },
                        { id: 'worried_school', image: 'worried_school.png', label: 'Worried at School', description: 'Feeling worried at school' },
                        { id: 'angry_school', image: 'angry_school.png', label: 'Angry at School', description: 'Feeling angry at school' },
                        { id: 'safe_school', image: 'safe_school.png', label: 'Safe at School', description: 'Feeling safe at school' },
                        { id: 'scared_school', image: 'scared_school.png', label: 'Scared at School', description: 'Feeling scared at school' },
                        { id: 'proud_work', image: 'proud_work.png', label: 'Proud of Work', description: 'Feeling proud of your work' },
                        { id: 'confused_work', image: 'confused_work.png', label: 'Confused by Work', description: 'Feeling confused by work' },
                        { id: 'bored_school', image: 'bored_school.png', label: 'Bored at School', description: 'Feeling bored at school' },
                        { id: 'excited_school', image: 'excited_school.png', label: 'Excited at School', description: 'Feeling excited at school' },
                        { id: 'tired_school', image: 'tired_school.png', label: 'Tired at School', description: 'Feeling tired at school' },
                        { id: 'calm_school', image: 'calm_school.png', label: 'Calm at School', description: 'Feeling calm at school' }
                    ]
                }
            ],
            defaultCategory: options.defaultCategory || 'school',
            sortingEnabled: options.sortingEnabled !== undefined ? options.sortingEnabled : true,
            sortingCategories: options.sortingCategories || [
                { id: 'like', label: 'I Like', color: '#27ae60', icon: '👍' },
                { id: 'neutral', label: 'Not Sure', color: '#f39c12', icon: '😐' },
                { id: 'dislike', label: 'I Don\'t Like', color: '#e74c3c', icon: '👎' }
            ],
            allowComments: options.allowComments !== undefined ? options.allowComments : true,
            prompt: options.prompt || 'Choose the cards that show your preferences:',
            onSave: options.onSave || null,
            accessibilityMode: options.accessibilityMode || false,
            voiceCommands: options.voiceCommands !== undefined ? options.voiceCommands : true,
            keyboardShortcuts: options.keyboardShortcuts !== undefined ? options.keyboardShortcuts : true,
            imagePath: options.imagePath || 'images/choice_cards/',
            placeholderImage: options.placeholderImage || 'placeholder.png'
        };

        // State variables
        this.state = {
            currentCategory: this.config.defaultCategory,
            sortedCards: {
                like: [],
                neutral: [],
                dislike: []
            },
            comments: {}
        };

        // Initialize the component
        this.init();
    }

    /**
     * Initialize the visual choice cards component
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
        this.container.classList.add('visual-choice-container');
        this.container.setAttribute('role', 'application');
        this.container.setAttribute('aria-label', 'Visual Choice Cards Tool');
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

        // Preload images
        this.preloadImages();
    }

    /**
     * Preload images for smoother experience
     */
    preloadImages() {
        const imagesToPreload = [];
        
        // Collect all image paths
        this.config.categories.forEach(category => {
            category.cards.forEach(card => {
                imagesToPreload.push(this.getImagePath(card.image));
            });
        });
        
        // Preload images
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    /**
     * Get full image path
     */
    getImagePath(imageName) {
        return this.config.imagePath + imageName;
    }

    /**
     * Create the user interface
     */
    createUI() {
        // Clear the container
        this.container.innerHTML = '';

        // Create the prompt area
        const promptArea = document.createElement('div');
        promptArea.classList.add('visual-choice-prompt');
        promptArea.textContent = this.config.prompt;
        this.container.appendChild(promptArea);

        // Create category tabs
        const categoryTabs = document.createElement('div');
        categoryTabs.classList.add('visual-choice-category-tabs');
        categoryTabs.setAttribute('role', 'tablist');
        
        this.config.categories.forEach(category => {
            const tab = document.createElement('button');
            tab.classList.add('visual-choice-category-tab');
            tab.setAttribute('data-category', category.id);
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', category.id === this.state.currentCategory ? 'true' : 'false');
            tab.setAttribute('aria-controls', `visual-choice-grid-${category.id}`);
            tab.textContent = category.name;
            
            if (category.id === this.state.currentCategory) {
                tab.classList.add('active');
            }
            
            tab.addEventListener('click', () => this.selectCategory(category.id));
            categoryTabs.appendChild(tab);
        });
        
        this.container.appendChild(categoryTabs);

        // Create card grid container
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('visual-choice-grid-container');
        
        // Create card grids for each category
        this.config.categories.forEach(category => {
            const grid = document.createElement('div');
            grid.id = `visual-choice-grid-${category.id}`;
            grid.classList.add('visual-choice-grid');
            grid.setAttribute('role', 'tabpanel');
            grid.setAttribute('aria-labelledby', `visual-choice-category-tab-${category.id}`);
            
            if (category.id !== this.state.currentCategory) {
                grid.style.display = 'none';
            }
            
            // Create card items
            category.cards.forEach(card => {
                const cardItem = document.createElement('div');
                cardItem.classList.add('visual-choice-card');
                cardItem.setAttribute('data-card-id', card.id);
                cardItem.setAttribute('draggable', this.config.sortingEnabled ? 'true' : 'false');
                cardItem.setAttribute('aria-label', card.description);
                
                // Check if this card is already sorted
                let isSorted = false;
                for (const category in this.state.sortedCards) {
                    if (this.state.sortedCards[category].some(c => c.id === card.id)) {
                        isSorted = true;
                        break;
                    }
                }
                
                if (isSorted) {
                    cardItem.classList.add('sorted');
                }
                
                // Create card image
                const cardImage = document.createElement('img');
                cardImage.classList.add('visual-choice-card-image');
                cardImage.src = this.getImagePath(card.image);
                cardImage.alt = card.description;
                cardImage.onerror = () => {
                    cardImage.src = this.getImagePath(this.config.placeholderImage);
                    console.warn(`Failed to load image: ${card.image}`);
                };
                cardItem.appendChild(cardImage);
                
                // Create card label
                const cardLabel = document.createElement('div');
                cardLabel.classList.add('visual-choice-card-label');
                cardLabel.textContent = card.label;
                cardItem.appendChild(cardLabel);
                
                // Add event listeners for drag and click
                this.setupCardEventListeners(cardItem, card);
                
                grid.appendChild(cardItem);
            });
            
            gridContainer.appendChild(grid);
        });
        
        this.container.appendChild(gridContainer);

        // Create sorting area if enabled
        if (this.config.sortingEnabled) {
            const sortingArea = document.createElement('div');
            sortingArea.classList.add('visual-choice-sorting-area');
            
            const sortingLabel = document.createElement('div');
            sortingLabel.classList.add('visual-choice-sorting-label');
            sortingLabel.textContent = 'Sort your choices:';
            sortingArea.appendChild(sortingLabel);
            
            const sortingCategories = document.createElement('div');
            sortingCategories.classList.add('visual-choice-sorting-categories');
            
            this.config.sortingCategories.forEach(category => {
                const sortingCategory = document.createElement('div');
                sortingCategory.classList.add('visual-choice-sorting-category');
                sortingCategory.setAttribute('data-sort-category', category.id);
                sortingCategory.style.borderColor = category.color;
                
                const categoryHeader = document.createElement('div');
                categoryHeader.classList.add('visual-choice-sorting-header');
                categoryHeader.style.backgroundColor = category.color;
                
                const categoryIcon = document.createElement('span');
                categoryIcon.classList.add('visual-choice-sorting-icon');
                categoryIcon.textContent = category.icon;
                categoryHeader.appendChild(categoryIcon);
                
                const categoryLabel = document.createElement('span');
                categoryLabel.classList.add('visual-choice-sorting-category-label');
                categoryLabel.textContent = category.label;
                categoryHeader.appendChild(categoryLabel);
                
                sortingCategory.appendChild(categoryHeader);
                
                const sortedCardsContainer = document.createElement('div');
                sortedCardsContainer.classList.add('visual-choice-sorted-cards');
                sortedCardsContainer.setAttribute('data-sort-container', category.id);
                
                // Add event listeners for drop
                this.setupDropZone(sortedCardsContainer, category.id);
                
                // Add already sorted cards
                if (this.state.sortedCards[category.id] && this.state.sortedCards[category.id].length > 0) {
                    this.state.sortedCards[category.id].forEach(card => {
                        const sortedCard = this.createSortedCard(card, category.id);
                        sortedCardsContainer.appendChild(sortedCard);
                    });
                } else {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.classList.add('visual-choice-empty-message');
                    emptyMessage.textContent = `Drag cards here that you ${category.label.toLowerCase()}`;
                    sortedCardsContainer.appendChild(emptyMessage);
                }
                
                sortingCategory.appendChild(sortedCardsContainer);
                sortingCategories.appendChild(sortingCategory);
            });
            
            sortingArea.appendChild(sortingCategories);
            this.container.appendChild(sortingArea);
        }

        // Create comment area if enabled
        if (this.config.allowComments) {
            const commentArea = document.createElement('div');
            commentArea.classList.add('visual-choice-comment-area');
            
            const commentLabel = document.createElement('label');
            commentLabel.classList.add('visual-choice-comment-label');
            commentLabel.textContent = 'Add your thoughts:';
            commentLabel.setAttribute('for', 'visual-choice-comment-input');
            commentArea.appendChild(commentLabel);
            
            const commentInput = document.createElement('textarea');
            commentInput.id = 'visual-choice-comment-input';
            commentInput.classList.add('visual-choice-comment-input');
            commentInput.value = this.state.comments[this.state.currentCategory] || '';
            commentInput.placeholder = 'Type your thoughts here...';
            commentInput.setAttribute('aria-label', 'Add your thoughts about these choices');
            
            commentInput.addEventListener('input', () => {
                this.state.comments[this.state.currentCategory] = commentInput.value;
            });
            
            commentArea.appendChild(commentInput);
            
            // Add voice input button for comments
            if (this.config.voiceCommands) {
                const voiceButton = document.createElement('button');
                voiceButton.classList.add('visual-choice-voice-comment-button');
                voiceButton.textContent = 'Speak';
                voiceButton.setAttribute('aria-label', 'Speak your thoughts');
                
                voiceButton.addEventListener('click', () => {
                    this.startVoiceComment();
                });
                
                commentArea.appendChild(voiceButton);
            }
            
            this.container.appendChild(commentArea);
        }

        // Create navigation buttons
        const navigationArea = document.createElement('div');
        navigationArea.classList.add('visual-choice-navigation-area');
        
        const backButton = document.createElement('button');
        backButton.classList.add('visual-choice-nav-button', 'visual-choice-back-button');
        backButton.textContent = '< Back';
        backButton.setAttribute('aria-label', 'Go back');
        
        backButton.addEventListener('click', () => {
            if (this.config.onBack) {
                this.config.onBack();
            }
        });
        
        navigationArea.appendChild(backButton);
        
        const saveButton = document.createElement('button');
        saveButton.classList.add('visual-choice-nav-button', 'visual-choice-save-button');
        saveButton.textContent = 'Save >';
        saveButton.setAttribute('aria-label', 'Save your choices');
        
        saveButton.addEventListener('click', () => {
            this.saveChoices();
        });
        
        navigationArea.appendChild(saveButton);
        this.container.appendChild(navigationArea);

        // Create status message area for accessibility
        const statusArea = document.createElement('div');
        statusArea.classList.add('visual-choice-status');
        statusArea.setAttribute('role', 'status');
        statusArea.setAttribute('aria-live', 'polite');
        this.container.appendChild(statusArea);
        this.statusArea = statusArea;
    }

    /**
     * Set up event listeners for a card
     */
    setupCardEventListeners(cardItem, card) {
        // Click event for non-drag selection
        cardItem.addEventListener('click', () => {
            if (!this.config.sortingEnabled) {
                this.toggleCardSelection(cardItem, card);
            } else {
                // For sorting mode, clicking selects for the first category
                if (!cardItem.classList.contains('sorted')) {
                    this.sortCard(card, this.config.sortingCategories[0].id);
                    cardItem.classList.add('sorted');
                    this.updateUI();
                }
            }
        });
        
        // Drag events
        if (this.config.sortingEnabled) {
            cardItem.addEventListener('dragstart', (e) => {
                // Don't allow dragging already sorted cards
                if (cardItem.classList.contains('sorted')) {
                    e.preventDefault();
                    return;
                }
                
                e.dataTransfer.setData('text/plain', JSON.stringify(card));
                cardItem.classList.add('dragging');
                
                // Set drag image
                const dragImage = cardItem.cloneNode(true);
                dragImage.style.width = '100px';
                dragImage.style.height = '100px';
                document.body.appendChild(dragImage);
                e.dataTransfer.setDragImage(dragImage, 50, 50);
                setTimeout(() => {
                    document.body.removeChild(dragImage);
                }, 0);
            });
            
            cardItem.addEventListener('dragend', () => {
                cardItem.classList.remove('dragging');
            });
        }
    }

    /**
     * Set up drop zone for sorting categories
     */
    setupDropZone(container, categoryId) {
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            container.classList.add('drag-over');
        });
        
        container.addEventListener('dragleave', () => {
            container.classList.remove('drag-over');
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('drag-over');
            
            try {
                const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
                this.sortCard(cardData, categoryId);
                
                // Mark the original card as sorted
                const originalCard = this.container.querySelector(`.visual-choice-card[data-card-id="${cardData.id}"]`);
                if (originalCard) {
                    originalCard.classList.add('sorted');
                }
                
                this.updateUI();
            } catch (error) {
                console.error('Error processing dropped card:', error);
            }
        });
    }

    /**
     * Create a sorted card element
     */
    createSortedCard(card, categoryId) {
        const sortedCard = document.createElement('div');
        sortedCard.classList.add('visual-choice-sorted-card');
        sortedCard.setAttribute('data-card-id', card.id);
        
        // Create card image
        const cardImage = document.createElement('img');
        cardImage.classList.add('visual-choice-sorted-card-image');
        cardImage.src = this.getImagePath(card.image);
        cardImage.alt = card.description;
        cardImage.onerror = () => {
            cardImage.src = this.getImagePath(this.config.placeholderImage);
        };
        sortedCard.appendChild(cardImage);
        
        // Create card label
        const cardLabel = document.createElement('div');
        cardLabel.classList.add('visual-choice-sorted-card-label');
        cardLabel.textContent = card.label;
        sortedCard.appendChild(cardLabel);
        
        // Create remove button
        const removeButton = document.createElement('button');
        removeButton.classList.add('visual-choice-remove-button');
        removeButton.innerHTML = '&times;';
        removeButton.setAttribute('aria-label', `Remove ${card.label}`);
        
        removeButton.addEventListener('click', () => {
            this.removeCardFromCategory(card, categoryId);
        });
        
        sortedCard.appendChild(removeButton);
        
        return sortedCard;
    }

    /**
     * Toggle card selection (for non-sorting mode)
     */
    toggleCardSelection(cardItem, card) {
        cardItem.classList.toggle('selected');
        this.updateStatus(`${cardItem.classList.contains('selected') ? 'Selected' : 'Deselected'}: ${card.label}`);
    }

    /**
     * Sort a card into a category
     */
    sortCard(card, categoryId) {
        // First remove the card from any existing category
        for (const category in this.state.sortedCards) {
            this.state.sortedCards[category] = this.state.sortedCards[category].filter(c => c.id !== card.id);
        }
        
        // Add to the new category
        if (!this.state.sortedCards[categoryId]) {
            this.state.sortedCards[categoryId] = [];
        }
        
        this.state.sortedCards[categoryId].push(card);
        
        // Update status for accessibility
        const categoryLabel = this.config.sortingCategories.find(c => c.id === categoryId)?.label || categoryId;
        this.updateStatus(`Sorted ${card.label} into ${categoryLabel}`);
    }

    /**
     * Remove a card from a category
     */
    removeCardFromCategory(card, categoryId) {
        if (this.state.sortedCards[categoryId]) {
            this.state.sortedCards[categoryId] = this.state.sortedCards[categoryId].filter(c => c.id !== card.id);
        }
        
        // Update the original card to remove sorted class
        const originalCard = this.container.querySelector(`.visual-choice-card[data-card-id="${card.id}"]`);
        if (originalCard) {
            originalCard.classList.remove('sorted');
        }
        
        this.updateUI();
        
        // Update status for accessibility
        const categoryLabel = this.config.sortingCategories.find(c => c.id === categoryId)?.label || categoryId;
        this.updateStatus(`Removed ${card.label} from ${categoryLabel}`);
    }

    /**
     * Update the UI to reflect current state
     */
    updateUI() {
        // Rebuild the UI to reflect the current state
        this.createUI();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Event delegation for card grid container
        const gridContainer = this.container.querySelector('.visual-choice-grid-container');
        if (gridContainer) {
            gridContainer.addEventListener('keydown', (e) => {
                if (e.target.classList.contains('visual-choice-card')) {
                    // Space or Enter to select card
                    if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        const cardId = e.target.getAttribute('data-card-id');
                        const category = this.getCurrentCategory();
                        const card = category.cards.find(c => c.id === cardId);
                        if (card) {
                            if (!this.config.sortingEnabled) {
                                this.toggleCardSelection(e.target, card);
                            } else {
                                // For sorting mode, Enter selects for the first category
                                if (!e.target.classList.contains('sorted')) {
                                    this.sortCard(card, this.config.sortingCategories[0].id);
                                    e.target.classList.add('sorted');
                                    this.updateUI();
                                }
                            }
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
            // Only process shortcuts when the visual choice tool is focused
            if (!this.container.contains(document.activeElement) && document.activeElement !== document.body) {
                return;
            }
            
            // Ctrl+S: Save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveChoices();
            }
            
            // Tab category switching (when not in input fields)
            if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                // 1-4: Switch categories
                if (e.key >= '1' && e.key <= '4' && (parseInt(e.key) <= this.config.categories.length)) {
                    const categoryIndex = parseInt(e.key) - 1;
                    this.selectCategory(this.config.categories[categoryIndex].id);
                }
                
                // Sorting shortcuts (1-3 with Alt key)
                if (this.config.sortingEnabled && e.altKey && e.key >= '1' && e.key <= '3' && (parseInt(e.key) <= this.config.sortingCategories.length)) {
                    const sortingIndex = parseInt(e.key) - 1;
                    const focusedCard = document.activeElement;
                    
                    if (focusedCard && focusedCard.classList.contains('visual-choice-card') && !focusedCard.classList.contains('sorted')) {
                        const cardId = focusedCard.getAttribute('data-card-id');
                        const category = this.getCurrentCategory();
                        const card = category.cards.find(c => c.id === cardId);
                        
                        if (card) {
                            this.sortCard(card, this.config.sortingCategories[sortingIndex].id);
                            focusedCard.classList.add('sorted');
                            this.updateUI();
                        }
                    }
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
        voiceButton.classList.add('visual-choice-voice-command-button');
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
                const commentInput = this.container.querySelector('#visual-choice-comment-input');
                if (commentInput) {
                    if (finalTranscript) {
                        this.state.comments[this.state.currentCategory] = (this.state.comments[this.state.currentCategory] || '') + ' ' + finalTranscript;
                        this.state.comments[this.state.currentCategory] = this.state.comments[this.state.currentCategory].trim();
                        commentInput.value = this.state.comments[this.state.currentCategory];
                    }
                    
                    // Show interim results
                    if (interimTranscript) {
                        commentInput.value = (this.state.comments[this.state.currentCategory] || '') + ' ' + interimTranscript;
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
                const voiceButton = this.container.querySelector('.visual-choice-voice-comment-button');
                if (voiceButton) {
                    voiceButton.textContent = 'Speak';
                    voiceButton.disabled = false;
                }
                this.updateStatus('Voice input stopped');
            };
        }
        
        // Toggle recognition
        const voiceButton = this.container.querySelector('.visual-choice-voice-comment-button');
        
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
        if (command.includes('school activities') || command.includes('activities')) {
            this.selectCategory('school');
        } else if (command.includes('support') || command.includes('help')) {
            this.selectCategory('support');
        } else if (command.includes('environment') || command.includes('place')) {
            this.selectCategory('environment');
        } else if (command.includes('feelings') || command.includes('emotions')) {
            this.selectCategory('feelings');
        }
        
        // Sorting commands
        else if (this.config.sortingEnabled) {
            // Try to match a card name
            const currentCategory = this.getCurrentCategory();
            let matchedCard = null;
            
            for (const card of currentCategory.cards) {
                if (command.includes(card.label.toLowerCase())) {
                    matchedCard = card;
                    break;
                }
            }
            
            if (matchedCard) {
                // Determine which category to sort into
                let sortCategory = null;
                
                if (command.includes('like') || command.includes('good') || command.includes('yes')) {
                    sortCategory = 'like';
                } else if (command.includes('not sure') || command.includes('maybe') || command.includes('sometimes')) {
                    sortCategory = 'neutral';
                } else if (command.includes('don\'t like') || command.includes('dislike') || command.includes('no')) {
                    sortCategory = 'dislike';
                } else {
                    // Default to first category if no preference specified
                    sortCategory = this.config.sortingCategories[0].id;
                }
                
                // Sort the card
                this.sortCard(matchedCard, sortCategory);
                
                // Mark the original card as sorted
                const originalCard = this.container.querySelector(`.visual-choice-card[data-card-id="${matchedCard.id}"]`);
                if (originalCard) {
                    originalCard.classList.add('sorted');
                }
                
                this.updateUI();
            } else {
                // Check for general commands
                if (command.includes('save')) {
                    this.saveChoices();
                } else if (command.includes('clear') || command.includes('reset')) {
                    this.clearChoices();
                } else if (command.includes('comment')) {
                    this.startVoiceComment();
                } else {
                    this.updateStatus(`Command not recognized: "${command}"`);
                }
            }
        }
    }

    /**
     * Set up accessibility features
     */
    setupAccessibilityFeatures() {
        // Add keyboard navigation instructions
        const instructions = document.createElement('div');
        instructions.classList.add('visual-choice-keyboard-instructions');
        instructions.innerHTML = `
            <details>
                <summary>Keyboard Instructions</summary>
                <ul>
                    <li>Tab: Navigate between elements</li>
                    <li>Space/Enter: Select or activate focused element</li>
                    <li>1-4: Switch between card categories</li>
                    <li>Alt+1, Alt+2, Alt+3: Sort focused card into respective category</li>
                    <li>Arrow keys: Navigate within card grid</li>
                    <li>Ctrl+S: Save choices</li>
                </ul>
            </details>
        `;
        
        this.container.appendChild(instructions);
        
        // Enhance tab navigation
        const tablist = this.container.querySelector('.visual-choice-category-tabs');
        if (tablist) {
            const tabs = tablist.querySelectorAll('.visual-choice-category-tab');
            
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
        
        // Enhance card grid navigation
        const grids = this.container.querySelectorAll('.visual-choice-grid');
        
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.visual-choice-card');
            const rows = Math.ceil(Math.sqrt(items.length));
            const cols = Math.ceil(items.length / rows);
            
            items.forEach((item, index) => {
                const row = Math.floor(index / cols);
                const col = index % cols;
                
                item.setAttribute('data-row', row);
                item.setAttribute('data-col', col);
                item.setAttribute('tabindex', '0');
                
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
        const tabs = this.container.querySelectorAll('.visual-choice-category-tab');
        tabs.forEach(tab => {
            const isActive = tab.getAttribute('data-category') === categoryId;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        
        const grids = this.container.querySelectorAll('.visual-choice-grid');
        grids.forEach(grid => {
            grid.style.display = grid.id === `visual-choice-grid-${categoryId}` ? 'grid' : 'none';
        });
        
        // Update status for accessibility
        const category = this.config.categories.find(c => c.id === categoryId);
        if (category) {
            this.updateStatus(`Selected category: ${category.name}`);
        }
    }

    /**
     * Clear all choices
     */
    clearChoices() {
        this.state.sortedCards = {
            like: [],
            neutral: [],
            dislike: []
        };
        
        this.updateUI();
        this.updateStatus('All choices cleared');
    }

    /**
     * Save the current choices
     */
    saveChoices() {
        const result = {
            sortedCards: this.state.sortedCards,
            comments: this.state.comments
        };
        
        if (this.config.onSave) {
            this.config.onSave(result);
        }
        
        this.updateStatus('Choices saved');
        return result;
    }

    /**
     * Get the current category object
     */
    getCurrentCategory() {
        return this.config.categories.find(c => c.id === this.state.currentCategory);
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
    module.exports = { VisualChoiceCards };
} else {
    window.VisualChoiceCards = VisualChoiceCards;
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .visual-choice-container {
        font-family: 'Open Sans', sans-serif;
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .visual-choice-prompt {
        font-size: 18px;
        margin-bottom: 15px;
        color: #34495e;
    }

    .visual-choice-category-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 15px;
        border-bottom: 1px solid #e0e0e0;
    }

    .visual-choice-category-tab {
        padding: 10px 15px;
        background-color: #ecf0f1;
        border: none;
        border-radius: 8px 8px 0 0;
        cursor: pointer;
        font-size: 14px;
        color: #7f8c8d;
        transition: background-color 0.2s;
    }

    .visual-choice-category-tab.active {
        background-color: #3498db;
        color: white;
    }

    .visual-choice-category-tab:hover {
        background-color: #d5dbdb;
    }

    .visual-choice-category-tab.active:hover {
        background-color: #2980b9;
    }

    .visual-choice-category-tab:focus {
        outline: 2px solid #9b59b6;
    }

    .visual-choice-grid-container {
        margin-bottom: 20px;
    }

    .visual-choice-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin-bottom: 15px;
    }

    .visual-choice-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        background-color: white;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .visual-choice-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .visual-choice-card.selected {
        background-color: #e0f7fa;
        border-color: #3498db;
    }

    .visual-choice-card.sorted {
        opacity: 0.5;
        transform: none;
        box-shadow: none;
    }

    .visual-choice-card:focus {
        outline: 2px solid #9b59b6;
    }

    .visual-choice-card-image {
        width: 100px;
        height: 100px;
        object-fit: contain;
        margin-bottom: 10px;
        border-radius: 4px;
    }

    .visual-choice-card-label {
        font-size: 14px;
        color: #34495e;
        text-align: center;
        font-weight: bold;
    }

    .visual-choice-sorting-area {
        margin-bottom: 20px;
    }

    .visual-choice-sorting-label {
        font-weight: bold;
        margin-bottom: 10px;
        color: #34495e;
    }

    .visual-choice-sorting-categories {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .visual-choice-sorting-category {
        border: 2px solid;
        border-radius: 8px;
        overflow: hidden;
    }

    .visual-choice-sorting-header {
        padding: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: white;
    }

    .visual-choice-sorting-icon {
        font-size: 20px;
    }

    .visual-choice-sorting-category-label {
        font-weight: bold;
        font-size: 16px;
    }

    .visual-choice-sorted-cards {
        min-height: 120px;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        background-color: rgba(255, 255, 255, 0.7);
    }

    .visual-choice-sorted-cards.drag-over {
        background-color: rgba(52, 152, 219, 0.1);
    }

    .visual-choice-empty-message {
        width: 100%;
        text-align: center;
        color: #7f8c8d;
        font-style: italic;
        padding: 20px 0;
    }

    .visual-choice-sorted-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        width: 80px;
        padding: 5px;
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
    }

    .visual-choice-sorted-card-image {
        width: 60px;
        height: 60px;
        object-fit: contain;
        margin-bottom: 5px;
    }

    .visual-choice-sorted-card-label {
        font-size: 12px;
        color: #34495e;
        text-align: center;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .visual-choice-remove-button {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 20px;
        height: 20px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .visual-choice-remove-button:hover {
        background-color: #c0392b;
    }

    .visual-choice-comment-area {
        margin-bottom: 15px;
        padding: 10px;
        background-color: #ecf0f1;
        border-radius: 8px;
    }

    .visual-choice-comment-label {
        font-weight: bold;
        margin-bottom: 10px;
        color: #34495e;
        display: block;
    }

    .visual-choice-comment-input {
        width: 100%;
        min-height: 80px;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        resize: vertical;
    }

    .visual-choice-comment-input:focus {
        outline: 2px solid #3498db;
        border-color: #3498db;
    }

    .visual-choice-voice-comment-button {
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

    .visual-choice-voice-comment-button:hover {
        background-color: #8e44ad;
    }

    .visual-choice-voice-comment-button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    .visual-choice-navigation-area {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .visual-choice-nav-button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s;
    }

    .visual-choice-back-button {
        background-color: #7f8c8d;
        color: white;
    }

    .visual-choice-back-button:hover {
        background-color: #6c7a7a;
    }

    .visual-choice-save-button {
        background-color: #2ecc71;
        color: white;
    }

    .visual-choice-save-button:hover {
        background-color: #27ae60;
    }

    .visual-choice-nav-button:focus {
        outline: 2px solid #9b59b6;
    }

    .visual-choice-status {
        position: absolute;
        left: -9999px;
        height: 1px;
        width: 1px;
        overflow: hidden;
    }

    .visual-choice-voice-command-button {
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

    .visual-choice-voice-command-button:hover {
        background-color: #8e44ad;
    }

    .visual-choice-voice-command-button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    .visual-choice-keyboard-instructions {
        margin-top: 15px;
        font-size: 14px;
        color: #7f8c8d;
    }

    .visual-choice-keyboard-instructions summary {
        cursor: pointer;
        color: #3498db;
    }

    .visual-choice-keyboard-instructions ul {
        margin-top: 10px;
        padding-left: 20px;
    }

    /* High contrast mode */
    .high-contrast .visual-choice-container {
        background-color: black;
        color: white;
    }

    .high-contrast .visual-choice-prompt,
    .high-contrast .visual-choice-sorting-label,
    .high-contrast .visual-choice-comment-label {
        color: white;
    }

    .high-contrast .visual-choice-category-tab {
        background-color: black;
        color: white;
        border: 1px solid white;
    }

    .high-contrast .visual-choice-category-tab.active {
        background-color: white;
        color: black;
    }

    .high-contrast .visual-choice-card {
        background-color: black;
        border-color: white;
    }

    .high-contrast .visual-choice-card-label {
        color: white;
    }

    .high-contrast .visual-choice-card.selected {
        background-color: white;
        border-color: yellow;
    }

    .high-contrast .visual-choice-card.selected .visual-choice-card-label {
        color: black;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
        .visual-choice-container {
            padding: 10px;
        }

        .visual-choice-category-tabs {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 5px;
        }

        .visual-choice-category-tab {
            flex: 0 0 auto;
            white-space: nowrap;
        }

        .visual-choice-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .visual-choice-card-image {
            width: 80px;
            height: 80px;
        }

        .visual-choice-sorting-categories {
            flex-direction: column;
        }
    }

    @media (max-width: 480px) {
        .visual-choice-grid {
            grid-template-columns: repeat(1, 1fr);
        }
    }
`;

document.head.appendChild(style);
