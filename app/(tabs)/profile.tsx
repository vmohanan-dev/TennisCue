import { Card } from '@/components/Card';
import { LevelBadge } from '@/components/LevelBadge';
import { useTheme } from '@/components/ThemeProvider';
import { cues } from '@/data/cues';
import { useAuthStore, useSessionStore, useUserStore } from '@/store';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'We are sorry to see you go. This will permanently delete all your data.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm Delete',
                  style: 'destructive',
                  onPress: async () => {
                    const result = await useAuthStore.getState().deleteAccount();
                    if (result.success) {
                      Alert.alert('Account Deleted', 'Your account and all data have been permanently deleted.');
                    } else {
                      Alert.alert('Error', result.error || 'Failed to delete account');
                    }
                  }
                }
              ]
            );
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

  const handleFeedback = () => {
    Linking.openURL('mailto:info@laceup.club?subject=TennisCue%20Feedback');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Your Level Card */}
      <Card variant="elevated" style={styles.identityCard}>
        <View
          style={[
            styles.accentStrip,
            { backgroundColor: level ? colors[level] : colors.textSecondary },
          ]}
        />
        <View style={styles.identityContent}>
          <View style={styles.levelRow}>
            <View
              style={[
                styles.trophyCircle,
                { backgroundColor: level ? colors[level] : colors.textSecondary },
              ]}
            >
              <FontAwesome name="trophy" size={28} color={colors.textOnPrimary} />
            </View>
            <View style={styles.levelInfo}>
              <Text style={[styles.levelLabel, { color: colors.textSecondary }]}>
                Your Level
              </Text>
              {level ? (
                <LevelBadge level={level} size="medium" />
              ) : (
                <Text style={[styles.noLevel, { color: colors.textSecondary }]}>
                  Not assessed
                </Text>
              )}
            </View>
          </View>

          <Text style={[styles.levelDescription, { color: colors.textSecondary }]}>
            {getLevelDescription()}
          </Text>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.background }]}
            onPress={handleRetakeQuiz}
          >
            <FontAwesome name="refresh" size={13} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Retake Assessment
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Account Card */}
      <Card variant="elevated" style={styles.accountCard}>
        <View style={styles.accountRow}>
          <View style={[styles.avatarSmall, { backgroundColor: colors.primary }]}>
            <FontAwesome name="user" size={16} color={colors.textOnPrimary} />
          </View>
          <View style={styles.accountDetails}>
            <Text style={[styles.accountEmail, { color: colors.text }]} numberOfLines={1}>
              {user?.email || 'Not signed in'}
            </Text>
            <View style={styles.syncStatus}>
              {isSyncing || syncStatus === 'syncing' ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <FontAwesome
                  name={syncStatus === 'error' ? 'exclamation-circle' : 'check-circle'}
                  size={12}
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

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary + '20' }]}
            onPress={handleSync}
            disabled={isSyncing || syncStatus === 'syncing'}
          >
            <FontAwesome name="cloud-upload" size={13} color={colors.secondary} />
            <Text style={[styles.actionButtonText, { color: colors.secondary }]}>Sync</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error + '12' }]}
            onPress={handleSignOut}
            disabled={authLoading}
          >
            <FontAwesome name="sign-out" size={13} color={colors.error} />
            <Text style={[styles.actionButtonText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
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
        <TouchableOpacity style={styles.aboutItem} onPress={handleFeedback}>
          <FontAwesome name="envelope" size={20} color={colors.primary} />
          <View style={styles.aboutText}>
            <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Feedback</Text>
            <Text style={[styles.aboutValue, { color: colors.primary }]}>Send us your thoughts</Text>
          </View>
          <FontAwesome
            name="chevron-right"
            size={14}
            color={colors.textSecondary}
            style={{ marginLeft: 'auto' }}
          />
        </TouchableOpacity>
      </Card>

      {/* Danger Zone */}
      <Text style={[styles.sectionTitle, { color: colors.error, marginTop: 24 }]}>Danger Zone</Text>
      <Card variant="outlined" style={[styles.dangerZoneCard, { borderColor: colors.error }]}>
        <View style={styles.dangerZoneContent}>
          <View style={styles.dangerZoneHeader}>
            <FontAwesome name="exclamation-triangle" size={20} color={colors.error} />
            <Text style={[styles.dangerZoneTitle, { color: colors.error }]}>Delete Account</Text>
          </View>
          <Text style={[styles.dangerZoneText, { color: colors.textSecondary }]}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </Text>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.error, opacity: authLoading ? 0.6 : 1 }]}
            onPress={handleDeleteAccount}
            disabled={authLoading}
          >
            {authLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            )}
          </TouchableOpacity>
        </View>
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

  // Player Identity Card
  identityCard: {
    marginBottom: 24,
    overflow: 'hidden',
    padding: 0,
  },
  accentStrip: {
    height: 4,
    width: '100%',
  },
  identityContent: {
    padding: 16,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trophyCircle: {
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
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  noLevel: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  levelDescription: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    marginBottom: 14,
  },

  // Account Card
  accountCard: {
    marginBottom: 24,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  accountEmail: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  syncText: {
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Stats
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

  // About
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

  // Danger Zone
  dangerZoneCard: {
    marginBottom: 24,
    borderWidth: 1,
  },
  dangerZoneContent: {
    padding: 4,
  },
  dangerZoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  dangerZoneText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
