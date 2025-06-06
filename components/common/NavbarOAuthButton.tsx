'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { FlipButton } from '@/components/animate-ui/buttons/flip';
import { Loader } from 'lucide-react';

interface NavbarOAuthButtonProps {
  className?: string;
}

const NavbarOAuthButton: React.FC<NavbarOAuthButtonProps> = ({ 
  className = "ml-2" 
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 获取cookie辅助函数
  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };

  // 检查用户登录状态
  const checkUserLoginStatus = useCallback(() => {
    setIsLoading(true);
    
    try {
      // 尝试从cookie中获取用户信息
      const userCookie = getCookie('oauth_user');
      
      if (userCookie) {
        try {
          // 先解码URL编码的cookie值，再解析JSON
          const decodedCookie = decodeURIComponent(userCookie);
          const userData = JSON.parse(decodedCookie);
          setIsLoggedIn(true);
          setUserName(userData.name || 'User');
        } catch (e) {
          console.error('Failed to parse user cookie', e);
        }
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 客户端渲染时才执行
    if (typeof window === 'undefined') return;
    
    // 检查URL中是否有错误参数
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      console.error('OAuth error:', error);
      // 清除错误参数
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // 检查cookie中是否有用户信息
    checkUserLoginStatus();
  }, [checkUserLoginStatus]);

  // 处理登录点击
  const handleLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    
    if (isLoggedIn) {
      // 如果已登录，则登出
      window.location.href = `${baseUrl}/api/oauth2?action=logout&redirect=${encodeURIComponent(window.location.pathname)}`;
    } else {
      // 如果未登录，则重定向到OAuth授权
      window.location.href = `${baseUrl}/api/oauth2?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader className="animate-spin h-5 w-5 text-gray-900 dark:text-white" />
      </div>
    );
  }

  return (
    <div className={className} onClick={handleLogin} style={{ cursor: 'pointer' }}>
      <FlipButton 
        className="h-9"
        frontText={isLoggedIn ? `${userName}` : "未登录"} 
        backText={isLoggedIn ? "点击登出" : "点击登录"} 
      />
    </div>
  );
};

export default NavbarOAuthButton; 