/**
 * EdPsych Connect - Pupil Voice Tool
 * Platform Integration Module
 * 
 * This module integrates the Pupil Voice Tool with the main EdPsych Connect platform,
 * connecting it with the SENCo module, dashboard, and educator tools.
 * 
 * Features:
 * - API connections to platform services
 * - Data synchronization
 * - Authentication integration
 * - Event handling between modules
 * - Evidence collection for EHCP applications
 * - Integration with Teacher-TA collaboration tools
 */

class PupilVoiceIntegration {
    constructor(options = {}) {
        // Configuration options with defaults
        this.options = {
            apiBaseUrl: options.apiBaseUrl || '/api',
            autoConnect: options.autoConnect !== undefined ? options.autoConnect : true,
            enableDataSync: options.enableDataSync !== undefined ? options.enableDataSync : true,
            syncInterval: options.syncInterval || 60000, // 1 minute
            cacheResponses: options.cacheResponses !== undefined ? options.cacheResponses : true,
            cacheDuration: options.cacheDuration || 3600000, // 1 hour
            debugMode: options.debugMode !== undefined ? options.debugMode : false,
            onConnect: options.onConnect || null,
            onDisconnect: options.onDisconnect || null,
            onError: options.onError || null,
            onSync: options.onSync || null
        };

        // State variables
        this.isConnected = false;
        this.lastSyncTime = null;
        this.syncIntervalId = null;
        this.responseCache = {};
        this.pendingUploads = [];
        this.currentUser = null;
        this.platformModules = {
            senco: null,
            dashboard: null,
            teacherTa: null,
            parentPortal: null
        };
        
        // Initialize
        if (this.options.autoConnect) {
            this.connect();
        }
    }

    /**
     * Connect to the EdPsych Connect platform
     */
    async connect() {
        try {
            // Check if already connected
            if (this.isConnected) {
                this.log('Already connected to platform');
                return true;
            }
            
            // Attempt to connect to platform API
            const response = await this.apiRequest('/connect', 'POST', {
                module: 'pupil-voice-tool',
                version: '1.0.0'
            });
            
            if (response && response.success) {
                this.isConnected = true;
                this.log('Successfully connected to EdPsych Connect platform');
                
                // Get current user information
                await this.getCurrentUser();
                
                // Initialize platform modules
                await this.initializePlatformModules();
                
                // Start data synchronization if enabled
                if (this.options.enableDataSync) {
                    this.startDataSync();
                }
                
                // Call onConnect callback if provided
                if (this.options.onConnect) {
                    this.options.onConnect(response);
                }
                
                return true;
            } else {
                throw new Error(response?.message || 'Failed to connect to platform');
            }
        } catch (error) {
            this.log('Connection error:', error.message, 'error');
            
            // Call onError callback if provided
            if (this.options.onError) {
                this.options.onError(error);
            }
            
            return false;
        }
    }

    /**
     * Disconnect from the EdPsych Connect platform
     */
    async disconnect() {
        try {
            // Check if already disconnected
            if (!this.isConnected) {
                return true;
            }
            
            // Stop data synchronization
            this.stopDataSync();
            
            // Attempt to disconnect from platform API
            const response = await this.apiRequest('/disconnect', 'POST', {
                module: 'pupil-voice-tool'
            });
            
            this.isConnected = false;
            this.log('Disconnected from EdPsych Connect platform');
            
            // Call onDisconnect callback if provided
            if (this.options.onDisconnect) {
                this.options.onDisconnect(response);
            }
            
            return true;
        } catch (error) {
            this.log('Disconnection error:', error.message, 'error');
            
            // Force disconnect on error
            this.isConnected = false;
            this.stopDataSync();
            
            // Call onError callback if provided
            if (this.options.onError) {
                this.options.onError(error);
            }
            
            return false;
        }
    }

    /**
     * Get current user information
     */
    async getCurrentUser() {
        try {
            const response = await this.apiRequest('/user/current', 'GET');
            
            if (response && response.success) {
                this.currentUser = response.user;
                this.log('Current user loaded:', this.currentUser.username);
                return this.currentUser;
            } else {
                throw new Error(response?.message || 'Failed to get current user');
            }
        } catch (error) {
            this.log('Error getting current user:', error.message, 'error');
            return null;
        }
    }

    /**
     * Initialize connections to other platform modules
     */
    async initializePlatformModules() {
        try {
            // Get available modules
            const response = await this.apiRequest('/modules/available', 'GET');
            
            if (response && response.success) {
                const availableModules = response.modules;
                
                // Initialize SENCo module if available
                if (availableModules.includes('senco')) {
                    this.platformModules.senco = await this.initializeSencoModule();
                }
                
                // Initialize dashboard if available
                if (availableModules.includes('dashboard')) {
                    this.platformModules.dashboard = await this.initializeDashboardModule();
                }
                
                // Initialize teacher-TA collaboration if available
                if (availableModules.includes('teacher-ta')) {
                    this.platformModules.teacherTa = await this.initializeTeacherTaModule();
                }
                
                // Initialize parent communication portal if available
                if (availableModules.includes('parent-portal')) {
                    this.platformModules.parentPortal = await this.initializeParentPortalModule();
                }
                
                this.log('Platform modules initialized:', Object.keys(this.platformModules).filter(key => this.platformModules[key] !== null));
                return true;
            } else {
                throw new Error(response?.message || 'Failed to get available modules');
            }
        } catch (error) {
            this.log('Error initializing platform modules:', error.message, 'error');
            return false;
        }
    }

