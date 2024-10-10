import React, { useState } from 'react';

const StoryList = ({ stories }) => {
  const [activeStory, setActiveStory] = useState(null);
  const [viewedStories, setViewedStories] = useState(new Set());

  const openStory = (story) => {
    setActiveStory(story);
    setViewedStories(prev => new Set(prev).add(story._id));
  };

  const closeStory = () => {
    setActiveStory(null);
  };

  return (
    <div style={storyListStyle}>
      {stories.map((story) => (
        <div key={story._id} style={storyItemStyle} onClick={() => openStory(story)}>
          <div style={{
            ...storyImageContainerStyle,
            border: `2px solid ${viewedStories.has(story._id) ? 'gray' : '#e1306c'}`,
          }}>
            <img src={story.imageUrl} alt="Story" style={storyImageStyle} />
          </div>
          <p style={storyUsernameStyle}>{story.username}</p> {/* Use the username from the story object */}
        </div>
      ))}
      {activeStory && (
        <div style={activeStoryOverlayStyle} onClick={closeStory}>
          <img src={activeStory.imageUrl} alt="Active Story" style={activeStoryImageStyle} />
          <p style={activeStoryCaptionStyle}>{activeStory.caption}</p>
        </div>
      )}
    </div>
  );
};

const storyListStyle = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '10px',
 // marginBottom: '20px',
  //overflowX: 'auto',
  //padding: '10px 0',
};

const storyItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginRight: '15px',
  cursor: 'pointer',
  width: '70px',
};

const storyImageContainerStyle = {
  width: '66px',
  height: '66px',
  borderRadius: '50%',
  padding: '3px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const storyImageStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  objectFit: 'cover',
};

const storyUsernameStyle = {
  marginTop: '5px',
  fontSize: '12px',
  maxWidth: '70px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  //color: '#262626',
};

const activeStoryOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const activeStoryImageStyle = {
  maxWidth: '100%',
  maxHeight: '80vh',
  objectFit: 'contain',
};

const activeStoryCaptionStyle = {
  color: 'white',
  marginTop: '20px',
  fontSize: '16px',
  textAlign: 'center',
  padding: '0 20px',
};

export default StoryList;
