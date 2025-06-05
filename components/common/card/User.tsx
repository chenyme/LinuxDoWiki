'use client';

import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import NavbarOAuthButton from '@/components/common/NavbarOAuthButton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserCardProps {
  name?: string;
  id?: string;
  avatar?: string;
  title?: string;
  trustLevel?: number;
  createdAt?: string;
  score?: number;
}

const User: React.FC<UserCardProps> = ({
  name,
  id,
  avatar,
  title,
  trustLevel,
  createdAt,
  score
}) => {
  const [userData, setUserData] = useState<UserCardProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 如果传入了props，则直接使用
    if (name && id && avatar !== undefined && trustLevel !== undefined && createdAt && score !== undefined) {
      setUserData({ name, id, avatar, title, trustLevel, createdAt, score });
      setLoading(false);
      return;
    }

    // 客户端渲染时才执行
    if (typeof window === 'undefined') return;
    
    const fetchUserData = async () => {
      try {
        // 从cookie中获取用户名
        const userCookie = getCookie('oauth_user');
        
        if (!userCookie) {
          setError('未登录');
          setLoading(false);
          return;
        }
        
        try {
          // 先解码URL编码的cookie值，再解析JSON
          const decodedCookie = decodeURIComponent(userCookie);
          const userInfo = JSON.parse(decodedCookie);
          
          // 使用username获取完整用户数据
          if (userInfo.name) {
            const response = await fetch(`/api/users/${userInfo.name}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setUserData({
              name: data.user.name,
              id: data.user.id.toString().padStart(16, '0'),
              avatar: data.user.avatar_template.replace('{size}', '96'),
              title: '',
              trustLevel: data.user.trust_level,
              createdAt: new Date(data.user.created_at).toISOString().split('T')[0],
              score: data.user.gamification_score || 0
            });
          } else {
            throw new Error('用户名不存在');
          }
        } catch (e) {
          console.error('Failed to parse user cookie or fetch data', e);
          setError('获取失败');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('获取失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [name, id, avatar, title, trustLevel, createdAt, score]);

  // 获取cookie辅助函数
  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };

  if (loading) {
    return (
      <div className="w-[300px] h-[200px] flex justify-center items-center">
        <Loader className="animate-spin h-12 w-12 text-[#ffb003]" />
      </div>
    );
  }

  if (error === '未登录') {
    return (
      <div className="w-[500px] h-[200px] flex justify-center items-center flex-col bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-center">
        <p className="text-xl font-medium">登录后查看您的专属 Linux Do 社区卡片</p>
        <NavbarOAuthButton className="mt-4 h-10" />
      </div>
    );
  }

  if (error === '获取失败' || !userData) {
    return (
      <div className="w-[500px] h-[200px] flex justify-center items-center flex-col bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 text-center">
        <p className="text-xl font-medium">请检查您的信息是否公开并刷新页面</p>
      </div>
    );
  }

  // 根据信任等级确定名称
  let trustLevelName = "新用户";
  switch (userData.trustLevel) {
    case 0:
      trustLevelName = "新用户";
      break;
    case 1:
      trustLevelName = "基本用户";
      break;
    case 2:
      trustLevelName = "成员";
      break;
    case 3:
      trustLevelName = "活跃用户";
      break;
    case 4:
      trustLevelName = "领导者";
      break;
    default:
      trustLevelName = "新用户";
      break;
  }

  return (
    <div className="w-[300px] h-[200px] [perspective:1000px] text-white">
      <div className="relative w-full h-full text-center transition-transform duration-800 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
        {/* 正面 */}
        <div className="absolute flex flex-col justify-center w-full h-full [backface-visibility:hidden] rounded-2xl shadow-md overflow-hidden">
          {/* 背景三段分层 */}
          <div className="absolute top-0 w-full h-[30%] bg-[#1c1c1e] z-0"></div>
          <div className="absolute top-[30%] w-full h-[40%] bg-[#f0f0f0] z-0"></div>
          <div className="absolute top-[70%] w-full h-[30%] bg-[#ffb003] z-0"></div>
          
          {/* 内容层 */}
          <div className="absolute inset-0 z-10">
            {/* 用户名称 */}
            <p className="absolute text-base font-[550] top-[5px] right-[10px] text-[#f0f0f0] text-right max-h-[60px] overflow-hidden">
              {userData.name}
            </p>
            
            {/* 头像 */}
            <div className="absolute top-[30px] left-[25px] w-[60px] h-[60px] rounded-full bg-[rgba(255,255,255,0.3)] shadow-[0_4px_8px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.1)_inset] overflow-hidden">
              <Avatar>
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name?.slice(0, 2).toUpperCase() || 'LD'}</AvatarFallback>
              </Avatar>
            </div>
            
            {/* 标题 */}
            {userData.title && (
              <p className="absolute text-xs font-[550] top-[33px] right-[8px] text-[#FF7043]">
                {userData.title}
              </p>
            )}
            
            {/* 信任等级 */}
            <p className="absolute text-xl font-bold top-[68px] left-[165px] text-[#ffb003]">
              Level {userData.trustLevel}
            </p>
            
            {/* 信任等级名称 */}
            <p className="absolute text-3xl font-bold top-[92px] left-[165px] text-[#ffb003]">
              {trustLevelName}
            </p>
            
            {/* 芯片 */}
            <div className="absolute w-[50px] h-[35px] top-[97px] left-[28px]">
              <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <image width="50" height="50" x="0" y="0" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOYfEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSWekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GSe0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOWekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bfu3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWuafUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrbtnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOhg0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU/f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dEorDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2NgGAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVgOkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3dI2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6alKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkIJVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0FqBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGmBSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCETamiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbws3j1nus+fMndc+Cwm0T52/oNR9lsdCS24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg==" />
              </svg>
            </div>
            
            {/* 底部组织标识 */}
            <p className="absolute text-base font-semibold bottom-[14px] left-[15px] tracking-[-1.9px] text-[#f0f0f0] [text-shadow:0.5px_0.5px_0_#aaaaaa,-0.5px_-0.5px_0_#f0f0f0,-0.5px_0.5px_0_#aaaaaa,0.5px_-0.5px_0_#aaaaaa]">
              L I N U X &nbsp; D O
            </p>
            
            {/* ID号码 */}
            <p className="absolute text-xs font-['Courier_New',monospace] bottom-[18px] right-[10px] tracking-[1.4px] text-[#f0f0f0] [text-shadow:0.5px_0.5px_0_#aaaaaa,-0.5px_-0.5px_0_#f0f0f0,-0.5px_0.5px_0_#aaaaaa,0.5px_-0.5px_0_#aaaaaa]">
              {userData.id}
            </p>
          </div>
        </div>
        
        {/* 反面 */}
        <div className="absolute flex flex-col justify-center w-full h-full [backface-visibility:hidden] rounded-2xl shadow-md overflow-hidden bg-[#ffb003] [transform:rotateY(180deg)]">
          {/* 磁条 */}
          <div 
            className="absolute w-full h-[60px] top-0 left-0 z-10"
            style={{
              background: `repeating-linear-gradient(
                45deg,
                #303030,
                #303030 10px,
                #202020 10px,
                #202020 20px
              )`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
          ></div>
          
          {/* 创建日期区域 */}
          <div className="absolute top-[80px] left-[20px] flex items-center z-10">
            <div className="bg-[#f0f0f0] w-[80px] h-[20px] rounded-[2.5px] flex items-center justify-center shadow-sm">
              <p className="text-[14px] font-semibold text-[#1c1c1e] font-['Courier_New',monospace]">CREATED</p>
            </div>
            <div className="bg-[#f0f0f0] w-[150px] h-[20px] ml-5 rounded-[2.5px] flex items-center justify-center shadow-sm">
              <p className="text-[14px] font-semibold text-[#1c1c1e] font-['Courier_New',monospace]">{userData.createdAt}</p>
            </div>
          </div>
          
          {/* 积分区域 */}
          <div className="absolute top-[120px] left-[20px] flex items-center z-10">
            <div className="bg-[#f0f0f0] w-[80px] h-[20px] rounded-[2.5px] flex items-center justify-center shadow-sm">
              <p className="text-[14px] font-semibold text-[#1c1c1e] font-['Courier_New',monospace]">SCORE</p>
            </div>
            <div className="bg-[#f0f0f0] w-[150px] h-[20px] ml-5 rounded-[2.5px] flex items-center justify-center shadow-sm">
              <p className="text-[14px] font-semibold text-[#1c1c1e] font-['Courier_New',monospace]">{userData.score}</p>
            </div>
          </div>
          
          {/* 反面底部组织标识 */}
          <p className="absolute text-base font-semibold bottom-[14px] right-[15px] tracking-[-1.9px] text-[#aaaaaa] [text-shadow:1px_1px_0_#f0f0f0,-1px_-1px_0_#555555,-1px_1px_0_#f0f0f0,1px_-1px_0_#555555] [transform:scaleX(-1)] z-10">
            L I N U X &nbsp; D O
          </p>
          
          {/* 反面ID号码 */}
          <p className="absolute text-xs font-['Courier_New',monospace] bottom-[18px] left-[10px] tracking-[1.4px] text-[#aaaaaa] [text-shadow:1px_1px_0_#f0f0f0,-1px_-1px_0_#555555,-1px_1px_0_#f0f0f0,1px_-1px_0_#555555] [transform:scaleX(-1)] z-10">
            {userData.id}
          </p>
        </div>
      </div>
    </div>
  );
};

export default User; 