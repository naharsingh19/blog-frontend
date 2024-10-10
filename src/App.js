import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import PrivateRoute from './components/PrivateRoute';
import BlogPost from './pages/BlogPost';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<><Navbar /><Dashboard /></>} />
              <Route path="create" element={<><Navbar /><CreateBlog /></>} />
              <Route path="edit/:id" element={<><Navbar /><EditBlog /></>} />
            </Route>
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            limit={3}
            style={{
              fontSize: '14px',
              maxWidth: '300px',
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;