'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/animate-ui/radix/hover-card';
import { useTopicData } from '@/hooks/useDataCache';

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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="p-4"
    >
      {/* 错误状态头部 */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            私密话题
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            话题 #{topicId}
          </p>
        </div>
      </div>

      {/* 错误说明 */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-4">
        <p className="text-xs text-gray-600 dark:text-gray-300">
          这是一个私密话题，您可能没有权限查看请求的资源。
        </p>
      </div>

      {/* 操作按钮 */}
      <Link
        href={`${DEFAULT_CONFIG.TOPIC_BASE_URL}${topicId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center justify-center gap-2 w-full px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md transition-colors text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-200"
      >
        <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        尝试访问话题
      </Link>
    </motion.div>
  );

  /**
   * 渲染正常状态（公开话题）
   */
  const renderNormalContent = () => {
    if (!topicData) return null;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="p-4"
      >
        {/* 话题头部 */}
        <div className="mb-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight line-clamp-2 mb-1">
                {topicData.title}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                #{topicId}
              </span>
            </div>
          </div>

          {/* 作者信息 */}
          <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-900">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
              {topicData.details.created_by.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                @{topicData.details.created_by.username}
              </p>
            </div>
          </div>
        </div>

        {/* 标签 */}
        {topicData.tags && topicData.tags.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">标签</p>
            <div className="flex flex-wrap gap-1">
              {topicData.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                >
                  {tag}
                </span>
              ))}
              {topicData.tags.length > 4 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  +{topicData.tags.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 统计信息 */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">统计数据</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '回复', value: topicData.posts_count, icon: '💬' },
              { label: '浏览', value: topicData.views, icon: '👁️' },
              { label: '点赞', value: topicData.like_count, icon: '❤️' },
              { label: '参与', value: topicData.participant_count, icon: '👥' }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-2 rounded-md bg-gray-50 dark:bg-gray-900"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.label}</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(stat.value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 时间信息 */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">创建时间</span>
              <span className="text-gray-900 dark:text-gray-100">{formatDate(topicData.created_at)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">最后回复</span>
              <span className="text-gray-900 dark:text-gray-100">{formatDate(topicData.last_posted_at)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <span className="inline-flex items-center justify-center">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link
            href={`${DEFAULT_CONFIG.TOPIC_BASE_URL}${topicId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer inline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors underline underline-offset-2 decoration-1 hover:decoration-2"
            style={{ color: error ? "#f59e0b" : undefined }}
          >
            {getTopicTitle()}
          </Link>
        </HoverCardTrigger>
        
        <HoverCardContent className="w-80 p-0 border shadow-xl bg-white dark:bg-gray-950">
          {error ? renderErrorContent() : renderNormalContent()}
        </HoverCardContent>
      </HoverCard>
    </span>
  );
}; 