import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const targetUrl = `${BACKEND_URL}/api/blogs/${slug}`;
    console.log(`[Proxy] GET by slug to backend: ${targetUrl}`);
    
    const response = await fetch(targetUrl);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in proxy GET blog by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const targetUrl = `${BACKEND_URL}/api/blogs/${slug}`;
    console.log(`[Proxy] PUT to backend: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in proxy PUT blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const targetUrl = `${BACKEND_URL}/api/blogs/${slug}`;
    console.log(`[Proxy] DELETE to backend: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in proxy DELETE blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to backend service' },
      { status: 500 }
    );
  }
}
