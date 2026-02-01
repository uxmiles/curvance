'use client';
import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface PopoverTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface PopoverContentProps {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  children: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const PopoverContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement>;
}>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
});

export function Popover({ open: controlledOpen, onOpenChange, children }: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement>(null);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild, children, onMouseEnter, onMouseLeave, ...props }, forwardedRef) => {
    const { setOpen, triggerRef } = React.useContext(PopoverContext);

    const handleRef = (el: HTMLButtonElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLElement | null>).current = el;
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        forwardedRef.current = el;
      }
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref: handleRef,
        onMouseEnter: () => {
          onMouseEnter?.();
          if ((children as any).props.onMouseEnter) {
            (children as any).props.onMouseEnter();
          }
        },
        onMouseLeave: () => {
          onMouseLeave?.();
          if ((children as any).props.onMouseLeave) {
            (children as any).props.onMouseLeave();
          }
        },
        ...props,
      });
    }

    return (
      <button
        ref={handleRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PopoverTrigger.displayName = 'PopoverTrigger';

export function PopoverContent({
  align = 'center',
  side = 'bottom',
  className = '',
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: PopoverContentProps) {
  const { open, triggerRef } = React.useContext(PopoverContext);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      // Calculate position based on side
      switch (side) {
        case 'top':
          top = triggerRect.top - contentRect.height - 8;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          break;
        case 'left':
          left = triggerRect.left - contentRect.width - 8;
          top = triggerRect.top;
          break;
        case 'right':
          left = triggerRect.right + 8;
          top = triggerRect.top;
          break;
      }

      // Calculate alignment
      if (side === 'top' || side === 'bottom') {
        switch (align) {
          case 'start':
            left = triggerRect.left;
            break;
          case 'center':
            left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
            break;
          case 'end':
            left = triggerRect.right - contentRect.width;
            break;
        }
      } else {
        switch (align) {
          case 'start':
            top = triggerRect.top;
            break;
          case 'center':
            top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
            break;
          case 'end':
            top = triggerRect.bottom - contentRect.height;
            break;
        }
      }

      setPosition({ top, left });
    }
  }, [open, side, align, triggerRef]);

  // Calculate initial animation values based on side
  const getInitialAnimation = () => {
    switch (side) {
      case 'top':
        return { opacity: 0, y: 8, scale: 0.96 };
      case 'bottom':
        return { opacity: 0, y: -8, scale: 0.96 };
      case 'left':
        return { opacity: 0, x: 8, scale: 0.96 };
      case 'right':
        return { opacity: 0, x: -8, scale: 0.96 };
      default:
        return { opacity: 0, scale: 0.96 };
    }
  };

  const getExitAnimation = () => {
    switch (side) {
      case 'top':
        return { opacity: 0, y: 4, scale: 0.98 };
      case 'bottom':
        return { opacity: 0, y: -4, scale: 0.98 };
      case 'left':
        return { opacity: 0, x: 4, scale: 0.98 };
      case 'right':
        return { opacity: 0, x: -4, scale: 0.98 };
      default:
        return { opacity: 0, scale: 0.98 };
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          className={`fixed z-50 rounded-lg border bg-[#0a0a0a] text-white shadow-md ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          {...props}
          initial={getInitialAnimation()}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={getExitAnimation()}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.5,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}