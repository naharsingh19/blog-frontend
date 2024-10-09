import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/blogs');
      setBlogs(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error.response?.data || error.message);
      setError('Failed to fetch blogs. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/api/blogs/${id}`);
        fetchBlogs();
        toast.success('Blog deleted successfully');
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Failed to delete blog. Please try again.');
      }
    }
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const renderBlogContent = (content) => {
    try {
      if (typeof content === 'string') {
        const parsedContent = JSON.parse(content);
        if (parsedContent.blocks && parsedContent.blocks.length > 0) {
          return parsedContent.blocks
            .map(block => block.data.text)
            .join(' ')
            .substring(0, 100) + '...';
        }
      }
    } catch (error) {
      console.error('Error parsing blog content:', error);
    }
    return 'No content available';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={dashboardStyle}>
      <h1 style={headerStyle}>Welcome to the My Blog, {user.username}!</h1>
      <Link to="/create" style={createButtonStyle}>Publish Blog</Link>
      <div style={blogGridStyle}>
        {blogs.length === 0 ? (
          <p>No blogs found. Create your first blog!</p>
        ) : (
          blogs.map(blog => {
            const canDelete = user && blog.author && blog.author._id === user.userId;
            return (
              <div key={blog._id} style={blogCardStyle} onClick={() => handleBlogClick(blog._id)}>
                <div style={blogImageContainerStyle}>
                  <img 
                    src={blog.image ? `${process.env.REACT_APP_API_URL}/uploads/${blog.image}` : `https://via.placeholder.com/300x200/4287f5/ffffff?text=${encodeURIComponent(blog.title)}`}
                    alt={blog.title} 
                    style={blogImageStyle} 
                  />
                </div>
                <div style={blogContentStyle}>
                  <p style={blogAuthorStyle}>Auther: {blog.author.username}</p>
                  {blog.location && <p style={blogLocationStyle}>{blog.location}</p>}
                  <p style={blogDateStyle}>{moment(blog.createdAt).format('MMM DD, YYYY')}</p>
                  <h3 style={blogTitleStyle}>Title: {blog.title}</h3>
                  <p style={blogExcerptStyle}>
                    {renderBlogContent(blog.content)}
                  </p>
                  {canDelete && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(blog._id);
                      }} 
                      style={deleteButtonStyle}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const dashboardStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
};

const createButtonStyle = {
  display: 'block',
  width: '200px',
  margin: '0 auto 2rem',
  padding: '0.5rem 1rem',
  backgroundColor: '#0969da',
  color: 'white',
  textDecoration: 'none',
  textAlign: 'center',
  borderRadius: '4px',
};

const blogGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '2rem',
};

const blogCardStyle = {
  border: '1px solid #e1e4e8',
  borderRadius: '4px',
  overflow: 'hidden',
  backgroundColor: 'white',
  cursor: 'pointer',
  transition: 'box-shadow 0.3s ease',
  ':hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
};

const blogImageContainerStyle = {
  width: '100%',
  height: '200px',
  backgroundColor: '#f6f8fa',
};

const blogImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const blogContentStyle = {
  padding: '1rem',
};

const blogAuthorStyle = {
  fontSize: '0.9rem',
  color: '#586069',
  margin: '0',
};

const blogLocationStyle = {
  fontSize: '0.8rem',
  color: '#6a737d',
  margin: '0.2rem 0',
};

const blogDateStyle = {
  fontSize: '0.8rem',
  color: '#6a737d',
  margin: '0 0 0.5rem',
};

const blogTitleStyle = {
  fontSize: '1.2rem',
  margin: '0 0 0.5rem',
  color: '#24292e',
};

const blogExcerptStyle = {
  fontSize: '0.9rem',
  color: '#586069',
  margin: '0 0 1rem',
};

const deleteButtonStyle = {
  backgroundColor: '#d73a49',
  color: 'white',
  border: 'none',
  padding: '0.3rem 0.5rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9rem',
};

export default Dashboard;