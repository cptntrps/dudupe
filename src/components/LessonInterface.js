import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getLessonsForLanguage } from '../data/lessonsData';
import './LessonInterface.css';

const LessonInterface = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { selectedLanguage, hearts, loseHeart, completeLesson, setCurrentLesson } = useApp();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  // const [lessonComplete, setLessonComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  // New state for advanced exercise types
  const [typedAnswer, setTypedAnswer] = useState('');
  const [draggedWords, setDraggedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [wordOrderAnswer, setWordOrderAnswer] = useState([]);

  const lessons = getLessonsForLanguage(selectedLanguage?.id);
  const currentLesson = lessons.find(lesson => lesson.id === parseInt(lessonId));
  const currentExercise = currentLesson?.exercises[currentExerciseIndex];
  const progress = ((currentExerciseIndex + 1) / currentLesson?.exercises?.length) * 100;

  useEffect(() => {
    if (currentLesson) {
      setCurrentLesson(currentLesson);
    }
  }, [currentLesson, setCurrentLesson]);

  // Reset state when exercise changes
  useEffect(() => {
    if (currentExercise) {
      setSelectedAnswer(null);
      setTypedAnswer('');
      setDraggedWords([]);
      setWordOrderAnswer([]);
      setShowFeedback(false);
      
      // Initialize word lists for drag-drop and word-order exercises
      if (currentExercise.type === 'drag-drop' || currentExercise.type === 'word-order') {
        setAvailableWords([...currentExercise.words]);
      }
    }
  }, [currentExerciseIndex, currentExercise]);

  const handleAnswerSelect = (answer) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer && !typedAnswer && draggedWords.length === 0 && wordOrderAnswer.length === 0) return;

    let correct = false;
    
    if (currentExercise.type === 'image-match') {
      correct = selectedAnswer === currentExercise.correctAnswer;
    } else if (currentExercise.type === 'typing') {
      correct = typedAnswer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim();
    } else if (currentExercise.type === 'drag-drop') {
      correct = draggedWords.join(' ') === currentExercise.correctAnswer;
    } else if (currentExercise.type === 'word-order') {
      correct = wordOrderAnswer.join(' ') === currentExercise.correctAnswer;
    } else {
      correct = selectedAnswer === currentExercise.correctAnswer;
    }

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      loseHeart();
    }
  };

  const handleContinue = () => {
    if (currentExerciseIndex < currentLesson.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTypedAnswer('');
      setDraggedWords([]);
      setWordOrderAnswer([]);
      setShowFeedback(false);
    } else {
      // Lesson complete
      completeLesson(currentLesson.id);
      navigate('/results', { 
        state: { 
          correctAnswers, 
          totalQuestions: currentLesson.exercises.length,
          xpEarned: currentLesson.xp 
        } 
      });
    }
  };

  const handleClose = () => {
    navigate('/lessons');
  };

  // Handlers for new exercise types
  const handleWordDrag = (word) => {
    setDraggedWords([...draggedWords, word]);
    setAvailableWords(availableWords.filter(w => w !== word));
  };

  const handleWordRemove = (wordIndex) => {
    const word = draggedWords[wordIndex];
    setDraggedWords(draggedWords.filter((_, index) => index !== wordIndex));
    setAvailableWords([...availableWords, word]);
  };

  const handleWordOrderClick = (word) => {
    if (wordOrderAnswer.includes(word)) {
      // Remove word from answer
      setWordOrderAnswer(wordOrderAnswer.filter(w => w !== word));
    } else {
      // Add word to answer
      setWordOrderAnswer([...wordOrderAnswer, word]);
    }
  };

  const isAnswerReady = () => {
    if (currentExercise?.type === 'typing') return typedAnswer.trim().length > 0;
    if (currentExercise?.type === 'drag-drop') return draggedWords.length > 0;
    if (currentExercise?.type === 'word-order') return wordOrderAnswer.length > 0;
    return selectedAnswer !== null;
  };

  if (!currentLesson) {
    return <div>Lesson not found</div>;
  }

  if (hearts === 0) {
    return (
      <div className="lesson-interface">
        <div className="out-of-hearts">
          <div className="sad-owl">😢</div>
          <h2>You're out of hearts!</h2>
          <p>Take a break and come back later, or practice old lessons to earn hearts back.</p>
          <button className="back-to-map-btn" onClick={() => navigate('/lessons')}>
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-interface">
      <div className="lesson-header">
        <button className="close-button" onClick={handleClose}>×</button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="hearts">
          {[...Array(5)].map((_, index) => (
            <span key={index} className={`heart ${index >= hearts ? 'empty' : ''}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      <div className="lesson-content">
        <div className="exercise-container">
          <div className="question-section">
            <h2 className="question">{currentExercise.question}</h2>
          </div>

          <div className="answers-section">
            {currentExercise.type === 'image-match' ? (
              <div className="image-options">
                {currentExercise.options.map((option) => (
                  <div
                    key={option.id}
                    className={`image-option ${selectedAnswer === option.id ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(option.id)}
                  >
                    <div className="image-icon">{option.text}</div>
                    <div className="image-label">{option.label}</div>
                  </div>
                ))}
              </div>
            ) : currentExercise.type === 'typing' ? (
              <div className="typing-exercise">
                <input
                  type="text"
                  className="typing-input"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  placeholder="Type your answer here... (Digite sua resposta aqui...)"
                  disabled={showFeedback}
                />
              </div>
            ) : currentExercise.type === 'drag-drop' ? (
              <div className="drag-drop-exercise">
                <div className="drop-zone">
                  {draggedWords.map((word, index) => (
                    <span
                      key={index}
                      className="dropped-word"
                      onClick={() => handleWordRemove(index)}
                    >
                      {word}
                    </span>
                  ))}
                  {draggedWords.length === 0 && (
                    <span className="drop-placeholder">Drag words here (Arraste palavras aqui)</span>
                  )}
                </div>
                <div className="word-bank">
                  {availableWords.map((word, index) => (
                    <button
                      key={index}
                      className="draggable-word"
                      onClick={() => handleWordDrag(word)}
                      disabled={showFeedback}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            ) : currentExercise.type === 'word-order' ? (
              <div className="word-order-exercise">
                <div className="selected-words">
                  {wordOrderAnswer.map((word, index) => (
                    <span key={index} className="ordered-word">
                      {index + 1}. {word}
                    </span>
                  ))}
                </div>
                <div className="word-options">
                  {currentExercise.words.map((word, index) => (
                    <button
                      key={index}
                      className={`word-option ${wordOrderAnswer.includes(word) ? 'selected' : ''}`}
                      onClick={() => handleWordOrderClick(word)}
                      disabled={showFeedback}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-options">
                {currentExercise.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {showFeedback && (
            <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="feedback-icon">
                {isCorrect ? '✅' : '❌'}
              </div>
              <div className="feedback-text">
                {isCorrect ? 'Great job!' : `Correct answer: ${currentExercise.correctAnswer}`}
              </div>
            </div>
          )}
        </div>

        <div className="lesson-footer">
          {!showFeedback && (
            <button
              className={`check-button ${isAnswerReady() ? 'active' : ''}`}
              onClick={handleCheckAnswer}
              disabled={!isAnswerReady()}
            >
              CHECK
            </button>
          )}

          {showFeedback && (
            <button className="continue-button" onClick={handleContinue}>
              CONTINUE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonInterface; 