import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/Button';
import { CueCard } from '@/components/CueCard';
import { useUserStore, useSessionStore } from '@/store';
import { cues } from '@/data/cues';
import { Session } from '@/types';

function getSessionPrompt(sessions: Session[]): string {
  if (sessions.length === 0) return 'Ready for your first session?';
  const lastDate = new Date(sessions[0].date);
  const now = new Date();
  const diffMs = now.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Great work today! Go again?';
  if (diffDays === 1) return 'Keep the momentum going!';
  if (diffDays <= 3) return `It's been ${diffDays} days — time to get back on court`;
  if (diffDays <= 7) return `Your cues miss you! Last practiced ${diffDays} days ago`;
  return 'Welcome back! Let\u2019s shake off the rust';
}

function computeStreak(sessions: Session[]): { count: number; isAtRisk: boolean } {
  if (sessions.length === 0) return { count: 0, isAtRisk: false };

  // Get unique calendar days (local time) sorted descending
  const daySet = new Set<string>();
  for (const s of sessions) {
    const d = new Date(s.date);
    daySet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }
  const days = Array.from(daySet)
    .map((key) => {
      const [y, m, d] = key.split('-').map(Number);
      return new Date(y, m, d);
    })
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstDay = new Date(days[0]);
  firstDay.setHours(0, 0, 0, 0);

  const daysBetween = Math.round((today.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));
  // If most recent session is more than 1 day ago, streak is broken
  if (daysBetween > 1) return { count: 0, isAtRisk: false };

  let count = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    prev.setHours(0, 0, 0, 0);
    const curr = new Date(days[i]);
    curr.setHours(0, 0, 0, 0);
    const diff = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      count++;
    } else {
      break;
    }
  }

  const isAtRisk = daysBetween === 1; // practiced yesterday but not today
  return { count, isAtRisk };
}

