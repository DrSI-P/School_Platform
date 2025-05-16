/**
 * EdPsych Connect - Pupil Voice Tool
 * Visual Design and Gamification Module
 * 
 * This module enhances the visual appeal and engagement of the Pupil Voice Tool
 * through animations, gamification elements, and child-friendly design.
 * 
 * Features:
 * - Animated interactions and transitions
 * - Achievement badges and rewards
 * - Progress visualization
 * - Customizable avatars
 * - Theme selection
 * - Visual feedback for actions
 * - Responsive design for all devices
 */

class VisualEnhancementManager {
    constructor(options = {}) {
        // Configuration options with defaults
        this.options = {
            targetSelector: options.targetSelector || 'body',
            theme: options.theme || 'default',
            enableAnimations: options.enableAnimations !== undefined ? options.enableAnimations : true,
            enableGamification: options.enableGamification !== undefined ? options.enableGamification : true,
            enableAvatars: options.enableAvatars !== undefined ? options.enableAvatars : true,
            animationSpeed: options.animationSpeed || 'normal', // slow, normal, fast
            badgesEnabled: options.badgesEnabled !== undefined ? options.badgesEnabled : true,
            progressTrackingEnabled: options.progressTrackingEnabled !== undefined ? options.progressTrackingEnabled : true,
            confettiOnAchievement: options.confettiOnAchievement !== undefined ? options.confettiOnAchievement : true,
            avatarOptions: options.avatarOptions || [
                'avatar-1.png', 'avatar-2.png', 'avatar-3.png', 
                'avatar-4.png', 'avatar-5.png', 'avatar-6.png'
            ],
            badgeDefinitions: options.badgeDefinitions || {
                'voice-contributor': {
                    name: 'Voice Contributor',
                    description: 'Shared your thoughts using your voice',
                    icon: 'voice-contributor-badge.png',
                    criteria: 'Use voice input to share your thoughts'
                },
                'feedback-provider': {
                    name: 'Feedback Provider',
                    description: 'Gave helpful feedback on a topic',
                    icon: 'feedback-provider-badge.png',
                    criteria: 'Provide feedback on a topic'
                },
                'idea-generator': {
                    name: 'Idea Generator',
                    description: 'Shared creative ideas and suggestions',
                    icon: 'idea-generator-badge.png',
                    criteria: 'Share creative ideas or suggestions'
                },
                'regular-contributor': {
                    name: 'Regular Contributor',
                    description: 'Regularly shared your voice on multiple topics',
                    icon: 'regular-contributor-badge.png',
                    criteria: 'Contribute to 5 or more topics'
                },
                'reflection-star': {
                    name: 'Reflection Star',
                    description: 'Thoughtfully reflected on your learning journey',
                    icon: 'reflection-star-badge.png',
                    criteria: 'Complete a reflection activity'
                }
            },
            themeDefinitions: options.themeDefinitions || {
                'default': {
                    primaryColor: '#4a6da7',
                    secondaryColor: '#8ecae6',
                    accentColor: '#ffb703',
                    backgroundColor: '#f8f9fa',
                    textColor: '#333333',
                    fontFamily: '"Nunito", "Segoe UI", Roboto, sans-serif'
                },
                'ocean': {
                    primaryColor: '#023e8a',
                    secondaryColor: '#0077b6',
                    accentColor: '#00b4d8',
                    backgroundColor: '#e6f2f5',
                    textColor: '#03045e',
                    fontFamily: '"Quicksand", "Segoe UI", Roboto, sans-serif'
                },
                'forest': {
                    primaryColor: '#2d6a4f',
                    secondaryColor: '#40916c',
                    accentColor: '#74c69d',
                    backgroundColor: '#f0f7f4',
                    textColor: '#081c15',
                    fontFamily: '"Montserrat", "Segoe UI", Roboto, sans-serif'
                },
                'sunset': {
                    primaryColor: '#9d4edd',
                    secondaryColor: '#c77dff',
                    accentColor: '#ff9e00',
                    backgroundColor: '#f8edeb',
                    textColor: '#240046',
                    fontFamily: '"Poppins", "Segoe UI", Roboto, sans-serif'
                },
                'space': {
                    primaryColor: '#03071e',
                    secondaryColor: '#370617',
                    accentColor: '#6a040f',
                    backgroundColor: '#212529',
                    textColor: '#e9ecef',
                    fontFamily: '"Space Mono", monospace'
                }
            },
            persistSettings: options.persistSettings !== undefined ? options.persistSettings : true
        };

        // State variables
        this.target = document.querySelector(this.options.targetSelector);
        this.currentTheme = this.options.theme;
        this.userBadges = [];
        this.userAvatar = null;
        this.progressData = {};
        this.animationsEnabled = this.options.enableAnimations;
        this.gamificationEnabled = this.options.enableGamification;
        this.avatarsEnabled = this.options.enableAvatars;
        
        // Initialize
        this.init();
    }

