import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import moment from 'moment';

const BlogPost = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/api/blogs/${id}`);
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blog post');
        toast.error('Failed to load blog post');
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const getAuthorName = (author) => {
    if (typeof author === 'string') return author;
    if (author && author.username) return author.username;
    if (author && author.name) return author.name;
    return 'Unknown Author';
  };

  const renderContent = (content) => {
    if (!content) {
      return <p style={paragraphStyle}>No content available</p>;
    }
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      console.error('Error parsing content:', e);
      return <p style={paragraphStyle}>{content}</p>;
    }

    if (!parsedContent.blocks || !Array.isArray(parsedContent.blocks)) {
      return <p style={paragraphStyle}>{content}</p>;
    }

    return parsedContent.blocks.map((block, index) => {
      switch (block.type) {
        case 'paragraph':
          return <p key={index} style={paragraphStyle}>{block.data.text}</p>;
        case 'header':
          const HeaderTag = `h${block.data.level}`;
          return <HeaderTag key={index} style={headerStyle}>{block.data.text}</HeaderTag>;
        default:
          return <p key={index} style={paragraphStyle}>{JSON.stringify(block.data)}</p>;
      }
    });
  };

  if (loading) return <div style={containerStyle}></div>;
  if (error) return <div style={containerStyle}>Error: {error}</div>;
  if (!blog) return <div style={containerStyle}>Blog post not found</div>;

  const imageUrl = blog.image
    ? `${process.env.REACT_APP_API_URL}/uploads/${blog.image}`
    : `https://via.placeholder.com/1200x400/4287f5/ffffff?text=${encodeURIComponent(blog.title)}`;


  return (
    <div style={containerStyle}>
      <Link to="/dashboard" style={backLinkStyle}>Back</Link>
      <article style={articleStyle}>
        <header style={articleHeaderStyle}>
          <h1 style={titleStyle}>{blog.title}</h1>
          <div style={metaStyle}>
            <span>By {getAuthorName(blog.authorName)}</span>
            <span> • </span>
            <time>{moment(blog.createdAt).format('MMMM D, YYYY')}</time>
          </div>
        </header>
        <img 
          src={imageUrl}
          alt={blog.title}
          style={featuredImageStyle}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/1200x400/4287f5/ffffff?text=${encodeURIComponent(blog.title)}`;
          }}
        />
        <div style={contentStyle}>
          {renderContent(blog.content)}
        </div>
      </article>
    </div>
  );
};

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '2rem',
  fontFamily: 'Arial, sans-serif',
};

const backLinkStyle = {
  display: 'inline-block',
  marginBottom: '2rem',
  color: '#4287f5',
  textDecoration: 'none',
};

const articleStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
};

const articleHeaderStyle = {
  padding: '2rem',
  backgroundColor: '#f8f9fa',
};

const titleStyle = {
  fontSize: '2.5rem',
  marginBottom: '1rem',
  color: '#333',
};

const metaStyle = {
  fontSize: '0.9rem',
  color: '#6c757d',
};

const featuredImageStyle = {
  width: '100%',
  height: 'auto',
};

const contentStyle = {
  padding: '2rem',
};

const paragraphStyle = {
  fontSize: '1.1rem',
  lineHeight: '1.6',
  marginBottom: '1.5rem',
  color: '#333',
};

const headerStyle = {
  marginTop: '1.5rem',
  marginBottom: '1rem',
  color: '#333',
};

const listStyle = {
  marginBottom: '1.5rem',
  paddingLeft: '2rem',
};

const listItemStyle = {
  marginBottom: '0.5rem',
};

export default BlogPost;
