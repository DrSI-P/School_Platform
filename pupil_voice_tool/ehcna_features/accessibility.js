/**
 * EdPsych Connect - Pupil Voice Tool
 * Accessibility Enhancement Module
 * 
 * This module provides comprehensive accessibility features for the Pupil Voice Tool,
 * ensuring it's usable by all students regardless of abilities or disabilities.
 * 
 * Features:
 * - Screen reader compatibility
 * - Keyboard navigation
 * - High contrast mode
 * - Text size adjustment
 * - Dyslexia-friendly font options
 * - Focus management
 * - ARIA attributes management
 * - Color blindness accommodations
 */

class AccessibilityManager {
    constructor(options = {}) {
        // Configuration options with defaults
        this.options = {
            targetSelector: options.targetSelector || 'body',
            enableHighContrast: options.enableHighContrast !== undefined ? options.enableHighContrast : true,
            enableFontAdjustment: options.enableFontAdjustment !== undefined ? options.enableFontAdjustment : true,
            enableDyslexiaFont: options.enableDyslexiaFont !== undefined ? options.enableDyslexiaFont : true,
            enableKeyboardNavigation: options.enableKeyboardNavigation !== undefined ? options.enableKeyboardNavigation : true,
            enableScreenReaderAnnouncements: options.enableScreenReaderAnnouncements !== undefined ? options.enableScreenReaderAnnouncements : true,
            dyslexiaFontFamily: options.dyslexiaFontFamily || 'OpenDyslexic, Comic Sans MS, sans-serif',
            defaultFontSize: options.defaultFontSize || 16,
            fontSizeIncrement: options.fontSizeIncrement || 2,
            maxFontSizeIncrement: options.maxFontSizeIncrement || 8,
            highContrastClass: options.highContrastClass || 'high-contrast',
            largeTextClass: options.largeTextClass || 'large-text',
            dyslexiaFontClass: options.dyslexiaFontClass || 'dyslexia-friendly',
            focusIndicatorClass: options.focusIndicatorClass || 'enhanced-focus',
            controlPanelId: options.controlPanelId || 'accessibility-controls',
            announceChanges: options.announceChanges !== undefined ? options.announceChanges : true,
            persistSettings: options.persistSettings !== undefined ? options.persistSettings : true
        };

        // State variables
        this.target = document.querySelector(this.options.targetSelector);
        this.fontSizeLevel = 0;
        this.highContrastEnabled = false;
        this.dyslexiaFontEnabled = false;
        this.liveRegion = null;
        this.controlPanel = null;
        
        // Initialize
        this.init();
    }

    /**
     * Initialize the accessibility manager
     */
    init() {
        // Create live region for screen reader announcements
        if (this.options.enableScreenReaderAnnouncements) {
            this.createLiveRegion();
        }
        
        // Create accessibility control panel
        this.createControlPanel();
        
        // Load saved settings if enabled
        if (this.options.persistSettings) {
            this.loadSettings();
        }
        
        // Add keyboard navigation handlers
        if (this.options.enableKeyboardNavigation) {
            this.setupKeyboardNavigation();
        }
        
        // Add ARIA attributes to improve screen reader experience
        this.enhanceAriaAttributes();
        
        // Enhance focus indicators
        this.enhanceFocusIndicators();
        
        // Announce initialization to screen readers
        this.announce('Accessibility features initialized. Press Alt+A to open accessibility controls.');
    }

    /**
     * Create a live region for screen reader announcements
     */
    createLiveRegion() {
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only live-region';
        this.liveRegion.style.position = 'absolute';
        this.liveRegion.style.width = '1px';
        this.liveRegion.style.height = '1px';
        this.liveRegion.style.padding = '0';
        this.liveRegion.style.margin = '-1px';
        this.liveRegion.style.overflow = 'hidden';
        this.liveRegion.style.clip = 'rect(0, 0, 0, 0)';
        this.liveRegion.style.whiteSpace = 'nowrap';
        this.liveRegion.style.border = '0';
        
        document.body.appendChild(this.liveRegion);
    }

