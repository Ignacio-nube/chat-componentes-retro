import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Card.css";

export type CardProps = {
  title?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
};

export function Card(props: CardProps) {
  const { title, content, footer, children, className, headingLevel = 3 } = props;
  const headingTag = `h${headingLevel}` as React.ElementType;

  return (
    <div className={classNames("neo-brutalist neo-card", className)}>
      {title &&
        React.createElement(
          headingTag,
          { className: "neo-card__title" },
          title
        )}
      {content && (
        <p className="neo-card__content">{content}</p>
      )}
      {children}
      {footer && <div className="neo-card__footer">{footer}</div>}
    </div>
  );
}
