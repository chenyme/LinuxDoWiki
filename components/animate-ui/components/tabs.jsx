'use client';;
import * as React from 'react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import {
  MotionHighlight,
  MotionHighlightItem,
} from '@/components/animate-ui/effects/motion-highlight';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TabsContext = React.createContext(undefined);

function useTabs() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
}

function Tabs(
  {
    defaultValue,
    value,
    onValueChange,
    children,
    className,
    ...props
  }
) {
  const [activeValue, setActiveValue] = React.useState(defaultValue ?? undefined);
  const triggersRef = React.useRef(new Map());
  const initialSet = React.useRef(false);
  const isControlled = value !== undefined;

  React.useEffect(() => {
    if (
      !isControlled &&
      activeValue === undefined &&
      triggersRef.current.size > 0 &&
      !initialSet.current
    ) {
      const firstTab = Array.from(triggersRef.current.keys())[0];
      setActiveValue(firstTab);
      initialSet.current = true;
    }
  }, [activeValue, isControlled]);

  const registerTrigger = (value, node) => {
    if (node) {
      triggersRef.current.set(value, node);
      if (!isControlled && activeValue === undefined && !initialSet.current) {
        setActiveValue(value);
        initialSet.current = true;
      }
    } else {
      triggersRef.current.delete(value);
    }
  };

  const handleValueChange = (val) => {
    if (!isControlled) setActiveValue(val);
    else onValueChange?.(val);
  };

  return (
    <TabsContext.Provider
      value={{
        activeValue: (value ?? activeValue),
        handleValueChange,
        registerTrigger,
      }}>
      <div
        data-slot="tabs"
        className={cn('flex flex-col gap-2', className)}
        {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({
  children,
  className,
  activeClassName,

  transition = {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  },

  ...props
}) {
  const { activeValue } = useTabs();

  return (
    <MotionHighlight
      controlledItems
      className={cn('rounded-sm bg-background shadow-sm', activeClassName)}
      value={activeValue}
      transition={transition}>
      <div
        role="tablist"
        data-slot="tabs-list"
        className={cn(
          'bg-muted text-muted-foreground inline-flex h-10 w-fit items-center justify-center rounded-lg p-[4px]',
          className
        )}
        {...props}>
        {children}
      </div>
    </MotionHighlight>
  );
}

function TabsTrigger({
  ref,
  value,
  children,
  className,
  ...props
}) {
  const { activeValue, handleValueChange, registerTrigger } = useTabs();

  const localRef = React.useRef(null);
  React.useImperativeHandle(ref, () => localRef.current);

  React.useEffect(() => {
    registerTrigger(value, localRef.current);
    return () => registerTrigger(value, null);
  }, [value, registerTrigger]);

  return (
    <MotionHighlightItem value={value} className="size-full">
      <motion.button
        ref={localRef}
        data-slot="tabs-trigger"
        role="tab"
        whileTap={{ scale: 0.95 }}
        onClick={() => handleValueChange(value)}
        data-state={activeValue === value ? 'active' : 'inactive'}
        className={cn(
          'inline-flex cursor-pointer items-center size-full justify-center whitespace-nowrap rounded-sm px-2 py-1 text-sm font-medium ring-offset-background transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground z-[1]',
          className
        )}
        {...props}>
        {children}
      </motion.button>
    </MotionHighlightItem>
  );
}

function TabsContents({
  children,
  className,

  transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    bounce: 0,
    restDelta: 0.01,
  },

  ...props
}) {
  const { activeValue } = useTabs();
  const childrenArray = React.Children.toArray(children);
  const activeIndex = childrenArray.findIndex(child => React.isValidElement(child) &&
  typeof child.props === 'object' &&
  child.props !== null &&
  'value' in child.props &&
  child.props.value === activeValue);

  return (
    <div
      data-slot="tabs-contents"
      className={cn('overflow-hidden', className)}
      {...props}>
      <motion.div
        className="flex -mx-2"
        animate={{ x: activeIndex * -100 + '%' }}
        transition={transition}>
        {childrenArray.map((child, index) => (
          <div key={index} className="w-full shrink-0 px-2">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function TabsContent({
  children,
  value,
  className,
  ...props
}) {
  const { activeValue } = useTabs();
  const isActive = activeValue === value;
  return (
    <motion.div
      role="tabpanel"
      data-slot="tabs-content"
      className={cn('overflow-hidden', className)}
      initial={{ filter: 'blur(0px)' }}
      animate={{ filter: isActive ? 'blur(0px)' : 'blur(4px)' }}
      exit={{ filter: 'blur(0px)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      {...props}>
      {children}
    </motion.div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContents, TabsContent, useTabs };
