# 🩺 Nexus AI Health Information Assistant

![Nexus AI Banner](https://img.shields.io/badge/Prompt_Wars_%2726-Hackathon_Submission-00F0FF?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-Flash_Latest-4285F4?style=for-the-badge)

**Nexus AI** is an intelligent, highly-optimized health awareness, symptom explanation, and preventive care platform. Built on the Vercel Edge Network and powered by Google's Gemini AI, it is designed to provide rapid, informative health context while strictly prioritizing medical ethics, human safety, and zero-liability bounds.

---

## ✨ Core Features

* **Intelligent Symptom Checker:** Provides contextual, structured information regarding various symptoms, health awareness, and preventive care.
* **Strict Medical Guardrails:** The AI is strictly prompt-engineered to refuse medical diagnoses and explicitly warns users to seek professional help. 
* **India-Localized Emergency Routing:** Actively intercepts severe symptoms (e.g., chest pain, shortness of breath) and forcefully directs users to dial **112 (National Emergency)** or **108 (Ambulance)**.
* **Glassmorphism UI:** A sleek, premium, highly responsive user interface with dynamic hover effects, smooth transitions, a retractable safety banner, and an instant "Back to Home" reset.
* **Edge Streaming:** Bypasses standard Node.js serverless limitations by deploying to the Vercel Edge network, resulting in flawless AI text streaming with zero timeouts.

---

## 🏆 Hackathon Evaluation Alignment (Prompt Wars '26)

This project has been heavily engineered to meet and exceed the hackathon evaluation parameters:

### 1. Clean, Readable, and Well-Structured Code
* **Component-Based Architecture:** The frontend is cleanly divided into a minimalist Next.js `page.tsx` and isolated components like `DisclaimerBanner.tsx`.
* **State Management:** Utilizes modern React hooks (`useState`, `useRef`, `useEffect`) and the `@ai-sdk/react` library to manage complex streaming state with minimal boilerplate.

### 2. Safe Practices & Vulnerability Avoidance
* **Ethical AI Boundaries:** The Gemini system prompt mathematically locks the AI out of dispensing medical advice or diagnoses.
* **Bypassing Raw AI Crashes:** We intentionally override Google's `BLOCK_NONE` raw safety filters on the backend so that the AI relies purely on our custom `SYSTEM_PROMPT`. Instead of crashing with an ugly `500 Server Error` when users type "heart attack", the AI gracefully handles it with our custom Emergency Disclaimer.
* **Stream-Level Error Tracking:** Errors inside the Google API are caught at the data-stream level and elegantly presented in the UI, rather than breaking the application silently.

### 3. Resource Utilization (Time & Memory)
* **Vercel Edge Runtime:** Instead of heavy, slow Node.js functions, the API route runs on `export const runtime = 'edge'`. This consumes a fraction of the memory, guarantees instant cold starts, and keeps the AI data stream open.
* **Evergreen Model Binding:** The model is dynamically bound to `gemini-flash-latest`, ensuring the application automatically leverages Google's fastest, most efficient model without requiring future code updates.

### 4. Testability, Validation, and Maintenance
* **Strong Typing:** Written in strict TypeScript to catch errors at compile-time.
* **Modular CSS:** Utilizes CSS Modules (`page.module.css`, `DisclaimerBanner.module.css`) to prevent global CSS pollution and make UI styling easily maintainable.
* **Error Isolation:** The chat stream isolates UI errors in a red `<div className={styles.aiMessage}>` allowing rapid debugging of API keys or region blocks.

### 5. Usability for Diverse Users
* **Fully Responsive:** Grid structures seamlessly collapse into single columns for mobile devices.
* **Dismissible Safety Elements:** The top warning banner is retractable to save vertical screen space on mobile after the user has read it.
* **Instant State Reset:** A smooth "Back to Home" button instantly wipes the chat context and takes users back to the Quick Select grid.

---

## 🚀 Local Setup & Installation

**1. Clone the repository:**
```bash
git clone https://github.com/Yash020605/AI-Health-Assistant.git
cd AI-Health-Assistant
```

**2. Install dependencies:**
```bash
npm install
```

**3. Configure Environment Variables:**
Create a `.env.local` file in the root directory and add your Google Gemini API Key:
```env
GEMINI_API_KEY="your_api_key_here"
```

**4. Run the Development Server:**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Technology Stack
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **UI/Styling:** CSS Modules, Vanilla CSS (Glassmorphism design language)
* **AI Integration:** Vercel AI SDK (`ai`, `@ai-sdk/google`, `@ai-sdk/react`)
* **LLM Provider:** Google Gemini API (`gemini-flash-latest`)
* **Markdown Parsing:** `react-markdown`, `remark-gfm`

---
*Built for Prompt Wars '26*
