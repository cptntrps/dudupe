// Progress Tracker - Persistent learning progress with content update compatibility
class ProgressTracker {
  constructor() {
    this.storageKey = 'duolingo_progress';
    this.version = '1.0';
    this.initializeProgress();
  }

  // Initialize or migrate progress data
  initializeProgress() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.progress = JSON.parse(stored);
        // Migrate if version is different
        if (this.progress.version !== this.version) {
          this.migrateProgress();
        }
      } catch (error) {
        console.warn('Failed to parse stored progress, resetting:', error);
        this.resetProgress();
      }
    } else {
      this.resetProgress();
    }
  }

  // Create fresh progress structure
  resetProgress() {
    this.progress = {
      version: this.version,
      user: {
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        totalLessonsCompleted: 0,
        totalExercisesCompleted: 0,
        overallAccuracy: 0,
        createdDate: new Date().toISOString(),
        level: 1
      },
      languages: {},
      achievements: [],
      dailyStats: {},
      exercisePerformance: {}
    };
    this.saveProgress();
  }

  // Handle progress migration between versions
  migrateProgress() {
    console.log('Migrating progress from version', this.progress.version, 'to', this.version);
    // Add migration logic here when content changes
    this.progress.version = this.version;
    this.saveProgress();
  }

  // Save progress to localStorage
  saveProgress() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  // Get language progress, initialize if not exists
  getLanguageProgress(languageId) {
    if (!this.progress.languages[languageId]) {
      this.progress.languages[languageId] = {
        name: languageId,
        totalXP: 0,
        lessonsCompleted: [],
        currentLesson: null,
        overallAccuracy: 0,
        timeSpent: 0, // in minutes
        startDate: new Date().toISOString()
      };
      this.saveProgress();
    }
    return this.progress.languages[languageId];
  }

  // Mark lesson as completed
  completeLesson(languageId, lessonId, xpEarned, accuracy, timeSpent) {
    const langProgress = this.getLanguageProgress(languageId);
    const completionData = {
      lessonId: lessonId,
      completedAt: new Date().toISOString(),
      xpEarned: xpEarned,
      accuracy: accuracy,
      timeSpent: timeSpent
    };

    // Check if lesson already completed
    const existingIndex = langProgress.lessonsCompleted.findIndex(
      lesson => lesson.lessonId === lessonId
    );

    if (existingIndex >= 0) {
      // Update existing completion (user repeated lesson)
      langProgress.lessonsCompleted[existingIndex] = completionData;
    } else {
      // New lesson completion
      langProgress.lessonsCompleted.push(completionData);
      this.progress.user.totalLessonsCompleted++;
    }

    // Update XP
    langProgress.totalXP += xpEarned;
    this.progress.user.totalXP += xpEarned;

    // Update accuracy
    this.updateAccuracy(languageId, accuracy);

    // Update time spent
    langProgress.timeSpent += timeSpent;

    // Update streak
    this.updateStreak();

    // Update level
    this.updateLevel();

    // Record daily stats
    this.recordDailyStats(xpEarned);

    // Check for achievements
    this.checkAchievements(languageId, lessonId, accuracy);

    this.saveProgress();
    return completionData;
  }

  // Update accuracy calculations
  updateAccuracy(languageId, lessonAccuracy) {
    const langProgress = this.getLanguageProgress(languageId);
    const completedLessons = langProgress.lessonsCompleted;
    
    if (completedLessons.length > 0) {
      const totalAccuracy = completedLessons.reduce((sum, lesson) => sum + lesson.accuracy, 0);
      langProgress.overallAccuracy = Math.round(totalAccuracy / completedLessons.length);
    }

    // Update overall user accuracy
    const allLanguages = Object.values(this.progress.languages);
    if (allLanguages.length > 0) {
      const overallTotal = allLanguages.reduce((sum, lang) => {
        return sum + (lang.overallAccuracy * lang.lessonsCompleted.length);
      }, 0);
      const totalLessons = allLanguages.reduce((sum, lang) => sum + lang.lessonsCompleted.length, 0);
      this.progress.user.overallAccuracy = totalLessons > 0 ? Math.round(overallTotal / totalLessons) : 0;
    }
  }

  // Update user level based on XP
  updateLevel() {
    const xp = this.progress.user.totalXP;
    // Level formula: every 100 XP = 1 level, with increasing requirements
    const newLevel = Math.floor(Math.sqrt(xp / 50)) + 1;
    this.progress.user.level = Math.max(newLevel, 1);
  }

  // Update streak counter
  updateStreak() {
    const today = new Date().toDateString();
    const lastActive = this.progress.user.lastActiveDate;
    
    if (lastActive) {
      const lastActiveDate = new Date(lastActive).toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (lastActiveDate === today) {
        // Already practiced today, keep streak
        return;
      } else if (lastActiveDate === yesterday) {
        // Practiced yesterday, increment streak
        this.progress.user.currentStreak++;
      } else {
        // Streak broken, reset
        this.progress.user.currentStreak = 1;
      }
    } else {
      // First time practicing
      this.progress.user.currentStreak = 1;
    }
    
    // Update longest streak
    if (this.progress.user.currentStreak > this.progress.user.longestStreak) {
      this.progress.user.longestStreak = this.progress.user.currentStreak;
    }
    
    this.progress.user.lastActiveDate = today;
  }

  // Record daily statistics
  recordDailyStats(xpEarned) {
    const today = new Date().toDateString();
    if (!this.progress.dailyStats[today]) {
      this.progress.dailyStats[today] = {
        date: today,
        xpEarned: 0,
        lessonsCompleted: 0,
        exercisesCompleted: 0,
        timeSpent: 0
      };
    }
    this.progress.dailyStats[today].xpEarned += xpEarned;
    this.progress.dailyStats[today].lessonsCompleted++;
  }

  // Record exercise performance
  recordExercisePerformance(exerciseType, correct, timeSpent) {
    if (!this.progress.exercisePerformance[exerciseType]) {
      this.progress.exercisePerformance[exerciseType] = {
        total: 0,
        correct: 0,
        averageTime: 0,
        accuracy: 0
      };
    }
    
    const perf = this.progress.exercisePerformance[exerciseType];
    perf.total++;
    if (correct) perf.correct++;
    perf.accuracy = Math.round((perf.correct / perf.total) * 100);
    perf.averageTime = ((perf.averageTime * (perf.total - 1)) + timeSpent) / perf.total;
    
    this.progress.user.totalExercisesCompleted++;
    this.saveProgress();
  }

  // Check and award achievements
  checkAchievements(languageId, lessonId, accuracy) {
    const achievements = [];
    
    // First lesson completed
    if (this.progress.user.totalLessonsCompleted === 1) {
      achievements.push({
        id: 'first_lesson',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🌟',
        earnedAt: new Date().toISOString()
      });
    }
    
    // Perfect lesson
    if (accuracy === 100) {
      achievements.push({
        id: `perfect_${lessonId}`,
        name: 'Perfect Lesson',
        description: `Got 100% accuracy in a lesson`,
        icon: '💯',
        earnedAt: new Date().toISOString()
      });
    }
    
    // Streak achievements
    const streak = this.progress.user.currentStreak;
    if (streak === 3) {
      achievements.push({
        id: 'streak_3',
        name: '3-Day Streak',
        description: 'Practice for 3 days in a row',
        icon: '🔥',
        earnedAt: new Date().toISOString()
      });
    } else if (streak === 7) {
      achievements.push({
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Practice for 7 days in a row',
        icon: '⚡',
        earnedAt: new Date().toISOString()
      });
    }
    
    // XP milestones
    const totalXP = this.progress.user.totalXP;
    if (totalXP >= 100 && !this.hasAchievement('xp_100')) {
      achievements.push({
        id: 'xp_100',
        name: 'XP Collector',
        description: 'Earn 100 XP total',
        icon: '💎',
        earnedAt: new Date().toISOString()
      });
    }
    
    // Add new achievements to progress
    achievements.forEach(achievement => {
      if (!this.hasAchievement(achievement.id)) {
        this.progress.achievements.push(achievement);
      }
    });
    
    return achievements;
  }

  // Check if user has specific achievement
  hasAchievement(achievementId) {
    return this.progress.achievements.some(a => a.id === achievementId);
  }

  // Get lesson completion status
  isLessonCompleted(languageId, lessonId) {
    const langProgress = this.getLanguageProgress(languageId);
    return langProgress.lessonsCompleted.some(lesson => lesson.lessonId === lessonId);
  }

  // Get lesson completion data
  getLessonCompletion(languageId, lessonId) {
    const langProgress = this.getLanguageProgress(languageId);
    return langProgress.lessonsCompleted.find(lesson => lesson.lessonId === lessonId);
  }

  // Get user statistics
  getUserStats() {
    return {
      ...this.progress.user,
      languages: Object.keys(this.progress.languages).length,
      achievements: this.progress.achievements.length,
      recentAchievements: this.progress.achievements.slice(-3)
    };
  }

  // Get language statistics
  getLanguageStats(languageId) {
    return this.getLanguageProgress(languageId);
  }

  // Get exercise type performance
  getExerciseStats() {
    return this.progress.exercisePerformance;
  }

  // Export progress for backup
  exportProgress() {
    return JSON.stringify(this.progress, null, 2);
  }

  // Import progress from backup
  importProgress(progressData) {
    try {
      this.progress = JSON.parse(progressData);
      this.saveProgress();
      return true;
    } catch (error) {
      console.error('Failed to import progress:', error);
      return false;
    }
  }

  // Clear all progress
  clearAllProgress() {
    if (window.confirm('Are you sure you want to clear all progress? This cannot be undone.')) {
      localStorage.removeItem(this.storageKey);
      this.initializeProgress();
      return true;
    }
    return false;
  }

  // Get default progress structure
  getDefaultProgress() {
    return {
      languages: {},
      globalStats: {
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        lessonsCompleted: 0,
        totalTimeSpent: 0,
        averageAccuracy: 0,
        lastStudyDate: null
      },
      achievements: [],
      exerciseStats: {},
      dailyStats: {},
      version: this.version
    };
  }

  // Sync with cloud data - merge cloud progress with local progress
  syncWithCloudData(cloudProgress) {
    if (!cloudProgress || typeof cloudProgress !== 'object') {
      console.warn('Invalid cloud progress data');
      return false;
    }

    try {
      const currentProgress = this.getDefaultProgress();
      
      // Merge languages progress
      if (cloudProgress.languages) {
        Object.keys(cloudProgress.languages).forEach(languageId => {
          const cloudLangData = cloudProgress.languages[languageId];
          const localLangData = currentProgress.languages[languageId] || {
            lessons: {},
            totalXP: 0,
            lessonsCompleted: 0,
            lastStudiedAt: null
          };

          // Merge lesson data, keeping the best progress for each lesson
          const mergedLessons = { ...localLangData.lessons };
          if (cloudLangData.lessons) {
            Object.keys(cloudLangData.lessons).forEach(lessonId => {
              const cloudLesson = cloudLangData.lessons[lessonId];
              const localLesson = mergedLessons[lessonId];

              if (!localLesson || cloudLesson.lastCompletedAt > localLesson.lastCompletedAt) {
                mergedLessons[lessonId] = cloudLesson;
              } else if (localLesson && cloudLesson.bestAccuracy > localLesson.bestAccuracy) {
                // Keep local but update best accuracy if cloud is better
                mergedLessons[lessonId] = {
                  ...localLesson,
                  bestAccuracy: cloudLesson.bestAccuracy
                };
              }
            });
          }

          currentProgress.languages[languageId] = {
            lessons: mergedLessons,
            totalXP: Math.max(localLangData.totalXP, cloudLangData.totalXP || 0),
            lessonsCompleted: Math.max(localLangData.lessonsCompleted, cloudLangData.lessonsCompleted || 0),
            lastStudiedAt: localLangData.lastStudiedAt && cloudLangData.lastStudiedAt 
              ? Math.max(localLangData.lastStudiedAt, cloudLangData.lastStudiedAt)
              : localLangData.lastStudiedAt || cloudLangData.lastStudiedAt || null
          };
        });
      }

      // Merge global stats, keeping the maximum values
      if (cloudProgress.globalStats) {
        const cloudStats = cloudProgress.globalStats;
        currentProgress.globalStats = {
          totalXP: Math.max(currentProgress.globalStats.totalXP, cloudStats.totalXP || 0),
          currentStreak: Math.max(currentProgress.globalStats.currentStreak, cloudStats.currentStreak || 0),
          longestStreak: Math.max(currentProgress.globalStats.longestStreak, cloudStats.longestStreak || 0),
          lessonsCompleted: Math.max(currentProgress.globalStats.lessonsCompleted, cloudStats.lessonsCompleted || 0),
          totalTimeSpent: Math.max(currentProgress.globalStats.totalTimeSpent, cloudStats.totalTimeSpent || 0),
          averageAccuracy: Math.max(currentProgress.globalStats.averageAccuracy, cloudStats.averageAccuracy || 0),
          lastStudyDate: currentProgress.globalStats.lastStudyDate && cloudStats.lastStudyDate
            ? Math.max(currentProgress.globalStats.lastStudyDate, cloudStats.lastStudyDate)
            : currentProgress.globalStats.lastStudyDate || cloudStats.lastStudyDate || null
        };
      }

      // Merge achievements
      if (cloudProgress.achievements && Array.isArray(cloudProgress.achievements)) {
        const existingAchievements = new Set(
          currentProgress.achievements.map(a => `${a.type}-${a.id}`)
        );
        
        cloudProgress.achievements.forEach(achievement => {
          const achievementKey = `${achievement.type}-${achievement.id}`;
          if (!existingAchievements.has(achievementKey)) {
            currentProgress.achievements.push(achievement);
          }
        });
      }

      // Update the stored progress
      this.progress = currentProgress;
      this.saveProgress();
      
      console.log('Successfully synced with cloud data');
      return true;
    } catch (error) {
      console.error('Error syncing with cloud data:', error);
      return false;
    }
  }
}

// Create singleton instance
const progressTracker = new ProgressTracker();

export default progressTracker; 