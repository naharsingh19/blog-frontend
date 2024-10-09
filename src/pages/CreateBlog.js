import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Editor from '../components/Editor';
import { toast } from 'react-toastify';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      setLocation(`${data.city}, ${data.region}, ${data.country_name}`);
    } catch (error) {
      console.error('Error fetching location:', error);
      setLocation('Location unavailable');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', JSON.stringify(content));
    formData.append('location', location);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await api.post('/api/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/dashboard');
      toast.success('Blog created successfully');
    } catch (error) {
      toast.error('Failed to create blog: ' + error.response?.data?.message || 'Unknown error occurred');
    }
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  return (
    <div style={containerStyle}>
      <Link to="/dashboard" style={backLinkStyle}>Back</Link>
      <h1 style={headerStyle}>Create a New Blog Post</h1>
      {error && <p style={errorStyle}>{error}</p>}
      {!preview ? (
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title"
            style={inputStyle}
            required
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            style={inputStyle}
          />
          <Editor data={content} onChange={setContent} />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            style={fileInputStyle}
          />
          <div style={buttonContainerStyle}>
            <button type="button" onClick={togglePreview} style={previewButtonStyle}>
              Preview
            </button>
            <button type="submit" style={submitButtonStyle}>
              Create Blog
            </button>
          </div>
        </form>
      ) : (
        <div style={previewContainerStyle}>
          <h2 style={previewTitleStyle}>{title}</h2>
          <p style={previewLocationStyle}>{location}</p>
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              style={previewImageStyle}
            />
          )}
          <div style={previewContentStyle} dangerouslySetInnerHTML={{ __html: content.blocks?.map(block => block.data.text).join('<br/>') }} />
          <button onClick={togglePreview} style={editButtonStyle}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '2rem',
  backgroundColor: '#f0f0f0', // Changed to light grey
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '2rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputStyle = {
  padding: '0.5rem',
  fontSize: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  color: '#000', // Changed to black
  backgroundColor: '#fff', // Changed to white
};

const fileInputStyle = {
  marginTop: '1rem',
  padding: '0.5rem',
  fontSize: '1rem',
  backgroundColor: '#fff', // Changed to white
  color: '#000', // Changed to black
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1rem',
};

const submitButtonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  backgroundColor: '#0056b3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const previewButtonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const editButtonStyle = {
  ...previewButtonStyle,
  backgroundColor: '#ffc107',
  color: '#333',
};

const errorStyle = {
  color: 'red',
  marginBottom: '1rem',
};

const previewContainerStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
};

const previewTitleStyle = {
  color: '#333',
  marginBottom: '1rem',
};

const previewImageStyle = {
  maxWidth: '100%',
  height: 'auto',
  marginBottom: '1rem',
  borderRadius: '4px',
};

const previewContentStyle = {
  color: '#333',
  lineHeight: '1.6',
  fontSize: '1rem',
};

const previewLocationStyle = {
  fontSize: '0.9rem',
  color: '#586069',
  marginBottom: '1rem',
};

const backLinkStyle = {
  display: 'inline-block',
  marginBottom: '1rem',
  color: '#4287f5',
  textDecoration: 'none',
};

export default CreateBlog;