    /**
     * Initialize the visual enhancement manager
     */
    init() {
        // Add CSS styles
        this.addVisualStyles();
        
        // Load saved settings if enabled
        if (this.options.persistSettings) {
            this.loadSettings();
        }
        
        // Apply current theme
        this.applyTheme(this.currentTheme);
        
        // Create theme selector
        if (Object.keys(this.options.themeDefinitions).length > 1) {
            this.createThemeSelector();
        }
        
        // Initialize avatar selection if enabled
        if (this.options.enableAvatars) {
            this.initializeAvatarSelection();
        }
        
        // Initialize badges display if enabled
        if (this.options.enableGamification && this.options.badgesEnabled) {
            this.initializeBadgesDisplay();
        }
        
        // Initialize progress tracking if enabled
        if (this.options.enableGamification && this.options.progressTrackingEnabled) {
            this.initializeProgressTracking();
        }
        
        // Add animation classes to elements
        if (this.options.enableAnimations) {
            this.setupAnimations();
        }
    }

    /**
     * Add CSS styles for visual enhancements
     */
    addVisualStyles() {
        // Add a style element if it doesn't exist
        let styleElement = document.getElementById('visual-enhancement-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'visual-enhancement-styles';
            document.head.appendChild(styleElement);
            
            // Generate CSS variables for themes
            let themeVariables = '';
            for (const [themeName, themeProps] of Object.entries(this.options.themeDefinitions)) {
                themeVariables += `
                    .theme-${themeName} {
                        --primary-color: ${themeProps.primaryColor};
                        --secondary-color: ${themeProps.secondaryColor};
                        --accent-color: ${themeProps.accentColor};
                        --background-color: ${themeProps.backgroundColor};
                        --text-color: ${themeProps.textColor};
                        --font-family: ${themeProps.fontFamily};
                    }
                `;
            }
            
            // Add animation speed variables
            const speedMultipliers = {
                'slow': '1.5',
                'normal': '1',
                'fast': '0.5'
            };
            
            const speedVar = speedMultipliers[this.options.animationSpeed] || '1';
            
            // Add styles for visual enhancements
            styleElement.textContent = `
                /* Theme variables */
                ${themeVariables}
                
                /* Base theme application */
                [class*="theme-"] {
                    background-color: var(--background-color);
                    color: var(--text-color);
                    font-family: var(--font-family);
                    transition: background-color 0.3s, color 0.3s;
                }
                
                [class*="theme-"] button,
                [class*="theme-"] .btn {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 16px;
                    cursor: pointer;
                    transition: background-color 0.2s, transform 0.2s;
                }
                
                [class*="theme-"] button:hover,
                [class*="theme-"] .btn:hover {
                    background-color: var(--secondary-color);
                    transform: translateY(-2px);
                }
                
                [class*="theme-"] input,
                [class*="theme-"] textarea,
                [class*="theme-"] select {
                    border: 2px solid var(--secondary-color);
                    border-radius: 8px;
                    padding: 8px 12px;
                    background-color: white;
                    color: var(--text-color);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                
                [class*="theme-"] input:focus,
                [class*="theme-"] textarea:focus,
                [class*="theme-"] select:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.2);
                    outline: none;
                }
                
                /* Animation speed variable */
                :root {
                    --animation-speed-multiplier: ${speedVar};
                }
                
                /* Animations */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideInUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideInLeft {
                    from {
                        transform: translateX(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                /* Animation classes */
                .animate-fade-in {
                    animation: fadeIn calc(0.5s * var(--animation-speed-multiplier)) ease-out;
                }
                
                .animate-slide-up {
                    animation: slideInUp calc(0.5s * var(--animation-speed-multiplier)) ease-out;
                }
                
                .animate-slide-left {
                    animation: slideInLeft calc(0.5s * var(--animation-speed-multiplier)) ease-out;
                }
                
                .animate-pulse {
                    animation: pulse calc(2s * var(--animation-speed-multiplier)) infinite;
                }
                
                .animate-bounce {
                    animation: bounce calc(2s * var(--animation-speed-multiplier)) infinite;
                }
                
                .animate-spin {
                    animation: spin calc(2s * var(--animation-speed-multiplier)) linear infinite;
                }
                
                /* Disable animations */
                .animations-disabled * {
                    animation: none !important;
                    transition: none !important;
                }
                
                /* Theme selector */
                .theme-selector {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin: 15px 0;
                }
                
                .theme-option {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 3px solid transparent;
                    transition: transform 0.2s, border-color 0.2s;
                }
                
                .theme-option:hover {
                    transform: scale(1.1);
                }
                
                .theme-option.active {
                    border-color: #333;
                }
                
                /* Avatar selection */
                .avatar-selector {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin: 15px 0;
                }
                
                .avatar-option {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 3px solid transparent;
                    transition: transform 0.2s, border-color 0.2s;
                    overflow: hidden;
                }
                
                .avatar-option img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .avatar-option:hover {
                    transform: scale(1.1);
                }
                
                .avatar-option.active {
                    border-color: var(--primary-color);
                }
                
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 2px solid var(--primary-color);
                }
                
                .user-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                /* Badges display */
                .badges-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin: 15px 0;
                }
                
                .badge-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    width: 100px;
                    text-align: center;
                }
                
                .badge-icon {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background-color: var(--secondary-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 8px;
                    position: relative;
                    overflow: hidden;
                }
                
                .badge-icon img {
                    width: 80%;
                    height: 80%;
                    object-fit: contain;
                }
                
                .badge-name {
                    font-weight: bold;
                    font-size: 14px;
                    margin-bottom: 4px;
                }
                
                .badge-description {
                    font-size: 12px;
                    color: #666;
                }
                
                .badge-locked {
                    filter: grayscale(100%);
                    opacity: 0.5;
                }
                
                .badge-locked::after {
                    content: '🔒';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 24px;
                }
                
                /* Progress tracking */
                .progress-container {
                    margin: 20px 0;
                }
                
                .progress-bar {
                    height: 15px;
                    background-color: #e0e0e0;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-top: 8px;
                }
                
                .progress-fill {
                    height: 100%;
                    background-color: var(--accent-color);
                    border-radius: 10px;
                    transition: width 0.5s ease-out;
                }
                
                /* Confetti animation */
                .confetti-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 9999;
                }
                
                .confetti {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background-color: var(--accent-color);
                    opacity: 0.8;
                }
                
                /* Responsive design */
                @media (max-width: 768px) {
                    .theme-selector,
                    .avatar-selector,
                    .badges-container {
                        justify-content: center;
                    }
                    
                    .badge-item {
                        width: 80px;
                    }
                    
                    .badge-icon {
                        width: 60px;
                        height: 60px;
                    }
                }
            `;
            
            // Generate theme-specific color RGB variables for transparency
            for (const [themeName, themeProps] of Object.entries(this.options.themeDefinitions)) {
                // Convert hex to RGB for primary color
                const primaryRgb = this.hexToRgb(themeProps.primaryColor);
                if (primaryRgb) {
                    const rgbVar = `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`;
                    styleElement.textContent += `
                        .theme-${themeName} {
                            --primary-color-rgb: ${rgbVar};
                        }
                    `;
                }
            }
        }
    }