    /**
     * Create the accessibility control panel
     */
    createControlPanel() {
        // Check if panel already exists
        let existingPanel = document.getElementById(this.options.controlPanelId);
        if (existingPanel) {
            this.controlPanel = existingPanel;
            return;
        }
        
        // Create panel container
        this.controlPanel = document.createElement('div');
        this.controlPanel.id = this.options.controlPanelId;
        this.controlPanel.className = 'accessibility-control-panel';
        this.controlPanel.setAttribute('role', 'region');
        this.controlPanel.setAttribute('aria-label', 'Accessibility Controls');
        
        // Add heading
        const heading = document.createElement('h2');
        heading.textContent = 'Accessibility Options';
        this.controlPanel.appendChild(heading);
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.className = 'close-button';
        closeButton.setAttribute('aria-label', 'Close accessibility controls');
        closeButton.addEventListener('click', () => this.toggleControlPanel(false));
        this.controlPanel.appendChild(closeButton);
        
        // Add controls
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'controls-container';
        
        // High contrast toggle
        if (this.options.enableHighContrast) {
            const contrastControl = this.createToggleControl(
                'high-contrast-toggle',
                'High Contrast Mode',
                this.highContrastEnabled,
                (checked) => this.toggleHighContrast(checked)
            );
            controlsContainer.appendChild(contrastControl);
        }
        
        // Font size controls
        if (this.options.enableFontAdjustment) {
            const fontSizeControl = document.createElement('div');
            fontSizeControl.className = 'control-group';
            
            const fontSizeLabel = document.createElement('label');
            fontSizeLabel.textContent = 'Text Size';
            fontSizeControl.appendChild(fontSizeLabel);
            
            const fontSizeButtons = document.createElement('div');
            fontSizeButtons.className = 'button-group';
            
            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = 'A-';
            decreaseButton.setAttribute('aria-label', 'Decrease text size');
            decreaseButton.addEventListener('click', () => this.adjustFontSize(-1));
            
            const resetButton = document.createElement('button');
            resetButton.textContent = 'Reset';
            resetButton.setAttribute('aria-label', 'Reset text size');
            resetButton.addEventListener('click', () => this.resetFontSize());
            
            const increaseButton = document.createElement('button');
            increaseButton.textContent = 'A+';
            increaseButton.setAttribute('aria-label', 'Increase text size');
            increaseButton.addEventListener('click', () => this.adjustFontSize(1));
            
            fontSizeButtons.appendChild(decreaseButton);
            fontSizeButtons.appendChild(resetButton);
            fontSizeButtons.appendChild(increaseButton);
            
            fontSizeControl.appendChild(fontSizeButtons);
            controlsContainer.appendChild(fontSizeControl);
        }
        
        // Dyslexia-friendly font toggle
        if (this.options.enableDyslexiaFont) {
            const dyslexiaControl = this.createToggleControl(
                'dyslexia-font-toggle',
                'Dyslexia-Friendly Font',
                this.dyslexiaFontEnabled,
                (checked) => this.toggleDyslexiaFont(checked)
            );
            controlsContainer.appendChild(dyslexiaControl);
        }
        
        this.controlPanel.appendChild(controlsContainer);
        
        // Add keyboard shortcut information
        const shortcutsInfo = document.createElement('div');
        shortcutsInfo.className = 'shortcuts-info';
        shortcutsInfo.innerHTML = `
            <h3>Keyboard Shortcuts</h3>
            <ul>
                <li><kbd>Alt</kbd> + <kbd>A</kbd>: Toggle accessibility panel</li>
                <li><kbd>Alt</kbd> + <kbd>C</kbd>: Toggle high contrast</li>
                <li><kbd>Alt</kbd> + <kbd>+</kbd>: Increase text size</li>
                <li><kbd>Alt</kbd> + <kbd>-</kbd>: Decrease text size</li>
                <li><kbd>Alt</kbd> + <kbd>D</kbd>: Toggle dyslexia font</li>
                <li><kbd>Alt</kbd> + <kbd>R</kbd>: Reset all settings</li>
            </ul>
        `;
        this.controlPanel.appendChild(shortcutsInfo);
        
        // Initially hide the panel
        this.controlPanel.style.display = 'none';
        
        // Add to document
        document.body.appendChild(this.controlPanel);
        
        // Add toggle button to page
        this.addToggleButton();
    }

    /**
     * Create a toggle control with label and switch
     */
    createToggleControl(id, labelText, initialState, onChange) {
        const container = document.createElement('div');
        container.className = 'control-group';
        
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;
        
        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.id = id;
        toggle.checked = initialState;
        toggle.addEventListener('change', (e) => onChange(e.target.checked));
        
        const toggleWrapper = document.createElement('div');
        toggleWrapper.className = 'toggle-switch';
        toggleWrapper.appendChild(toggle);
        
        const slider = document.createElement('span');
        slider.className = 'slider';
        toggleWrapper.appendChild(slider);
        
        container.appendChild(label);
        container.appendChild(toggleWrapper);
        
        return container;
    }

    /**
     * Add a floating button to toggle the control panel
     */
    addToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'accessibility-toggle-button';
        toggleButton.setAttribute('aria-label', 'Open accessibility controls');
        toggleButton.setAttribute('title', 'Accessibility Options (Alt+A)');
        
