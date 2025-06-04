/**
 * 数据缓存 React Hook
 * 提供优化的用户和话题数据获取功能
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { dataCache, UserData, TopicData } from '@/lib/data-cache';

/**
 * 使用用户数据的 Hook
 */
export function useUserData(username: string) {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const callbackRef = useRef<(() => void) | undefined>(undefined);

  // 更新状态的回调函数
  const updateState = useCallback(() => {
    const result = dataCache.getUserData(username);
    setData(result.data);
    setLoading(result.loading);
    setError(result.error);
  }, [username]);

  useEffect(() => {
    if (!username) {
      setData(null);
      setLoading(false);
      setError(true);
      return;
    }

    // 保存回调引用以便清理
    callbackRef.current = updateState;

    // 获取数据并设置更新回调
    const result = dataCache.getUserData(username, updateState);
    setData(result.data);
    setLoading(result.loading);
    setError(result.error);

    // 清理函数
    return () => {
      if (callbackRef.current) {
        dataCache.unsubscribeUser(username, callbackRef.current);
      }
    };
  }, [username, updateState]);

  return { data, loading, error };
}

/**
 * 使用话题数据的 Hook
 */
export function useTopicData(topicId: string) {
  const [data, setData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const callbackRef = useRef<(() => void) | undefined>(undefined);

  // 更新状态的回调函数
  const updateState = useCallback(() => {
    const result = dataCache.getTopicData(topicId);
    setData(result.data);
    setLoading(result.loading);
    setError(result.error);
  }, [topicId]);

  useEffect(() => {
    if (!topicId) {
      setData(null);
      setLoading(false);
      setError(true);
      return;
    }

    // 保存回调引用以便清理
    callbackRef.current = updateState;

    // 获取数据并设置更新回调
    const result = dataCache.getTopicData(topicId, updateState);
    setData(result.data);
    setLoading(result.loading);
    setError(result.error);

    // 清理函数
    return () => {
      if (callbackRef.current) {
        dataCache.unsubscribeTopic(topicId, callbackRef.current);
      }
    };
  }, [topicId, updateState]);

  return { data, loading, error };
}

/**
 * 使用多个用户数据的 Hook
 */
export function useMultipleUsers(usernames: string[]) {
  const [users, setUsers] = useState<Record<string, { data: UserData | null; loading: boolean; error: boolean }>>({});
  const callbacksRef = useRef<Record<string, () => void>>({});

  // 更新单个用户状态
  const updateUserState = useCallback((username: string) => {
    const result = dataCache.getUserData(username);
    setUsers(prev => ({
      ...prev,
      [username]: {
        data: result.data,
        loading: result.loading,
        error: result.error,
      },
    }));
  }, []);

  useEffect(() => {
    // 清理之前的订阅
    Object.entries(callbacksRef.current).forEach(([username, callback]) => {
      dataCache.unsubscribeUser(username, callback);
    });
    callbacksRef.current = {};

    // 为每个用户名设置数据获取和订阅
    const newUsers: Record<string, { data: UserData | null; loading: boolean; error: boolean }> = {};
    
    usernames.forEach(username => {
      if (username) {
        const callback = () => updateUserState(username);
        callbacksRef.current[username] = callback;
        
        const result = dataCache.getUserData(username, callback);
        newUsers[username] = {
          data: result.data,
          loading: result.loading,
          error: result.error,
        };
      }
    });

    setUsers(newUsers);

    // 预加载所有用户数据
    dataCache.preloadUsers(usernames.filter(Boolean));

    // 清理函数
    return () => {
      Object.entries(callbacksRef.current).forEach(([username, callback]) => {
        dataCache.unsubscribeUser(username, callback);
      });
    };
  }, [usernames.join(','), updateUserState]);

  return users;
}

/**
 * 使用多个话题数据的 Hook
 */
export function useMultipleTopics(topicIds: string[]) {
  const [topics, setTopics] = useState<Record<string, { data: TopicData | null; loading: boolean; error: boolean }>>({});
  const callbacksRef = useRef<Record<string, () => void>>({});

  // 更新单个话题状态
  const updateTopicState = useCallback((topicId: string) => {
    const result = dataCache.getTopicData(topicId);
    setTopics(prev => ({
      ...prev,
      [topicId]: {
        data: result.data,
        loading: result.loading,
        error: result.error,
      },
    }));
  }, []);

  useEffect(() => {
    // 清理之前的订阅
    Object.entries(callbacksRef.current).forEach(([topicId, callback]) => {
      dataCache.unsubscribeTopic(topicId, callback);
    });
    callbacksRef.current = {};

    // 为每个话题ID设置数据获取和订阅
    const newTopics: Record<string, { data: TopicData | null; loading: boolean; error: boolean }> = {};
    
    topicIds.forEach(topicId => {
      if (topicId) {
        const callback = () => updateTopicState(topicId);
        callbacksRef.current[topicId] = callback;
        
        const result = dataCache.getTopicData(topicId, callback);
        newTopics[topicId] = {
          data: result.data,
          loading: result.loading,
          error: result.error,
        };
      }
    });

    setTopics(newTopics);

    // 预加载所有话题数据
    dataCache.preloadTopics(topicIds.filter(Boolean));

    // 清理函数
    return () => {
      Object.entries(callbacksRef.current).forEach(([topicId, callback]) => {
        dataCache.unsubscribeTopic(topicId, callback);
      });
    };
  }, [topicIds.join(','), updateTopicState]);

  return topics;
}

/**
 * 预加载数据的 Hook
 */
export function usePreloadData() {
  const preloadUsers = useCallback((usernames: string[]) => {
    dataCache.preloadUsers(usernames.filter(Boolean));
  }, []);

  const preloadTopics = useCallback((topicIds: string[]) => {
    dataCache.preloadTopics(topicIds.filter(Boolean));
  }, []);

  return { preloadUsers, preloadTopics };
} 