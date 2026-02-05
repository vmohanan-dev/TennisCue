export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type StrokeType =
  | 'forehand'
  | 'backhand'
  | 'serve'
  | 'return'
  | 'volley'
  | 'overhead'
  | 'general'
  | 'approach'
  | 'drop-shot'
  | 'lob'
  | 'slice';

export type SkillArea =
  | 'footwork'
  | 'preparation'
  | 'contact'
  | 'follow-through'
  | 'timing'
  | 'mental'
  | 'recovery'
  | 'tactics';

export interface Cue {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  strokeType: StrokeType;
  skillArea: SkillArea;
  level: SkillLevel;
}

export interface CueRating {
  cueId: string;
  rating: number; // 1-5
}

export interface Session {
  id: string;
  date: string;
  cueRatings: CueRating[];
  notes?: string;
}

export interface QuizAnswer {
  questionId: string;
  answerId: string;
  points: number;
}

export interface UserProfile {
  level: SkillLevel | null;
  activeCueIds: string[];
  quizAnswers: QuizAnswer[];
  hasCompletedOnboarding: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    points: number; // Points toward higher skill level
  }[];
}
