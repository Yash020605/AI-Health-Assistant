"use client";

import React, { useState } from 'react';
import styles from './DisclaimerBanner.module.css';

/**
 * DisclaimerBanner Component
 * Displays a non-intrusive warning about the AI not being a doctor.
 * Uses React.memo for rendering efficiency.
 */
const DisclaimerBanner = React.memo(() => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={styles.banner} role="alert" aria-live="polite">
      <div className={styles.content}>
        <strong>⚠️ IMPORTANT:</strong> This application is for informational purposes only and is 
        not a replacement for professional medical advice, diagnosis or treatment. 
        Always consult a qualified healthcare professional for medical concerns.
      </div>
      <button 
        className={styles.closeBtn} 
        onClick={() => setIsVisible(false)}
        aria-label="Close disclaimer"
      >
        ×
      </button>
    </div>
  );
});

DisclaimerBanner.displayName = "DisclaimerBanner";
export default DisclaimerBanner;
