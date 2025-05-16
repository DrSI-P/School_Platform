/**
 * EdPsych Connect - Pupil Voice Tool
 * Ideal vs. Non-Ideal School Module using Personal Construct Psychology
 * 
 * Based on Heather Moran's "Ideal School" technique and adapted for digital implementation
 * using George Kelly's Personal Construct Psychology framework.
 * 
 * This module allows pupils to express their views about school environments by
 * eliciting bipolar constructs (ideal vs. non-ideal) through various interactive methods.
 */

class IdealSchoolPCP {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            containerId: options.containerId || 'ideal-school-pcp',
            width: options.width || '100%',
            targetAge: options.targetAge || 'primary', // primary, secondary, post16
            maxConstructs: options.maxConstructs || 10,
            minConstructs: options.minConstructs || 3,
            includePresetConstructs: options.includePresetConstructs !== undefined ? options.includePresetConstructs : true,
            allowCustomConstructs: options.allowCustomConstructs !== undefined ? options.allowCustomConstructs : true,
            includeDrawingTools: options.includeDrawingTools !== undefined ? options.includeDrawingTools : true,
            includeRatingScale: options.includeRatingScale !== undefined ? options.includeRatingScale : true,
            ratingScaleType: options.ratingScaleType || 'smiley', // smiley, numeric, visual
            accessibilityMode: options.accessibilityMode || false,
            onSave: options.onSave || null,
            onComplete: options.onComplete || null,
            language: options.language || 'en-GB',
            theme: options.theme || 'standard' // standard, playful, formal
        };

        // State variables
        this.state = {
            selectedConstructs: [],
            customConstructs: [],
            ratings: {},
            drawings: {
                ideal: null,
                nonIdeal: null
            },
            currentStep: 'intro', // intro, select, rate, draw, review
            completedSteps: []
        };

        // Preset constructs based on age group
        this.presetConstructs = this.getPresetConstructs();

        // Initialize the component
        this.init();
    }

    /**
     * Initialize the ideal school PCP component
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
        this.container.classList.add('ideal-school-pcp');
        this.container.setAttribute('role', 'application');
        this.container.setAttribute('aria-label', 'Ideal School Activity');
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
    }

    /**
     * Get preset constructs based on age group
     */
    getPresetConstructs() {
        const constructs = {
            primary: [
                {
                    id: 'teachers',
                    ideal: 'Teachers who listen and help',
                    nonIdeal: 'Teachers who shout and don\'t help',
                    category: 'People'
                },
                {
                    id: 'friends',
                    ideal: 'Lots of friends to play with',
                    nonIdeal: 'No one to play with',
                    category: 'People'
                },
                {
                    id: 'playground',
                    ideal: 'Fun playground with lots to do',
                    nonIdeal: 'Boring playground with nothing to do',
                    category: 'Places'
                },
                {
                    id: 'classroom',
                    ideal: 'Bright, comfortable classroom',
                    nonIdeal: 'Dark, uncomfortable classroom',
                    category: 'Places'
                },
                {
                    id: 'lessons',
                    ideal: 'Interesting, fun lessons',
                    nonIdeal: 'Boring, hard lessons',
                    category: 'Learning'
                },
                {
                    id: 'help',
                    ideal: 'Getting help when I need it',
                    nonIdeal: 'No one helps when I\'m stuck',
                    category: 'Learning'
                },
                {
                    id: 'rules',
                    ideal: 'Fair rules that make sense',
                    nonIdeal: 'Confusing rules that seem unfair',
                    category: 'Rules'
                },
                {
                    id: 'bullying',
                    ideal: 'No bullying, everyone is kind',
                    nonIdeal: 'Bullying happens and no one stops it',
                    category: 'Safety'
                },
                {
                    id: 'activities',
                    ideal: 'Lots of different activities and clubs',
                    nonIdeal: 'Nothing interesting to do',
                    category: 'Activities'
                },
                {
                    id: 'food',
                    ideal: 'Tasty food I like to eat',
                    nonIdeal: 'Food I don\'t like',
                    category: 'Food'
                }
            ],
            secondary: [
                {
                    id: 'teachers_sec',
                    ideal: 'Teachers who respect students and explain well',
                    nonIdeal: 'Teachers who don\'t listen and explain poorly',
                    category: 'People'
                },
                {
                    id: 'peers',
                    ideal: 'Supportive peers who accept differences',
                    nonIdeal: 'Judgmental peers who exclude others',
                    category: 'People'
                },
                {
                    id: 'spaces',
                    ideal: 'Comfortable spaces to socialize and study',
                    nonIdeal: 'Nowhere comfortable to hang out or work',
                    category: 'Places'
                },
                {
                    id: 'curriculum',
                    ideal: 'Relevant subjects that prepare for real life',
                    nonIdeal: 'Pointless subjects that won\'t help in future',
                    category: 'Learning'
                },
                {
                    id: 'teaching',
                    ideal: 'Interactive teaching with discussions',
                    nonIdeal: 'Just copying from books or slides',
                    category: 'Learning'
                },
                {
                    id: 'support',
                    ideal: 'Good support for learning difficulties',
                    nonIdeal: 'No help for students who struggle',
                    category: 'Learning'
                },
                {
                    id: 'discipline',
                    ideal: 'Fair discipline that treats everyone equally',
                    nonIdeal: 'Unfair discipline that targets certain students',
                    category: 'Rules'
                },
                {
                    id: 'stress',
                    ideal: 'Help with stress and mental health',
                    nonIdeal: 'No support for stress or mental health',
                    category: 'Wellbeing'
                },
                {
                    id: 'future',
                    ideal: 'Good career advice and preparation',
                    nonIdeal: 'No help planning for the future',
                    category: 'Future'
                },
                {
                    id: 'technology',
                    ideal: 'Modern technology that works well',
                    nonIdeal: 'Old or broken technology',
                    category: 'Resources'
                }
            ],
            post16: [
                {
                    id: 'teaching_post16',
                    ideal: 'Expert teachers who treat students as adults',
                    nonIdeal: 'Teachers who talk down to students',
                    category: 'People'
                },
                {
                    id: 'environment',
                    ideal: 'Adult learning environment with freedom',
                    nonIdeal: 'School-like environment with too many rules',
                    category: 'Environment'
                },
                {
                    id: 'workload',
                    ideal: 'Manageable workload with clear deadlines',
                    nonIdeal: 'Overwhelming workload with unclear expectations',
                    category: 'Learning'
                },
                {
                    id: 'relevance',
                    ideal: 'Courses relevant to career goals',
                    nonIdeal: 'Courses that don\'t help with future plans',
                    category: 'Learning'
                },
                {
                    id: 'independence',
                    ideal: 'Encouraged to work independently',
                    nonIdeal: 'Too much hand-holding or micromanagement',
                    category: 'Learning'
                },
                {
                    id: 'support_post16',
                    ideal: 'Available support when needed',
                    nonIdeal: 'Left to struggle with no support',
                    category: 'Support'
                },
                {
                    id: 'career',
                    ideal: 'Excellent career guidance and opportunities',
                    nonIdeal: 'Poor career advice and few opportunities',
                    category: 'Future'
                },
                {
                    id: 'facilities',
                    ideal: 'Good facilities for study and socializing',
                    nonIdeal: 'Poor facilities with nowhere to work or relax',
                    category: 'Resources'
                },
                {
                    id: 'respect',
                    ideal: 'Mutual respect between staff and students',
                    nonIdeal: 'Lack of respect for students\' views',
                    category: 'Culture'
                },
                {
                    id: 'wellbeing',
                    ideal: 'Support for mental health and wellbeing',
                    nonIdeal: 'No consideration for stress or mental health',
                    category: 'Wellbeing'
                }
            ]
        };

        return constructs;
    }

    /**
     * Create the user interface
     */
    createUI() {
        // Clear the container
        this.container.innerHTML = '';

        // Create header
        const header = document.createElement('div');
        header.classList.add('ideal-school-header');
        
        const title = document.createElement('h2');
        title.classList.add('ideal-school-title');
        title.textContent = 'My Ideal School';
        header.appendChild(title);
        
        const subtitle = document.createElement('div');
        subtitle.classList.add('ideal-school-subtitle');
        subtitle.textContent = 'Help us understand what makes a good school for you';
        header.appendChild(subtitle);
        
        this.container.appendChild(header);

        // Create content area based on current step
        switch (this.state.currentStep) {
            case 'intro':
                this.createIntroSection();
                break;
            case 'select':
                this.createConstructSelectionSection();
                break;
            case 'rate':
                this.createConstructRatingSection();
                break;
            case 'draw':
                this.createDrawingSection();
                break;
            case 'review':
                this.createReviewSection();
                break;
            default:
                this.createIntroSection();
        }

        // Create navigation
        this.createNavigation();

        // Create status message area for accessibility
        const statusArea = document.createElement('div');
        statusArea.classList.add('ideal-school-status');
        statusArea.setAttribute('role', 'status');
        statusArea.setAttribute('aria-live', 'polite');
        this.container.appendChild(statusArea);
        this.statusArea = statusArea;
    }

    /**
     * Create introduction section
     */
    createIntroSection() {
        const introSection = document.createElement('div');
        introSection.classList.add('ideal-school-section');
        
        const introContent = document.createElement('div');
        introContent.classList.add('intro-content');
        
        const introText = document.createElement('div');
        introText.classList.add('intro-text');
        
        // Adjust text based on age group
        let introMessage = '';
        let activityDescription = '';
        
        switch (this.config.targetAge) {
            case 'primary':
                introMessage = 'We want to know what makes a school good or bad for you.';
                activityDescription = 'In this activity, you\'ll tell us what you think makes an ideal school and what makes a not-so-good school. You can choose from our ideas or add your own. Then you\'ll show us how your school compares.';
                break;
            case 'secondary':
                introMessage = 'We\'d like to understand your perspective on what makes a school environment work well for you.';
                activityDescription = 'In this activity, you\'ll identify the characteristics of an ideal school versus a non-ideal school from your perspective. You can select from our suggestions or add your own ideas. Then you\'ll rate how your current school compares to these ideals.';
                break;
            case 'post16':
                introMessage = 'We\'re interested in your views on what makes an effective educational environment for post-16 students.';
                activityDescription = 'This activity allows you to define what an ideal vs. non-ideal educational setting looks like from your perspective. You can select from our suggestions or contribute your own criteria. You\'ll then evaluate how your current institution measures up to these standards.';
                break;
            default:
                introMessage = 'We want to know what makes a school good or bad for you.';
                activityDescription = 'In this activity, you\'ll tell us what you think makes an ideal school and what makes a not-so-good school. You can choose from our ideas or add your own. Then you\'ll show us how your school compares.';
        }
        
        const introPara1 = document.createElement('p');
        introPara1.textContent = introMessage;
        introText.appendChild(introPara1);
        
        const introPara2 = document.createElement('p');
        introPara2.textContent = activityDescription;
        introText.appendChild(introPara2);
        
        const stepsTitle = document.createElement('h3');
        stepsTitle.textContent = 'What you\'ll do:';
        introText.appendChild(stepsTitle);
        
        const stepsList = document.createElement('ol');
        stepsList.classList.add('intro-steps');
        
        const steps = [
            'Choose what matters in a school',
            'Rate your current school',
            'Draw your ideal school (optional)',
            'Review your answers'
        ];
        
        steps.forEach(step => {
            const stepItem = document.createElement('li');
            stepItem.textContent = step;
            stepsList.appendChild(stepItem);
        });
        
        introText.appendChild(stepsList);
        
        // Add note about privacy
        const privacyNote = document.createElement('p');
        privacyNote.classList.add('privacy-note');
        privacyNote.textContent = 'Your answers will help us understand what\'s important to you. They may be shared with teachers and other adults who support you, but only to help make school better for you.';
        introText.appendChild(privacyNote);
        
        introContent.appendChild(introText);
        
        // Add illustration
        const introIllustration = document.createElement('div');
        introIllustration.classList.add('intro-illustration');
        
        const img = document.createElement('img');
        img.src = 'images/ideal_school_intro.png';
        img.alt = 'Illustration of students in a school setting';
        introIllustration.appendChild(img);
        
        introContent.appendChild(introIllustration);
        
        introSection.appendChild(introContent);
        this.container.appendChild(introSection);
    }

    /**
     * Create construct selection section
     */
    createConstructSelectionSection() {
        const selectionSection = document.createElement('div');
        selectionSection.classList.add('ideal-school-section');
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = 'What matters in a school?';
        selectionSection.appendChild(sectionTitle);
        
        const instructions = document.createElement('p');
        instructions.classList.add('section-instructions');
        instructions.textContent = `Choose at least ${this.config.minConstructs} things that matter to you in a school. For each one, you'll see what makes it good or not so good.`;
        selectionSection.appendChild(instructions);
        
        // Create categories and constructs
        const constructsContainer = document.createElement('div');
        constructsContainer.classList.add('constructs-container');
        
        // Group preset constructs by category
        const constructsByCategory = {};
        
        this.presetConstructs[this.config.targetAge].forEach(construct => {
            if (!constructsByCategory[construct.category]) {
                constructsByCategory[construct.category] = [];
            }
            constructsByCategory[construct.category].push(construct);
        });
        
        // Create category sections
        Object.entries(constructsByCategory).forEach(([category, constructs]) => {
            const categorySection = document.createElement('div');
            categorySection.classList.add('construct-category');
            
            const categoryTitle = document.createElement('h4');
            categoryTitle.textContent = category;
            categorySection.appendChild(categoryTitle);
            
            const constructsList = document.createElement('div');
            constructsList.classList.add('constructs-list');
            
            constructs.forEach(construct => {
                const constructItem = this.createConstructItem(construct);
                constructsList.appendChild(constructItem);
            });
            
            categorySection.appendChild(constructsList);
            constructsContainer.appendChild(categorySection);
        });
        
        selectionSection.appendChild(constructsContainer);
        
        // Add custom construct section if enabled
        if (this.config.allowCustomConstructs) {
            const customSection = document.createElement('div');
            customSection.classList.add('custom-construct-section');
            
            const customTitle = document.createElement('h4');
            customTitle.textContent = 'Add your own ideas';
            customSection.appendChild(customTitle);
            
            const customInstructions = document.createElement('p');
            customInstructions.textContent = 'Is there something else that matters to you? Add your own ideas here.';
            customSection.appendChild(customInstructions);
            
            const customForm = document.createElement('div');
            customForm.classList.add('custom-construct-form');
            
            const idealLabel = document.createElement('label');
            idealLabel.htmlFor = 'custom-ideal';
            idealLabel.textContent = 'In my ideal school:';
            customForm.appendChild(idealLabel);
            
            const idealInput = document.createElement('input');
            idealInput.type = 'text';
            idealInput.id = 'custom-ideal';
            idealInput.placeholder = 'e.g., Students can choose what they learn';
            customForm.appendChild(idealInput);
            
            const nonIdealLabel = document.createElement('label');
            nonIdealLabel.htmlFor = 'custom-nonideal';
            nonIdealLabel.textContent = 'In a non-ideal school:';
            customForm.appendChild(nonIdealLabel);
            
            const nonIdealInput = document.createElement('input');
            nonIdealInput.type = 'text';
            nonIdealInput.id = 'custom-nonideal';
            nonIdealInput.placeholder = 'e.g., Students have no choice in what they learn';
            customForm.appendChild(nonIdealInput);
            
            const addButton = document.createElement('button');
            addButton.classList.add('add-custom-construct');
            addButton.textContent = 'Add This Idea';
            
            addButton.addEventListener('click', () => {
                this.addCustomConstruct();
            });
            
            customForm.appendChild(addButton);
            customSection.appendChild(customForm);
            
            // Display custom constructs if any
            if (this.state.customConstructs.length > 0) {
                const customList = document.createElement('div');
                customList.classList.add('custom-constructs-list');
                
                const customListTitle = document.createElement('h5');
                customListTitle.textContent = 'Your added ideas:';
                customList.appendChild(customListTitle);
                
                this.state.customConstructs.forEach(construct => {
                    const constructItem = this.createConstructItem(construct, true);
                    customList.appendChild(constructItem);
                });
                
                customSection.appendChild(customList);
            }
            
            selectionSection.appendChild(customSection);
            
            // Save references for later use
            this.idealInput = idealInput;
            this.nonIdealInput = nonIdealInput;
        }
        
        // Add selection counter
        const selectionCounter = document.createElement('div');
        selectionCounter.classList.add('selection-counter');
        
        const selectedCount = this.state.selectedConstructs.length;
        const minRequired = this.config.minConstructs;
        
        selectionCounter.textContent = `You've selected ${selectedCount} out of at least ${minRequired} needed`;
        
        if (selectedCount >= minRequired) {
            selectionCounter.classList.add('selection-complete');
        }
        
        selectionSection.appendChild(selectionCounter);
        
        this.container.appendChild(selectionSection);
        this.selectionCounter = selectionCounter;
    }

    /**
     * Create a construct item
     */
    createConstructItem(construct, isCustom = false) {
        const constructItem = document.createElement('div');
        constructItem.classList.add('construct-item');
        constructItem.setAttribute('data-construct-id', construct.id);
        
        if (this.state.selectedConstructs.includes(construct.id)) {
            constructItem.classList.add('selected');
        }
        
        const constructContent = document.createElement('div');
        constructContent.classList.add('construct-content');
        
        const idealSide = document.createElement('div');
        idealSide.classList.add('construct-ideal');
        
        const idealIcon = document.createElement('div');
        idealIcon.classList.add('construct-icon', 'ideal-icon');
        idealIcon.innerHTML = '👍';
        idealSide.appendChild(idealIcon);
        
        const idealText = document.createElement('div');
        idealText.classList.add('construct-text');
        idealText.textContent = construct.ideal;
        idealSide.appendChild(idealText);
        
        const nonIdealSide = document.createElement('div');
        nonIdealSide.classList.add('construct-nonideal');
        
        const nonIdealIcon = document.createElement('div');
        nonIdealIcon.classList.add('construct-icon', 'nonideal-icon');
        nonIdealIcon.innerHTML = '👎';
        nonIdealSide.appendChild(nonIdealIcon);
        
        const nonIdealText = document.createElement('div');
        nonIdealText.classList.add('construct-text');
        nonIdealText.textContent = construct.nonIdeal;
        nonIdealSide.appendChild(nonIdealText);
        
        constructContent.appendChild(idealSide);
        constructContent.appendChild(nonIdealSide);
        constructItem.appendChild(constructContent);
        
        // Add controls
        const constructControls = document.createElement('div');
        constructControls.classList.add('construct-controls');
        
        const selectButton = document.createElement('button');
        selectButton.classList.add('construct-select-button');
        
        if (this.state.selectedConstructs.includes(construct.id)) {
            selectButton.textContent = 'Remove';
            selectButton.classList.add('selected');
        } else {
            selectButton.textContent = 'Select';
        }
        
        selectButton.addEventListener('click', () => {
            this.toggleConstructSelection(construct.id);
        });
        
        constructControls.appendChild(selectButton);
        
        // Add delete button for custom constructs
        if (isCustom) {
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('construct-delete-button');
            deleteButton.textContent = 'Delete';
            
            deleteButton.addEventListener('click', () => {
                this.deleteCustomConstruct(construct.id);
            });
            
            constructControls.appendChild(deleteButton);
        }
        
        constructItem.appendChild(constructControls);
        
        return constructItem;
    }

    /**
     * Create construct rating section
     */
    createConstructRatingSection() {
        const ratingSection = document.createElement('div');
        ratingSection.classList.add('ideal-school-section');
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = 'How does your school compare?';
        ratingSection.appendChild(sectionTitle);
        
        const instructions = document.createElement('p');
        instructions.classList.add('section-instructions');
        instructions.textContent = 'For each item, rate where your school is on the scale.';
        ratingSection.appendChild(instructions);
        
        // Create rating items for each selected construct
        const ratingsList = document.createElement('div');
        ratingsList.classList.add('ratings-list');
        
        // Get all selected constructs (preset and custom)
        const allConstructs = [
            ...this.presetConstructs[this.config.targetAge].filter(c => this.state.selectedConstructs.includes(c.id)),
            ...this.state.customConstructs.filter(c => this.state.selectedConstructs.includes(c.id))
        ];
        
        allConstructs.forEach(construct => {
            const ratingItem = this.createRatingItem(construct);
            ratingsList.appendChild(ratingItem);
        });
        
        ratingSection.appendChild(ratingsList);
        
        // Add rating completion counter
        const ratingCounter = document.createElement('div');
        ratingCounter.classList.add('rating-counter');
        
        const ratedCount = Object.keys(this.state.ratings).length;
        const totalToRate = this.state.selectedConstructs.length;
        
        ratingCounter.textContent = `You've rated ${ratedCount} out of ${totalToRate}`;
        
        if (ratedCount === totalToRate) {
            ratingCounter.classList.add('rating-complete');
        }
        
        ratingSection.appendChild(ratingCounter);
        
        this.container.appendChild(ratingSection);
        this.ratingCounter = ratingCounter;
    }

    /**
     * Create a rating item
     */
    createRatingItem(construct) {
        const ratingItem = document.createElement('div');
        ratingItem.classList.add('rating-item');
        ratingItem.setAttribute('data-construct-id', construct.id);
        
        const constructHeader = document.createElement('div');
        constructHeader.classList.add('rating-header');
        
        const constructTitle = document.createElement('h4');
        constructTitle.textContent = construct.ideal;
        constructHeader.appendChild(constructTitle);
        
        ratingItem.appendChild(constructHeader);
        
        // Create rating scale based on config
        const ratingScale = document.createElement('div');
        ratingScale.classList.add('rating-scale');
        
        const nonIdealLabel = document.createElement('div');
        nonIdealLabel.classList.add('scale-label', 'nonideal-label');
        nonIdealLabel.textContent = construct.nonIdeal;
        ratingScale.appendChild(nonIdealLabel);
        
        const scaleContainer = document.createElement('div');
        scaleContainer.classList.add('scale-container');
        
        // Create scale based on type
        switch (this.config.ratingScaleType) {
            case 'smiley':
                this.createSmileyScale(scaleContainer, construct.id);
                break;
            case 'numeric':
                this.createNumericScale(scaleContainer, construct.id);
                break;
            case 'visual':
                this.createVisualScale(scaleContainer, construct.id);
                break;
            default:
                this.createSmileyScale(scaleContainer, construct.id);
        }
        
        ratingScale.appendChild(scaleContainer);
        
        const idealLabel = document.createElement('div');
        idealLabel.classList.add('scale-label', 'ideal-label');
        idealLabel.textContent = construct.ideal;
        ratingScale.appendChild(idealLabel);
        
        ratingItem.appendChild(ratingScale);
        
        return ratingItem;
    }

    /**
     * Create smiley face rating scale
     */
    createSmileyScale(container, constructId) {
        const options = [
            { value: 1, icon: '😞', label: 'Very bad' },
            { value: 2, icon: '🙁', label: 'Bad' },
            { value: 3, icon: '😐', label: 'OK' },
            { value: 4, icon: '🙂', label: 'Good' },
            { value: 5, icon: '😀', label: 'Very good' }
        ];
        
        const currentRating = this.state.ratings[constructId] || 0;
        
        options.forEach(option => {
            const smileyOption = document.createElement('div');
            smileyOption.classList.add('scale-option', 'smiley-option');
            
            if (currentRating === option.value) {
                smileyOption.classList.add('selected');
            }
            
            smileyOption.setAttribute('data-value', option.value);
            smileyOption.setAttribute('aria-label', option.label);
            
            const smileyIcon = document.createElement('div');
            smileyIcon.classList.add('smiley-icon');
            smileyIcon.textContent = option.icon;
            smileyOption.appendChild(smileyIcon);
            
            smileyOption.addEventListener('click', () => {
                this.setRating(constructId, option.value);
            });
            
            container.appendChild(smileyOption);
        });
    }

    /**
     * Create numeric rating scale
     */
    createNumericScale(container, constructId) {
        const currentRating = this.state.ratings[constructId] || 0;
        
        for (let i = 1; i <= 5; i++) {
            const numericOption = document.createElement('div');
            numericOption.classList.add('scale-option', 'numeric-option');
            
            if (currentRating === i) {
                numericOption.classList.add('selected');
            }
            
            numericOption.setAttribute('data-value', i);
            
            const numericValue = document.createElement('div');
            numericValue.classList.add('numeric-value');
            numericValue.textContent = i;
            numericOption.appendChild(numericValue);
            
            numericOption.addEventListener('click', () => {
                this.setRating(constructId, i);
            });
            
            container.appendChild(numericOption);
        }
    }

    /**
     * Create visual rating scale (thermometer, ladder, etc.)
     */
    createVisualScale(container, constructId) {
        const visualContainer = document.createElement('div');
        visualContainer.classList.add('visual-scale-container');
        
        const thermometer = document.createElement('div');
        thermometer.classList.add('thermometer');
        
        const thermometerFill = document.createElement('div');
        thermometerFill.classList.add('thermometer-fill');
        
        const currentRating = this.state.ratings[constructId] || 0;
        if (currentRating > 0) {
            const fillHeight = (currentRating / 5) * 100;
            thermometerFill.style.height = `${fillHeight}%`;
        }
        
        thermometer.appendChild(thermometerFill);
        visualContainer.appendChild(thermometer);
        
        // Add click/touch handler for the thermometer
        thermometer.addEventListener('click', (e) => {
            const rect = thermometer.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const thermometerHeight = rect.height;
            
            // Calculate rating based on click position (inverted, as higher is better)
            const clickRatio = 1 - (clickY / thermometerHeight);
            let rating = Math.ceil(clickRatio * 5);
            
            // Ensure rating is between 1 and 5
            rating = Math.max(1, Math.min(5, rating));
            
            this.setRating(constructId, rating);
        });
        
        // Add markers
        const markers = document.createElement('div');
        markers.classList.add('thermometer-markers');
        
        for (let i = 5; i >= 1; i--) {
            const marker = document.createElement('div');
            marker.classList.add('thermometer-marker');
            marker.textContent = i;
            markers.appendChild(marker);
        }
        
        visualContainer.appendChild(markers);
        container.appendChild(visualContainer);
    }

    /**
     * Create drawing section
     */
    createDrawingSection() {
        const drawingSection = document.createElement('div');
        drawingSection.classList.add('ideal-school-section');
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = 'Draw your ideal school';
        drawingSection.appendChild(sectionTitle);
        
        const instructions = document.createElement('p');
        instructions.classList.add('section-instructions');
        instructions.textContent = 'Use the drawing tools to show what your ideal school looks like. This is optional - you can skip this step if you prefer.';
        drawingSection.appendChild(instructions);
        
        // Create drawing tabs
        const drawingTabs = document.createElement('div');
        drawingTabs.classList.add('drawing-tabs');
        
        const idealTab = document.createElement('div');
        idealTab.classList.add('drawing-tab', 'active');
        idealTab.textContent = 'My Ideal School';
        idealTab.setAttribute('data-tab', 'ideal');
        
        idealTab.addEventListener('click', () => {
            this.switchDrawingTab('ideal');
        });
        
        const nonIdealTab = document.createElement('div');
        nonIdealTab.classList.add('drawing-tab');
        nonIdealTab.textContent = 'Non-Ideal School';
        nonIdealTab.setAttribute('data-tab', 'nonIdeal');
        
        nonIdealTab.addEventListener('click', () => {
            this.switchDrawingTab('nonIdeal');
        });
        
        drawingTabs.appendChild(idealTab);
        drawingTabs.appendChild(nonIdealTab);
        
        drawingSection.appendChild(drawingTabs);
        
        // Create drawing canvas container
        const canvasContainer = document.createElement('div');
        canvasContainer.classList.add('drawing-canvas-container');
        
        // Create ideal school canvas
        const idealCanvas = document.createElement('canvas');
        idealCanvas.classList.add('drawing-canvas', 'active');
        idealCanvas.width = 600;
        idealCanvas.height = 400;
        idealCanvas.setAttribute('data-type', 'ideal');
        
        // Create non-ideal school canvas
        const nonIdealCanvas = document.createElement('canvas');
        nonIdealCanvas.classList.add('drawing-canvas');
        nonIdealCanvas.width = 600;
        nonIdealCanvas.height = 400;
        nonIdealCanvas.setAttribute('data-type', 'nonIdeal');
        
        canvasContainer.appendChild(idealCanvas);
        canvasContainer.appendChild(nonIdealCanvas);
        
        drawingSection.appendChild(canvasContainer);
        
        // Create drawing tools
        const drawingTools = document.createElement('div');
        drawingTools.classList.add('drawing-tools');
        
        // Color picker
        const colorPicker = document.createElement('div');
        colorPicker.classList.add('drawing-tool-group');
        
        const colorLabel = document.createElement('label');
        colorLabel.textContent = 'Color:';
        colorPicker.appendChild(colorLabel);
        
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#000000';
        colorInput.classList.add('color-picker');
        
        colorInput.addEventListener('change', () => {
            this.setDrawingColor(colorInput.value);
        });
        
        colorPicker.appendChild(colorInput);
        drawingTools.appendChild(colorPicker);
        
        // Brush size
        const brushSize = document.createElement('div');
        brushSize.classList.add('drawing-tool-group');
        
        const brushLabel = document.createElement('label');
        brushLabel.textContent = 'Size:';
        brushSize.appendChild(brushLabel);
        
        const brushInput = document.createElement('input');
        brushInput.type = 'range';
        brushInput.min = '1';
        brushInput.max = '20';
        brushInput.value = '5';
        brushInput.classList.add('brush-size');
        
        brushInput.addEventListener('input', () => {
            this.setDrawingSize(parseInt(brushInput.value));
        });
        
        brushSize.appendChild(brushInput);
        drawingTools.appendChild(brushSize);
        
        // Tool buttons
        const toolButtons = document.createElement('div');
        toolButtons.classList.add('drawing-tool-group', 'tool-buttons');
        
        const penTool = document.createElement('button');
        penTool.classList.add('tool-button', 'active');
        penTool.innerHTML = '✏️';
        penTool.setAttribute('data-tool', 'pen');
        penTool.setAttribute('aria-label', 'Pen tool');
        
        penTool.addEventListener('click', () => {
            this.setDrawingTool('pen');
        });
        
        const eraserTool = document.createElement('button');
        eraserTool.classList.add('tool-button');
        eraserTool.innerHTML = '🧽';
        eraserTool.setAttribute('data-tool', 'eraser');
        eraserTool.setAttribute('aria-label', 'Eraser tool');
        
        eraserTool.addEventListener('click', () => {
            this.setDrawingTool('eraser');
        });
        
        toolButtons.appendChild(penTool);
        toolButtons.appendChild(eraserTool);
        drawingTools.appendChild(toolButtons);
        
        // Action buttons
        const actionButtons = document.createElement('div');
        actionButtons.classList.add('drawing-tool-group', 'action-buttons');
        
        const clearButton = document.createElement('button');
        clearButton.classList.add('action-button', 'clear-button');
        clearButton.textContent = 'Clear';
        
        clearButton.addEventListener('click', () => {
            this.clearDrawing();
        });
        
        const skipButton = document.createElement('button');
        skipButton.classList.add('action-button', 'skip-button');
        skipButton.textContent = 'Skip Drawing';
        
        skipButton.addEventListener('click', () => {
            this.skipDrawing();
        });
        
        actionButtons.appendChild(clearButton);
        actionButtons.appendChild(skipButton);
        drawingTools.appendChild(actionButtons);
        
        drawingSection.appendChild(drawingTools);
        
        this.container.appendChild(drawingSection);
        
        // Initialize drawing canvases
        this.initializeDrawing(idealCanvas, 'ideal');
        this.initializeDrawing(nonIdealCanvas, 'nonIdeal');
        
        // Save references
        this.idealCanvas = idealCanvas;
        this.nonIdealCanvas = nonIdealCanvas;
        this.idealTab = idealTab;
        this.nonIdealTab = nonIdealTab;
        this.colorInput = colorInput;
        this.brushInput = brushInput;
        this.penTool = penTool;
        this.eraserTool = eraserTool;
    }

    /**
     * Create review section
     */
    createReviewSection() {
        const reviewSection = document.createElement('div');
        reviewSection.classList.add('ideal-school-section');
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = 'Review your answers';
        reviewSection.appendChild(sectionTitle);
        
        const instructions = document.createElement('p');
        instructions.classList.add('section-instructions');
        instructions.textContent = 'Here\'s a summary of what you\'ve told us about your ideal school and how your current school compares.';
        reviewSection.appendChild(instructions);
        
        // Create ratings summary
        const ratingsSummary = document.createElement('div');
        ratingsSummary.classList.add('ratings-summary');
        
        const summaryTitle = document.createElement('h4');
        summaryTitle.textContent = 'Your School Ratings';
        ratingsSummary.appendChild(summaryTitle);
        
        // Get all selected constructs (preset and custom)
        const allConstructs = [
            ...this.presetConstructs[this.config.targetAge].filter(c => this.state.selectedConstructs.includes(c.id)),
            ...this.state.customConstructs.filter(c => this.state.selectedConstructs.includes(c.id))
        ];
        
        // Create summary table
        const summaryTable = document.createElement('table');
        summaryTable.classList.add('ratings-table');
        
        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const aspectHeader = document.createElement('th');
        aspectHeader.textContent = 'Aspect';
        headerRow.appendChild(aspectHeader);
        
        const ratingHeader = document.createElement('th');
        ratingHeader.textContent = 'Your Rating';
        headerRow.appendChild(ratingHeader);
        
        tableHeader.appendChild(headerRow);
        summaryTable.appendChild(tableHeader);
        
        // Create table body
        const tableBody = document.createElement('tbody');
        
        allConstructs.forEach(construct => {
            const row = document.createElement('tr');
            
            const aspectCell = document.createElement('td');
            aspectCell.textContent = construct.ideal;
            row.appendChild(aspectCell);
            
            const ratingCell = document.createElement('td');
            const rating = this.state.ratings[construct.id] || 0;
            
            if (rating > 0) {
                // Create visual representation of rating
                const ratingDisplay = document.createElement('div');
                ratingDisplay.classList.add('rating-display');
                
                // Add stars or other visual indicator
                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement('span');
                    star.classList.add('rating-star');
                    
                    if (i <= rating) {
                        star.classList.add('filled');
                        star.innerHTML = '★';
                    } else {
                        star.innerHTML = '☆';
                    }
                    
                    ratingDisplay.appendChild(star);
                }
                
                ratingCell.appendChild(ratingDisplay);
            } else {
                ratingCell.textContent = 'Not rated';
            }
            
            row.appendChild(ratingCell);
            tableBody.appendChild(row);
        });
        
        summaryTable.appendChild(tableBody);
        ratingsSummary.appendChild(summaryTable);
        
        reviewSection.appendChild(ratingsSummary);
        
        // Add drawings if available
        if (this.state.drawings.ideal || this.state.drawings.nonIdeal) {
            const drawingsSummary = document.createElement('div');
            drawingsSummary.classList.add('drawings-summary');
            
            const drawingsTitle = document.createElement('h4');
            drawingsTitle.textContent = 'Your School Drawings';
            drawingsSummary.appendChild(drawingsTitle);
            
            const drawingsContainer = document.createElement('div');
            drawingsContainer.classList.add('drawings-container');
            
            if (this.state.drawings.ideal) {
                const idealDrawing = document.createElement('div');
                idealDrawing.classList.add('drawing-summary');
                
                const idealTitle = document.createElement('h5');
                idealTitle.textContent = 'My Ideal School';
                idealDrawing.appendChild(idealTitle);
                
                const idealImg = document.createElement('img');
                idealImg.src = this.state.drawings.ideal;
                idealImg.alt = 'Drawing of ideal school';
                idealImg.classList.add('drawing-image');
                idealDrawing.appendChild(idealImg);
                
                drawingsContainer.appendChild(idealDrawing);
            }
            
            if (this.state.drawings.nonIdeal) {
                const nonIdealDrawing = document.createElement('div');
                nonIdealDrawing.classList.add('drawing-summary');
                
                const nonIdealTitle = document.createElement('h5');
                nonIdealTitle.textContent = 'Non-Ideal School';
                nonIdealDrawing.appendChild(nonIdealTitle);
                
                const nonIdealImg = document.createElement('img');
                nonIdealImg.src = this.state.drawings.nonIdeal;
                nonIdealImg.alt = 'Drawing of non-ideal school';
                nonIdealImg.classList.add('drawing-image');
                nonIdealDrawing.appendChild(nonIdealImg);
                
                drawingsContainer.appendChild(nonIdealDrawing);
            }
            
            drawingsSummary.appendChild(drawingsContainer);
            reviewSection.appendChild(drawingsSummary);
        }
        
        // Add overall comments section
        const commentsSection = document.createElement('div');
        commentsSection.classList.add('comments-section');
        
        const commentsTitle = document.createElement('h4');
        commentsTitle.textContent = 'Any other thoughts about your ideal school?';
        commentsSection.appendChild(commentsTitle);
        
        const commentsTextarea = document.createElement('textarea');
        commentsTextarea.classList.add('comments-textarea');
        commentsTextarea.placeholder = 'Add any other comments here...';
        commentsTextarea.value = this.state.comments || '';
        
        commentsTextarea.addEventListener('input', () => {
            this.state.comments = commentsTextarea.value;
        });
        
        commentsSection.appendChild(commentsTextarea);
        reviewSection.appendChild(commentsSection);
        
        // Add completion message
        const completionMessage = document.createElement('div');
        completionMessage.classList.add('completion-message');
        completionMessage.innerHTML = '<p>Thank you for sharing your thoughts about your ideal school! This information will help us understand what matters to you and how we can make school better.</p>';
        reviewSection.appendChild(completionMessage);
        
        this.container.appendChild(reviewSection);
    }

    /**
     * Create navigation buttons
     */
    createNavigation() {
        const navigation = document.createElement('div');
        navigation.classList.add('ideal-school-navigation');
        
        // Back button (except on intro)
        if (this.state.currentStep !== 'intro') {
            const backButton = document.createElement('button');
            backButton.classList.add('nav-button', 'back-button');
            backButton.textContent = 'Back';
            
            backButton.addEventListener('click', () => {
                this.navigateBack();
            });
            
            navigation.appendChild(backButton);
        }
        
        // Next/Finish button
        const nextButton = document.createElement('button');
        nextButton.classList.add('nav-button', 'next-button');
        
        if (this.state.currentStep === 'review') {
            nextButton.textContent = 'Finish';
        } else {
            nextButton.textContent = 'Next';
        }
        
        // Disable next button if requirements not met
        if (this.state.currentStep === 'select' && this.state.selectedConstructs.length < this.config.minConstructs) {
            nextButton.disabled = true;
        }
        
        nextButton.addEventListener('click', () => {
            this.navigateNext();
        });
        
        navigation.appendChild(nextButton);
        
        this.container.appendChild(navigation);
        this.nextButton = nextButton;
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only process if the ideal school container is focused
            if (!this.container.contains(document.activeElement) && document.activeElement !== document.body) {
                return;
            }
            
            if (e.key === 'Enter' && e.ctrlKey) {
                // Ctrl+Enter to navigate next
                this.navigateNext();
            }
        });
    }

    /**
     * Set up accessibility features
     */
    setupAccessibilityFeatures() {
        // Add keyboard navigation instructions
        const instructions = document.createElement('div');
        instructions.classList.add('ideal-school-keyboard-instructions');
        instructions.innerHTML = `
            <details>
                <summary>Accessibility Options</summary>
                <ul>
                    <li>Tab: Navigate between elements</li>
                    <li>Space/Enter: Select or activate focused element</li>
                    <li>Ctrl+Enter: Go to next step</li>
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
     * Toggle construct selection
     */
    toggleConstructSelection(constructId) {
        const index = this.state.selectedConstructs.indexOf(constructId);
        
        if (index === -1) {
            // Add to selected constructs
            this.state.selectedConstructs.push(constructId);
        } else {
            // Remove from selected constructs
            this.state.selectedConstructs.splice(index, 1);
        }
        
        // Update UI
        const constructItem = this.container.querySelector(`.construct-item[data-construct-id="${constructId}"]`);
        if (constructItem) {
            constructItem.classList.toggle('selected');
            
            const selectButton = constructItem.querySelector('.construct-select-button');
            if (selectButton) {
                if (this.state.selectedConstructs.includes(constructId)) {
                    selectButton.textContent = 'Remove';
                    selectButton.classList.add('selected');
                } else {
                    selectButton.textContent = 'Select';
                    selectButton.classList.remove('selected');
                }
            }
        }
        
        // Update selection counter
        if (this.selectionCounter) {
            const selectedCount = this.state.selectedConstructs.length;
            const minRequired = this.config.minConstructs;
            
            this.selectionCounter.textContent = `You've selected ${selectedCount} out of at least ${minRequired} needed`;
            
            if (selectedCount >= minRequired) {
                this.selectionCounter.classList.add('selection-complete');
                if (this.nextButton) {
                    this.nextButton.disabled = false;
                }
            } else {
                this.selectionCounter.classList.remove('selection-complete');
                if (this.nextButton) {
                    this.nextButton.disabled = true;
                }
            }
        }
        
        // Save state
        this.saveState();
    }

    /**
     * Add custom construct
     */
    addCustomConstruct() {
        if (!this.idealInput || !this.nonIdealInput) return;
        
        const idealText = this.idealInput.value.trim();
        const nonIdealText = this.nonIdealInput.value.trim();
        
        if (!idealText || !nonIdealText) {
            this.updateStatus('Please fill in both fields for your custom idea');
            return;
        }
        
        // Generate unique ID
        const id = `custom_${Date.now()}`;
        
        // Create construct
        const customConstruct = {
            id,
            ideal: idealText,
            nonIdeal: nonIdealText,
            category: 'Custom'
        };
        
        // Add to custom constructs
        this.state.customConstructs.push(customConstruct);
        
        // Automatically select it
        this.state.selectedConstructs.push(id);
        
        // Clear inputs
        this.idealInput.value = '';
        this.nonIdealInput.value = '';
        
        // Rebuild UI
        this.createUI();
        
        // Save state
        this.saveState();
        
        this.updateStatus('Custom idea added');
    }

    /**
     * Delete custom construct
     */
    deleteCustomConstruct(constructId) {
        // Remove from custom constructs
        this.state.customConstructs = this.state.customConstructs.filter(c => c.id !== constructId);
        
        // Remove from selected constructs if present
        const index = this.state.selectedConstructs.indexOf(constructId);
        if (index !== -1) {
            this.state.selectedConstructs.splice(index, 1);
        }
        
        // Remove from ratings if present
        if (this.state.ratings[constructId]) {
            delete this.state.ratings[constructId];
        }
        
        // Rebuild UI
        this.createUI();
        
        // Save state
        this.saveState();
        
        this.updateStatus('Custom idea deleted');
    }

    /**
     * Set rating for a construct
     */
    setRating(constructId, rating) {
        this.state.ratings[constructId] = rating;
        
        // Update UI
        const ratingItem = this.container.querySelector(`.rating-item[data-construct-id="${constructId}"]`);
        if (ratingItem) {
            // Update based on scale type
            switch (this.config.ratingScaleType) {
                case 'smiley':
                    const smileyOptions = ratingItem.querySelectorAll('.smiley-option');
                    smileyOptions.forEach(option => {
                        const value = parseInt(option.getAttribute('data-value'));
                        if (value === rating) {
                            option.classList.add('selected');
                        } else {
                            option.classList.remove('selected');
                        }
                    });
                    break;
                case 'numeric':
                    const numericOptions = ratingItem.querySelectorAll('.numeric-option');
                    numericOptions.forEach(option => {
                        const value = parseInt(option.getAttribute('data-value'));
                        if (value === rating) {
                            option.classList.add('selected');
                        } else {
                            option.classList.remove('selected');
                        }
                    });
                    break;
                case 'visual':
                    const thermometerFill = ratingItem.querySelector('.thermometer-fill');
                    if (thermometerFill) {
                        const fillHeight = (rating / 5) * 100;
                        thermometerFill.style.height = `${fillHeight}%`;
                    }
                    break;
            }
        }
        
        // Update rating counter
        if (this.ratingCounter) {
            const ratedCount = Object.keys(this.state.ratings).length;
            const totalToRate = this.state.selectedConstructs.length;
            
            this.ratingCounter.textContent = `You've rated ${ratedCount} out of ${totalToRate}`;
            
            if (ratedCount === totalToRate) {
                this.ratingCounter.classList.add('rating-complete');
            }
        }
        
        // Save state
        this.saveState();
    }

    /**
     * Initialize drawing canvas
     */
    initializeDrawing(canvas, type) {
        const ctx = canvas.getContext('2d');
        
        // Set default drawing state
        this.drawingState = {
            isDrawing: false,
            lastX: 0,
            lastY: 0,
            color: '#000000',
            size: 5,
            tool: 'pen'
        };
        
        // Load existing drawing if available
        if (this.state.drawings[type]) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
            img.src = this.state.drawings[type];
        } else {
            // Clear canvas
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Set up event listeners
        canvas.addEventListener('mousedown', (e) => {
            this.startDrawing(e, canvas);
        });
        
        canvas.addEventListener('mousemove', (e) => {
            this.draw(e, canvas);
        });
        
        canvas.addEventListener('mouseup', () => {
            this.stopDrawing(canvas, type);
        });
        
        canvas.addEventListener('mouseout', () => {
            this.stopDrawing(canvas, type);
        });
        
        // Touch support
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup');
            canvas.dispatchEvent(mouseEvent);
        });
    }

    /**
     * Start drawing
     */
    startDrawing(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        this.drawingState.isDrawing = true;
        this.drawingState.lastX = e.clientX - rect.left;
        this.drawingState.lastY = e.clientY - rect.top;
    }

    /**
     * Draw on canvas
     */
    draw(e, canvas) {
        if (!this.drawingState.isDrawing) return;
        
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = this.drawingState.size;
        
        if (this.drawingState.tool === 'eraser') {
            ctx.strokeStyle = '#ffffff';
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.strokeStyle = this.drawingState.color;
            ctx.globalCompositeOperation = 'source-over';
        }
        
        ctx.beginPath();
        ctx.moveTo(this.drawingState.lastX, this.drawingState.lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        this.drawingState.lastX = x;
        this.drawingState.lastY = y;
    }

    /**
     * Stop drawing
     */
    stopDrawing(canvas, type) {
        if (this.drawingState.isDrawing) {
            this.drawingState.isDrawing = false;
            
            // Save drawing
            this.state.drawings[type] = canvas.toDataURL();
            
            // Save state
            this.saveState();
        }
    }

    /**
     * Switch drawing tab
     */
    switchDrawingTab(tab) {
        // Update tabs
        this.idealTab.classList.toggle('active', tab === 'ideal');
        this.nonIdealTab.classList.toggle('active', tab === 'nonIdeal');
        
        // Update canvases
        this.idealCanvas.classList.toggle('active', tab === 'ideal');
        this.nonIdealCanvas.classList.toggle('active', tab === 'nonIdeal');
    }

    /**
     * Set drawing color
     */
    setDrawingColor(color) {
        this.drawingState.color = color;
    }

    /**
     * Set drawing size
     */
    setDrawingSize(size) {
        this.drawingState.size = size;
    }

    /**
     * Set drawing tool
     */
    setDrawingTool(tool) {
        this.drawingState.tool = tool;
        
        // Update UI
        this.penTool.classList.toggle('active', tool === 'pen');
        this.eraserTool.classList.toggle('active', tool === 'eraser');
    }

    /**
     * Clear current drawing
     */
    clearDrawing() {
        const activeCanvas = this.container.querySelector('.drawing-canvas.active');
        if (!activeCanvas) return;
        
        const type = activeCanvas.getAttribute('data-type');
        const ctx = activeCanvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);
        
        // Clear saved drawing
        this.state.drawings[type] = null;
        
        // Save state
        this.saveState();
        
        this.updateStatus(`${type === 'ideal' ? 'Ideal' : 'Non-ideal'} school drawing cleared`);
    }

    /**
     * Skip drawing step
     */
    skipDrawing() {
        this.navigateNext();
    }

    /**
     * Navigate to next step
     */
    navigateNext() {
        // Validate current step
        if (this.state.currentStep === 'select' && this.state.selectedConstructs.length < this.config.minConstructs) {
            this.updateStatus(`Please select at least ${this.config.minConstructs} items`);
            return;
        }
        
        // Mark current step as completed if not already
        if (!this.state.completedSteps.includes(this.state.currentStep)) {
            this.state.completedSteps.push(this.state.currentStep);
        }
        
        // Determine next step
        let nextStep = '';
        
        switch (this.state.currentStep) {
            case 'intro':
                nextStep = 'select';
                break;
            case 'select':
                nextStep = 'rate';
                break;
            case 'rate':
                nextStep = this.config.includeDrawingTools ? 'draw' : 'review';
                break;
            case 'draw':
                nextStep = 'review';
                break;
            case 'review':
                this.completeActivity();
                return;
            default:
                nextStep = 'intro';
        }
        
        // Update current step
        this.state.currentStep = nextStep;
        
        // Rebuild UI
        this.createUI();
        
        // Save state
        this.saveState();
        
        this.updateStatus(`Moved to ${this.getStepName(nextStep)} step`);
    }

    /**
     * Navigate to previous step
     */
    navigateBack() {
        // Determine previous step
        let prevStep = '';
        
        switch (this.state.currentStep) {
            case 'select':
                prevStep = 'intro';
                break;
            case 'rate':
                prevStep = 'select';
                break;
            case 'draw':
                prevStep = 'rate';
                break;
            case 'review':
                prevStep = this.config.includeDrawingTools ? 'draw' : 'rate';
                break;
            default:
                prevStep = 'intro';
        }
        
        // Update current step
        this.state.currentStep = prevStep;
        
        // Rebuild UI
        this.createUI();
        
        this.updateStatus(`Returned to ${this.getStepName(prevStep)} step`);
    }

    /**
     * Get human-readable step name
     */
    getStepName(step) {
        const stepNames = {
            'intro': 'introduction',
            'select': 'selection',
            'rate': 'rating',
            'draw': 'drawing',
            'review': 'review'
        };
        
        return stepNames[step] || step;
    }

    /**
     * Complete the activity
     */
    completeActivity() {
        // Prepare results
        const results = {
            selectedConstructs: this.state.selectedConstructs,
            customConstructs: this.state.customConstructs,
            ratings: this.state.ratings,
            drawings: this.state.drawings,
            comments: this.state.comments,
            completedAt: new Date()
        };
        
        // Call onComplete callback if provided
        if (this.config.onComplete) {
            this.config.onComplete(results);
        }
        
        // Show completion message
        this.updateStatus('Activity completed');
        
        // Reset state for new activity
        this.resetState();
    }

    /**
     * Reset state for new activity
     */
    resetState() {
        this.state = {
            selectedConstructs: [],
            customConstructs: [],
            ratings: {},
            drawings: {
                ideal: null,
                nonIdeal: null
            },
            currentStep: 'intro',
            completedSteps: []
        };
        
        // Rebuild UI
        this.createUI();
    }

    /**
     * Save current state
     */
    saveState() {
        // Call onSave callback if provided
        if (this.config.onSave) {
            this.config.onSave(this.state);
        }
        
        // Save to local storage as fallback
        try {
            localStorage.setItem('idealSchoolPCPState', JSON.stringify(this.state));
        } catch (e) {
            console.warn('Failed to save state to local storage:', e);
        }
        
        return this.state;
    }

    /**
     * Load saved state
     */
    loadState(state) {
        if (!state) {
            // Try to load from local storage
            try {
                const savedState = localStorage.getItem('idealSchoolPCPState');
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
        this.state = state;
        
        // Rebuild UI
        this.createUI();
        
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
    module.exports = { IdealSchoolPCP };
} else {
    window.IdealSchoolPCP = IdealSchoolPCP;
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .ideal-school-pcp {
        font-family: 'Open Sans', sans-serif;
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    .ideal-school-header {
        text-align: center;
        margin-bottom: 20px;
    }

    .ideal-school-title {
        font-size: 24px;
        color: #34495e;
        margin: 0 0 5px 0;
    }

    .ideal-school-subtitle {
        font-size: 16px;
        color: #7f8c8d;
    }

    .ideal-school-section {
        margin-bottom: 30px;
        padding: 15px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
    }

    .ideal-school-section h3 {
        font-size: 18px;
        color: #34495e;
        margin-top: 0;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ecf0f1;
    }

    .ideal-school-section h4 {
        font-size: 16px;
        color: #34495e;
        margin-top: 15px;
        margin-bottom: 10px;
    }

    .section-instructions {
        margin-bottom: 20px;
        color: #7f8c8d;
    }

    /* Introduction Section */
    .intro-content {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }

    .intro-text {
        flex: 1;
        min-width: 300px;
    }

    .intro-illustration {
        flex: 1;
        min-width: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .intro-illustration img {
        max-width: 100%;
        max-height: 300px;
        border-radius: 8px;
    }

    .intro-steps {
        margin-left: 20px;
        padding-left: 20px;
    }

    .intro-steps li {
        margin-bottom: 10px;
    }

    .privacy-note {
        margin-top: 20px;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
        font-size: 14px;
        color: #7f8c8d;
        font-style: italic;
    }

    /* Construct Selection Section */
    .constructs-container {
        margin-bottom: 20px;
    }

    .construct-category {
        margin-bottom: 20px;
    }

    .construct-category h4 {
        padding-bottom: 5px;
        border-bottom: 1px solid #ecf0f1;
    }

    .constructs-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 15px;
        margin-bottom: 15px;
    }

    .construct-item {
        border: 2px solid #ecf0f1;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .construct-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .construct-item.selected {
        border-color: #3498db;
    }

    .construct-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
    }

    .construct-ideal, .construct-nonideal {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .construct-icon {
        font-size: 20px;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ideal-icon {
        color: #2ecc71;
    }

    .nonideal-icon {
        color: #e74c3c;
    }

    .construct-text {
        flex: 1;
    }

    .construct-controls {
        display: flex;
        gap: 10px;
        padding: 10px;
        background-color: #f8f9fa;
    }

    .construct-select-button {
        flex: 1;
        padding: 8px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .construct-select-button:hover {
        background-color: #2980b9;
    }

    .construct-select-button.selected {
        background-color: #e74c3c;
    }

    .construct-select-button.selected:hover {
        background-color: #c0392b;
    }

    .construct-delete-button {
        padding: 8px;
        background-color: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .construct-delete-button:hover {
        background-color: #c0392b;
    }

    .selection-counter {
        margin-top: 20px;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
        text-align: center;
        font-weight: bold;
        color: #7f8c8d;
    }

    .selection-counter.selection-complete {
        color: #2ecc71;
    }

    /* Custom Construct Section */
    .custom-construct-section {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px dashed #ecf0f1;
    }

    .custom-construct-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
    }

    .custom-construct-form label {
        font-weight: bold;
        color: #34495e;
    }

    .custom-construct-form input {
        padding: 10px;
        border: 1px solid #ecf0f1;
        border-radius: 4px;
    }

    .add-custom-construct {
        padding: 10px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-top: 10px;
    }

    .add-custom-construct:hover {
        background-color: #2980b9;
    }

    .custom-constructs-list {
        margin-top: 20px;
    }

    /* Rating Section */
    .ratings-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .rating-item {
        border: 1px solid #ecf0f1;
        border-radius: 8px;
        overflow: hidden;
    }

    .rating-header {
        padding: 10px;
        background-color: #f8f9fa;
    }

    .rating-header h4 {
        margin: 0;
        color: #34495e;
    }

    .rating-scale {
        display: flex;
        flex-direction: column;
        padding: 15px;
        gap: 10px;
    }

    .scale-label {
        font-size: 14px;
    }

    .nonideal-label {
        color: #e74c3c;
        align-self: flex-start;
    }

    .ideal-label {
        color: #2ecc71;
        align-self: flex-end;
    }

    .scale-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
    }

    /* Smiley Scale */
    .smiley-option {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        transition: background-color 0.2s, transform 0.2s;
    }

    .smiley-option:hover {
        background-color: #f8f9fa;
        transform: scale(1.1);
    }

    .smiley-option.selected {
        background-color: #3498db;
        color: white;
    }

    .smiley-icon {
        font-size: 24px;
    }

    /* Numeric Scale */
    .numeric-option {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        background-color: #f8f9fa;
        transition: background-color 0.2s, transform 0.2s;
    }

    .numeric-option:hover {
        background-color: #ecf0f1;
        transform: scale(1.1);
    }

    .numeric-option.selected {
        background-color: #3498db;
        color: white;
    }

    .numeric-value {
        font-weight: bold;
    }

    /* Visual Scale */
    .visual-scale-container {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 200px;
    }

    .thermometer {
        width: 40px;
        height: 100%;
        background-color: #f8f9fa;
        border-radius: 20px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
    }

    .thermometer-fill {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0%;
        background-color: #3498db;
        transition: height 0.3s;
    }

    .thermometer-markers {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .thermometer-marker {
        font-weight: bold;
        color: #7f8c8d;
    }

    .rating-counter {
        margin-top: 20px;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 4px;
        text-align: center;
        font-weight: bold;
        color: #7f8c8d;
    }

    .rating-counter.rating-complete {
        color: #2ecc71;
    }

    /* Drawing Section */
    .drawing-tabs {
        display: flex;
        margin-bottom: 15px;
    }

    .drawing-tab {
        flex: 1;
        padding: 10px;
        text-align: center;
        background-color: #f8f9fa;
        cursor: pointer;
        border: 1px solid #ecf0f1;
    }

    .drawing-tab:first-child {
        border-radius: 4px 0 0 4px;
    }

    .drawing-tab:last-child {
        border-radius: 0 4px 4px 0;
    }

    .drawing-tab.active {
        background-color: #3498db;
        color: white;
    }

    .drawing-canvas-container {
        position: relative;
        width: 100%;
        margin-bottom: 15px;
        border: 1px solid #ecf0f1;
        border-radius: 4px;
        overflow: hidden;
    }

    .drawing-canvas {
        display: none;
        width: 100%;
        height: auto;
        cursor: crosshair;
    }

    .drawing-canvas.active {
        display: block;
    }

    .drawing-tools {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 15px;
    }

    .drawing-tool-group {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .color-picker {
        width: 40px;
        height: 40px;
        padding: 0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .brush-size {
        width: 100px;
    }

    .tool-buttons {
        display: flex;
        gap: 5px;
    }

    .tool-button {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f8f9fa;
        border: 1px solid #ecf0f1;
        border-radius: 4px;
        cursor: pointer;
        font-size: 20px;
    }

    .tool-button.active {
        background-color: #3498db;
        color: white;
    }

    .action-buttons {
        margin-left: auto;
    }

    .action-button {
        padding: 8px 15px;
        background-color: #95a5a6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .action-button:hover {
        background-color: #7f8c8d;
    }

    .clear-button {
        background-color: #e74c3c;
    }

    .clear-button:hover {
        background-color: #c0392b;
    }

    /* Review Section */
    .ratings-summary {
        margin-bottom: 30px;
    }

    .ratings-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
    }

    .ratings-table th, .ratings-table td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ecf0f1;
    }

    .ratings-table th {
        background-color: #f8f9fa;
        font-weight: bold;
        color: #34495e;
    }

    .rating-display {
        display: flex;
        gap: 2px;
    }

    .rating-star {
        color: #f1c40f;
    }

    .drawings-summary {
        margin-bottom: 30px;
    }

    .drawings-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 15px;
    }

    .drawing-summary {
        flex: 1;
        min-width: 300px;
    }

    .drawing-image {
        width: 100%;
        border: 1px solid #ecf0f1;
        border-radius: 4px;
    }

    .comments-section {
        margin-bottom: 30px;
    }

    .comments-textarea {
        width: 100%;
        min-height: 100px;
        padding: 10px;
        border: 1px solid #ecf0f1;
        border-radius: 4px;
        resize: vertical;
    }

    .completion-message {
        padding: 15px;
        background-color: #e8f8f5;
        border-radius: 4px;
        color: #27ae60;
    }

    /* Navigation */
    .ideal-school-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .nav-button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
    }

    .back-button {
        background-color: #95a5a6;
        color: white;
    }

    .back-button:hover {
        background-color: #7f8c8d;
    }

    .next-button {
        background-color: #3498db;
        color: white;
    }

    .next-button:hover {
        background-color: #2980b9;
    }

    .next-button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    /* Accessibility */
    .ideal-school-status {
        position: absolute;
        left: -9999px;
        height: 1px;
        width: 1px;
        overflow: hidden;
    }

    .ideal-school-keyboard-instructions {
        margin-top: 20px;
        font-size: 14px;
        color: #7f8c8d;
    }

    .ideal-school-keyboard-instructions summary {
        cursor: pointer;
        color: #3498db;
    }

    .ideal-school-keyboard-instructions ul {
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

    .theme-playful .ideal-school-title {
        color: #e67e22;
    }

    .theme-playful .construct-item.selected,
    .theme-playful .smiley-option.selected,
    .theme-playful .numeric-option.selected,
    .theme-playful .thermometer-fill,
    .theme-playful .drawing-tab.active,
    .theme-playful .tool-button.active {
        background-color: #e67e22;
    }

    .theme-playful .construct-select-button,
    .theme-playful .add-custom-construct,
    .theme-playful .next-button,
    .theme-playful .accessibility-controls button {
        background-color: #e67e22;
    }

    .theme-playful .construct-select-button:hover,
    .theme-playful .add-custom-construct:hover,
    .theme-playful .next-button:hover,
    .theme-playful .accessibility-controls button:hover {
        background-color: #d35400;
    }

    /* Theme: Formal */
    .theme-formal {
        background-color: #f5f5f5;
        border: 1px solid #34495e;
    }

    .theme-formal .ideal-school-title {
        color: #2c3e50;
    }

    .theme-formal .construct-item.selected,
    .theme-formal .smiley-option.selected,
    .theme-formal .numeric-option.selected,
    .theme-formal .thermometer-fill,
    .theme-formal .drawing-tab.active,
    .theme-formal .tool-button.active {
        background-color: #34495e;
    }

    .theme-formal .construct-select-button,
    .theme-formal .add-custom-construct,
    .theme-formal .next-button,
    .theme-formal .accessibility-controls button {
        background-color: #34495e;
    }

    .theme-formal .construct-select-button:hover,
    .theme-formal .add-custom-construct:hover,
    .theme-formal .next-button:hover,
    .theme-formal .accessibility-controls button:hover {
        background-color: #2c3e50;
    }

    /* High contrast mode */
    .high-contrast {
        background-color: black;
        color: white;
        border-color: yellow;
    }

    .high-contrast .ideal-school-title,
    .high-contrast .ideal-school-section h3,
    .high-contrast .ideal-school-section h4,
    .high-contrast .construct-category h4,
    .high-contrast .rating-header h4 {
        color: white;
    }

    .high-contrast .ideal-school-subtitle,
    .high-contrast .section-instructions,
    .high-contrast .privacy-note {
        color: #cccccc;
    }

    .high-contrast .ideal-school-section,
    .high-contrast .rating-item,
    .high-contrast .drawing-canvas-container {
        background-color: #222222;
        box-shadow: 0 1px 5px rgba(255, 255, 255, 0.1);
    }

    .high-contrast .construct-item,
    .high-contrast .drawing-tab {
        border-color: #444444;
        background-color: #222222;
    }

    .high-contrast .construct-item.selected {
        border-color: yellow;
    }

    .high-contrast .construct-controls,
    .high-contrast .rating-header,
    .high-contrast .selection-counter,
    .high-contrast .rating-counter {
        background-color: #333333;
    }

    .high-contrast .custom-construct-form input,
    .high-contrast .comments-textarea {
        background-color: black;
        color: white;
        border-color: #444444;
    }

    .high-contrast .construct-select-button,
    .high-contrast .add-custom-construct,
    .high-contrast .nav-button {
        background-color: #555555;
        color: white;
        border: 1px solid white;
    }

    .high-contrast .construct-select-button:hover,
    .high-contrast .add-custom-construct:hover,
    .high-contrast .nav-button:hover {
        background-color: #777777;
    }

    .high-contrast .nonideal-label {
        color: #ff6b6b;
    }

    .high-contrast .ideal-label {
        color: #6bff6b;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
        .ideal-school-pcp {
            padding: 15px;
        }

        .intro-content {
            flex-direction: column;
        }

        .constructs-list {
            grid-template-columns: 1fr;
        }

        .drawing-tools {
            flex-direction: column;
            align-items: flex-start;
        }

        .action-buttons {
            margin-left: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }

    @media (max-width: 480px) {
        .ideal-school-title {
            font-size: 20px;
        }

        .drawing-tabs {
            flex-direction: column;
        }

        .drawing-tab:first-child {
            border-radius: 4px 4px 0 0;
        }

        .drawing-tab:last-child {
            border-radius: 0 0 4px 4px;
        }

        .visual-scale-container {
            height: 150px;
        }
    }
`;

document.head.appendChild(style);
