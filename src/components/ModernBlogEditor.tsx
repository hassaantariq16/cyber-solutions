'use client';

import React, { useState, useEffect } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

interface BlogEditorProps {
  initialData?: {
    title: string;
    content: string;
    author: string;
    published: boolean;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

const ModernBlogEditor: React.FC<BlogEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  mode
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    author: initialData?.author || '',
    published: initialData?.published || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

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
    };

    onSave(submitData);
  };

  const sunEditorOptions: any = {
    height: '500px',
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
    minHeight: '400px',
    showPathLabel: false,
    attributesWhitelist: {
      all: 'style',
      table: 'cellpadding|cellspacing|border',
      img: 'title|alt|src',
      a: 'href|target|title'
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-[#424242]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {mode === 'create' ? 'Create New' : 'Edit'} <span className="text-[#54F4FC]">Blog Post</span>
              </h1>
              <p className="text-gray-400 mt-1">
                {mode === 'create' ? 'Share your thoughts with the world' : 'Update your blog post'}
              </p>
            </div>
            
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-900 rounded-lg border border-[#424242] p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#54F4FC] transition-colors ${
                    errors.title ? 'border-red-500' : 'border-[#424242]'
                  }`}
                  placeholder="Enter an engaging title..."
                />
                {errors.title && <p className="mt-2 text-sm text-red-400">{errors.title}</p>}
              </div>

              {/* Author */}
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#54F4FC] transition-colors ${
                    errors.author ? 'border-red-500' : 'border-[#424242]'
                  }`}
                  placeholder="Your name"
                />
                {errors.author && <p className="mt-2 text-sm text-red-400">{errors.author}</p>}
              </div>




            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-gray-900 rounded-lg border border-[#424242] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Content *</h2>
              
              <div className="flex bg-black rounded-lg border border-[#424242] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'write'
                      ? 'bg-[#54F4FC] text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-[#54F4FC] text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <div className={`border rounded-lg overflow-hidden ${errors.content ? 'border-red-500' : 'border-[#424242]'}`}>
                <SunEditor
                  setContents={formData.content}
                  onChange={(content) => handleInputChange('content', content)}
                  setOptions={sunEditorOptions}
                />
              </div>
            ) : (
              <div className="border border-[#424242] rounded-lg p-6 bg-black min-h-[400px]">
                <div 
                  className="prose prose-invert prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-500">Nothing to preview yet. Switch to Write tab to add content.</p>' }}
                />
              </div>
            )}
            
            {errors.content && <p className="mt-2 text-sm text-red-400">{errors.content}</p>}
          </div>

          {/* Publishing Options */}
          <div className="bg-gray-900 rounded-lg border border-[#424242] p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Publishing Options</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="published" className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => handleInputChange('published', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${
                    formData.published ? 'bg-[#54F4FC]' : 'bg-gray-600'
                  }`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.published ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                  </div>
                  <span className="ml-3 text-white font-medium">
                    {formData.published ? 'Publish immediately' : 'Save as draft'}
                  </span>
                </label>
                <p className="text-sm text-gray-400 mt-1">
                  {formData.published 
                    ? 'This post will be visible to everyone' 
                    : 'This post will be saved as a draft and not visible to the public'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-3 border border-[#424242] rounded-lg text-gray-300 hover:text-white hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-[#54F4FC] text-black font-semibold rounded-lg hover:bg-[#42e2ea] transition-colors disabled:opacity-50 flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create Post' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModernBlogEditor;
