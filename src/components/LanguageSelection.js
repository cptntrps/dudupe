import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { languages } from '../data/lessonsData';
import './LanguageSelection.css';

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { setSelectedLanguage } = useApp();

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    navigate('/lessons');
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ←
        </button>
        <h1>Choose a Language</h1>
        <div></div>
      </div>

      <div className="language-selection">
        <div className="selection-header">
          <div className="luna-mascot">🦊</div>
          <h2>What would you like to learn?</h2>
          <p>Choose your learning journey with Luna!</p>
        </div>

        <div className="languages-grid">
          {languages.map((language) => (
            <div
              key={language.id}
              className="language-card"
              onClick={() => handleLanguageSelect(language)}
            >
              <div className="language-flag">{language.flag}</div>
              <div className="language-info">
                <h3>{language.name}</h3>
                <p>{language.nativeName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection; 