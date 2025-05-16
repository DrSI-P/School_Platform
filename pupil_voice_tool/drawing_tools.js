/**
 * EdPsych Connect - Pupil Voice Tool
 * Drawing Tools Component for EHCNA Multimodal Communication
 * 
 * This module implements the drawing canvas interface for pupils to express
 * themselves visually during EHCNA processes and other pupil voice activities.
 */

class DrawingTools {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            containerId: options.containerId || 'drawing-tools-container',
            canvasId: options.canvasId || 'drawing-canvas',
            toolbarId: options.toolbarId || 'drawing-toolbar',
            width: options.width || 800,
            height: options.height || 500,
            defaultColor: options.defaultColor || '#3498db',
            defaultTool: options.defaultTool || 'pencil',
            defaultThickness: options.defaultThickness || 3,
            colors: options.colors || [
                '#3498db', // Blue
                '#2ecc71', // Green
                '#9b59b6', // Purple
                '#f1c40f', // Yellow
                '#e74c3c', // Red
                '#e67e22', // Orange
                '#000000', // Black
                '#ffffff'  // White
            ],
            tools: options.tools || ['pencil', 'brush', 'eraser', 'text', 'shapes'],
            shapes: options.shapes || ['line', 'rectangle', 'circle', 'triangle'],
            thicknesses: options.thicknesses || [2, 5, 10],
            prompt: options.prompt || 'Draw your response',
            showExamples: options.showExamples !== undefined ? options.showExamples : true,
            examples: options.examples || [],
            onSave: options.onSave || null,
            onClear: options.onClear || null,
            accessibilityMode: options.accessibilityMode || false,
            voiceCommands: options.voiceCommands !== undefined ? options.voiceCommands : true,
            keyboardShortcuts: options.keyboardShortcuts !== undefined ? options.keyboardShortcuts : true
        };

        // State variables
        this.state = {
            currentTool: this.config.defaultTool,
            currentColor: this.config.defaultColor,
            currentThickness: this.config.defaultThickness,
            currentShape: 'line',
            isDrawing: false,
            lastX: 0,
            lastY: 0,
            history: [],
            historyIndex: -1,
            textInput: null,
            shapeStart: { x: 0, y: 0 }
        };

        // Initialize the component
        this.init();
    }

    /**
     * Initialize the drawing tools component
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
        this.container.classList.add('drawing-tools-container');
        this.container.setAttribute('role', 'application');
        this.container.setAttribute('aria-label', 'Drawing Tools');

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

        // Initialize the canvas
        this.clearCanvas();
    }

    /**
     * Create the user interface
     */
    createUI() {
        // Clear the container
        this.container.innerHTML = '';

        // Create the prompt area
        const promptArea = document.createElement('div');
        promptArea.classList.add('drawing-prompt');
        promptArea.textContent = this.config.prompt;
        this.container.appendChild(promptArea);

        // Create the controls area
        const controlsArea = document.createElement('div');
        controlsArea.classList.add('drawing-controls');
        
        // Create example button if examples are available
        if (this.config.showExamples && this.config.examples.length > 0) {
            const exampleButton = document.createElement('button');
            exampleButton.classList.add('drawing-control-button', 'example-button');
            exampleButton.textContent = 'Show Examples';
            exampleButton.setAttribute('aria-label', 'Show example drawings');
            exampleButton.addEventListener('click', () => this.toggleExamples());
            controlsArea.appendChild(exampleButton);
        }

        // Create save button
        const saveButton = document.createElement('button');
        saveButton.classList.add('drawing-control-button', 'save-button');
        saveButton.textContent = 'Save Drawing';
        saveButton.setAttribute('aria-label', 'Save your drawing');
        saveButton.addEventListener('click', () => this.saveDrawing());
        controlsArea.appendChild(saveButton);

        // Create clear button
        const clearButton = document.createElement('button');
        clearButton.classList.add('drawing-control-button', 'clear-button');
        clearButton.textContent = 'Clear Drawing';
        clearButton.setAttribute('aria-label', 'Clear the canvas and start over');
        clearButton.addEventListener('click', () => this.clearCanvas());
        controlsArea.appendChild(clearButton);

        // Create undo button
        const undoButton = document.createElement('button');
        undoButton.classList.add('drawing-control-button', 'undo-button');
        undoButton.textContent = 'Undo';
        undoButton.setAttribute('aria-label', 'Undo last action');
        undoButton.addEventListener('click', () => this.undo());
        controlsArea.appendChild(undoButton);

        // Create redo button
        const redoButton = document.createElement('button');
        redoButton.classList.add('drawing-control-button', 'redo-button');
        redoButton.textContent = 'Redo';
        redoButton.setAttribute('aria-label', 'Redo last undone action');
        redoButton.addEventListener('click', () => this.redo());
        controlsArea.appendChild(redoButton);

        this.container.appendChild(controlsArea);

        // Create the canvas
        const canvasContainer = document.createElement('div');
        canvasContainer.classList.add('drawing-canvas-container');
        
        const canvas = document.createElement('canvas');
        canvas.id = this.config.canvasId;
        canvas.width = this.config.width;
        canvas.height = this.config.height;
        canvas.classList.add('drawing-canvas');
        canvas.setAttribute('aria-label', 'Drawing canvas');
        canvas.setAttribute('role', 'img');
        
        canvasContainer.appendChild(canvas);
        this.container.appendChild(canvasContainer);
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Create the toolbar
        const toolbar = document.createElement('div');
        toolbar.id = this.config.toolbarId;
        toolbar.classList.add('drawing-toolbar');
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Drawing tools');

        // Create tool buttons
        const toolsContainer = document.createElement('div');
        toolsContainer.classList.add('drawing-tools-section');
        
        this.config.tools.forEach(tool => {
            const toolButton = document.createElement('button');
            toolButton.classList.add('drawing-tool-button', `${tool}-tool`);
            toolButton.setAttribute('data-tool', tool);
            toolButton.setAttribute('aria-label', `${tool} tool`);
            
            // Add icon or text
            const toolIcon = document.createElement('span');
            toolIcon.classList.add('tool-icon', `${tool}-icon`);
            toolButton.appendChild(toolIcon);
            
            // Add tooltip
            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip');
            tooltip.textContent = this.capitalizeFirstLetter(tool);
            toolButton.appendChild(tooltip);
            
            // Set active state for default tool
            if (tool === this.config.defaultTool) {
                toolButton.classList.add('active');
            }
            
            toolButton.addEventListener('click', () => this.selectTool(tool));
            toolsContainer.appendChild(toolButton);
        });
        
        toolbar.appendChild(toolsContainer);

        // Create shapes container if shapes tool is enabled
        if (this.config.tools.includes('shapes')) {
            const shapesContainer = document.createElement('div');
            shapesContainer.classList.add('drawing-shapes-section');
            shapesContainer.style.display = 'none'; // Hidden by default
            
            this.config.shapes.forEach(shape => {
                const shapeButton = document.createElement('button');
                shapeButton.classList.add('drawing-shape-button', `${shape}-shape`);
                shapeButton.setAttribute('data-shape', shape);
                shapeButton.setAttribute('aria-label', `${shape} shape`);
                
                // Add icon or text
                const shapeIcon = document.createElement('span');
                shapeIcon.classList.add('shape-icon', `${shape}-icon`);
                shapeButton.appendChild(shapeIcon);
                
                // Add tooltip
                const tooltip = document.createElement('span');
                tooltip.classList.add('tooltip');
                tooltip.textContent = this.capitalizeFirstLetter(shape);
                shapeButton.appendChild(tooltip);
                
                // Set active state for default shape
                if (shape === 'line') {
                    shapeButton.classList.add('active');
                }
                
                shapeButton.addEventListener('click', () => this.selectShape(shape));
                shapesContainer.appendChild(shapeButton);
            });
            
            toolbar.appendChild(shapesContainer);
            this.shapesContainer = shapesContainer;
        }

        // Create thickness options
        const thicknessContainer = document.createElement('div');
        thicknessContainer.classList.add('drawing-thickness-section');
        
        this.config.thicknesses.forEach(thickness => {
            const thicknessButton = document.createElement('button');
            thicknessButton.classList.add('drawing-thickness-button');
            thicknessButton.setAttribute('data-thickness', thickness);
            thicknessButton.setAttribute('aria-label', `Thickness ${thickness} pixels`);
            
            // Create visual indicator of thickness
            const thicknessIndicator = document.createElement('div');
            thicknessIndicator.classList.add('thickness-indicator');
            thicknessIndicator.style.height = `${thickness}px`;
            thicknessButton.appendChild(thicknessIndicator);
            
            // Set active state for default thickness
            if (thickness === this.config.defaultThickness) {
                thicknessButton.classList.add('active');
            }
            
            thicknessButton.addEventListener('click', () => this.selectThickness(thickness));
            thicknessContainer.appendChild(thicknessButton);
        });
        
        toolbar.appendChild(thicknessContainer);

        // Create color palette
        const colorContainer = document.createElement('div');
        colorContainer.classList.add('drawing-color-section');
        
        this.config.colors.forEach(color => {
            const colorButton = document.createElement('button');
            colorButton.classList.add('drawing-color-button');
            colorButton.setAttribute('data-color', color);
            colorButton.setAttribute('aria-label', `Color ${this.getColorName(color)}`);
            colorButton.style.backgroundColor = color;
            
            // Set active state for default color
            if (color === this.config.defaultColor) {
                colorButton.classList.add('active');
            }
            
            colorButton.addEventListener('click', () => this.selectColor(color));
            colorContainer.appendChild(colorButton);
        });
        
        toolbar.appendChild(colorContainer);
        
        this.container.appendChild(toolbar);

        // Create examples container if examples are available
        if (this.config.showExamples && this.config.examples.length > 0) {
            const examplesContainer = document.createElement('div');
            examplesContainer.classList.add('drawing-examples-container');
            examplesContainer.style.display = 'none'; // Hidden by default
            
            this.config.examples.forEach((example, index) => {
                const exampleItem = document.createElement('div');
                exampleItem.classList.add('drawing-example-item');
                
                const exampleImage = document.createElement('img');
                exampleImage.src = example.url;
                exampleImage.alt = example.description || `Example drawing ${index + 1}`;
                exampleImage.classList.add('drawing-example-image');
                
                const exampleDescription = document.createElement('p');
                exampleDescription.classList.add('drawing-example-description');
                exampleDescription.textContent = example.description || `Example ${index + 1}`;
                
                exampleItem.appendChild(exampleImage);
                exampleItem.appendChild(exampleDescription);
                examplesContainer.appendChild(exampleItem);
            });
            
            this.container.appendChild(examplesContainer);
            this.examplesContainer = examplesContainer;
        }

        // Create status message area for accessibility
        const statusArea = document.createElement('div');
        statusArea.classList.add('drawing-status');
        statusArea.setAttribute('role', 'status');
        statusArea.setAttribute('aria-live', 'polite');
        this.container.appendChild(statusArea);
        this.statusArea = statusArea;
    }

    /**
     * Set up event listeners for the canvas and tools
     */
    setupEventListeners() {
        // Canvas mouse events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
        
        // Canvas touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Prevent scrolling when touching the canvas
        this.canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        this.canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    }

    /**
     * Set up keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only process shortcuts when the drawing tool is focused
            if (!this.container.contains(document.activeElement) && document.activeElement !== document.body) {
                return;
            }
            
            // Ctrl+Z: Undo
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.undo();
            }
            
            // Ctrl+Y: Redo
            if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
            
            // Ctrl+S: Save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveDrawing();
            }
            
            // Escape: Cancel current action or clear text input
            if (e.key === 'Escape') {
                if (this.state.textInput) {
                    this.cancelTextInput();
                }
            }
            
            // Tool shortcuts (when not in text input mode)
            if (!this.state.textInput) {
                // P: Pencil tool
                if (e.key === 'p') {
                    this.selectTool('pencil');
                }
                
                // B: Brush tool
                if (e.key === 'b') {
                    this.selectTool('brush');
                }
                
                // E: Eraser tool
                if (e.key === 'e') {
                    this.selectTool('eraser');
                }
                
                // T: Text tool
                if (e.key === 't') {
                    this.selectTool('text');
                }
                
                // S: Shapes tool
                if (e.key === 's' && !e.ctrlKey) {
                    this.selectTool('shapes');
                }
                
                // 1-3: Thickness
                if (e.key >= '1' && e.key <= '3') {
                    const thicknessIndex = parseInt(e.key) - 1;
                    if (thicknessIndex >= 0 && thicknessIndex < this.config.thicknesses.length) {
                        this.selectThickness(this.config.thicknesses[thicknessIndex]);
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
        voiceButton.classList.add('drawing-voice-command-button');
        voiceButton.textContent = 'Voice Commands';
        voiceButton.setAttribute('aria-label', 'Activate voice commands');
        
        // Add to controls area
        const controlsArea = this.container.querySelector('.drawing-controls');
        controlsArea.appendChild(voiceButton);
        
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
     * Process voice commands
     */
    processVoiceCommand(command) {
        this.updateStatus(`Voice command: "${command}"`);
        
        // Tool commands
        if (command.includes('pencil') || command.includes('pen')) {
            this.selectTool('pencil');
        } else if (command.includes('brush')) {
            this.selectTool('brush');
        } else if (command.includes('eraser') || command.includes('rubber')) {
            this.selectTool('eraser');
        } else if (command.includes('text')) {
            this.selectTool('text');
        } else if (command.includes('shape')) {
            this.selectTool('shapes');
        }
        
        // Shape commands
        else if (command.includes('line')) {
            this.selectTool('shapes');
            this.selectShape('line');
        } else if (command.includes('circle')) {
            this.selectTool('shapes');
            this.selectShape('circle');
        } else if (command.includes('rectangle') || command.includes('square')) {
            this.selectTool('shapes');
            this.selectShape('rectangle');
        } else if (command.includes('triangle')) {
            this.selectTool('shapes');
            this.selectShape('triangle');
        }
        
        // Color commands
        else if (command.includes('blue')) {
            this.selectColor('#3498db');
        } else if (command.includes('green')) {
            this.selectColor('#2ecc71');
        } else if (command.includes('purple')) {
            this.selectColor('#9b59b6');
        } else if (command.includes('yellow')) {
            this.selectColor('#f1c40f');
        } else if (command.includes('red')) {
            this.selectColor('#e74c3c');
        } else if (command.includes('orange')) {
            this.selectColor('#e67e22');
        } else if (command.includes('black')) {
            this.selectColor('#000000');
        } else if (command.includes('white')) {
            this.selectColor('#ffffff');
        }
        
        // Thickness commands
        else if (command.includes('thin') || command.includes('small')) {
            this.selectThickness(this.config.thicknesses[0]);
        } else if (command.includes('medium')) {
            this.selectThickness(this.config.thicknesses[1]);
        } else if (command.includes('thick') || command.includes('large')) {
            this.selectThickness(this.config.thicknesses[2]);
        }
        
        // Action commands
        else if (command.includes('save')) {
            this.saveDrawing();
        } else if (command.includes('clear')) {
            this.clearCanvas();
        } else if (command.includes('undo')) {
            this.undo();
        } else if (command.includes('redo')) {
            this.redo();
        } else if (command.includes('example')) {
            this.toggleExamples();
        } else {
            this.updateStatus(`Command not recognized: "${command}"`);
        }
    }

    /**
     * Set up accessibility features
     */
    setupAccessibilityFeatures() {
        // Add ARIA attributes to canvas
        this.canvas.setAttribute('aria-label', 'Drawing canvas. Use mouse or touch to draw.');
        
        // Add keyboard navigation for the canvas
        this.canvas.setAttribute('tabindex', '0');
        
        // Add keyboard drawing support
        this.canvas.addEventListener('keydown', (e) => {
            // Only process when canvas is focused
            if (document.activeElement !== this.canvas) {
                return;
            }
            
            const step = e.shiftKey ? 10 : 5;
            let x = this.state.lastX;
            let y = this.state.lastY;
            
            // If we haven't drawn yet, start in the center
            if (x === 0 && y === 0) {
                x = this.canvas.width / 2;
                y = this.canvas.height / 2;
                this.state.lastX = x;
                this.state.lastY = y;
                
                // Show a dot at the current position
                this.ctx.fillStyle = this.state.currentColor;
                this.ctx.beginPath();
                this.ctx.arc(x, y, this.state.currentThickness / 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.updateStatus(`Drawing position set to center (${x}, ${y})`);
                return;
            }
            
            // Arrow keys to move and draw
            if (e.key === 'ArrowUp') {
                this.drawLine(x, y, x, y - step);
                this.state.lastY = y - step;
                this.updateStatus(`Drawing line up to (${x}, ${y - step})`);
            } else if (e.key === 'ArrowDown') {
                this.drawLine(x, y, x, y + step);
                this.state.lastY = y + step;
                this.updateStatus(`Drawing line down to (${x}, ${y + step})`);
            } else if (e.key === 'ArrowLeft') {
                this.drawLine(x, y, x - step, y);
                this.state.lastX = x - step;
                this.updateStatus(`Drawing line left to (${x - step}, ${y})`);
            } else if (e.key === 'ArrowRight') {
                this.drawLine(x, y, x + step, y);
                this.state.lastX = x + step;
                this.updateStatus(`Drawing line right to (${x + step}, ${y})`);
            }
            
            // Space to lift/place the pen
            else if (e.key === ' ') {
                // Toggle drawing state
                this.state.isDrawing = !this.state.isDrawing;
                
                if (this.state.isDrawing) {
                    this.updateStatus(`Pen down at (${x}, ${y})`);
                } else {
                    this.updateStatus(`Pen up at (${x}, ${y})`);
                }
            }
        });
        
        // Add instructions for keyboard users
        const instructions = document.createElement('div');
        instructions.classList.add('drawing-keyboard-instructions');
        instructions.innerHTML = `
            <details>
                <summary>Keyboard Instructions</summary>
                <ul>
                    <li>Arrow keys: Draw lines</li>
                    <li>Shift + Arrow keys: Draw longer lines</li>
                    <li>Space: Lift/place pen</li>
                    <li>P: Pencil tool</li>
                    <li>B: Brush tool</li>
                    <li>E: Eraser tool</li>
                    <li>T: Text tool</li>
                    <li>S: Shapes tool</li>
                    <li>1-3: Change thickness</li>
                    <li>Ctrl+Z: Undo</li>
                    <li>Ctrl+Y: Redo</li>
                    <li>Ctrl+S: Save drawing</li>
                </ul>
            </details>
        `;
        
        this.container.appendChild(instructions);
    }

    /**
     * Handle mouse down event
     */
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Save the current canvas state for undo
        this.saveState();
        
        this.state.isDrawing = true;
        this.state.lastX = x;
        this.state.lastY = y;
        
        // Handle different tools
        if (this.state.currentTool === 'text') {
            this.startTextInput(x, y);
        } else if (this.state.currentTool === 'shapes') {
            this.state.shapeStart = { x, y };
        } else {
            // For pencil, brush, eraser - draw a dot at the starting point
            this.drawDot(x, y);
        }
    }

    /**
     * Handle mouse move event
     */
    handleMouseMove(e) {
        if (!this.state.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Handle different tools
        if (this.state.currentTool === 'shapes') {
            // For shapes, we need to redraw the canvas and the shape preview
            this.redrawCanvas();
            this.drawShapePreview(this.state.shapeStart.x, this.state.shapeStart.y, x, y);
        } else if (this.state.currentTool !== 'text') {
            // For pencil, brush, eraser - draw a line from the last position
            this.drawLine(this.state.lastX, this.state.lastY, x, y);
            this.state.lastX = x;
            this.state.lastY = y;
        }
    }

    /**
     * Handle mouse up event
     */
    handleMouseUp(e) {
        if (!this.state.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Handle different tools
        if (this.state.currentTool === 'shapes') {
            // For shapes, draw the final shape
            this.drawShape(this.state.shapeStart.x, this.state.shapeStart.y, x, y);
        } else if (this.state.currentTool !== 'text') {
            // For pencil, brush, eraser - draw the final line segment
            this.drawLine(this.state.lastX, this.state.lastY, x, y);
        }
        
        this.state.isDrawing = false;
        this.state.lastX = 0;
        this.state.lastY = 0;
    }

    /**
     * Handle mouse out event
     */
    handleMouseOut() {
        // When the mouse leaves the canvas, treat it like a mouse up
        if (this.state.isDrawing && this.state.currentTool !== 'text') {
            this.state.isDrawing = false;
        }
    }

    /**
     * Handle touch start event
     */
    handleTouchStart(e) {
        if (e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        
        this.canvas.dispatchEvent(mouseEvent);
    }

    /**
     * Handle touch move event
     */
    handleTouchMove(e) {
        if (e.touches.length !== 1) return;
        
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        
        this.canvas.dispatchEvent(mouseEvent);
    }

    /**
     * Handle touch end event
     */
    handleTouchEnd() {
        const mouseEvent = new MouseEvent('mouseup', {});
        this.canvas.dispatchEvent(mouseEvent);
    }

    /**
     * Draw a dot at the specified position
     */
    drawDot(x, y) {
        this.ctx.beginPath();
        
        if (this.state.currentTool === 'eraser') {
            // For eraser, use destination-out composite operation
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.arc(x, y, this.state.currentThickness * 2, 0, Math.PI * 2);
        } else {
            // For pencil and brush
            this.ctx.globalCompositeOperation = 'source-over';
            
            if (this.state.currentTool === 'brush') {
                // Brush has a larger, softer dot
                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, this.state.currentThickness);
                gradient.addColorStop(0, this.state.currentColor);
                gradient.addColorStop(1, this.getTransparentColor(this.state.currentColor));
                this.ctx.fillStyle = gradient;
                this.ctx.arc(x, y, this.state.currentThickness * 2, 0, Math.PI * 2);
            } else {
                // Pencil has a smaller, harder dot
                this.ctx.fillStyle = this.state.currentColor;
                this.ctx.arc(x, y, this.state.currentThickness / 2, 0, Math.PI * 2);
            }
        }
        
        this.ctx.fill();
        
        // Reset composite operation
        this.ctx.globalCompositeOperation = 'source-over';
    }

    /**
     * Draw a line between two points
     */
    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        
        if (this.state.currentTool === 'eraser') {
            // For eraser, use destination-out composite operation
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineWidth = this.state.currentThickness * 4;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
        } else {
            // For pencil and brush
            this.ctx.globalCompositeOperation = 'source-over';
            
            if (this.state.currentTool === 'brush') {
                // Brush has a larger, softer line
                this.ctx.lineWidth = this.state.currentThickness * 2;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.strokeStyle = this.state.currentColor;
                
                // Add shadow for brush effect
                this.ctx.shadowColor = this.getTransparentColor(this.state.currentColor);
                this.ctx.shadowBlur = this.state.currentThickness;
            } else {
                // Pencil has a smaller, harder line
                this.ctx.lineWidth = this.state.currentThickness;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.strokeStyle = this.state.currentColor;
                this.ctx.shadowBlur = 0;
            }
        }
        
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        // Reset composite operation and shadow
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.shadowBlur = 0;
    }

    /**
     * Draw a shape preview (while dragging)
     */
    drawShapePreview(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.lineWidth = this.state.currentThickness;
        this.ctx.strokeStyle = this.state.currentColor;
        this.ctx.setLineDash([5, 5]); // Dashed line for preview
        
        switch (this.state.currentShape) {
            case 'line':
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                break;
            case 'rectangle':
                this.ctx.rect(x1, y1, x2 - x1, y2 - y1);
                break;
            case 'circle':
                const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                this.ctx.arc(x1, y1, radius, 0, Math.PI * 2);
                break;
            case 'triangle':
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y1);
                this.ctx.lineTo((x1 + x2) / 2, y2);
                this.ctx.closePath();
                break;
        }
        
        this.ctx.stroke();
        this.ctx.setLineDash([]); // Reset to solid line
    }

    /**
     * Draw the final shape
     */
    drawShape(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.lineWidth = this.state.currentThickness;
        this.ctx.strokeStyle = this.state.currentColor;
        this.ctx.setLineDash([]); // Solid line for final shape
        
        switch (this.state.currentShape) {
            case 'line':
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                break;
            case 'rectangle':
                this.ctx.rect(x1, y1, x2 - x1, y2 - y1);
                break;
            case 'circle':
                const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                this.ctx.arc(x1, y1, radius, 0, Math.PI * 2);
                break;
            case 'triangle':
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y1);
                this.ctx.lineTo((x1 + x2) / 2, y2);
                this.ctx.closePath();
                break;
        }
        
        this.ctx.stroke();
    }

    /**
     * Start text input at the specified position
     */
    startTextInput(x, y) {
        // Create text input element
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.classList.add('drawing-text-input');
        textInput.style.position = 'absolute';
        textInput.style.left = `${x + this.canvas.offsetLeft}px`;
        textInput.style.top = `${y + this.canvas.offsetTop}px`;
        textInput.style.color = this.state.currentColor;
        textInput.style.fontSize = `${this.state.currentThickness * 5}px`;
        
        // Add to container
        this.container.appendChild(textInput);
        
        // Focus the input
        textInput.focus();
        
        // Store reference
        this.state.textInput = {
            element: textInput,
            x: x,
            y: y
        };
        
        // Handle enter key
        textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.finalizeTextInput();
            }
        });
        
        // Handle blur (clicking outside)
        textInput.addEventListener('blur', () => {
            this.finalizeTextInput();
        });
    }

    /**
     * Finalize text input and add to canvas
     */
    finalizeTextInput() {
        if (!this.state.textInput) return;
        
        const { element, x, y } = this.state.textInput;
        const text = element.value.trim();
        
        if (text) {
            // Draw text on canvas
            this.ctx.font = `${this.state.currentThickness * 5}px Arial`;
            this.ctx.fillStyle = this.state.currentColor;
            this.ctx.fillText(text, x, y + this.state.currentThickness * 5 / 2);
        }
        
        // Remove input element
        element.remove();
        this.state.textInput = null;
    }

    /**
     * Cancel text input without adding to canvas
     */
    cancelTextInput() {
        if (!this.state.textInput) return;
        
        // Remove input element
        this.state.textInput.element.remove();
        this.state.textInput = null;
    }

    /**
     * Select a drawing tool
     */
    selectTool(tool) {
        // Update state
        this.state.currentTool = tool;
        
        // Update UI
        const toolButtons = this.container.querySelectorAll('.drawing-tool-button');
        toolButtons.forEach(button => {
            if (button.getAttribute('data-tool') === tool) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Show/hide shapes container
        if (this.shapesContainer) {
            this.shapesContainer.style.display = tool === 'shapes' ? 'flex' : 'none';
        }
        
        // Update status for accessibility
        this.updateStatus(`Selected tool: ${tool}`);
        
        // If text input is active, finalize it
        if (this.state.textInput) {
            this.finalizeTextInput();
        }
    }

    /**
     * Select a shape type
     */
    selectShape(shape) {
        // Update state
        this.state.currentShape = shape;
        
        // Update UI
        const shapeButtons = this.container.querySelectorAll('.drawing-shape-button');
        shapeButtons.forEach(button => {
            if (button.getAttribute('data-shape') === shape) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update status for accessibility
        this.updateStatus(`Selected shape: ${shape}`);
    }

    /**
     * Select a color
     */
    selectColor(color) {
        // Update state
        this.state.currentColor = color;
        
        // Update UI
        const colorButtons = this.container.querySelectorAll('.drawing-color-button');
        colorButtons.forEach(button => {
            if (button.getAttribute('data-color') === color) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update status for accessibility
        this.updateStatus(`Selected color: ${this.getColorName(color)}`);
    }

    /**
     * Select a line thickness
     */
    selectThickness(thickness) {
        // Update state
        this.state.currentThickness = thickness;
        
        // Update UI
        const thicknessButtons = this.container.querySelectorAll('.drawing-thickness-button');
        thicknessButtons.forEach(button => {
            if (parseInt(button.getAttribute('data-thickness')) === thickness) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update status for accessibility
        this.updateStatus(`Selected thickness: ${thickness} pixels`);
    }

    /**
     * Toggle examples display
     */
    toggleExamples() {
        if (!this.examplesContainer) return;
        
        const isVisible = this.examplesContainer.style.display !== 'none';
        this.examplesContainer.style.display = isVisible ? 'none' : 'block';
        
        // Update button text
        const exampleButton = this.container.querySelector('.example-button');
        if (exampleButton) {
            exampleButton.textContent = isVisible ? 'Show Examples' : 'Hide Examples';
        }
        
        // Update status for accessibility
        this.updateStatus(isVisible ? 'Examples hidden' : 'Examples shown');
    }

    /**
     * Save the current canvas state for undo/redo
     */
    saveState() {
        // If we're not at the end of the history, truncate it
        if (this.state.historyIndex < this.state.history.length - 1) {
            this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
        }
        
        // Save current state
        this.state.history.push(this.canvas.toDataURL());
        this.state.historyIndex = this.state.history.length - 1;
    }

    /**
     * Undo the last action
     */
    undo() {
        if (this.state.historyIndex <= 0) {
            this.updateStatus('Nothing to undo');
            return;
        }
        
        this.state.historyIndex--;
        this.redrawCanvas();
        this.updateStatus('Undo successful');
    }

    /**
     * Redo the last undone action
     */
    redo() {
        if (this.state.historyIndex >= this.state.history.length - 1) {
            this.updateStatus('Nothing to redo');
            return;
        }
        
        this.state.historyIndex++;
        this.redrawCanvas();
        this.updateStatus('Redo successful');
    }

    /**
     * Redraw the canvas from history
     */
    redrawCanvas() {
        if (this.state.historyIndex < 0 || !this.state.history[this.state.historyIndex]) {
            // Clear canvas if no history
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }
        
        // Load image from history
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = this.state.history[this.state.historyIndex];
    }

    /**
     * Clear the canvas
     */
    clearCanvas() {
        // Ask for confirmation
        if (this.state.history.length > 1) {
            if (!confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
                return;
            }
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Reset history
        this.state.history = [this.canvas.toDataURL()];
        this.state.historyIndex = 0;
        
        // Update status for accessibility
        this.updateStatus('Canvas cleared');
        
        // Call onClear callback if provided
        if (this.config.onClear) {
            this.config.onClear();
        }
    }

    /**
     * Save the drawing
     */
    saveDrawing() {
        // Get canvas data URL
        const dataURL = this.canvas.toDataURL('image/png');
        
        // Call onSave callback if provided
        if (this.config.onSave) {
            this.config.onSave(dataURL);
            this.updateStatus('Drawing saved');
            return;
        }
        
        // Default save behavior: download as PNG
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = dataURL;
        link.click();
        
        this.updateStatus('Drawing downloaded as PNG');
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
     * Get a human-readable name for a color
     */
    getColorName(color) {
        const colorMap = {
            '#3498db': 'Blue',
            '#2ecc71': 'Green',
            '#9b59b6': 'Purple',
            '#f1c40f': 'Yellow',
            '#e74c3c': 'Red',
            '#e67e22': 'Orange',
            '#000000': 'Black',
            '#ffffff': 'White'
        };
        
        return colorMap[color] || color;
    }

    /**
     * Get a transparent version of a color
     */
    getTransparentColor(color) {
        // Convert hex to rgba with 0.5 alpha
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, 0.5)`;
        }
        
        // If already rgba, just change alpha
        if (color.startsWith('rgba')) {
            return color.replace(/[\d\.]+\)$/, '0.5)');
        }
        
        // If rgb, convert to rgba
        if (color.startsWith('rgb')) {
            return color.replace('rgb', 'rgba').replace(')', ', 0.5)');
        }
        
        return color;
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
    module.exports = { DrawingTools };
} else {
    window.DrawingTools = DrawingTools;
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .drawing-tools-container {
        font-family: 'Open Sans', sans-serif;
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .drawing-prompt {
        font-size: 18px;
        margin-bottom: 15px;
        color: #34495e;
    }

    .drawing-controls {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    }

    .drawing-control-button {
        padding: 8px 12px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }

    .drawing-control-button:hover {
        background-color: #2980b9;
    }

    .drawing-control-button:focus {
        outline: 2px solid #9b59b6;
    }

    .drawing-canvas-container {
        position: relative;
        margin-bottom: 15px;
        background-color: white;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .drawing-canvas {
        display: block;
        background-color: white;
        cursor: crosshair;
        max-width: 100%;
        height: auto;
    }

    .drawing-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 15px;
        padding: 10px;
        background-color: #ecf0f1;
        border-radius: 4px;
    }

    .drawing-tools-section,
    .drawing-shapes-section,
    .drawing-thickness-section,
    .drawing-color-section {
        display: flex;
        gap: 5px;
        align-items: center;
    }

    .drawing-tool-button,
    .drawing-shape-button {
        width: 40px;
        height: 40px;
        border: 1px solid #bdc3c7;
        border-radius: 4px;
        background-color: white;
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .drawing-tool-button.active,
    .drawing-shape-button.active {
        background-color: #e0f7fa;
        border-color: #3498db;
    }

    .drawing-tool-button:hover,
    .drawing-shape-button:hover {
        background-color: #f5f5f5;
    }

    .drawing-tool-button:focus,
    .drawing-shape-button:focus {
        outline: 2px solid #9b59b6;
    }

    .tool-icon, .shape-icon {
        width: 24px;
        height: 24px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .pencil-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>');
    }

    .brush-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3v4c0 2-2 4-4 4H2"/><path d="M22 3h-4"/><path d="M6 14c-1.5 1.5-3 3.2-3 5.5 0 2.3 1.9 4.2 4.2 4.2 1.8 0 3.4-1.2 4-2.8"/><path d="M18 3c-1 0-4 3-4 6 0 2 1 3 3 3s5-1 5-3c0-2-1-6-4-6Z"/></svg>');
    }

    .eraser-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>');
    }

    .text-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>');
    }

    .shapes-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3z"/></svg>');
    }

    .line-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"/></svg>');
    }

    .rectangle-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>');
    }

    .circle-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>');
    }

    .triangle-icon {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18L12 4z"/></svg>');
    }

    .tooltip {
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #34495e;
        color: white;
        padding: 5px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s, visibility 0.2s;
        z-index: 10;
    }

    .drawing-tool-button:hover .tooltip,
    .drawing-shape-button:hover .tooltip {
        opacity: 1;
        visibility: visible;
    }

    .drawing-thickness-button {
        width: 40px;
        height: 40px;
        border: 1px solid #bdc3c7;
        border-radius: 4px;
        background-color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .drawing-thickness-button.active {
        background-color: #e0f7fa;
        border-color: #3498db;
    }

    .thickness-indicator {
        width: 20px;
        background-color: #34495e;
        border-radius: 2px;
    }

    .drawing-color-button {
        width: 30px;
        height: 30px;
        border: 1px solid #bdc3c7;
        border-radius: 50%;
        cursor: pointer;
    }

    .drawing-color-button.active {
        box-shadow: 0 0 0 2px #3498db;
    }

    .drawing-text-input {
        position: absolute;
        background: transparent;
        border: 1px dashed #bdc3c7;
        padding: 5px;
        min-width: 100px;
    }

    .drawing-examples-container {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 15px;
        padding: 15px;
        background-color: #ecf0f1;
        border-radius: 4px;
    }

    .drawing-example-item {
        width: 150px;
        text-align: center;
    }

    .drawing-example-image {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        border: 1px solid #bdc3c7;
    }

    .drawing-example-description {
        margin-top: 5px;
        font-size: 14px;
        color: #34495e;
    }

    .drawing-status {
        position: absolute;
        left: -9999px;
        height: 1px;
        width: 1px;
        overflow: hidden;
    }

    .drawing-voice-command-button {
        padding: 8px 12px;
        background-color: #9b59b6;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }

    .drawing-voice-command-button:hover {
        background-color: #8e44ad;
    }

    .drawing-voice-command-button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    .drawing-keyboard-instructions {
        margin-top: 15px;
        font-size: 14px;
        color: #7f8c8d;
    }

    .drawing-keyboard-instructions summary {
        cursor: pointer;
        color: #3498db;
    }

    .drawing-keyboard-instructions ul {
        margin-top: 10px;
        padding-left: 20px;
    }

    /* High contrast mode */
    .high-contrast .drawing-tools-container {
        background-color: black;
        color: white;
    }

    .high-contrast .drawing-canvas {
        background-color: white;
        border: 2px solid yellow;
    }

    .high-contrast .drawing-control-button {
        background-color: black;
        color: white;
        border: 2px solid white;
    }

    .high-contrast .drawing-tool-button,
    .high-contrast .drawing-shape-button,
    .high-contrast .drawing-thickness-button {
        background-color: black;
        border-color: white;
    }

    .high-contrast .tool-icon,
    .high-contrast .shape-icon {
        filter: invert(1);
    }

    /* Responsive styles */
    @media (max-width: 768px) {
        .drawing-tools-container {
            padding: 10px;
        }

        .drawing-toolbar {
            flex-direction: column;
            gap: 10px;
        }

        .drawing-tools-section,
        .drawing-shapes-section,
        .drawing-thickness-section,
        .drawing-color-section {
            justify-content: center;
        }

        .drawing-tool-button,
        .drawing-shape-button,
        .drawing-thickness-button,
        .drawing-color-button {
            width: 36px;
            height: 36px;
        }

        .tooltip {
            display: none;
        }
    }
`;

document.head.appendChild(style);
