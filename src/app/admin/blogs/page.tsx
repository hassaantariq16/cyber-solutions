'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublished, setFilterPublished] = useState<string>('all');


  const fetchBlogs = async (page = 1, search = '', published = 'all') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(published !== 'all' && { published }),

      });

      const response = await fetch(`/api/blogs?${params}`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.data.blogs);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        setError(data.error || 'Failed to fetch blogs');
      }
    } catch (err) {
      setError('Failed to fetch blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, searchTerm, filterPublished);
  }, [currentPage, searchTerm, filterPublished]);

  const handleDelete = async (blogSlug: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${blogSlug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchBlogs(currentPage, searchTerm, filterPublished);
      } else {
        alert(data.error || 'Failed to delete blog');
      }
    } catch (err) {
      alert('Failed to delete blog');
      console.error('Error deleting blog:', err);
    }
  };

  const handleTogglePublish = async (blogSlug: string, currentPublished: boolean) => {
    try {
      const response = await fetch(`/api/blogs/${blogSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentPublished }),
      });

      const data = await response.json();

      if (data.success) {
        fetchBlogs(currentPage, searchTerm, filterPublished);
      } else {
        alert(data.error || 'Failed to update blog');
      }
    } catch (err) {
      alert('Failed to update blog');
      console.error('Error updating blog:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#54F4FC]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-[#424242]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Blog <span className="text-[#54F4FC]">Management</span>
              </h1>
              <p className="text-gray-400">Create, edit, and manage your blog posts</p>
            </div>
            
            <div className="flex gap-4">
              <Link
                href="/blogs"
                className="px-4 py-2 border border-[#424242] text-white rounded-lg hover:border-[#54F4FC] transition-colors"
              >
                View Public Blog
              </Link>
              <Link
                href="/blogs/new"
                className="px-6 py-2 bg-[#54F4FC] text-black font-semibold rounded-lg hover:bg-[#42e2ea] transition-colors"
              >
                Create New Post
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border-b border-[#424242]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-[#424242] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#54F4FC]"
              />
            </div>
            
            <div>
              <select
                value={filterPublished}
                onChange={(e) => setFilterPublished(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-[#424242] rounded-lg text-white focus:outline-none focus:border-[#54F4FC]"
              >
                <option value="all">All Status</option>
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>



            <div className="text-sm text-gray-400 flex items-center">
              Total: {blogs.length} posts
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-4">No blogs found</h3>
            <p className="text-gray-500 mb-8">
              {searchTerm || filterPublished !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Create your first blog post to get started!'}
            </p>
            <Link
              href="/blogs/new"
              className="inline-flex items-center px-6 py-3 bg-[#54F4FC] text-black font-semibold rounded-lg hover:bg-[#42e2ea] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-900 rounded-lg border border-[#424242] p-6 hover:border-[#54F4FC] transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          blog.published
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>

                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="block group"
                    >
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#54F4FC] transition-colors">
                        {blog.title}
                      </h3>
                    </Link>



                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        By {blog.author}
                      </span>
                      

                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="p-2 text-gray-400 hover:text-[#54F4FC] transition-colors"
                      title="View"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    
                    <Link
                      href={`/blogs/${blog.slug}/edit`}
                      className="p-2 text-gray-400 hover:text-[#54F4FC] transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>

                    <button
                      onClick={() => handleTogglePublish(blog.slug, blog.published)}
                      className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                      title={blog.published ? 'Unpublish' : 'Publish'}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(blog.slug)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-[#424242] rounded-md text-sm font-medium text-gray-400 bg-black hover:border-[#54F4FC] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#54F4FC] text-black border-[#54F4FC]'
                        : 'bg-black text-gray-400 border-[#424242] hover:border-[#54F4FC] hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-[#424242] rounded-md text-sm font-medium text-gray-400 bg-black hover:border-[#54F4FC] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
