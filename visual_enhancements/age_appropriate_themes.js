/**
 * EdPsych Connect - Age-Appropriate Visual Themes
 * 
 * This file implements distinct visual themes for different age groups
 * (early years, primary, secondary) with appropriate visual elements,
 * typography, and interaction patterns.
 * 
 * Features implemented:
 * - Age-appropriate color schemes
 * - Typography scaling by age group
 * - Interactive elements adapted to developmental stages
 * - Visual complexity progression
 * - Customizable theme preferences
 * 
 * @author Manus Rocode
 * @version 1.0.0
 */

// Theme Configuration Object
const themeConfig = {
  // Early Years (3-7)
  earlyYears: {
    colors: {
      primary: '#FF9E1B',      // Warm orange - friendly and engaging
      secondary: '#4DB6AC',    // Teal - calming and supportive
      tertiary: '#FFEB3B',     // Yellow - stimulating and positive
      background: '#FFFFFF',   // White - clean and simple
      text: '#424242',         // Dark grey - readable but not harsh
      success: '#8BC34A',      // Light green - gentle positive feedback
      error: '#FF7043',        // Soft orange-red - gentle negative feedback
      highlight: '#FFD54F'     // Amber - attention without overwhelming
    },
    typography: {
      fontFamily: '"Comic Sans MS", "Bubblegum Sans", "Sassoon Primary", sans-serif',
      baseFontSize: '18px',
      headingScale: 1.3,       // Smaller difference between heading levels
      lineHeight: 1.6,         // More space between lines for readability
      letterSpacing: '0.03em'  // Slightly more space between letters
    },
    spacing: {
      base: '16px',
      scale: 1.5               // More generous spacing for easier targeting
    },
    borders: {
      radius: '12px',          // Very rounded corners
      width: '3px'             // Thicker borders for visibility
    },
    animations: {
      duration: '0.5s',        // Slightly slower animations
      easing: 'ease-in-out',   // Gentle easing
      hoverScale: 1.1          // Noticeable but not extreme scaling on hover
    },
    icons: {
      style: 'rounded',        // Soft, rounded icons
      size: 'large',           // Larger icons for easier recognition
      strokeWidth: 2.5         // Thicker strokes for visibility
    }
  },
  
  // Primary (8-11)
  primary: {
    colors: {
      primary: '#2196F3',      // Blue - trustworthy and calm
      secondary: '#FF5722',    // Deep orange - energetic but controlled
      tertiary: '#9C27B0',     // Purple - creative and imaginative
      background: '#F5F5F5',   // Light grey - subtle texture
      text: '#212121',         // Very dark grey - clear readability
      success: '#4CAF50',      // Green - clear positive feedback
      error: '#F44336',        // Red - clear negative feedback
      highlight: '#FFC107'     // Amber - clear highlighting
    },
    typography: {
      fontFamily: '"Sassoon Primary", "Comic Neue", "Andika", sans-serif',
      baseFontSize: '16px',
      headingScale: 1.4,       // Moderate difference between heading levels
      lineHeight: 1.5,         // Standard line height
      letterSpacing: '0.02em'  // Moderate letter spacing
    },
    spacing: {
      base: '12px',
      scale: 1.4               // Standard spacing
    },
    borders: {
      radius: '8px',           // Moderately rounded corners
      width: '2px'             // Standard border width
    },
    animations: {
      duration: '0.4s',        // Standard animation speed
      easing: 'ease',          // Standard easing
      hoverScale: 1.05         // Subtle scaling on hover
    },
    icons: {
      style: 'standard',       // Standard icon style
      size: 'medium',          // Medium-sized icons
      strokeWidth: 2           // Standard stroke width
    }
  },
  
  // Secondary (12-16)
  secondary: {
    colors: {
      primary: '#1976D2',      // Darker blue - more sophisticated
      secondary: '#E64A19',    // Darker orange - more mature
      tertiary: '#7B1FA2',     // Darker purple - more nuanced
      background: '#EEEEEE',   // Light grey - professional
      text: '#212121',         // Very dark grey - serious readability
      success: '#388E3C',      // Darker green - mature positive feedback
      error: '#D32F2F',        // Darker red - mature negative feedback
      highlight: '#FFA000'     // Darker amber - subtle highlighting
    },
    typography: {
      fontFamily: '"Roboto", "Open Sans", "Lato", sans-serif',
      baseFontSize: '14px',
      headingScale: 1.5,       // Larger difference between heading levels
      lineHeight: 1.4,         // Tighter line height for denser content
      letterSpacing: '0.01em'  // Tighter letter spacing
    },
    spacing: {
      base: '8px',
      scale: 1.3               // Tighter spacing for more content
    },
    borders: {
      radius: '4px',           // Less rounded corners
      width: '1px'             // Thinner borders for subtlety
    },
    animations: {
      duration: '0.3s',        // Faster animations
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design easing
      hoverScale: 1.02         // Very subtle scaling on hover
    },
    icons: {
      style: 'sharp',          // Crisper, more detailed icons
      size: 'small',           // Smaller icons for density
      strokeWidth: 1.5         // Thinner strokes for detail
    }
  },
  
  // Post-16 (16+)
  post16: {
    colors: {
      primary: '#0D47A1',      // Very dark blue - professional
      secondary: '#BF360C',    // Very dark orange - serious
      tertiary: '#4A148C',     // Very dark purple - sophisticated
      background: '#E0E0E0',   // Medium grey - professional
      text: '#212121',         // Very dark grey - maximum readability
      success: '#1B5E20',      // Very dark green - subtle positive feedback
      error: '#B71C1C',        // Very dark red - subtle negative feedback
      highlight: '#FF8F00'     // Dark amber - minimal highlighting
    },
    typography: {
      fontFamily: '"Roboto", "Noto Sans", "Open Sans", sans-serif',
      baseFontSize: '14px',
      headingScale: 1.6,       // Largest difference between heading levels
      lineHeight: 1.3,         // Tightest line height for maximum content
      letterSpacing: '0'       // No additional letter spacing
    },
    spacing: {
      base: '8px',
      scale: 1.2               // Tightest spacing for maximum content
    },
    borders: {
      radius: '2px',           // Minimal rounding
      width: '1px'             // Thin borders for subtlety
    },
    animations: {
      duration: '0.2s',        // Fastest animations
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design easing
      hoverScale: 1.01         // Minimal scaling on hover
    },
    icons: {
      style: 'sharp',          // Crisp, detailed icons
      size: 'small',           // Small icons for density
      strokeWidth: 1           // Thinnest strokes for maximum detail
    }
  }
};

