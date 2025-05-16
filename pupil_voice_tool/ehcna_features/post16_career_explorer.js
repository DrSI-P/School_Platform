/**
 * EdPsych Connect - Pupil Voice Tool
 * Post-16 Career Explorer Component
 * 
 * This module implements an interest-based career exploration tool for post-16 transition planning,
 * helping students discover potential career paths based on their interests and strengths.
 */

class Post16CareerExplorer {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            containerId: options.containerId || 'post16-career-explorer',
            width: options.width || '100%',
            interestAreas: options.interestAreas || [
                {
                    id: 'creative',
                    name: 'Creative Arts',
                    description: 'Activities involving art, design, music, drama, or creative expression',
                    icon: '🎨',
                    color: '#e74c3c',
                    careers: [
                        { id: 'graphic_designer', title: 'Graphic Designer', description: 'Create visual concepts for advertisements, publications, and websites', education: ['College Diploma', 'University Degree'], skills: ['Drawing', 'Computer Design', 'Creativity'] },
                        { id: 'musician', title: 'Musician', description: 'Perform, compose, or teach music', education: ['Music College', 'Self-taught', 'Apprenticeship'], skills: ['Musical Ability', 'Performance', 'Practice'] },
                        { id: 'photographer', title: 'Photographer', description: 'Take and edit photographs for various purposes', education: ['College Course', 'Self-taught'], skills: ['Visual Eye', 'Technical Knowledge', 'Editing'] },
                        { id: 'actor', title: 'Actor', description: 'Perform in theatre, film, television, or other media', education: ['Drama School', 'University Degree'], skills: ['Performance', 'Voice Control', 'Emotional Range'] },
                        { id: 'fashion_designer', title: 'Fashion Designer', description: 'Design clothing, accessories, and footwear', education: ['Fashion College', 'University Degree'], skills: ['Drawing', 'Sewing', 'Trend Awareness'] },
                        { id: 'interior_designer', title: 'Interior Designer', description: 'Design interior spaces for homes and businesses', education: ['Design College', 'University Degree'], skills: ['Spatial Awareness', 'Color Theory', 'Technical Drawing'] },
                        { id: 'animator', title: 'Animator', description: 'Create moving images for films, games, and digital media', education: ['Animation College', 'University Degree'], skills: ['Drawing', 'Computer Skills', 'Storytelling'] },
                        { id: 'writer', title: 'Writer', description: 'Create written content for books, magazines, websites, or scripts', education: ['University Degree', 'Self-taught'], skills: ['Writing', 'Creativity', 'Research'] }
                    ]
                },
                {
                    id: 'technical',
                    name: 'Technical & Practical',
                    description: 'Activities involving building, fixing, or working with your hands',
                    icon: '🔧',
                    color: '#3498db',
                    careers: [
                        { id: 'carpenter', title: 'Carpenter', description: 'Build and repair wooden structures and furniture', education: ['Apprenticeship', 'College Course'], skills: ['Woodworking', 'Measurement', 'Physical Strength'] },
                        { id: 'electrician', title: 'Electrician', description: 'Install and maintain electrical systems', education: ['Apprenticeship', 'Technical College'], skills: ['Technical Knowledge', 'Problem Solving', 'Safety Awareness'] },
                        { id: 'mechanic', title: 'Mechanic', description: 'Repair and maintain vehicles', education: ['Apprenticeship', 'Technical College'], skills: ['Technical Knowledge', 'Problem Solving', 'Manual Dexterity'] },
                        { id: 'plumber', title: 'Plumber', description: 'Install and repair water and gas systems', education: ['Apprenticeship', 'Technical College'], skills: ['Technical Knowledge', 'Problem Solving', 'Physical Fitness'] },
                        { id: 'chef', title: 'Chef', description: 'Prepare and cook food in restaurants or other settings', education: ['Culinary School', 'Apprenticeship'], skills: ['Cooking', 'Time Management', 'Creativity'] },
                        { id: 'gardener', title: 'Gardener/Landscaper', description: 'Design, plant, and maintain gardens and landscapes', education: ['Horticulture College', 'Apprenticeship'], skills: ['Plant Knowledge', 'Physical Fitness', 'Design'] },
                        { id: 'hairdresser', title: 'Hairdresser', description: 'Cut, style, and color hair', education: ['Hairdressing College', 'Apprenticeship'], skills: ['Cutting Techniques', 'Customer Service', 'Creativity'] },
                        { id: 'tailor', title: 'Tailor', description: 'Make and alter clothing', education: ['Fashion College', 'Apprenticeship'], skills: ['Sewing', 'Measurement', 'Attention to Detail'] }
                    ]
                },
                {
                    id: 'scientific',
                    name: 'Scientific & Analytical',
                    description: 'Activities involving research, analysis, and solving complex problems',
                    icon: '🔬',
                    color: '#9b59b6',
                    careers: [
                        { id: 'scientist', title: 'Scientist', description: 'Conduct research and experiments in various fields', education: ['University Degree', 'PhD'], skills: ['Research', 'Analysis', 'Critical Thinking'] },
                        { id: 'lab_technician', title: 'Laboratory Technician', description: 'Assist scientists with experiments and research', education: ['College Diploma', 'University Degree'], skills: ['Precision', 'Technical Knowledge', 'Attention to Detail'] },
                        { id: 'data_analyst', title: 'Data Analyst', description: 'Analyze data to help organizations make decisions', education: ['University Degree'], skills: ['Mathematics', 'Computer Skills', 'Problem Solving'] },
                        { id: 'engineer', title: 'Engineer', description: 'Design and build structures, machines, or systems', education: ['University Degree'], skills: ['Mathematics', 'Problem Solving', 'Technical Knowledge'] },
                        { id: 'pharmacist', title: 'Pharmacist', description: 'Prepare and dispense medications', education: ['University Degree'], skills: ['Chemistry Knowledge', 'Precision', 'Communication'] },
                        { id: 'environmental_scientist', title: 'Environmental Scientist', description: 'Study environmental issues and develop solutions', education: ['University Degree'], skills: ['Research', 'Analysis', 'Field Work'] },
                        { id: 'forensic_scientist', title: 'Forensic Scientist', description: 'Analyze evidence for criminal investigations', education: ['University Degree'], skills: ['Laboratory Skills', 'Attention to Detail', 'Analysis'] },
                        { id: 'meteorologist', title: 'Meteorologist', description: 'Study and predict weather patterns', education: ['University Degree'], skills: ['Data Analysis', 'Computer Modeling', 'Physics'] }
                    ]
                },
                {
                    id: 'social',
                    name: 'Social & Helping',
                    description: 'Activities involving helping, teaching, or caring for others',
                    icon: '👥',
                    color: '#2ecc71',
                    careers: [
                        { id: 'teacher', title: 'Teacher', description: 'Educate students in schools or other settings', education: ['University Degree', 'PGCE'], skills: ['Communication', 'Subject Knowledge', 'Patience'] },
                        { id: 'nurse', title: 'Nurse', description: 'Provide healthcare and support to patients', education: ['Nursing Degree'], skills: ['Medical Knowledge', 'Compassion', 'Communication'] },
                        { id: 'social_worker', title: 'Social Worker', description: 'Help people solve and cope with problems in their lives', education: ['University Degree'], skills: ['Empathy', 'Communication', 'Problem Solving'] },
                        { id: 'counsellor', title: 'Counsellor', description: 'Help people with emotional or mental health issues', education: ['University Degree', 'Professional Qualification'], skills: ['Listening', 'Empathy', 'Communication'] },
                        { id: 'youth_worker', title: 'Youth Worker', description: 'Support young people's personal and social development', education: ['University Degree', 'Professional Qualification'], skills: ['Communication', 'Empathy', 'Activity Planning'] },
                        { id: 'care_worker', title: 'Care Worker', description: 'Provide support to people who need assistance', education: ['College Diploma', 'On-the-job Training'], skills: ['Compassion', 'Patience', 'Physical Stamina'] },
                        { id: 'paramedic', title: 'Paramedic', description: 'Provide emergency medical care', education: ['Paramedic Science Degree', 'Professional Qualification'], skills: ['Medical Knowledge', 'Quick Thinking', 'Physical Fitness'] },
                        { id: 'childcare_worker', title: 'Childcare Worker', description: 'Care for children in various settings', education: ['Childcare Qualification', 'College Diploma'], skills: ['Patience', 'Energy', 'Creativity'] }
                    ]
                },
                {
                    id: 'business',
                    name: 'Business & Organisation',
                    description: 'Activities involving planning, managing, or selling',
                    icon: '💼',
                    color: '#f39c12',
                    careers: [
                        { id: 'business_manager', title: 'Business Manager', description: 'Oversee the operations of a business or department', education: ['University Degree', 'Professional Qualification'], skills: ['Leadership', 'Organization', 'Communication'] },
                        { id: 'accountant', title: 'Accountant', description: 'Prepare and examine financial records', education: ['University Degree', 'Professional Qualification'], skills: ['Mathematics', 'Attention to Detail', 'Analysis'] },
                        { id: 'marketing_specialist', title: 'Marketing Specialist', description: 'Promote products, services, or brands', education: ['University Degree', 'College Diploma'], skills: ['Creativity', 'Communication', 'Analysis'] },
                        { id: 'sales_representative', title: 'Sales Representative', description: 'Sell products or services to customers', education: ['College Diploma', 'On-the-job Training'], skills: ['Communication', 'Persuasion', 'Product Knowledge'] },
                        { id: 'human_resources', title: 'Human Resources Officer', description: 'Manage employee relations, recruitment, and training', education: ['University Degree', 'Professional Qualification'], skills: ['Communication', 'Organization', 'Problem Solving'] },
                        { id: 'event_planner', title: 'Event Planner', description: 'Organize and coordinate events', education: ['College Diploma', 'University Degree'], skills: ['Organization', 'Communication', 'Attention to Detail'] },
                        { id: 'retail_manager', title: 'Retail Manager', description: 'Oversee the daily operations of a retail store', education: ['College Diploma', 'On-the-job Training'], skills: ['Leadership', 'Customer Service', 'Organization'] },
                        { id: 'entrepreneur', title: 'Entrepreneur', description: 'Start and run your own business', education: ['Various', 'Self-taught'], skills: ['Initiative', 'Risk-taking', 'Business Knowledge'] }
                    ]
                },
                {
                    id: 'digital',
                    name: 'Digital & Technology',
                    description: 'Activities involving computers, programming, or digital media',
                    icon: '💻',
                    color: '#1abc9c',
                    careers: [
                        { id: 'software_developer', title: 'Software Developer', description: 'Create computer programs and applications', education: ['University Degree', 'College Diploma', 'Self-taught'], skills: ['Programming', 'Problem Solving', 'Logical Thinking'] },
                        { id: 'web_designer', title: 'Web Designer', description: 'Design and create websites', education: ['College Diploma', 'University Degree', 'Self-taught'], skills: ['Design', 'HTML/CSS', 'User Experience'] },
                        { id: 'it_support', title: 'IT Support Technician', description: 'Help people with computer problems', education: ['College Diploma', 'Professional Qualification'], skills: ['Technical Knowledge', 'Problem Solving', 'Communication'] },
                        { id: 'game_developer', title: 'Game Developer', description: 'Create video games', education: ['University Degree', 'College Diploma'], skills: ['Programming', 'Creativity', 'Teamwork'] },
                        { id: 'social_media_manager', title: 'Social Media Manager', description: 'Manage social media accounts for organizations', education: ['College Diploma', 'University Degree'], skills: ['Communication', 'Content Creation', 'Strategy'] },
                        { id: 'cybersecurity_specialist', title: 'Cybersecurity Specialist', description: 'Protect computer systems from threats', education: ['University Degree', 'Professional Qualification'], skills: ['Technical Knowledge', 'Problem Solving', 'Attention to Detail'] },
                        { id: 'digital_marketer', title: 'Digital Marketer', description: 'Promote products or services online', education: ['College Diploma', 'University Degree'], skills: ['Marketing Knowledge', 'Analytics', 'Creativity'] },
                        { id: 'data_scientist', title: 'Data Scientist', description: 'Analyze complex data to find patterns and insights', education: ['University Degree', 'Masters/PhD'], skills: ['Mathematics', 'Programming', 'Analysis'] }
                    ]
                },
                {
                    id: 'outdoor',
                    name: 'Outdoor & Physical',
                    description: 'Activities involving sports, nature, or working outdoors',
                    icon: '🌳',
                    color: '#27ae60',
                    careers: [
                        { id: 'sports_coach', title: 'Sports Coach', description: 'Train individuals or teams in sports', education: ['Coaching Qualification', 'Sports Science Degree'], skills: ['Sports Knowledge', 'Communication', 'Motivation'] },
                        { id: 'fitness_instructor', title: 'Fitness Instructor', description: 'Lead exercise classes or personal training sessions', education: ['Fitness Qualification', 'College Diploma'], skills: ['Fitness Knowledge', 'Communication', 'Motivation'] },
                        { id: 'farmer', title: 'Farmer', description: 'Grow crops or raise animals', education: ['Agricultural College', 'On-the-job Training'], skills: ['Physical Stamina', 'Technical Knowledge', 'Problem Solving'] },
                        { id: 'park_ranger', title: 'Park Ranger', description: 'Protect and manage natural areas', education: ['Environmental Degree', 'College Diploma'], skills: ['Nature Knowledge', 'Communication', 'Physical Fitness'] },
                        { id: 'outdoor_activity_instructor', title: 'Outdoor Activity Instructor', description: 'Lead outdoor activities like climbing or canoeing', education: ['Instructor Qualifications', 'College Diploma'], skills: ['Activity Skills', 'Safety Knowledge', 'Communication'] },
                        { id: 'construction_worker', title: 'Construction Worker', description: 'Build or repair structures', education: ['Apprenticeship', 'On-the-job Training'], skills: ['Physical Strength', 'Technical Knowledge', 'Teamwork'] },
                        { id: 'animal_care_worker', title: 'Animal Care Worker', description: 'Care for animals in various settings', education: ['Animal Care Qualification', 'College Diploma'], skills: ['Animal Knowledge', 'Compassion', 'Physical Stamina'] },
                        { id: 'environmental_consultant', title: 'Environmental Consultant', description: 'Advise on environmental issues and solutions', education: ['Environmental Degree'], skills: ['Environmental Knowledge', 'Analysis', 'Communication'] }
                    ]
                },
                {
                    id: 'public_service',
                    name: 'Public Service',
                    description: 'Activities involving helping the community or country',
                    icon: '🚒',
                    color: '#34495e',
                    careers: [
                        { id: 'police_officer', title: 'Police Officer', description: 'Maintain law and order and protect the public', education: ['Police Training', 'College Diploma'], skills: ['Physical Fitness', 'Communication', 'Problem Solving'] },
                        { id: 'firefighter', title: 'Firefighter', description: 'Respond to fires and other emergencies', education: ['Firefighter Training', 'College Diploma'], skills: ['Physical Fitness', 'Courage', 'Teamwork'] },
                        { id: 'army_soldier', title: 'Army Soldier', description: 'Serve in the armed forces', education: ['Military Training'], skills: ['Physical Fitness', 'Discipline', 'Teamwork'] },
                        { id: 'civil_servant', title: 'Civil Servant', description: 'Work for government departments', education: ['Various', 'University Degree'], skills: ['Organization', 'Communication', 'Subject Knowledge'] },
                        { id: 'local_government_officer', title: 'Local Government Officer', description: 'Work for local councils on various services', education: ['College Diploma', 'University Degree'], skills: ['Administration', 'Communication', 'Subject Knowledge'] },
                        { id: 'charity_worker', title: 'Charity Worker', description: 'Work for non-profit organizations', education: ['Various', 'University Degree'], skills: ['Communication', 'Organization', 'Passion for Cause'] },
                        { id: 'politician', title: 'Politician', description: 'Represent and advocate for communities', education: ['Various', 'University Degree'], skills: ['Public Speaking', 'Debate', 'Policy Knowledge'] },
                        { id: 'diplomat', title: 'Diplomat', description: 'Represent your country abroad', education: ['University Degree', 'Civil Service Exams'], skills: ['Languages', 'Cultural Awareness', 'Negotiation'] }
                    ]
                }
            ],
            strengthAreas: options.strengthAreas || [
                { id: 'verbal', name: 'Verbal/Linguistic', description: 'Good with words, speaking, and writing', icon: '📝' },
                { id: 'logical', name: 'Logical/Mathematical', description: 'Good with numbers, patterns, and logical problems', icon: '🔢' },
                { id: 'visual', name: 'Visual/Spatial', description: 'Good with images, designs, and visualizing', icon: '🎨' },
                { id: 'physical', name: 'Physical/Kinesthetic', description: 'Good with movement, sports, and hands-on activities', icon: '⚽' },
                { id: 'musical', name: 'Musical', description: 'Good with sounds, rhythm, and music', icon: '🎵' },
                { id: 'interpersonal', name: 'Interpersonal', description: 'Good with understanding and working with others', icon: '👥' },
                { id: 'intrapersonal', name: 'Intrapersonal', description: 'Good with understanding yourself and self-reflection', icon: '🧠' },
                { id: 'naturalistic', name: 'Naturalistic', description: 'Good with nature, animals, and the environment', icon: '🌿' }
            ],
            valueAreas: options.valueAreas || [
                { id: 'helping', name: 'Helping Others', description: 'Making a difference in people\'s lives' },
                { id: 'creativity', name: 'Creativity', description: 'Creating or designing new things' },
                { id: 'independence', name: 'Independence', description: 'Working on your own and making your own decisions' },
                { id: 'teamwork', name: 'Teamwork', description: 'Working with others towards shared goals' },
                { id: 'challenge', name: 'Challenge', description: 'Solving difficult problems and overcoming obstacles' },
                { id: 'security', name: 'Security', description: 'Having a stable and reliable job' },
                { id: 'variety', name: 'Variety', description: 'Doing different things and having new experiences' },
                { id: 'leadership', name: 'Leadership', description: 'Guiding and directing others' }
            ],
            showPathways: options.showPathways !== undefined ? options.showPathways : true,
            pathways: options.pathways || [
                { id: 'university', name: 'University', description: 'Study for a degree (usually 3-4 years)', icon: '🎓' },
                { id: 'college', name: 'College', description: 'Study for a diploma or certificate (usually 1-2 years)', icon: '📚' },
                { id: 'apprenticeship', name: 'Apprenticeship', description: 'Learn while working and earning (usually 1-4 years)', icon: '🔨' },
                { id: 'work', name: 'Direct Employment', description: 'Start working and learn on the job', icon: '💼' },
                { id: 'self_employed', name: 'Self-Employment', description: 'Start your own business or work freelance', icon: '🚀' },
                { id: 'gap_year', name: 'Gap Year', description: 'Take time to travel, volunteer, or gain experience', icon: '✈️' }
            ],
            allowComments: options.allowComments !== undefined ? options.allowComments : true,
            prompt: options.prompt || 'Explore careers based on your interests:',
            onSave: options.onSave || null,
            accessibilityMode: options.accessibilityMode || false,
            voiceCommands: options.voiceCommands !== undefined ? options.voiceCommands : true,
            keyboardShortcuts: options.keyboardShortcuts !== undefined ? options.keyboardShortcuts : true,
            imagePath: options.imagePath || 'images/careers/',
            placeholderImage: options.placeholderImage || 'placeholder.png'
        };

