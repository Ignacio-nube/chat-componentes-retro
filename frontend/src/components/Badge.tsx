import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Badge.css";

export type BadgeVariant = "red" | "green" | "yellow" | "black" | "blue";

export type BadgeProps = {
  text?: React.ReactNode;
  variant?: BadgeVariant;
  textColor?: "white" | "black";
  className?: string;
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  red: "neo-badge--red",
  green: "neo-badge--green",
  yellow: "neo-badge--yellow",
  black: "neo-badge--black",
  blue: "neo-badge--blue",
};

const TEXT_COLOR_CLASSES: Record<"white" | "black", string> = {
  white: "neo-badge--text-white",
  black: "neo-badge--text-black",
};

export function Badge(props: BadgeProps) {
  const { text = "New", variant = "red", textColor = "white", className } = props;

  return (
    <span
      className={classNames(
        "neo-brutalist neo-badge",
        VARIANT_CLASSES[variant],
        TEXT_COLOR_CLASSES[textColor],
        className
      )}
    >
      {text}
    </span>
  );
}
