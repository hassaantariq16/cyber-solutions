'use client';

import React, { useState, useEffect } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

interface BlogEditorProps {
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    author: string;
    tags: string[];
    published: boolean;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  mode
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    author: initialData?.author || '',
    tags: initialData?.tags?.join(', ') || '',
    published: initialData?.published || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
    };

    onSave(submitData);
  };

  const sunEditorOptions: any = {
    height: '400px',
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['paragraphStyle', 'blockquote'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['fontColor', 'hiliteColor', 'textStyle'],
      ['removeFormat'],
      ['outdent', 'indent'],
      ['align', 'horizontalRule', 'list', 'lineHeight'],
      ['table', 'link', 'image', 'video'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['preview', 'print']
    ],
    formats: ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    defaultTag: 'p',
    minHeight: '300px',
    showPathLabel: false,
    attributesWhitelist: {
      all: 'style',
      table: 'cellpadding|cellspacing|border',
      img: 'title|alt|src',
      a: 'href|target|title'
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === 'create' ? 'Create New Blog' : 'Edit Blog'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter blog title..."
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author *
          </label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) => handleInputChange('author', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.author ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter author name..."
          />
          {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt *
          </label>
          <textarea
            id="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.excerpt ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter a brief excerpt..."
            maxLength={300}
          />
          <div className="flex justify-between mt-1">
            {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt}</p>}
            <p className="text-sm text-gray-500">{formData.excerpt.length}/300</p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter tags separated by commas..."
          />
          <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <div className={`border rounded-md ${errors.content ? 'border-red-500' : 'border-gray-300'}`}>
            <SunEditor
              setContents={formData.content}
              onChange={(content) => handleInputChange('content', content)}
              setOptions={sunEditorOptions}
            />
          </div>
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>

        {/* Published Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => handleInputChange('published', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
            Publish immediately
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create Blog' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
