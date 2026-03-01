"use client";

import { useSound } from "@/hooks/useSound";

interface SoundButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "button" | "div" | "a";
  href?: string;
  target?: string;
  rel?: string;
}

export function SoundButton({
  children,
  className,
  onClick,
  as: Tag = "button",
  href,
  target,
  rel,
}: SoundButtonProps) {
  const { playSound } = useSound();

  return (
    <Tag
      className={className}
      href={href}
      target={target}
      rel={rel}
      onMouseEnter={() => playSound("hover")}
      onClick={() => {
        playSound("click");
        onClick?.();
      }}
    >
      {children}
    </Tag>
  );
}
