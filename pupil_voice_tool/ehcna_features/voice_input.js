/**
 * EdPsych Connect - Pupil Voice Tool
 * Voice Input Module
 * 
 * This module provides speech-to-text functionality for the Pupil Voice Tool,
 * allowing students who struggle with typing to express themselves through voice.
 * 
 * Features:
 * - Speech recognition with support for different accents and speech patterns
 * - Voice recording and playback
 * - Voice command navigation
 * - Visual feedback during voice input
 * - Fallback mechanisms for browsers without speech recognition support
 */

class VoiceInputManager {
    constructor(options = {}) {
        // Configuration options with defaults
        this.options = {
            language: options.language || 'en-GB',
            continuous: options.continuous || false,
            interimResults: options.interimResults || true,
            maxAlternatives: options.maxAlternatives || 1,
            targetElementId: options.targetElementId || null,
            visualFeedbackElementId: options.visualFeedbackElementId || null,
            autoStart: options.autoStart || false,
            commands: options.commands || {},
            onResult: options.onResult || null,
            onStart: options.onStart || null,
            onEnd: options.onEnd || null,
            onError: options.onError || null,
            onNoMatch: options.onNoMatch || null
        };

        // State variables
        this.isListening = false;
        this.recognition = null;
        this.audioRecorder = null;
        this.audioBlob = null;
        this.targetElement = this.options.targetElementId ? document.getElementById(this.options.targetElementId) : null;
        this.visualFeedbackElement = this.options.visualFeedbackElementId ? document.getElementById(this.options.visualFeedbackElementId) : null;
        
        // Initialize speech recognition if available
        this.initSpeechRecognition();
        
        // Initialize audio recording capabilities
        this.initAudioRecording();
        
        // Auto-start if configured
        if (this.options.autoStart && this.recognition) {
            this.start();
        }
    }

    /**
     * Initialize the speech recognition functionality
     */
    initSpeechRecognition() {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
        
        if (!SpeechRecognition) {
            console.warn('Speech recognition not supported in this browser. Using fallback methods.');
            this.showBrowserSupportMessage();
            return;
        }
        
        // Create recognition instance
        this.recognition = new SpeechRecognition();
        
        // Configure recognition
        this.recognition.lang = this.options.language;
        this.recognition.continuous = this.options.continuous;
        this.recognition.interimResults = this.options.interimResults;
        this.recognition.maxAlternatives = this.options.maxAlternatives;
        
        // Set up grammar for commands if provided
        if (Object.keys(this.options.commands).length > 0 && SpeechGrammarList) {
            const commands = Object.keys(this.options.commands).join(' | ');
            const grammar = `#JSGF V1.0; grammar commands; public <command> = ${commands};`;
            const grammarList = new SpeechGrammarList();
            grammarList.addFromString(grammar, 1);
            this.recognition.grammars = grammarList;
        }
        
        // Set up event handlers
        this.recognition.onresult = (event) => this.handleRecognitionResult(event);
        this.recognition.onstart = () => this.handleRecognitionStart();
        this.recognition.onend = () => this.handleRecognitionEnd();
        this.recognition.onerror = (event) => this.handleRecognitionError(event);
        this.recognition.onnomatch = (event) => this.handleNoMatch(event);
    }
    
    /**
     * Initialize audio recording capabilities
     */
    initAudioRecording() {
        // Check for browser support
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn('Audio recording not supported in this browser.');
            return;
        }
        