        // Add accessibility icon
        toggleButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v8"></path>
                <path d="M8 12h8"></path>
            </svg>
        `;
        
        toggleButton.addEventListener('click', () => this.toggleControlPanel(true));
        
        document.body.appendChild(toggleButton);
    }

    /**
     * Toggle the control panel visibility
     */
    toggleControlPanel(show) {
        if (show === undefined) {
            show = this.controlPanel.style.display === 'none';
        }
        
        this.controlPanel.style.display = show ? 'block' : 'none';
        
        if (show) {
            // Announce to screen readers
            this.announce('Accessibility controls opened');
            
            // Focus the first control
            const firstControl = this.controlPanel.querySelector('input, button');
            if (firstControl) {
                firstControl.focus();
            }
        } else {
            this.announce('Accessibility controls closed');
        }
    }

    /**
     * Toggle high contrast mode
     */
    toggleHighContrast(enable) {
        if (enable === undefined) {
            enable = !this.highContrastEnabled;
        }
        
        this.highContrastEnabled = enable;
        
        if (enable) {
            document.body.classList.add(this.options.highContrastClass);
            this.announce('High contrast mode enabled');
        } else {
            document.body.classList.remove(this.options.highContrastClass);
            this.announce('High contrast mode disabled');
        }
        
        // Update toggle if it exists
        const toggle = document.getElementById('high-contrast-toggle');
        if (toggle && toggle.checked !== enable) {
            toggle.checked = enable;
        }
        
        // Save settings
        if (this.options.persistSettings) {
            this.saveSettings();
        }
    }

    /**
     * Adjust font size
     */
    adjustFontSize(increment) {
        // Limit the maximum increase/decrease
        const newLevel = Math.max(-2, Math.min(this.fontSizeLevel + increment, this.options.maxFontSizeIncrement / this.options.fontSizeIncrement));
        
        if (newLevel === this.fontSizeLevel) {
            return; // No change needed
        }
        
        this.fontSizeLevel = newLevel;
        
        // Calculate new size
        const newSize = this.options.defaultFontSize + (this.fontSizeLevel * this.options.fontSizeIncrement);
        
        // Apply to root element to affect rem units
        document.documentElement.style.fontSize = `${newSize}px`;
        
        // Add or remove class based on whether size is increased
        if (this.fontSizeLevel > 0) {
            document.body.classList.add(this.options.largeTextClass);
            this.announce(`Text size increased to level ${this.fontSizeLevel}`);
        } else if (this.fontSizeLevel < 0) {
            document.body.classList.add(this.options.largeTextClass);
            this.announce(`Text size decreased to level ${this.fontSizeLevel}`);
        } else {
            document.body.classList.remove(this.options.largeTextClass);
            this.announce('Text size reset to default');
        }
        
        // Save settings
        if (this.options.persistSettings) {
            this.saveSettings();
        }
    }

    /**
     * Reset font size to default
     */
    resetFontSize() {
        this.fontSizeLevel = 0;
        document.documentElement.style.fontSize = `${this.options.defaultFontSize}px`;
        document.body.classList.remove(this.options.largeTextClass);
        this.announce('Text size reset to default');
        
        // Save settings
        if (this.options.persistSettings) {
            this.saveSettings();
        }
    }

    /**
     * Toggle dyslexia-friendly font
     */
    toggleDyslexiaFont(enable) {
        if (enable === undefined) {
            enable = !this.dyslexiaFontEnabled;
        }
        
        this.dyslexiaFontEnabled = enable;
        
        if (enable) {
            document.body.classList.add(this.options.dyslexiaFontClass);
            document.documentElement.style.setProperty('--dyslexia-font', this.options.dyslexiaFontFamily);
            this.announce('Dyslexia-friendly font enabled');
        } else {
            document.body.classList.remove(this.options.dyslexiaFontClass);
            this.announce('Dyslexia-friendly font disabled');
        }
        
        // Update toggle if it exists
        const toggle = document.getElementById('dyslexia-font-toggle');
        if (toggle && toggle.checked !== enable) {
            toggle.checked = enable;
        }
        
        // Save settings
        if (this.options.persistSettings) {
            this.saveSettings();
        }
    }

    /**
     * Reset all accessibility settings to default
     */
    resetAllSettings() {
        this.toggleHighContrast(false);
        this.resetFontSize();
        this.toggleDyslexiaFont(false);
        
        this.announce('All accessibility settings reset to default');
        
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
            highContrast: this.highContrastEnabled,
            fontSizeLevel: this.fontSizeLevel,
            dyslexiaFont: this.dyslexiaFontEnabled
        };
        
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        if (!window.localStorage) {
            return;
        }
        
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (!savedSettings) {
            return;
        }
        
        try {
            const settings = JSON.parse(savedSettings);
            
            // Apply saved settings
            if (settings.highContrast !== undefined) {
                this.toggleHighContrast(settings.highContrast);
            }
            
            if (settings.fontSizeLevel !== undefined) {
                this.fontSizeLevel = 0; // Reset first
                this.adjustFontSize(settings.fontSizeLevel);
            }
            
            if (settings.dyslexiaFont !== undefined) {
                this.toggleDyslexiaFont(settings.dyslexiaFont);
            }
        } catch (error) {
            console.error('Error loading accessibility settings:', error);
        }
    }

    /**
     * Set up keyboard navigation shortcuts
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            // Check if Alt key is pressed
            if (event.altKey) {
                switch (event.key) {
                    case 'a':
                    case 'A':
                        // Toggle accessibility panel
                        event.preventDefault();
                        this.toggleControlPanel();
                        break;
                    
                    case 'c':
                    case 'C':
                        // Toggle high contrast
                        event.preventDefault();
                        this.toggleHighContrast();
                        break;
                    
                    case '+':
                    case '=':
                        // Increase font size
                        event.preventDefault();
                        this.adjustFontSize(1);
                        break;
                    
                    case '-':
                    case '_':
                        // Decrease font size
                        event.preventDefault();
                        this.adjustFontSize(-1);
                        break;
                    
                    case 'd':
                    case 'D':
                        // Toggle dyslexia font
                        event.preventDefault();
                        this.toggleDyslexiaFont();
                        break;
                    
                    case 'r':
                    case 'R':
                        // Reset all settings
                        event.preventDefault();
                        this.resetAllSettings();
                        break;
                }
            }
        });
        
        // Enhance tab navigation
        this.setupFocusTrap();
    }

    /**
     * Set up focus trap for modal dialogs
     */
    setupFocusTrap() {
        document.addEventListener('keydown', (event) => {
            // Only trap focus if the control panel is open
            if (this.controlPanel.style.display !== 'block') {
                return;
            }
            
            // Check for Tab key
            if (event.key === 'Tab') {
                // Get all focusable elements in the panel
                const focusableElements = this.controlPanel.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length === 0) {
                    return;
                }
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                // If shift+tab and on first element, wrap to last
                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
                // If tab and on last element, wrap to first
                else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
            // Close on Escape
            else if (event.key === 'Escape') {
                this.toggleControlPanel(false);
            }
        });
    }

    /**
     * Enhance ARIA attributes throughout the application
     */
    enhanceAriaAttributes() {
        // Add missing labels to form elements
        const unlabeledInputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        unlabeledInputs.forEach(input => {
            // Try to find associated label
            const id = input.id;
            if (id) {
                const label = document.querySelector(`label[for="${id}"]`);
                if (label) {
                    // Label exists, no need for aria-label
                    return;
                }
            }
            
            // Add placeholder as aria-label if available
            if (input.placeholder) {
                input.setAttribute('aria-label', input.placeholder);
            }
        });
        
        // Add roles to common elements
        const mainContent = document.querySelector('main');
        if (mainContent && !mainContent.getAttribute('role')) {
            mainContent.setAttribute('role', 'main');
        }
        
        const navElements = document.querySelectorAll('nav');
        navElements.forEach(nav => {
            if (!nav.getAttribute('role')) {
                nav.setAttribute('role', 'navigation');
            }
        });
        
        // Add landmarks for screen readers
        const headers = document.querySelectorAll('header');
        headers.forEach(header => {
            if (!header.getAttribute('role')) {
                header.setAttribute('role', 'banner');
            }
        });
        
        const footers = document.querySelectorAll('footer');
        footers.forEach(footer => {
            if (!footer.getAttribute('role')) {
                footer.setAttribute('role', 'contentinfo');
            }
        });
        
        // Add aria-required to required form fields
        const requiredFields = document.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.setAttribute('aria-required', 'true');
        });
    }

    /**
     * Enhance focus indicators for keyboard navigation
     */
    enhanceFocusIndicators() {
        // Add a style element if it doesn't exist
        let styleElement = document.getElementById('accessibility-focus-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'accessibility-focus-styles';
            document.head.appendChild(styleElement);
            
            // Add enhanced focus styles
            styleElement.textContent = `
                .${this.options.focusIndicatorClass} *:focus {
                    outline: 3px solid #4d90fe !important;
                    outline-offset: 2px !important;
                    box-shadow: 0 0 0 2px white !important;
                }
                
