"use client";

import styles from "./page.module.css";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const QUICK_TOPICS = [
  { id: 1, icon: "🔍", label: "Explain a symptom" },
  { id: 2, icon: "💡", label: "Health awareness & tips" },
  { id: 3, icon: "🛡️", label: "Preventive care suggestions" },
  { id: 4, icon: "⚕️", label: "General health question" },
];

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, setInput, error, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleQuickSelect = (label: string) => {
    setInput(label + ": ");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, error]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        
        {messages.length === 0 && !error ? (
          <>
            <div className={styles.intro}>
              <h1 className={styles.title}>NEXUS AI HEALTH INFORMATION ASSISTANT</h1>
              <p className={styles.subtitle}>
                Your intelligent guide to health awareness, symptom explanations & preventive care.
              </p>
            </div>

            <div className={styles.quickSelectGrid}>
              {QUICK_TOPICS.map((topic) => (
                <button 
                  key={topic.id} 
                  className={styles.quickSelectBtn}
                  onClick={() => handleQuickSelect(topic.label)}
                >
                  <span>{topic.icon}</span>
                  {topic.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.chatHistory}>
            <div className={styles.chatHeader}>
              <button type="button" onClick={() => window.location.reload()} className={styles.backBtn}>
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
          </div>
        )}

        <div className={styles.chatShell}>
          <form className={styles.inputWrapper} onSubmit={handleSubmit}>
            <input 
              type="text" 
              className={styles.chatInput} 
              placeholder="Ask a health-related question..." 
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isLoading}>
              ➤
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
