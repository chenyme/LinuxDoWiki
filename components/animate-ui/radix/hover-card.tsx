'use client';

import * as React from 'react';
import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import {
  AnimatePresence,
  motion,
  type HTMLMotionProps,
  type Transition,
} from 'motion/react';

import { cn } from '@/lib/utils';

type HoverCardContextType = {
  isOpen: boolean;
};

const HoverCardContext = React.createContext<HoverCardContextType | undefined>(
  undefined,
);

const useHoverCard = (): HoverCardContextType => {
  const context = React.useContext(HoverCardContext);
  if (!context) {
    throw new Error('useHoverCard must be used within a HoverCard');
  }
  return context;
};

type Side = 'top' | 'bottom' | 'left' | 'right';

const getInitialPosition = (side: Side) => {
  switch (side) {
    case 'top':
      return { y: 15 };
    case 'bottom':
      return { y: -15 };
    case 'left':
      return { x: 15 };
    case 'right':
      return { x: -15 };
  }
};

type HoverCardProps = React.ComponentProps<typeof HoverCardPrimitive.Root>;

function HoverCard({ children, ...props }: HoverCardProps) {
  const [isOpen, setIsOpen] = React.useState(
    props?.open ?? props?.defaultOpen ?? false,
  );

  React.useEffect(() => {
    if (props?.open !== undefined) setIsOpen(props.open);
  }, [props?.open]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      setIsOpen(open);
      props.onOpenChange?.(open);
    },
    [props],
  );

  return (
    <HoverCardContext.Provider value={{ isOpen }}>
      <HoverCardPrimitive.Root
        data-slot="hover-card"
        {...props}
        onOpenChange={handleOpenChange}
      >
        {children}
      </HoverCardPrimitive.Root>
    </HoverCardContext.Provider>
  );
}

type HoverCardTriggerProps = React.ComponentProps<
  typeof HoverCardPrimitive.Trigger
>;

function HoverCardTrigger(props: HoverCardTriggerProps) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

type HoverCardContentProps = React.ComponentProps<
  typeof HoverCardPrimitive.Content
> &
  HTMLMotionProps<'div'> & {
    transition?: Transition;
  };

function HoverCardContent({
  className,
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  transition = { type: 'spring', stiffness: 300, damping: 25 },
  children,
  ...props
}: HoverCardContentProps) {
  const { isOpen } = useHoverCard();
  const initialPosition = getInitialPosition(side);

  return (
    <AnimatePresence>
      {isOpen && (
        <HoverCardPrimitive.Portal forceMount data-slot="hover-card-portal">
          <HoverCardPrimitive.Content
            forceMount
            align={align}
            sideOffset={sideOffset}
            className="z-50"
            {...props}
          >
            <motion.div
              key="hover-card-content"
              data-slot="hover-card-content"
              initial={{ opacity: 0, scale: 0.5, ...initialPosition }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, ...initialPosition }}
              transition={transition}
              className={cn(
                'w-64 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md outline-none',
                className,
              )}
              {...props}
            >
              {children}
            </motion.div>
          </HoverCardPrimitive.Content>
        </HoverCardPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  useHoverCard,
  type HoverCardContextType,
  type HoverCardProps,
  type HoverCardTriggerProps,
  type HoverCardContentProps,
};
