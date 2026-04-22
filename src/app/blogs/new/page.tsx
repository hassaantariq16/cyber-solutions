'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModernBlogEditor from '@/components/ModernBlogEditor';

export default function NewBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (data: any) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message with modern styling
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successDiv.textContent = 'Blog created successfully!';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          document.body.removeChild(successDiv);
          router.push('/admin/blogs');
        }, 2000);
      } else {
        alert(result.error || 'Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/blogs');
  };

  return (
    <ModernBlogEditor
      mode="create"
      onSave={handleSave}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}
