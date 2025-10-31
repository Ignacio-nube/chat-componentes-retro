import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Modal.css";
import "./Button.css";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeLabel?: string;
  closeOnOverlayClick?: boolean;
};

export function Modal(props: ModalProps) {
  const {
    isOpen,
    onClose,
    title,
    children,
    className,
    overlayClassName,
    closeLabel = "Close",
    closeOnOverlayClick = true,
  } = props;

  const titleId = React.useId();
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;

    const focusableElements = contentRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={classNames("neo-modal__overlay", overlayClassName)}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={contentRef}
        className={classNames("neo-brutalist neo-modal", className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        {title && (
          <h3 id={titleId} className="neo-modal__title">
            {title}
          </h3>
        )}
        <div className="neo-modal__body">{children}</div>
        <div className="neo-modal__actions">
          <button
            type="button"
            className="neo-brutalist neo-button neo-button--yellow"
            onClick={onClose}
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