    /**
     * Initialize SENCo module integration
     */
    async initializeSencoModule() {
        try {
            const response = await this.apiRequest('/modules/senco/connect', 'POST', {
                capabilities: ['evidence-collection', 'ehcp-support', 'apdr-cycle']
            });
            
            if (response && response.success) {
                this.log('SENCo module connected');
                
                // Set up event listeners for SENCo module
                this.setupSencoEventListeners();
                
                return {
                    isConnected: true,
                    capabilities: response.capabilities || [],
                    submitEvidence: (studentId, evidence) => this.submitEvidenceToSenco(studentId, evidence),
                    getEhcpRequirements: (studentId) => this.getEhcpRequirements(studentId),
                    getApdrCycleStatus: (studentId) => this.getApdrCycleStatus(studentId)
                };
            } else {
                throw new Error(response?.message || 'Failed to connect to SENCo module');
            }
        } catch (error) {
            this.log('Error connecting to SENCo module:', error.message, 'error');
            return null;
        }
    }

    /**
     * Initialize dashboard module integration
     */
    async initializeDashboardModule() {
        try {
            const response = await this.apiRequest('/modules/dashboard/connect', 'POST', {
                capabilities: ['data-visualization', 'reporting', 'analytics']
            });
            
            if (response && response.success) {
                this.log('Dashboard module connected');
                
                return {
                    isConnected: true,
                    capabilities: response.capabilities || [],
                    sendDataPoint: (category, value, metadata) => this.sendDataPointToDashboard(category, value, metadata),
                    getReportTemplate: (templateId) => this.getDashboardReportTemplate(templateId),
                    generateReport: (templateId, data) => this.generateDashboardReport(templateId, data)
                };
            } else {
                throw new Error(response?.message || 'Failed to connect to dashboard module');
            }
        } catch (error) {
            this.log('Error connecting to dashboard module:', error.message, 'error');
            return null;
        }
    }

    /**
     * Initialize teacher-TA collaboration module integration
     */
    async initializeTeacherTaModule() {
        try {
            const response = await this.apiRequest('/modules/teacher-ta/connect', 'POST', {
                capabilities: ['resource-sharing', 'task-assignment', 'feedback']
            });
            
            if (response && response.success) {
                this.log('Teacher-TA collaboration module connected');
                
                return {
                    isConnected: true,
                    capabilities: response.capabilities || [],
                    shareResource: (resourceData, recipients) => this.shareResourceWithTeacherTa(resourceData, recipients),
                    assignTask: (taskData, assigneeId) => this.assignTaskToTeacherTa(taskData, assigneeId),
                    provideFeedback: (feedbackData, recipientId) => this.provideTeacherTaFeedback(feedbackData, recipientId)
                };
            } else {
                throw new Error(response?.message || 'Failed to connect to teacher-TA module');
            }
        } catch (error) {
            this.log('Error connecting to teacher-TA module:', error.message, 'error');
            return null;
        }
    }

    /**
     * Initialize parent communication portal integration
     */
    async initializeParentPortalModule() {
        try {
            const response = await this.apiRequest('/modules/parent-portal/connect', 'POST', {
                capabilities: ['messaging', 'resource-sharing', 'progress-updates']
            });
            
            if (response && response.success) {
                this.log('Parent communication portal connected');
                
                return {
                    isConnected: true,
                    capabilities: response.capabilities || [],
                    sendMessage: (messageData, parentId) => this.sendParentPortalMessage(messageData, parentId),
                    shareResource: (resourceData, parentId) => this.shareResourceWithParent(resourceData, parentId),
                    sendProgressUpdate: (updateData, parentId) => this.sendParentProgressUpdate(updateData, parentId)
                };
            } else {
                throw new Error(response?.message || 'Failed to connect to parent portal');
            }
        } catch (error) {
            this.log('Error connecting to parent portal:', error.message, 'error');
            return null;
        }
    }

    /**
     * Set up event listeners for SENCo module
     */
    setupSencoEventListeners() {
        // Listen for evidence requests from SENCo module
        window.addEventListener('senco:evidence-request', (event) => {
            const { studentId, requestId, evidenceType } = event.detail;
            this.log(`Evidence request received for student ${studentId}, type: ${evidenceType}`);
            
            // Gather pupil voice evidence
            this.gatherPupilVoiceEvidence(studentId, evidenceType)
                .then(evidence => {
                    // Respond to the request
                    this.submitEvidenceToSenco(studentId, {
                        requestId,
                        evidenceType,
                        data: evidence
                    });
                })
                .catch(error => {
                    this.log('Error gathering evidence:', error.message, 'error');
                });
        });
        
        // Listen for APDR cycle updates
        window.addEventListener('senco:apdr-cycle-update', (event) => {
            const { studentId, cycleStage } = event.detail;
            this.log(`APDR cycle update for student ${studentId}, stage: ${cycleStage}`);
            
            // Update pupil voice tool interface based on APDR cycle stage
            this.updateInterfaceForApdrCycle(studentId, cycleStage);
        });
    }

