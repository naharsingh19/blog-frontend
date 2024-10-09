import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const toggleMenuDropdown = () => {
    setShowMenuDropdown(!showMenuDropdown);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav style={navStyle}>
      <div style={menuContainerStyle}>
        <button onClick={toggleMenuDropdown} style={menuButtonStyle}>
          Menu
        </button>
        {showMenuDropdown && (
          <div style={dropdownStyle}>
            <Link to="/dashboard" style={dropdownLinkStyle}>Home</Link>
            <Link to="/create" style={dropdownLinkStyle}>Create Blog</Link>
          </div>
        )}
      </div>
      <div style={userContainerStyle} ref={userDropdownRef}>
        <button onClick={toggleUserDropdown} style={userButtonStyle}>
          {user.username[0].toUpperCase()}
        </button>
        {showUserDropdown && (
          <div style={userDropdownStyle}>
            <span style={usernameStyle}>{user.username}</span>
            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  backgroundColor: '#24292e',
  color: 'white',
};

const menuContainerStyle = {
  position: 'relative',
};

const menuButtonStyle = {
  backgroundColor: '#444d56',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  fontSize: '1rem',
  width: '120px',
};

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: '0',
  backgroundColor: '#444d56',
  borderRadius: '4px',
  padding: '0.5rem 0',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  zIndex: 1000,
  width: '120px',
};

const dropdownLinkStyle = {
  display: 'block',
  padding: '0.5rem 1rem',
  color: 'white',
  textDecoration: 'none',
  ':hover': {
    backgroundColor: '#586069',
  },
};

const userContainerStyle = {
  position: 'relative',
};

const userButtonStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#0366d6',
  color: 'white',
  border: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const userDropdownStyle = {
  position: 'absolute',
  top: '120%',
  right: '0',
  backgroundColor: '#444d56',
  borderRadius: '4px',
  padding: '0.5rem',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const usernameStyle = {
  color: 'white',
  marginBottom: '0.5rem',
};

const logoutButtonStyle = {
  backgroundColor: '#d73a49',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  width: '100%',
};

export default Navbar;