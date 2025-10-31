import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Input.css";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { wrapperClassName, className, ...inputProps }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const inputElement = (
    <input
      ref={ref}
      className={classNames("neo-brutalist neo-input", className)}
      {...inputProps}
    />
  );

  if (!wrapperClassName) {
    return inputElement;
  }

  return <div className={wrapperClassName}>{inputElement}</div>;
});

Input.displayName = "Input";
