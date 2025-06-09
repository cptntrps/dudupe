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

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="language-selection">
      <div className="screen-header">
        <button className="back-button" onClick={handleBack}>
          ←
        </button>
        <h2>Choose a language</h2>
        <div></div>
      </div>

      <div className="language-content">
        <div className="owl-mascot">🦉</div>
        <p className="selection-text">What would you like to learn?</p>
        
        <div className="languages-grid">
          {languages.map((language) => (
            <div
              key={language.id}
              className="language-card"
              onClick={() => handleLanguageSelect(language)}
            >
              <div className="language-flag">{language.flag}</div>
              <div className="language-info">
                <h3 className="language-name">{language.name}</h3>
                <p className="language-native">{language.nativeName}</p>
              </div>
              <div className="language-arrow">→</div>
            </div>
          ))}
        </div>

        <div className="selection-footer">
          <p>For English speakers</p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection; 