"use client";

import React, { useState } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import SunEditor CSS

const EditorPage = () => {
  // State to hold the editor's content (which is an HTML string)
  const [content, setContent] = useState('');

  const handleSave = () => {
    console.log("Content to save:", content);
    // In a real application, you would send this 'content' string
    // to your backend API to be saved in a database.
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Blog/Report Editor</h1>
      <SunEditor
        setContents={content}
        onChange={setContent}
        setOptions={{
          height: '500',
          buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['removeFormat'],
            '/', // Line break
            ['fontColor', 'hiliteColor'],
            ['outdent', 'indent'],
            ['align', 'horizontalRule', 'list', 'table'],
            ['link', 'image', 'video'],
            ['fullScreen', 'showBlocks', 'codeView'],
          ],
        }}
      />
      <div style={{ marginTop: '1rem' }}>
        <button
            onClick={handleSave}
            style={{ padding: '0.5rem 1rem', background: 'var(--primary-accent)', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Save Content
        </button>
      </div>
    </div>
  );
};

export default EditorPage; 