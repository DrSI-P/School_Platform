/**
 * EdPsych Connect - Visual Consistency Implementation
 * 
 * This file implements a comprehensive visual consistency system to ensure
 * visual polish extends across the entire platform with consistent styling,
 * spacing, typography, and component design.
 * 
 * Features implemented:
 * - Design token system for consistent styling
 * - Component library with standardized elements
 * - Grid system for consistent layouts
 * - Typography scale with consistent text styling
 * - Animation system with consistent motion
 * 
 * @author Manus Rocode
 * @version 1.0.0
 */

// Design Token Configuration
const designTokens = {
  // Color palette
  colors: {
    // Primary brand colors
    primary: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      200: '#90CAF9',
      300: '#64B5F6',
      400: '#42A5F5',
      500: '#2196F3', // Primary brand color
      600: '#1E88E5',
      700: '#1976D2',
      800: '#1565C0',
      900: '#0D47A1'
    },
    // Secondary brand colors
    secondary: {
      50: '#FBE9E7',
      100: '#FFCCBC',
      200: '#FFAB91',
      300: '#FF8A65',
      400: '#FF7043',
      500: '#FF5722', // Secondary brand color
      600: '#F4511E',
      700: '#E64A19',
      800: '#D84315',
      900: '#BF360C'
    },
    // Tertiary brand colors
    tertiary: {
      50: '#F3E5F5',
      100: '#E1BEE7',
      200: '#CE93D8',
      300: '#BA68C8',
      400: '#AB47BC',
      500: '#9C27B0', // Tertiary brand color
      600: '#8E24AA',
      700: '#7B1FA2',
      800: '#6A1B9A',
      900: '#4A148C'
    },
    // Neutral colors
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    },
    // Semantic colors
    success: {
      light: '#81C784',
      main: '#4CAF50',
      dark: '#388E3C'
    },
    warning: {
      light: '#FFB74D',
      main: '#FF9800',
      dark: '#F57C00'
    },
    error: {
      light: '#E57373',
      main: '#F44336',
      dark: '#D32F2F'
    },
    info: {
      light: '#64B5F6',
      main: '#2196F3',
      dark: '#1976D2'
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: '"Roboto", "Helvetica Neue", Arial, sans-serif',
      secondary: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
      display: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
      monospace: '"Roboto Mono", "Courier New", monospace'
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem'    // 72px
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },
  
  // Spacing
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    14: '3.5rem',    // 56px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    28: '7rem',      // 112px
    32: '8rem',      // 128px
    36: '9rem',      // 144px
    40: '10rem',     // 160px
    44: '11rem',     // 176px
    48: '12rem',     // 192px
    52: '13rem',     // 208px
    56: '14rem',     // 224px
    60: '15rem',     // 240px
    64: '16rem',     // 256px
    72: '18rem',     // 288px
    80: '20rem',     // 320px
    96: '24rem'      // 384px
  },
  
  // Borders
  borders: {
    radius: {
      none: '0',
      sm: '0.125rem',  // 2px
      md: '0.25rem',   // 4px
      lg: '0.5rem',    // 8px
      xl: '0.75rem',   // 12px
      '2xl': '1rem',   // 16px
      '3xl': '1.5rem', // 24px
      full: '9999px'
    },
    width: {
      0: '0',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px'
    },
    style: {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      double: 'double',
      none: 'none'
    }
  },
  
  // Shadows
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    outline: '0 0 0 3px rgba(66, 153, 225, 0.5)'
  },
  
  // Z-index
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    auto: 'auto'
  },
  
  // Animations
  animations: {
    duration: {
      fastest: '0.1s',
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s',
      slowest: '0.8s'
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      // Material Design easing
      standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
      decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
    }
  },
  
  // Breakpoints
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px'
  }
};

/**
 * Initializes the design token system by converting tokens to CSS variables
 */
