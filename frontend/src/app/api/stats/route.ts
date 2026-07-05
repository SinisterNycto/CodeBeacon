import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const author = searchParams.get('author') || '';

    const res = await fetch(`${API_URL}/api/stats?author=${author}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching stats from backend:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