                /* High contrast focus styles */
                .${this.options.highContrastClass} *:focus {
                    outline: 3px solid yellow !important;
                    outline-offset: 2px !important;
                    box-shadow: 0 0 0 2px black !important;
                }
            `;
        }
        
        // Add the focus indicator class to body
        document.body.classList.add(this.options.focusIndicatorClass);
        
        // Detect if user is using keyboard or mouse
        document.addEventListener('mousedown', () => {
            document.body.classList.remove(this.options.focusIndicatorClass);
        });
        
        document.addEventListener('keydown', (event) => {
            // Only add for navigation keys
            if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                document.body.classList.add(this.options.focusIndicatorClass);
            }
        });
    }

    /**
     * Announce a message to screen readers
     */
    announce(message) {
        if (!this.options.announceChanges || !this.liveRegion) {
            return;
        }
        
        // Clear previous message first
        this.liveRegion.textContent = '';
        
        // Set new message after a small delay to ensure it's read
        setTimeout(() => {
            this.liveRegion.textContent = message;
        }, 50);
    }

    /**
     * Add CSS for accessibility features
     */
    addAccessibilityStyles() {
        // Add a style element if it doesn't exist
        let styleElement = document.getElementById('accessibility-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'accessibility-styles';
            document.head.appendChild(styleElement);
            
            // Add styles for accessibility features
            styleElement.textContent = `
                /* High contrast mode */
                .${this.options.highContrastClass} {
                    background-color: black !important;
                    color: white !important;
                }
                
