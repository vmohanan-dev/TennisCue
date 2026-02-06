import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeProvider';
import { Card } from '@/components/Card';
import { LevelBadge } from '@/components/LevelBadge';
import { useUserStore, useSessionStore, useAuthStore } from '@/store';
import { cues } from '@/data/cues';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { level, activeCueIds, resetOnboarding, syncToCloud, syncStatus, lastSyncedAt } =
    useUserStore();
  const { sessions, syncToCloud: syncSessions } = useSessionStore();
  const { user, signOut, isLoading: authLoading } = useAuthStore();
  const [isSyncing, setIsSyncing] = useState(false);

  const totalCuesRated = sessions.reduce(
    (acc, s) => acc + s.cueRatings.length,
    0
  );

  const handleSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await Promise.all([syncToCloud(user.id), syncSessions(user.id)]);
      Alert.alert('Sync Complete', 'Your data has been synced to the cloud.');
    } catch (error) {
      Alert.alert('Sync Failed', 'Please try again later.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const formatLastSynced = () => {
    if (!lastSyncedAt) return 'Never';
    const date = new Date(lastSyncedAt);
    return date.toLocaleString();
  };

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
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Account Card */}
      <Card variant="elevated" style={styles.accountCard}>
        <View style={styles.accountHeader}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primary }]}>
            <FontAwesome name="user" size={24} color={colors.textOnPrimary} />
          </View>
          <View style={styles.accountInfo}>
            <Text style={[styles.accountEmail, { color: colors.text }]} numberOfLines={1}>
              {user?.email || 'Not signed in'}
            </Text>
            <View style={styles.syncStatus}>
              {isSyncing || syncStatus === 'syncing' ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <FontAwesome
                  name={syncStatus === 'error' ? 'exclamation-circle' : 'check-circle'}
                  size={14}
                  color={syncStatus === 'error' ? colors.error : colors.success}
                />
              )}
              <Text style={[styles.syncText, { color: colors.textSecondary }]}>
                {isSyncing || syncStatus === 'syncing'
                  ? 'Syncing...'
                  : `Last synced: ${formatLastSynced()}`}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.accountActions}>
          <TouchableOpacity
            style={[styles.syncButton, { backgroundColor: colors.secondary + '20' }]}
            onPress={handleSync}
            disabled={isSyncing || syncStatus === 'syncing'}
          >
            <FontAwesome name="refresh" size={14} color={colors.secondary} />
            <Text style={[styles.syncButtonText, { color: colors.secondary }]}>Sync Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.signOutButton, { backgroundColor: colors.error + '15' }]}
            onPress={handleSignOut}
            disabled={authLoading}
          >
            <FontAwesome name="sign-out" size={14} color={colors.error} />
            <Text style={[styles.signOutButtonText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Level Card */}
      <Card variant="elevated" style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <View
            style={[
              styles.levelIcon,
              { backgroundColor: level ? colors[level] : colors.textSecondary },
            ]}
          >
            <FontAwesome name="trophy" size={28} color={colors.textOnPrimary} />
          </View>
          <View style={styles.levelInfo}>
            <Text style={[styles.levelLabel, { color: colors.textSecondary }]}>Your Level</Text>
            {level ? (
              <LevelBadge level={level} size="medium" />
            ) : (
              <Text style={[styles.noLevel, { color: colors.textSecondary }]}>Not assessed</Text>
            )}
          </View>
        </View>
        <Text style={[styles.levelDescription, { color: colors.textSecondary }]}>{getLevelDescription()}</Text>
        <TouchableOpacity style={[styles.retakeButton, { backgroundColor: colors.background }]} onPress={handleRetakeQuiz}>
          <FontAwesome name="refresh" size={14} color={colors.primary} />
          <Text style={[styles.retakeButtonText, { color: colors.primary }]}>Retake Assessment</Text>
        </TouchableOpacity>
      </Card>

      {/* Stats Grid */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Stats</Text>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <FontAwesome name="list" size={24} color={colors.primary} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{activeCueIds.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Cues</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <FontAwesome name="calendar-check-o" size={24} color={colors.secondary} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{sessions.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sessions</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <FontAwesome name="star" size={24} color={colors.accent} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{totalCuesRated}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cues Rated</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <FontAwesome name="book" size={24} color={colors.beginner} />
          <Text style={[styles.statNumber, { color: colors.text }]}>{cues.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Cues</Text>
        </View>
      </View>

      {/* About */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>About TennisCue</Text>
      <Card variant="outlined" style={styles.aboutCard}>
        <View style={styles.aboutItem}>
          <FontAwesome name="info-circle" size={20} color={colors.textSecondary} />
          <View style={styles.aboutText}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Version</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>1.0.0</Text>
          </View>
        </View>
        <View style={[styles.aboutDivider, { backgroundColor: colors.divider }]} />
        <View style={styles.aboutItem}>
          <FontAwesome name="heart" size={20} color={colors.error} />
          <View style={styles.aboutText}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Made with</Text>
            <Text style={[styles.aboutValue, { color: colors.text }]}>React Native & Expo</Text>
          </View>
        </View>
      </Card>

      {/* Tips */}
      <Card variant="elevated" style={[styles.tipCard, { backgroundColor: colors.accent + '20', borderColor: colors.accentLight }]}>
        <View style={styles.tipHeader}>
          <FontAwesome name="lightbulb-o" size={20} color={colors.accent} />
          <Text style={[styles.tipTitle, { color: colors.accent }]}>Quick Tip</Text>
        </View>
        <Text style={[styles.tipText, { color: colors.text }]}>
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
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  accountCard: {
    marginBottom: 24,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  accountInfo: {
    flex: 1,
  },
  accountEmail: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncText: {
    fontSize: 13,
  },
  accountActions: {
    flexDirection: 'row',
    gap: 12,
  },
  syncButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  syncButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signOutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  signOutButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 4,
  },
  noLevel: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  levelDescription: {
    fontSize: 15,
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
  },
  retakeButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
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
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
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
  },
  aboutValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  aboutDivider: {
    height: 1,
    marginVertical: 12,
  },
  tipCard: {
    borderWidth: 1,
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
  },
  tipText: {
    fontSize: 14,
    lineHeight: 22,
  },
});