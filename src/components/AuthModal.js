import React, { useState } from 'react';
import authService from '../services/authService';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    const { email, password, displayName, confirmPassword } = formData;

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return false;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    if (!isLogin) {
      if (!displayName.trim()) {
        setError('Please enter your name.');
        return false;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      
      if (isLogin) {
        result = await authService.login(formData.email, formData.password);
      } else {
        result = await authService.register(
          formData.email, 
          formData.password, 
          formData.displayName
        );
      }

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          onAuthSuccess(result.user);
          onClose();
          resetForm();
        }, 1000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      displayName: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    setLoading(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <button className="close-btn" onClick={handleClose}>&times;</button>
          <div className="auth-logo">🦉</div>
          <h2>{isLogin ? 'Welcome back!' : 'Join DuolingoDupe'}</h2>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Sign in to continue your learning journey' 
              : 'Start your language learning adventure'
            }
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="displayName">Full Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                disabled={loading}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                disabled={loading}
                required
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="switch-btn"
              onClick={switchMode}
              disabled={loading}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="auth-features">
          <div className="feature">
            <span className="feature-icon">🔄</span>
            <span>Sync progress across devices</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🏆</span>
            <span>Track achievements & streaks</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📈</span>
            <span>Detailed learning analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 