import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Button.css";

export type ButtonVariant = "yellow" | "black" | "red" | "green" | "gray";
export type ButtonTextColor = "black" | "white";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  textColor?: ButtonTextColor;
};

const BACKGROUND_CLASS_MAP: Record<ButtonVariant, string> = {
  yellow: "neo-button--yellow",
  black: "neo-button--black",
  red: "neo-button--red",
  green: "neo-button--green",
  gray: "neo-button--gray",
};

const TEXT_CLASS_MAP: Record<ButtonTextColor, string> = {
  black: "neo-button--text-black",
  white: "neo-button--text-white",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "yellow",
    textColor = "black",
    className,
    children,
    type = "button",
    ...buttonProps
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      type={type}
      className={classNames(
        "neo-brutalist neo-button",
        BACKGROUND_CLASS_MAP[variant as ButtonVariant],
        TEXT_CLASS_MAP[textColor as ButtonTextColor],
        className
      )}
      {...buttonProps}
    >
      {children ?? "Click Me"}
    </button>
  );
});

Button.displayName = "Button";
