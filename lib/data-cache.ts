/**
 * 全局数据缓存管理器
 * 统一管理用户和话题数据的获取、缓存和去重
 */

// 缓存条目接口
interface CacheEntry<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
  timestamp: number;
  promise?: Promise<T>;
}

// 用户数据接口
export interface UserData {
  id: number;
  username: string;
  name: string;
  avatar_template: string;
  bio_excerpt: string;
  email?: string;
  trust_level: number;
  created_at: string;
  gamification_score?: number;
}

// 话题数据接口
export interface TopicData {
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

// 配置常量
const CACHE_CONFIG = {
  // 缓存过期时间（毫秒）
  USER_CACHE_TTL: 5 * 60 * 1000,    // 5分钟
  TOPIC_CACHE_TTL: 2 * 60 * 1000,   // 2分钟
  // 批量请求延迟时间（毫秒）
  BATCH_DELAY: 50,
  // 最大批量请求数量
  MAX_BATCH_SIZE: 10,
} as const;

/**
 * 数据缓存管理器类
 */
class DataCacheManager {
  private userCache = new Map<string, CacheEntry<UserData>>();
  private topicCache = new Map<string, CacheEntry<TopicData>>();
  
  // 批量请求队列
  private userBatchQueue: string[] = [];
  private topicBatchQueue: string[] = [];
  private userBatchTimer: NodeJS.Timeout | null = null;
  private topicBatchTimer: NodeJS.Timeout | null = null;
  
  // 订阅者管理
  private userSubscribers = new Map<string, Set<() => void>>();
  private topicSubscribers = new Map<string, Set<() => void>>();

  /**
   * 检查缓存是否过期
   */
  private isCacheExpired(entry: CacheEntry<any>, ttl: number): boolean {
    return Date.now() - entry.timestamp > ttl;
  }

  /**
   * 通知订阅者数据更新
   */
  private notifySubscribers<T>(subscribers: Map<string, Set<() => void>>, key: string) {
    const subs = subscribers.get(key);
    if (subs) {
      subs.forEach(callback => callback());
    }
  }

  /**
   * 添加订阅者
   */
  private addSubscriber(subscribers: Map<string, Set<() => void>>, key: string, callback: () => void) {
    if (!subscribers.has(key)) {
      subscribers.set(key, new Set());
    }
    subscribers.get(key)!.add(callback);
  }

