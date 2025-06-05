'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/animate-ui/radix/hover-card';
import { useUserData } from '@/hooks/useDataCache';

/**
 * UserHoverCard 组件属性接口
 */
interface UserHoverCardProps {
  username: string;
}

/**
 * 默认配置常量
 */
const DEFAULT_CONFIG = {
  AVATAR_URL: '/logo.png',
  AVATAR_SIZE: '96',
  PROFILE_BASE_URL: 'https://linux.do/u/',
  DEFAULT_BIO: '这个用户还没有填写个人简介',
} as const;

/**
 * 用户悬停卡片组件
 * 显示用户头像和用户名，鼠标悬停时显示详细信息
 * 
 * @param username - 用户名
 * @returns React 组件
 */
export const UserHoverCard = ({ username }: UserHoverCardProps) => {
  // 使用优化的数据缓存Hook
  const { data: userData, loading } = useUserData(username);

  /**
   * 获取头像 URL
   */
  const getAvatarUrl = (size: string = DEFAULT_CONFIG.AVATAR_SIZE): string => {
    if (!userData?.avatar_template) {
      return DEFAULT_CONFIG.AVATAR_URL;
    }
    return `https://linux.do${userData.avatar_template.replace('/{size}', `/${size}`)}`;
  };

  /**
   * 获取用户显示名称
   */
  const getDisplayName = (): string => {
    return userData?.name || username;
  };

  /**
   * 获取用户简介
   */
  const getUserBio = (): string => {
    return userData?.bio_excerpt || DEFAULT_CONFIG.DEFAULT_BIO;
  };

  return (
    <span className="inline-flex items-center justify-center align-middle">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link
            href={`${DEFAULT_CONFIG.PROFILE_BASE_URL}${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 cursor-pointer align-middle no-underline hover:no-underline transition-opacity hover:opacity-80"
          >
            <Image
              src={getAvatarUrl('96')}
              alt={`${getDisplayName()}的头像`}
              className="size-5 rounded-full align-middle"
              width={24}
              height={24}
              loading="lazy"
            />
            <span className="align-middle items-center justify-center">@{username}</span>
          </Link>
        </HoverCardTrigger>
        
        <HoverCardContent className="w-80">
          <div className="flex flex-col gap-4">
            {/* 用户头像 */}
            <Image
              className="size-16 rounded-full border"
              src={getAvatarUrl('288')}
              alt={`${getDisplayName()}的头像`}
              width={64}
              height={64}
              loading="lazy"
            />
            
            {/* 用户信息 */}
            <div className="flex flex-col gap-4">
              {/* 基本信息 */}
              <div>
                <div className="font-bold text-foreground">
                  {loading ? '加载中...' : getDisplayName()}
                </div>
                <div className="text-sm text-muted-foreground">
                  @{username}
                </div>
              </div>
              
              {/* 用户简介 */}
              <div className="text-sm text-muted-foreground">
                {loading ? '加载中...' : getUserBio()}
              </div>
              
              {/* 统计信息 */}
              <div className="flex gap-4">
                <div className="flex gap-1 text-sm items-center">
                  <div className="font-bold">
                    {loading ? '-' : (userData?.trust_level ?? 0)}
                  </div>
                  <div className="text-muted-foreground">信任等级</div>
                </div>
                <div className="flex gap-1 text-sm items-center">
                  <div className="font-bold">
                    {loading ? '-' : (userData?.gamification_score ?? 0)}
                  </div>
                  <div className="text-muted-foreground">社区点数</div>
                </div>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </span>
  );
}; 