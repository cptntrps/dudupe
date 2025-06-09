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
    completeLesson, 
    setCurrentLesson
  } = useApp();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [lessonStartTime, setLessonStartTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (currentExerciseIndex >= 0 && currentLesson?.exercises) {
      const exercise = currentLesson.exercises[currentExerciseIndex];
      
      console.log('=== NEW EXERCISE LOADED ===');
      console.log('Exercise Index:', currentExerciseIndex);
      console.log('Exercise Type:', exercise?.type);
      console.log('Question:', exercise?.question);
      console.log('===========================');
      
      if (exercise?.type === 'drag-drop' && exercise.words) {
        setAvailableWords([...exercise.words]);
        console.log('Initialized words for drag-drop:', exercise.words);
      }
      
      if (exercise?.type === 'word-order' && exercise.words) {
        console.log('Initialized words for word-order:', exercise.words);
      }
      
      // Reset states for new exercise - only when exercise index changes
      console.log('Resetting state for new exercise');
      setSelectedAnswer(null);
      setTypedAnswer('');
      setDraggedWords([]);
      setWordOrderAnswer([]);
      setShowFeedback(false);
      setIsProcessing(false);
      
      console.log('State reset complete');
    }
  }, [currentExerciseIndex, currentLesson?.exercises]); // Depend on exercise index and exercises array

  const handleAnswerSelect = (answer) => {
    console.log('=== ANSWER SELECTION ATTEMPT ===');
    console.log('Attempting to select answer:', answer);
    console.log('showFeedback:', showFeedback);
    console.log('isProcessing:', isProcessing);
    console.log('Current selectedAnswer:', selectedAnswer);
    
    if (showFeedback || isProcessing) {
      console.log('Selection blocked - feedback showing or processing');
      return;
    }
    
    console.log('Setting selected answer to:', answer);
    setSelectedAnswer(answer);
    console.log('=== ANSWER SELECTION COMPLETE ===');
  };

  const handleCheckAnswer = async () => {
    console.log('=== HANDLE CHECK ANSWER START ===');
    console.log('Current exercise type:', currentExercise.type);
    console.log('Selected answer:', selectedAnswer);
    console.log('Typed answer:', typedAnswer);
    
    if (isProcessing) {
      console.log('Already processing, skipping...');
      return;
    }
    
    if (!selectedAnswer && !typedAnswer && draggedWords.length === 0 && wordOrderAnswer.length === 0) {
      console.log('No answer provided');
      return;
    }
    
    console.log('Setting isProcessing to true');
    setIsProcessing(true);
    
    setTimeout(() => {
      console.log('Processing answer after timeout...');
      
      let correct = false;
      
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
        // Get the correct order by splitting the correct answer
        const correctOrder = currentExercise.correctAnswer.split(' ');
        const userOrder = wordOrderAnswer;
        
        // Check if arrays have same length and same elements in same order
        correct = correctOrder.length === userOrder.length && 
                 correctOrder.every((word, index) => word === userOrder[index]);
        
        console.log('=== WORD ORDER COMPARISON ===');
        console.log('User selected order:', userOrder);
        console.log('Correct word order:', correctOrder);
        console.log('Arrays match:', correct);
        console.log('Length match:', correctOrder.length === userOrder.length);
        if (correctOrder.length === userOrder.length) {
          console.log('Word by word comparison:');
          correctOrder.forEach((word, index) => {
            const userWord = userOrder[index];
            const matches = word === userWord;
            console.log(`Position ${index}: "${userWord}" vs "${word}" = ${matches}`);
          });
        }
        console.log('==============================');
      } else {
        correct = selectedAnswer === currentExercise.correctAnswer;
        console.log('Multiple choice - Selected:', selectedAnswer, 'Correct:', currentExercise.correctAnswer, 'Result:', correct);
      }

      console.log('=== ANSWER VALIDATION ===');
      console.log('User Answer:', selectedAnswer || typedAnswer || draggedWords.join(' ') || wordOrderAnswer.join(' '));
      console.log('Expected Answer:', currentExercise.correctAnswer);
      console.log('Is Correct:', correct);
      console.log('========================');

      console.log('Setting feedback - Correct:', correct);
      console.log('About to set showFeedback to true and isProcessing to false');
      
      // Update states
      setIsCorrect(correct);
      setIsProcessing(false);
      
      // Force state update with a callback to ensure it happens
      setShowFeedback(true);
      
      console.log('State should now be updated - showFeedback: true, isProcessing: false');

      // Handle exercise completion
      try {
        console.log('Not calling endExercise to prevent re-renders');
        // endExercise(currentExercise.type, correct);

        if (correct) {
          console.log('✅ Correct answer!');
          setCorrectAnswers(prev => prev + 1);
        } else {
          console.log('❌ Wrong answer detected!');
        }
      } catch (error) {
        console.error('Error in handleCheckAnswer:', error);
      }
    }, 100); // Reduced delay to see if timing is the issue
  };

  const handleContinue = () => {
    console.log('handleContinue called');
    console.log('showFeedback:', showFeedback);
    console.log('currentExerciseIndex:', currentExerciseIndex);
    console.log('totalExercises:', currentLesson.exercises.length);
    
    if (!showFeedback) {
      console.log('No feedback showing, cannot continue yet');
      return;
    }
    
    // Reset states for next question
    setShowFeedback(false);
    setSelectedAnswer(null);
    setTypedAnswer('');
    setDraggedWords([]);
    setAvailableWords([]);
    setWordOrderAnswer([]);
    
    console.log('States reset for next question');
    
    if (currentExerciseIndex < currentLesson.exercises.length - 1) {
      console.log('Moving to next exercise');
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      
      // Initialize next exercise if it's drag-drop or word-order
      const nextExercise = currentLesson.exercises[currentExerciseIndex + 1];
      if (nextExercise.type === 'drag-drop' || nextExercise.type === 'word-order') {
        const words = nextExercise.correctAnswer.split(' ');
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        setAvailableWords(shuffled);
      }
    } else {
      console.log('Lesson completed, navigating to results');
      const timeSpent = lessonStartTime ? (Date.now() - lessonStartTime) / 1000 / 60 : 0;
      const accuracy = Math.round((correctAnswers / currentLesson.exercises.length) * 100);
      const xpEarned = currentLesson.xp || 15;
      
      console.log('Lesson completion stats:', {
        correctAnswers,
        totalQuestions: currentLesson.exercises.length,
        accuracy,
        timeSpent,
        xpEarned
      });
      
      // Complete the lesson
      completeLesson(currentLesson.id, accuracy, timeSpent);
      
      // Navigate to results
      navigate('/results', {
        state: {
          correctAnswers,
          totalQuestions: currentLesson.exercises.length,
          accuracy,
          timeSpent,
          xpEarned,
          completionData: null
        }
      });
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
    
    console.log('Word clicked:', word);
    console.log('Current word order answer:', wordOrderAnswer);
    
    if (wordOrderAnswer.includes(word)) {
      // Remove word from answer and make it available again
      console.log('Removing word from answer:', word);
      setWordOrderAnswer(prev => prev.filter(w => w !== word));
    } else {
      // Add word to answer
      console.log('Adding word to answer:', word);
      setWordOrderAnswer(prev => [...prev, word]);
    }
  };

  // New function to handle removing words from the selected order
  const handleOrderedWordClick = (word, index) => {
    if (showFeedback || isProcessing) return;
    
    console.log('Removing ordered word at index:', index, 'word:', word);
    setWordOrderAnswer(prev => prev.filter((_, i) => i !== index));
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

  return (
    <div className="lesson-interface">
      <div className="lesson-header">
        <button className="close-button" onClick={handleExit}>×</button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
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
                  {wordOrderAnswer.length === 0 ? (
                    <span className="drop-placeholder">Click words below to build your answer... (Clique nas palavras abaixo para formar sua resposta...)</span>
                  ) : (
                    wordOrderAnswer.map((word, index) => (
                      <span 
                        key={index} 
                        className="ordered-word"
                        onClick={() => handleOrderedWordClick(word, index)}
                        style={{ cursor: 'pointer' }}
                        title="Click to remove (Clique para remover)"
                      >
                        {index + 1}. {word}
                      </span>
                    ))
                  )}
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
              <div className="feedback-content">
                <div className="feedback-icon">
                  {isCorrect ? '✅' : '❌'}
                </div>
                <div className="feedback-text">
                  <h3>{isCorrect ? 'Correct!' : 'Oops! Not quite right.'}</h3>
                  {!isCorrect && (
                    <div className="correct-answer">
                      <p>The correct answer is: <strong>{currentExercise.correctAnswer}</strong></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom footer with buttons */}
      <div className="lesson-footer-fixed">
        {!showFeedback ? (
          <button 
            className="check-button" 
            onClick={handleCheckAnswer}
            disabled={isProcessing || !isAnswerReady()}
          >
            {isProcessing ? 'Checking...' : 'Check'}
          </button>
                  ) : (
            <button 
              className="continue-button"
              onClick={handleContinue}
            >
              Continue
            </button>
          )}
      </div>
    </div>
  );
};

export default LessonInterface; 