function initializeDesignTokens() {
  // Create CSS variables from design tokens
  let cssVariables = ':root {\n';
  
  // Process colors
  Object.entries(designTokens.colors).forEach(([colorName, colorValues]) => {
    if (typeof colorValues === 'object') {
      Object.entries(colorValues).forEach(([shade, value]) => {
        cssVariables += `  --color-${colorName}-${shade}: ${value};\n`;
      });
    }
  });
  
  // Process typography
  Object.entries(designTokens.typography).forEach(([category, values]) => {
    Object.entries(values).forEach(([name, value]) => {
      cssVariables += `  --typography-${category}-${name}: ${value};\n`;
    });
  });
  
  // Process spacing
  Object.entries(designTokens.spacing).forEach(([size, value]) => {
    cssVariables += `  --spacing-${size}: ${value};\n`;
  });
  
  // Process borders
  Object.entries(designTokens.borders).forEach(([category, values]) => {
    Object.entries(values).forEach(([name, value]) => {
      cssVariables += `  --border-${category}-${name}: ${value};\n`;
    });
  });
  
  // Process shadows
  Object.entries(designTokens.shadows).forEach(([name, value]) => {
    cssVariables += `  --shadow-${name}: ${value};\n`;
  });
  
  // Process z-index
  Object.entries(designTokens.zIndex).forEach(([name, value]) => {
    cssVariables += `  --z-index-${name}: ${value};\n`;
  });
  
  // Process animations
  Object.entries(designTokens.animations).forEach(([category, values]) => {
    Object.entries(values).forEach(([name, value]) => {
      cssVariables += `  --animation-${category}-${name}: ${value};\n`;
    });
  });
  
  // Process breakpoints
  Object.entries(designTokens.breakpoints).forEach(([name, value]) => {
    cssVariables += `  --breakpoint-${name}: ${value};\n`;
  });
  
  cssVariables += '}';
  
  // Add the CSS variables to the document
  const style = document.createElement('style');
  style.textContent = cssVariables;
  document.head.appendChild(style);
  
  console.log('EdPsych Connect: Design tokens initialized as CSS variables');
}

/**
 * Creates utility classes based on design tokens
 */
