import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, CueRating } from '@/types';

interface SessionState {
  sessions: Session[];
  // Actions
  addSession: (cueRatings: CueRating[], notes?: string) => void;
  deleteSession: (sessionId: string) => void;
  getSessionById: (sessionId: string) => Session | undefined;
  getRecentSessions: (limit?: number) => Session[];
  getCueProgress: (cueId: string) => { date: string; rating: number }[];
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (cueRatings, notes) => {
        const newSession: Session = {
          id: `session-${Date.now()}`,
          date: new Date().toISOString(),
          cueRatings,
          notes,
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
        }));
      },

      deleteSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
        }));
      },

      getSessionById: (sessionId) => {
        return get().sessions.find((s) => s.id === sessionId);
      },

      getRecentSessions: (limit = 10) => {
        return get().sessions.slice(0, limit);
      },

      getCueProgress: (cueId) => {
        const { sessions } = get();
        return sessions
          .filter((session) => session.cueRatings.some((r) => r.cueId === cueId))
          .map((session) => ({
            date: session.date,
            rating: session.cueRatings.find((r) => r.cueId === cueId)?.rating || 0,
          }))
          .reverse(); // Oldest first for progress view
      },
    }),
    {
      name: 'tennis-cue-sessions',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
