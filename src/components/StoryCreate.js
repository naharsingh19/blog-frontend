import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import api from "../utils/api";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const StoryCreate = ({ onStoryCreated, onClose }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please select an image');
      return;
    }
    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    try {
      const response = await api.post('/api/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImage(null);
      setCaption('');
      setPreview(null);
      toast.success('Story created successfully');
      onStoryCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating story:', error.response?.data || error.message);
      toast.error('Error creating story: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
    onClose(); 
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <button onClick={handleBackToDashboard} style={backButtonStyle}>
            <FaArrowLeft style={backIconStyle} />
          </button>
          <h2 style={modalTitleStyle}>Create Story</h2>
          <i className="fas fa-times" style={closeIconStyle} onClick={onClose}></i>
        </div>
        <div style={imageContainerStyle}>
          {preview ? (
            <img src={preview} alt="Preview" style={previewImageStyle} />
          ) : (
            <div
              style={placeholderStyle}
              onClick={() => fileInputRef.current.click()}
            >
              <i className="fas fa-camera" style={cameraIconStyle}></i>
              <span style={uploadTextStyle}>Upload Image</span>
            </div>
          )}
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
          />
        </div>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          style={captionInputStyle}
        />
        <button onClick={handleSubmit} style={submitButtonStyle}>
          <i className="fas fa-paper-plane" style={submitIconStyle}></i>
          Post Story
        </button>
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '400px',
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  color: 'black',
};

const modalTitleStyle = {
  margin: 0,
  fontSize: '24px',
  fontWeight: '600',
};

const closeIconStyle = {
  fontSize: '24px',
  cursor: 'pointer',
  color: 'black',
};

const imageContainerStyle = {
  width: '100%',
  height: '130px',
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: '20px',
  backgroundColor: '#f0f0f0',
};

const previewImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const placeholderStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
};

const cameraIconStyle = {
  fontSize: '48px',
  color: '#888',
  marginBottom: '10px',
};

const uploadTextStyle = {
  fontSize: '16px',
  color: '#888',
};

const captionInputStyle = {
  width: '100%',
  height: '80px',
  padding: '10px',
  marginBottom: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  resize: 'none',
  fontSize: '12px',
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: 'black',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const submitIconStyle = {
  marginRight: '8px',
};

const backButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#0095f6',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};

const backIconStyle = {
  marginRight: '5px',
  color: 'black',
};

export default StoryCreate;
