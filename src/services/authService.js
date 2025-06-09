import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

class AuthService {
  constructor() {
    this.currentUser = null;
  }

  // Register new user
  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, {
        displayName: displayName
      });

      // Create user document in Firestore
      await this.createUserDocument(user, { displayName });

      return {
        success: true,
        user: user,
        message: 'Account created successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Sign in existing user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user,
        message: 'Logged in successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Sign out user
  async logout() {
    try {
      await signOut(auth);
      return {
        success: true,
        message: 'Logged out successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Create user document in Firestore
  async createUserDocument(user, additionalData = {}) {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const { displayName, email } = user;
      const createdAt = serverTimestamp();

      try {
        await setDoc(userRef, {
          displayName: displayName || additionalData.displayName || 'Anonymous',
          email,
          createdAt,
          lastLoginAt: createdAt,
          totalXP: 0,
          currentStreak: 0,
          longestStreak: 0,
          lessonsCompleted: 0,
          averageAccuracy: 0,
          totalTimeSpent: 0,
          achievements: [],
          preferences: {
            selectedLanguage: null,
            notifications: true,
            soundEnabled: true
          },
          progress: {},
          ...additionalData
        });
      } catch (error) {
        console.log('Error creating user document', error);
      }
    }

    return userRef;
  }

  // Get user data from Firestore
  async getUserData(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return {
          success: true,
          data: userDoc.data()
        };
      } else {
        return {
          success: false,
          message: 'User data not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: 'Error fetching user data'
      };
    }
  }

  // Update user data in Firestore
  async updateUserData(userId, data) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        lastUpdated: serverTimestamp()
      });
      return {
        success: true,
        message: 'User data updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: 'Error updating user data'
      };
    }
  }

  // Listen to authentication state changes
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Get user-friendly error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/missing-password': 'Please enter your password.',
      'auth/missing-email': 'Please enter your email address.'
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }
}

const authServiceInstance = new AuthService();
export default authServiceInstance; 