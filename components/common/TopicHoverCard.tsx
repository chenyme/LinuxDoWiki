'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/animate-ui/radix/hover-card';
import { useTopicData } from '@/hooks/useDataCache';

/**
 * 话题数据接口定义
 */
interface TopicData {
  id: number;
  title: string;
  created_at: string;
  user_id: number;
  category_id: number;
  tags: string[];
  posts_count: number;
  views: number;
  like_count: number;
  last_posted_at: string;
  word_count: number;
  participant_count: number;
  details: {
    created_by: {
      username: string;
    };
  };
}

/**
 * TopicHoverCard 组件属性接口
 */
interface TopicHoverCardProps {
  topicId: string;
  defaultTitle?: string; // 可选的默认标题
}

/**
 * 默认配置常量
 */
const DEFAULT_CONFIG = {
  TOPIC_BASE_URL: 'https://linux.do/t/',
  ERROR_MESSAGE: '糟糕！该页面是一个不公开页面。\n您可能没有权限查看请求的资源。',
  LOADING_TITLE: '加载中...',
} as const;

/**
 * 话题悬停卡片组件
 * 显示话题标题，鼠标悬停时显示详细信息
 * 
 * @param topicId - 话题 ID
 * @param defaultTitle - 可选的默认标题
 * @returns React 组件
 */
export const TopicHoverCard = ({ topicId, defaultTitle }: TopicHoverCardProps) => {
  // 使用优化的数据缓存Hook
  const { data: topicData, loading, error } = useTopicData(topicId);

  /**
   * 获取话题标题
   */
  const getTopicTitle = useCallback((): string => {
    if (loading) {
      return DEFAULT_CONFIG.LOADING_TITLE;
    }
    
    if (error) {
      return defaultTitle ? `${defaultTitle} (未公开)` : `Linux Do 话题 #${topicId}`;
    }
    
    return topicData?.title || defaultTitle || `话题 #${topicId}`;
  }, [loading, error, topicData?.title, defaultTitle, topicId]);

  /**
   * 格式化数字显示
   */
  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }, []);

  /**
   * 格式化日期
   */
  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  /**
   * 渲染错误状态（未公开话题）
   */
  const renderErrorContent = () => (
    <div className="flex flex-col gap-6 p-2">
      {/* 错误图标和标题 */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">无法访问该话题</h3>
          <p className="text-sm text-muted-foreground">话题 #{topicId}</p>
        </div>
      </div>

      {/* 错误说明 */}
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {DEFAULT_CONFIG.ERROR_MESSAGE.replace('\n', ' ')}
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">您可以尝试：</p>
        <Link
          href={`${DEFAULT_CONFIG.TOPIC_BASE_URL}${topicId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          访问 Linux Do 话题 #{topicId}
        </Link>
      </div>
    </div>
  );

  /**
   * 渲染正常状态（公开话题）
   */
  const renderNormalContent = () => {
    if (!topicData) return null;

    return (
      <div className="flex flex-col gap-6 p-2">
        {/* 话题标题和基本信息 */}
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-foreground leading-tight line-clamp-3 text-lg">
              {topicData.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                #{topicId}
              </span>
            </div>
          </div>

          {/* 作者信息 */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {topicData.details.created_by.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-muted-foreground">作者</span>
            <span className="font-medium text-foreground">@{topicData.details.created_by.username}</span>
          </div>
        </div>

        {/* 标签 */}
        {topicData.tags && topicData.tags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">标签</p>
            <div className="flex flex-wrap gap-2">
              {topicData.tags.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
              {topicData.tags.length > 5 && (
                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs">
                  +{topicData.tags.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 统计信息 */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">话题统计</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">回复</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatNumber(topicData.posts_count)}
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">浏览</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatNumber(topicData.views)}
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">点赞</span>
                <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {formatNumber(topicData.like_count)}
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">参与</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {formatNumber(topicData.participant_count)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 时间信息 */}
        <div className="space-y-2 pt-4 border-t border-border/50">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>创建时间</span>
            <span className="font-medium">{formatDate(topicData.created_at)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>最后回复</span>
            <span className="font-medium">{formatDate(topicData.last_posted_at)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <span className="inline-flex items-center align-middle">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link
            href={`${DEFAULT_CONFIG.TOPIC_BASE_URL}${topicId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer align-middle no-underline hover:no-underline transition-all duration-200 hover:opacity-80 border-b border-dotted border-current"
            style={{ color: error ? "#fea000" : undefined }}
          >
            <span className="align-middle">{getTopicTitle()}</span>
          </Link>
        </HoverCardTrigger>
        
        <HoverCardContent className="w-[420px] max-h-[500px] overflow-y-auto">
          {error ? renderErrorContent() : renderNormalContent()}
        </HoverCardContent>
      </HoverCard>
    </span>
  );
}; 