                .${this.options.highContrastClass} a {
                    color: yellow !important;
                }
                
                .${this.options.highContrastClass} button,
                .${this.options.highContrastClass} input,
                .${this.options.highContrastClass} select,
                .${this.options.highContrastClass} textarea {
                    background-color: black !important;
                    color: white !important;
                    border: 2px solid white !important;
                }
                
                /* Dyslexia-friendly font */
                :root {
                    --dyslexia-font: ${this.options.dyslexiaFontFamily};
                }
                
                .${this.options.dyslexiaFontClass} {
                    font-family: var(--dyslexia-font) !important;
                    letter-spacing: 0.05em !important;
                    word-spacing: 0.1em !important;
                    line-height: 1.5 !important;
                }
                
                /* Control panel styles */
                .accessibility-control-panel {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: white;
                    border: 2px solid #333;
                    border-radius: 8px;
                    padding: 20px;
                    z-index: 9999;
                    width: 300px;
                    max-width: 90vw;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .${this.options.highContrastClass} .accessibility-control-panel {
                    background-color: black !important;
                    border-color: white !important;
                }
                
                .accessibility-control-panel h2 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    padding-right: 30px;
                }
                
                .accessibility-control-panel .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .control-group {
                    margin-bottom: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .button-group {
                    display: flex;
                    gap: 5px;
                }
                
                .button-group button {
                    padding: 5px 10px;
                    cursor: pointer;
                }
                
                /* Toggle switch */
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 24px;
                }
                
                .slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                
                input:checked + .slider {
                    background-color: #2196F3;
                }
                
                input:focus + .slider {
                    box-shadow: 0 0 1px #2196F3;
                }
                
                input:checked + .slider:before {
                    transform: translateX(26px);
                }
                
                /* Shortcuts info */
                .shortcuts-info {
                    margin-top: 20px;
                    border-top: 1px solid #ddd;
                    padding-top: 15px;
                }
                
                .shortcuts-info h3 {
                    margin-top: 0;
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                
                .shortcuts-info ul {
                    margin: 0;
                    padding-left: 20px;
                }
                
                .shortcuts-info li {
                    margin-bottom: 5px;
                }
                
                kbd {
                    background-color: #f7f7f7;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    box-shadow: 0 1px 0 rgba(0,0,0,0.2);
                    color: #333;
                    display: inline-block;
                    font-size: 0.85em;
                    font-family: monospace;
                    line-height: 1;
                    padding: 2px 4px;
                    white-space: nowrap;
                }
                
                /* Toggle button */
                .accessibility-toggle-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: #2196F3;
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    z-index: 9998;
                }
                
                .accessibility-toggle-button:hover {
                    background-color: #0b7dda;
                }
                
                /* Screen reader only class */
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
            `;
        }
    }
}

// Add CSS styles when the script loads
document.addEventListener('DOMContentLoaded', () => {
    // Create a temporary instance just to add styles
    const tempManager = new AccessibilityManager();
    tempManager.addAccessibilityStyles();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AccessibilityManager };
} else {
    window.AccessibilityManager = AccessibilityManager;
}
