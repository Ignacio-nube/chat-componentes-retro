import React from "react";
import { classNames } from "../utils/classNames";

import "../styles/neoBrutalist.css";
import "./Avatar.css";

export type AvatarProps = {
  image?: string;
  initials?: string;
  size?: number;
  alt?: string;
  bgClassName?: string;
  textClassName?: string;
  className?: string;
  rounded?: boolean;
};

export function Avatar(props: AvatarProps) {
  const {
    image,
    initials = "JD",
    size = 64,
    alt = "Avatar",
    bgClassName = "neo-avatar--bg-gray",
    textClassName = "neo-avatar--text-black",
    className,
    rounded = false,
  } = props;

  const style: React.CSSProperties = {
    width: size,
    height: size,
    fontSize: Math.round(size / 2.5),
  };

  return (
    <div
      className={classNames(
        "neo-brutalist neo-avatar",
        bgClassName,
        textClassName,
        rounded && "neo-avatar--rounded",
        className
      )}
      style={style}
      aria-label={initials}
    >
      {image ? (
        <img src={image} alt={alt} className="neo-avatar__image" />
      ) : (
        <span className="neo-avatar__initials" style={{ fontSize: style.fontSize }}>
          {initials}
        </span>
      )}
    </div>
  );
}
