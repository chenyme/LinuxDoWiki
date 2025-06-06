'use client';

import Link from 'next/link';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/animate-ui/radix/hover-card';
import { useUserData } from '@/hooks/useDataCache';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

/**
 * UserHoverCard 组件属性接口
 */
interface UserHoverCardProps {
  username: string;
  showUsername?: boolean; // 是否显示 @username 文本，默认为 true
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'; // 头像尺寸，默认为 xs
}

/**
 * 默认配置常量
 */
const DEFAULT_CONFIG = {
  AVATAR_URL: '/logo.png',
  AVATAR_SIZE: '288',
  PROFILE_BASE_URL: 'https://linux.do/u/',
  DEFAULT_BIO: '这个用户还没有填写个人简介',
} as const;

/**
 * 清理HTML标签并处理特殊格式
 */
const cleanHtmlText = (htmlText: string): string => {
  if (!htmlText) return '';
  
  // 替换 <br> 标签为换行符
  let cleanText = htmlText.replace(/<br\s*\/?>/gi, '\n');
  
  // 处理链接标签
  cleanText = cleanText.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (match, href, text) => {
    // 清理链接文本中的HTML标签
    const cleanLinkText = text.replace(/<[^>]*>/g, '').trim();
    
    // 如果链接文本为空，只显示URL
    if (!cleanLinkText) {
      return href;
    }
    
    // 如果链接文本就是URL，只显示一次
    if (cleanLinkText === href) {
      return href;
    }
    
    // 显示格式：文本(URL)
    return `${cleanLinkText}(${href})`;
  });
  
  // 处理图片标签
  cleanText = cleanText.replace(/<img[^>]*>/gi, (match) => {
    // 提取title属性（emoji名称）
    const titleMatch = match.match(/title="([^"]*)"/i);
    if (titleMatch) {
      return titleMatch[1]; // 返回emoji名称，如 :wave:
    }
    
    // 提取alt属性作为备选
    const altMatch = match.match(/alt="([^"]*)"/i);
    if (altMatch) {
      return altMatch[1];
    }
    
    // 如果是emoji路径，尝试提取emoji名称
    const srcMatch = match.match(/src="[^"]*\/([^\/]*?)\.(png|gif|jpg|jpeg)/i);
    if (srcMatch && match.includes('emoji')) {
      return `:${srcMatch[1]}:`; // 返回 :emoji_name: 格式
    }
    
    // 其他图片显示占位符
    return '[图片]';
  });
  
  // 移除所有其他HTML标签，但保留内容
  cleanText = cleanText.replace(/<[^>]*>/g, '');
  
  // 解码HTML实体
  cleanText = cleanText
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  
  // 清理多余的空行和空格
  cleanText = cleanText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
    .trim();
  
  return cleanText;
};

/**
 * 获取头像尺寸类名
 */
const getAvatarSizeClass = (size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'): string => {
  switch (size) {
    case 'xs': return 'size-4';
    case 'sm': return 'size-6';
    case 'md': return 'size-8';
    case 'lg': return 'size-10';
    case 'xl': return 'size-12';
    case '2xl': return 'size-14';
    default: return 'size-5'; // 默认尺寸
  }
};

/**
 * 用户悬停卡片组件
 * 显示用户头像和用户名，鼠标悬停时显示详细信息
 * 
 * @param username - 用户名
 * @param showUsername - 是否显示 @username 文本，默认为 true
 * @param size - 头像尺寸，默认为 xs
 * @returns React 组件
 */
export const UserHoverCard = ({ username, showUsername = true, size = 'xs' }: UserHoverCardProps) => {
  // 使用优化的数据缓存Hook
  const { data: userData, loading } = useUserData(username);

  // 获取头像尺寸类名
  const avatarSizeClass = getAvatarSizeClass(size);

  /**
   * 获取头像 URL
   */
  const getAvatarUrl = (size: string = DEFAULT_CONFIG.AVATAR_SIZE): string => {
    if (!userData?.avatar_template) {
      return DEFAULT_CONFIG.AVATAR_URL;
    }
    return `https://linux.do${userData.avatar_template.replace('{size}', size)}`;
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
    const rawBio = userData?.bio_excerpt || DEFAULT_CONFIG.DEFAULT_BIO;
    return cleanHtmlText(rawBio);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`${DEFAULT_CONFIG.PROFILE_BASE_URL}${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 cursor-pointer align-middle no-underline hover:no-underline transition-opacity hover:opacity-80"
        >
            <Avatar className={avatarSizeClass}>
              <AvatarImage
                src={getAvatarUrl('288')}
                alt={`${getDisplayName()}的头像`}
                loading="lazy"
              />
              <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {showUsername && (
              <span className="align-middle items-center justify-center">@{username}</span>
            )}
          </Link>
        </HoverCardTrigger>
        
        <HoverCardContent className="w-80">
          <div className="flex flex-col gap-4">
            {/* 用户头像 */}
            <Avatar className="size-16 border">
              <AvatarImage
                src={getAvatarUrl('288')}
                alt={`${getDisplayName()}的头像`}
                loading="lazy"
              />
              <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
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
              <div className="text-sm text-muted-foreground whitespace-pre-line">
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
    );
}; 