'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/animate-ui/radix/hover-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

/**
 * 用户数据接口
 */
interface UserData {
  id: number;
  username: string;
  name: string;
  avatar_template: string;
  bio_excerpt: string;
  trust_level: number;
  created_at: string;
  gamification_score?: number;
}

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
  size?: 'sm' | 'md' | 'lg';
  maxDisplay?: number;
  className?: string;
  title?: string;
}

/**
 * 用户数据状态接口
 */
interface UserDataState {
  [key: string]: {
    data: UserData | null;
    loading: boolean;
    error: boolean;
  };
}

/**
 * 默认配置常量
 */
const DEFAULT_CONFIG = {
  AVATAR_URL: '/logo.png',
  PROFILE_BASE_URL: 'https://linux.do/u/',
  DEFAULT_BIO: '这个用户还没有填写个人简介',
  FALLBACK_COLORS: [
    'from-blue-500 to-indigo-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-violet-500',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-cyan-500 to-teal-500',
  ],
} as const;

/**
 * 获取头像尺寸
 */
const getAvatarSize = (size?: 'sm' | 'md' | 'lg'): string => {
  switch (size) {
    case 'sm': return 'size-8';
    case 'lg': return 'size-14';
    case 'md':
    default: return 'size-12';
  }
};

/**
 * 获取随机渐变颜色
 */
const getRandomGradient = (username: string): string => {
  const index = username.charCodeAt(0) % DEFAULT_CONFIG.FALLBACK_COLORS.length;
  return DEFAULT_CONFIG.FALLBACK_COLORS[index];
};

/**
 * 用户组头像工具提示组件
 */
export const UserGroupTooltip = ({ 
  users, 
  size = 'md', 
  maxDisplay = 5,
  className = '',
  title,
}: UserGroupTooltipProps) => {
  // 用户数据状态
  const [usersData, setUsersData] = useState<UserDataState>({});
  
  // 获取单个用户数据
  const fetchUserData = useCallback(async (username: string) => {
    if (!username) return;
    
    // 如果已经有数据或正在加载，则跳过
    if (usersData[username] && (usersData[username].data || usersData[username].loading)) {
      return;
    }
    
    // 设置加载状态
    setUsersData(prev => ({
      ...prev,
      [username]: { data: null, loading: true, error: false }
    }));
    
    try {
      const response = await fetch(`/api/users/${username}`);
      
      const data = await response.json();
      
      setUsersData(prev => ({
        ...prev,
        [username]: { data: data.user, loading: false, error: false }
      }));
    } catch {
      // 静默失败，设置默认数据
      setUsersData(prev => ({
        ...prev,
        [username]: {
          data: {
            id: 0,
            username: username,
            name: username,
            avatar_template: '/logo.png',
            bio_excerpt: '这是一个神秘的用户',
            trust_level: 0,
            created_at: new Date().toISOString(),
            gamification_score: 0,
          },
          loading: false,
          error: false
        }
      }));
    }
  }, [usersData]);
  
  // 获取所有用户数据
  const fetchAllUsersData = useCallback(async () => {
    const promises = users.map(user => fetchUserData(user.username));
    await Promise.all(promises);
  }, [users, fetchUserData]);
  
  // 组件挂载时获取所有用户数据
  useEffect(() => {
    fetchAllUsersData();
  }, [fetchAllUsersData]);
  
  // 获取用户头像URL  
  const getAvatarUrl = (username: string, size: string = '288'): string => {
    const userData = usersData[username];
    if (!userData?.data?.avatar_template) {
      return DEFAULT_CONFIG.AVATAR_URL;
    }
    return `https://linux.do${userData.data.avatar_template.replace('{size}', size)}`;
  };
  
  // 获取用户显示名称
  const getDisplayName = (username: string): string => {
    const userData = usersData[username];
    return userData?.data?.name || username;
  };
  
  // 获取用户简介
  const getUserBio = (username: string): string => {
    const userData = usersData[username];
    return userData?.data?.bio_excerpt || DEFAULT_CONFIG.DEFAULT_BIO;
  };
  
  // 头像尺寸类
  const avatarSizeClass = getAvatarSize(size);
  
  // 分割用户：显示的和剩余的
  const displayUsers = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;
  
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {title && <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>}
      
      <div className={`flex -space-x-3 h-${avatarSizeClass.split('-')[1]}`}>
        {/* 显示的用户头像 */}
        {displayUsers.map((user) => (
          <HoverCard key={user.username}>
            <HoverCardTrigger asChild>
              <Link
                href={`${DEFAULT_CONFIG.PROFILE_BASE_URL}${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={`${avatarSizeClass} border-3 border-background cursor-pointer relative flex shrink-0 overflow-hidden`}>
                  <Avatar className="h-full w-full">
                    <AvatarImage src={getAvatarUrl(user.username, '120')} alt={getDisplayName(user.username)} />
                    <AvatarFallback className={`bg-gradient-to-br ${getRandomGradient(user.username)}`}>
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Link>
            </HoverCardTrigger>
            
            <HoverCardContent className="w-80">
              <div className="flex flex-col gap-4">
                {/* 用户头像 */}
                <div className="flex items-center gap-4">
                  <Avatar className="size-16 border">
                    <AvatarImage src={getAvatarUrl(user.username, '288')} alt={getDisplayName(user.username)} />
                    <AvatarFallback className={`bg-gradient-to-br ${getRandomGradient(user.username)}`}>
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-bold text-foreground">
                      {getDisplayName(user.username)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      @{user.username}
                    </div>
                    {user.title && (
                      <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full mt-1 inline-block">
                        {user.title}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 用户简介 */}
                <div className="text-sm text-muted-foreground">
                  {getUserBio(user.username)}
                </div>
                
                {/* 描述（如果有） */}
                {user.description && (
                  <div className="text-sm bg-muted p-3 rounded-lg">
                    {user.description}
                  </div>
                )}
                
                {/* 统计信息 */}
                <div className="flex gap-4">
                  <div className="flex gap-1 text-sm items-center">
                    <div className="font-bold">
                      {usersData[user.username]?.data?.trust_level ?? 0}
                    </div>
                    <div className="text-muted-foreground">信任等级</div>
                  </div>
                  <div className="flex gap-1 text-sm items-center">
                    <div className="font-bold">
                      {usersData[user.username]?.data?.gamification_score ?? 0}
                    </div>
                    <div className="text-muted-foreground">社区点数</div>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
        
        {/* 显示剩余用户数量 */}
        {remainingCount > 0 && (
          <div className={`${avatarSizeClass} border-3 border-background rounded-full bg-muted text-muted-foreground flex items-center justify-center`}>
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}; 