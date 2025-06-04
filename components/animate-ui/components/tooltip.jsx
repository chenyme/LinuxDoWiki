'use client';;
import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';

import { cn } from '@/lib/utils';

const GlobalTooltipContext = React.createContext(undefined);

const useGlobalTooltip = () => {
  const context = React.useContext(GlobalTooltipContext);
  if (!context) {
    throw new Error('useGlobalTooltip must be used within a TooltipProvider');
  }
  return context;
};

function getTooltipPosition(
  {
    rect,
    side,
    sideOffset,
    align,
    alignOffset
  }
) {
  switch (side) {
    case 'top':
      if (align === 'start') {
        return {
          x: rect.left + alignOffset,
          y: rect.top - sideOffset,
          transform: 'translate(0, -100%)',
          initial: { y: 15 },
        };
      } else if (align === 'end') {
        return {
          x: rect.right + alignOffset,
          y: rect.top - sideOffset,
          transform: 'translate(-100%, -100%)',
          initial: { y: 15 },
        };
      } else {
        // center
        return {
          x: rect.left + rect.width / 2,
          y: rect.top - sideOffset,
          transform: 'translate(-50%, -100%)',
          initial: { y: 15 },
        };
      }
    case 'bottom':
      if (align === 'start') {
        return {
          x: rect.left + alignOffset,
          y: rect.bottom + sideOffset,
          transform: 'translate(0, 0)',
          initial: { y: -15 },
        };
      } else if (align === 'end') {
        return {
          x: rect.right + alignOffset,
          y: rect.bottom + sideOffset,
          transform: 'translate(-100%, 0)',
          initial: { y: -15 },
        };
      } else {
        // center
        return {
          x: rect.left + rect.width / 2,
          y: rect.bottom + sideOffset,
          transform: 'translate(-50%, 0)',
          initial: { y: -15 },
        };
      }
    case 'left':
      if (align === 'start') {
        return {
          x: rect.left - sideOffset,
          y: rect.top + alignOffset,
          transform: 'translate(-100%, 0)',
          initial: { x: 15 },
        };
      } else if (align === 'end') {
        return {
          x: rect.left - sideOffset,
          y: rect.bottom + alignOffset,
          transform: 'translate(-100%, -100%)',
          initial: { x: 15 },
        };
      } else {
        // center
        return {
          x: rect.left - sideOffset,
          y: rect.top + rect.height / 2,
          transform: 'translate(-100%, -50%)',
          initial: { x: 15 },
        };
      }
    case 'right':
      if (align === 'start') {
        return {
          x: rect.right + sideOffset,
          y: rect.top + alignOffset,
          transform: 'translate(0, 0)',
          initial: { x: -15 },
        };
      } else if (align === 'end') {
        return {
          x: rect.right + sideOffset,
          y: rect.bottom + alignOffset,
          transform: 'translate(0, -100%)',
          initial: { x: -15 },
        };
      } else {
        // center
        return {
          x: rect.right + sideOffset,
          y: rect.top + rect.height / 2,
          transform: 'translate(0, -50%)',
          initial: { x: -15 },
        };
      }
  }
}

function TooltipProvider({
  children,
  openDelay = 700,
  closeDelay = 300,
  transition = { type: 'spring', stiffness: 300, damping: 25 }
}) {
  const globalId = React.useId();
  const [currentTooltip, setCurrentTooltip] =
    React.useState(null);
  const timeoutRef = React.useRef(null);
  const lastCloseTimeRef = React.useRef(0);

  const showTooltip = React.useCallback((data) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (currentTooltip !== null) {
      setCurrentTooltip(data);
      return;
    }
    const now = Date.now();
    const delay = now - lastCloseTimeRef.current < closeDelay ? 0 : openDelay;
    timeoutRef.current = window.setTimeout(() => setCurrentTooltip(data), delay);
  }, [openDelay, closeDelay, currentTooltip]);

  const hideTooltip = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setCurrentTooltip(null);
      lastCloseTimeRef.current = Date.now();
    }, closeDelay);
  }, [closeDelay]);

  const hideImmediate = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentTooltip(null);
    lastCloseTimeRef.current = Date.now();
  }, []);

  React.useEffect(() => {
    window.addEventListener('scroll', hideImmediate, true);
    return () => window.removeEventListener('scroll', hideImmediate, true);
  }, [hideImmediate]);

  return (
    <GlobalTooltipContext.Provider
      value={{
        showTooltip,
        hideTooltip,
        currentTooltip,
        transition,
        globalId,
      }}>
      <LayoutGroup>{children}</LayoutGroup>
      <TooltipOverlay />
    </GlobalTooltipContext.Provider>
  );
}

