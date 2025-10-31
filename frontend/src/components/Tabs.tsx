import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Tabs.css";

export type TabItem = {
  id?: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  tabs?: TabItem[];
  initialTab?: string | number;
  className?: string;
  tabListClassName?: string;
  tabTriggerClassName?: string;
  tabContentClassName?: string;
  onChange?: (tab: TabItem, index: number) => void;
};

const DEFAULT_TABS: TabItem[] = [
  { label: "Tab 1", content: "Content for Tab 1." },
  { label: "Tab 2", content: "Content for Tab 2." },
  { label: "Tab 3", content: "Content for Tab 3." },
];

export function Tabs(props: TabsProps) {
  const {
    tabs = DEFAULT_TABS,
    initialTab = 0,
    className,
    tabListClassName,
    tabTriggerClassName,
    tabContentClassName,
    onChange,
  } = props;

  const baseId = React.useId();

  const tabKeys = tabs.map((tab, index) => tab.id ?? String(index));
  const initialKey = tabKeys.find((key) => key === String(initialTab)) ?? tabKeys[0];

  const [activeKey, setActiveKey] = React.useState(initialKey);

  const handleSelect = (index: number) => {
    const key = tabKeys[index];
    if (!key) {
      return;
    }

    const tab = tabs[index];
    if (tab?.disabled) {
      return;
    }

    setActiveKey(key);
    onChange?.(tab, index);
  };

  return (
    <div className={classNames("neo-brutalist neo-tabs", className)}>
      <div
        className={classNames("neo-tabs__list", tabListClassName)}
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab, index) => {
          const key = tabKeys[index];
          const isActive = key === activeKey;
          return (
            <button
              key={key}
              id={`${baseId}-tab-${key}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${key}`}
              disabled={tab.disabled}
              onClick={() => handleSelect(index)}
              className={classNames(
                "neo-tabs__trigger",
                isActive && "neo-tabs__trigger--active",
                tab.disabled && "neo-tabs__trigger--disabled",
                tabTriggerClassName
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className={classNames("neo-tabs__panel-container", tabContentClassName)}>
        {tabs.map((tab, index) => {
          const key = tabKeys[index];
          const isActive = key === activeKey;
          return (
            <div
              key={key}
              id={`${baseId}-panel-${key}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${key}`}
              className={classNames(
                "neo-tabs__panel",
                !isActive && "neo-tabs__panel--hidden"
              )}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
