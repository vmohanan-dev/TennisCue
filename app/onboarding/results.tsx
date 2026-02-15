import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/Button';
import { LevelBadge } from '@/components/LevelBadge';
import { CueCard } from '@/components/CueCard';
import { SkillLevel } from '@/types';
import { levelPersonas } from '@/data/quiz';
import { getStarterCues } from '@/data/cues';
import { useUserStore } from '@/store';

const levelIcons: Record<SkillLevel, string> = {
  beginner: 'star-o',
  intermediate: 'star-half-o',
  advanced: 'star',
};

export default function OnboardingResults() {
  const { level } = useLocalSearchParams<{ level: SkillLevel }>();
  const skillLevel = (level as SkillLevel) || 'beginner';
  const { colors } = useTheme();
  const { completeOnboarding, addActiveCue } = useUserStore();
  const persona = levelPersonas[skillLevel];
  const starterCues = getStarterCues(skillLevel);

  const handleContinue = () => {
    starterCues.forEach((cue) => addActiveCue(cue.id));
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebratory Header */}
        <View style={styles.headerSection}>
          <View style={[styles.iconContainer, { backgroundColor: colors[skillLevel] }]}>
            <FontAwesome
              name={levelIcons[skillLevel] as any}
              size={60}
              color={colors.textOnPrimary}
            />
          </View>
          <Text style={[styles.headline, { color: colors.text }]}>
            {persona.headline}
          </Text>
          <LevelBadge level={skillLevel} size="medium" />
        </View>

        {/* Welcome Message */}
        <Text style={[styles.welcomeMessage, { color: colors.textSecondary }]}>
          {persona.welcomeMessage}
        </Text>

        {/* What's Next */}
        <View style={styles.whatsNextSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What's Next For You
          </Text>
          {persona.whatsNext.map((item, index) => (
            <View key={index} style={styles.whatsNextItem}>
              <View style={[styles.whatsNextIcon, { backgroundColor: colors[skillLevel] + '20' }]}>
                <FontAwesome
                  name={item.icon as any}
                  size={20}
                  color={colors[skillLevel]}
                />
              </View>
              <Text style={[styles.whatsNextText, { color: colors.text }]}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Your First Cues */}
        <View style={styles.cuesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your First Cues
          </Text>
          {starterCues.map((cue) => (
            <CueCard key={cue.id} cue={cue} compact />
          ))}
        </View>
      </ScrollView>

      {/* CTA Footer */}
      <View style={[styles.footer, { borderTopColor: colors.divider }]}>
        <Button
          title={persona.ctaLabel}
          onPress={handleContinue}
          size="large"
          style={styles.button}
        />
        <Text style={[styles.footerNote, { color: colors.textSecondary }]}>
          You can retake the quiz anytime in Settings
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  whatsNextSection: {
    width: '100%',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  whatsNextItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  whatsNextIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  whatsNextText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  cuesSection: {
    width: '100%',
    marginBottom: 16,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: {
    width: '100%',
  },
  footerNote: {
    fontSize: 14,
    marginTop: 16,
  },
});
