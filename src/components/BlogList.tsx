'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface BlogListProps {
  showAdminControls?: boolean;
  onEdit?: (blog: Blog) => void;
  onDelete?: (blogId: string) => void;
  onTogglePublish?: (blogId: string, published: boolean) => void;
}

const BlogList: React.FC<BlogListProps> = ({ onEdit, onDelete, onTogglePublish }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublished, setFilterPublished] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);

  const fetchBlogs = async (page = 1, search = '', published = 'all', tag = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(published !== 'all' && { published }),
        ...(tag && { tag }),
      });

      const response = await fetch(`/api/blogs?${params}`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.data.blogs);
        setTotalPages(data.data.pagination.totalPages);
        
        // Extract unique tags
        const tags = [...new Set(data.data.blogs.flatMap((blog: Blog) => blog.tags))] as string[];
        setAllTags(tags);
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
    fetchBlogs(currentPage, searchTerm, filterPublished, selectedTag);
  }, [currentPage, searchTerm, filterPublished, selectedTag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(1, searchTerm, filterPublished, selectedTag);
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onDelete(blogId);
        fetchBlogs(currentPage, searchTerm, filterPublished, selectedTag);
      } else {
        alert(data.error || 'Failed to delete blog');
      }
    } catch (err) {
      alert('Failed to delete blog');
      console.error('Error deleting blog:', err);
    }
  };

  const handleTogglePublish = async (blogId: string, currentPublished: boolean) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentPublished }),
      });

      const data = await response.json();

      if (data.success) {
        onTogglePublish(blogId, !currentPublished);
        fetchBlogs(currentPage, searchTerm, filterPublished, selectedTag);
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <Link
            href="/blogs/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Blog
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          <div className="flex gap-4">
            <select
              value={filterPublished}
              onChange={(e) => setFilterPublished(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Blog List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">No blogs found</p>
            <Link
              href="/blogs/new"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Your First Blog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/blogs/${blog._id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-900 truncate max-w-xs block"
                        >
                          {blog.title}
                        </Link>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {blog.excerpt}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {blog.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          blog.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{blog.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(blog)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleTogglePublish(blog._id, blog.published)}
                          className="text-green-600 hover:text-green-900"
                        >
                          {blog.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BlogList;
