import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Tooltip.css";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export type TooltipProps = {
  trigger?: React.ReactNode;
  content?: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  tooltipClassName?: string;
};

const POSITION_CLASSES: Record<TooltipPosition, string> = {
  top: "neo-tooltip__bubble--top",
  bottom: "neo-tooltip__bubble--bottom",
  left: "neo-tooltip__bubble--left",
  right: "neo-tooltip__bubble--right",
};

export function Tooltip(props: TooltipProps) {
  const {
    trigger = "Hover Me",
    content = "This is a Neo Brutalist tooltip.",
    position = "top",
    delay = 150,
    className,
    tooltipClassName,
  } = props;

  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<number>();

  const clearTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  };

  const handleShow = () => {
    clearTimer();
    timeoutRef.current = window.setTimeout(() => setIsVisible(true), delay);
  };

  const handleHide = () => {
    clearTimer();
    setIsVisible(false);
  };

  React.useEffect(() => clearTimer, []);

  return (
    <div
      className={classNames("neo-tooltip", className)}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onFocus={handleShow}
      onBlur={handleHide}
      tabIndex={0}
    >
      <span className="neo-brutalist neo-tooltip__trigger">{trigger}</span>
      <div
        role="tooltip"
        className={classNames(
          "neo-brutalist neo-tooltip__bubble",
          POSITION_CLASSES[position],
          isVisible && "neo-tooltip__bubble--visible",
          tooltipClassName
        )}
      >
        {content}
      </div>
    </div>
  );
}
