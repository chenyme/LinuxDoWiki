'use client';;
import * as React from 'react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/animate-ui/components/tooltip';

function AvatarContainer({
  children,
  zIndex,
  transition,
  translate,
  ...props
}) {
  return (
    <Tooltip {...props}>
      <TooltipTrigger>
        <motion.div
          data-slot="avatar-container"
          initial="initial"
          whileHover="hover"
          whileTap="hover"
          className="relative"
          style={{ zIndex }}>
          <motion.div
            variants={{
              initial: { translateY: 0 },
              hover: { translateY: translate },
            }}
            transition={transition}>
            {children}
          </motion.div>
        </motion.div>
      </TooltipTrigger>
    </Tooltip>
  );
}

function AvatarGroupTooltip(props) {
  return <TooltipContent {...props} />;
}

function AvatarGroup({
  ref,
  children,
  className,
  transition = { type: 'spring', stiffness: 300, damping: 17 },
  invertOverlap = false,
  translate = '-30%',
  tooltipProps = { side: 'top', sideOffset: 24 },
  ...props
}) {
  return (
    <TooltipProvider openDelay={0} closeDelay={0}>
      <div
        ref={ref}
        data-slot="avatar-group"
        className={cn('flex flex-row -space-x-2 items-center h-8', className)}
        {...props}>
        {children?.map((child, index) => (
          <AvatarContainer
            key={index}
            zIndex={
              invertOverlap ? React.Children.count(children) - index : index
            }
            transition={transition}
            translate={translate}
            {...tooltipProps}>
            {child}
          </AvatarContainer>
        ))}
      </div>
    </TooltipProvider>
  );
}

export { AvatarGroup, AvatarGroupTooltip };
