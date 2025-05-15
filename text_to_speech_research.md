# Research on Client-Side Text-to-Speech (TTS) Solutions

**Date:** May 15, 2025

**Objective:** To research and select a suitable client-side JavaScript library or API for implementing text-to-speech (TTS) functionality in the EdPsych Connect DALA student interface. This feature aims to enhance accessibility and user experience.

## 1. Key Selection Criteria

The following criteria will be used to evaluate potential TTS solutions:

1.  **Voice Quality & Naturalness:**
    *   Clarity and intelligibility of the generated speech.
    *   Natural-sounding voices, avoiding overly robotic tones.
    *   Availability of UK English voices.
    *   Preference for child-friendly or adaptable voices if possible.
2.  **Browser Compatibility:**
    *   Robust support across major modern browsers (Chrome, Firefox, Safari, Edge).
3.  **Ease of Integration:**
    *   Simplicity of integrating into the existing HTML/JavaScript structure of the DALA interface.
    *   Clear and comprehensive API documentation.
4.  **Cost & Licensing:**
    *   Strong preference for free, open-source solutions.
    *   If commercial, must have a clear and affordable licensing model suitable for the project.
5.  **Privacy:**
    *   Preference for solutions that perform processing entirely client-side to protect student data and ensure offline capability where possible.
    *   If server-side processing is involved, privacy implications must be carefully considered.
6.  **Control & Customization:**
    *   Ability to control speech parameters such as rate, pitch, and volume.
    *   Ability to select different voices if multiple are available.
    *   Support for pausing, resuming, and stopping speech.
7.  **Text Highlighting (Synchronization):**
    *   Ability to synchronize speech output with text highlighting on the page (i.e., highlight words as they are spoken). This is a highly desirable feature for accessibility and engagement.
8.  **Performance & Responsiveness:**
    *   Low latency in initiating speech.
    *   Minimal impact on overall page performance.
9.  **Community Support & Maintenance:**
    *   Active development community or good track record of maintenance for libraries.
    *   Availability of examples, tutorials, and community forums for troubleshooting.

## 2. Potential Solutions to Investigate

Based on initial knowledge, the following will be primary areas of investigation:

*   **Web Speech API (`SpeechSynthesis` interface):** This is the browser-native API for speech synthesis. Its capabilities, browser support, and voice quality across different browsers will be a key focus.
*   **Standalone JavaScript Libraries:** Research will be conducted to identify popular and well-regarded open-source or permissively licensed JavaScript libraries that offer TTS functionality, potentially with advantages over the native API (e.g., better voice quality, easier highlighting).
    *   Examples might include libraries like `speak-tts`, `responsivevoice.js` (though licensing needs careful checking), or others found through targeted searches.
*   **Cloud-based APIs with JS SDKs (Secondary consideration):** While client-side is preferred, some cloud APIs (e.g., Google Cloud Text-to-Speech, Amazon Polly) offer JavaScript SDKs. These will be considered as secondary options if client-side solutions are found lacking, with a strong focus on privacy and cost implications.

Next steps will involve detailed investigation of these options against the criteria above.




## 3. Evaluation of Potential Solutions

### 3.1. Web Speech API (`SpeechSynthesis`)

*   **Voice Quality & Naturalness:**
    *   Quality varies significantly between browsers and operating systems, as it relies on the voices installed on the user's system or provided by the browser vendor.
    *   UK English voices are generally available (e.g., Daniel, Kate, Serena on macOS/iOS; Microsoft David/Zira/Hazel on Windows; Google UK English Male/Female on Chrome/Android).
    *   Some voices can sound robotic, while others are quite natural. Child-friendly voices are not explicitly guaranteed and depend on the OS/browser.
*   **Browser Compatibility:**
    *   Good support across modern desktop browsers: Chrome (33+), Edge (14+), Firefox (49+), Safari (7+), Opera (21+).
    *   Good support on mobile: Chrome for Android (33+), Safari on iOS (7+), Firefox for Android (49+).
    *   Notably, Opera Android and WebView Android have no or limited support according to caniuse.com and MDN, which could be a concern if targeting these platforms extensively.
