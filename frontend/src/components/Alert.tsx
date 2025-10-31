import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Alert.css";

export type AlertTone = "success" | "error" | "warning" | "info";

export type AlertProps = {
  message?: React.ReactNode;
  tone?: AlertTone;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

const TONE_CLASSES: Record<AlertTone, string> = {
  success: "neo-alert--success",
  error: "neo-alert--error",
  warning: "neo-alert--warning",
  info: "neo-alert--info",
};

export function Alert(props: AlertProps) {
  const {
    message = "This is an alert!",
    tone = "success",
    dismissible = true,
    onDismiss,
    actions,
    icon,
    children,
    className,
  } = props;

  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const toneClasses = TONE_CLASSES[tone];

  return (
    <div
      className={classNames("neo-brutalist neo-alert", toneClasses, className)}
      role="alert"
    >
      {icon && <span className="neo-alert__icon">{icon}</span>}
      <div className="neo-alert__content">{children ?? message}</div>
      {actions && <div className="neo-alert__actions">{actions}</div>}
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss alert"
          className="neo-alert__close"
          onClick={handleDismiss}
        >
          ×
        </button>
      )}
    </div>
  );
}
