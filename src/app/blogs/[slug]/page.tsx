'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ViewBlogPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${slug}`);
        const data = await response.json();
        if (data.success) {
          setBlog(data.data);
        } else {
          setError(data.error || 'Blog not found');
        }
      } catch (err) {
        setError('Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#54F4FC]"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4 text-red-400">Blog Not Found</h1>
        <p className="text-gray-400 mb-8">{error}</p>
        <Link href="/blogs" className="px-6 py-2 bg-[#54F4FC] text-black rounded-lg">
          Back to All Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-gray-900 rounded-lg border border-[#424242] overflow-hidden">
          <div className="px-8 py-8 border-b border-[#424242]">
            <span className="text-sm text-[#54F4FC] font-medium">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <h1 className="text-4xl font-bold text-white mt-4 mb-6">
              {blog.title}
            </h1>
            <p className="text-lg text-gray-300">
              By <span className="font-semibold text-[#54F4FC]">{blog.author}</span>
            </p>
          </div>

          <div className="px-8 py-8">
            <div 
              className="blog-content text-white text-base leading-relaxed whitespace-pre-wrap"
              style={{ color: 'white !important' }}
              data-blog-content
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>

        <div className="mt-8 flex justify-center">
          <Link
            href="/blogs"
            className="px-6 py-2 border border-[#424242] rounded-md text-[#54F4FC] hover:bg-gray-800 bg-black"
          >
            Back to All Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