function createUtilityClasses() {
  let utilityClasses = '';
  
  // Color utility classes
  Object.entries(designTokens.colors).forEach(([colorName, colorValues]) => {
    if (typeof colorValues === 'object') {
      Object.entries(colorValues).forEach(([shade, value]) => {
        // Text color utilities
        utilityClasses += `.text-${colorName}-${shade} { color: var(--color-${colorName}-${shade}); }\n`;
        
        // Background color utilities
        utilityClasses += `.bg-${colorName}-${shade} { background-color: var(--color-${colorName}-${shade}); }\n`;
        
        // Border color utilities
        utilityClasses += `.border-${colorName}-${shade} { border-color: var(--color-${colorName}-${shade}); }\n`;
      });
    }
  });
  
  // Typography utility classes
  Object.entries(designTokens.typography.fontSize).forEach(([size, value]) => {
    utilityClasses += `.text-${size} { font-size: var(--typography-fontSize-${size}); }\n`;
  });
  
  Object.entries(designTokens.typography.fontWeight).forEach(([weight, value]) => {
    utilityClasses += `.font-${weight} { font-weight: var(--typography-fontWeight-${weight}); }\n`;
  });
  
  Object.entries(designTokens.typography.lineHeight).forEach(([height, value]) => {
    utilityClasses += `.leading-${height} { line-height: var(--typography-lineHeight-${height}); }\n`;
  });
  
  Object.entries(designTokens.typography.letterSpacing).forEach(([spacing, value]) => {
    utilityClasses += `.tracking-${spacing} { letter-spacing: var(--typography-letterSpacing-${spacing}); }\n`;
  });
  
  // Spacing utility classes
  Object.entries(designTokens.spacing).forEach(([size, value]) => {
    // Margin utilities
    utilityClasses += `.m-${size} { margin: var(--spacing-${size}); }\n`;
    utilityClasses += `.mx-${size} { margin-left: var(--spacing-${size}); margin-right: var(--spacing-${size}); }\n`;
    utilityClasses += `.my-${size} { margin-top: var(--spacing-${size}); margin-bottom: var(--spacing-${size}); }\n`;
    utilityClasses += `.mt-${size} { margin-top: var(--spacing-${size}); }\n`;
    utilityClasses += `.mr-${size} { margin-right: var(--spacing-${size}); }\n`;
    utilityClasses += `.mb-${size} { margin-bottom: var(--spacing-${size}); }\n`;
    utilityClasses += `.ml-${size} { margin-left: var(--spacing-${size}); }\n`;
    
    // Padding utilities
    utilityClasses += `.p-${size} { padding: var(--spacing-${size}); }\n`;
    utilityClasses += `.px-${size} { padding-left: var(--spacing-${size}); padding-right: var(--spacing-${size}); }\n`;
    utilityClasses += `.py-${size} { padding-top: var(--spacing-${size}); padding-bottom: var(--spacing-${size}); }\n`;
    utilityClasses += `.pt-${size} { padding-top: var(--spacing-${size}); }\n`;
    utilityClasses += `.pr-${size} { padding-right: var(--spacing-${size}); }\n`;
    utilityClasses += `.pb-${size} { padding-bottom: var(--spacing-${size}); }\n`;
    utilityClasses += `.pl-${size} { padding-left: var(--spacing-${size}); }\n`;
    
    // Gap utilities
    utilityClasses += `.gap-${size} { gap: var(--spacing-${size}); }\n`;
  });
  
  // Border utility classes
  Object.entries(designTokens.borders.radius).forEach(([size, value]) => {
    utilityClasses += `.rounded-${size} { border-radius: var(--border-radius-${size}); }\n`;
  });
  
  Object.entries(designTokens.borders.width).forEach(([width, value]) => {
    utilityClasses += `.border-${width} { border-width: var(--border-width-${width}); }\n`;
  });
  
  Object.entries(designTokens.borders.style).forEach(([style, value]) => {
    utilityClasses += `.border-${style} { border-style: var(--border-style-${style}); }\n`;
  });
  
  // Shadow utility classes
  Object.entries(designTokens.shadows).forEach(([name, value]) => {
    utilityClasses += `.shadow-${name} { box-shadow: var(--shadow-${name}); }\n`;
  });
  
  // Z-index utility classes
  Object.entries(designTokens.zIndex).forEach(([name, value]) => {
    utilityClasses += `.z-${name} { z-index: var(--z-index-${name}); }\n`;
  });
  
  // Add the utility classes to the document
  const style = document.createElement('style');
  style.textContent = utilityClasses;
  document.head.appendChild(style);
  
  console.log('EdPsych Connect: Utility classes created');
}

/**
 * Creates a grid system for consistent layouts
 */