        // State variables
        this.state = {
            currentView: 'interests', // interests, strengths, values, results, pathways, career_detail
            selectedInterests: [],
            selectedStrengths: [],
            selectedValues: [],
            careerResults: [],
            selectedCareer: null,
            selectedPathway: null,
            comments: {}
        };

        // Initialize the component
        this.init();
    }

    /**
     * Initialize the post-16 career explorer component
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
        this.container.classList.add('post16-career-explorer');
        this.container.setAttribute('role', 'application');
        this.container.setAttribute('aria-label', 'Post-16 Career Explorer Tool');
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

        // Create header
        const header = document.createElement('div');
        header.classList.add('post16-header');
        
        const title = document.createElement('h2');
        title.classList.add('post16-title');
        title.textContent = 'Post-16 Career Explorer';
        header.appendChild(title);
        
        const subtitle = document.createElement('div');
        subtitle.classList.add('post16-subtitle');
        subtitle.textContent = 'Discover career paths based on your interests, strengths, and values';
        header.appendChild(subtitle);
        
        this.container.appendChild(header);

        // Create progress indicator
        const progressContainer = document.createElement('div');
        progressContainer.classList.add('post16-progress-container');
        
        const progressSteps = [
            { id: 'interests', label: 'Interests' },
            { id: 'strengths', label: 'Strengths' },
            { id: 'values', label: 'Values' },
            { id: 'results', label: 'Results' },
            { id: 'pathways', label: 'Pathways' }
        ];
        
        progressSteps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.classList.add('post16-progress-step');
            
            if (step.id === this.state.currentView) {
                stepElement.classList.add('active');
            } else if ((progressSteps.findIndex(s => s.id === this.state.currentView) > index) || 
                      (this.state.currentView === 'career_detail' && index <= 3)) {
                stepElement.classList.add('completed');
            }
            
            const stepNumber = document.createElement('div');
            stepNumber.classList.add('post16-step-number');
            stepNumber.textContent = index + 1;
            stepElement.appendChild(stepNumber);
            
            const stepLabel = document.createElement('div');
            stepLabel.classList.add('post16-step-label');
            stepLabel.textContent = step.label;
            stepElement.appendChild(stepLabel);
            
            // Add click handler to navigate to that step if it's completed or active
            if (stepElement.classList.contains('completed') || stepElement.classList.contains('active')) {
                stepElement.addEventListener('click', () => {
                    this.navigateToView(step.id);
                });
                stepElement.style.cursor = 'pointer';
            }
            
            progressContainer.appendChild(stepElement);
            
            // Add connector line except for the last step
            if (index < progressSteps.length - 1) {
                const connector = document.createElement('div');
                connector.classList.add('post16-step-connector');
                progressContainer.appendChild(connector);
            }
        });
        
        this.container.appendChild(progressContainer);

        // Create main content area
        const mainContent = document.createElement('div');
        mainContent.classList.add('post16-main-content');
        
        // Render different content based on current view
        switch (this.state.currentView) {
            case 'interests':
                this.renderInterestsView(mainContent);
                break;
            case 'strengths':
                this.renderStrengthsView(mainContent);
                break;
            case 'values':
                this.renderValuesView(mainContent);
                break;
            case 'results':
                this.renderResultsView(mainContent);
                break;
            case 'pathways':
                this.renderPathwaysView(mainContent);
                break;
            case 'career_detail':
                this.renderCareerDetailView(mainContent);
                break;
            default:
                this.renderInterestsView(mainContent);
        }
        
        this.container.appendChild(mainContent);

        // Create navigation buttons
        const navigationArea = document.createElement('div');
        navigationArea.classList.add('post16-navigation-area');
        
        // Back button
        const backButton = document.createElement('button');
        backButton.classList.add('post16-nav-button', 'post16-back-button');
        backButton.textContent = '< Back';
        backButton.setAttribute('aria-label', 'Go back');
        
        backButton.addEventListener('click', () => {
            this.navigateBack();
        });
        
        navigationArea.appendChild(backButton);
        
        // Next/Continue button
        const nextButton = document.createElement('button');
        nextButton.classList.add('post16-nav-button', 'post16-next-button');
        
        if (this.state.currentView === 'pathways' || 
            (this.state.currentView === 'results' && !this.config.showPathways)) {
            nextButton.textContent = 'Finish';
            nextButton.setAttribute('aria-label', 'Finish and save results');
            
            nextButton.addEventListener('click', () => {
                this.saveResults();
            });
        } else {
            nextButton.textContent = 'Continue >';
            nextButton.setAttribute('aria-label', 'Continue to next step');
            
            nextButton.addEventListener('click', () => {
                this.navigateNext();
            });
        }
        
        navigationArea.appendChild(nextButton);
        this.container.appendChild(navigationArea);

        // Create status message area for accessibility
        const statusArea = document.createElement('div');
        statusArea.classList.add('post16-status');
        statusArea.setAttribute('role', 'status');
        statusArea.setAttribute('aria-live', 'polite');
        this.container.appendChild(statusArea);
        this.statusArea = statusArea;
    }

    /**
     * Render the interests selection view
     */
    renderInterestsView(container) {
        const viewContainer = document.createElement('div');
        viewContainer.classList.add('post16-view-container', 'post16-interests-view');
        
        const prompt = document.createElement('div');
        prompt.classList.add('post16-prompt');
        prompt.textContent = 'Select the interest areas that appeal to you:';
        viewContainer.appendChild(prompt);
        
        const interestsGrid = document.createElement('div');
        interestsGrid.classList.add('post16-interests-grid');
        
        this.config.interestAreas.forEach(interest => {
            const interestCard = document.createElement('div');
            interestCard.classList.add('post16-interest-card');
            interestCard.setAttribute('data-interest-id', interest.id);
            interestCard.setAttribute('tabindex', '0');
            interestCard.setAttribute('role', 'checkbox');
            interestCard.setAttribute('aria-checked', this.state.selectedInterests.includes(interest.id) ? 'true' : 'false');
            
            if (this.state.selectedInterests.includes(interest.id)) {
                interestCard.classList.add('selected');
            }
            
            const interestIcon = document.createElement('div');
            interestIcon.classList.add('post16-interest-icon');
            interestIcon.textContent = interest.icon;
            interestIcon.style.backgroundColor = interest.color;
            interestCard.appendChild(interestIcon);
            
            const interestName = document.createElement('div');
            interestName.classList.add('post16-interest-name');
            interestName.textContent = interest.name;
            interestCard.appendChild(interestName);
            
            const interestDesc = document.createElement('div');
            interestDesc.classList.add('post16-interest-description');
            interestDesc.textContent = interest.description;
            interestCard.appendChild(interestDesc);
            
            interestCard.addEventListener('click', () => {
                this.toggleInterest(interest.id);
            });
            
            interestCard.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.toggleInterest(interest.id);
                }
            });
            
            interestsGrid.appendChild(interestCard);
        });
        
        viewContainer.appendChild(interestsGrid);
        
        const instruction = document.createElement('div');
        instruction.classList.add('post16-instruction');
        instruction.textContent = 'Select at least one interest area to continue. You can select multiple areas.';
        viewContainer.appendChild(instruction);
        
        container.appendChild(viewContainer);
    }

    /**
     * Render the strengths selection view
     */
    renderStrengthsView(container) {
        const viewContainer = document.createElement('div');
        viewContainer.classList.add('post16-view-container', 'post16-strengths-view');
        
        const prompt = document.createElement('div');
        prompt.classList.add('post16-prompt');
        prompt.textContent = 'Select your strengths and abilities:';
        viewContainer.appendChild(prompt);
        
        const strengthsGrid = document.createElement('div');
        strengthsGrid.classList.add('post16-strengths-grid');
        
        this.config.strengthAreas.forEach(strength => {
            const strengthCard = document.createElement('div');
            strengthCard.classList.add('post16-strength-card');
            strengthCard.setAttribute('data-strength-id', strength.id);
            strengthCard.setAttribute('tabindex', '0');
            strengthCard.setAttribute('role', 'checkbox');
            strengthCard.setAttribute('aria-checked', this.state.selectedStrengths.includes(strength.id) ? 'true' : 'false');
            
            if (this.state.selectedStrengths.includes(strength.id)) {
                strengthCard.classList.add('selected');
            }
            
            const strengthIcon = document.createElement('div');
            strengthIcon.classList.add('post16-strength-icon');
            strengthIcon.textContent = strength.icon;
            strengthCard.appendChild(strengthIcon);
            
            const strengthName = document.createElement('div');
            strengthName.classList.add('post16-strength-name');
            strengthName.textContent = strength.name;
            strengthCard.appendChild(strengthName);
            
            const strengthDesc = document.createElement('div');
            strengthDesc.classList.add('post16-strength-description');
            strengthDesc.textContent = strength.description;
            strengthCard.appendChild(strengthDesc);
            
            strengthCard.addEventListener('click', () => {
                this.toggleStrength(strength.id);
            });
            
            strengthCard.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.toggleStrength(strength.id);
                }
            });
            
            strengthsGrid.appendChild(strengthCard);
        });
        
        viewContainer.appendChild(strengthsGrid);
        
        const instruction = document.createElement('div');
        instruction.classList.add('post16-instruction');
        instruction.textContent = 'Select at least one strength to continue. You can select multiple strengths.';
        viewContainer.appendChild(instruction);
        
        container.appendChild(viewContainer);
    }

    /**
     * Render the values selection view
     */
    renderValuesView(container) {
        const viewContainer = document.createElement('div');
        viewContainer.classList.add('post16-view-container', 'post16-values-view');
        
        const prompt = document.createElement('div');
        prompt.classList.add('post16-prompt');
        prompt.textContent = 'Select what matters most to you in a career:';
        viewContainer.appendChild(prompt);
        
        const valuesGrid = document.createElement('div');
        valuesGrid.classList.add('post16-values-grid');
        
        this.config.valueAreas.forEach(value => {
            const valueCard = document.createElement('div');
            valueCard.classList.add('post16-value-card');
            valueCard.setAttribute('data-value-id', value.id);
            valueCard.setAttribute('tabindex', '0');
            valueCard.setAttribute('role', 'checkbox');
            valueCard.setAttribute('aria-checked', this.state.selectedValues.includes(value.id) ? 'true' : 'false');
            
            if (this.state.selectedValues.includes(value.id)) {
                valueCard.classList.add('selected');
            }
            
            const valueName = document.createElement('div');
            valueName.classList.add('post16-value-name');
            valueName.textContent = value.name;
            valueCard.appendChild(valueName);
            
            const valueDesc = document.createElement('div');
            valueDesc.classList.add('post16-value-description');
            valueDesc.textContent = value.description;
            valueCard.appendChild(valueDesc);
            
            valueCard.addEventListener('click', () => {
                this.toggleValue(value.id);
            });
            
            valueCard.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.toggleValue(value.id);
                }
            });
            
            valuesGrid.appendChild(valueCard);
        });
        
        viewContainer.appendChild(valuesGrid);
        
        const instruction = document.createElement('div');
        instruction.classList.add('post16-instruction');
        instruction.textContent = 'Select at least one value to continue. You can select multiple values.';
        viewContainer.appendChild(instruction);
        
        container.appendChild(viewContainer);
    }

    /**
     * Render the results view
     */
    renderResultsView(container) {
        const viewContainer = document.createElement('div');
        viewContainer.classList.add('post16-view-container', 'post16-results-view');
        
        // Calculate career matches if not already done
        if (this.state.careerResults.length === 0) {
            this.calculateCareerMatches();
        }
        
        const prompt = document.createElement('div');
        prompt.classList.add('post16-prompt');
        prompt.textContent = 'Based on your selections, here are some careers to explore:';
        viewContainer.appendChild(prompt);
        
        // Show selected interests, strengths, and values
        const selectionsContainer = document.createElement('div');
        selectionsContainer.classList.add('post16-selections-container');
        
        const interestsSection = document.createElement('div');
        interestsSection.classList.add('post16-selections-section');
        
        const interestsLabel = document.createElement('div');
        interestsLabel.classList.add('post16-selections-label');
        interestsLabel.textContent = 'Your Interests:';
        interestsSection.appendChild(interestsLabel);
        
        const interestsList = document.createElement('div');
        interestsList.classList.add('post16-selections-list');
        
        this.state.selectedInterests.forEach(interestId => {
            const interest = this.config.interestAreas.find(i => i.id === interestId);
            if (interest) {
                const interestItem = document.createElement('div');
                interestItem.classList.add('post16-selection-item');
                interestItem.style.backgroundColor = interest.color;
                interestItem.innerHTML = `${interest.icon} ${interest.name}`;
                interestsList.appendChild(interestItem);
            }
        });
        
        interestsSection.appendChild(interestsList);
        selectionsContainer.appendChild(interestsSection);
        
        const strengthsSection = document.createElement('div');
        strengthsSection.classList.add('post16-selections-section');
        
        const strengthsLabel = document.createElement('div');
        strengthsLabel.classList.add('post16-selections-label');
        strengthsLabel.textContent = 'Your Strengths:';
        strengthsSection.appendChild(strengthsLabel);
        
        const strengthsList = document.createElement('div');
        strengthsList.classList.add('post16-selections-list');
        
        this.state.selectedStrengths.forEach(strengthId => {
            const strength = this.config.strengthAreas.find(s => s.id === strengthId);
            if (strength) {
                const strengthItem = document.createElement('div');
                strengthItem.classList.add('post16-selection-item');
                strengthItem.innerHTML = `${strength.icon} ${strength.name}`;
                strengthsList.appendChild(strengthItem);
            }
        });
        
        strengthsSection.appendChild(strengthsList);
        selectionsContainer.appendChild(strengthsSection);
        
        const valuesSection = document.createElement('div');
        valuesSection.classList.add('post16-selections-section');
        
        const valuesLabel = document.createElement('div');
        valuesLabel.classList.add('post16-selections-label');
        valuesLabel.textContent = 'Your Values:';
        valuesSection.appendChild(valuesLabel);
        
        const valuesList = document.createElement('div');
        valuesList.classList.add('post16-selections-list');
        
        this.state.selectedValues.forEach(valueId => {
            const value = this.config.valueAreas.find(v => v.id === valueId);
            if (value) {
                const valueItem = document.createElement('div');
                valueItem.classList.add('post16-selection-item');
                valueItem.textContent = value.name;
                valuesList.appendChild(valueItem);
            }
        });
        
        valuesSection.appendChild(valuesList);
        selectionsContainer.appendChild(valuesSection);
        
        viewContainer.appendChild(selectionsContainer);
        
        // Career results
        const resultsContainer = document.createElement('div');
        resultsContainer.classList.add('post16-results-container');
        
        if (this.state.careerResults.length > 0) {
            this.state.careerResults.forEach(result => {
                const careerCard = document.createElement('div');
                careerCard.classList.add('post16-career-card');
                careerCard.setAttribute('data-career-id', result.career.id);
                careerCard.setAttribute('data-interest-id', result.interestArea.id);
                careerCard.setAttribute('tabindex', '0');
                
                const cardHeader = document.createElement('div');
                cardHeader.classList.add('post16-career-header');
                cardHeader.style.backgroundColor = result.interestArea.color;
                
                const cardIcon = document.createElement('span');
                cardIcon.classList.add('post16-career-icon');
                cardIcon.textContent = result.interestArea.icon;
                cardHeader.appendChild(cardIcon);
                
                const cardTitle = document.createElement('div');
                cardTitle.classList.add('post16-career-title');
                cardTitle.textContent = result.career.title;
                cardHeader.appendChild(cardTitle);
                
                careerCard.appendChild(cardHeader);
                
                const cardBody = document.createElement('div');
                cardBody.classList.add('post16-career-body');
                
                const cardDescription = document.createElement('div');
                cardDescription.classList.add('post16-career-description');
                cardDescription.textContent = result.career.description;
                cardBody.appendChild(cardDescription);
                
                const cardMatch = document.createElement('div');
                cardMatch.classList.add('post16-career-match');
                cardMatch.textContent = `Match: ${result.matchScore}%`;
                cardBody.appendChild(cardMatch);
                
                const cardButton = document.createElement('button');
                cardButton.classList.add('post16-career-button');
                cardButton.textContent = 'Learn More';
                cardButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.viewCareerDetail(result);
                });
                cardBody.appendChild(cardButton);
                
                careerCard.appendChild(cardBody);
                
                careerCard.addEventListener('click', () => {
                    this.viewCareerDetail(result);
                });
                
                careerCard.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.viewCareerDetail(result);
                    }
                });
                
                resultsContainer.appendChild(careerCard);
            });
        } else {
            const noResults = document.createElement('div');
            noResults.classList.add('post16-no-results');
            noResults.textContent = 'No career matches found. Try selecting different interests, strengths, or values.';
            resultsContainer.appendChild(noResults);
        }
        
        viewContainer.appendChild(resultsContainer);
        
        // Add comment area if enabled
        if (this.config.allowComments) {
            const commentArea = document.createElement('div');
            commentArea.classList.add('post16-comment-area');
            
            const commentLabel = document.createElement('label');
            commentLabel.classList.add('post16-comment-label');
            commentLabel.textContent = 'Your thoughts about these career options:';
            commentLabel.setAttribute('for', 'post16-comment-input');
            commentArea.appendChild(commentLabel);
            
            const commentInput = document.createElement('textarea');
            commentInput.id = 'post16-comment-input';
            commentInput.classList.add('post16-comment-input');
            commentInput.value = this.state.comments['results'] || '';
            commentInput.placeholder = 'Type your thoughts here...';
            commentInput.setAttribute('aria-label', 'Add your thoughts about these career options');
            
            commentInput.addEventListener('input', () => {
                this.state.comments['results'] = commentInput.value;
            });
            
            commentArea.appendChild(commentInput);
            
            // Add voice input button for comments
            if (this.config.voiceCommands) {
                const voiceButton = document.createElement('button');
                voiceButton.classList.add('post16-voice-comment-button');
                voiceButton.textContent = 'Speak';
                voiceButton.setAttribute('aria-label', 'Speak your thoughts');
                
                voiceButton.addEventListener('click', () => {
                    this.startVoiceComment('results');
                });
                
                commentArea.appendChild(voiceButton);
            }
            
            viewContainer.appendChild(commentArea);
        }
        
        container.appendChild(viewContainer);
    }

    /**
     * Render the pathways view
     */
    renderPathwaysView(container) {
        const viewContainer = document.createElement('div');
        viewContainer.classList.add('post16-view-container', 'post16-pathways-view');
        
        const prompt = document.createElement('div');
        prompt.classList.add('post16-prompt');
        prompt.textContent = 'Explore different pathways after Year 11:';
        viewContainer.appendChild(prompt);
        
        const pathwaysGrid = document.createElement('div');
        pathwaysGrid.classList.add('post16-pathways-grid');
        
        this.config.pathways.forEach(pathway => {
            const pathwayCard = document.createElement('div');
            pathwayCard.classList.add('post16-pathway-card');
            pathwayCard.setAttribute('data-pathway-id', pathway.id);
            pathwayCard.setAttribute('tabindex', '0');
            
            if (this.state.selectedPathway === pathway.id) {
                pathwayCard.classList.add('selected');
            }
            
            const pathwayIcon = document.createElement('div');
            pathwayIcon.classList.add('post16-pathway-icon');
            pathwayIcon.textContent = pathway.icon;
            pathwayCard.appendChild(pathwayIcon);
            
            const pathwayName = document.createElement('div');
            pathwayName.classList.add('post16-pathway-name');
            pathwayName.textContent = pathway.name;
            pathwayCard.appendChild(pathwayName);
            
            const pathwayDesc = document.createElement('div');
            pathwayDesc.classList.add('post16-pathway-description');
            pathwayDesc.textContent = pathway.description;
            pathwayCard.appendChild(pathwayDesc);
            
            pathwayCard.addEventListener('click', () => {
                this.selectPathway(pathway.id);
            });
            
            pathwayCard.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.selectPathway(pathway.id);
                }
            });
            
            pathwaysGrid.appendChild(pathwayCard);
        });
        
        viewContainer.appendChild(pathwaysGrid);
        
        // Add information about qualifications
        const qualificationsInfo = document.createElement('div');
        qualificationsInfo.classList.add('post16-qualifications-info');
        
        const qualificationsTitle = document.createElement('h3');
        qualificationsTitle.textContent = 'Qualification Levels';
        qualificationsInfo.appendChild(qualificationsTitle);
        
        const qualificationsList = document.createElement('div');
        qualificationsList.classList.add('post16-qualifications-list');
        
        const qualifications = [
            { level: 'Entry Level', examples: 'Functional Skills, Entry Level Certificates' },
            { level: 'Level 1', examples: 'GCSE grades 1-3 (D-G), Level 1 Diploma' },
            { level: 'Level 2', examples: 'GCSE grades 4-9 (A*-C), Level 2 Diploma' },
            { level: 'Level 3', examples: 'A Levels, T Levels, BTEC Nationals' },
            { level: 'Level 4-5', examples: 'Higher National Certificates/Diplomas, Foundation Degrees' },
            { level: 'Level 6', examples: 'Bachelor\'s Degrees' },
            { level: 'Level 7-8', examples: 'Master\'s Degrees, PhDs' }
        ];
        
        qualifications.forEach(qual => {
            const qualItem = document.createElement('div');
            qualItem.classList.add('post16-qualification-item');
            
            const qualLevel = document.createElement('div');
            qualLevel.classList.add('post16-qualification-level');
            qualLevel.textContent = qual.level;
            qualItem.appendChild(qualLevel);
            
            const qualExamples = document.createElement('div');
            qualExamples.classList.add('post16-qualification-examples');
            qualExamples.textContent = qual.examples;
            qualItem.appendChild(qualExamples);
            
            qualificationsList.appendChild(qualItem);
        });
        
        qualificationsInfo.appendChild(qualificationsList);
        viewContainer.appendChild(qualificationsInfo);
        
        // Add comment area if enabled
        if (this.config.allowComments) {
            const commentArea = document.createElement('div');
            commentArea.classList.add('post16-comment-area');
            
            const commentLabel = document.createElement('label');
            commentLabel.classList.add('post16-comment-label');
            commentLabel.textContent = 'Your thoughts about these pathways:';
            commentLabel.setAttribute('for', 'post16-comment-input');
            commentArea.appendChild(commentLabel);
            
            const commentInput = document.createElement('textarea');
            commentInput.id = 'post16-comment-input';
            commentInput.classList.add('post16-comment-input');
            commentInput.value = this.state.comments['pathways'] || '';
            commentInput.placeholder = 'Type your thoughts here...';
            commentInput.setAttribute('aria-label', 'Add your thoughts about these pathways');
            
            commentInput.addEventListener('input', () => {
                this.state.comments['pathways'] = commentInput.value;
            });
            
            commentArea.appendChild(commentInput);
            
            // Add voice input button for comments
            if (this.config.voiceCommands) {
                const voiceButton = document.createElement('button');
                voiceButton.classList.add('post16-voice-comment-button');
                voiceButton.textContent = 'Speak';
                voiceButton.setAttribute('aria-label', 'Speak your thoughts');
                
                voiceButton.addEventListener('click', () => {
                    this.startVoiceComment('pathways');
                });
                
                commentArea.appendChild(voiceButton);
            }
            
            viewContainer.appendChild(commentArea);
        }
        
        container.appendChild(viewContainer);
    }

    /**
     * Render the career detail view
     */
    renderCareerDetailView(container) {
        if (!this.state.selectedCareer) {
            this.navigateToView('results');
            return;
        }
        
        const viewContainer = document.createElement('div');
        viewContainer.classList.add('post16-view-container', 'post16-career-detail-view');
        
        const career = this.state.selectedCareer.career;
        const interestArea = this.state.selectedCareer.interestArea;
        
        // Career header
        const careerHeader = document.createElement('div');
        careerHeader.classList.add('post16-career-detail-header');
        careerHeader.style.backgroundColor = interestArea.color;
        
        const backLink = document.createElement('button');
        backLink.classList.add('post16-career-back-link');
        backLink.innerHTML = '&larr; Back to Results';
        backLink.addEventListener('click', () => {
            this.navigateToView('results');
        });
        careerHeader.appendChild(backLink);
        
        const careerTitle = document.createElement('h2');
        careerTitle.classList.add('post16-career-detail-title');
        careerTitle.textContent = career.title;
        careerHeader.appendChild(careerTitle);
        
        const careerCategory = document.createElement('div');
        careerCategory.classList.add('post16-career-detail-category');
        careerCategory.innerHTML = `${interestArea.icon} ${interestArea.name}`;
        careerHeader.appendChild(careerCategory);
        
        viewContainer.appendChild(careerHeader);
        
        // Career content
        const careerContent = document.createElement('div');
        careerContent.classList.add('post16-career-detail-content');
        
        const descriptionSection = document.createElement('div');
        descriptionSection.classList.add('post16-career-detail-section');
        
        const descriptionTitle = document.createElement('h3');
        descriptionTitle.textContent = 'What does a ' + career.title + ' do?';
        descriptionSection.appendChild(descriptionTitle);
        
        const description = document.createElement('p');
        description.textContent = career.description;
        descriptionSection.appendChild(description);
        
        careerContent.appendChild(descriptionSection);
        
        // Education and qualifications
        const educationSection = document.createElement('div');
        educationSection.classList.add('post16-career-detail-section');
        
        const educationTitle = document.createElement('h3');
        educationTitle.textContent = 'Education and Qualifications';
        educationSection.appendChild(educationTitle);
        
        const educationList = document.createElement('ul');
        career.education.forEach(edu => {
            const eduItem = document.createElement('li');
            eduItem.textContent = edu;
            educationList.appendChild(eduItem);
        });
        educationSection.appendChild(educationList);
        
        careerContent.appendChild(educationSection);
        
        // Skills needed
        const skillsSection = document.createElement('div');
        skillsSection.classList.add('post16-career-detail-section');
        
        const skillsTitle = document.createElement('h3');
        skillsTitle.textContent = 'Skills Needed';
        skillsSection.appendChild(skillsTitle);
        
        const skillsList = document.createElement('ul');
        career.skills.forEach(skill => {
            const skillItem = document.createElement('li');
            skillItem.textContent = skill;
            skillsList.appendChild(skillItem);
        });
        skillsSection.appendChild(skillsList);
        
        careerContent.appendChild(skillsSection);
        
        // Related careers
        const relatedSection = document.createElement('div');
        relatedSection.classList.add('post16-career-detail-section');
        
        const relatedTitle = document.createElement('h3');
        relatedTitle.textContent = 'Related Careers';
        relatedSection.appendChild(relatedTitle);
        
        const relatedCareers = this.getRelatedCareers(career, interestArea);
        
        if (relatedCareers.length > 0) {
            const relatedList = document.createElement('div');
            relatedList.classList.add('post16-related-careers');
            
            relatedCareers.forEach(relatedCareer => {
                const relatedItem = document.createElement('button');
                relatedItem.classList.add('post16-related-career-item');
                relatedItem.textContent = relatedCareer.title;
                
                relatedItem.addEventListener('click', () => {
                    this.viewCareerDetail({
                        career: relatedCareer,
                        interestArea: interestArea,
                        matchScore: 0 // Not calculated for related careers
                    });
                });
                
                relatedList.appendChild(relatedItem);
            });
            
            relatedSection.appendChild(relatedList);
        } else {
            const noRelated = document.createElement('p');
            noRelated.textContent = 'No related careers found.';
            relatedSection.appendChild(noRelated);
        }
        
        careerContent.appendChild(relatedSection);
        
        // Next steps
        const nextStepsSection = document.createElement('div');
        nextStepsSection.classList.add('post16-career-detail-section');
        
        const nextStepsTitle = document.createElement('h3');
        nextStepsTitle.textContent = 'Next Steps';
        nextStepsSection.appendChild(nextStepsTitle);
        
        const nextStepsList = document.createElement('div');
        nextStepsList.classList.add('post16-next-steps');
        
        const nextSteps = [
            { title: 'Research', description: 'Find out more about this career online or at your school careers service.' },
            { title: 'Talk to Someone', description: 'Speak to someone who works in this field to learn about their experiences.' },
            { title: 'Work Experience', description: 'Look for work experience or volunteering opportunities in this area.' },
            { title: 'Develop Skills', description: 'Start developing relevant skills through courses, clubs, or self-study.' }
        ];
        
        nextSteps.forEach(step => {
            const stepItem = document.createElement('div');
            stepItem.classList.add('post16-next-step-item');
            
            const stepTitle = document.createElement('h4');
            stepTitle.textContent = step.title;
            stepItem.appendChild(stepTitle);
            
            const stepDesc = document.createElement('p');
            stepDesc.textContent = step.description;
            stepItem.appendChild(stepDesc);
            
            nextStepsList.appendChild(stepItem);
        });
        
        nextStepsSection.appendChild(nextStepsList);
        careerContent.appendChild(nextStepsSection);
        
        viewContainer.appendChild(careerContent);
        
        // Add comment area if enabled
        if (this.config.allowComments) {
            const commentArea = document.createElement('div');
            commentArea.classList.add('post16-comment-area');
            
            const commentLabel = document.createElement('label');
            commentLabel.classList.add('post16-comment-label');
            commentLabel.textContent = 'Your thoughts about this career:';
            commentLabel.setAttribute('for', 'post16-comment-input');
            commentArea.appendChild(commentLabel);
            
            const commentInput = document.createElement('textarea');
            commentInput.id = 'post16-comment-input';
            commentInput.classList.add('post16-comment-input');
            commentInput.value = this.state.comments[`career_${career.id}`] || '';
            commentInput.placeholder = 'Type your thoughts here...';
            commentInput.setAttribute('aria-label', `Add your thoughts about ${career.title}`);
            
            commentInput.addEventListener('input', () => {
                this.state.comments[`career_${career.id}`] = commentInput.value;
            });
            
            commentArea.appendChild(commentInput);
            
            // Add voice input button for comments
            if (this.config.voiceCommands) {
                const voiceButton = document.createElement('button');
                voiceButton.classList.add('post16-voice-comment-button');
                voiceButton.textContent = 'Speak';
                voiceButton.setAttribute('aria-label', 'Speak your thoughts');
                
                voiceButton.addEventListener('click', () => {
                    this.startVoiceComment(`career_${career.id}`);
                });
                
                commentArea.appendChild(voiceButton);
            }
            
            viewContainer.appendChild(commentArea);
        }
        
        container.appendChild(viewContainer);
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Event delegation for interest cards
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // ESC key to go back
                this.navigateBack();
            }
        });
    }

    /**
     * Set up keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only process shortcuts when the career explorer is focused
            if (!this.container.contains(document.activeElement) && document.activeElement !== document.body) {
                return;
            }
            
            // Ctrl+S: Save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveResults();
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
        voiceButton.classList.add('post16-voice-command-button');
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
    startVoiceComment(commentKey) {
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
                const commentInput = this.container.querySelector('#post16-comment-input');
                if (commentInput) {
                    if (finalTranscript) {
                        this.state.comments[this.currentCommentKey] = (this.state.comments[this.currentCommentKey] || '') + ' ' + finalTranscript;
                        this.state.comments[this.currentCommentKey] = this.state.comments[this.currentCommentKey].trim();
                        commentInput.value = this.state.comments[this.currentCommentKey];
                    }
                    
                    // Show interim results
                    if (interimTranscript) {
                        commentInput.value = (this.state.comments[this.currentCommentKey] || '') + ' ' + interimTranscript;
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
                const voiceButton = this.container.querySelector('.post16-voice-comment-button');
                if (voiceButton) {
                    voiceButton.textContent = 'Speak';
                    voiceButton.disabled = false;
                }
                this.updateStatus('Voice input stopped');
            };
        }
        
        // Store current comment key
        this.currentCommentKey = commentKey;
        
        // Toggle recognition
        const voiceButton = this.container.querySelector('.post16-voice-comment-button');
        
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
        
        // Navigation commands
        if (command.includes('next') || command.includes('continue')) {
            this.navigateNext();
        } else if (command.includes('back') || command.includes('previous')) {
            this.navigateBack();
        } else if (command.includes('save') || command.includes('finish')) {
            this.saveResults();
        }
        
        // View-specific commands
        else if (this.state.currentView === 'interests') {
            // Try to match interest areas
            this.config.interestAreas.forEach(interest => {
                if (command.includes(interest.name.toLowerCase())) {
                    this.toggleInterest(interest.id);
                }
            });
        } else if (this.state.currentView === 'strengths') {
            // Try to match strength areas
            this.config.strengthAreas.forEach(strength => {
                if (command.includes(strength.name.toLowerCase())) {
                    this.toggleStrength(strength.id);
                }
            });
        } else if (this.state.currentView === 'values') {
            // Try to match value areas
            this.config.valueAreas.forEach(value => {
                if (command.includes(value.name.toLowerCase())) {
                    this.toggleValue(value.id);
                }
            });
        } else if (this.state.currentView === 'results') {
            // Try to match career titles
            if (command.includes('comment')) {
                this.startVoiceComment('results');
            } else {
                this.state.careerResults.forEach(result => {
                    if (command.includes(result.career.title.toLowerCase())) {
                        this.viewCareerDetail(result);
                    }
                });
            }
        } else if (this.state.currentView === 'pathways') {
            // Try to match pathway names
            if (command.includes('comment')) {
                this.startVoiceComment('pathways');
            } else {
                this.config.pathways.forEach(pathway => {
                    if (command.includes(pathway.name.toLowerCase())) {
                        this.selectPathway(pathway.id);
                    }
                });
            }
        } else if (this.state.currentView === 'career_detail') {
            if (command.includes('comment')) {
                this.startVoiceComment(`career_${this.state.selectedCareer.career.id}`);
            } else if (command.includes('back to results')) {
                this.navigateToView('results');
            }
        }
    }

    /**
     * Set up accessibility features
     */
    setupAccessibilityFeatures() {
        // Add keyboard navigation instructions
        const instructions = document.createElement('div');
        instructions.classList.add('post16-keyboard-instructions');
        instructions.innerHTML = `
            <details>
                <summary>Keyboard Instructions</summary>
                <ul>
                    <li>Tab: Navigate between elements</li>
                    <li>Space/Enter: Select or activate focused element</li>
                    <li>Escape: Go back to previous screen</li>
                    <li>Ctrl+S: Save results</li>
                </ul>
            </details>
        `;
        
        this.container.appendChild(instructions);
    }

    /**
     * Toggle interest selection
     */
    toggleInterest(interestId) {
        const index = this.state.selectedInterests.indexOf(interestId);
        
        if (index === -1) {
            // Add interest if not already selected
            this.state.selectedInterests.push(interestId);
            this.updateStatus(`Selected interest: ${this.getInterestById(interestId)?.name}`);
        } else {
            // Remove interest if already selected
            this.state.selectedInterests.splice(index, 1);
            this.updateStatus(`Removed interest: ${this.getInterestById(interestId)?.name}`);
        }
        
        // Update UI
        const interestCard = this.container.querySelector(`.post16-interest-card[data-interest-id="${interestId}"]`);
        if (interestCard) {
            interestCard.classList.toggle('selected');
            interestCard.setAttribute('aria-checked', index === -1 ? 'true' : 'false');
        }
    }

    /**
     * Toggle strength selection
     */
    toggleStrength(strengthId) {
        const index = this.state.selectedStrengths.indexOf(strengthId);
        
        if (index === -1) {
            // Add strength if not already selected
            this.state.selectedStrengths.push(strengthId);
            this.updateStatus(`Selected strength: ${this.getStrengthById(strengthId)?.name}`);
        } else {
            // Remove strength if already selected
            this.state.selectedStrengths.splice(index, 1);
            this.updateStatus(`Removed strength: ${this.getStrengthById(strengthId)?.name}`);
        }
        
        // Update UI
        const strengthCard = this.container.querySelector(`.post16-strength-card[data-strength-id="${strengthId}"]`);
        if (strengthCard) {
            strengthCard.classList.toggle('selected');
            strengthCard.setAttribute('aria-checked', index === -1 ? 'true' : 'false');
        }
    }

    /**
     * Toggle value selection
     */
    toggleValue(valueId) {
        const index = this.state.selectedValues.indexOf(valueId);
        
        if (index === -1) {
            // Add value if not already selected
            this.state.selectedValues.push(valueId);
            this.updateStatus(`Selected value: ${this.getValueById(valueId)?.name}`);
        } else {
            // Remove value if already selected
            this.state.selectedValues.splice(index, 1);
            this.updateStatus(`Removed value: ${this.getValueById(valueId)?.name}`);
        }
        
        // Update UI
        const valueCard = this.container.querySelector(`.post16-value-card[data-value-id="${valueId}"]`);
        if (valueCard) {
            valueCard.classList.toggle('selected');
            valueCard.setAttribute('aria-checked', index === -1 ? 'true' : 'false');
        }
    }

    /**
     * Select a pathway
     */
    selectPathway(pathwayId) {
        this.state.selectedPathway = pathwayId;
        
        // Update UI
        const pathwayCards = this.container.querySelectorAll('.post16-pathway-card');
        pathwayCards.forEach(card => {
            const isSelected = card.getAttribute('data-pathway-id') === pathwayId;
            card.classList.toggle('selected', isSelected);
        });
        
        this.updateStatus(`Selected pathway: ${this.getPathwayById(pathwayId)?.name}`);
    }

    /**
     * Navigate to next view
     */
    navigateNext() {
        switch (this.state.currentView) {
            case 'interests':
                if (this.state.selectedInterests.length > 0) {
                    this.navigateToView('strengths');
                } else {
                    this.updateStatus('Please select at least one interest area to continue');
                }
                break;
            case 'strengths':
                if (this.state.selectedStrengths.length > 0) {
                    this.navigateToView('values');
                } else {
                    this.updateStatus('Please select at least one strength to continue');
                }
                break;
            case 'values':
                if (this.state.selectedValues.length > 0) {
                    this.navigateToView('results');
                } else {
                    this.updateStatus('Please select at least one value to continue');
                }
                break;
            case 'results':
                if (this.config.showPathways) {
                    this.navigateToView('pathways');
                } else {
                    this.saveResults();
                }
                break;
            case 'pathways':
                this.saveResults();
                break;
            case 'career_detail':
                this.navigateToView('results');
                break;
        }
    }

    /**
     * Navigate back
     */
    navigateBack() {
        switch (this.state.currentView) {
            case 'strengths':
                this.navigateToView('interests');
                break;
            case 'values':
                this.navigateToView('strengths');
                break;
            case 'results':
                this.navigateToView('values');
                break;
            case 'pathways':
                this.navigateToView('results');
                break;
            case 'career_detail':
                this.navigateToView('results');
                break;
        }
    }

    /**
     * Navigate to a specific view
     */
    navigateToView(view) {
        this.state.currentView = view;
        this.createUI();
        this.updateStatus(`Navigated to ${view} view`);
    }

    /**
     * View career detail
     */
    viewCareerDetail(careerResult) {
        this.state.selectedCareer = careerResult;
        this.navigateToView('career_detail');
    }

    /**
     * Calculate career matches based on selected interests, strengths, and values
     */
    calculateCareerMatches() {
        this.state.careerResults = [];
        
        // Only process if interests are selected
        if (this.state.selectedInterests.length === 0) {
            return;
        }
        
        // Process each selected interest area
        this.state.selectedInterests.forEach(interestId => {
            const interestArea = this.getInterestById(interestId);
            if (!interestArea) return;
            
            // Process each career in this interest area
            interestArea.careers.forEach(career => {
                // Calculate match score (simple algorithm)
                let matchScore = 50; // Base score for being in a selected interest area
                
                // Add points for matching skills to strengths (simplified mapping)
                const strengthSkillMap = {
                    'verbal': ['Communication', 'Writing', 'Speaking', 'Teaching'],
                    'logical': ['Problem Solving', 'Analysis', 'Mathematics', 'Research'],
                    'visual': ['Design', 'Drawing', 'Visual Eye', 'Spatial Awareness'],
                    'physical': ['Physical Fitness', 'Physical Stamina', 'Manual Dexterity', 'Sports'],
                    'musical': ['Musical Ability', 'Performance', 'Singing', 'Rhythm'],
                    'interpersonal': ['Communication', 'Teamwork', 'Leadership', 'Empathy'],
                    'intrapersonal': ['Self-motivation', 'Reflection', 'Planning', 'Organization'],
                    'naturalistic': ['Nature Knowledge', 'Environmental Knowledge', 'Animal Knowledge', 'Plant Knowledge']
                };
                
                // Check each selected strength
                this.state.selectedStrengths.forEach(strengthId => {
                    const matchingSkills = strengthSkillMap[strengthId] || [];
                    
                    // Check if any career skills match this strength's skills
                    career.skills.forEach(skill => {
                        if (matchingSkills.some(matchSkill => 
                            skill.toLowerCase().includes(matchSkill.toLowerCase()))) {
                            matchScore += 10;
                        }
                    });
                });
                
                // Add points for matching values (simplified mapping)
                const valueCareerMap = {
                    'helping': ['Teacher', 'Nurse', 'Social Worker', 'Counsellor', 'Care Worker', 'Paramedic'],
                    'creativity': ['Graphic Designer', 'Musician', 'Photographer', 'Actor', 'Fashion Designer', 'Writer', 'Chef'],
                    'independence': ['Entrepreneur', 'Photographer', 'Writer', 'Gardener', 'Consultant'],
                    'teamwork': ['Nurse', 'Teacher', 'Social Worker', 'Engineer', 'Construction Worker'],
                    'challenge': ['Scientist', 'Engineer', 'Paramedic', 'Firefighter', 'Police Officer'],
                    'security': ['Accountant', 'Civil Servant', 'Teacher', 'Nurse', 'IT Support Technician'],
                    'variety': ['Event Planner', 'Journalist', 'Paramedic', 'Outdoor Activity Instructor'],
                    'leadership': ['Business Manager', 'Teacher', 'Retail Manager', 'Police Officer', 'Sports Coach']
                };
                
                // Check each selected value
                this.state.selectedValues.forEach(valueId => {
                    const matchingCareers = valueCareerMap[valueId] || [];
                    
                    // Check if this career matches this value
                    if (matchingCareers.some(matchCareer => 
                        career.title.toLowerCase().includes(matchCareer.toLowerCase()))) {
                        matchScore += 15;
                    }
                });
                
                // Cap score at 100
                matchScore = Math.min(matchScore, 100);
                
                // Add to results if score is above threshold
                if (matchScore >= 50) {
                    this.state.careerResults.push({
                        career: career,
                        interestArea: interestArea,
                        matchScore: matchScore
                    });
                }
            });
        });
        
        // Sort results by match score (highest first)
        this.state.careerResults.sort((a, b) => b.matchScore - a.matchScore);
        
        // Limit to top 12 results
        this.state.careerResults = this.state.careerResults.slice(0, 12);
    }

    /**
     * Get related careers for a specific career
     */
    getRelatedCareers(career, interestArea) {
        // Get other careers from the same interest area
        const sameCategoryCareers = interestArea.careers.filter(c => c.id !== career.id);
        
        // Get careers with similar skills from other interest areas
        let otherCategoryCareers = [];
        
        this.config.interestAreas.forEach(otherInterest => {
            if (otherInterest.id !== interestArea.id) {
                otherInterest.careers.forEach(otherCareer => {
                    // Check for skill overlap
                    const skillOverlap = career.skills.filter(skill => 
                        otherCareer.skills.some(otherSkill => 
                            otherSkill.toLowerCase().includes(skill.toLowerCase()) ||
                            skill.toLowerCase().includes(otherSkill.toLowerCase())
                        )
                    );
                    
                    if (skillOverlap.length >= 2) { // At least 2 similar skills
                        otherCategoryCareers.push(otherCareer);
                    }
                });
            }
        });
        
        // Combine and limit results
        const relatedCareers = [...sameCategoryCareers, ...otherCategoryCareers];
        return relatedCareers.slice(0, 5); // Limit to 5 related careers
    }

    /**
     * Save the results
     */
    saveResults() {
        const result = {
            selectedInterests: this.state.selectedInterests.map(id => this.getInterestById(id)),
            selectedStrengths: this.state.selectedStrengths.map(id => this.getStrengthById(id)),
            selectedValues: this.state.selectedValues.map(id => this.getValueById(id)),
            careerResults: this.state.careerResults,
            selectedPathway: this.getPathwayById(this.state.selectedPathway),
            comments: this.state.comments
        };
        
        if (this.config.onSave) {
            this.config.onSave(result);
        }
        
        this.updateStatus('Results saved');
        return result;
    }

    /**
     * Get interest area by ID
     */
    getInterestById(id) {
        return this.config.interestAreas.find(interest => interest.id === id);
    }

    /**
     * Get strength by ID
     */
    getStrengthById(id) {
        return this.config.strengthAreas.find(strength => strength.id === id);
    }

    /**
     * Get value by ID
     */
    getValueById(id) {
        return this.config.valueAreas.find(value => value.id === id);
    }

    /**
     * Get pathway by ID
     */
    getPathwayById(id) {
        return this.config.pathways.find(pathway => pathway.id === id);
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
    module.exports = { Post16CareerExplorer };
} else {
    window.Post16CareerExplorer = Post16CareerExplorer;
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .post16-career-explorer {
        font-family: 'Open Sans', sans-serif;
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    .post16-header {
        text-align: center;
        margin-bottom: 20px;
    }

    .post16-title {
        font-size: 24px;
        color: #34495e;
        margin: 0 0 5px 0;
    }

    .post16-subtitle {
        font-size: 16px;
        color: #7f8c8d;
    }

    .post16-progress-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    .post16-progress-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 1;
    }

    .post16-step-number {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #ecf0f1;
        color: #7f8c8d;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .post16-progress-step.active .post16-step-number {
        background-color: #3498db;
        color: white;
    }

    .post16-progress-step.completed .post16-step-number {
        background-color: #2ecc71;
        color: white;
    }

    .post16-step-label {
        font-size: 12px;
        color: #7f8c8d;
    }

    .post16-progress-step.active .post16-step-label {
        color: #3498db;
        font-weight: bold;
    }

    .post16-progress-step.completed .post16-step-label {
        color: #2ecc71;
    }

    .post16-step-connector {
        flex-grow: 1;
        height: 2px;
        background-color: #ecf0f1;
        margin: 0 5px;
        position: relative;
        top: -15px;
        z-index: 0;
    }

    .post16-main-content {
        margin-bottom: 30px;
    }

    .post16-view-container {
        animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .post16-prompt {
        font-size: 18px;
        margin-bottom: 20px;
        color: #34495e;
    }

    .post16-interests-grid,
    .post16-strengths-grid,
    .post16-values-grid,
    .post16-pathways-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin-bottom: 20px;
    }

    .post16-interest-card,
    .post16-strength-card,
    .post16-value-card,
    .post16-pathway-card {
        background-color: white;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 15px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .post16-interest-card:hover,
    .post16-strength-card:hover,
    .post16-value-card:hover,
    .post16-pathway-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .post16-interest-card.selected,
    .post16-strength-card.selected,
    .post16-value-card.selected,
    .post16-pathway-card.selected {
        border-color: #3498db;
        background-color: #ebf5fb;
    }

    .post16-interest-card:focus,
    .post16-strength-card:focus,
    .post16-value-card:focus,
    .post16-pathway-card:focus {
        outline: 2px solid #9b59b6;
    }

    .post16-interest-icon {
        font-size: 24px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        color: white;
    }

    .post16-interest-name,
    .post16-strength-name,
    .post16-value-name,
    .post16-pathway-name {
        font-size: 16px;
        font-weight: bold;
        color: #34495e;
        margin-bottom: 5px;
    }

    .post16-interest-description,
    .post16-strength-description,
    .post16-value-description,
    .post16-pathway-description {
        font-size: 14px;
        color: #7f8c8d;
    }

    .post16-strength-icon,
    .post16-pathway-icon {
        font-size: 24px;
        margin-bottom: 10px;
    }

    .post16-instruction {
        font-size: 14px;
        color: #7f8c8d;
        font-style: italic;
        margin-top: 10px;
    }

    .post16-selections-container {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 20px;
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 8px;
    }

    .post16-selections-section {
        flex: 1;
        min-width: 200px;
    }

    .post16-selections-label {
        font-weight: bold;
        margin-bottom: 10px;
        color: #34495e;
    }

    .post16-selections-list {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }

    .post16-selection-item {
        padding: 5px 10px;
        border-radius: 20px;
        background-color: #e0e0e0;
        font-size: 14px;
        color: #34495e;
    }

    .post16-results-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin-bottom: 20px;
    }

    .post16-career-card {
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .post16-career-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .post16-career-card:focus {
        outline: 2px solid #9b59b6;
    }

    .post16-career-header {
        padding: 10px;
        color: white;
        display: flex;
        align-items: center;
    }

    .post16-career-icon {
        margin-right: 10px;
    }

    .post16-career-title {
        font-weight: bold;
        font-size: 16px;
    }

    .post16-career-body {
        padding: 15px;
    }

    .post16-career-description {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 10px;
        height: 60px;
        overflow: hidden;
    }

    .post16-career-match {
        font-size: 14px;
        font-weight: bold;
        color: #27ae60;
        margin-bottom: 10px;
    }

    .post16-career-button {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }

    .post16-career-button:hover {
        background-color: #2980b9;
    }

    .post16-no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 20px;
        color: #7f8c8d;
        font-style: italic;
    }

    .post16-career-detail-header {
        padding: 20px;
        color: white;
        position: relative;
        margin-bottom: 20px;
    }

    .post16-career-back-link {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-bottom: 10px;
        font-size: 14px;
        display: block;
    }

    .post16-career-detail-title {
        font-size: 24px;
        margin: 0 0 10px 0;
    }

    .post16-career-detail-category {
        font-size: 16px;
    }

    .post16-career-detail-content {
        padding: 0 20px;
    }

    .post16-career-detail-section {
        margin-bottom: 20px;
    }

    .post16-career-detail-section h3 {
        color: #34495e;
        margin-bottom: 10px;
        font-size: 18px;
    }

    .post16-career-detail-section p {
        color: #7f8c8d;
        line-height: 1.5;
    }

    .post16-career-detail-section ul {
        padding-left: 20px;
        color: #7f8c8d;
    }

    .post16-career-detail-section li {
        margin-bottom: 5px;
    }

    .post16-related-careers {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .post16-related-career-item {
        background-color: #f5f5f5;
        border: none;
        padding: 8px 12px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        color: #34495e;
        transition: background-color 0.2s;
    }

    .post16-related-career-item:hover {
        background-color: #e0e0e0;
    }

    .post16-next-steps {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }

    .post16-next-step-item {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 8px;
    }

    .post16-next-step-item h4 {
        color: #34495e;
        margin: 0 0 10px 0;
    }

    .post16-next-step-item p {
        margin: 0;
        font-size: 14px;
    }

    .post16-qualifications-info {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .post16-qualifications-info h3 {
        color: #34495e;
        margin-top: 0;
        margin-bottom: 10px;
    }

    .post16-qualifications-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .post16-qualification-item {
        display: flex;
        align-items: flex-start;
    }

    .post16-qualification-level {
        font-weight: bold;
        width: 100px;
        color: #34495e;
    }

    .post16-qualification-examples {
        flex: 1;
        color: #7f8c8d;
    }

    .post16-comment-area {
        margin-top: 20px;
        padding: 15px;
        background-color: #f5f5f5;
        border-radius: 8px;
    }

    .post16-comment-label {
        font-weight: bold;
        margin-bottom: 10px;
        color: #34495e;
        display: block;
    }

    .post16-comment-input {
        width: 100%;
        min-height: 100px;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-family: 'Open Sans', sans-serif;
        font-size: 14px;
        resize: vertical;
    }

    .post16-comment-input:focus {
        outline: 2px solid #3498db;
        border-color: #3498db;
    }

    .post16-voice-comment-button {
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

    .post16-voice-comment-button:hover {
        background-color: #8e44ad;
    }

    .post16-voice-comment-button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    .post16-navigation-area {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .post16-nav-button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s;
    }

    .post16-back-button {
        background-color: #7f8c8d;
        color: white;
    }

    .post16-back-button:hover {
        background-color: #6c7a7a;
    }

    .post16-next-button {
        background-color: #3498db;
        color: white;
    }

    .post16-next-button:hover {
        background-color: #2980b9;
    }

    .post16-nav-button:focus {
        outline: 2px solid #9b59b6;
    }

    .post16-status {
        position: absolute;
        left: -9999px;
        height: 1px;
        width: 1px;
        overflow: hidden;
    }

    .post16-voice-command-button {
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

    .post16-voice-command-button:hover {
        background-color: #8e44ad;
    }

    .post16-voice-command-button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    .post16-keyboard-instructions {
        margin-top: 15px;
        font-size: 14px;
        color: #7f8c8d;
    }

    .post16-keyboard-instructions summary {
        cursor: pointer;
        color: #3498db;
    }

    .post16-keyboard-instructions ul {
        margin-top: 10px;
        padding-left: 20px;
    }

    /* High contrast mode */
    .high-contrast .post16-career-explorer {
        background-color: black;
        color: white;
    }

    .high-contrast .post16-title,
    .high-contrast .post16-prompt,
    .high-contrast .post16-selections-label,
    .high-contrast .post16-comment-label {
        color: white;
    }

    .high-contrast .post16-interest-card,
    .high-contrast .post16-strength-card,
    .high-contrast .post16-value-card,
    .high-contrast .post16-pathway-card,
    .high-contrast .post16-career-card {
        background-color: black;
        border-color: white;
    }

    .high-contrast .post16-interest-name,
    .high-contrast .post16-strength-name,
    .high-contrast .post16-value-name,
    .high-contrast .post16-pathway-name,
    .high-contrast .post16-career-description {
        color: white;
    }

    .high-contrast .post16-interest-card.selected,
    .high-contrast .post16-strength-card.selected,
    .high-contrast .post16-value-card.selected,
    .high-contrast .post16-pathway-card.selected {
        background-color: #3498db;
        border-color: yellow;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
        .post16-career-explorer {
            padding: 10px;
        }

        .post16-progress-container {
            overflow-x: auto;
            padding-bottom: 10px;
        }

        .post16-step-label {
            font-size: 10px;
        }

        .post16-interests-grid,
        .post16-strengths-grid,
        .post16-values-grid,
        .post16-pathways-grid {
            grid-template-columns: 1fr;
        }

        .post16-results-container {
            grid-template-columns: repeat(2, 1fr);
        }

        .post16-next-steps {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 480px) {
        .post16-results-container {
            grid-template-columns: 1fr;
        }

        .post16-selections-container {
            flex-direction: column;
        }
    }
`;

document.head.appendChild(style);
