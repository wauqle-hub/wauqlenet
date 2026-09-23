"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if device supports hover and fine pointer (desktop / mouse)
    const isFinePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    if (!isFinePointer) return;

    setMounted(true);
    document.body.classList.add("custom-cursor-active");

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    let isHovered = false;
    let isClicking = false;
    let isVisible = false;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        // Snap immediately to position on first move to prevent flying in from (0,0)
        ringX = mouseX;
        ringY = mouseY;
      }
    };

    const onMouseDown = () => {
      isClicking = true;
    };

    const onMouseUp = () => {
      isClicking = false;
    };

    const onMouseLeave = () => {
      isVisible = false;
    };

    const onMouseEnter = () => {
      isVisible = true;
    };

    const interactiveSelector = [
      "a",
      "button",
      "input",
      "textarea",
      "select",
      '[role="button"]',
      ".cursor-pointer",
      "[data-cursor='hover']",
      "label",
      "summary"
    ].join(", ");

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(interactiveSelector);
      if (interactive) {
        isHovered = true;
      } else {
        isHovered = false;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });

    // Smooth physics loop (LERP)
    const render = () => {
      // Easing speed: 0.16 gives the signature fluid gliding lag
      const ringEasing = 0.16;

      ringX += (mouseX - ringX) * ringEasing;
      ringY += (mouseY - ringY) * ringEasing;

      if (ringRef.current) {
        let ringScale = 1;
        if (isClicking && isHovered) {
          ringScale = 1.2;
        } else if (isClicking) {
          ringScale = 0.85;
        } else if (isHovered) {
          ringScale = 1.35; // Slightly less scale up than before
        }

        const ringOpacity = isVisible ? 1 : 0;

        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
        ringRef.current.style.opacity = `${ringOpacity}`;

        // Ring is always transparent with no fill, just changing border opacity/color slightly on hover
        if (isHovered) {
          ringRef.current.style.borderColor = "rgba(105, 17, 24, 0.9)";
        } else {
          ringRef.current.style.borderColor = "rgba(105, 17, 24, 0.42)";
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="custom-cursor-container pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none">
      {/* Outer Luxury Ring - Reduced size by 45% (from 42px to 24px) */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 w-[24px] h-[24px] rounded-full border border-primary/40 will-change-transform"
        style={{
          transition: "opacity 0.25s ease-out, border-color 0.28s ease",
          transformOrigin: "center center",
          opacity: 0,
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
}
