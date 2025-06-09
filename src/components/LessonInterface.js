import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getLessonsForLanguage } from '../data/lessonsData';
import './LessonInterface.css';

const LessonInterface = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { 
    selectedLanguage, 
    hearts, 
    loseHeart, 
    completeLesson, 
    setCurrentLesson,
    startExercise,
    endExercise
  } = useApp();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lessonStartTime, setLessonStartTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render mechanism
  
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
      setLessonStartTime(Date.now());
    }
  }, [currentLesson, setCurrentLesson]);

  // Reset state when exercise changes and start timing
  useEffect(() => {
    if (currentExercise) {
      console.log('useEffect triggered - resetting state for exercise:', currentExerciseIndex);
      setSelectedAnswer(null);
      setTypedAnswer('');
      setDraggedWords([]);
      setWordOrderAnswer([]);
      setShowFeedback(false);
      setIsProcessing(false);
      
      // Initialize word lists for drag-drop and word-order exercises
      if (currentExercise.type === 'drag-drop' || currentExercise.type === 'word-order') {
        setAvailableWords([...currentExercise.words]);
      }
      
      // Don't call startExercise here to avoid re-renders
      // startExercise();
    }
  }, [currentExerciseIndex]); // Only depend on exercise index, not currentExercise or startExercise

  const handleAnswerSelect = (answer) => {
    if (showFeedback || isProcessing) return;
    console.log('Answer selected:', answer);
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    console.log('handleCheckAnswer called');
    
    if (isProcessing || showFeedback) {
      console.log('Already processing or showing feedback, returning early');
      return;
    }
    
    if (!isAnswerReady()) {
      console.log('No answer ready, returning early');
      return;
    }

    setIsProcessing(true);
    console.log('Starting answer check...');
    
    setTimeout(() => {
      let correct = false;
      
      console.log('Current exercise:', currentExercise);
      console.log('Exercise type:', currentExercise.type);
      
      if (currentExercise.type === 'image-match') {
        correct = selectedAnswer === currentExercise.correctAnswer;
        console.log('Image match - Selected:', selectedAnswer, 'Correct:', currentExercise.correctAnswer, 'Result:', correct);
      } else if (currentExercise.type === 'typing') {
        correct = typedAnswer.toLowerCase().trim() === currentExercise.correctAnswer.toLowerCase().trim();
        console.log('Typing - Typed:', typedAnswer, 'Correct:', currentExercise.correctAnswer, 'Result:', correct);
      } else if (currentExercise.type === 'drag-drop') {
        correct = draggedWords.join(' ') === currentExercise.correctAnswer;
        console.log('Drag-drop - Dragged:', draggedWords.join(' '), 'Correct:', currentExercise.correctAnswer, 'Result:', correct);
      } else if (currentExercise.type === 'word-order') {
        correct = wordOrderAnswer.join(' ') === currentExercise.correctAnswer;
        console.log('Word order - Answer:', wordOrderAnswer.join(' '), 'Correct:', currentExercise.correctAnswer, 'Result:', correct);
      } else {
        correct = selectedAnswer === currentExercise.correctAnswer;
        console.log('Multiple choice - Selected:', selectedAnswer, 'Correct:', currentExercise.correctAnswer, 'Result:', correct);
      }

      console.log('Setting feedback - Correct:', correct);
      console.log('About to set showFeedback to true and isProcessing to false');
      
      // Update states
      setIsCorrect(correct);
      setIsProcessing(false);
      
      // Force state update with a callback to ensure it happens
      setShowFeedback(true);
      
      console.log('State should now be updated - showFeedback: true, isProcessing: false');

      // Force re-render to ensure UI updates
      setForceUpdate(prev => prev + 1);
      console.log('Forced component re-render');

      // Handle exercise completion
      try {
        console.log('Not calling endExercise to prevent re-renders');
        // endExercise(currentExercise.type, correct);

        if (correct) {
          console.log('Incrementing correct answers');
          setCorrectAnswers(prev => {
            console.log('Previous correct answers:', prev);
            return prev + 1;
          });
        } else {
          console.log('Losing heart');
          loseHeart();
        }
      } catch (error) {
        console.error('Error in handleCheckAnswer:', error);
      }
    }, 100); // Reduced delay to see if timing is the issue
  };

  const handleContinue = () => {
    console.log('handleContinue called');
    console.log('Current exercise index:', currentExerciseIndex, 'Total exercises:', currentLesson.exercises.length);
    
    // Reset states for next exercise
    setShowFeedback(false);
    setIsProcessing(false);
    setSelectedAnswer(null);
    setTypedAnswer('');
    setDraggedWords([]);
    setWordOrderAnswer([]);
    
    if (currentExerciseIndex < currentLesson.exercises.length - 1) {
      console.log('Moving to next exercise');
      setCurrentExerciseIndex(prev => prev + 1);
      
      // Reset available words for drag-drop exercises
      if (currentLesson.exercises[currentExerciseIndex + 1]?.type === 'drag-drop') {
        setAvailableWords([...currentLesson.exercises[currentExerciseIndex + 1].words]);
      }
    } else {
      console.log('Lesson complete - calculating stats');
      
      const accuracy = Math.round((correctAnswers / currentLesson.exercises.length) * 100);
      const timeSpent = lessonStartTime ? (Date.now() - lessonStartTime) / 1000 / 60 : 0;
      
      console.log('Lesson completion data:', { accuracy, timeSpent, correctAnswers, totalQuestions: currentLesson.exercises.length });
      
      try {
        console.log('Calling completeLesson');
        const completionData = completeLesson(currentLesson.id, accuracy, timeSpent);
        
        console.log('Lesson completion result:', completionData);
        
        navigate('/results', { 
          state: { 
            correctAnswers, 
            totalQuestions: currentLesson.exercises.length,
            xpEarned: completionData?.xpEarned || currentLesson.xp,
            accuracy: accuracy,
            timeSpent: Math.round(timeSpent * 10) / 10,
            completionData: completionData
          } 
        });
      } catch (error) {
        console.error('Error completing lesson:', error);
      }
    }
  };

  const handleExit = () => {
    const confirmExit = window.confirm('Are you sure you want to exit this lesson? Your progress will be lost. (Tem certeza de que deseja sair desta lição? Seu progresso será perdido.)');
    if (confirmExit) {
      navigate('/lessons');
    }
  };

  // Handlers for new exercise types
  const handleWordDrag = (word) => {
    if (showFeedback || isProcessing) return;
    setDraggedWords([...draggedWords, word]);
    setAvailableWords(availableWords.filter(w => w !== word));
  };

  const handleWordRemove = (wordIndex) => {
    if (showFeedback || isProcessing) return;
    const word = draggedWords[wordIndex];
    setDraggedWords(draggedWords.filter((_, index) => index !== wordIndex));
    setAvailableWords([...availableWords, word]);
  };

  const handleWordOrderClick = (word) => {
    if (showFeedback || isProcessing) return;
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
    return (
      <div className="lesson-interface">
        <div className="lesson-not-found">
          <h2>Lesson not found</h2>
          <button onClick={() => navigate('/lessons')}>Back to Lessons</button>
        </div>
      </div>
    );
  }

  if (hearts === 0) {
    return (
      <div className="lesson-interface">
        <div className="out-of-hearts">
          <div className="sad-luna">🦊💔</div>
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
        <button className="close-button" onClick={handleExit}>×</button>
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
                    className={`image-option ${selectedAnswer === option.id ? 'selected' : ''} ${showFeedback || isProcessing ? 'disabled' : ''}`}
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
                  disabled={showFeedback || isProcessing}
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
                      disabled={showFeedback || isProcessing}
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
                      disabled={showFeedback || isProcessing}
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
                    className={`option-button ${selectedAnswer === option ? 'selected' : ''} ${showFeedback || isProcessing ? 'disabled' : ''}`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback || isProcessing}
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
                {isCorrect ? 'Great job! (Muito bem!)' : `Correct answer: ${currentExercise.correctAnswer} (Resposta correta: ${currentExercise.correctAnswer})`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom footer with buttons */}
      <div className="lesson-footer-fixed">
        {console.log('=== RENDER DEBUG ===')}
        {console.log('showFeedback:', showFeedback)}
        {console.log('isProcessing:', isProcessing)}
        {console.log('isAnswerReady():', isAnswerReady())}
        {console.log('forceUpdate:', forceUpdate)}
        {console.log('=====================')}
        
        {!showFeedback ? (
          <div>
            {console.log('Rendering CHECK button')}
            <button
              className={`check-button ${isAnswerReady() && !isProcessing ? 'active' : ''}`}
              onClick={handleCheckAnswer}
              disabled={!isAnswerReady() || isProcessing}
            >
              {isProcessing ? 'CHECKING...' : 'CHECK'}
            </button>
          </div>
        ) : (
          <div>
            {console.log('Rendering CONTINUE button - showFeedback is TRUE')}
            <button className="continue-button" onClick={handleContinue}>
              {currentExerciseIndex < currentLesson.exercises.length - 1 ? 'CONTINUE' : 'FINISH LESSON'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonInterface; 