function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const { activeCueIds, level } = useUserStore();
  const sessions = useSessionStore((s) => s.sessions);
  const activeCues = cues.filter((cue) => activeCueIds.includes(cue.id));
  const streak = computeStreak(sessions);

  // Last session recap data
  const lastSession = sessions.length > 0 ? sessions[0] : null;
  const prevSession = sessions.length > 1 ? sessions[1] : null;
  const recapItems = lastSession
    ? lastSession.cueRatings.map((cr) => {
        const cue = cues.find((c) => c.id === cr.cueId);
        const prevRating = prevSession
          ? prevSession.cueRatings.find((pr) => pr.cueId === cr.cueId)?.rating
          : undefined;
        let trend: 'up' | 'down' | 'same' | 'new' = 'new';
        if (prevRating !== undefined) {
          if (cr.rating > prevRating) trend = 'up';
          else if (cr.rating < prevRating) trend = 'down';
          else trend = 'same';
        }
        return { cueId: cr.cueId, title: cue?.title ?? 'Unknown', rating: cr.rating, trend };
      })
    : [];

  const flameScale = useSharedValue(1);
  useEffect(() => {
    if (streak.count >= 2) {
      flameScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    }
  }, [streak.count]);
  const flameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  const handleStartSession = () => {
    router.push('/court-mode');
  };

  const handleBrowseLibrary = () => {
    router.push('/(tabs)/library');
  };

  if (activeCues.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.emptyIcon, { backgroundColor: colors.surface }]}>
          <FontAwesome name="list-alt" size={48} color={colors.textSecondary} />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Active Cues</Text>
        <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
          Add cues from the library to start tracking your practice focus areas.
        </Text>
        <Button
          title="Browse Library"
          onPress={handleBrowseLibrary}
          style={styles.emptyButton}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Last Session Recap */}
        {lastSession && (
          <View style={[styles.recapCard, { backgroundColor: colors.surface }]}>
            <View style={styles.recapHeader}>
              <Text style={[styles.recapTitle, { color: colors.text }]}>Last Session</Text>
              <Text style={[styles.recapDate, { color: colors.textSecondary }]}>
                {getRelativeDate(lastSession.date)}
              </Text>
            </View>
            {recapItems.map((item) => (
              <View key={item.cueId} style={styles.recapRow}>
                <Text style={[styles.recapCueName, { color: colors.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.recapRight}>
                  <View style={styles.recapStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesome
                        key={star}
                        name={star <= item.rating ? 'star' : 'star-o'}
                        size={12}
                        color={star <= item.rating ? '#FFB703' : colors.border}
                      />
                    ))}
                  </View>
                  {item.trend === 'up' && (
                    <FontAwesome name="arrow-up" size={12} color="#2D6A4F" />
                  )}
                  {item.trend === 'down' && (
                    <FontAwesome name="arrow-down" size={12} color="#E63946" />
                  )}
                  {item.trend === 'same' && (
                    <FontAwesome name="minus" size={12} color={colors.textSecondary} />
                  )}
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.recapButton, { backgroundColor: colors.primary + '15' }]}
              onPress={handleStartSession}
            >
              <Text style={[styles.recapButtonText, { color: colors.primary }]}>Practice Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/(tabs)/library')}
            activeOpacity={0.7}
          >
            <Text style={[styles.statNumber, { color: colors.primary }]}>{activeCues.length}</Text>
            <View style={styles.statLabelRow}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Cues</Text>
              <FontAwesome name="chevron-right" size={10} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/(tabs)/profile')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.statNumber, { color: colors[level || 'beginner'] }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {level ? level.charAt(0).toUpperCase() + level.slice(1) : '-'}
            </Text>
            <View style={styles.statLabelRow}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Your Level</Text>
              <FontAwesome name="chevron-right" size={10} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Streak */}
        {streak.count >= 2 && (
          <View style={[styles.streakRow, { backgroundColor: colors.surface }]}>
            <View style={styles.streakLeft}>
              <Animated.View style={flameAnimatedStyle}>
                <FontAwesome name="fire" size={20} color="#FF6B35" />
              </Animated.View>
              <Text style={[styles.streakCount, { color: colors.text }]}>
                {streak.count} day streak
              </Text>
            </View>
            {streak.isAtRisk && (
              <Text style={[styles.streakWarning, { color: '#FF6B35' }]}>
                Practice today to keep it!
              </Text>
            )}
          </View>
        )}

        {/* Session CTA */}
        <TouchableOpacity
          style={[styles.sessionCta, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
          onPress={handleStartSession}
        >
          <View style={styles.sessionCtaContent}>
            <View style={styles.sessionCtaIcon}>
              <FontAwesome name="play-circle" size={32} color={colors.textOnPrimary} />
            </View>
            <View style={styles.sessionCtaText}>
              <Text style={[styles.sessionCtaTitle, { color: colors.textOnPrimary }]}>Start Practice Session</Text>
              <Text style={styles.sessionCtaSubtitle}>
                {getSessionPrompt(sessions)}
              </Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={20} color={colors.textOnPrimary} />
        </TouchableOpacity>

        {/* Active Cues List */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Focus Areas</Text>
          <TouchableOpacity onPress={handleBrowseLibrary}>
            <Text style={[styles.sectionLink, { color: colors.primary }]}>Add More</Text>
          </TouchableOpacity>
        </View>

        {activeCues.map((cue) => (
          <CueCard key={cue.id} cue={cue} compact />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakCount: {
    fontSize: 15,
    fontWeight: '700',
  },
  streakWarning: {
    fontSize: 13,
    fontWeight: '600',
  },
  sessionCta: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sessionCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sessionCtaIcon: {
    marginRight: 16,
  },
  sessionCtaText: {
    flex: 1,
  },
  sessionCtaTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sessionCtaSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
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
  sectionLink: {
    fontSize: 15,
    fontWeight: '600',
  },
  // Recap card
  recapCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recapTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  recapDate: {
    fontSize: 13,
  },
  recapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  recapCueName: {
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  recapRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recapStars: {
    flexDirection: 'row',
    gap: 2,
  },
  recapButton: {
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  recapButtonText: {
    fontSize: 14,
    fontWeight: '700',
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
