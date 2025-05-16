/**
 * EdPsych Connect - Theme Manager
 * 
 * This file manages the application of visual themes and accessibility settings
 * across the EdPsych Connect platform.
 * 
 * Features:
 * - Theme detection and application
 * - Accessibility settings management
 * - User preference storage
 * - Theme switching interface
 */

class ThemeManager {
  constructor() {
    // Default settings
    this.settings = {
      theme: 'primary', // 'earlyYears', 'primary', 'secondary', 'post16'
      highContrast: false,
      largeText: false,
      dyslexiaFriendly: false,
      reducedMotion: false
    };
    
    // Initialize
    this.loadUserPreferences();
    this.applySettings();
    this.setupEventListeners();
  }
  
  /**
   * Loads user preferences from localStorage
   */
  loadUserPreferences() {
    try {
      const savedSettings = localStorage.getItem('edpsych-connect-theme-settings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      }
      
      // Check for system preferences
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // We don't have a dark mode yet, but we could set it up here
      }
      
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.settings.reducedMotion = true;
      }
      
      // Auto-detect age group from URL if not set
      if (!localStorage.getItem('edpsych-connect-theme-settings')) {
        this.detectThemeFromURL();
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    }
  }
  
  /**
   * Detects appropriate theme based on URL path
   */
  detectThemeFromURL() {
    const path = window.location.pathname;
    
    if (path.includes('early-years')) {
      this.settings.theme = 'earlyYears';
    } else if (path.includes('primary')) {
      this.settings.theme = 'primary';
    } else if (path.includes('secondary')) {
      this.settings.theme = 'secondary';
    } else if (path.includes('post-16')) {
      this.settings.theme = 'post16';
    }
  }
  
