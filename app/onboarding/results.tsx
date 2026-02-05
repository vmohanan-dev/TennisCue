import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { SkillLevel } from '@/types';
import { levelLabels } from '@/data/cues';

const levelDescriptions: Record<SkillLevel, string> = {
  beginner:
    "You're just starting your tennis journey! We'll focus on fundamental techniques like grip, stance, and basic stroke mechanics.",
  intermediate:
    "You've got the basics down. Now it's time to refine your technique, add more consistency, and start thinking tactically.",
  advanced:
    "You're a skilled player ready to fine-tune your game. We'll work on shot variety, court positioning, and mental toughness.",
};

const levelIcons: Record<SkillLevel, string> = {
  beginner: 'star-o',
  intermediate: 'star-half-o',
  advanced: 'star',
};

export default function OnboardingResults() {
  const { level } = useLocalSearchParams<{ level: SkillLevel }>();
  const skillLevel = (level as SkillLevel) || 'beginner';

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: Colors[skillLevel] }]}>
          <FontAwesome
            name={levelIcons[skillLevel] as any}
            size={60}
            color={Colors.textLight}
          />
        </View>

        {/* Level */}
        <Text style={styles.levelLabel}>Your Level</Text>
        <Text style={[styles.levelText, { color: Colors[skillLevel] }]}>
          {levelLabels[skillLevel]}
        </Text>

        {/* Description */}
        <Text style={styles.description}>{levelDescriptions[skillLevel]}</Text>

        {/* Stats preview */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="book" size={24} color={Colors.primary} />
            <Text style={styles.statValue}>
              {skillLevel === 'beginner' ? '12' : skillLevel === 'intermediate' ? '20' : '25'}
            </Text>
            <Text style={styles.statLabel}>Cues Available</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <FontAwesome name="trophy" size={24} color={Colors.accent} />
            <Text style={styles.statValue}>Track</Text>
            <Text style={styles.statLabel}>Your Progress</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Browse Cues"
          onPress={handleContinue}
          size="large"
          style={styles.button}
        />
        <Text style={styles.footerNote}>
          You can retake the quiz anytime in Settings
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  levelLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  button: {
    width: '100%',
  },
  footerNote: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 16,
  },
});