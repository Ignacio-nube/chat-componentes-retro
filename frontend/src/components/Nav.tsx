import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Nav.css";

export type NavLink = {
  label: React.ReactNode;
  href: string;
  target?: string;
  rel?: string;
};

export type NavProps = {
  links?: NavLink[];
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  onLinkClick?: (link: NavLink, event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const DEFAULT_LINKS: NavLink[] = [
  { label: "Home", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

export function Nav(props: NavProps) {
  const { links = DEFAULT_LINKS, className, listClassName, itemClassName, onLinkClick } = props;

  return (
    <nav className={classNames("neo-brutalist neo-nav", className)}>
      <ul className={classNames("neo-nav__list", listClassName)}>
        {links.map((link) => (
          <li key={String(link.href)} className={classNames("neo-nav__item", itemClassName)}>
            <a
              href={link.href}
              target={link.target}
              rel={link.rel}
              className="neo-nav__link"
              onClick={(event: React.MouseEvent<HTMLAnchorElement>) => onLinkClick?.(link, event)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