    /**
     * Gather pupil voice evidence for a student
     */
    async gatherPupilVoiceEvidence(studentId, evidenceType) {
        try {
            // Get stored voice recordings and text inputs
            const recordings = await this.getStoredRecordings(studentId);
            const textInputs = await this.getStoredTextInputs(studentId);
            
            // Format evidence based on type
            let evidence = {
                timestamp: new Date().toISOString(),
                studentId,
                evidenceType,
                recordings: [],
                textResponses: [],
                metadata: {}
            };
            
            // Add recordings if available
            if (recordings && recordings.length > 0) {
                evidence.recordings = recordings.map(recording => ({
                    id: recording.id,
                    timestamp: recording.timestamp,
                    duration: recording.duration,
                    transcription: recording.transcription,
                    url: recording.url || null
                }));
            }
            
            // Add text inputs if available
            if (textInputs && textInputs.length > 0) {
                evidence.textResponses = textInputs.map(input => ({
                    id: input.id,
                    timestamp: input.timestamp,
                    question: input.question,
                    response: input.response
                }));
            }
            
            // Add metadata based on evidence type
            switch (evidenceType) {
                case 'ehcp':
                    evidence.metadata.ehcpSection = 'section-a'; // Student views and aspirations
                    evidence.metadata.format = 'multimedia';
                    break;
                case 'sen-review':
                    evidence.metadata.reviewType = 'termly';
                    evidence.metadata.participationLevel = 'direct';
                    break;
                case 'intervention':
                    evidence.metadata.interventionType = 'pupil-voice';
                    evidence.metadata.stage = 'baseline';
                    break;
                default:
                    evidence.metadata.purpose = 'general';
            }
            
            return evidence;
        } catch (error) {
            this.log('Error gathering pupil voice evidence:', error.message, 'error');
            throw error;
        }
    }

