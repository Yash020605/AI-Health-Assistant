"use client";

import { useState } from 'react';
import styles from './DisclaimerBanner.module.css';

export default function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={styles.banner}>
      <p>
        <strong>⚠️ Important:</strong> This application is for informational purposes only and is 
        not a replacement for professional medical advice, diagnosis or treatment. 
        Always consult a qualified healthcare professional for medical concerns.
      </p>
      <button 
        className={styles.closeBtn} 
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss disclaimer"
      >
        ×
      </button>
    </div>
  );
}