/**
 * Detects the appropriate age group based on user profile or context
 * @returns {string} The detected age group: 'earlyYears', 'primary', 'secondary', or 'post16'
 */
function detectAgeGroup() {
  // In a real implementation, this would check user profiles or context
  // For now, we'll check for URL patterns or data attributes
  
  const path = window.location.pathname;
  
  if (path.includes('early-years') || document.body.dataset.ageGroup === 'early-years') {
    return 'earlyYears';
  } else if (path.includes('primary') || document.body.dataset.ageGroup === 'primary') {
    return 'primary';
  } else if (path.includes('secondary') || document.body.dataset.ageGroup === 'secondary') {
    return 'secondary';
  } else if (path.includes('post-16') || document.body.dataset.ageGroup === 'post-16') {
    return 'post16';
  }
  
  // Check for user preference in localStorage
  const savedAgeGroup = localStorage.getItem('preferredAgeGroup');
  if (savedAgeGroup && themeConfig[savedAgeGroup]) {
    return savedAgeGroup;
  }
  
  // Default to primary if no other information is available
  return 'primary';
}

/**
 * Applies the theme for the specified age group
 * @param {string} ageGroup - The age group to apply: 'earlyYears', 'primary', 'secondary', or 'post16'
 */
function applyAgeTheme(ageGroup) {
  if (!themeConfig[ageGroup]) {
    console.error(`Theme for age group "${ageGroup}" not found`);
    return;
  }
  
  const theme = themeConfig[ageGroup];
  
  // Remove any existing theme classes
  document.documentElement.classList.remove('theme-early-years', 'theme-primary', 'theme-secondary', 'theme-post-16');
  
  // Add the new theme class
  document.documentElement.classList.add(`theme-${ageGroup.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  
  // Apply colors as CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--color-${key}`, value);
  });
  
  // Apply typography
  document.documentElement.style.setProperty('--font-family', theme.typography.fontFamily);
  document.documentElement.style.setProperty('--base-font-size', theme.typography.baseFontSize);
  document.documentElement.style.setProperty('--heading-scale', theme.typography.headingScale);
  document.documentElement.style.setProperty('--line-height', theme.typography.lineHeight);
  document.documentElement.style.setProperty('--letter-spacing', theme.typography.letterSpacing);
  
  // Apply spacing
  document.documentElement.style.setProperty('--spacing-base', theme.spacing.base);
  document.documentElement.style.setProperty('--spacing-scale', theme.spacing.scale);
  
  // Apply borders
  document.documentElement.style.setProperty('--border-radius', theme.borders.radius);
  document.documentElement.style.setProperty('--border-width', theme.borders.width);
  
  // Apply animations
  document.documentElement.style.setProperty('--animation-duration', theme.animations.duration);
  document.documentElement.style.setProperty('--animation-easing', theme.animations.easing);
  document.documentElement.style.setProperty('--hover-scale', theme.animations.hoverScale);
  
  // Apply icons
  document.documentElement.style.setProperty('--icon-style', theme.icons.style);
  document.documentElement.style.setProperty('--icon-size', theme.icons.size);
  document.documentElement.style.setProperty('--icon-stroke-width', theme.icons.strokeWidth);
  
  // Store the selected theme in localStorage
  localStorage.setItem('preferredAgeGroup', ageGroup);
  
  // Announce theme change to screen readers
  const ageGroupNames = {
    earlyYears: 'Early Years',
    primary: 'Primary',
    secondary: 'Secondary',
    post16: 'Post-16'
  };
  
  if (typeof announceToScreenReader === 'function') {
    announceToScreenReader(`Theme changed to ${ageGroupNames[ageGroup]}`);
  }
  
  console.log(`EdPsych Connect: Applied ${ageGroupNames[ageGroup]} theme`);
}

