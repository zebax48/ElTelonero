import React from 'react';
import styles from '@/styles/Modal.module.css';

export default function Modal({ children, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
