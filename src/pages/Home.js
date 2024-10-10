import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/blogs');
        setBlogs(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to fetch blogs. Please try again later.');
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div className="container"></div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <h1>Blog Feed</h1>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        blogs.map(blog => (
          <div key={blog._id} style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#1e1e1e' }}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <p>By: {blog.author?.username || 'Unknown Author'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
