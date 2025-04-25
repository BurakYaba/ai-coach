"use client";

import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import "./play-button.css";

interface PlayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  className?: string;
  children?: React.ReactNode;
}

const PlayButton = React.forwardRef<HTMLButtonElement, PlayButtonProps>(
  ({ className, children = "P L A Y", href, ...props }, ref) => {
    const renderButton = () => (
      <button ref={ref} className={cn("play-button", className)} {...props}>
        {children}
        <div id="clip">
          <div id="leftTop" className="corner"></div>
          <div id="rightBottom" className="corner"></div>
          <div id="rightTop" className="corner"></div>
          <div id="leftBottom" className="corner"></div>
        </div>
        <span id="rightArrow" className="arrow"></span>
        <span id="leftArrow" className="arrow"></span>
      </button>
    );

    const renderLink = () => (
      <Link href={href!} className="inline-block">
        {renderButton()}
      </Link>
    );

    return href ? renderLink() : renderButton();
  }
);

PlayButton.displayName = "PlayButton";

export { PlayButton };
