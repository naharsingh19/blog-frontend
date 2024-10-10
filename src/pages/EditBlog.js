import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Editor from '../components/Editor';

const EditBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState({});
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/blogs/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setLocation(res.data.location || '');
        setImageUrl(res.data.imageUrl || '');
        setVideoUrl(res.data.videoUrl || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to fetch blog data. Please try again.');
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
      setVideoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', JSON.stringify(content));
      formData.append('location', location);
      if (image) formData.append('image', image);
      if (video) formData.append('video', video);

      await api.put(`/api/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating blog:', error.response?.data || error.message);
      setError('Failed to update blog: ' + (error.response?.data?.error || 'Unknown error occurred'));
    }
  };

  const togglePreview = () => {
    setPreview(!preview);
  };

  if (loading) return <div></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>Edit Blog</h2>
      {!preview ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <div>
            <label>Current Image:</label>
            {imageUrl && <img src={imageUrl} alt="Current" style={{ maxWidth: '200px', marginBottom: '1rem' }} />}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: '1rem' }}
          />
          <div>
            <label>Current Video:</label>
            {videoUrl && <video src={videoUrl} controls style={{ maxWidth: '200px', marginBottom: '1rem' }} />}
          </div>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            style={{ marginBottom: '1rem' }}
          />
          <Editor data={content} onChange={setContent} />
          <button type="button" onClick={togglePreview} style={{ marginTop: '1rem', marginRight: '1rem' }}>Preview</button>
          <button type="submit" style={{ marginTop: '1rem' }}>Update Blog</button>
        </form>
      ) : (
        <div>
          <h3>{title}</h3>
          <p>Location: {location}</p>
          {imageUrl && <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', marginBottom: '1rem' }} />}
          {videoUrl && <video src={videoUrl} controls style={{ maxWidth: '100%', marginBottom: '1rem' }} />}
          <div dangerouslySetInnerHTML={{ __html: content.blocks?.map(block => block.data.text).join('<br/>') }} />
          <button onClick={togglePreview}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default EditBlog;
