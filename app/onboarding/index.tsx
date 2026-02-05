import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { quizQuestions, calculateLevel } from '@/data/quiz';
import { useUserStore } from '@/store';
import { QuizAnswer } from '@/types';

export default function OnboardingQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { setLevel, setQuizAnswers, completeOnboarding } = useUserStore();

  const question = quizQuestions[currentQuestion];
  const progress = (currentQuestion + 1) / quizQuestions.length;
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleSelectOption = (optionId: string, points: number) => {
    setSelectedOption(optionId);
    const newAnswer: QuizAnswer = {
      questionId: question.id,
      answerId: optionId,
      points,
    };

    // Update or add answer
    const existingIndex = answers.findIndex((a) => a.questionId === question.id);
    if (existingIndex >= 0) {
      const newAnswers = [...answers];
      newAnswers[existingIndex] = newAnswer;
      setAnswers(newAnswers);
    } else {
      setAnswers([...answers, newAnswer]);
    }
  };

  const handleNext = () => {
    if (!selectedOption) return;

    if (isLastQuestion) {
      // Calculate and save results
      const totalPoints = answers.reduce((sum, a) => sum + a.points, 0);
      // Add current question's points
      const currentAnswer = answers.find((a) => a.questionId === question.id);
      const finalTotal = currentAnswer
        ? totalPoints
        : totalPoints + (question.options.find((o) => o.id === selectedOption)?.points || 0);

      const level = calculateLevel(finalTotal);
      setLevel(level);
      setQuizAnswers(answers);
      completeOnboarding();

      // Navigate to results
      router.replace({
        pathname: '/onboarding/results',
        params: { level },
      });
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers.find(
        (a) => a.questionId === quizQuestions[currentQuestion - 1].id
      );
      setSelectedOption(prevAnswer?.answerId || null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {currentQuestion > 0 ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color={Colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <Text style={styles.headerTitle}>Find Your Level</Text>
        <View style={styles.backButton} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentQuestion + 1} of {quizQuestions.length}
        </Text>
      </View>

      {/* Question */}
      <View style={styles.content}>
        <Text style={styles.question}>{question.question}</Text>

        <View style={styles.options}>
          {question.options.map((option) => (
            <Card
              key={option.id}
              variant={selectedOption === option.id ? 'elevated' : 'outlined'}
              onPress={() => handleSelectOption(option.id, option.points)}
              style={[
                styles.optionCard,
                selectedOption === option.id && styles.optionCardSelected,
              ]}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.radio,
                    selectedOption === option.id && styles.radioSelected,
                  ]}
                >
                  {selectedOption === option.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === option.id && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title={isLastQuestion ? 'See My Level' : 'Continue'}
          onPress={handleNext}
          disabled={!selectedOption}
          size="large"
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 32,
  },
  options: {
    gap: 12,
  },
  optionCard: {
    marginBottom: 0,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: Colors.primary,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  continueButton: {
    width: '100%',
  },
});