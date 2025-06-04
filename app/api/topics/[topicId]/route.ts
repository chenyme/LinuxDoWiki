import { NextResponse } from 'next/server';

interface TopicResponse {
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ topicId: string }> }
): Promise<NextResponse> {
  const { topicId } = await params;
  
  try {
    const response = await fetch(`https://linux.do/t/${topicId}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: TopicResponse = await response.json();
    
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch topic data' },
      { status: 500 }
    );
  }
} 