function createGridSystem() {
  const gridStyles = `
    .container {
      width: 100%;
      margin-right: auto;
      margin-left: auto;
      padding-right: var(--spacing-4);
      padding-left: var(--spacing-4);
    }
    
    @media (min-width: var(--breakpoint-sm)) {
      .container {
        max-width: 540px;
      }
    }
    
    @media (min-width: var(--breakpoint-md)) {
      .container {
        max-width: 720px;
      }
    }
    
    @media (min-width: var(--breakpoint-lg)) {
      .container {
        max-width: 960px;
      }
    }
    
    @media (min-width: var(--breakpoint-xl)) {
      .container {
        max-width: 1140px;
      }
    }
    
    .container-fluid {
      width: 100%;
      margin-right: auto;
      margin-left: auto;
      padding-right: var(--spacing-4);
      padding-left: var(--spacing-4);
    }
    
    .row {
      display: flex;
      flex-wrap: wrap;
      margin-right: calc(var(--spacing-4) * -1);
      margin-left: calc(var(--spacing-4) * -1);
    }
    
    .col {
      position: relative;
      width: 100%;
      padding-right: var(--spacing-4);
      padding-left: var(--spacing-4);
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
    }
    
    .col-auto {
      position: relative;
      padding-right: var(--spacing-4);
      padding-left: var(--spacing-4);
      flex: 0 0 auto;
      width: auto;
      max-width: 100%;
    }
  `;
  
  // Generate column classes for different breakpoints
  const breakpoints = ['', 'sm-', 'md-', 'lg-', 'xl-'];
  const columns = 12;
  
  let columnClasses = '';
  
  breakpoints.forEach(breakpoint => {
    const mediaQuery = breakpoint ? 
      `@media (min-width: var(--breakpoint-${breakpoint.slice(0, -1)})) {\n` : '';
    const mediaQueryEnd = breakpoint ? '}\n' : '';
    
    columnClasses += mediaQuery;
    
    for (let i = 1; i <= columns; i++) {
      columnClasses += `  .col-${breakpoint}${i} {
    position: relative;
    padding-right: var(--spacing-4);
    padding-left: var(--spacing-4);
    flex: 0 0 ${(i / columns) * 100}%;
    max-width: ${(i / columns) * 100}%;
  }\n`;
    }
    
    columnClasses += mediaQueryEnd;
  });
  
  // Add the grid system to the document
  const style = document.createElement('style');
  style.textContent = gridStyles + columnClasses;
  document.head.appendChild(style);
  
  console.log('EdPsych Connect: Grid system created');
}

/**
 * Creates a component library with standardized elements
 */
