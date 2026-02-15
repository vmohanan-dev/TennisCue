import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StarRating } from '@/components/StarRating';
import { Button } from '@/components/Button';
import { useUserStore, useSessionStore } from '@/store';
import { cues } from '@/data/cues';
import { CueRating } from '@/types';

const COURT = {
  bg: '#0A0A0A',
  cardBg: '#1A1A1A',
  cardBorder: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textBody: '#E0E0E0',
  accent: '#00C853',
  starFilled: '#FFB703',
  starEmpty: '#2A2A2A',
  divider: '#2A2A2A',
};

const RATING_LABELS: Record<number, string> = {
  1: 'Needs work',
  2: 'Getting there',
  3: 'Decent',
  4: 'Good',
  5: 'Excellent',
};

export default function CourtModeSummaryScreen() {
  const insets = useSafeAreaInsets();
  const { activeCueIds } = useUserStore();
  const { addSession } = useSessionStore();
  const activeCues = cues.filter((cue) => activeCueIds.includes(cue.id));
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const handleRatingChange = (cueId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [cueId]: rating }));
  };

  const ratedCount = Object.values(ratings).filter((r) => r > 0).length;

  const handleSave = () => {
    const cueRatings: CueRating[] = Object.entries(ratings)
      .filter(([_, rating]) => rating > 0)
      .map(([cueId, rating]) => ({ cueId, rating }));

    if (cueRatings.length === 0) {
      Alert.alert('No Ratings', 'Please rate at least one cue before saving.');
      return;
    }

    addSession(cueRatings);
    router.dismissAll();
  };

  const handleSkip = () => {
    router.dismissAll();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rate Your Session</Text>
        <Text style={styles.headerSubtitle}>
          How well did you execute each cue?
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {activeCues.map((cue) => (
          <View key={cue.id} style={styles.cueCard}>
            <Text style={styles.cueTitle}>{cue.title}</Text>
            <Text style={styles.cueDescription}>{cue.shortDescription}</Text>
            <View style={styles.ratingRow}>
              <StarRating
                rating={ratings[cue.id] || 0}
                onChange={(rating) => handleRatingChange(cue.id, rating)}
                size={32}
                filledColor={COURT.starFilled}
                emptyColor={COURT.starEmpty}
              />
              {ratings[cue.id] ? (
                <Text style={styles.ratingLabel}>
                  {RATING_LABELS[ratings[cue.id]]}
                </Text>
              ) : (
                <Text style={styles.ratingPlaceholder}>Tap to rate</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.footerCount}>
          {ratedCount} of {activeCues.length} cues rated
        </Text>
        <Button
          title="Save Session"
          onPress={handleSave}
          disabled={ratedCount === 0}
          size="large"
          style={styles.saveButton}
        />
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip without rating</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COURT.bg,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COURT.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COURT.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  cueCard: {
    backgroundColor: COURT.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COURT.cardBorder,
    padding: 20,
    marginBottom: 12,
  },
  cueTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COURT.textPrimary,
    marginBottom: 4,
  },
  cueDescription: {
    fontSize: 15,
    color: COURT.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  ratingRow: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COURT.divider,
  },
  ratingLabel: {
    fontSize: 14,
    color: COURT.accent,
    fontWeight: '500',
    marginTop: 8,
  },
  ratingPlaceholder: {
    fontSize: 14,
    color: COURT.textSecondary,
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COURT.bg,
    borderTopWidth: 1,
    borderTopColor: COURT.cardBorder,
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  footerCount: {
    fontSize: 14,
    color: COURT.textSecondary,
    marginBottom: 12,
  },
  saveButton: {
    width: '100%',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 15,
    color: COURT.textSecondary,
  },
});
