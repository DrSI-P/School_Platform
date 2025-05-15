document.addEventListener("DOMContentLoaded", () => {
    const learnerProfileData = JSON.parse(document.getElementById("learnerProfileJson").textContent);
    const allBadgeDefinitions = JSON.parse(document.getElementById("allBadgeDefinitionsJson").textContent);
    const mapNodesData = JSON.parse(document.getElementById("mapNodesJson").textContent);

    // --- Star Collector Game Logic ---
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreDisplay = document.getElementById("score");
    const gameMessage = document.getElementById("gameMessage");
    const startButton = document.getElementById("startGameButton");

    let score = 0;
    let stars = [];
    const starRadius = 15;
    const gameTime = 30; // seconds
    let gameInterval;
    let gameActive = false;

    function drawStar(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, starRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFD700";
        ctx.fill();
        ctx.closePath();
    }

    function spawnStar() {
        if (!gameActive) return;
        const x = Math.random() * (canvas.width - starRadius * 2) + starRadius;
        const y = Math.random() * (canvas.height - starRadius * 2) + starRadius;
        stars.push({ x, y });
        drawStar(x, y);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function updateScore() {
        scoreDisplay.textContent = score;
    }

    function startGame() {
        if (gameActive) return;
        gameActive = true;
        score = 0;
        stars = [];
        updateScore();
        clearCanvas();
        gameMessage.textContent = "Collect the stars!";
        startButton.disabled = true;

        // Spawn initial stars
        for (let i = 0; i < 5; i++) {
            spawnStar();
        }

        // Spawn stars periodically
        const starSpawnInterval = setInterval(() => {
            if (gameActive) spawnStar();
        }, 1000);

        // Game timer
        let timeLeft = gameTime;
        gameInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                endGame(starSpawnInterval);
            }
        }, 1000);
    }

    function endGame(starSpawnInterval) {
        clearInterval(gameInterval);
        clearInterval(starSpawnInterval);
        gameActive = false;
        gameMessage.textContent = `Game Over! You collected ${score} stars.`;
        startButton.disabled = false;
        // Award badge if score is high enough (example)
        if (score >= 10) {
            console.log("Awarding Star Collector Pro badge (simulated)");
            // In a real app, this would trigger a backend call or update learnerProfileData
        }
    }

    canvas.addEventListener("click", (event) => {
        if (!gameActive) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        for (let i = stars.length - 1; i >= 0; i--) {
            const star = stars[i];
            const distance = Math.sqrt((clickX - star.x)**2 + (clickY - star.y)**2);
            if (distance < starRadius) {
                stars.splice(i, 1);
                score++;
                updateScore();
                clearCanvas();
                stars.forEach(s => drawStar(s.x, s.y));
                break;
            }
        }
    });

    if (startButton) {
        startButton.addEventListener("click", startGame);
    }

    // --- Voice Input (Web Speech API) ---
    const goalInput = document.getElementById("learningGoalsInput");
    const micButton = document.getElementById("micButtonGoals");
    const voiceStatus = document.getElementById("voiceStatus");

    if (micButton && goalInput && voiceStatus) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = "en-US";
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            micButton.addEventListener("click", () => {
                if (micButton.classList.contains("listening")) {
                    recognition.stop();
                    micButton.classList.remove("listening");
                    micButton.innerHTML = "🎤";
                    voiceStatus.textContent = "Voice input stopped.";
                } else {
                    recognition.start();
                    micButton.classList.add("listening");
                    micButton.innerHTML = "🛑";
                    voiceStatus.textContent = "Listening...";
                }
            });

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                goalInput.value += (goalInput.value.length > 0 ? " " : "") + transcript;
                voiceStatus.textContent = "Input received.";
            };

            recognition.onspeechend = () => {
                recognition.stop();
                micButton.classList.remove("listening");
                micButton.innerHTML = "🎤";
                voiceStatus.textContent = "Finished listening.";
            };

            recognition.onerror = (event) => {
                voiceStatus.textContent = "Error occurred in recognition: " + event.error;
                micButton.classList.remove("listening");
                micButton.innerHTML = "🎤";
            };

        } else {
            micButton.disabled = true;
            voiceStatus.textContent = "Speech recognition not supported in this browser.";
        }
    } else {
        if (voiceStatus) voiceStatus.textContent = "Voice input elements not found.";
    }

    // --- Text-to-Speech (Web Speech API) ---
    const ttsButtons = document.querySelectorAll(".tts-button");
    if (
        "speechSynthesis" in window &&
        typeof SpeechSynthesisUtterance !== "undefined"
    ) {
        ttsButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const listItem = button.closest("li");
                if (listItem) {
                    let textToSpeak = "";
                    const titleContainer = listItem.querySelector(
                        ".lo-title-container, .content-title-container"
                    );
                    if (titleContainer) {
                        // Get all text nodes within the title container
                        const walker = document.createTreeWalker(
                            titleContainer,
                            NodeFilter.SHOW_TEXT,
                            null,
                            false
                        );
                        let node;
                        while ((node = walker.nextNode())) {
                            textToSpeak += node.nodeValue.trim() + " ";
                        }
                    }
                    textToSpeak = textToSpeak.trim();

                    if (textToSpeak) {
                        const utterance = new SpeechSynthesisUtterance(textToSpeak);
                        utterance.lang = "en-GB"; // Or use a language selector
                        utterance.pitch = 1;
                        utterance.rate = 1;
                        utterance.volume = 1;
                        window.speechSynthesis.speak(utterance);
                        button.disabled = true; // Disable button while speaking
                        utterance.onend = () => {
                            button.disabled = false; // Re-enable when done
                        };
                        utterance.onerror = (event) => {
                            console.error("SpeechSynthesisUtterance.onerror", event);
                            button.disabled = false;
                        };
                    } else {
                        console.warn("No text found to speak for this item.");
                    }
                }
            });
        });
    } else {
        ttsButtons.forEach((button) => {
            button.disabled = true;
            button.title = "TTS not supported in this browser";
        });
        console.warn("Text-to-Speech not supported in this browser.");
    }

    // --- Adventure Map Path Drawing (Example) ---
    const adventureMap = document.querySelector(".adventure-map");
    if (adventureMap && mapNodesData && mapNodesData.length > 1) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.style.position = "absolute";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.zIndex = "1"; // Behind nodes
        svg.style.pointerEvents = "none"; // Allow clicks to pass through

        for (let i = 0; i < mapNodesData.length - 1; i++) {
            const node1 = mapNodesData[i];
            const node2 = mapNodesData[i+1];

            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", node1.position.x + "%");
            line.setAttribute("y1", node1.position.y + "%");
            line.setAttribute("x2", node2.position.x + "%");
            line.setAttribute("y2", node2.position.y + "%");
            line.setAttribute("stroke", "rgba(255, 220, 100, 0.8)"); // Path color
            line.setAttribute("stroke-width", "8");
            line.setAttribute("stroke-linecap", "round");
            svg.appendChild(line);
        }
        adventureMap.insertBefore(svg, adventureMap.firstChild); // Add SVG behind other map elements
    }

    console.log("DALA Interface Script Loaded");
    console.log("Learner Profile:", learnerProfileData);
    console.log("Badge Definitions:", allBadgeDefinitions);
    console.log("Map Nodes:", mapNodesData);
});

