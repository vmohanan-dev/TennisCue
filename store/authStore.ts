import { supabase } from '@/lib/supabase';
import { useSessionStore } from '@/store/sessionStore';
import { useUserStore } from '@/store/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
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

          // If email confirmation is required, session will be null
          if (data.session) {
            set({ session: data.session, user: data.user, isLoading: false });
          } else {
            set({ isLoading: false });
          }

          return { success: true, needsEmailConfirmation: !data.session };
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

      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          // Force a token refresh to ensure the session is fresh
          const { error: refreshError } = await supabase.auth.refreshSession();

          if (refreshError) {
            set({ isLoading: false });
            return { success: false, error: 'Session expired. Please sign in again.' };
          }

          // Verify we have a valid session after refresh
          const { data: { session: currentSession } } = await supabase.auth.getSession();

          if (!currentSession) {
            set({ isLoading: false });
            return { success: false, error: 'No active session. Please sign in again.' };
          }

          // supabase.functions.invoke automatically includes the auth token
          const { data, error, response } = await supabase.functions.invoke('delete-user', {
            method: 'POST',
          });

          if (error) {
            let message = 'Account deletion is not available right now. Please try again later.';
            try {
              const errorResponse = error.context ?? response;
              if (errorResponse) {
                const text = await errorResponse.text();
                const body = JSON.parse(text);
                if (body?.error) {
                  message = body.error;
                }
              }
            } catch {
              // Fall back to generic message
            }
            set({ error: message, isLoading: false });
            return { success: false, error: message };
          }

          // Clear local data stores before signing out
          useSessionStore.getState().clearSessions();
          useUserStore.getState().resetOnboarding();

          // Sign out locally
          await supabase.auth.signOut();
          set({
            session: null,
            user: null,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error: any) {
          console.error('Error in deleteAccount:', error);
          const message = error.message || 'An error occurred during account deletion';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

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
