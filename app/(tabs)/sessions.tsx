import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeProvider';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useSessionStore, useUserStore } from '@/store';
import { cues } from '@/data/cues';

export default function SessionsScreen() {
  const { colors } = useTheme();
  const { sessions } = useSessionStore();
  const { activeCueIds } = useUserStore();

  const handleNewSession = () => {
    router.push('/session/new');
  };

  const handleViewSession = (sessionId: string) => {
    router.push(`/session/${sessionId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getAverageRating = (ratings: { cueId: string; rating: number }[]) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  if (sessions.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.emptyIcon, { backgroundColor: colors.surface }]}>
          <FontAwesome name="calendar-o" size={48} color={colors.textSecondary} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Sessions Yet</Text>
        <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
          {activeCueIds.length === 0
            ? 'Add some cues to your focus list first, then log your practice sessions.'
            : 'Log your first practice session to start tracking your progress.'}
        </Text>
        {activeCueIds.length > 0 && (
          <Button
            title="Start Session"
            onPress={handleNewSession}
            style={styles.emptyButton}
          />
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{sessions.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sessions</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {sessions.reduce((acc, s) => acc + s.cueRatings.length, 0)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cues Rated</Text>
        </View>
      </View>

      {/* Session List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>History</Text>
          <TouchableOpacity onPress={handleNewSession} style={styles.addButton}>
            <FontAwesome name="plus" size={16} color={colors.primary} />
            <Text style={[styles.addButtonText, { color: colors.primary }]}>New</Text>
          </TouchableOpacity>
        </View>

        {sessions.map((session) => (
          <Card
            key={session.id}
            variant="elevated"
            onPress={() => handleViewSession(session.id)}
            style={styles.sessionCard}
          >
            <View style={styles.sessionHeader}>
              <View>
                <Text style={[styles.sessionDate, { color: colors.text }]}>{formatDate(session.date)}</Text>
                <Text style={[styles.sessionTime, { color: colors.textSecondary }]}>{formatTime(session.date)}</Text>
              </View>
              <View style={styles.sessionStats}>
                <View style={styles.avgRating}>
                  <FontAwesome name="star" size={16} color={colors.starFilled} />
                  <Text style={[styles.avgRatingText, { color: colors.text }]}>
                    {getAverageRating(session.cueRatings)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sessionCues}>
              <Text style={[styles.sessionCuesLabel, { color: colors.textSecondary }]}>
                {session.cueRatings.length} cue
                {session.cueRatings.length !== 1 ? 's' : ''} practiced
              </Text>
              <View style={styles.cuePreview}>
                {session.cueRatings.slice(0, 3).map((rating, index) => {
                  const cue = cues.find((c) => c.id === rating.cueId);
                  return (
                    <View key={rating.cueId} style={[styles.cueChip, { backgroundColor: colors.background }]}>
                      <Text style={[styles.cueChipText, { color: colors.textSecondary }]} numberOfLines={1}>
                        {cue?.title || 'Unknown'}
                      </Text>
                    </View>
                  );
                })}
                {session.cueRatings.length > 3 && (
                  <Text style={[styles.moreText, { color: colors.textSecondary }]}>
                    +{session.cueRatings.length - 3} more
                  </Text>
                )}
              </View>
            </View>

            {session.notes && (
              <Text style={[styles.sessionNotes, { color: colors.textSecondary }]} numberOfLines={2}>
                {session.notes}
              </Text>
            )}

            <View style={[styles.sessionFooter, { borderTopColor: colors.divider }]}>
              <Text style={[styles.viewDetails, { color: colors.primary }]}>View Details</Text>
              <FontAwesome name="chevron-right" size={14} color={colors.primary} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 0,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  sessionCard: {
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sessionDate: {
    fontSize: 17,
    fontWeight: '600',
  },
  sessionTime: {
    fontSize: 14,
    marginTop: 2,
  },
  sessionStats: {
    alignItems: 'flex-end',
  },
  avgRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  avgRatingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sessionCues: {
    marginBottom: 12,
  },
  sessionCuesLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  cuePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  cueChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    maxWidth: 120,
  },
  cueChipText: {
    fontSize: 12,
  },
  moreText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  sessionNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  sessionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  viewDetails: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
});