    /**
     * Get stored voice recordings for a student
     */
    async getStoredRecordings(studentId) {
        return new Promise((resolve, reject) => {
            try {
                // Open IndexedDB
                const request = indexedDB.open('PupilVoiceDB', 1);
                
                request.onerror = (event) => {
                    reject(new Error('Error opening database'));
                };
                
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    
                    // Check if recordings store exists
                    if (!db.objectStoreNames.contains('recordings')) {
                        resolve([]);
                        return;
                    }
                    
                    const transaction = db.transaction(['recordings'], 'readonly');
                    const store = transaction.objectStore('recordings');
                    
                    // Get all recordings for the student
                    const recordings = [];
                    
                    // Use a cursor to iterate through all records
                    const cursorRequest = store.openCursor();
                    
                    cursorRequest.onsuccess = (event) => {
                        const cursor = event.target.result;
                        
                        if (cursor) {
                            const recording = cursor.value;
                            
                            // Check if recording belongs to the student
                            if (recording.studentId === studentId) {
                                recordings.push(recording);
                            }
                            
                            cursor.continue();
                        } else {
                            // No more records
                            resolve(recordings);
                        }
                    };
                    
                    cursorRequest.onerror = (event) => {
                        reject(new Error('Error retrieving recordings'));
                    };
                };
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    
                    // Create recordings store if it doesn't exist
                    if (!db.objectStoreNames.contains('recordings')) {
                        db.createObjectStore('recordings', { keyPath: 'id', autoIncrement: true });
                    }
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get stored text inputs for a student
     */
    async getStoredTextInputs(studentId) {
        return new Promise((resolve, reject) => {
            try {
                // Open IndexedDB
                const request = indexedDB.open('PupilVoiceDB', 1);
                
                request.onerror = (event) => {
                    reject(new Error('Error opening database'));
                };
                
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    
                    // Check if textInputs store exists
                    if (!db.objectStoreNames.contains('textInputs')) {
                        resolve([]);
                        return;
                    }
                    
                    const transaction = db.transaction(['textInputs'], 'readonly');
                    const store = transaction.objectStore('textInputs');
                    
                    // Get all text inputs for the student
                    const textInputs = [];
                    
                    // Use a cursor to iterate through all records
                    const cursorRequest = store.openCursor();
                    
                    cursorRequest.onsuccess = (event) => {
                        const cursor = event.target.result;
                        
                        if (cursor) {
                            const textInput = cursor.value;
                            
                            // Check if text input belongs to the student
                            if (textInput.studentId === studentId) {
                                textInputs.push(textInput);
                            }
                            
                            cursor.continue();
                        } else {
                            // No more records
                            resolve(textInputs);
                        }
                    };
                    
                    cursorRequest.onerror = (event) => {
                        reject(new Error('Error retrieving text inputs'));
                    };
                };
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    
                    // Create textInputs store if it doesn't exist
                    if (!db.objectStoreNames.contains('textInputs')) {
                        db.createObjectStore('textInputs', { keyPath: 'id', autoIncrement: true });
                    }
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Submit evidence to SENCo module
     */
    async submitEvidenceToSenco(studentId, evidence) {
        try {
            if (!this.platformModules.senco || !this.platformModules.senco.isConnected) {
                throw new Error('SENCo module not connected');
            }
            
            const response = await this.apiRequest('/modules/senco/evidence/submit', 'POST', {
                studentId,
                evidence
            });
            
            if (response && response.success) {
                this.log(`Evidence submitted to SENCo for student ${studentId}`);
                return true;
            } else {
                throw new Error(response?.message || 'Failed to submit evidence');
            }
        } catch (error) {
            this.log('Error submitting evidence to SENCo:', error.message, 'error');
            
            // Add to pending uploads for later retry
            this.pendingUploads.push({
                type: 'senco-evidence',
                data: { studentId, evidence },
                timestamp: new Date().toISOString()
            });
            
            return false;
        }
    }

    /**
     * Get EHCP requirements for a student
     */
    async getEhcpRequirements(studentId) {
        try {
            if (!this.platformModules.senco || !this.platformModules.senco.isConnected) {
                throw new Error('SENCo module not connected');
            }
            
            // Check cache first if enabled
            if (this.options.cacheResponses) {
                const cacheKey = `ehcp-requirements-${studentId}`;
                const cachedData = this.getCachedResponse(cacheKey);
                
                if (cachedData) {
                    return cachedData;
                }
            }
            
            const response = await this.apiRequest('/modules/senco/ehcp/requirements', 'GET', {
                studentId
            });
            
            if (response && response.success) {
                // Cache the response if enabled
                if (this.options.cacheResponses) {
                    const cacheKey = `ehcp-requirements-${studentId}`;
                    this.cacheResponse(cacheKey, response.requirements);
                }
                
                return response.requirements;
            } else {
                throw new Error(response?.message || 'Failed to get EHCP requirements');
            }
        } catch (error) {
            this.log('Error getting EHCP requirements:', error.message, 'error');
            return null;
        }
    }

    /**
     * Get APDR cycle status for a student
     */
    async getApdrCycleStatus(studentId) {
        try {
            if (!this.platformModules.senco || !this.platformModules.senco.isConnected) {
                throw new Error('SENCo module not connected');
            }
            
            // Check cache first if enabled
            if (this.options.cacheResponses) {
                const cacheKey = `apdr-cycle-${studentId}`;
                const cachedData = this.getCachedResponse(cacheKey);
                
                if (cachedData) {
                    return cachedData;
                }
            }
            
            const response = await this.apiRequest('/modules/senco/apdr/status', 'GET', {
                studentId
            });
            
            if (response && response.success) {
                // Cache the response if enabled
                if (this.options.cacheResponses) {
                    const cacheKey = `apdr-cycle-${studentId}`;
                    this.cacheResponse(cacheKey, response.status);
                }
                
                return response.status;
            } else {
                throw new Error(response?.message || 'Failed to get APDR cycle status');
            }
        } catch (error) {
            this.log('Error getting APDR cycle status:', error.message, 'error');
            return null;
        }
    }

    /**
     * Update interface based on APDR cycle stage
     */
    updateInterfaceForApdrCycle(studentId, cycleStage) {
        // Get the pupil voice interface elements
        const container = document.querySelector('.pupil-voice-container');
        if (!container) {
            return;
        }
        
        // Remove any existing APDR stage classes
        container.classList.remove('apdr-assess', 'apdr-plan', 'apdr-do', 'apdr-review');
        
        // Add the current stage class
        container.classList.add(`apdr-${cycleStage.toLowerCase()}`);
        
        // Update interface elements based on stage
        switch (cycleStage.toLowerCase()) {
            case 'assess':
                // Show assessment-focused questions
                this.showAssessmentQuestions(container, studentId);
                break;
            case 'plan':
                // Show planning-focused questions
                this.showPlanningQuestions(container, studentId);
                break;
            case 'do':
                // Show implementation-focused questions
                this.showImplementationQuestions(container, studentId);
                break;
            case 'review':
                // Show review-focused questions
                this.showReviewQuestions(container, studentId);
                break;
        }
    }

    /**
     * Show assessment-focused questions
     */
    showAssessmentQuestions(container, studentId) {
        // Create or update questions section
        let questionsSection = container.querySelector('.apdr-questions');
        if (!questionsSection) {
            questionsSection = document.createElement('div');
            questionsSection.className = 'apdr-questions';
            container.appendChild(questionsSection);
        }
        
        // Set assessment-focused questions
        questionsSection.innerHTML = `
            <h3>Your Thoughts - Assessment Stage</h3>
            <p>We'd like to understand more about your learning. Please share your thoughts.</p>
            
            <div class="question-item">
                <label for="question1">What subjects or activities do you enjoy most at school?</label>
                <textarea id="question1" data-question-id="assess-1" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question1">Use Voice</button>
            </div>
            
            <div class="question-item">
                <label for="question2">What do you find difficult or challenging at school?</label>
                <textarea id="question2" data-question-id="assess-2" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question2">Use Voice</button>
            </div>
            
            <div class="question-item">
                <label for="question3">How do you feel when you need help with your work?</label>
                <textarea id="question3" data-question-id="assess-3" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question3">Use Voice</button>
            </div>
            
            <button class="submit-button">Save My Thoughts</button>
        `;
        
        // Set up voice input buttons
        this.setupVoiceInputButtons(questionsSection);
        
        // Set up submit button
        const submitButton = questionsSection.querySelector('.submit-button');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.saveStudentResponses(questionsSection, studentId, 'assess');
            });
        }
    }

    /**
     * Show planning-focused questions
     */
    showPlanningQuestions(container, studentId) {
        // Create or update questions section
        let questionsSection = container.querySelector('.apdr-questions');
        if (!questionsSection) {
            questionsSection = document.createElement('div');
            questionsSection.className = 'apdr-questions';
            container.appendChild(questionsSection);
        }
        
        // Set planning-focused questions
        questionsSection.innerHTML = `
            <h3>Your Thoughts - Planning Stage</h3>
            <p>We're making plans to help with your learning. Your ideas are important.</p>
            
            <div class="question-item">
                <label for="question1">What kind of help do you think would work best for you?</label>
                <textarea id="question1" data-question-id="plan-1" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question1">Use Voice</button>
            </div>
            
            <div class="question-item">
                <label for="question2">What are your goals for the next few weeks or months?</label>
                <textarea id="question2" data-question-id="plan-2" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question2">Use Voice</button>
            </div>
            
            <div class="question-item">
                <label for="question3">Who would you like to help you with your learning?</label>
                <textarea id="question3" data-question-id="plan-3" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question3">Use Voice</button>
            </div>
            
            <button class="submit-button">Save My Thoughts</button>
        `;
        
        // Set up voice input buttons
        this.setupVoiceInputButtons(questionsSection);
        
        // Set up submit button
        const submitButton = questionsSection.querySelector('.submit-button');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.saveStudentResponses(questionsSection, studentId, 'plan');
            });
        }
    }