function createComponentLibrary() {
  const componentStyles = `
    /* Button Component */
    .btn {
      display: inline-block;
      font-weight: var(--typography-fontWeight-medium);
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      user-select: none;
      border: 1px solid transparent;
      padding: var(--spacing-2) var(--spacing-4);
      font-size: var(--typography-fontSize-base);
      line-height: var(--typography-lineHeight-normal);
      border-radius: var(--border-radius-md);
      transition: color var(--animation-duration-normal) var(--animation-easing-standard),
                  background-color var(--animation-duration-normal) var(--animation-easing-standard),
                  border-color var(--animation-duration-normal) var(--animation-easing-standard),
                  box-shadow var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    .btn:hover {
      text-decoration: none;
    }
    
    .btn:focus {
      outline: 0;
      box-shadow: var(--shadow-outline);
    }
    
    .btn:disabled {
      opacity: 0.65;
      pointer-events: none;
    }
    
    /* Button Variants */
    .btn-primary {
      color: white;
      background-color: var(--color-primary-500);
      border-color: var(--color-primary-500);
    }
    
    .btn-primary:hover {
      background-color: var(--color-primary-600);
      border-color: var(--color-primary-600);
    }
    
    .btn-secondary {
      color: white;
      background-color: var(--color-secondary-500);
      border-color: var(--color-secondary-500);
    }
    
    .btn-secondary:hover {
      background-color: var(--color-secondary-600);
      border-color: var(--color-secondary-600);
    }
    
    .btn-tertiary {
      color: white;
      background-color: var(--color-tertiary-500);
      border-color: var(--color-tertiary-500);
    }
    
    .btn-tertiary:hover {
      background-color: var(--color-tertiary-600);
      border-color: var(--color-tertiary-600);
    }
    
    .btn-outline-primary {
      color: var(--color-primary-500);
      background-color: transparent;
      border-color: var(--color-primary-500);
    }
    
    .btn-outline-primary:hover {
      color: white;
      background-color: var(--color-primary-500);
      border-color: var(--color-primary-500);
    }
    
    /* Button Sizes */
    .btn-sm {
      padding: var(--spacing-1) var(--spacing-2);
      font-size: var(--typography-fontSize-sm);
      border-radius: var(--border-radius-sm);
    }
    
    .btn-lg {
      padding: var(--spacing-3) var(--spacing-6);
      font-size: var(--typography-fontSize-lg);
      border-radius: var(--border-radius-lg);
    }
    
    /* Card Component */
    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      word-wrap: break-word;
      background-color: white;
      background-clip: border-box;
      border: 1px solid var(--color-neutral-200);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-sm);
      transition: box-shadow var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    .card:hover {
      box-shadow: var(--shadow-md);
    }
    
    .card-header {
      padding: var(--spacing-4);
      margin-bottom: 0;
      background-color: var(--color-neutral-50);
      border-bottom: 1px solid var(--color-neutral-200);
      border-top-left-radius: calc(var(--border-radius-lg) - 1px);
      border-top-right-radius: calc(var(--border-radius-lg) - 1px);
    }
    
    .card-body {
      flex: 1 1 auto;
      padding: var(--spacing-4);
    }
    
    .card-footer {
      padding: var(--spacing-4);
      background-color: var(--color-neutral-50);
      border-top: 1px solid var(--color-neutral-200);
      border-bottom-right-radius: calc(var(--border-radius-lg) - 1px);
      border-bottom-left-radius: calc(var(--border-radius-lg) - 1px);
    }
    
    /* Form Components */
    .form-group {
      margin-bottom: var(--spacing-4);
    }
    
    .form-label {
      display: inline-block;
      margin-bottom: var(--spacing-2);
      font-weight: var(--typography-fontWeight-medium);
    }
    
    .form-control {
      display: block;
      width: 100%;
      padding: var(--spacing-2) var(--spacing-3);
      font-size: var(--typography-fontSize-base);
      line-height: var(--typography-lineHeight-normal);
      color: var(--color-neutral-900);
      background-color: white;
      background-clip: padding-box;
      border: 1px solid var(--color-neutral-300);
      border-radius: var(--border-radius-md);
      transition: border-color var(--animation-duration-normal) var(--animation-easing-standard),
                  box-shadow var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    .form-control:focus {
      color: var(--color-neutral-900);
      background-color: white;
      border-color: var(--color-primary-400);
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgba(33, 150, 243, 0.25);
    }
    
    .form-control:disabled,
    .form-control[readonly] {
      background-color: var(--color-neutral-100);
      opacity: 1;
    }
    
    /* Alert Component */
    .alert {
      position: relative;
      padding: var(--spacing-3) var(--spacing-4);
      margin-bottom: var(--spacing-4);
      border: 1px solid transparent;
      border-radius: var(--border-radius-md);
    }
    
    .alert-primary {
      color: var(--color-primary-900);
      background-color: var(--color-primary-100);
      border-color: var(--color-primary-200);
    }
    
    .alert-secondary {
      color: var(--color-secondary-900);
      background-color: var(--color-secondary-100);
      border-color: var(--color-secondary-200);
    }
    
    .alert-success {
      color: var(--color-success-dark);
      background-color: #d4edda;
      border-color: #c3e6cb;
    }
    
    .alert-danger {
      color: var(--color-error-dark);
      background-color: #f8d7da;
      border-color: #f5c6cb;
    }
    
    .alert-warning {
      color: var(--color-warning-dark);
      background-color: #fff3cd;
      border-color: #ffeeba;
    }
    
    .alert-info {
      color: var(--color-info-dark);
      background-color: #d1ecf1;
      border-color: #bee5eb;
    }
    
    /* Badge Component */
    .badge {
      display: inline-block;
      padding: var(--spacing-1) var(--spacing-2);
      font-size: var(--typography-fontSize-xs);
      font-weight: var(--typography-fontWeight-bold);
      line-height: 1;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
      border-radius: var(--border-radius-full);
    }
    
    .badge-primary {
      color: white;
      background-color: var(--color-primary-500);
    }
    
    .badge-secondary {
      color: white;
      background-color: var(--color-secondary-500);
    }
    
    .badge-success {
      color: white;
      background-color: var(--color-success-main);
    }
    
    .badge-danger {
      color: white;
      background-color: var(--color-error-main);
    }
    
    .badge-warning {
      color: var(--color-neutral-900);
      background-color: var(--color-warning-main);
    }
    
    .badge-info {
      color: white;
      background-color: var(--color-info-main);
    }
    
    /* Navigation Component */
    .nav {
      display: flex;
      flex-wrap: wrap;
      padding-left: 0;
      margin-bottom: 0;
      list-style: none;
    }
    
    .nav-link {
      display: block;
      padding: var(--spacing-2) var(--spacing-3);
      text-decoration: none;
      color: var(--color-primary-500);
      transition: color var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    .nav-link:hover,
    .nav-link:focus {
      color: var(--color-primary-700);
      text-decoration: none;
    }
    
    .nav-link.active {
      color: var(--color-primary-700);
      font-weight: var(--typography-fontWeight-medium);
    }
    
    .nav-tabs {
      border-bottom: 1px solid var(--color-neutral-300);
    }
    
    .nav-tabs .nav-link {
      margin-bottom: -1px;
      border: 1px solid transparent;
      border-top-left-radius: var(--border-radius-md);
      border-top-right-radius: var(--border-radius-md);
    }
    
    .nav-tabs .nav-link:hover,
    .nav-tabs .nav-link:focus {
      border-color: var(--color-neutral-200) var(--color-neutral-200) var(--color-neutral-300);
    }
    
    .nav-tabs .nav-link.active {
      color: var(--color-neutral-700);
      background-color: white;
      border-color: var(--color-neutral-300) var(--color-neutral-300) white;
    }
  `;
  
  // Add the component library to the document
  const style = document.createElement('style');
  style.textContent = componentStyles;
  document.head.appendChild(style);
  
  console.log('EdPsych Connect: Component library created');
}

