import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Dropdown.css";
import "./Button.css";

export type DropdownOption = {
  label: React.ReactNode;
  value: string;
  href?: string;
  onSelect?: (value: string, option: DropdownOption) => void;
};

export type DropdownProps = {
  label?: React.ReactNode;
  options?: DropdownOption[];
  className?: string;
  menuClassName?: string;
  itemClassName?: string;
  align?: "left" | "right";
  onSelect?: (value: string, option: DropdownOption) => void;
};

const DEFAULT_OPTIONS: DropdownOption[] = [
  { label: "Option 1", value: "option-1" },
  { label: "Option 2", value: "option-2" },
  { label: "Option 3", value: "option-3" },
];

export function Dropdown(props: DropdownProps) {
  const {
    label = "Select",
    options = DEFAULT_OPTIONS,
    className,
    menuClassName,
    itemClassName,
    align = "left",
    onSelect,
  } = props;

  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    setIsOpen(false);
    onSelect?.(option.value, option);
    option.onSelect?.(option.value, option);
  };

  const menuAlignment = align === "right" ? "neo-dropdown__menu--align-right" : undefined;

  return (
    <div ref={containerRef} className={classNames("neo-dropdown", className)}>
      <button
        type="button"
        className="neo-brutalist neo-button neo-button--yellow neo-dropdown__button"
  onClick={() => setIsOpen((prevState: boolean) => !prevState)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {label}
      </button>
      <ul
        role="menu"
        className={classNames(
          "neo-brutalist neo-dropdown__menu",
          menuAlignment,
          isOpen && "neo-dropdown__menu--open",
          menuClassName
        )}
      >
        {options.map((option) => (
          <li key={option.value} role="none" className="neo-dropdown__item">
            {option.href ? (
              <a
                href={option.href}
                className={classNames("neo-dropdown__link", itemClassName)}
                role="menuitem"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </a>
            ) : (
              <button
                type="button"
                role="menuitem"
                className={classNames("neo-dropdown__action", itemClassName)}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