/**
 * Creates a theme switcher UI component
 */
function createThemeSwitcher() {
  const switcher = document.createElement('div');
  switcher.className = 'theme-switcher';
  switcher.setAttribute('aria-label', 'Age Group Theme Selection');
  
  const label = document.createElement('span');
  label.className = 'theme-switcher-label';
  label.textContent = 'Age Group:';
  switcher.appendChild(label);
  
  const ageGroups = [
    { id: 'earlyYears', name: 'Early Years' },
    { id: 'primary', name: 'Primary' },
    { id: 'secondary', name: 'Secondary' },
    { id: 'post16', name: 'Post-16' }
  ];
  
  const currentAgeGroup = localStorage.getItem('preferredAgeGroup') || detectAgeGroup();
  
  ageGroups.forEach(group => {
    const button = document.createElement('button');
    button.className = `theme-button ${group.id === currentAgeGroup ? 'active' : ''}`;
    button.setAttribute('data-age-group', group.id);
    button.setAttribute('aria-pressed', group.id === currentAgeGroup ? 'true' : 'false');
    button.textContent = group.name;
    
    button.addEventListener('click', () => {
      // Update active state on buttons
      document.querySelectorAll('.theme-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      
      // Apply the selected theme
      applyAgeTheme(group.id);
    });
    
    switcher.appendChild(button);
  });
  
  // Add the switcher to the document
  document.body.appendChild(switcher);
}

/**
 * Adjusts interactive elements based on age group
 * @param {string} ageGroup - The current age group
 */
function adjustInteractiveElements(ageGroup) {
  // Adjust button sizes and padding
  const buttons = document.querySelectorAll('button, .button, [role="button"]');
  buttons.forEach(button => {
    // Remove existing size classes
    button.classList.remove('button-early-years', 'button-primary', 'button-secondary', 'button-post-16');
    
    // Add appropriate size class
    button.classList.add(`button-${ageGroup.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  });
  
  // Adjust form elements
  const formElements = document.querySelectorAll('input, select, textarea');
  formElements.forEach(element => {
    // Remove existing size classes
    element.classList.remove('input-early-years', 'input-primary', 'input-secondary', 'input-post-16');
    
    // Add appropriate size class
    element.classList.add(`input-${ageGroup.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  });
  
  // Adjust card and container elements
  const containers = document.querySelectorAll('.card, .container, .panel');
  containers.forEach(container => {
    // Remove existing style classes
    container.classList.remove('container-early-years', 'container-primary', 'container-secondary', 'container-post-16');
    
    // Add appropriate style class
    container.classList.add(`container-${ageGroup.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  });
}

/**
 * Adjusts content complexity based on age group
 * @param {string} ageGroup - The current age group
 */
function adjustContentComplexity(ageGroup) {
  // This would be more sophisticated in a real implementation
  // For now, we'll just toggle some content visibility
  
  const complexityLevels = {
    earlyYears: 1,
    primary: 2,
    secondary: 3,
    post16: 4
  };
  
  const currentLevel = complexityLevels[ageGroup] || 2;
  
  // Hide/show content based on complexity level
  document.querySelectorAll('[data-complexity]').forEach(element => {
    const elementComplexity = parseInt(element.dataset.complexity, 10) || 1;
    
    if (elementComplexity <= currentLevel) {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
  });
  
  // Adjust language complexity (in a real implementation, this might swap out text)
  document.querySelectorAll('[data-language-complexity]').forEach(element => {
    const alternatives = element.querySelectorAll('[data-complexity]');
    
    if (alternatives.length > 0) {
      // Hide all alternatives first
      alternatives.forEach(alt => {
        alt.style.display = 'none';
      });
      
      // Find the best match for current level
      let bestMatch = null;
      let bestMatchLevel = 0;
      
      alternatives.forEach(alt => {
        const altComplexity = parseInt(alt.dataset.complexity, 10) || 1;
        
        if (altComplexity <= currentLevel && altComplexity > bestMatchLevel) {
          bestMatch = alt;
          bestMatchLevel = altComplexity;
        }
      });
      
      // Show the best match
      if (bestMatch) {
        bestMatch.style.display = '';
      }
    }
  });
}

/**
 * Initializes the age-appropriate theming system
 */
function initializeAgeThemes() {
  const ageGroup = detectAgeGroup();
  applyAgeTheme(ageGroup);
  adjustInteractiveElements(ageGroup);
  adjustContentComplexity(ageGroup);
  createThemeSwitcher();
  
  // Add CSS for theme switcher
  const style = document.createElement('style');
  style.textContent = `
    .theme-switcher {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--color-background);
      border: 1px solid var(--color-primary);
      border-radius: var(--border-radius);
      padding: calc(var(--spacing-base) * 0.5);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      max-width: 300px;
    }
    
    .theme-switcher-label {
      margin-right: calc(var(--spacing-base) * 0.5);
      font-weight: bold;
      flex: 0 0 100%;
      margin-bottom: calc(var(--spacing-base) * 0.5);
    }
    
    .theme-button {
      background: var(--color-background);
      border: 1px solid var(--color-primary);
      border-radius: calc(var(--border-radius) * 0.5);
      padding: calc(var(--spacing-base) * 0.25) calc(var(--spacing-base) * 0.5);
      margin: 0 calc(var(--spacing-base) * 0.25) calc(var(--spacing-base) * 0.25) 0;
      cursor: pointer;
      font-size: calc(var(--base-font-size) * 0.85);
      transition: background-color var(--animation-duration) var(--animation-easing);
    }
    
    .theme-button:hover {
      background-color: var(--color-primary);
      color: white;
    }
    
    .theme-button.active {
      background-color: var(--color-primary);
      color: white;
      font-weight: bold;
    }
    
    /* Button sizes by age group */
    .button-early-years {
      padding: 12px 20px;
      font-size: 18px;
      border-radius: 12px;
    }
    
    .button-primary {
      padding: 10px 16px;
      font-size: 16px;
      border-radius: 8px;
    }
    
    .button-secondary {
      padding: 8px 12px;
      font-size: 14px;
      border-radius: 4px;
    }
    
    .button-post-16 {
      padding: 6px 10px;
      font-size: 14px;
      border-radius: 2px;
    }
    
    /* Input sizes by age group */
    .input-early-years {
      padding: 12px;
      font-size: 18px;
      border-radius: 12px;
      border-width: 3px;
    }
    
    .input-primary {
      padding: 10px;
      font-size: 16px;
      border-radius: 8px;
      border-width: 2px;
    }
    
    .input-secondary {
      padding: 8px;
      font-size: 14px;
      border-radius: 4px;
      border-width: 1px;
    }
    
    .input-post-16 {
      padding: 6px;
      font-size: 14px;
      border-radius: 2px;
      border-width: 1px;
    }
    
    /* Container styles by age group */
    .container-early-years {
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
      border-width: 3px;
    }
    
    .container-primary {
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
      border-width: 2px;
    }
    
    .container-secondary {
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      border-width: 1px;
    }
    
    .container-post-16 {
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 12px;
      border-width: 1px;
    }
  `;
  
  document.head.appendChild(style);
}

// Initialize age-appropriate themes when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeAgeThemes();
  
  // Log theme initialization
  console.log('EdPsych Connect: Age-appropriate themes initialized');
});

// Export functions for use in other modules
export {
  themeConfig,
  detectAgeGroup,
  applyAgeTheme,
  adjustInteractiveElements,
  adjustContentComplexity
};
