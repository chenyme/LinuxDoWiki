'use client';;
import * as React from 'react';
import { useAnimation } from 'motion/react';

import { cn } from '@/lib/utils';

const staticAnimations = {
  path: {
    initial: { pathLength: 1, opacity: 1 },

    animate: {
      pathLength: [0.05, 1],
      opacity: [0, 1],
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
        opacity: { duration: 0.01 },
      },
    }
  },

  'path-loop': {
    initial: { pathLength: 1, opacity: 1 },

    animate: {
      pathLength: [1, 0.05, 1],
      opacity: [1, 0, 1],
      transition: {
        duration: 1.6,
        ease: 'easeInOut',
        opacity: { duration: 0.01 },
      },
    }
  }
};

const AnimateIconContext = React.createContext(null);

function useAnimateIconContext() {
  const context = React.useContext(AnimateIconContext);
  if (!context)
    return {
      controls: undefined,
      animation: 'default',
      loop: false,
      loopDelay: 0,
    };
  return context;
}

function AnimateIcon({
  animate,
  onAnimateChange,
  animateOnHover,
  animateOnTap,
  animation = 'default',
  loop = false,
  loopDelay = 0,
  onAnimateStart,
  onAnimateEnd,
  children
}) {
  const controls = useAnimation();
  const [localAnimate, setLocalAnimate] = React.useState(!!animate);
  const currentAnimation = React.useRef(animation);

  const startAnimation = React.useCallback((trigger) => {
    currentAnimation.current =
      typeof trigger === 'string' ? trigger : animation;
    setLocalAnimate(true);
  }, [animation]);

  const stopAnimation = React.useCallback(() => {
    setLocalAnimate(false);
  }, []);

  React.useEffect(() => {
    currentAnimation.current =
      typeof animate === 'string' ? animate : animation;
    setLocalAnimate(!!animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);

  React.useEffect(
    () => onAnimateChange?.(localAnimate, currentAnimation.current),
    [localAnimate, onAnimateChange]
  );

  React.useEffect(() => {
    if (localAnimate) onAnimateStart?.();
    controls.start(localAnimate ? 'animate' : 'initial').then(() => {
      if (localAnimate) onAnimateEnd?.();
    });
  }, [localAnimate, controls, onAnimateStart, onAnimateEnd]);

  const handleMouseEnter = (e) => {
    if (animateOnHover) startAnimation(animateOnHover);
    children.props?.onMouseEnter?.(e);
  };
  const handleMouseLeave = (e) => {
    if (animateOnHover || animateOnTap) stopAnimation();
    children.props?.onMouseLeave?.(e);
  };
  const handlePointerDown = (e) => {
    if (animateOnTap) startAnimation(animateOnTap);
    children.props?.onPointerDown?.(e);
  };
  const handlePointerUp = (e) => {
    if (animateOnTap) stopAnimation();
    children.props?.onPointerUp?.(e);
  };

  const child = React.Children.only(children);
  const cloned = React.cloneElement(child, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
  });

  return (
    <AnimateIconContext.Provider
      value={{
        controls,
        animation: currentAnimation.current,
        loop,
        loopDelay,
      }}>
      {cloned}
    </AnimateIconContext.Provider>
  );
}

const pathClassName =
  "[&_[stroke-dasharray='1px_1px']]:![stroke-dasharray:1px_0px]";

function IconWrapper(
  {
    size = 28,
    animation: animationProp,
    animate,
    onAnimateChange,
    animateOnHover = false,
    animateOnTap = false,
    icon: IconComponent,
    loop = false,
    loopDelay = 0,
    onAnimateStart,
    onAnimateEnd,
    className,
    ...props
  }
) {
  const context = React.useContext(AnimateIconContext);

  if (context) {
    const {
      controls,
      animation: parentAnimation,
      loop: parentLoop,
      loopDelay: parentLoopDelay,
    } = context;
    const animationToUse = animationProp ?? parentAnimation;
    const loopToUse = loop || parentLoop;
    const loopDelayToUse = loopDelay || parentLoopDelay;

    return (
      <AnimateIconContext.Provider
        value={{
          controls,
          animation: animationToUse,
          loop: loopToUse,
          loopDelay: loopDelayToUse,
        }}>
        <IconComponent
          size={size}
          className={cn(
            className,
            (animationToUse === 'path' || animationToUse === 'path-loop') &&
              pathClassName
          )}
          {...props} />
      </AnimateIconContext.Provider>
    );
  }

  if (
    animate !== undefined ||
    onAnimateChange !== undefined ||
    animateOnHover ||
    animateOnTap ||
    animationProp
  ) {
    return (
      <AnimateIcon
        animate={animate}
        onAnimateChange={onAnimateChange}
        animateOnHover={animateOnHover}
        animateOnTap={animateOnTap}
        animation={animationProp}
        loop={loop}
        loopDelay={loopDelay}
        onAnimateStart={onAnimateStart}
        onAnimateEnd={onAnimateEnd}>
        <IconComponent
          size={size}
          className={cn(className, (animationProp === 'path' || animationProp === 'path-loop') &&
            pathClassName)}
          {...props} />
      </AnimateIcon>
    );
  }

  return (
    <IconComponent
      size={size}
      className={cn(className, (animationProp === 'path' || animationProp === 'path-loop') &&
        pathClassName)}
      {...props} />
  );
}

function getVariants(animations) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { animation: animationType, loop, loopDelay } = useAnimateIconContext();

  let result;

  if (animationType in staticAnimations) {
    const variant = staticAnimations[animationType];
    result = {};
    for (const key in animations.default) {
      if (
        (animationType === 'path' || animationType === 'path-loop') &&
        key.includes('group')
      )
        continue;
      result[key] = variant;
    }
  } else {
    result = (animations[animationType]) ?? animations.default;
  }

  if (loop) {
    for (const key in result) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = result[key];
      const transition = state.animate?.transition;
      if (!transition) continue;

      const hasNestedKeys = Object.values(transition).some((v) =>
        typeof v === 'object' &&
        v !== null &&
        ('ease' in v || 'duration' in v || 'times' in v));

      if (hasNestedKeys) {
        for (const prop in transition) {
          const subTrans = transition[prop];
          if (typeof subTrans === 'object' && subTrans !== null) {
            transition[prop] = {
              ...subTrans,
              repeat: Infinity,
              repeatType: 'loop',
              repeatDelay: loopDelay,
            };
          }
        }
      } else {
        state.animate.transition = {
          ...transition,
          repeat: Infinity,
          repeatType: 'loop',
          repeatDelay: loopDelay,
        };
      }
    }
  }

  return result;
}

export { pathClassName, staticAnimations, AnimateIcon, IconWrapper, useAnimateIconContext, getVariants };
