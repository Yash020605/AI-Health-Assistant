import styles from './DisclaimerBanner.module.css';

export default function DisclaimerBanner() {
  return (
    <div className={styles.banner}>
      <p>
        <strong>⚠️ Important:</strong> This AI assistant is for informational purposes only and is 
        <strong> NOT</strong> a replacement for professional medical advice, diagnosis, or treatment. 
        If you are experiencing a medical emergency, call your local emergency services immediately.
      </p>
    </div>
  );
}