        // We'll initialize the actual recorder when needed to avoid unnecessary permission requests
    }
    
    /**
     * Start speech recognition
     */
    start() {
        if (!this.recognition) {
            console.warn('Speech recognition not available.');
            return false;
        }
        
        if (this.isListening) {
            return true; // Already listening
        }
        
        try {
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            if (this.options.onError) {
                this.options.onError(error);
            }
            return false;
        }
    }
    
    /**
     * Stop speech recognition
     */
    stop() {
        if (!this.recognition || !this.isListening) {
            return;
        }
        
        try {
            this.recognition.stop();
        } catch (error) {
            console.error('Error stopping speech recognition:', error);
        }
    }
    
    /**
     * Start recording audio
     */
    startRecording() {
        if (this.audioRecorder) {
            // Already recording or recorder exists
            return;
        }
        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.audioRecorder = new MediaRecorder(stream);
                const audioChunks = [];
                
                this.audioRecorder.addEventListener('dataavailable', event => {
                    audioChunks.push(event.data);
                });
                
                this.audioRecorder.addEventListener('stop', () => {
                    this.audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    this.updateRecordingUI(false);
                    
                    // Create playback controls if needed
                    this.createAudioPlayback();
                });
                
                this.audioRecorder.start();
                this.updateRecordingUI(true);
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
                if (this.options.onError) {
                    this.options.onError(error);
                }
            });
    }
    
    /**
     * Stop recording audio
     */
    stopRecording() {
        if (!this.audioRecorder || this.audioRecorder.state === 'inactive') {
            return;
        }
        
        this.audioRecorder.stop();
        // Release microphone
        this.audioRecorder.stream.getTracks().forEach(track => track.stop());
        this.audioRecorder = null;
    }
    
    /**
     * Create audio playback controls for recorded audio
     */
    createAudioPlayback() {
        if (!this.audioBlob) {
            return;
        }
        
        const audioUrl = URL.createObjectURL(this.audioBlob);
        
        // Create audio element if it doesn't exist
        let audioPlayback = document.getElementById('voice-recording-playback');
        if (!audioPlayback) {
            audioPlayback = document.createElement('audio');
            audioPlayback.id = 'voice-recording-playback';
            audioPlayback.controls = true;
            
            // Add to page
            const container = document.createElement('div');
            container.id = 'voice-recording-container';
            container.className = 'voice-recording-container';
            
            const heading = document.createElement('h3');
            heading.textContent = 'Your Voice Recording';
            
            container.appendChild(heading);
            container.appendChild(audioPlayback);
            
            // Add save button
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save Recording';
            saveButton.className = 'voice-save-button';
            saveButton.addEventListener('click', () => this.saveRecording());
            
            container.appendChild(saveButton);
            
            // Add to page near the target element if possible
            if (this.targetElement) {
                this.targetElement.parentNode.insertBefore(container, this.targetElement.nextSibling);
            } else {
                document.body.appendChild(container);
            }
        }
        
        audioPlayback.src = audioUrl;
    }
    
    /**
     * Save the recorded audio
     */
    saveRecording() {
        if (!this.audioBlob) {
            return;
        }
        
        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(this.audioBlob);
        downloadLink.download = `voice-recording-${new Date().toISOString()}.webm`;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Store in IndexedDB for later retrieval if needed
        this.storeRecording();
    }
    
    /**
     * Store the recording in IndexedDB for later retrieval
     */
    storeRecording() {
        if (!this.audioBlob || !window.indexedDB) {
            return;
        }
        
        const request = indexedDB.open('PupilVoiceDB', 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('recordings')) {
                db.createObjectStore('recordings', { keyPath: 'id', autoIncrement: true });
            }
        };
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['recordings'], 'readwrite');
            const store = transaction.objectStore('recordings');
            
            const recording = {
                timestamp: new Date().toISOString(),
                blob: this.audioBlob,
                duration: this.getAudioDuration(),
                transcription: document.getElementById('voice-recording-playback')?.nextElementSibling?.textContent || ''
            };
            
            store.add(recording);
        };
        
        request.onerror = (event) => {
            console.error('Error opening IndexedDB:', event.target.error);
        };
    }
    
    /**
     * Get the duration of the audio recording
     */
    getAudioDuration() {
        const audio = document.getElementById('voice-recording-playback');
        return audio ? audio.duration : 0;
    }
    
    /**
     * Update the UI to reflect recording state
     */
    updateRecordingUI(isRecording) {
        // Update visual feedback
        if (this.visualFeedbackElement) {
            if (isRecording) {
                this.visualFeedbackElement.classList.add('recording');
                this.visualFeedbackElement.textContent = 'Recording...';
            } else {
                this.visualFeedbackElement.classList.remove('recording');
                this.visualFeedbackElement.textContent = 'Recording complete';
                
                // Auto-hide after a delay
                setTimeout(() => {
                    this.visualFeedbackElement.textContent = '';
                }, 3000);
            }
        }
    }
    
    /**
     * Handle speech recognition results
     */
    handleRecognitionResult(event) {
        let interimTranscript = '';
        let finalTranscript = '';
        
        // Process results
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
                
                // Check for commands
                this.checkForCommands(transcript);
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update target element if provided
        if (this.targetElement) {
            // If it's an input or textarea
            if (this.targetElement.tagName === 'INPUT' || this.targetElement.tagName === 'TEXTAREA') {
                this.targetElement.value = finalTranscript || interimTranscript;
            } else {
                // For other elements
                this.targetElement.textContent = finalTranscript || interimTranscript;
            }
        }
        
        // Update visual feedback
        if (this.visualFeedbackElement) {
            this.visualFeedbackElement.textContent = interimTranscript;
            
            if (finalTranscript) {
                // Briefly show final transcript then clear
                this.visualFeedbackElement.textContent = finalTranscript;
                setTimeout(() => {
                    this.visualFeedbackElement.textContent = '';
                }, 2000);
            }
        }
        
        // Call custom result handler if provided
        if (this.options.onResult) {
            this.options.onResult({
                finalTranscript,
                interimTranscript,
                results: event.results
            });
        }
    }
    
    /**
     * Check if the transcript contains any registered commands
     */
    checkForCommands(transcript) {
        const lowerTranscript = transcript.toLowerCase().trim();
        
        // Check each command
        for (const [command, handler] of Object.entries(this.options.commands)) {
            if (lowerTranscript.includes(command.toLowerCase())) {
                handler(transcript);
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Handle speech recognition start event
     */
    handleRecognitionStart() {
        this.isListening = true;
        
        // Update visual feedback
        if (this.visualFeedbackElement) {
            this.visualFeedbackElement.classList.add('listening');
            this.visualFeedbackElement.textContent = 'Listening...';
        }
        
        // Call custom start handler if provided
        if (this.options.onStart) {
            this.options.onStart();
        }
    }
    
    /**
     * Handle speech recognition end event
     */
    handleRecognitionEnd() {
        this.isListening = false;
        
        // Update visual feedback
        if (this.visualFeedbackElement) {
            this.visualFeedbackElement.classList.remove('listening');
            this.visualFeedbackElement.textContent = '';
        }
        
        // Call custom end handler if provided
        if (this.options.onEnd) {
            this.options.onEnd();
        }
        
        // Restart if continuous mode is enabled
        if (this.options.continuous && this.recognition) {
            this.start();
        }
    }
    
    /**
     * Handle speech recognition error event
     */
    handleRecognitionError(event) {
        console.error('Speech recognition error:', event.error);
        
        // Update visual feedback
        if (this.visualFeedbackElement) {
            this.visualFeedbackElement.classList.add('error');
            
            let errorMessage = 'Error with speech recognition';
            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected';
                    break;
                case 'aborted':
                    errorMessage = 'Speech input aborted';
                    break;
                case 'audio-capture':
                    errorMessage = 'Could not access microphone';
                    break;
                case 'network':
                    errorMessage = 'Network error occurred';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone access denied';
                    break;
                case 'service-not-allowed':
                    errorMessage = 'Speech service not allowed';
                    break;
                case 'bad-grammar':
                    errorMessage = 'Grammar error occurred';
                    break;
                case 'language-not-supported':
                    errorMessage = 'Language not supported';
                    break;
            }
            
            this.visualFeedbackElement.textContent = errorMessage;
            
            // Remove error class after a delay
            setTimeout(() => {
                this.visualFeedbackElement.classList.remove('error');
                this.visualFeedbackElement.textContent = '';
            }, 3000);
        }
        
        // Call custom error handler if provided
        if (this.options.onError) {
            this.options.onError(event);
        }
    }
    
    /**
     * Handle no match event
     */
    handleNoMatch(event) {
        // Update visual feedback
        if (this.visualFeedbackElement) {
            this.visualFeedbackElement.textContent = 'Could not understand speech';
            
            // Clear after a delay
            setTimeout(() => {
                this.visualFeedbackElement.textContent = '';
            }, 2000);
        }
        
        // Call custom no match handler if provided
        if (this.options.onNoMatch) {
            this.options.onNoMatch(event);
        }
    }
    
    /**
     * Show a message about browser support
     */
    showBrowserSupportMessage() {
        const container = document.createElement('div');
        container.className = 'browser-support-message';
        container.innerHTML = `
            <p>Speech recognition is not supported in your browser.</p>
            <p>For the best experience, please use Chrome, Edge, or Safari.</p>
            <p>You can still use the text input or recording features.</p>
        `;
        
        // Add to page near the target element if possible
        if (this.targetElement) {
            this.targetElement.parentNode.insertBefore(container, this.targetElement);
        } else if (this.visualFeedbackElement) {
            this.visualFeedbackElement.parentNode.insertBefore(container, this.visualFeedbackElement);
        } else {
            // Add to body if no better location
            document.body.appendChild(container);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VoiceInputManager };
} else {
    window.VoiceInputManager = VoiceInputManager;
}
