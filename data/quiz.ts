import { QuizQuestion } from '@/types';

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
