import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const res = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!res.ok) {
      throw new Error(`Backend responded with status: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error saving user to backend:", error);
    return NextResponse.json({ error: "Failed to save user preferences" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');
    
    if (!clerkId) {
      return NextResponse.json({ error: "clerkId is required" }, { status: 400 });
    }

    const res = await fetch(`${API_URL}/api/users/${clerkId}`, { cache: 'no-store' });
    
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(null, { status: 200 });
      }
      throw new Error(`Backend responded with status: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error fetching user from backend:", error);
    return NextResponse.json({ error: "Failed to fetch user preferences" }, { status: 500 });
  }
}
