import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SkillLevel, QuizAnswer, UserProfile } from '@/types';

interface UserState extends UserProfile {
  // Actions
  setLevel: (level: SkillLevel) => void;
  setQuizAnswers: (answers: QuizAnswer[]) => void;
  completeOnboarding: () => void;
  toggleActiveCue: (cueId: string) => void;
  addActiveCue: (cueId: string) => void;
  removeActiveCue: (cueId: string) => void;
  resetOnboarding: () => void;
}

const initialState: UserProfile = {
  level: null,
  activeCueIds: [],
  quizAnswers: [],
  hasCompletedOnboarding: false,
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

      resetOnboarding: () => set(initialState),
    }),
    {
      name: 'tennis-cue-user',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
