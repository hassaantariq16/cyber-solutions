import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogModel from '@/models/Blog';
import { BlogSchema } from '@/lib/validations';

// Cast to any to fix Mongoose 8 type compatibility with strict TypeScript
const Blog: any = BlogModel;

// GET /api/blogs - Get all blogs with pagination
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    // Build query
    const query: any = {};
    
    if (published !== null) {
      query.published = published === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    // Validate input
    const validatedData = BlogSchema.parse(body);

    // Generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: validatedData.slug });
    if (existingBlog) {
      // Add timestamp to make slug unique
      validatedData.slug = `${validatedData.slug}-${Date.now()}`;
    }

    const blog = new Blog(validatedData);
    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
      message: 'Blog created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: (error as any).errors },
        { status: 400 }
      );
    }

    if (error && typeof error === 'object' && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Blog with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
