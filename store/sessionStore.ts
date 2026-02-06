import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, CueRating } from '@/types';
import { syncService } from '@/services/sync.service';

interface SessionState {
  sessions: Session[];
  // Actions
  addSession: (cueRatings: CueRating[], notes?: string) => void;
  deleteSession: (sessionId: string) => void;
  getSessionById: (sessionId: string) => Session | undefined;
  getRecentSessions: (limit?: number) => Session[];
  getCueProgress: (cueId: string) => { date: string; rating: number }[];
  // Sync actions
  syncToCloud: (userId: string) => Promise<void>;
  fetchFromCloud: (userId: string) => Promise<void>;
  mergeAndSync: (userId: string) => Promise<void>;
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

      // Sync actions
      syncToCloud: async (userId: string) => {
        const { sessions } = get();
        await syncService.syncSessions(userId, sessions);
      },

      fetchFromCloud: async (userId: string) => {
        const cloudSessions = await syncService.fetchSessions(userId);
        if (cloudSessions.length > 0) {
          set({ sessions: cloudSessions });
        }
      },

      mergeAndSync: async (userId: string) => {
        const { sessions: localSessions } = get();

        // Fetch cloud sessions
        const cloudSessions = await syncService.fetchSessions(userId);

        // Merge sessions
        const mergedSessions = syncService.mergeSessions(localSessions, cloudSessions);

        // Update local state
        set({ sessions: mergedSessions });

        // Sync merged sessions to cloud
        await syncService.syncSessions(userId, mergedSessions);
      },
    }),
    {
      name: 'tennis-cue-sessions',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
