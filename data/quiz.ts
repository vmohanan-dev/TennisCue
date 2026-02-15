import { QuizQuestion, SkillLevel } from '@/types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'experience',
    question: 'How long have you been playing tennis?',
    options: [
      { id: 'exp-1', label: 'Just starting out', points: 0 },
      { id: 'exp-2', label: 'Less than 1 year', points: 1 },
      { id: 'exp-3', label: '1-3 years', points: 2 },
      { id: 'exp-4', label: 'More than 3 years', points: 3 },
    ],
  },
  {
    id: 'lessons',
    question: 'Have you taken lessons from a coach?',
    options: [
      { id: 'les-1', label: 'Never', points: 0 },
      { id: 'les-2', label: 'A few lessons', points: 1 },
      { id: 'les-3', label: 'Regular lessons in the past', points: 2 },
      { id: 'les-4', label: 'Currently taking lessons', points: 3 },
    ],
  },
  {
    id: 'strokes',
    question: 'Which strokes do you feel comfortable with?',
    options: [
      { id: 'str-1', label: 'Forehand only', points: 0 },
      { id: 'str-2', label: 'Forehand and backhand', points: 1 },
      { id: 'str-3', label: 'Groundstrokes and serve', points: 2 },
      { id: 'str-4', label: 'All strokes including volleys', points: 3 },
    ],
  },
  {
    id: 'rallying',
    question: 'How many balls can you typically rally in a row?',
    options: [
      { id: 'ral-1', label: 'Less than 5', points: 0 },
      { id: 'ral-2', label: '5-10 balls', points: 1 },
      { id: 'ral-3', label: '10-20 balls', points: 2 },
      { id: 'ral-4', label: '20+ balls consistently', points: 3 },
    ],
  },
  {
    id: 'matches',
    question: 'How often do you play matches?',
    options: [
      { id: 'mat-1', label: 'Never played a match', points: 0 },
      { id: 'mat-2', label: 'Occasionally with friends', points: 1 },
      { id: 'mat-3', label: 'Regularly (weekly)', points: 2 },
      { id: 'mat-4', label: 'Competitive matches/leagues', points: 3 },
    ],
  },
  {
    id: 'serve',
    question: 'How would you describe your serve?',
    options: [
      { id: 'srv-1', label: 'Just trying to get it in', points: 0 },
      { id: 'srv-2', label: 'Consistent but not powerful', points: 1 },
      { id: 'srv-3', label: 'Can place it accurately', points: 2 },
      { id: 'srv-4', label: 'Have different serve types', points: 3 },
    ],
  },
];

// Calculate skill level based on total points
// Max possible points: 18 (6 questions × 3 max points)
export function calculateLevel(totalPoints: number): 'beginner' | 'intermediate' | 'advanced' {
  if (totalPoints <= 6) {
    return 'beginner';
  } else if (totalPoints <= 12) {
    return 'intermediate';
  } else {
    return 'advanced';
  }
}

export interface LevelPersona {
  personaName: string;
  headline: string;
  welcomeMessage: string;
  ctaLabel: string;
  whatsNext: {
    icon: string;
    text: string;
  }[];
}

export const levelPersonas: Record<SkillLevel, LevelPersona> = {
  beginner: {
    personaName: 'Rising Rally',
    headline: "You're a Rising Rally!",
    welcomeMessage:
      "Welcome to your tennis journey! Every great player started exactly where you are. TennisCue will guide you through the fundamentals with clear, focused cues that build your confidence on the court.",
    ctaLabel: 'Start Your Journey',
    whatsNext: [
      { icon: 'hand-paper-o', text: 'Master the fundamentals' },
      { icon: 'exchange', text: 'Build your rally game' },
      { icon: 'repeat', text: 'Develop consistent strokes' },
    ],
  },
  intermediate: {
    personaName: 'Court Strategist',
    headline: "You're a Court Strategist!",
    welcomeMessage:
      "You've built a solid foundation \u2014 now it's time to take your game to the next level. TennisCue will help you refine your technique, add variety to your shots, and start thinking more tactically.",
    ctaLabel: 'Level Up',
    whatsNext: [
      { icon: 'bullseye', text: 'Sharpen your technique' },
      { icon: 'random', text: 'Add tactical variety' },
      { icon: 'wrench', text: 'Strengthen your weak spots' },
    ],
  },
  advanced: {
    personaName: 'Match Maestro',
    headline: "You're a Match Maestro!",
    welcomeMessage:
      "Impressive skill set! You know the game well, and TennisCue is here to help you fine-tune the details that separate good players from great ones. Precision, strategy, and mental toughness await.",
    ctaLabel: 'Sharpen Your Game',
    whatsNext: [
      { icon: 'crosshairs', text: 'Fine-tune shot selection' },
      { icon: 'lightbulb-o', text: 'Mental game mastery' },
      { icon: 'trophy', text: 'Competition-ready drills' },
    ],
  },
};
