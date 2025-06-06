'use client';

import * as React from 'react';
import {
  motion,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from 'motion/react';

import { cn } from '@/lib/utils';

type ScrollProgressProps = React.ComponentProps<'div'> & {
  progressProps?: HTMLMotionProps<'div'>;
};

function ScrollProgress({
  ref,
  className,
  children,
  progressProps,
  ...props
}: ScrollProgressProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  const { scrollYProgress } = useScroll(
    children ? { container: containerRef } : undefined,
  );

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 40,
    bounce: 0,
  });

  return (
    <>
      <motion.div
        data-slot="scroll-progress"
        {...progressProps}
        style={{ scaleX }}
        className={cn(
          'fixed z-50 top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 origin-left',
          progressProps?.className,
        )}
      />
      {containerRef && (
        <div
          ref={containerRef}
          data-slot="scroll-progress-container"
          className={cn('overflow-y-auto h-full', className)}
          {...props}
        >
          {children}
        </div>
      )}
    </>
  );
}

export { ScrollProgress, type ScrollProgressProps };
