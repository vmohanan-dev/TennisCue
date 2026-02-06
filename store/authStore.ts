import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isInitialized: false,
      error: null,

      initialize: async () => {
        try {
          set({ isLoading: true });

          // Get the current session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error('Error getting session:', error.message);
          }

          set({
            session,
            user: session?.user ?? null,
            isLoading: false,
            isInitialized: true,
          });

          // Set up auth state listener
          supabase.auth.onAuthStateChange((_event, session) => {
            set({
              session,
              user: session?.user ?? null,
            });
          });
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ isLoading: false, isInitialized: true });
        }
      },

      signUp: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          set({
            session: data.session,
            user: data.user,
            isLoading: false,
          });

          return { success: true };
        } catch (error: any) {
          const message = error.message || 'An error occurred during sign up';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          set({
            session: data.session,
            user: data.user,
            isLoading: false,
          });

          return { success: true };
        } catch (error: any) {
          const message = error.message || 'An error occurred during sign in';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          await supabase.auth.signOut();
          set({
            session: null,
            user: null,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          console.error('Error signing out:', error);
          set({ isLoading: false });
        }
      },

      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email);

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          set({ isLoading: false });
          return { success: true };
        } catch (error: any) {
          const message = error.message || 'An error occurred';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      clearError: () => set({ error: null }),

      setSession: (session) =>
        set({
          session,
          user: session?.user ?? null,
        }),
    }),
    {
      name: 'tennis-cue-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist minimal auth state
        // Actual tokens are in SecureStore via Supabase client
      }),
    }
  )
);
