import styles from "./Popup.module.css";
import { useState, useEffect } from "react";

interface PopupProps {
  content: string;
  togglePopup: () => void;
}

const ANIMATION_DURATION = 200; // ms — matches CSS fade-out duration

const Popup = ({ content, togglePopup }: PopupProps) => {
  const [close, setClose] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setClose(true);
      }
    };

    document.addEventListener("keydown", handleEscape);
    const autoCloseId = setTimeout(() => {
      setClose(true);
    }, 2000);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      clearTimeout(autoCloseId);
    };
  }, []);

  // When `close` becomes true, wait for the hide animation to finish before
  // calling the parent's `togglePopup` (which will remove this component).
  useEffect(() => {
    if (!close) return;

    const animationTimeoutId = setTimeout(() => {
      if (typeof togglePopup === "function") {
        togglePopup();
      }
    }, ANIMATION_DURATION);

    return () => {
      clearTimeout(animationTimeoutId);
    };
  }, [close, togglePopup]);

  const handleClose = () => {
    setClose(true);
  };

  return (
    <div className={`${styles.popup} ${close ? styles.closed : ""}`}>
      <div className={styles.popupContent}>
        <p>{content}</p>
        <button className={styles.closeButton} onClick={handleClose}>
          x
        </button>
      </div>
    </div>
  );
};

export default Popup;
