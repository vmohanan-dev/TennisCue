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
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useSessionStore, useUserStore } from '@/store';
import { cues } from '@/data/cues';

export default function SessionsScreen() {
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
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <FontAwesome name="calendar-o" size={48} color={Colors.textSecondary} />
        </View>
        <Text style={styles.emptyTitle}>No Sessions Yet</Text>
        <Text style={styles.emptyDescription}>
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
    <View style={styles.container}>
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{sessions.length}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {sessions.reduce((acc, s) => acc + s.cueRatings.length, 0)}
          </Text>
          <Text style={styles.statLabel}>Cues Rated</Text>
        </View>
      </View>

      {/* Session List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>History</Text>
          <TouchableOpacity onPress={handleNewSession} style={styles.addButton}>
            <FontAwesome name="plus" size={16} color={Colors.primary} />
            <Text style={styles.addButtonText}>New</Text>
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
                <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                <Text style={styles.sessionTime}>{formatTime(session.date)}</Text>
              </View>
              <View style={styles.sessionStats}>
                <View style={styles.avgRating}>
                  <FontAwesome name="star" size={16} color={Colors.starFilled} />
                  <Text style={styles.avgRatingText}>
                    {getAverageRating(session.cueRatings)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sessionCues}>
              <Text style={styles.sessionCuesLabel}>
                {session.cueRatings.length} cue
                {session.cueRatings.length !== 1 ? 's' : ''} practiced
              </Text>
              <View style={styles.cuePreview}>
                {session.cueRatings.slice(0, 3).map((rating, index) => {
                  const cue = cues.find((c) => c.id === rating.cueId);
                  return (
                    <View key={rating.cueId} style={styles.cueChip}>
                      <Text style={styles.cueChipText} numberOfLines={1}>
                        {cue?.title || 'Unknown'}
                      </Text>
                    </View>
                  );
                })}
                {session.cueRatings.length > 3 && (
                  <Text style={styles.moreText}>
                    +{session.cueRatings.length - 3} more
                  </Text>
                )}
              </View>
            </View>

            {session.notes && (
              <Text style={styles.sessionNotes} numberOfLines={2}>
                {session.notes}
              </Text>
            )}

            <View style={styles.sessionFooter}>
              <Text style={styles.viewDetails}>View Details</Text>
              <FontAwesome name="chevron-right" size={14} color={Colors.primary} />
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
    backgroundColor: Colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 0,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
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
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
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
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
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
    color: Colors.text,
  },
  sessionTime: {
    fontSize: 14,
    color: Colors.textSecondary,
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
    color: Colors.text,
  },
  sessionCues: {
    marginBottom: 12,
  },
  sessionCuesLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  cuePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  cueChip: {
    backgroundColor: Colors.background,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    maxWidth: 120,
  },
  cueChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  moreText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  sessionNotes: {
    fontSize: 14,
    color: Colors.textSecondary,
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
    borderTopColor: Colors.divider,
  },
  viewDetails: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
  },
});