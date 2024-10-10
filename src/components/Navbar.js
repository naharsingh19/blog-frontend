import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaBars, FaHome, FaPen, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const menuDropdownRef = useRef(null);

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

  const getUserInitial = () => {
    if (user && user.username && user.username.length > 0) {
      return user.username[0].toUpperCase();
    }
    return '?';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target)) {
        setShowMenuDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav style={navStyle}>
      <div style={menuContainerStyle} ref={menuDropdownRef}>
        <button onClick={toggleMenuDropdown} style={menuButtonStyle}>
          <FaBars style={iconStyle} /> Menu
        </button>
        {showMenuDropdown && (
          <div style={dropdownStyle}>
            <Link to="/dashboard" style={dropdownLinkStyle}>
              <FaHome style={iconStyle} /> Home
            </Link>
            <Link to="/create" style={dropdownLinkStyle}>
              <FaPen style={iconStyle} /> Create Blog
            </Link>
          </div>
        )}
      </div>
      <div style={userContainerStyle} ref={userDropdownRef}>
        <button onClick={toggleUserDropdown} style={userButtonStyle}>
          {getUserInitial()}
        </button>
        {showUserDropdown && user && (
          <div style={userDropdownStyle}>
            <span style={usernameStyle}>
              <FaUser style={iconStyle} /> {user.username}
            </span>
            <button onClick={handleLogout} style={logoutButtonStyle}>
              <FaSignOutAlt style={iconStyle} /> Logout
            </button>
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
  backgroundColor: 'black',
  color: 'white',
};

const menuContainerStyle = {
  position: 'relative',
};

const menuButtonStyle = {
  backgroundColor: 'black',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  fontSize: '1rem',
  width: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: '0',
  backgroundColor: 'black',
  borderRadius: '4px',
  padding: '0.5rem 0',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  zIndex: 1000,
  width: '150px',
};

const dropdownLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  color: 'white',
  textDecoration: 'none',
  ':hover': {
    backgroundColor: 'gray',
  },
};

const userContainerStyle = {
  position: 'relative',
};

const userButtonStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'white',
  color: 'black',
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
  backgroundColor: 'black',
  borderRadius: '4px',
  padding: '0.5rem',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '150px',
};

const usernameStyle = {
  color: 'white',
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: '0.5rem',
};

const logoutButtonStyle = {
  backgroundColor: '#d73a49',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const iconStyle = {
  marginRight: '0.5rem',
};

export default Navbar;