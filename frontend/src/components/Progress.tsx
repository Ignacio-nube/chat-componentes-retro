import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Progress.css";

export type ProgressColor = "black" | "yellow" | "green" | "red" | "blue";

export type ProgressProps = {
  value: number;
  max?: number;
  color?: ProgressColor;
  showLabel?: boolean;
  label?: React.ReactNode;
  className?: string;
  barClassName?: string;
  wrapperClassName?: string;
};

const COLOR_MAP: Record<ProgressColor, string> = {
  black: "neo-progress__bar--black",
  yellow: "neo-progress__bar--yellow",
  green: "neo-progress__bar--green",
  red: "neo-progress__bar--red",
  blue: "neo-progress__bar--blue",
};

export function Progress(props: ProgressProps) {
  const {
    value,
    max = 100,
    color = "black",
    showLabel = false,
    label,
    className,
    barClassName,
    wrapperClassName,
  } = props;

  const normalizedValue = Number.isFinite(value) ? value : 0;
  const clampedValue = Math.min(Math.max(normalizedValue, 0), max);
  const percentage = max === 0 ? 0 : (clampedValue / max) * 100;

  return (
    <div className={classNames("neo-progress-wrapper", wrapperClassName)}>
      <div className={classNames("neo-brutalist neo-progress", className)}>
        <div
          className={classNames(
            "neo-progress__bar",
            COLOR_MAP[color],
            barClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="neo-progress__label">
          {label ?? `${Math.round(percentage)}%`}
        </div>
      )}
    </div>
  );
}
