import { useEffect } from "react";
import "./ModalWithForm.css";

export default function ModalWithForm({
  title,
  children,
  onClose,
  onSubmit,
  submitText = "Save",
  showSubmit = true,
}) {
  // Close modal with ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {title && <h2 className="modal-title">{title}</h2>}

        {/* The dynamic form/content area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onSubmit) onSubmit(e);
          }}
          className="modal-form"
        >
          {children}

          {showSubmit && (
            <button type="submit" className="modal-submit">
              {submitText}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