  /**
   * Applies current settings to the document
   */
  applySettings() {
    // Apply theme
    document.documentElement.classList.remove(
      'theme-early-years', 
      'theme-primary', 
      'theme-secondary', 
      'theme-post-16'
    );
    
    const themeClass = `theme-${this.settings.theme.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    document.documentElement.classList.add(themeClass);
    
    // Apply accessibility settings
    document.documentElement.classList.toggle('high-contrast', this.settings.highContrast);
    document.documentElement.classList.toggle('large-text', this.settings.largeText);
    document.documentElement.classList.toggle('dyslexia-friendly', this.settings.dyslexiaFriendly);
    document.documentElement.classList.toggle('reduced-motion', this.settings.reducedMotion);
    
    // Announce changes to screen readers
    this.announceToScreenReader(`Theme set to ${this.settings.theme}. Accessibility settings applied.`);
    
    // Save settings
    this.saveUserPreferences();
  }
  
  /**
   * Saves current settings to localStorage
   */
  saveUserPreferences() {
    try {
      localStorage.setItem('edpsych-connect-theme-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving theme preferences:', error);
    }
  }
  
  /**
   * Sets a specific theme
   * @param {string} theme - The theme to set ('earlyYears', 'primary', 'secondary', 'post16')
   */
  setTheme(theme) {
    if (['earlyYears', 'primary', 'secondary', 'post16'].includes(theme)) {
      this.settings.theme = theme;
      this.applySettings();
    }
  }
  
  /**
   * Toggles high contrast mode
   * @param {boolean} enabled - Whether high contrast should be enabled
   */
  toggleHighContrast(enabled) {
    this.settings.highContrast = enabled;
    this.applySettings();
  }
  
  /**
   * Toggles large text mode
   * @param {boolean} enabled - Whether large text should be enabled
   */
  toggleLargeText(enabled) {
    this.settings.largeText = enabled;
    this.applySettings();
  }
  
  /**
   * Toggles dyslexia-friendly mode
   * @param {boolean} enabled - Whether dyslexia-friendly mode should be enabled
   */
  toggleDyslexiaFriendly(enabled) {
    this.settings.dyslexiaFriendly = enabled;
    this.applySettings();
  }
  
  /**
   * Toggles reduced motion mode
   * @param {boolean} enabled - Whether reduced motion should be enabled
   */
  toggleReducedMotion(enabled) {
    this.settings.reducedMotion = enabled;
    this.applySettings();
  }
  
  /**
   * Creates and injects the theme switcher UI
   */
  createThemeSwitcher() {
    // Create the toolbar container
    const toolbar = document.createElement('div');
    toolbar.className = 'accessibility-toolbar';
    toolbar.setAttribute('aria-label', 'Accessibility and Theme Settings');
    
    // Create theme selector
    const themeSelector = document.createElement('div');
    themeSelector.className = 'theme-selector';
    
    const themeLabel = document.createElement('span');
    themeLabel.className = 'settings-label';
    themeLabel.textContent = 'Age Group:';
    themeSelector.appendChild(themeLabel);
    
    const themeButtons = document.createElement('div');
    themeButtons.className = 'theme-buttons';
    
    const themes = [
      { id: 'earlyYears', name: 'Early Years' },
      { id: 'primary', name: 'Primary' },
      { id: 'secondary', name: 'Secondary' },
      { id: 'post16', name: 'Post-16' }
    ];
    
    themes.forEach(theme => {
      const button = document.createElement('button');
      button.className = `theme-button ${theme.id === this.settings.theme ? 'active' : ''}`;
      button.setAttribute('data-theme', theme.id);
      button.setAttribute('aria-pressed', theme.id === this.settings.theme ? 'true' : 'false');
      button.textContent = theme.name;
      
      button.addEventListener('click', () => {
        this.setTheme(theme.id);
        
        // Update button states
        document.querySelectorAll('.theme-button').forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      });
      
      themeButtons.appendChild(button);
    });
    
    themeSelector.appendChild(themeButtons);
    toolbar.appendChild(themeSelector);
    
    // Create accessibility toggles
    const accessibilityToggles = document.createElement('div');
    accessibilityToggles.className = 'accessibility-toggles';
    
    const accessibilityLabel = document.createElement('span');
    accessibilityLabel.className = 'settings-label';
    accessibilityLabel.textContent = 'Accessibility:';
    accessibilityToggles.appendChild(accessibilityLabel);
    
    // High Contrast Toggle
    const contrastButton = document.createElement('button');
    contrastButton.className = 'a11y-button contrast-toggle';
    contrastButton.setAttribute('aria-pressed', this.settings.highContrast ? 'true' : 'false');
    contrastButton.innerHTML = '<span class="icon">🎨</span> High Contrast';
    contrastButton.addEventListener('click', () => {
      const newState = !this.settings.highContrast;
      this.toggleHighContrast(newState);
      contrastButton.setAttribute('aria-pressed', newState ? 'true' : 'false');
    });
    accessibilityToggles.appendChild(contrastButton);
    
    // Large Text Toggle
    const textButton = document.createElement('button');
    textButton.className = 'a11y-button text-toggle';
    textButton.setAttribute('aria-pressed', this.settings.largeText ? 'true' : 'false');
    textButton.innerHTML = '<span class="icon">🔍</span> Large Text';
    textButton.addEventListener('click', () => {
      const newState = !this.settings.largeText;
      this.toggleLargeText(newState);
      textButton.setAttribute('aria-pressed', newState ? 'true' : 'false');
    });
    accessibilityToggles.appendChild(textButton);
    
    // Dyslexia-Friendly Toggle
    const dyslexiaButton = document.createElement('button');
    dyslexiaButton.className = 'a11y-button dyslexia-toggle';
    dyslexiaButton.setAttribute('aria-pressed', this.settings.dyslexiaFriendly ? 'true' : 'false');
    dyslexiaButton.innerHTML = '<span class="icon">📖</span> Dyslexia Friendly';
    dyslexiaButton.addEventListener('click', () => {
      const newState = !this.settings.dyslexiaFriendly;
      this.toggleDyslexiaFriendly(newState);
      dyslexiaButton.setAttribute('aria-pressed', newState ? 'true' : 'false');
    });
    accessibilityToggles.appendChild(dyslexiaButton);
    
    // Reduced Motion Toggle
    const motionButton = document.createElement('button');
    motionButton.className = 'a11y-button motion-toggle';
    motionButton.setAttribute('aria-pressed', this.settings.reducedMotion ? 'true' : 'false');
    motionButton.innerHTML = '<span class="icon">⚡</span> Reduce Motion';
    motionButton.addEventListener('click', () => {
      const newState = !this.settings.reducedMotion;
      this.toggleReducedMotion(newState);
      motionButton.setAttribute('aria-pressed', newState ? 'true' : 'false');
    });
    accessibilityToggles.appendChild(motionButton);
    
    toolbar.appendChild(accessibilityToggles);
    
    // Create toolbar toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'accessibility-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle accessibility settings');
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.innerHTML = '<span class="icon">⚙️</span>';
    
    toggleButton.addEventListener('click', () => {
      const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
      toggleButton.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      toolbar.classList.toggle('expanded', !isExpanded);
    });
    
    // Add toolbar and toggle button to the document
    document.body.appendChild(toolbar);
    document.body.appendChild(toggleButton);
    
    // Add toolbar styles
    const style = document.createElement('style');
    style.textContent = `
      .accessibility-toolbar {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        border: 1px solid var(--color-neutral-300);
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateY(calc(100% + 20px));
        transition: transform 0.3s ease-in-out;
        max-width: 320px;
      }
      
      .accessibility-toolbar.expanded {
        transform: translateY(0);
      }
      
      .accessibility-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--color-primary-500);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        border: none;
        font-size: 24px;
      }
      
      .accessibility-toggle:hover {
        background: var(--color-primary-600);
      }
      
      .settings-label {
        display: block;
        font-weight: bold;
        margin-bottom: 8px;
      }
      
      .theme-selector, .accessibility-toggles {
        margin-bottom: 16px;
      }
      
      .theme-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .theme-button {
        padding: 8px 12px;
        border: 1px solid var(--color-neutral-300);
        border-radius: 4px;
        background: white;
        cursor: pointer;
      }
      
      .theme-button.active {
        background: var(--color-primary-100);
        border-color: var(--color-primary-500);
        color: var(--color-primary-700);
      }
      
      .accessibility-toggles {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .a11y-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: 1px solid var(--color-neutral-300);
        border-radius: 4px;
        background: white;
        cursor: pointer;
        text-align: left;
      }
      
      .a11y-button[aria-pressed="true"] {
        background: var(--color-primary-100);
        border-color: var(--color-primary-500);
        color: var(--color-primary-700);
      }
      
      .icon {
        font-size: 1.2em;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * Announces a message to screen readers
   * @param {string} message - The message to announce
   */
  announceToScreenReader(message) {
    let announcer = document.getElementById('screen-reader-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'screen-reader-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.classList.add('sr-only');
      document.body.appendChild(announcer);
    }
    
    // Clear previous announcements
    announcer.textContent = '';
    
    // Use setTimeout to ensure the DOM update is recognized by screen readers
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }
  
  /**
   * Sets up event listeners for system preference changes
   */
  setupEventListeners() {
    // Listen for system preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
      if (e.matches) {
        this.settings.reducedMotion = true;
        this.applySettings();
      }
    });
    
    // Listen for URL changes (for single-page applications)
    window.addEventListener('popstate', () => {
      this.detectThemeFromURL();
      this.applySettings();
    });
    
    // Create theme switcher when DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.createThemeSwitcher());
    } else {
      this.createThemeSwitcher();
    }
  }
}

// Initialize the theme manager
const themeManager = new ThemeManager();

// Export for use in other modules
export default themeManager;