/**
 * Creates a consistent animation system
 */
function createAnimationSystem() {
  const animationStyles = `
    /* Fade Animations */
    .fade-in {
      animation: fadeIn var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    .fade-out {
      animation: fadeOut var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    /* Slide Animations */
    .slide-in-up {
      animation: slideInUp var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    .slide-in-down {
      animation: slideInDown var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    .slide-in-left {
      animation: slideInLeft var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    .slide-in-right {
      animation: slideInRight var(--animation-duration-normal) var(--animation-easing-standard);
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
    
    @keyframes slideInDown {
      from {
        transform: translateY(-20px);
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
    
    @keyframes slideInRight {
      from {
        transform: translateX(20px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    /* Scale Animations */
    .scale-in {
      animation: scaleIn var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    .scale-out {
      animation: scaleOut var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    @keyframes scaleIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    @keyframes scaleOut {
      from {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(0.9);
        opacity: 0;
      }
    }
    
    /* Pulse Animation */
    .pulse {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
    
    /* Bounce Animation */
    .bounce {
      animation: bounce 2s infinite;
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }
    
    /* Spin Animation */
    .spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    /* Transition Classes */
    .transition-all {
      transition-property: all;
      transition-duration: var(--animation-duration-normal);
      transition-timing-function: var(--animation-easing-standard);
    }
    
    .transition-colors {
      transition-property: color, background-color, border-color;
      transition-duration: var(--animation-duration-normal);
      transition-timing-function: var(--animation-easing-standard);
    }
    
    .transition-opacity {
      transition-property: opacity;
      transition-duration: var(--animation-duration-normal);
      transition-timing-function: var(--animation-easing-standard);
    }
    
    .transition-transform {
      transition-property: transform;
      transition-duration: var(--animation-duration-normal);
      transition-timing-function: var(--animation-easing-standard);
    }
    
    /* Duration Modifiers */
    .duration-fastest {
      transition-duration: var(--animation-duration-fastest);
    }
    
    .duration-fast {
      transition-duration: var(--animation-duration-fast);
    }
    
    .duration-normal {
      transition-duration: var(--animation-duration-normal);
    }
    
    .duration-slow {
      transition-duration: var(--animation-duration-slow);
    }
    
    .duration-slowest {
      transition-duration: var(--animation-duration-slowest);
    }
  `;
  
  // Add the animation system to the document
  const style = document.createElement('style');
  style.textContent = animationStyles;
  document.head.appendChild(style);
  
  console.log('EdPsych Connect: Animation system created');
}

