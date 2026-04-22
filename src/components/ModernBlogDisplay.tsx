'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

interface ModernBlogDisplayProps {
  showAdminControls?: boolean;
}

const ModernBlogDisplay: React.FC<ModernBlogDisplayProps> = ({ showAdminControls = false }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        published: 'true', // Only show published blogs for public view
        limit: '12',
      });

      const response = await fetch(`/api/blogs?${params}`);
      const result = await response.json();

      if (result.success) {
        setBlogs(result.data.blogs);
      } else {
        setError(result.error || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...' 
      : textContent;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#54F4FC]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple Header */}
      <div className="bg-black border-b border-[#424242] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-[#54F4FC]">Blogs</h1>
        </div>
      </div>



      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-4">No articles found</h3>
            <p className="text-gray-500 mb-8">
              Be the first to publish an article!
            </p>
            {showAdminControls && (
              <Link
                href="/blogs/new"
                className="inline-flex items-center px-6 py-3 bg-[#54F4FC] text-black font-semibold rounded-lg hover:bg-[#42e2ea] transition-colors duration-300"
              >
                Create First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <Link 
                key={blog._id}
                href={`/blogs/${blog.slug}`}
                className="block group hover:scale-[1.02] transition-transform duration-200"
              >
                <article className="bg-gray-900 border border-[#424242] rounded-lg overflow-hidden hover:border-[#54F4FC] transition-all duration-300 hover:shadow-lg hover:shadow-[#54F4FC]/10">
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-[#54F4FC] font-semibold">
                        {formatDate(blog.createdAt)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        blog.published 
                          ? 'bg-green-900 text-green-300 border border-green-700' 
                          : 'bg-yellow-900 text-yellow-300 border border-yellow-700'
                      }`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-4 text-white">
                      {blog.title}
                    </h3>

                    <div className="mb-6">
                      <div 
                        className="blog-content text-white text-base leading-relaxed whitespace-pre-wrap [&>*]:text-white [&>p]:text-white [&>div]:text-white [&>span]:text-white"
                        style={{ color: 'white !important' }}
                        data-blog-content
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#54F4FC] rounded-full flex items-center justify-center text-black font-semibold text-sm">
                          {blog.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 text-sm text-gray-400">
                          By <span className="text-[#54F4FC] font-semibold">{blog.author}</span>
                        </span>
                      </div>
                      
                      {blog.updatedAt !== blog.createdAt && (
                        <div className="text-xs text-gray-500">
                          Updated: {formatDate(blog.updatedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default ModernBlogDisplay;
