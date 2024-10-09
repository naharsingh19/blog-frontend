import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

const Editor = ({ data, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          list: List,
          paragraph: Paragraph
        },
        data: data,
        onChange: async () => {
          const content = await editor.save();
          onChange(content);
        },
        placeholder: 'Start writing your blog post here...',
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, []);

  return <div id="editorjs" style={editorStyle}></div>;
};

const editorStyle = {
  border: '1px solid #ccc',
  minHeight: '300px',
  padding: '10px',
  borderRadius: '4px',
  backgroundColor: '#fff',
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
};

export default Editor;