function TooltipArrow({
  side
}) {
  return (
    <div
      className={cn(
        'absolute bg-primary z-50 size-2.5 rotate-45 rounded-[2px]',
        (side === 'top' || side === 'bottom') && 'left-1/2 -translate-x-1/2',
        (side === 'left' || side === 'right') && 'top-1/2 -translate-y-1/2',
        side === 'top' && '-bottom-[3px]',
        side === 'bottom' && '-top-[3px]',
        side === 'left' && '-right-[3px]',
        side === 'right' && '-left-[3px]'
      )} />
  );
}

function TooltipPortal({
  children
}) {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => setIsMounted(true), []);
  return isMounted ? createPortal(children, document.body) : null;
}

function TooltipOverlay() {
  const { currentTooltip, transition, globalId } = useGlobalTooltip();

  const position = React.useMemo(() => {
    if (!currentTooltip) return null;
    return getTooltipPosition({
      rect: currentTooltip.rect,
      side: currentTooltip.side,
      sideOffset: currentTooltip.sideOffset,
      align: currentTooltip.align,
      alignOffset: currentTooltip.alignOffset,
    });
  }, [currentTooltip]);

  return (
    <AnimatePresence>
      {currentTooltip && currentTooltip.content && position && (
        <TooltipPortal>
          <motion.div
            data-slot="tooltip-overlay-container"
            className="fixed z-50"
            style={{
              top: position.y,
              left: position.x,
              transform: position.transform,
            }}>
            <motion.div
              data-slot="tooltip-overlay"
              layoutId={`tooltip-overlay-${globalId}`}
              initial={{ opacity: 0, scale: 0, ...position.initial }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0, ...position.initial }}
              transition={transition}
              className="relative rounded-md bg-primary fill-primary px-3 py-1.5 text-sm text-primary-foreground shadow-md w-fit text-balance">
              {currentTooltip.content}

              {currentTooltip.arrow && (
                <TooltipArrow side={currentTooltip.side} />
              )}
            </motion.div>
          </motion.div>
        </TooltipPortal>
      )}
    </AnimatePresence>
  );
}

const TooltipContext = React.createContext(undefined);

const useTooltip = () => {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider');
  }
  return context;
};

function Tooltip({
  children,
  side = 'top',
  sideOffset = 14,
  align = 'center',
  alignOffset = 0
}) {
  const id = React.useId();
  const [content, setContent] = React.useState(null);
  const [arrow, setArrow] = React.useState(true);

  return (
    <TooltipContext.Provider
      value={{
        content,
        setContent,
        arrow,
        setArrow,
        side,
        sideOffset,
        align,
        alignOffset,
        id,
      }}>
      {children}
    </TooltipContext.Provider>
  );
}

function TooltipContent({
  children,
  arrow = true
}) {
  const { setContent, setArrow } = useTooltip();
  React.useEffect(() => {
    setContent(children);
    setArrow(arrow);
  }, [children, setContent, setArrow, arrow]);
  return null;
}

function TooltipTrigger({
  children
}) {
  const { content, side, sideOffset, align, alignOffset, id, arrow } =
    useTooltip();
  const { showTooltip, hideTooltip, currentTooltip } = useGlobalTooltip();
  const triggerRef = React.useRef(null);

  const handleOpen = React.useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    showTooltip({
      content,
      rect,
      side,
      sideOffset,
      align,
      alignOffset,
      id,
      arrow,
    });
  }, [showTooltip, content, side, sideOffset, align, alignOffset, id, arrow]);

  const handleMouseEnter = React.useCallback((e) => {
    (children.props)?.onMouseEnter?.(e);
    handleOpen();
  }, [handleOpen, children.props]);

  const handleMouseLeave = React.useCallback((e) => {
    (children.props)?.onMouseLeave?.(e);
    hideTooltip();
  }, [hideTooltip, children.props]);

  const handleFocus = React.useCallback((e) => {
    (children.props)?.onFocus?.(e);
    handleOpen();
  }, [handleOpen, children.props]);

  const handleBlur = React.useCallback((e) => {
    (children.props)?.onBlur?.(e);
    hideTooltip();
  }, [hideTooltip, children.props]);

  return React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    'data-state': currentTooltip?.id === id ? 'open' : 'closed',
    'data-side': side,
    'data-align': align,
    'data-slot': 'tooltip-trigger'
  });
}

export { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger, useGlobalTooltip, useTooltip };
