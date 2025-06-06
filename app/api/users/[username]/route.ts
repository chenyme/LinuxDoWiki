import { NextRequest, NextResponse } from 'next/server';

interface UserResponse {
  user: {
    id: number;
    username: string;
    name: string;
    avatar_template: string;
    bio_excerpt: string;
    email?: string;
    trust_level: number;
    created_at: string;
    gamification_score?: number;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
): Promise<NextResponse> {
  const { username } = await params;
  
  try {
    const response = await fetch(`https://linux.do/users/${username}.json`);
    const data: UserResponse = await response.json();
    
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 