import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// OAuth2配置
const OAUTH2_CONFIG = {
  clientId: process.env.OAUTH_CLIENT_ID || 'bVcJaAhPOpbzS7tJe33qOiRbaffg4hf7',
  clientSecret: process.env.OAUTH_CLIENT_SECRET || '2rT42kRTsCajielGqysihZpilBZAxkqe',
  tokenEndpoint: 'https://connect.linux.do/oauth2/token',
  userInfoEndpoint: 'https://connect.linux.do/api/user'
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const cookieStore = await cookies();
    
    // 验证状态参数以防止CSRF攻击
    const storedState = cookieStore.get('oauth_state')?.value;
    
    if (!storedState || state !== storedState) {
      return NextResponse.redirect(new URL('/tools?error=invalid_state', request.url));
    }
    
    // 清除状态cookie
    cookieStore.set('oauth_state', '', { expires: new Date(0) });
    
    if (!code) {
      return NextResponse.redirect(new URL('/tools?error=no_code', request.url));
    }
    
    // 交换授权码获取访问令牌
    const redirectUri = `${request.nextUrl.origin}/api/oauth2/callback`;
    const tokenResponse = await fetch(OAUTH2_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: OAUTH2_CONFIG.clientId,
        client_secret: OAUTH2_CONFIG.clientSecret,
        code,
        redirect_uri: redirectUri
      })
    });
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(new URL('/tools?error=token_exchange_failed', request.url));
    }
    
    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;
    
    // 获取用户信息
    const userInfoResponse = await fetch(OAUTH2_CONFIG.userInfoEndpoint, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    if (!userInfoResponse.ok) {
      console.error('User info fetch failed:', await userInfoResponse.text());
      return NextResponse.redirect(new URL('/tools?error=user_info_failed', request.url));
    }
    
    const userData = await userInfoResponse.json();
    
    // 设置用户信息和令牌到cookie
    cookieStore.set('oauth_token', JSON.stringify({
      access_token,
      refresh_token,
      expires_at: Date.now() + expires_in * 1000
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expires_in,
      path: '/'
    });
    
    // 用户公开信息存储在非httpOnly cookie中，以便客户端JavaScript访问
    cookieStore.set('oauth_user', JSON.stringify({
      id: userData.id,
      name: userData.name || userData.username,
      avatar: userData.avatar_url || userData.avatar
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expires_in,
      path: '/'
    });
    
    // 获取登录后重定向URL
    const redirectAfterLogin = cookieStore.get('redirect_after_login')?.value || '/tools';
    cookieStore.set('redirect_after_login', '', { expires: new Date(0) });
    
    // 重定向到原始页面
    return NextResponse.redirect(new URL(redirectAfterLogin, request.url));
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/tools?error=server_error', request.url));
  }
} 