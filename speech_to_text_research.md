# Research on Client-Side Speech-to-Text Solutions

Date: May 15, 2025

## 1. Introduction

This document outlines the research and selection process for a client-side JavaScript library or API to implement speech-to-text (voice input) functionality within the EdPsych Connect DALA platform. This is a high-priority feature (Task 2.3.7) aimed at enhancing accessibility and user interaction.

## 2. Key Selection Criteria

The following criteria will be used to evaluate potential solutions:

*   **Accuracy:** The solution should provide a high level of accuracy in transcribing spoken words, ideally with good support for UK English. Consideration for children's speech patterns is a plus, though often harder to find in generic APIs.
*   **Browser Compatibility:** Must work reliably across major modern browsers (Chrome, Firefox, Safari, Edge).
*   **Ease of Integration:** Should be relatively straightforward to integrate into the existing HTML/JavaScript structure of the DALA student interface.
*   **Cost & Licensing:** Free or open-source solutions are preferred, provided they meet quality and reliability standards. Licensing terms must be permissive for use in this project.
*   **Privacy:** Client-side processing is strongly preferred to ensure user privacy, minimizing the need to send audio data to external servers for transcription.
*   **Documentation & Community Support:** Good quality documentation and active community support (e.g., forums, GitHub issues) are important for implementation and troubleshooting.
*   **Real-time Capabilities:** The solution should support real-time or near real-time transcription to provide a responsive user experience.
*   **Control & Customization:** Ability to start/stop recognition, handle interim results, and manage errors gracefully.

## 3. Potential Solutions Research

I will now research potential solutions, starting with the Web Speech API and then looking for other relevant libraries.




### 3.1. Web Speech API (`SpeechRecognition`)

*   **Description:** This is a W3C standard API that allows web pages to handle voice input. The `SpeechRecognition` interface is the primary component for speech-to-text.
*   **Accuracy:** Generally good, but can vary by browser and implementation. Chrome, for example, uses Google's backend for recognition, which is typically quite accurate. Accuracy for children's voices or strong accents might be a concern and would require testing.
*   **Browser Compatibility (Key Issue):**
    *   **Chrome (Desktop & Android):** Good support (version 33+).
    *   **Edge (Chromium-based):** Good support (version 79+).
    *   **Safari (Desktop & iOS):** Supported (version 14.1+ on desktop, 14.5+ on iOS).
    *   **Firefox (Desktop & Android):** **No support** for `SpeechRecognition`. This is a major drawback for cross-browser compatibility.
    *   **Opera:** Good support (version 20+).
*   **Ease of Integration:** Relatively straightforward for supported browsers. Involves creating a `SpeechRecognition` object, setting properties like `lang`, `continuous`, `interimResults`, and handling events like `onresult`, `onerror`, `onend`.
*   **Cost & Licensing:** Free to use as it's a browser-native API.
*   **Privacy:** This is a significant concern. As noted by MDN and other sources, browsers like Chrome send audio data to a server for processing. This means audio is not processed purely client-side in all implementations, which has privacy implications and means it won't work offline for those browsers.
*   **Documentation & Community Support:** Well-documented on MDN and various web development blogs. Being a web standard, there's a good amount of community discussion.
*   **Real-time Capabilities:** Supports `interimResults` for real-time feedback as the user speaks.
*   **Control & Customization:** Offers good control over starting/stopping recognition, language settings, and handling of results and errors.

### 3.2. Alternative Libraries/Approaches

Research into purely client-side JavaScript libraries that offer robust, offline speech-to-text without relying on the Web Speech API (especially for Firefox compatibility) reveals a more complex landscape.

1.  **Vosk API (with WebAssembly):**
    *   **Description:** Vosk is an open-source speech recognition toolkit. It supports multiple languages and can be compiled to WebAssembly (Wasm) for client-side execution.
    *   **Accuracy:** Generally considered good, especially with appropriate language models.
    *   **Browser Compatibility:** If compiled to Wasm, it should run in any browser supporting Wasm (all modern browsers).
    *   **Ease of Integration:** More complex than Web Speech API. Requires integrating the Wasm module, managing language models (which can be large), and handling the audio input pipeline to feed the Wasm engine.
    *   **Cost & Licensing:** Open source (Apache 2.0).
    *   **Privacy:** True client-side processing if language models are downloaded and run in the browser. This is a major privacy advantage.
    *   **Documentation & Community Support:** Good documentation for Vosk itself; community support for Wasm integration might be more specialized.
    *   **Offline:** Yes, this is a key advantage.

