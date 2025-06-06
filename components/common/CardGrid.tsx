import React, { ReactNode } from 'react';

interface CardGridProps {
  children: ReactNode;
  className?: string;
}

/**
 * 自适应卡片网格组件
 * 默认每行显示3个卡片，在小屏幕上自动调整为1个或2个
 */
const CardGrid: React.FC<CardGridProps> = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center my-6 ${className}`}>
      {children}
    </div>
  );
};

export default CardGrid; 