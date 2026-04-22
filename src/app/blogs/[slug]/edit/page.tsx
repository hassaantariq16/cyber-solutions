'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ModernBlogEditor from '@/components/ModernBlogEditor';

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

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
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

  const handleSave = async (formData: any) => {
    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/blogs/${data.data.slug}`);
      } else {
        throw new Error(data.error || 'Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  };

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
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-[#54F4FC] text-black rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <ModernBlogEditor
      mode="edit"
      initialData={{
        title: blog.title,
        content: blog.content,
        author: blog.author,
        published: blog.published,
      }}
      onSave={handleSave}
      onCancel={() => router.push(`/blogs/${blog.slug}`)}
    />
  );
}
