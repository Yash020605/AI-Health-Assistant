"use client";

import styles from "./page.module.css";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const QUICK_TOPICS = [
  { id: 1, icon: "🔬", label: "Explain a symptom" },
  { id: 2, icon: "🛡️", label: "Health awareness & tips" },
  { id: 3, icon: "🩺", label: "Preventive care suggestions" },
  { id: 4, icon: "💬", label: "General health question" },
];

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, setInput } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleQuickSelect = (label: string) => {
    setInput(label + ": ");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        
        {messages.length === 0 ? (
          <>
            <div className={styles.intro}>
              <h1 className={styles.title}>AI HEALTH INFORMATION ASSISTANT</h1>
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
            {messages.map(m => (
              <div key={m.id} className={m.role === 'user' ? styles.userMessage : styles.aiMessage}>
                <strong>{m.role === 'user' ? 'You' : 'NEXUS'}: </strong>
                {m.role === 'user' ? (
                  <span>{m.content}</span>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>
            ))}
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
            />
            <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
              ➜
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
