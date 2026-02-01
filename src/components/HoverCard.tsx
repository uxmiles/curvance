'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

interface HoverCardProps {
  children: React.ReactNode;
  content: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  width?: number;
  openDelay?: number;
  closeDelay?: number;
}

export function HoverCard({
  children,
  content,
  align = 'center',
  sideOffset = 8,
  width = 240,
  openDelay = 200,
  closeDelay = 150,
}: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const [coords, setCoords] = React.useState({ x: 0, y: 0, placement: 'bottom' as 'top' | 'bottom' });
  const [mounted, setMounted] = React.useState(false);

  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const floatingRef = React.useRef<HTMLDivElement>(null);
  const openTimer = React.useRef<ReturnType<typeof setTimeout>>();
  const closeTimer = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const computePosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    const floating = floatingRef.current;
    if (!trigger) return;

    const triggerRect = trigger.getBoundingClientRect();
    const floatingHeight = floating?.offsetHeight ?? 150;
    const floatingWidth = width;

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Determine placement: prefer bottom, use top if not enough space
    const spaceBelow = viewportHeight - triggerRect.bottom - sideOffset;
    const spaceAbove = triggerRect.top - sideOffset;
    
    let placement: 'top' | 'bottom' = 'bottom';
    if (spaceBelow < floatingHeight && spaceAbove > spaceBelow) {
      placement = 'top';
    }

    // Calculate Y
    let y: number;
    if (placement === 'bottom') {
      y = triggerRect.bottom + sideOffset;
    } else {
      y = triggerRect.top - floatingHeight - sideOffset;
    }

    // Calculate X based on alignment
    let x: number;
    const triggerCenter = triggerRect.left + triggerRect.width / 2;
    
    if (align === 'start') {
      x = triggerRect.left;
    } else if (align === 'end') {
      x = triggerRect.right - floatingWidth;
    } else {
      x = triggerCenter - floatingWidth / 2;
    }

    // Clamp to viewport with padding
    const pad = 12;
    x = Math.max(pad, Math.min(x, viewportWidth - floatingWidth - pad));
    y = Math.max(pad, y);

    setCoords({ x, y, placement });
  }, [align, sideOffset, width]);

  const handleOpen = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => {
      computePosition();
      setOpen(true);
    }, openDelay);
  }, [computePosition, openDelay]);

  const handleClose = React.useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, closeDelay);
  }, [closeDelay]);

  // Recompute on open for accurate floating height
  React.useEffect(() => {
    if (open) {
      // Small delay to let floating render
      requestAnimationFrame(() => {
        computePosition();
      });
    }
  }, [open, computePosition]);

  // Cleanup timers
  React.useEffect(() => {
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const floatingStyles: React.CSSProperties = {
    position: 'fixed',
    left: coords.x,
    top: coords.y,
    width,
    zIndex: 50,
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        className="inline-flex"
      >
        {children}
      </span>

      {mounted && open && createPortal(
        <div
          ref={floatingRef}
          role="tooltip"
          style={floatingStyles}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          data-placement={coords.placement}
          className="hovercard-content"
        >
          <div className="bg-[#18181b] border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
            {content}
          </div>
        </div>,
        document.body
      )}

      <style jsx global>{`
        .hovercard-content {
          animation: hovercard-fade 150ms ease-out;
        }

        @keyframes hovercard-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
