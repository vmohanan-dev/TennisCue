import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SkillLevel, QuizAnswer, UserProfile, SyncStatus } from '@/types';
import { syncService, UserProfileData } from '@/services/sync.service';

interface UserState extends UserProfile {
  // Sync state
  lastSyncedAt: string | null;
  syncStatus: SyncStatus;

  // Actions
  setLevel: (level: SkillLevel) => void;
  setQuizAnswers: (answers: QuizAnswer[]) => void;
  completeOnboarding: () => void;
  toggleActiveCue: (cueId: string) => void;
  addActiveCue: (cueId: string) => void;
  removeActiveCue: (cueId: string) => void;
  resetOnboarding: () => void;

  // Sync actions
  syncToCloud: (userId: string) => Promise<void>;
  fetchFromCloud: (userId: string) => Promise<void>;
  mergeAndSync: (userId: string) => Promise<void>;
  setSyncStatus: (status: SyncStatus) => void;
}

const initialState = {
  level: null as SkillLevel | null,
  activeCueIds: [] as string[],
  quizAnswers: [] as QuizAnswer[],
  hasCompletedOnboarding: false,
  lastSyncedAt: null as string | null,
  syncStatus: 'idle' as SyncStatus,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setLevel: (level) => set({ level }),

      setQuizAnswers: (answers) => set({ quizAnswers: answers }),

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      toggleActiveCue: (cueId) => {
        const { activeCueIds } = get();
        if (activeCueIds.includes(cueId)) {
          set({ activeCueIds: activeCueIds.filter((id) => id !== cueId) });
        } else {
          set({ activeCueIds: [...activeCueIds, cueId] });
        }
      },

      addActiveCue: (cueId) => {
        const { activeCueIds } = get();
        if (!activeCueIds.includes(cueId)) {
          set({ activeCueIds: [...activeCueIds, cueId] });
        }
      },

      removeActiveCue: (cueId) => {
        const { activeCueIds } = get();
        set({ activeCueIds: activeCueIds.filter((id) => id !== cueId) });
      },

      resetOnboarding: () =>
        set({
          level: null,
          activeCueIds: [],
          quizAnswers: [],
          hasCompletedOnboarding: false,
        }),

      // Sync actions
      syncToCloud: async (userId: string) => {
        const state = get();
        set({ syncStatus: 'syncing' });

        const data: UserProfileData = {
          level: state.level,
          hasCompletedOnboarding: state.hasCompletedOnboarding,
          activeCueIds: state.activeCueIds,
          quizAnswers: state.quizAnswers,
        };

        const result = await syncService.syncUserProfile(userId, data);

        if (result.success) {
          set({
            syncStatus: 'idle',
            lastSyncedAt: new Date().toISOString(),
          });
        } else {
          set({ syncStatus: 'error' });
        }
      },

      fetchFromCloud: async (userId: string) => {
        set({ syncStatus: 'syncing' });

        const cloudData = await syncService.fetchUserProfile(userId);

        if (cloudData) {
          set({
            level: cloudData.level,
            hasCompletedOnboarding: cloudData.hasCompletedOnboarding,
            activeCueIds: cloudData.activeCueIds,
            quizAnswers: cloudData.quizAnswers,
            syncStatus: 'idle',
            lastSyncedAt: new Date().toISOString(),
          });
        } else {
          set({ syncStatus: 'idle' });
        }
      },

      mergeAndSync: async (userId: string) => {
        const state = get();
        set({ syncStatus: 'syncing' });

        // Fetch cloud data
        const cloudData = await syncService.fetchUserProfile(userId);

        // Local data
        const localData: UserProfileData = {
          level: state.level,
          hasCompletedOnboarding: state.hasCompletedOnboarding,
          activeCueIds: state.activeCueIds,
          quizAnswers: state.quizAnswers,
        };

        // Merge (local takes precedence if has data)
        const mergedData = syncService.mergeUserData(localData, cloudData);

        // Update local state with merged data
        set({
          level: mergedData.level,
          hasCompletedOnboarding: mergedData.hasCompletedOnboarding,
          activeCueIds: mergedData.activeCueIds,
          quizAnswers: mergedData.quizAnswers,
        });

        // Sync merged data to cloud
        const result = await syncService.syncUserProfile(userId, mergedData);

        if (result.success) {
          set({
            syncStatus: 'idle',
            lastSyncedAt: new Date().toISOString(),
          });
        } else {
          set({ syncStatus: 'error' });
        }
      },

      setSyncStatus: (status: SyncStatus) => set({ syncStatus: status }),
    }),
    {
      name: 'tennis-cue-user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
