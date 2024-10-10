import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';
import StoryCreate from '../components/StoryCreate';
import StoryList from '../components/StoryList';

const Dashboard = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchBlogs = useCallback(async () => {
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
  }, []);

  const fetchStories = useCallback(async () => {
    try {
      const res = await api.get('/api/stories');
      setStories(res.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to fetch stories');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBlogs();
      fetchStories();
    }
  }, [isAuthenticated, fetchBlogs, fetchStories]);

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

  const handleStoryCreated = (newStory) => {
    setStories(prevStories => [newStory, ...prevStories]);
    setIsStoryModalOpen(false);
  };

  const openStoryModal = () => {
    setIsStoryModalOpen(true);
  };

  const closeStoryModal = () => {
    setIsStoryModalOpen(false);
  };

  //if (loading) return <div></div>;
  if (error) return <div>Error: {error}</div>;
  if (!isAuthenticated || !user) return <div>Please log in to view this page.</div>;

  return (
    <div style={dashboardStyle}>
      <h1 style={headerStyle}>Welcome to My Blog, {user.username}!</h1>
      <div style={storyContainerStyle}>
        <div style={storyCreateStyle} onClick={openStoryModal}>
          <div style={storyCreateImageStyle}>
            <div style={addButtonStyle}>+</div>
          </div>
          <span style={yourStoryTextStyle}>Your Story</span>
        </div>
        <div style={storyListWrapperStyle}>
          {stories.length > 0 ? (
            <StoryList stories={stories} />
          ) : (
            <p style={noStoriesStyle}>No stories available</p>
          )}
        </div>
      </div>
      {isStoryModalOpen && (
        <StoryCreate onStoryCreated={handleStoryCreated} onClose={closeStoryModal} />
      )}
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
                  <p style={blogAuthorStyle}>Author: {blog.author ? blog.author.username : 'Unknown'}</p>
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
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '2rem',
  backgroundColor: 'black',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '2rem',
};

const blogGridStyle = {
  marginTop: '30px',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '3rem',
};

const blogCardStyle = {
  border: '1px solid black',
  borderRadius: '4px',
  overflow: 'hidden',
  backgroundColor: 'black',
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
  fontSize: '1rem',
  color: 'white',
  margin: '0',
};

const blogLocationStyle = {
  fontSize: '0.6rem',
  color: 'white',
  margin: '0.2rem 0',
};

const blogDateStyle = {
  fontSize: '0.6rem',
  color: 'white',
  margin: '0 0 0.5rem',
};

const blogTitleStyle = {
  fontSize: '1.6rem',
  margin: '0 0 0.5rem',
  color: 'white',
};

const blogExcerptStyle = {
  fontSize: '1.3rem',
  color: 'white',
  margin: '0 0 1rem',
};

const deleteButtonStyle = {
  backgroundColor: '#d73a49',
  color: 'white',
  border: 'none',
  padding: '0.3rem 0.5rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.6rem',
};

const storyContainerStyle = {
  display: 'flex',
  alignItems: 'center', // Change this to 'center'
  overflowX: 'auto',
  padding: '10px 0',
  //borderBottom: '1px solid #dbdbdb',
};

const storyCreateStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  marginRight: '15px',
  width: '70px', // Set a fixed width for consistency
};

const storyCreateImageStyle = {
  width: '66px',
  height: '66px',
  borderRadius: '50%',
  border: '2px dashed #ccc',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const addButtonStyle = {
  fontSize: '24px',
  color: '#ccc',
};

const yourStoryTextStyle = {
  fontSize: '12px',
  marginTop: '5px',
  color: 'white',
  maxWidth: '70px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  textAlign: 'center',
};

const storyListWrapperStyle = {
  marginLeft: '30px', // Add this to move the story list slightly to the right
};

const noStoriesStyle = {
  color: 'white',
  fontSize: '14px',
  marginLeft: '15px',
};

export default Dashboard;