2.  **OpenAI Whisper (with WebAssembly - e.g., whisper.cpp compiled to Wasm):**
    *   **Description:** Whisper is a powerful speech recognition model from OpenAI. Community efforts have led to ports like `whisper.cpp`, which can be compiled to WebAssembly for browser use.
    *   **Accuracy:** State-of-the-art accuracy for many languages, including English.
    *   **Browser Compatibility:** Relies on WebAssembly support.
    *   **Ease of Integration:** Similar to Vosk, this would be more complex. It involves managing the Wasm module and potentially large model files that need to be loaded by the client.
    *   **Cost & Licensing:** Whisper models are open source. The `whisper.cpp` port is typically MIT licensed.
    *   **Privacy:** True client-side processing, excellent for privacy.
    *   **Documentation & Community Support:** Growing community around Whisper and its Wasm ports. Documentation is evolving.
    *   **Offline:** Yes.

3.  **`react-speech-recognition` (Wrapper for Web Speech API):**
    *   **Description:** This is an NPM package that provides a React hook for using the Web Speech API. It simplifies some aspects of using the API within a React context.
    *   **Evaluation:** While it simplifies usage, it fundamentally relies on the underlying Web Speech API. Therefore, it inherits all the limitations of the Web Speech API, including browser compatibility (no Firefox support for recognition) and server-side processing in some browsers.

## 4. Evaluation Summary

| Feature                 | Web Speech API (`SpeechRecognition`) | Vosk API (Wasm)              | Whisper (Wasm)               |
|-------------------------|--------------------------------------|------------------------------|------------------------------|
| **Accuracy**            | Good (varies by browser)             | Good                         | Excellent                    |
| **Browser Compatibility** | **Poor (No Firefox)**                | Good (Wasm dependent)        | Good (Wasm dependent)        |
| **Ease of Integration** | Easy                                 | Complex                      | Complex                      |
| **Cost**                | Free                                 | Free (Open Source)           | Free (Open Source)           |
| **Privacy (Client-Side)** | No (often server-based)              | **Yes (Offline possible)**   | **Yes (Offline possible)**   |
| **Offline Capability**  | No (often server-based)              | **Yes**                      | **Yes**                      |
| **Documentation**       | Excellent (MDN)                      | Good                         | Evolving                     |
| **UK English Support**  | Yes (via `lang` property)            | Yes (with model)             | Excellent                    |
| **Children's Speech**   | Untested, potential challenge        | Model dependent              | Model dependent, potentially better |

## 5. Recommendation

Given the **HIGH PRIORITY** of voice input and the need for broad accessibility, the lack of Firefox support for the `SpeechRecognition` part of the Web Speech API is a critical issue. Relying solely on it would exclude a significant portion of users or lead to an inconsistent experience.

**Primary Recommendation:**

For a robust, cross-browser, and privacy-respecting solution, pursuing a **WebAssembly-based implementation of a model like Whisper (e.g., using a `whisper.cpp` Wasm port) or Vosk API** is the most promising long-term approach. 

*   **Pros:** True client-side processing (privacy, offline), excellent accuracy (especially Whisper), cross-browser compatibility via Wasm.
*   **Cons:** Higher integration complexity, potential for larger initial asset downloads (models), performance considerations on lower-end devices.

**Secondary/Phased Recommendation (if Wasm is too complex for immediate implementation):**

1.  **Implement using Web Speech API** for browsers that support it (Chrome, Edge, Safari). Provide clear messaging to users on unsupported browsers (like Firefox) that voice input is not available or is limited.
2.  **Concurrently, or as a next step, develop/integrate a Wasm-based solution** (like Whisper or Vosk) to replace or augment the Web Speech API, aiming for universal support.

**Decision Point:**

The choice between these depends on the development resources available and the acceptable timeline for a fully cross-browser solution. If immediate, albeit partial, functionality is desired, starting with Web Speech API and clearly noting its limitations is an option. However, for the platform's long-term vision of inclusivity and advanced AI, a Wasm-based solution is superior.

**For the purpose of Task 2.3.8 (Implement a basic prototype), if a quick prototype is needed, the Web Speech API can be used, with the understanding that it won't work in Firefox.** However, the research clearly indicates that for a production-ready, cross-browser solution, a Wasm-based approach is necessary.

**Final Recommendation for Selection (Task 2.3.7):** Select the **Web Speech API** for initial prototyping due to its ease of integration, with the strong caveat and recommendation to plan for a **WebAssembly-based solution (preferably Whisper)** for a production-quality, cross-browser, and private implementation.

