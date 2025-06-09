import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('duolingo-clone-data');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSelectedLanguage(data.selectedLanguage || null);
      setHearts(data.hearts || 5);
      setXp(data.xp || 0);
      setStreak(data.streak || 0);
      setCompletedLessons(new Set(data.completedLessons || []));
      setLessonProgress(data.lessonProgress || {});
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      selectedLanguage,
      hearts,
      xp,
      streak,
      completedLessons: Array.from(completedLessons),
      lessonProgress
    };
    localStorage.setItem('duolingo-clone-data', JSON.stringify(dataToSave));
  }, [selectedLanguage, hearts, xp, streak, completedLessons, lessonProgress]);

  const loseHeart = () => {
    setHearts(prev => Math.max(0, prev - 1));
  };

  const gainXP = (amount) => {
    setXp(prev => prev + amount);
  };

  const completeLesson = (lessonId) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    gainXP(10);
  };

  const updateLessonProgress = (lessonId, progress) => {
    setLessonProgress(prev => ({
      ...prev,
      [lessonId]: progress
    }));
  };

  const resetHearts = () => {
    setHearts(5);
  };

  const value = {
    selectedLanguage,
    setSelectedLanguage,
    hearts,
    setHearts,
    loseHeart,
    resetHearts,
    xp,
    gainXP,
    streak,
    setStreak,
    completedLessons,
    completeLesson,
    currentLesson,
    setCurrentLesson,
    lessonProgress,
    updateLessonProgress
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}; 