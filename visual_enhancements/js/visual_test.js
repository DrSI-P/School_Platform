/**
 * EdPsych Connect - Visual Enhancement Integration
 * 
 * This file integrates the visual enhancement CSS and JS files into the platform.
 * It creates a test page to verify all visual enhancements are working correctly.
 */

// Create a test HTML page to showcase all visual enhancements
document.addEventListener('DOMContentLoaded', function() {
  // Import CSS files
  const cssFiles = [
    '/visual_enhancements/css/color_system.css',
    '/visual_enhancements/css/typography_system.css',
    '/visual_enhancements/css/component_system.css',
    '/visual_enhancements/css/animation_system.css',
    '/visual_enhancements/css/accessibility_system.css',
    '/visual_enhancements/css/main.css'
  ];
  
  cssFiles.forEach(file => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = file;
    document.head.appendChild(link);
  });
  
  // Import JS files
  const jsFiles = [
    '/visual_enhancements/js/theme_manager.js'
  ];
  
  jsFiles.forEach(file => {
    const script = document.createElement('script');
    script.src = file;
    script.type = 'module';
    document.body.appendChild(script);
  });
  
  // Create test content
  createTestContent();
});

function createTestContent() {
  const testContainer = document.createElement('div');
  testContainer.className = 'container';
  testContainer.innerHTML = `
    <header class="page-header">
      <h1 class="page-title">EdPsych Connect Visual Enhancement Test</h1>
      <p class="page-subtitle">Testing all visual components and accessibility features</p>
    </header>
    
    <main>
      <section class="content-section">
        <h2 class="section-title">Color System</h2>
        <div class="row">
          <div class="col-md-6">
            <h3>Primary Colors</h3>
            <div class="color-sample bg-primary">Primary</div>
            <div class="color-sample bg-primary-light">Primary Light</div>
            <div class="color-sample bg-primary-dark">Primary Dark</div>
          </div>
          <div class="col-md-6">
            <h3>Secondary Colors</h3>
            <div class="color-sample bg-secondary">Secondary</div>
            <div class="color-sample bg-secondary-light">Secondary Light</div>
            <div class="color-sample bg-secondary-dark">Secondary Dark</div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-6">
            <h3>Accent Colors</h3>
            <div class="color-sample bg-accent">Accent</div>
            <div class="color-sample bg-accent-light">Accent Light</div>
            <div class="color-sample bg-accent-dark">Accent Dark</div>
          </div>
          <div class="col-md-6">
            <h3>Semantic Colors</h3>
            <div class="color-sample bg-success">Success</div>
            <div class="color-sample bg-warning">Warning</div>
            <div class="color-sample bg-error">Error</div>
            <div class="color-sample bg-info">Info</div>
          </div>
        </div>
      </section>
      
      <div class="divider"></div>
      
      <section class="content-section">
        <h2 class="section-title">Typography</h2>
        <div class="row">
          <div class="col-md-6">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <h6>Heading 6</h6>
          </div>
          <div class="col-md-6">
            <p class="text-lg">Large paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
            <p>Regular paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
            <p class="text-sm">Small paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p><a href="#">This is a link</a> within a paragraph.</p>
            <p><strong>Bold text</strong> and <em>italic text</em> examples.</p>
            <blockquote>This is a blockquote. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</blockquote>
          </div>
        </div>
      </section>
      
      <div class="divider"></div>
      
      <section class="content-section">
        <h2 class="section-title">Components</h2>
        
        <h3 class="mb-3">Buttons</h3>
        <div class="row mb-4">
          <div class="col-md-6">
            <button class="btn btn-primary mb-2 mr-2">Primary Button</button>
            <button class="btn btn-secondary mb-2 mr-2">Secondary Button</button>
            <button class="btn btn-accent mb-2 mr-2">Accent Button</button>
            <button class="btn btn-outline mb-2 mr-2">Outline Button</button>
            <button class="btn btn-text mb-2 mr-2">Text Button</button>
          </div>
          <div class="col-md-6">
            <button class="btn btn-primary btn-sm mb-2 mr-2">Small Button</button>
            <button class="btn btn-primary mb-2 mr-2">Regular Button</button>
            <button class="btn btn-primary btn-lg mb-2 mr-2">Large Button</button>
            <button class="btn btn-primary btn-xl mb-2 mr-2">Extra Large Button</button>
            <button class="btn btn-primary" disabled>Disabled Button</button>
          </div>
        </div>
        
        <h3 class="mb-3">Cards</h3>
        <div class="row mb-4">
          <div class="col-md-4 mb-3">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title">Card Title</h4>
                <h5 class="card-subtitle">Card Subtitle</h5>
              </div>
              <div class="card-body">
                <p class="card-text">This is a basic card with header, body, and footer.</p>
                <a href="#" class="card-link">Card Link</a>
              </div>
              <div class="card-footer">
                <small>Last updated 3 mins ago</small>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card card-primary">
              <div class="card-body">
                <h4 class="card-title">Primary Card</h4>
                <p class="card-text">This is a primary card with no header or footer.</p>
                <button class="btn btn-primary">Action</button>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card card-secondary">
              <div class="card-body">
                <h4 class="card-title">Secondary Card</h4>
                <p class="card-text">This is a secondary card with no header or footer.</p>
                <button class="btn btn-secondary">Action</button>
              </div>
            </div>
          </div>
        </div>
        
        <h3 class="mb-3">Forms</h3>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="form-group">
              <label for="exampleInput1" class="form-label required">Email address</label>
              <input type="email" class="form-control" id="exampleInput1" placeholder="name@example.com">
              <small class="form-text">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group">
              <label for="exampleInput2" class="form-label">Password</label>
              <input type="password" class="form-control" id="exampleInput2">
            </div>
            <div class="form-group">
              <label for="exampleSelect" class="form-label">Example select</label>
              <select class="form-select" id="exampleSelect">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="exampleTextarea" class="form-label">Example textarea</label>
              <textarea class="form-control" id="exampleTextarea" rows="3"></textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
              </div>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadio1" value="option1" checked>
                <label class="form-check-label" for="exampleRadio1">Default radio</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadio2" value="option2">
                <label class="form-check-label" for="exampleRadio2">Second default radio</label>
              </div>
            </div>
          </div>
        </div>
        
        <h3 class="mb-3">Alerts</h3>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="alert alert-primary mb-2">This is a primary alert.</div>
            <div class="alert alert-secondary mb-2">This is a secondary alert.</div>
          </div>
          <div class="col-md-6">
            <div class="alert alert-success mb-2">This is a success alert.</div>
            <div class="alert alert-warning mb-2">This is a warning alert.</div>
            <div class="alert alert-error mb-2">This is an error alert.</div>
            <div class="alert alert-info mb-2">This is an info alert.</div>
          </div>
        </div>
        
        <h3 class="mb-3">Badges</h3>
        <div class="row mb-4">
          <div class="col-12">
            <span class="badge badge-primary mr-2">Primary</span>
            <span class="badge badge-secondary mr-2">Secondary</span>
            <span class="badge badge-success mr-2">Success</span>
            <span class="badge badge-warning mr-2">Warning</span>
            <span class="badge badge-error mr-2">Error</span>
            <span class="badge badge-info mr-2">Info</span>
          </div>
        </div>
        
        <h3 class="mb-3">Progress Bars</h3>
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="progress mb-3">
              <div class="progress-bar" style="width: 25%"></div>
            </div>
            <div class="progress mb-3">
              <div class="progress-bar" style="width: 50%"></div>
            </div>
            <div class="progress mb-3">
              <div class="progress-bar" style="width: 75%"></div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="progress mb-3">
              <div class="progress-bar progress-bar-striped" style="width: 40%"></div>
            </div>
            <div class="progress mb-3">
              <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 60%"></div>
            </div>
          </div>
        </div>
      </section>
      
      <div class="divider"></div>
      
      <section class="content-section">
        <h2 class="section-title">Animations</h2>
        
        <h3 class="mb-3">Hover Animations</h3>
        <div class="row mb-4">
          <div class="col-md-3 mb-3">
            <div class="card hover-scale">
              <div class="card-body">
                <h4 class="card-title">Scale</h4>
                <p>Hover to see scale effect</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card hover-lift">
              <div class="card-body">
                <h4 class="card-title">Lift</h4>
                <p>Hover to see lift effect</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card hover-glow">
              <div class="card-body">
                <h4 class="card-title">Glow</h4>
                <p>Hover to see glow effect</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card hover-color-shift">
              <div class="card-body">
                <h4 class="card-title">Color Shift</h4>
                <p>Hover to see color shift</p>
              </div>
            </div>
          </div>
        </div>
        
        <h3 class="mb-3">Loading Animations</h3>
        <div class="row mb-4">
          <div class="col-md-3 mb-3 text-center">
            <div class="spinner mb-2"></div>
            <p>Spinner</p>
          </div>
          <div class="col-md-3 mb-3 text-center">
            <div class="spinner-border mb-2"></div>
            <p>Border Spinner</p>
          </div>
          <div class="col-md-3 mb-3 text-center">
            <div class="spinner-grow mb-2"></div>
            <p>Growing Spinner</p>
          </div>
          <div class="col-md-3 mb-3">
            <div class="skeleton-loading" style="height: 100px; border-radius: 8px;"></div>
            <p class="mt-2">Skeleton Loading</p>
          </div>
        </div>
        
        <h3 class="mb-3">Feedback Animations</h3>
        <div class="row mb-4">
          <div class="col-md-3 mb-3 text-center">
            <button class="btn btn-primary" id="successAnimBtn">Success Animation</button>
          </div>
          <div class="col-md-3 mb-3 text-center">
            <button class="btn btn-primary" id="errorAnimBtn">Error Animation</button>
          </div>
          <div class="col-md-3 mb-3 text-center">
            <button class="btn btn-primary" id="notificationAnimBtn">Notification Animation</button>
          </div>
          <div class="col-md-3 mb-3 text-center">
            <button class="btn btn-primary" id="highlightAnimBtn">Highlight Animation</button>
          </div>
        </div>
        
        <div id="animationTarget" class="card p-3 mb-4" style="height: 100px;">
          <p>Animation will appear here when you click a button above</p>
        </div>
      </section>
      
      <div class="divider"></div>
      
      <section class="content-section">
        <h2 class="section-title">Accessibility Features</h2>
        
        <p class="mb-4">This section demonstrates accessibility features. Use the accessibility toolbar in the bottom right corner to toggle different accessibility modes.</p>
        
        <h3 class="mb-3">Keyboard Navigation</h3>
        <div class="row mb-4">
          <div class="col-md-6">
            <p>Try navigating with Tab key:</p>
            <button class="btn btn-primary mb-2 mr-2">Button 1</button>
            <button class="btn btn-primary mb-2 mr-2">Button 2</button>
            <button class="btn btn-primary mb-2 mr-2">Button 3</button>
          </div>
          <div class="col-md-6">
            <p>Skip link (press Tab from page start):</p>
            <div id="main-content" tabindex="-1">
              <p>This is the main content area that can be reached with skip link.</p>
            </div>
          </div>
        </div>
        
        <h3 class="mb-3">Screen Reader Support</h3>
        <div class="row mb-4">
          <div class="col-md-6">
            <button class="btn btn-primary mb-2" aria-label="Refresh content" title="Refresh">
              <span aria-hidden="true">↻</span>
            </button>
            <span class="sr-only">This text is only visible to screen readers</span>
          </div>
          <div class="col-md-6">
            <img src="https://via.placeholder.com/150" alt="Example of an image with proper alt text">
            <p class="mt-2">The image above has proper alt text for screen readers.</p>
          </div>
        </div>
        
        <h3 class="mb-3">High Contrast Mode</h3>
        <div class="row mb-4">
          <div class="col-md-6">
            <p>Toggle high contrast mode in the accessibility toolbar to see how this content adapts.</p>
            <div class="bg-primary p-3 text-white mb-2">Primary background with white text</div>
            <div class="bg-secondary p-3 text-white mb-2">Secondary background with white text</div>
          </div>
          <div class="col-md-6">
            <form>
              <div class="form-group">
                <label for="highContrastInput">Input field:</label>
                <input type="text" class="form-control" id="highContrastInput" placeholder="Test high contrast">
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="highContrastCheck">
                <label class="form-check-label" for="highContrastCheck">Checkbox in high contrast</label>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
    
    <footer class="mt-5 p-4 bg-neutral-100">
      <div class="container">
        <p class="text-center mb-0">EdPsych Connect Visual Enhancement Test Page</p>
      </div>
    </footer>
  `;
  
  document.body.appendChild(testContainer);
  
  // Add custom styles for the test page
  const style = document.createElement('style');
  style.textContent = `
    .color-sample {
      padding: 1rem;
      margin-bottom: 0.5rem;
      border-radius: 0.25rem;
      color: white;
    }
    
    .bg-primary, .bg-primary-dark, .bg-secondary, .bg-secondary-dark, 
    .bg-accent, .bg-accent-dark, .bg-success, .bg-error, .bg-info {
      color: white;
    }
    
    .bg-primary-light, .bg-secondary-light, .bg-accent-light, .bg-warning {
      color: black;
    }
  `;
  document.head.appendChild(style);
  
  // Add event listeners for animation demos
  document.getElementById('successAnimBtn')?.addEventListener('click', function() {
    const target = document.getElementById('animationTarget');
    target.className = 'card p-3 mb-4 success-animation';
    target.innerHTML = '<p>Success animation triggered!</p>';
    setTimeout(() => {
      target.className = 'card p-3 mb-4';
    }, 1000);
  });
  
  document.getElementById('errorAnimBtn')?.addEventListener('click', function() {
    const target = document.getElementById('animationTarget');
    target.className = 'card p-3 mb-4 error-animation';
    target.innerHTML = '<p>Error animation triggered!</p>';
    setTimeout(() => {
      target.className = 'card p-3 mb-4';
    }, 1000);
  });
  
  document.getElementById('notificationAnimBtn')?.addEventListener('click', function() {
    const target = document.getElementById('animationTarget');
    target.className = 'card p-3 mb-4 notification-animation';
    target.innerHTML = '<p>Notification animation triggered!</p>';
    setTimeout(() => {
      target.className = 'card p-3 mb-4';
    }, 1000);
  });
  
  document.getElementById('highlightAnimBtn')?.addEventListener('click', function() {
    const target = document.getElementById('animationTarget');
    target.className = 'card p-3 mb-4 highlight-animation';
    target.innerHTML = '<p>Highlight animation triggered!</p>';
    setTimeout(() => {
      target.className = 'card p-3 mb-4';
    }, 1500);
  });
}