*   **Ease of Integration:**
    *   Relatively straightforward to integrate using native JavaScript. The API is well-documented on MDN.
    *   Core methods like `speak()`, `pause()`, `resume()`, `cancel()`, and `getVoices()` are easy to use.
*   **Cost & Licensing:**
    *   Free to use as it's a built-in browser API.
*   **Privacy:**
    *   Generally processed client-side, but some browsers/voices might offload processing to a server (e.g., Google Chrome's network-based voices). This is not always transparent to the developer or user.
*   **Control & Customization:**
    *   Allows control over `rate`, `pitch`, and `volume` via the `SpeechSynthesisUtterance` object.
    *   Allows selection from available voices (`SpeechSynthesis.getVoices()`).
    *   Supports `pause()`, `resume()`, and `cancel()` methods.
*   **Text Highlighting (Synchronization):**
    *   The API provides `boundary` and `mark` events on the `SpeechSynthesisUtterance` object. The `boundary` event can be used to get word or sentence boundaries as they are spoken, enabling text highlighting. This requires custom JavaScript logic to implement.
*   **Performance & Responsiveness:**
    *   Generally good, but can be affected by the voice quality and whether processing is local or server-based.
    *   `getVoices()` can be asynchronous and might require waiting for the `voiceschanged` event initially.
*   **Community Support & Maintenance:**
    *   As a web standard, it's maintained by browser vendors. MDN provides excellent documentation.

**Limitations/Concerns for EdPsych Connect:**
*   Inconsistent voice quality and availability across platforms.
*   Potential privacy concerns with server-side processing in some browsers.
*   Text highlighting requires manual implementation.

### 3.2. Standalone JavaScript Libraries

#### 3.2.1. react-speech-highlight-demo (albirrkarim/react-speech-highlight-demo)

*   **Initial Assessment based on GitHub README:**
    *   **Focus:** Specifically designed for text-to-speech with real-time word/sentence highlighting.
    *   **Underlying TTS:** Appears to use the browser's native `SpeechSynthesis` API but provides a higher-level abstraction and built-in highlighting.
    *   **Framework:** Provides React components but also mentions 

Vanilla JS support, which is relevant for our current non-React setup.
    *   **Highlighting:** This is a core feature, which is a significant plus.
    *   **Voice Quality & Control:** Likely inherits these from the underlying `SpeechSynthesis` API, so the same variabilities and controls would apply.
    *   **Cost & Licensing:** Appears to be MIT licensed (based on typical open-source React libraries, but needs verification if not explicitly stated on the GitHub page).
    *   **Privacy:** Same as Web Speech API.

#### 3.2.2. Talkify (Hagsten/Talkify)

*   **Initial Assessment based on GitHub README & Website (if browsed):
    *   **Focus:** Aims to provide high-quality TTS voices in many languages.
    *   **Underlying TTS:** It's a commercial service that likely uses its own backend for voice generation, or premium cloud voices, and provides a JS library for integration.
    *   **Voice Quality:** Claims high quality, which would be an advantage over potentially inconsistent native voices.
    *   **Cost & Licensing:** This is a key point. The GitHub page mentions "To use our full API you need an API key." This implies a commercial model. Pricing and free tier limitations (if any) need to be investigated from their website.
    *   **Privacy:** If it uses a backend service, all text is sent to their servers, which has privacy implications.
    *   **Highlighting:** Need to check if this is a built-in feature.

#### 3.2.3. ResponsiveVoice.JS

*   **Initial Assessment based on Website:**
    *   **Focus:** Easy-to-integrate TTS for websites, with a wide range of languages and voices.
    *   **Voice Quality:** Claims good quality voices.
    *   **Cost & Licensing:** This is critical. ResponsiveVoice.js has free and commercial plans. The free version often has limitations (e.g., attribution requirements, non-commercial use only, or limited characters/requests). The exact terms for free use and the cost of commercial plans need careful review to see if it fits the project's needs and budget.
    *   **Privacy:** Likely involves sending text to their servers for processing.
    *   **Highlighting:** Need to check if this is a built-in feature or easily implementable.

### 3.3. Cloud-based APIs with JS SDKs (Brief Consideration)

*   **Examples:** Google Cloud Text-to-Speech, Amazon Polly, Microsoft Azure Cognitive Services Speech.
*   **Voice Quality:** Generally excellent, often state-of-the-art, with many natural-sounding voices and options (e.g., neural voices).
*   **Cost & Licensing:** These are commercial services, typically priced per character or per request. While they often have free tiers, these might be insufficient for a platform like EdPsych Connect in the long run. Costs can escalate with usage.
*   **Privacy:** All text data is sent to the cloud provider's servers, which raises significant privacy concerns, especially with children's data. Data handling policies of these providers would need thorough review.
*   **Ease of Integration:** JS SDKs are usually provided, but integration might be more complex than a simple client-side library due to authentication and API request management.
*   **Highlighting:** Some SDKs or APIs might provide word timing information, but highlighting would still likely require custom implementation.

**Conclusion for Cloud APIs:** Due to strong preference for client-side processing for privacy and potential cost concerns, these are less favored unless client-side options prove entirely inadequate for voice quality or essential features.




## 4. Recommendation

Based on the evaluation against the selection criteria, and prioritizing privacy, cost-effectiveness, client-side processing, and the potential for text highlighting, the following recommendation is made:

**Primary Recommendation: Utilize the native Web Speech API (`SpeechSynthesis`) directly.**

*   **Rationale:**
    *   **Cost-Effective & Accessible:** It is a free, browser-native API, requiring no external subscriptions or licensing fees.
    *   **Good Browser Support:** It has wide support across modern desktop and mobile browsers, ensuring reach for most users (though specific voice availability can vary).
    *   **Client-Side Potential:** While some browser/voice combinations might use server-side processing, it generally aims for client-side synthesis, which aligns with privacy preferences. This is better than solutions that *always* send data to a third-party server.
    *   **Control & Customization:** Provides good control over speech parameters (rate, pitch, volume) and voice selection.
    *   **Text Highlighting Feasibility:** The API exposes `boundary` events which are crucial for implementing synchronized text highlighting. Although this requires custom JavaScript development, it offers the flexibility to create a tailored highlighting experience.
    *   **No External Dependencies:** Reduces reliance on third-party libraries that might have their own maintenance cycles, bugs, or licensing changes.

*   **Considerations & Next Steps for this approach:**
    *   Develop a robust JavaScript module to encapsulate TTS functionality, including voice selection (handling `onvoiceschanged`), speech queuing, and the logic for text highlighting using `boundary` events.
    *   Thoroughly test voice quality and availability on target browsers and operating systems, providing clear feedback to the user if a preferred voice (e.g., UK English) is not found.
    *   Address the asynchronous nature of `getVoices()` carefully.

**Secondary Recommendation (Contingent on further quick investigation): Explore a lightweight, open-source wrapper library like `react-speech-highlight-demo` (if its Vanilla JS integration is confirmed simple and it is truly free and client-side focused).**

*   **Rationale:**
    *   If such a library provides a well-implemented, out-of-the-box text highlighting feature that works reliably with the native `SpeechSynthesis` API, it could significantly reduce development time for this specific, desirable feature.
    *   It must be genuinely open-source (e.g., MIT licensed) and not a wrapper for a paid service or introduce new privacy concerns beyond the native API.
*   **Action:** A brief time-boxed investigation (e.g., 1-2 hours) into the Vanilla JS usage of `react-speech-highlight-demo` or a similar library could be warranted before committing to a fully custom highlighting implementation. If it proves simple and effective, it could be adopted. Otherwise, the primary recommendation (direct use of Web Speech API) stands.

**Solutions to Deprioritize for Now:**

*   **Commercial Libraries (Talkify, ResponsiveVoice.js unless a truly unrestricted free tier is suitable):** The cost and potential for server-side processing (privacy) make them less ideal as a first choice.
*   **Cloud-based APIs (Google, Amazon, Microsoft):** While offering superior voice quality, the cost and significant privacy implications of sending all text to third-party servers make them unsuitable given the project's preference for client-side solutions and handling of children's data.

This approach balances functionality, cost, privacy, and development effort, making the Web Speech API the most pragmatic and aligned choice for EdPsych Connect at this stage.

