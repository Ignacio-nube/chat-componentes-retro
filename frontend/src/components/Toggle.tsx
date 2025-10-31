import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Toggle.css";

export type ToggleProps = {
  label?: React.ReactNode;
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Toggle(props: ToggleProps) {
  const {
    label = "Toggle",
    id,
    checked,
    defaultChecked,
    disabled = false,
    className,
    labelClassName,
    onChange,
  } = props;

  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const resolvedChecked = isControlled ? checked : internalChecked;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    const nextValue = event.target.checked;
    if (!isControlled) {
      setInternalChecked(nextValue);
    }

    onChange?.(nextValue, event);
  };

  return (
    <label
      htmlFor={inputId}
      className={classNames(
        "neo-toggle",
        disabled && "neo-toggle--disabled",
        labelClassName
      )}
    >
      <input
        id={inputId}
        type="checkbox"
        className="neo-toggle__input"
        checked={resolvedChecked}
        onChange={handleChange}
        disabled={disabled}
      />
      <div className={classNames("neo-brutalist neo-toggle__track", className)}>
        <span
          className={classNames(
            "neo-toggle__thumb",
            resolvedChecked && "neo-toggle__thumb--checked"
          )}
        />
      </div>
      {label && <span className="neo-toggle__label">{label}</span>}
    </label>
  );
}
