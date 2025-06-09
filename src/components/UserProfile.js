import React, { useState } from 'react';
import authService from '../services/authService';
import './UserProfile.css';

const UserProfile = ({ user, userData, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const result = await authService.logout();
    if (result.success) {
      onLogout();
    }
    setLoading(false);
    setShowDropdown(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="user-profile">
      <button 
        className="profile-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="profile-avatar">
          {getInitials(user?.displayName || userData?.displayName)}
        </div>
        <span className="profile-name">
          {user?.displayName || userData?.displayName || 'User'}
        </span>
        <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
      </button>

      {showDropdown && (
        <>
          <div 
            className="dropdown-overlay" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <div className="profile-avatar large">
                {getInitials(user?.displayName || userData?.displayName)}
              </div>
              <div className="profile-info">
                <h3>{user?.displayName || userData?.displayName || 'User'}</h3>
                <p>{user?.email}</p>
              </div>
            </div>

            <div className="dropdown-stats">
              <div className="stat">
                <span className="stat-icon">🏆</span>
                <div>
                  <div className="stat-value">{userData?.totalXP || 0}</div>
                  <div className="stat-label">Total XP</div>
                </div>
              </div>
              <div className="stat">
                <span className="stat-icon">🔥</span>
                <div>
                  <div className="stat-value">{userData?.currentStreak || 0}</div>
                  <div className="stat-label">Day Streak</div>
                </div>
              </div>
              <div className="stat">
                <span className="stat-icon">📚</span>
                <div>
                  <div className="stat-value">{userData?.lessonsCompleted || 0}</div>
                  <div className="stat-label">Lessons</div>
                </div>
              </div>
            </div>

            <div className="dropdown-info">
              <div className="info-item">
                <span>Member since</span>
                <span>{formatDate(userData?.createdAt)}</span>
              </div>
              <div className="info-item">
                <span>Average accuracy</span>
                <span>{userData?.averageAccuracy || 0}%</span>
              </div>
            </div>

            <div className="dropdown-actions">
              <button 
                className="logout-btn"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? '⏳' : '🚪'} 
                {loading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile; 