    /**
     * Show implementation-focused questions
     */
    showImplementationQuestions(container, studentId) {
        // Create or update questions section
        let questionsSection = container.querySelector('.apdr-questions');
        if (!questionsSection) {
            questionsSection = document.createElement('div');
            questionsSection.className = 'apdr-questions';
            container.appendChild(questionsSection);
        }
        
        // Set implementation-focused questions
        questionsSection.innerHTML = `
            <h3>Your Thoughts - Doing Stage</h3>
            <p>We're trying new ways to help you learn. Tell us how it's going.</p>
            
            <div class="question-item">
                <label for="question1">How is the extra help working for you so far?</label>
                <textarea id="question1" data-question-id="do-1" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question1">Use Voice</button>
            </div>
            
            <div class="question-item">
                <label for="question2">Is there anything you'd like to change about the help you're getting?</label>
                <textarea id="question2" data-question-id="do-2" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question2">Use Voice</button>
            </div>
            
            <div class="question-item">
                <label for="question3">How do you feel about your progress so far?</label>
                <textarea id="question3" data-question-id="do-3" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question3">Use Voice</button>
            </div>
            
            <button class="submit-button">Save My Thoughts</button>
        `;
        
        // Set up voice input buttons
        this.setupVoiceInputButtons(questionsSection);
        
        // Set up submit button
        const submitButton = questionsSection.querySelector('.submit-button');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.saveStudentResponses(questionsSection, studentId, 'do');
            });
        }
    }

    /**
     * Show review-focused questions
     */
    showReviewQuestions(container, studentId) {
        // Create or update questions section
        let questionsSection = container.querySelector('.apdr-questions');
        if (!questionsSection) {
            questionsSection = document.createElement('div');
            questionsSection.className = 'apdr-questions';
            container.appendChild(questionsSection);
        }
        
        // Set review-focused questions
        questionsSection.innerHTML = `
            <h3>Your Thoughts - Review Stage</h3>
            <p>We want to know how things have been going with your learning support.</p>
            
            <div class="question-item">
                <label for="question1">What has improved for you since we started the extra help?</label>
                <textarea id="question1" data-question-id="review-1" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question1">Use Voice</button>
            </div>
            
            <div class="question-item">
                <label for="question2">What are you still finding difficult?</label>
                <textarea id="question2" data-question-id="review-2" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question2">Use Voice</button>
            </div>
            
            <div class="question-item">
                <label for="question3">What would you like to happen next with your learning?</label>
                <textarea id="question3" data-question-id="review-3" data-student-id="${studentId}"></textarea>
                <button class="voice-input-button" data-target="question3">Use Voice</button>
            </div>
            
            <button class="submit-button">Save My Thoughts</button>
        `;
        
        // Set up voice input buttons
        this.setupVoiceInputButtons(questionsSection);
        
        // Set up submit button
        const submitButton = questionsSection.querySelector('.submit-button');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                this.saveStudentResponses(questionsSection, studentId, 'review');
            });
        }
    }

    /**
     * Set up voice input buttons
     */
    setupVoiceInputButtons(container) {
        const voiceButtons = container.querySelectorAll('.voice-input-button');
        
        voiceButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Check if VoiceInputManager is available
                    if (window.VoiceInputManager) {
                        // Create voice input manager for this element
                        const voiceManager = new window.VoiceInputManager({
                            targetElementId: targetId,
                            visualFeedbackElementId: `${targetId}-feedback`,
                            language: 'en-GB',
                            continuous: false,
                            autoStart: true
                        });
                        
                        // Create feedback element if it doesn't exist
                        let feedbackElement = document.getElementById(`${targetId}-feedback`);
                        if (!feedbackElement) {
                            feedbackElement = document.createElement('div');
                            feedbackElement.id = `${targetId}-feedback`;
                            feedbackElement.className = 'voice-feedback';
                            targetElement.parentNode.insertBefore(feedbackElement, targetElement.nextSibling);
                        }
                        
                        // Update button text
                        button.textContent = 'Recording...';
                        button.disabled = true;
                        
                        // Re-enable button after 10 seconds
                        setTimeout(() => {
                            button.textContent = 'Use Voice';
                            button.disabled = false;
                        }, 10000);
                    } else {
                        alert('Voice input is not available. Please type your response.');
                    }
                }
            });
        });
    }

    /**
     * Save student responses to questions
     */
    async saveStudentResponses(container, studentId, stage) {
        try {
            const questionItems = container.querySelectorAll('.question-item');
            const responses = [];
            
            // Collect responses from each question
            questionItems.forEach(item => {
                const textarea = item.querySelector('textarea');
                if (textarea) {
                    const questionId = textarea.getAttribute('data-question-id');
                    const response = textarea.value.trim();
                    
                    if (response) {
                        responses.push({
                            questionId,
                            response,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            });
            
            // Save responses to IndexedDB
            await this.saveResponsesToDatabase(studentId, stage, responses);
            
            // Submit to SENCo module if connected
            if (this.platformModules.senco && this.platformModules.senco.isConnected) {
                const evidence = {
                    type: 'pupil-voice',
                    stage,
                    responses,
                    timestamp: new Date().toISOString()
                };
                
                await this.submitEvidenceToSenco(studentId, evidence);
            }
            
            // Show success message
            this.showNotification('Your thoughts have been saved successfully!', 'success');
            
            // Send data to dashboard if connected
            if (this.platformModules.dashboard && this.platformModules.dashboard.isConnected) {
                this.sendDataPointToDashboard('pupil-voice-submissions', 1, {
                    studentId,
                    stage,
                    responseCount: responses.length
                });
            }
            
            return true;
        } catch (error) {
            this.log('Error saving student responses:', error.message, 'error');
            this.showNotification('There was a problem saving your responses. Please try again.', 'error');
            return false;
        }
    }

    /**
     * Save responses to IndexedDB
     */
    async saveResponsesToDatabase(studentId, stage, responses) {
        return new Promise((resolve, reject) => {
            try {
                // Open IndexedDB
                const request = indexedDB.open('PupilVoiceDB', 1);
                
                request.onerror = (event) => {
                    reject(new Error('Error opening database'));
                };
                
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    
                    // Check if textInputs store exists
                    if (!db.objectStoreNames.contains('textInputs')) {
                        reject(new Error('Text inputs store not found'));
                        return;
                    }
                    
                    const transaction = db.transaction(['textInputs'], 'readwrite');
                    const store = transaction.objectStore('textInputs');
                    
                    // Save each response
                    let savedCount = 0;
                    
                    responses.forEach(response => {
                        const textInput = {
                            studentId,
                            stage,
                            question: response.questionId,
                            response: response.response,
                            timestamp: response.timestamp
                        };
                        
                        const addRequest = store.add(textInput);
                        
                        addRequest.onsuccess = () => {
                            savedCount++;
                            
                            if (savedCount === responses.length) {
                                resolve(true);
                            }
                        };
                        
                        addRequest.onerror = (event) => {
                            reject(new Error('Error saving response'));
                        };
                    });
                    
                    // If no responses to save
                    if (responses.length === 0) {
                        resolve(true);
                    }
                };
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    
                    // Create textInputs store if it doesn't exist
                    if (!db.objectStoreNames.contains('textInputs')) {
                        db.createObjectStore('textInputs', { keyPath: 'id', autoIncrement: true });
                    }
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Remove from DOM after animation
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Send data point to dashboard
     */
    async sendDataPointToDashboard(category, value, metadata = {}) {
        try {
            if (!this.platformModules.dashboard || !this.platformModules.dashboard.isConnected) {
                throw new Error('Dashboard module not connected');
            }
            
            const response = await this.apiRequest('/modules/dashboard/data-point', 'POST', {
                category,
                value,
                timestamp: new Date().toISOString(),
                source: 'pupil-voice-tool',
                metadata
            });
            
            if (response && response.success) {
                this.log(`Data point sent to dashboard: ${category} = ${value}`);
                return true;
            } else {
                throw new Error(response?.message || 'Failed to send data point');
            }
        } catch (error) {
            this.log('Error sending data point to dashboard:', error.message, 'error');
            
            // Add to pending uploads for later retry
            this.pendingUploads.push({
                type: 'dashboard-data-point',
                data: { category, value, metadata },
                timestamp: new Date().toISOString()
            });
            
            return false;
        }
    }

    /**
     * Get dashboard report template
     */
    async getDashboardReportTemplate(templateId) {
        try {
            if (!this.platformModules.dashboard || !this.platformModules.dashboard.isConnected) {
                throw new Error('Dashboard module not connected');
            }
            
            // Check cache first if enabled
            if (this.options.cacheResponses) {
                const cacheKey = `report-template-${templateId}`;
                const cachedData = this.getCachedResponse(cacheKey);
                
                if (cachedData) {
                    return cachedData;
                }
            }
            
            const response = await this.apiRequest('/modules/dashboard/report-template', 'GET', {
                templateId
            });
            
            if (response && response.success) {
                // Cache the response if enabled
                if (this.options.cacheResponses) {
                    const cacheKey = `report-template-${templateId}`;
                    this.cacheResponse(cacheKey, response.template);
                }
                
                return response.template;
            } else {
                throw new Error(response?.message || 'Failed to get report template');
            }
        } catch (error) {
            this.log('Error getting report template:', error.message, 'error');
            return null;
        }
    }

    /**
     * Generate dashboard report
     */
    async generateDashboardReport(templateId, data) {
        try {
            if (!this.platformModules.dashboard || !this.platformModules.dashboard.isConnected) {
                throw new Error('Dashboard module not connected');
            }
            
            const response = await this.apiRequest('/modules/dashboard/generate-report', 'POST', {
                templateId,
                data,
                timestamp: new Date().toISOString(),
                source: 'pupil-voice-tool'
            });
            
            if (response && response.success) {
                this.log(`Report generated with template: ${templateId}`);
                return response.report;
            } else {
                throw new Error(response?.message || 'Failed to generate report');
            }
        } catch (error) {
            this.log('Error generating report:', error.message, 'error');
            return null;
        }
    }

    /**
     * Share resource with teacher or TA
     */
    async shareResourceWithTeacherTa(resourceData, recipients) {
        try {
            if (!this.platformModules.teacherTa || !this.platformModules.teacherTa.isConnected) {
                throw new Error('Teacher-TA module not connected');
            }
            
            const response = await this.apiRequest('/modules/teacher-ta/share-resource', 'POST', {
                resourceData,
                recipients,
                timestamp: new Date().toISOString(),
                source: 'pupil-voice-tool'
            });
            
            if (response && response.success) {
                this.log(`Resource shared with ${recipients.length} recipients`);
                return true;
            } else {
                throw new Error(response?.message || 'Failed to share resource');
            }
        } catch (error) {
            this.log('Error sharing resource:', error.message, 'error');
            
            // Add to pending uploads for later retry
            this.pendingUploads.push({
                type: 'teacher-ta-resource',
                data: { resourceData, recipients },
                timestamp: new Date().toISOString()
            });
            
            return false;
        }
    }

    /**
     * Assign task to teacher or TA
     */
    async assignTaskToTeacherTa(taskData, assigneeId) {
        try {
            if (!this.platformModules.teacherTa || !this.platformModules.teacherTa.isConnected) {
                throw new Error('Teacher-TA module not connected');
            }
            
            const response = await this.apiRequest('/modules/teacher-ta/assign-task', 'POST', {
                taskData,
                assigneeId,
                timestamp: new Date().toISOString(),
                source: 'pupil-voice-tool'
            });
            
            if (response && response.success) {
                this.log(`Task assigned to user ${assigneeId}`);
                return true;
            } else {
                throw new Error(response?.message || 'Failed to assign task');
            }
        } catch (error) {
            this.log('Error assigning task:', error.message, 'error');
            
            // Add to pending uploads for later retry
            this.pendingUploads.push({
                type: 'teacher-ta-task',
                data: { taskData, assigneeId },
                timestamp: new Date().toISOString()
            });
            
            return false;
        }
    }

    /**
     * Provide feedback to teacher or TA
     */
    async provideTeacherTaFeedback(feedbackData, recipientId) {
        try {
            if (!this.platformModules.teacherTa || !this.platformModules.teacherTa.isConnected) {
                throw new Error('Teacher-TA module not connected');
            }
            
            const response = await this.apiRequest('/modules/teacher-ta/provide-feedback', 'POST', {
                feedbackData,
                recipientId,
                timestamp: new Date().toISOString(),
                source: 'pupil-voice-tool'
            });
            
            if (response && response.success) {
                this.log(`Feedback provided to user ${recipientId}`);
                return true;
            } else {
                throw new Error(response?.message || 'Failed to provide feedback');
            }
        } catch (error) {
            this.log('Error providing feedback:', error.message, 'error');
            
            // Add to pending uploads for later retry
            this.pendingUploads.push({
                type: 'teacher-ta-feedback',
                data: { feedbackData, recipientId },
                timestamp: new Date().toISOString()
            });
            
            return false;
        }
    }

    /**
     * Send message to parent through parent portal
     */
    async sendParentPortalMessage(messageData, parentId) {
        try {
            if (!this.platformModules.parentPortal || !this.platformModules.parentPortal.isConnected) {
                throw new Error('Parent portal not connected');
            }
            
            const response = await this.apiRequest('/modules/parent-portal/send-message', 'POST', {
                messageData,
                parentId,
                timestamp: new Date().toISOString(),
                source: 'pupil-voice-tool'
            });
            
            if (response && response.success) {
                this.log(`Message sent to parent ${parentId}`);
                return true;
            } else {
                throw new Error(response?.message || 'Failed to send message');
            }
        } catch (error) {
            this.log('Error sending message to parent:', error.message, 'error');
            
            // Add to pending uploads for later retry
            this.pendingUploads.push({
                type: 'parent-message',
                data: { messageData, parentId },
                timestamp: new Date().toISOString()
            });
            
            return false;
        }
    }

    /**
     * Share resource with parent through parent portal
     */
    async shareResourceWithParent(resourceData, parentId) {
        try {
            if (!this.platformModules.parentPortal || !this.platformModules.parentPortal.isConnected) {
                throw new Error('Parent portal not connected');
            }
            
            const response = await this.apiRequest('/modules/parent-portal/share-resource', 'POST', {
                resourceData,
                parentId,
                timestamp: new Date().toISOString(),
                source: 'pupil-voice-tool'
            });
            
            if (response && response.success) {
                this.log(`Resource shared with parent ${parentId}`);
                return true;
            } else {
                throw new Error(response?.message || 'Failed to share resource');
            }
        } catch (error) {
            this.log('Error sharing resource with parent:', error.message, 'error');
            
            // Add to pending uploads for later retry
            this.pendingUploads.push({
                type: 'parent-resource',
                data: { resourceData, parentId },
                timestamp: new Date().toISOString()
            });
            
            return false;
        }
    }

    /**
     * Send progress update to parent through parent portal
     */
    async sendParentProgressUpdate(updateData, parentId) {
        try {
            if (!this.platformModules.parentPortal || !this.platformModules.parentPortal.isConnected) {
                throw new Error('Parent portal not connected');
            }
            
            const response = await this.apiRequest('/modules/parent-portal/progress-update', 'POST', {
                updateData,
                parentId,
                timestamp: new Date().toISOString(),
                source: 'pupil-voice-tool'
            });
            
            if (response && response.success) {
                this.log(`Progress update sent to parent ${parentId}`);
                return true;
            } else {
                throw new Error(response?.message || 'Failed to send progress update');
            }
        } catch (error) {
            this.log('Error sending progress update to parent:', error.message, 'error');
            
            // Add to pending uploads for later retry
            this.pendingUploads.push({
                type: 'parent-progress',
                data: { updateData, parentId },
                timestamp: new Date().toISOString()
            });
            
            return false;
        }
    }

    /**
     * Start data synchronization
     */
    startDataSync() {
        // Stop existing sync if running
        this.stopDataSync();
        
        // Start new sync interval
        this.syncIntervalId = setInterval(() => {
            this.syncData();
        }, this.options.syncInterval);
        
        this.log(`Data sync started with interval: ${this.options.syncInterval}ms`);
    }

    /**
     * Stop data synchronization
     */
    stopDataSync() {
        if (this.syncIntervalId) {
            clearInterval(this.syncIntervalId);
            this.syncIntervalId = null;
            this.log('Data sync stopped');
        }
    }

    /**
     * Synchronize data with platform
     */
    async syncData() {
        try {
            if (!this.isConnected) {
                throw new Error('Not connected to platform');
            }
            
            // Process any pending uploads
            await this.processPendingUploads();
            
            // Sync local data with platform
            const response = await this.apiRequest('/sync', 'POST', {
                module: 'pupil-voice-tool',
                lastSyncTime: this.lastSyncTime
            });
            
            if (response && response.success) {
                this.lastSyncTime = new Date().toISOString();
                this.log(`Data synchronized successfully at ${this.lastSyncTime}`);
                
                // Call onSync callback if provided
                if (this.options.onSync) {
                    this.options.onSync(response);
                }
                
                return true;
            } else {
                throw new Error(response?.message || 'Sync failed');
            }
        } catch (error) {
            this.log('Sync error:', error.message, 'error');
            return false;
        }
    }

    /**
     * Process pending uploads
     */
    async processPendingUploads() {
        if (this.pendingUploads.length === 0) {
            return;
        }
        
        this.log(`Processing ${this.pendingUploads.length} pending uploads`);
        
        // Process each pending upload
        const successfulUploads = [];
        
        for (const upload of this.pendingUploads) {
            try {
                let success = false;
                
                switch (upload.type) {
                    case 'senco-evidence':
                        success = await this.submitEvidenceToSenco(upload.data.studentId, upload.data.evidence);
                        break;
                    case 'dashboard-data-point':
                        success = await this.sendDataPointToDashboard(upload.data.category, upload.data.value, upload.data.metadata);
                        break;
                    case 'teacher-ta-resource':
                        success = await this.shareResourceWithTeacherTa(upload.data.resourceData, upload.data.recipients);
                        break;
                    case 'teacher-ta-task':
                        success = await this.assignTaskToTeacherTa(upload.data.taskData, upload.data.assigneeId);
                        break;
                    case 'teacher-ta-feedback':
                        success = await this.provideTeacherTaFeedback(upload.data.feedbackData, upload.data.recipientId);
                        break;
                    case 'parent-message':
                        success = await this.sendParentPortalMessage(upload.data.messageData, upload.data.parentId);
                        break;
                    case 'parent-resource':
                        success = await this.shareResourceWithParent(upload.data.resourceData, upload.data.parentId);
                        break;
                    case 'parent-progress':
                        success = await this.sendParentProgressUpdate(upload.data.updateData, upload.data.parentId);
                        break;
                }
                
                if (success) {
                    successfulUploads.push(upload);
                }
            } catch (error) {
                this.log(`Error processing pending upload (${upload.type}):`, error.message, 'error');
            }
        }
        
        // Remove successful uploads from pending list
        this.pendingUploads = this.pendingUploads.filter(upload => !successfulUploads.includes(upload));
        
        this.log(`Processed ${successfulUploads.length} pending uploads, ${this.pendingUploads.length} remaining`);
    }

    /**
     * Make API request to platform
     */
    async apiRequest(endpoint, method = 'GET', data = null) {
        try {
            // In a real implementation, this would make actual HTTP requests
            // For this prototype, we'll simulate API responses
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Log the request
            this.log(`API ${method} ${endpoint}`, data ? JSON.stringify(data) : '');
            
            // Simulate responses based on endpoint
            switch (endpoint) {
                case '/connect':
                    return { success: true, message: 'Connected successfully' };
                
                case '/disconnect':
                    return { success: true, message: 'Disconnected successfully' };
                
                case '/user/current':
                    return {
                        success: true,
                        user: {
                            id: '12345',
                            username: 'student_user',
                            role: 'student',
                            displayName: 'Student User'
                        }
                    };
                
                case '/modules/available':
                    return {
                        success: true,
                        modules: ['senco', 'dashboard', 'teacher-ta', 'parent-portal']
                    };
                
                case '/modules/senco/connect':
                    return {
                        success: true,
                        capabilities: ['evidence-collection', 'ehcp-support', 'apdr-cycle']
                    };
                
                case '/modules/dashboard/connect':
                    return {
                        success: true,
                        capabilities: ['data-visualization', 'reporting', 'analytics']
                    };
                
                case '/modules/teacher-ta/connect':
                    return {
                        success: true,
                        capabilities: ['resource-sharing', 'task-assignment', 'feedback']
                    };
                
                case '/modules/parent-portal/connect':
                    return {
                        success: true,
                        capabilities: ['messaging', 'resource-sharing', 'progress-updates']
                    };
                
                case '/sync':
                    return {
                        success: true,
                        message: 'Sync completed successfully',
                        updates: []
                    };
                
                default:
                    // For other endpoints, return generic success
                    return { success: true };
            }
        } catch (error) {
            this.log('API request error:', error.message, 'error');
            throw error;
        }
    }

    /**
     * Cache API response
     */
    cacheResponse(key, data) {
        this.responseCache[key] = {
            data,
            timestamp: Date.now()
        };
    }

    /**
     * Get cached API response
     */
    getCachedResponse(key) {
        const cached = this.responseCache[key];
        
        if (!cached) {
            return null;
        }
        
        // Check if cache has expired
        const now = Date.now();
        if (now - cached.timestamp > this.options.cacheDuration) {
            delete this.responseCache[key];
            return null;
        }
        
        return cached.data;
    }

    /**
     * Log message to console
     */
    log(message, ...args) {
        if (this.options.debugMode) {
            const timestamp = new Date().toISOString();
            console.log(`[PupilVoiceIntegration ${timestamp}] ${message}`, ...args);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PupilVoiceIntegration };
} else {
    window.PupilVoiceIntegration = PupilVoiceIntegration;
}
