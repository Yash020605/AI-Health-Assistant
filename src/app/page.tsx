"use client";

import styles from "./page.module.css";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const QUICK_TOPICS = [
  { id: 1, icon: "🔍", label: "Explain a symptom" },
  { id: 2, icon: "💡", label: "Health awareness & tips" },
  { id: 3, icon: "🛡️", label: "Preventive care suggestions" },
  { id: 4, icon: "⚕️", label: "General health question" },
];

/**
 * Home Component - Main entry point for the AI Health Assistant.
 * Handles the chat interface, state management, and real-time streaming.
 */
export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, setInput, error, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Memoized handler for quick topic selection
   */
  const handleQuickSelect = useCallback((label: string) => {
    setInput(label + ": ");
  }, [setInput]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, error]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        
        {messages.length === 0 && !error ? (
          <>
            <header className={styles.intro}>
              <h1 className={styles.title}>NEXUS AI HEALTH INFORMATION ASSISTANT</h1>
              <p className={styles.subtitle}>
                Your intelligent guide to health awareness, symptom explanations & preventive care.
              </p>
            </header>

            <section className={styles.quickSelectGrid} aria-label="Quick Select Topics">
              {QUICK_TOPICS.map((topic) => (
                <button 
                  key={topic.id} 
                  className={styles.quickSelectBtn}
                  onClick={() => handleQuickSelect(topic.label)}
                  aria-label={`Select quick topic: ${topic.label}`}
                >
                  <span>{topic.icon}</span>
                  {topic.label}
                </button>
              ))}
            </section>
          </>
        ) : (
          <section className={styles.chatHistory} aria-live="polite">
            <div className={styles.chatHeader}>
              <button 
                type="button" 
                onClick={() => window.location.reload()} 
                className={styles.backBtn}
                aria-label="Back to home"
              >
                ← Back to Home
              </button>
            </div>
            {messages.map(m => (
              <div key={m.id} className={m.role === 'user' ? styles.userMessage : styles.aiMessage}>
                <strong>{m.role === 'user' ? 'You' : 'NEXUS'} </strong>
                {m.role === 'user' ? (
                  <span>{m.content}</span>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
            {error && (
              <div className={styles.aiMessage} style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}>
                <strong>System Error </strong>
                {error.message || "Failed to connect to the AI Provider. Please check your API Keys."}
              </div>
            )}
            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <div className={styles.typingIndicator}>
                <strong>NEXUS is thinking</strong>
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </section>
        )}

        <footer className={styles.chatShell}>
          <form className={styles.inputWrapper} onSubmit={handleSubmit} aria-label="Chat input form">
            <input 
              type="text" 
              className={styles.chatInput} 
              placeholder="Ask a health-related question..." 
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
              aria-label="Type your health-related question"
            />
            <button 
              type="submit" 
              className={styles.sendBtn} 
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              ➤
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
}
