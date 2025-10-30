import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile 
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser).role : null;
  });
  const [loading, setLoading] = useState(true);
  const [backendUser, setBackendUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  // Enhanced register function - FIXED VERSION
  const registerUser = async (userData) => {
    try {
      setError(null);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // 1. FIRST create Firebase user
      const { user } = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      // 2. Update Firebase profile
      if (userData.profile?.fullName) {
        await updateProfile(user, {
          displayName: userData.profile.fullName
        });
      }

      // 3. THEN register in your backend with Firebase UID
      const backendResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          firebaseUid: user.uid // Include Firebase UID
        }),
      });

      const backendData = await backendResponse.json();

      if (!backendResponse.ok) {
        // If backend registration fails, delete the Firebase user to maintain consistency
        await user.delete();
        throw new Error(backendData.message || 'Backend registration failed');
      }

      // Store backend token and user data
      localStorage.setItem('token', backendData.token);
      localStorage.setItem('user', JSON.stringify(backendData.user));
      setBackendUser(backendData.user);
      setUserRole(backendData.user.role);
      setCurrentUser(user);

      return { user, backendUser: backendData.user };
    } catch (error) {
      console.error('Registration error:', error);
      
      // More specific error handling
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please use a different email or try logging in.');
        throw new Error('This email is already registered. Please use a different email or try logging in.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
        throw new Error('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
        throw new Error('Invalid email address format.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
        throw error;
      }
    }
  };

  // Enhanced login function
  const loginUser = async (credentials, loginType = 'user') => {
    try {
      setError(null);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      let endpoint = '/api/auth/login';
      let payload = {
        email: credentials.email,
        password: credentials.password
      };
      
      if (loginType === 'admin') {
        endpoint = '/api/auth/admin/login';
        payload = {
          username: credentials.username,
          password: credentials.password
        };
      }

      const backendResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const backendData = await backendResponse.json();

      localStorage.setItem('token', backendData.token);
      localStorage.setItem('user', JSON.stringify(backendData.user));
      setBackendUser(backendData.user);
      setUserRole(backendData.user.role);

      // Sign in with Firebase for non-admin users
      if (loginType !== 'admin') {
        const { user } = await signInWithEmailAndPassword(
          auth, 
          credentials.email, 
          credentials.password
        );
        setCurrentUser(user);
      } else {
        setCurrentUser({
          email: backendData.user.email,
          displayName: backendData.user.username
        });
      }

      return backendData.user;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      throw error;
    }
  };

  // Enhanced Google sign-in
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const backendResponse = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          username: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL,
          firebaseUid: user.uid
        }),
      });

      const backendData = await backendResponse.json();

      if (!backendResponse.ok) {
        await signOut(auth);
        throw new Error(backendData.message || 'Google sign in failed');
      }

      localStorage.setItem('token', backendData.token);
      localStorage.setItem('user', JSON.stringify(backendData.user));
      setBackendUser(backendData.user);
      setUserRole(backendData.user.role);

      return { user, backendUser: backendData.user };
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error.message || 'Google sign in failed. Please try again.');
      throw error;
    }
  };

  // FIXED: Enhanced Logout function
  const logout = async () => {
    try {
      setError(null);
      
      // Clear local storage first
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset state immediately
      setCurrentUser(null);
      setBackendUser(null);
      setUserRole(null);
      
      // Then sign out from Firebase
      await signOut(auth);
      
    } catch (error) {
      console.error('Logout error:', error);
      setError('Logout failed. Please try again.');
      
      // Even if Firebase logout fails, ensure local state is cleared
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
      setBackendUser(null);
      setUserRole(null);
      
      throw error;
    }
  };

  // Check backend authentication
  const checkBackendAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
    } catch (error) {
      console.error('Backend auth check error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  };

  // Auth state management
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setCurrentUser(user);
            const backendUserData = await checkBackendAuth();
            if (backendUserData) {
              setBackendUser(backendUserData);
              setUserRole(backendUserData.role);
            } else {
              // If no backend user but Firebase user exists, log out
              await logout();
            }
          } else {
            const backendUserData = await checkBackendAuth();
            if (backendUserData) {
              setBackendUser(backendUserData);
              setUserRole(backendUserData.role);
              setCurrentUser({
                email: backendUserData.email,
                displayName: backendUserData.username
              });
            } else {
              setCurrentUser(null);
              setBackendUser(null);
              setUserRole(null);
            }
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Authentication initialization failed.');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = {
    // User data
    currentUser,
    backendUser,
    userRole,
    loading,
    error,
    
    // Auth methods
    registerUser,
    loginUser,
    signInWithGoogle,
    logout,
    clearError,
    
    // Role checking
    hasRole: (role) => userRole === role,
    hasAnyRole: (roles) => roles.includes(userRole),
    
    // Helper properties
    isAuthenticated: !!backendUser,
    isAdmin: userRole === 'admin',
    isBookseller: userRole === 'bookseller',
    isUser: userRole === 'user'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};