    /**
     * Convert hex color to RGB
     */
    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Parse hex values
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        
        return { r, g, b };
    }

    /**
     * Apply the selected theme
     */
    applyTheme(themeName) {
        // Validate theme exists
        if (!this.options.themeDefinitions[themeName]) {
            console.warn(`Theme "${themeName}" not found. Using default theme.`);
            themeName = 'default';
        }
        
        // Remove any existing theme classes
        const themeClasses = Object.keys(this.options.themeDefinitions).map(name => `theme-${name}`);
        document.body.classList.remove(...themeClasses);
        
        // Add the new theme class
        document.body.classList.add(`theme-${themeName}`);
        
        // Update current theme
        this.currentTheme = themeName;
        
        // Update theme selector if it exists
        this.updateThemeSelector();
        
        // Save settings
        if (this.options.persistSettings) {
            this.saveSettings();
        }
    }

    /**
     * Create theme selector UI
     */
    createThemeSelector() {
        // Check if selector already exists
        let existingSelector = document.querySelector('.theme-selector');
        if (existingSelector) {
            return;
        }
        
        // Create container
        const container = document.createElement('div');
        container.className = 'theme-selector';
        
        // Add heading
        const heading = document.createElement('h3');
        heading.textContent = 'Choose a Theme';
        heading.style.width = '100%';
        container.appendChild(heading);
        
        // Add theme options
        for (const [themeName, themeProps] of Object.entries(this.options.themeDefinitions)) {
            const themeOption = document.createElement('div');
            themeOption.className = `theme-option ${themeName === this.currentTheme ? 'active' : ''}`;
            themeOption.setAttribute('data-theme', themeName);
            themeOption.style.backgroundColor = themeProps.primaryColor;
            themeOption.setAttribute('title', themeName.charAt(0).toUpperCase() + themeName.slice(1));
            
            themeOption.addEventListener('click', () => {
                this.applyTheme(themeName);
            });
            
            container.appendChild(themeOption);
        }
        
        // Add to page
        const targetElement = document.querySelector('.pupil-voice-container') || document.body;
        targetElement.appendChild(container);
    }

    /**
     * Update theme selector to reflect current theme
     */
    updateThemeSelector() {
        const selector = document.querySelector('.theme-selector');
        if (!selector) {
            return;
        }
        
        // Update active state
        const options = selector.querySelectorAll('.theme-option');
        options.forEach(option => {
            const themeName = option.getAttribute('data-theme');
            if (themeName === this.currentTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    /**
     * Initialize avatar selection
     */
    initializeAvatarSelection() {
        // Check if avatar selector already exists
        let existingSelector = document.querySelector('.avatar-selector');
        if (existingSelector) {
            return;
        }
        
        // Create container
        const container = document.createElement('div');
        container.className = 'avatar-selector';
        
        // Add heading
        const heading = document.createElement('h3');
        heading.textContent = 'Choose Your Avatar';
        heading.style.width = '100%';
        container.appendChild(heading);
        
        // Add avatar options
        for (const avatarSrc of this.options.avatarOptions) {
            const avatarOption = document.createElement('div');
            avatarOption.className = 'avatar-option';
            avatarOption.setAttribute('data-avatar', avatarSrc);
            
            const avatarImg = document.createElement('img');
            avatarImg.src = `/assets/avatars/${avatarSrc}`;
            avatarImg.alt = 'Avatar option';
            avatarOption.appendChild(avatarImg);
            
            avatarOption.addEventListener('click', () => {
                this.selectAvatar(avatarSrc);
            });
            
            container.appendChild(avatarOption);
        }
        
        // Add to page
        const targetElement = document.querySelector('.pupil-voice-container') || document.body;
        targetElement.appendChild(container);
        
        // If user already has an avatar, mark it as selected
        if (this.userAvatar) {
            this.updateAvatarSelector();
        }
    }

    /**
     * Select an avatar
     */
    selectAvatar(avatarSrc) {
        this.userAvatar = avatarSrc;
        
        // Update avatar display
        this.updateAvatarDisplay();
        
        // Update selector
        this.updateAvatarSelector();
        
        // Save settings
        if (this.options.persistSettings) {
            this.saveSettings();
        }
    }

    /**
     * Update avatar selector to reflect current selection
     */
    updateAvatarSelector() {
        const selector = document.querySelector('.avatar-selector');
        if (!selector) {
            return;
        }
        
        // Update active state
        const options = selector.querySelectorAll('.avatar-option');
        options.forEach(option => {
            const avatarSrc = option.getAttribute('data-avatar');
            if (avatarSrc === this.userAvatar) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    /**
     * Update avatar display throughout the application
     */
    updateAvatarDisplay() {
        if (!this.userAvatar) {
            return;
        }
        
        // Create or update user avatar display
        let avatarDisplay = document.querySelector('.user-avatar');
        if (!avatarDisplay) {
            avatarDisplay = document.createElement('div');
            avatarDisplay.className = 'user-avatar';
            
            const avatarImg = document.createElement('img');
            avatarImg.alt = 'Your avatar';
            avatarDisplay.appendChild(avatarImg);
            
            // Add to page header or appropriate location
            const header = document.querySelector('header') || document.body;
            header.appendChild(avatarDisplay);
        }
        
        // Update avatar image
        const avatarImg = avatarDisplay.querySelector('img');
        if (avatarImg) {
            avatarImg.src = `/assets/avatars/${this.userAvatar}`;
        }
    }

    /**
     * Initialize badges display
     */
    initializeBadgesDisplay() {
        // Check if badges container already exists
        let existingContainer = document.querySelector('.badges-container');
        if (existingContainer) {
            return;
        }
        
        // Create container
        const container = document.createElement('div');
        container.className = 'badges-container';
        
        // Add heading
        const heading = document.createElement('h3');
        heading.textContent = 'Your Badges';
        heading.style.width = '100%';
        container.appendChild(heading);
        
        // Add badges
        for (const [badgeId, badgeInfo] of Object.entries(this.options.badgeDefinitions)) {
            const badgeItem = document.createElement('div');
            badgeItem.className = `badge-item ${this.userHasBadge(badgeId) ? '' : 'badge-locked'}`;
            badgeItem.setAttribute('data-badge', badgeId);
            
            const badgeIcon = document.createElement('div');
            badgeIcon.className = 'badge-icon';
            
            const badgeImg = document.createElement('img');
            badgeImg.src = `/assets/badges/${badgeInfo.icon}`;
            badgeImg.alt = badgeInfo.name;
            badgeIcon.appendChild(badgeImg);
            
            const badgeName = document.createElement('div');
            badgeName.className = 'badge-name';
            badgeName.textContent = badgeInfo.name;
            
            const badgeDescription = document.createElement('div');
            badgeDescription.className = 'badge-description';
            badgeDescription.textContent = this.userHasBadge(badgeId) ? 
                badgeInfo.description : 
                badgeInfo.criteria;
            
            badgeItem.appendChild(badgeIcon);
            badgeItem.appendChild(badgeName);
            badgeItem.appendChild(badgeDescription);
            
            container.appendChild(badgeItem);
        }
        
        // Add to page
        const targetElement = document.querySelector('.pupil-voice-container') || document.body;
        targetElement.appendChild(container);
    }

    /**
     * Check if user has a specific badge
     */
    userHasBadge(badgeId) {
        return this.userBadges.includes(badgeId);
    }

    /**
     * Award a badge to the user
     */
    awardBadge(badgeId) {
        // Check if badge exists
        if (!this.options.badgeDefinitions[badgeId]) {
            console.warn(`Badge "${badgeId}" not found.`);
            return false;
        }
        
        // Check if user already has this badge
        if (this.userHasBadge(badgeId)) {
            return false;
        }
        
        // Add badge to user's collection
        this.userBadges.push(badgeId);
        
        // Update badges display
        this.updateBadgesDisplay();
        
        // Show celebration animation
        if (this.options.confettiOnAchievement) {
            this.showConfetti();
        }
        
        // Save settings
        if (this.options.persistSettings) {
            this.saveSettings();
        }
        
        return true;
    }

    /**
     * Update badges display to reflect current badges
     */
    updateBadgesDisplay() {
        const container = document.querySelector('.badges-container');
        if (!container) {
            return;
        }
        
        // Update badge items
        const badgeItems = container.querySelectorAll('.badge-item');
        badgeItems.forEach(item => {
            const badgeId = item.getAttribute('data-badge');
            const badgeInfo = this.options.badgeDefinitions[badgeId];
            
            if (this.userHasBadge(badgeId)) {
                item.classList.remove('badge-locked');
                
                // Update description to show achievement description instead of criteria
                const descElement = item.querySelector('.badge-description');
                if (descElement && badgeInfo) {
                    descElement.textContent = badgeInfo.description;
                }
            } else {
                item.classList.add('badge-locked');
            }
        });
    }

    /**
     * Initialize progress tracking
     */
    initializeProgressTracking() {
        // Check if progress container already exists
        let existingContainer = document.querySelector('.progress-container');
        if (existingContainer) {
            return;
        }
        
        // Create container
        const container = document.createElement('div');
        container.className = 'progress-container';
        
        // Add heading
        const heading = document.createElement('h3');
        heading.textContent = 'Your Progress';
        container.appendChild(heading);
        
        // Add progress bar
        const progressLabel = document.createElement('div');
        progressLabel.className = 'progress-label';
        progressLabel.textContent = 'Voice Contributions: 0%';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = '0%';
        
        progressBar.appendChild(progressFill);
        
        container.appendChild(progressLabel);
        container.appendChild(progressBar);
        
        // Add to page
        const targetElement = document.querySelector('.pupil-voice-container') || document.body;
        targetElement.appendChild(container);
    }

    /**
     * Update progress tracking
     */
    updateProgress(category, value, total) {
        // Store progress data
        this.progressData[category] = { value, total };
        
        // Calculate percentage
        const percentage = Math.min(100, Math.round((value / total) * 100));
        
        // Update progress display
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            const progressLabel = progressContainer.querySelector('.progress-label');
            const progressFill = progressContainer.querySelector('.progress-fill');
            
            if (progressLabel) {
                progressLabel.textContent = `${category}: ${percentage}%`;
            }
            
            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }
        }
        
        // Save settings
        if (this.options.persistSettings) {
            this.saveSettings();
        }
        
        return percentage;
    }

    /**
     * Show confetti animation for achievements
     */
    showConfetti() {
        // Create confetti container if it doesn't exist
        let confettiContainer = document.querySelector('.confetti-container');
        if (!confettiContainer) {
            confettiContainer = document.createElement('div');
            confettiContainer.className = 'confetti-container';
            document.body.appendChild(confettiContainer);
        }
        
        // Clear any existing confetti
        confettiContainer.innerHTML = '';
        
        // Create confetti pieces
        const colors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random position
            const left = Math.random() * 100;
            confetti.style.left = `${left}%`;
            confetti.style.top = '-10px';
            
            // Random color
            const colorIndex = Math.floor(Math.random() * colors.length);
            confetti.style.backgroundColor = colors[colorIndex];
            
            // Random size
            const size = Math.random() * 10 + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Random rotation
            const rotation = Math.random() * 360;
            confetti.style.transform = `rotate(${rotation}deg)`;
            
            // Random shape
            const shapes = ['circle', 'square', 'triangle'];
            const shapeIndex = Math.floor(Math.random() * shapes.length);
            if (shapes[shapeIndex] === 'circle') {
                confetti.style.borderRadius = '50%';
            } else if (shapes[shapeIndex] === 'triangle') {
                confetti.style.width = '0';
                confetti.style.height = '0';
                confetti.style.backgroundColor = 'transparent';
                confetti.style.borderLeft = `${size/2}px solid transparent`;
                confetti.style.borderRight = `${size/2}px solid transparent`;
                confetti.style.borderBottom = `${size}px solid ${colors[colorIndex]}`;
            }
            
            // Add to container
            confettiContainer.appendChild(confetti);
            
            // Animate falling
            const animationDuration = Math.random() * 3 + 2;
            const horizontalMovement = (Math.random() - 0.5) * 100;
            
            confetti.animate([
                { transform: `translateY(0) translateX(0) rotate(${rotation}deg)`, opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) translateX(${horizontalMovement}px) rotate(${rotation + 360}deg)`, opacity: 0 }
            ], {
                duration: animationDuration * 1000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
                fill: 'forwards'
            });
        }
        
        // Remove confetti container after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }

    /**
     * Set up animations for elements
     */
    setupAnimations() {
        // Toggle animations based on setting
        if (!this.animationsEnabled) {
            document.body.classList.add('animations-disabled');
            return;
        } else {
            document.body.classList.remove('animations-disabled');
        }
        
        // Add animation classes to elements
        const headings = document.querySelectorAll('h1, h2, h3');
        headings.forEach((heading, index) => {
            heading.classList.add('animate-fade-in');
            heading.style.animationDelay = `${index * 0.1}s`;
        });
        
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                this.classList.add('animate-pulse');
                setTimeout(() => {
                    this.classList.remove('animate-pulse');
                }, 1000);
            });
        });
        
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.classList.add('animate-slide-up');
        });
        
        // Add entrance animations to sections
        const sections = document.querySelectorAll('section, .section');
        sections.forEach((section, index) => {
            section.classList.add('animate-fade-in');
            section.style.animationDelay = `${index * 0.2}s`;
        });
    }

    /**
     * Toggle animations on/off
     */
    toggleAnimations(enable) {
        if (enable === undefined) {
            enable = !this.animationsEnabled;
        }
        
        this.animationsEnabled = enable;
        
        if (enable) {
            document.body.classList.remove('animations-disabled');
            this.setupAnimations();
        } else {
            document.body.classList.add('animations-disabled');
        }
        
        // Save settings
        if (this.options.persistSettings) {
            this.saveSettings();
        }
    }

    /**
     * Save current settings to localStorage
     */
    saveSettings() {
        if (!window.localStorage) {
            return;
        }
        
        const settings = {
            theme: this.currentTheme,
            userBadges: this.userBadges,
            userAvatar: this.userAvatar,
            progressData: this.progressData,
            animationsEnabled: this.animationsEnabled,
            gamificationEnabled: this.gamificationEnabled,
            avatarsEnabled: this.avatarsEnabled
        };
        
        localStorage.setItem('visualEnhancementSettings', JSON.stringify(settings));
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        if (!window.localStorage) {
            return;
        }
        
        const savedSettings = localStorage.getItem('visualEnhancementSettings');
        if (!savedSettings) {
            return;
        }
        
        try {
            const settings = JSON.parse(savedSettings);
            
            // Apply saved settings
            if (settings.theme) {
                this.currentTheme = settings.theme;
            }
            
            if (settings.userBadges) {
                this.userBadges = settings.userBadges;
            }
            
            if (settings.userAvatar) {
                this.userAvatar = settings.userAvatar;
            }
            
            if (settings.progressData) {
                this.progressData = settings.progressData;
            }
            
            if (settings.animationsEnabled !== undefined) {
                this.animationsEnabled = settings.animationsEnabled;
            }
            
            if (settings.gamificationEnabled !== undefined) {
                this.gamificationEnabled = settings.gamificationEnabled;
            }
            
            if (settings.avatarsEnabled !== undefined) {
                this.avatarsEnabled = settings.avatarsEnabled;
            }
        } catch (error) {
            console.error('Error loading visual enhancement settings:', error);
        }
    }
}

// Add CSS styles when the script loads
document.addEventListener('DOMContentLoaded', () => {
    // Create a temporary instance just to add styles
    const tempManager = new VisualEnhancementManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisualEnhancementManager };
} else {
    window.VisualEnhancementManager = VisualEnhancementManager;
}
