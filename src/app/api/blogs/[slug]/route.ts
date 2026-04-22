import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogModel from '@/models/Blog';
import { BlogSchema } from '@/lib/validations';

// Cast to any to fix Mongoose 8 type compatibility with strict TypeScript
const Blog: any = BlogModel;

// GET - Fetch blog by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await context.params;
    
    const blog = await Blog.findOne({ slug: slug });
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT - Update blog by slug
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await context.params;
    
    const body = await request.json();
    
    // Validate the request body
    const validatedData = BlogSchema.parse(body);
    
    // Generate new slug if title changed
    let newSlug = slug;
    if (validatedData.title) {
      newSlug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    
    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: slug },
      { 
        ...validatedData,
        slug: newSlug,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBlog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog by slug
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await context.params;
    
    const deletedBlog = await Blog.findOneAndDelete({ slug: slug });
    
    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