  /**
   * 移除订阅者
   */
  private removeSubscriber(subscribers: Map<string, Set<() => void>>, key: string, callback: () => void) {
    const subs = subscribers.get(key);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) {
        subscribers.delete(key);
      }
    }
  }

  /**
   * 批量获取用户数据
   */
  private async batchFetchUsers(usernames: string[]): Promise<void> {
    const promises = usernames.map(async (username) => {
      try {
        const response = await fetch(`/api/users/${username}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // 更新缓存
        this.userCache.set(username, {
          data: data.user,
          loading: false,
          error: false,
          timestamp: Date.now(),
        });
        
        // 通知订阅者
        this.notifySubscribers(this.userSubscribers, username);
      } catch (error) {
        console.warn(`Failed to fetch user ${username}:`, error);
        
        // 设置错误状态
        this.userCache.set(username, {
          data: {
            id: 0,
            username: username,
            name: username,
            avatar_template: '',
            bio_excerpt: '',
            trust_level: 0,
            created_at: '',
            gamification_score: 0,
          },
          loading: false,
          error: true,
          timestamp: Date.now(),
        });
        
        this.notifySubscribers(this.userSubscribers, username);
      }
    });

    await Promise.all(promises);
  }

  /**
   * 批量获取话题数据
   */
  private async batchFetchTopics(topicIds: string[]): Promise<void> {
    const promises = topicIds.map(async (topicId) => {
      try {
        const response = await fetch(`/api/topics/${topicId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // 更新缓存
        this.topicCache.set(topicId, {
          data: data,
          loading: false,
          error: false,
          timestamp: Date.now(),
        });
        
        // 通知订阅者
        this.notifySubscribers(this.topicSubscribers, topicId);
      } catch (error) {
        console.warn(`Failed to fetch topic ${topicId}:`, error);
        
        // 设置错误状态
        this.topicCache.set(topicId, {
          data: null,
          loading: false,
          error: true,
          timestamp: Date.now(),
        });
        
        this.notifySubscribers(this.topicSubscribers, topicId);
      }
    });

    await Promise.all(promises);
  }

  /**
   * 处理用户批量请求
   */
  private processBatchUsers = async () => {
    if (this.userBatchQueue.length === 0) return;
    
    const batch = this.userBatchQueue.splice(0, CACHE_CONFIG.MAX_BATCH_SIZE);
    await this.batchFetchUsers(batch);
    
    // 如果还有队列，继续处理
    if (this.userBatchQueue.length > 0) {
      this.userBatchTimer = setTimeout(this.processBatchUsers, CACHE_CONFIG.BATCH_DELAY);
    } else {
      this.userBatchTimer = null;
    }
  };

  /**
   * 处理话题批量请求
   */
  private processBatchTopics = async () => {
    if (this.topicBatchQueue.length === 0) return;
    
    const batch = this.topicBatchQueue.splice(0, CACHE_CONFIG.MAX_BATCH_SIZE);
    await this.batchFetchTopics(batch);
    
    // 如果还有队列，继续处理
    if (this.topicBatchQueue.length > 0) {
      this.topicBatchTimer = setTimeout(this.processBatchTopics, CACHE_CONFIG.BATCH_DELAY);
    } else {
      this.topicBatchTimer = null;
    }
  };

  /**
   * 获取用户数据
   */
  getUserData(username: string, onUpdate?: () => void): CacheEntry<UserData> {
    if (!username) {
      return { data: null, loading: false, error: true, timestamp: 0 };
    }

    // 添加订阅者
    if (onUpdate) {
      this.addSubscriber(this.userSubscribers, username, onUpdate);
    }

    const cached = this.userCache.get(username);
    
    // 如果有有效缓存，直接返回
    if (cached && !this.isCacheExpired(cached, CACHE_CONFIG.USER_CACHE_TTL)) {
      return cached;
    }

    // 如果正在加载，返回加载状态
    if (cached?.loading) {
      return cached;
    }

    // 设置加载状态
    const loadingEntry: CacheEntry<UserData> = {
      data: null,
      loading: true,
      error: false,
      timestamp: Date.now(),
    };
    this.userCache.set(username, loadingEntry);

    // 添加到批量请求队列
    if (!this.userBatchQueue.includes(username)) {
      this.userBatchQueue.push(username);
    }

    // 启动批量处理器
    if (!this.userBatchTimer) {
      this.userBatchTimer = setTimeout(this.processBatchUsers, CACHE_CONFIG.BATCH_DELAY);
    }

    return loadingEntry;
  }

  /**
   * 获取话题数据
   */
  getTopicData(topicId: string, onUpdate?: () => void): CacheEntry<TopicData> {
    if (!topicId) {
      return { data: null, loading: false, error: true, timestamp: 0 };
    }

    // 添加订阅者
    if (onUpdate) {
      this.addSubscriber(this.topicSubscribers, topicId, onUpdate);
    }

    const cached = this.topicCache.get(topicId);
    
    // 如果有有效缓存，直接返回
    if (cached && !this.isCacheExpired(cached, CACHE_CONFIG.TOPIC_CACHE_TTL)) {
      return cached;
    }

    // 如果正在加载，返回加载状态
    if (cached?.loading) {
      return cached;
    }

    // 设置加载状态
    const loadingEntry: CacheEntry<TopicData> = {
      data: null,
      loading: true,
      error: false,
      timestamp: Date.now(),
    };
    this.topicCache.set(topicId, loadingEntry);

    // 添加到批量请求队列
    if (!this.topicBatchQueue.includes(topicId)) {
      this.topicBatchQueue.push(topicId);
    }

    // 启动批量处理器
    if (!this.topicBatchTimer) {
      this.topicBatchTimer = setTimeout(this.processBatchTopics, CACHE_CONFIG.BATCH_DELAY);
    }

    return loadingEntry;
  }

  /**
   * 取消订阅
   */
  unsubscribeUser(username: string, callback: () => void): void {
    this.removeSubscriber(this.userSubscribers, username, callback);
  }

  unsubscribeTopic(topicId: string, callback: () => void): void {
    this.removeSubscriber(this.topicSubscribers, topicId, callback);
  }

  /**
   * 清除过期缓存
   */
  clearExpiredCache(): void {
    const now = Date.now();
    
    // 清除过期的用户缓存
    for (const [key, entry] of this.userCache.entries()) {
      if (this.isCacheExpired(entry, CACHE_CONFIG.USER_CACHE_TTL)) {
        this.userCache.delete(key);
      }
    }
    
    // 清除过期的话题缓存
    for (const [key, entry] of this.topicCache.entries()) {
      if (this.isCacheExpired(entry, CACHE_CONFIG.TOPIC_CACHE_TTL)) {
        this.topicCache.delete(key);
      }
    }
  }

  /**
   * 预加载数据
   */
  preloadUsers(usernames: string[]): void {
    const toLoad = usernames.filter(username => {
      const cached = this.userCache.get(username);
      return !cached || this.isCacheExpired(cached, CACHE_CONFIG.USER_CACHE_TTL);
    });

    toLoad.forEach(username => {
      if (!this.userBatchQueue.includes(username)) {
        this.userBatchQueue.push(username);
      }
    });

    if (toLoad.length > 0 && !this.userBatchTimer) {
      this.userBatchTimer = setTimeout(this.processBatchUsers, CACHE_CONFIG.BATCH_DELAY);
    }
  }

  preloadTopics(topicIds: string[]): void {
    const toLoad = topicIds.filter(topicId => {
      const cached = this.topicCache.get(topicId);
      return !cached || this.isCacheExpired(cached, CACHE_CONFIG.TOPIC_CACHE_TTL);
    });

    toLoad.forEach(topicId => {
      if (!this.topicBatchQueue.includes(topicId)) {
        this.topicBatchQueue.push(topicId);
      }
    });

    if (toLoad.length > 0 && !this.topicBatchTimer) {
      this.topicBatchTimer = setTimeout(this.processBatchTopics, CACHE_CONFIG.BATCH_DELAY);
    }
  }
}

// 全局单例实例
export const dataCache = new DataCacheManager();

// 定期清理过期缓存
if (typeof window !== 'undefined') {
  setInterval(() => {
    dataCache.clearExpiredCache();
  }, 60000); // 每分钟清理一次
} 