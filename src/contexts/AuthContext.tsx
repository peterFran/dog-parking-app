'use client';

import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { apiClient } from '../lib/api-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Ensures the user has an owner profile in the backend.
   * If the profile doesn't exist (404), it automatically registers them.
   * This runs once per authentication event.
   */
  const ensureOwnerRegistered = async (user: User) => {
    try {
      const token = await user.getIdToken();

      // Try to get existing profile
      await apiClient.getOwnerProfile(token);
      console.log('Owner profile exists');
      // Profile exists, no action needed
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Check if error is 404 (owner doesn't exist)
      if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
        console.log('Owner profile not found, registering...');
        try {
          // Owner doesn't exist, register them with empty profile
          // Backend extracts user info from JWT token
          const token = await user.getIdToken();
          await apiClient.registerOwner({}, token);
          console.log('Owner registered successfully');
        } catch (registerError) {
          console.error('Auto-registration failed:', registerError);
          // Don't block the user - they can continue using the app
          // They might see errors when trying to access protected features
        }
      } else {
        // Some other error occurred (network, auth, etc.)
        console.error('Error checking owner profile:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // User is signed in, ensure they have an owner profile
        await ensureOwnerRegistered(user);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send email verification
      await sendEmailVerification(userCredential.user);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<User> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Get ID token error:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}