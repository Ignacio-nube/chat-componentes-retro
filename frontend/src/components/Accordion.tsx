import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Accordion.css";

export type AccordionItem = {
  id?: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export type AccordionProps = {
  items?: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenItems?: Array<string | number>;
  className?: string;
  itemClassName?: string;
  panelClassName?: string;
};

const DEFAULT_ITEMS: AccordionItem[] = [
  { title: "Section 1", content: "Content for section 1." },
  { title: "Section 2", content: "Content for section 2." },
];

export function Accordion(props: AccordionProps) {
  const {
    items = DEFAULT_ITEMS,
    allowMultiple = false,
    defaultOpenItems = [0],
    className,
    itemClassName,
    panelClassName,
  } = props;

  const [openItems, setOpenItems] = React.useState<Set<string>>(
    () => new Set(defaultOpenItems.map(String))
  );

  React.useEffect(() => {
    setOpenItems(new Set(defaultOpenItems.map(String)));
  }, [defaultOpenItems]);

  const toggleItem = (itemKey: string) => {
  setOpenItems((prevState: Set<string>) => {
      const next = new Set(prevState);
      const isOpen = next.has(itemKey);
      if (allowMultiple) {
        if (isOpen) {
          next.delete(itemKey);
        } else {
          next.add(itemKey);
        }
        return next;
      }

      return isOpen ? new Set() : new Set([itemKey]);
    });
  };

  return (
    <div className={classNames("neo-brutalist neo-accordion", className)}>
      {items.map((item, index) => {
        const key = item.id ?? String(index);
        const isOpen = openItems.has(key);

        return (
          <div key={key} className={classNames("neo-accordion__item", itemClassName)}>
            <button
              type="button"
              className={classNames(
                "neo-accordion__trigger",
                item.disabled && "neo-accordion__trigger--disabled"
              )}
              onClick={() => !item.disabled && toggleItem(key)}
              aria-expanded={isOpen}
              disabled={item.disabled}
            >
              <span>{item.title}</span>
              <span className="neo-accordion__icon">{isOpen ? "−" : "+"}</span>
            </button>
            <div
              className={classNames(
                "neo-accordion__panel",
                !isOpen && "neo-accordion__panel--hidden",
                panelClassName
              )}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
