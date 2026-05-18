import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = `${BACKEND_URL}/api/blogs?${searchParams.toString()}`;
    console.log(`[Proxy] GET to backend: ${targetUrl}`);
    
    const response = await fetch(targetUrl);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in proxy GET blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const targetUrl = `${BACKEND_URL}/api/blogs`;
    console.log(`[Proxy] POST to backend: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in proxy POST blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}
