'use client';

import { UserHoverCard } from './UserHoverCard';

/**
 * 用户组项目接口
 */
interface UserGroupItem {
  username: string;
  title?: string;
  description?: string;
}

/**
 * 用户组接口
 */
interface UserGroupTooltipProps {
  users: UserGroupItem[];
  maxDisplay?: number;
  className?: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 用户组头像工具提示组件
 */
export const UserGroupTooltip = ({ 
  users, 
  maxDisplay = 5,
  className = '',
  title,
  size = 'md',
}: UserGroupTooltipProps) => {
  // 分割用户：显示的和剩余的
  const displayUsers = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;
  
  // 根据尺寸获取样式
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          avatarSize: 'size-8',    // 外层容器 32px
          overlap: '-ml-2',
          height: 'h-8',
          hoverCardSize: 'md' as const // UserHoverCard md = size-8 = 32px ✓
        };
      case 'lg':
        return {
          avatarSize: 'size-14',   // 外层容器 56px  
          overlap: '-ml-3',
          height: 'h-14',
          hoverCardSize: '2xl' as const // UserHoverCard 2xl = size-14 = 56px ✓
        };
      case 'md':
      default:
        return {
          avatarSize: 'size-12',   // 外层容器 48px
          overlap: '-ml-3',
          height: 'h-12',
          hoverCardSize: 'xl' as const // UserHoverCard xl = size-12 = 48px ✓
        };
    }
  };
  
  const styles = getSizeStyles();
  
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {title && <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>}
      
      {/* 用户头像重叠列表 */}
      <div className={`flex items-center ${styles.height}`}>
        {displayUsers.map((user, index) => (
          <div 
            key={user.username}
            className={`relative ${index > 0 ? styles.overlap : ''} hover:z-10 transition-all duration-200 hover:scale-110`}
            style={{ zIndex: displayUsers.length - index }}
          >
            <div className={`${styles.avatarSize} rounded-full border-2 border-background overflow-hidden`}>
              <UserHoverCard username={user.username} showUsername={false} size={styles.hoverCardSize} />
            </div>
          </div>
        ))}
        
        {/* 显示剩余用户数量的圆圈 */}
        {remainingCount > 0 && (
          <div 
            className={`relative ${styles.overlap} flex items-center justify-center ${styles.avatarSize} rounded-full bg-muted border-2 border-background text-xs font-medium text-muted-foreground`}
            style={{ zIndex: 0 }}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}; 