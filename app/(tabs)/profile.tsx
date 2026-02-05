import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/Card';
import { LevelBadge } from '@/components/LevelBadge';
import { useUserStore, useSessionStore } from '@/store';
import { cues, levelLabels } from '@/data/cues';

export default function ProfileScreen() {
  const { level, activeCueIds, resetOnboarding } = useUserStore();
  const { sessions } = useSessionStore();

  const totalCuesRated = sessions.reduce(
    (acc, s) => acc + s.cueRatings.length,
    0
  );

  const handleRetakeQuiz = () => {
    Alert.alert(
      'Retake Assessment',
      'This will reset your skill level. Your active cues and session history will be preserved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Retake',
          onPress: () => {
            resetOnboarding();
            router.replace('/onboarding/welcome');
          },
        },
      ]
    );
  };

  const getLevelDescription = () => {
    switch (level) {
      case 'beginner':
        return 'Focus on fundamentals and building a solid foundation.';
      case 'intermediate':
        return 'Refine your technique and add consistency to your game.';
      case 'advanced':
        return 'Fine-tune your skills and work on advanced tactics.';
      default:
        return 'Complete the assessment to see your level.';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Level Card */}
      <Card variant="elevated" style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <View
            style={[
              styles.levelIcon,
              { backgroundColor: level ? Colors[level] : Colors.textSecondary },
            ]}
          >
            <FontAwesome name="trophy" size={28} color={Colors.textLight} />
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>Your Level</Text>
            {level ? (
              <LevelBadge level={level} size="medium" />
            ) : (
              <Text style={styles.noLevel}>Not assessed</Text>
            )}
          </View>
        </View>
        <Text style={styles.levelDescription}>{getLevelDescription()}</Text>
        <TouchableOpacity style={styles.retakeButton} onPress={handleRetakeQuiz}>
          <FontAwesome name="refresh" size={14} color={Colors.primary} />
          <Text style={styles.retakeButtonText}>Retake Assessment</Text>
        </TouchableOpacity>
      </Card>

      {/* Stats Grid */}
      <Text style={styles.sectionTitle}>Your Stats</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <FontAwesome name="list" size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>{activeCueIds.length}</Text>
          <Text style={styles.statLabel}>Active Cues</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome name="calendar-check-o" size={24} color={Colors.secondary} />
          <Text style={styles.statNumber}>{sessions.length}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome name="star" size={24} color={Colors.accent} />
          <Text style={styles.statNumber}>{totalCuesRated}</Text>
          <Text style={styles.statLabel}>Cues Rated</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome name="book" size={24} color={Colors.beginner} />
          <Text style={styles.statNumber}>{cues.length}</Text>
          <Text style={styles.statLabel}>Total Cues</Text>
        </View>
      </View>

      {/* About */}
      <Text style={styles.sectionTitle}>About TennisCue</Text>
      <Card variant="outlined" style={styles.aboutCard}>
        <View style={styles.aboutItem}>
          <FontAwesome name="info-circle" size={20} color={Colors.textSecondary} />
          <View style={styles.aboutText}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
        </View>
        <View style={styles.aboutDivider} />
        <View style={styles.aboutItem}>
          <FontAwesome name="heart" size={20} color={Colors.error} />
          <View style={styles.aboutText}>
            <Text style={styles.aboutLabel}>Made with</Text>
            <Text style={styles.aboutValue}>React Native & Expo</Text>
          </View>
        </View>
      </Card>

      {/* Tips */}
      <Card variant="elevated" style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <FontAwesome name="lightbulb-o" size={20} color={Colors.accent} />
          <Text style={styles.tipTitle}>Quick Tip</Text>
        </View>
        <Text style={styles.tipText}>
          Focus on 3-5 cues at a time during practice. Too many cues can be
          overwhelming and reduce your ability to make meaningful improvements.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  levelCard: {
    marginBottom: 24,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  noLevel: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  levelDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  retakeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  aboutCard: {
    marginBottom: 24,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  aboutText: {
    marginLeft: 14,
  },
  aboutLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  aboutValue: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  aboutDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 12,
  },
  tipCard: {
    backgroundColor: Colors.accentLight + '20',
    borderWidth: 1,
    borderColor: Colors.accentLight,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accent,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
});