/**
 * Applies consistent styling to all platform components
 */
function applyConsistentStyling() {
  // This function would scan the DOM and apply consistent styling to all components
  // For now, we'll just add some base styles
  
  const baseStyles = `
    /* Base Styles */
    html {
      box-sizing: border-box;
      font-size: 16px;
    }
    
    *, *:before, *:after {
      box-sizing: inherit;
    }
    
    body {
      margin: 0;
      font-family: var(--typography-fontFamily-primary);
      font-size: var(--typography-fontSize-base);
      font-weight: var(--typography-fontWeight-regular);
      line-height: var(--typography-lineHeight-normal);
      color: var(--color-neutral-900);
      background-color: var(--color-neutral-100);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0;
      margin-bottom: var(--spacing-4);
      font-family: var(--typography-fontFamily-display);
      font-weight: var(--typography-fontWeight-bold);
      line-height: var(--typography-lineHeight-tight);
      color: var(--color-neutral-900);
    }
    
    h1 {
      font-size: var(--typography-fontSize-5xl);
    }
    
    h2 {
      font-size: var(--typography-fontSize-4xl);
    }
    
    h3 {
      font-size: var(--typography-fontSize-3xl);
    }
    
    h4 {
      font-size: var(--typography-fontSize-2xl);
    }
    
    h5 {
      font-size: var(--typography-fontSize-xl);
    }
    
    h6 {
      font-size: var(--typography-fontSize-lg);
    }
    
    p {
      margin-top: 0;
      margin-bottom: var(--spacing-4);
    }
    
    a {
      color: var(--color-primary-500);
      text-decoration: none;
      background-color: transparent;
      transition: color var(--animation-duration-normal) var(--animation-easing-standard);
    }
    
    a:hover {
      color: var(--color-primary-700);
      text-decoration: underline;
    }
    
    img {
      max-width: 100%;
      height: auto;
      vertical-align: middle;
    }
    
    button {
      cursor: pointer;
    }
    
    /* Utility Classes */
    .text-center {
      text-align: center;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-left {
      text-align: left;
    }
    
    .d-flex {
      display: flex;
    }
    
    .flex-column {
      flex-direction: column;
    }
    
    .justify-content-center {
      justify-content: center;
    }
    
    .justify-content-between {
      justify-content: space-between;
    }
    
    .align-items-center {
      align-items: center;
    }
    
    .w-100 {
      width: 100%;
    }
    
    .h-100 {
      height: 100%;
    }
    
    .position-relative {
      position: relative;
    }
    
    .position-absolute {
      position: absolute;
    }
    
    .d-none {
      display: none;
    }
    
    .d-block {
      display: block;
    }
    
    .d-inline-block {
      display: inline-block;
    }
    
    .overflow-hidden {
      overflow: hidden;
    }
    
    .text-truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;
  
  // Add the base styles to the document
  const style = document.createElement('style');
  style.textContent = baseStyles;
  document.head.appendChild(style);
  
  console.log('EdPsych Connect: Consistent base styling applied');
}

/**
 * Initializes the visual consistency system
 */
function initializeVisualConsistency() {
  initializeDesignTokens();
  createUtilityClasses();
  createGridSystem();
  createComponentLibrary();
  createAnimationSystem();
  applyConsistentStyling();
  
  console.log('EdPsych Connect: Visual consistency system initialized');
}

// Initialize visual consistency when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeVisualConsistency();
});

// Export functions and objects for use in other modules
export {
  designTokens,
  initializeDesignTokens,
  createUtilityClasses,
  createGridSystem,
  createComponentLibrary,
  createAnimationSystem,
  applyConsistentStyling
};
