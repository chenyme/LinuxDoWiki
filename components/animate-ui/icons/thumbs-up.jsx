'use client';;
import * as React from 'react';
import { motion } from 'motion/react';

import { getVariants, useAnimateIconContext, IconWrapper } from '@/components/animate-ui/icons/icon';

const animations = {
  default: {
    group: {
      initial: {
        rotate: 0,
      },
      animate: {
        rotate: [0, -20, -12],
        transformOrigin: 'bottom left',
        transition: {
          duration: 0.4,
          ease: 'easeInOut',
        },
      },
    },

    path1: {},
    path2: {}
  },

  'default-loop': {
    group: {
      initial: {
        rotate: 0,
      },
      animate: {
        rotate: [0, -20, 5, 0],
        transformOrigin: 'bottom left',
        transition: {
          duration: 0.8,
          ease: 'easeInOut',
        },
      },
    },

    path1: {},
    path2: {}
  }
};

function IconComponent({
  size,
  ...props
}) {
  const { controls } = useAnimateIconContext();
  const variants = getVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants.group}
      initial="initial"
      animate={controls}
      {...props}>
      <motion.path
        d="M7 10v12"
        variants={variants.path1}
        initial="initial"
        animate={controls} />
      <motion.path
        d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
        variants={variants.path2}
        initial="initial"
        animate={controls} />
    </motion.svg>
  );
}

function ThumbsUp(props) {
  return <IconWrapper icon={IconComponent} {...props} />;
}

export { animations, ThumbsUp, ThumbsUp as ThumbsUpIcon };
