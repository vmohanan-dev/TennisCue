import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { router, useLocalSearchParams, Redirect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { LevelBadge } from '@/components/LevelBadge';
import { StarRating } from '@/components/StarRating';
import { cues, strokeLabels, skillAreaLabels } from '@/data/cues';
import {
  getVideoForCue,
  getVideoThumbnailUrl,
  getTimestampedVideoUrl,
} from '@/data/cue-videos';
import { useUserStore, useSessionStore, useAuthStore } from '@/store';

export default function CueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activeCueIds, toggleActiveCue } = useUserStore();
  const { getCueProgress } = useSessionStore();
  const { user } = useAuthStore();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const cue = cues.find((c) => c.id === id);
  const isActive = activeCueIds.includes(id || '');
  const progress = getCueProgress(id || '');
  const cueVideo = cue ? getVideoForCue(cue.id) : null;

  if (!cue) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Cue not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggle = () => {
    toggleActiveCue(cue.id);
  };

  const getAverageRating = () => {
    if (progress.length === 0) return null;
    const sum = progress.reduce((acc, p) => acc + p.rating, 0);
    return (sum / progress.length).toFixed(1);
  };

  const avgRating = getAverageRating();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <FontAwesome name="times" size={24} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggle} style={styles.toggleButton}>
          <FontAwesome
            name={isActive ? 'check-circle' : 'plus-circle'}
            size={28}
            color={isActive ? Colors.primary : Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Badges */}
        <View style={styles.badges}>
          <LevelBadge level={cue.level} size="medium" />
          <View style={styles.strokeBadge}>
            <Text style={styles.strokeBadgeText}>{strokeLabels[cue.strokeType]}</Text>
          </View>
          <View style={styles.skillBadge}>
            <Text style={styles.skillBadgeText}>{skillAreaLabels[cue.skillArea]}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{cue.title}</Text>

        {/* Short description */}
        <Text style={styles.shortDescription}>{cue.shortDescription}</Text>

        {/* Progress (if any) */}
        {progress.length > 0 && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <FontAwesome name="line-chart" size={18} color={Colors.secondary} />
              <Text style={styles.progressTitle}>Your Progress</Text>
            </View>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{progress.length}</Text>
                <Text style={styles.progressStatLabel}>Sessions</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <View style={styles.avgRatingRow}>
                  <FontAwesome name="star" size={16} color={Colors.starFilled} />
                  <Text style={styles.progressStatValue}>{avgRating}</Text>
                </View>
                <Text style={styles.progressStatLabel}>Avg Rating</Text>
              </View>
            </View>
            {/* Recent ratings */}
            <View style={styles.recentRatings}>
              <Text style={styles.recentRatingsLabel}>Recent:</Text>
              {progress.slice(-5).map((p, index) => (
                <View key={index} style={styles.recentRating}>
                  <StarRating rating={p.rating} size={12} readonly />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Full description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Execute</Text>
          <Text style={styles.fullDescription}>{cue.fullDescription}</Text>
        </View>

        {/* Watch Video */}
        {cueVideo ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Watch Video</Text>
            <TouchableOpacity
              style={styles.videoCard}
              onPress={() =>
                Linking.openURL(
                  getTimestampedVideoUrl(cueVideo.videoId, cueVideo.startTime)
                )
              }
              activeOpacity={0.8}
            >
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{ uri: getVideoThumbnailUrl(cueVideo.videoId) }}
                  style={styles.thumbnail}
                />
                <View style={styles.playOverlay}>
                  <FontAwesome
                    name="play-circle"
                    size={48}
                    color="rgba(255,255,255,0.9)"
                  />
                </View>
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoSegmentDesc}>
                  {cueVideo.segmentDescription}
                </Text>
                <View style={styles.videoMeta}>
                  <FontAwesome name="youtube-play" size={14} color="#FF0000" />
                  <Text style={styles.videoTitle} numberOfLines={1}>
                    {cueVideo.videoTitle}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noVideoContainer}>
            <FontAwesome
              name="film"
              size={16}
              color={Colors.textSecondary}
            />
            <Text style={styles.noVideoText}>No video available yet</Text>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <FontAwesome name="lightbulb-o" size={18} color={Colors.accent} />
            <Text style={styles.tipTitle}>Practice Tip</Text>
          </View>
          <Text style={styles.tipText}>
            Focus on this cue during your warm-up and periodically remind yourself
            throughout practice. Quality repetition builds muscle memory.
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title={isActive ? 'Remove from Focus' : 'Add to Focus'}
          onPress={handleToggle}
          variant={isActive ? 'outline' : 'primary'}
          size="large"
          style={styles.footerButton}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  strokeBadge: {
    backgroundColor: Colors.secondary + '20',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  strokeBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  skillBadge: {
    backgroundColor: Colors.background,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skillBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
  },
  shortDescription: {
    fontSize: 18,
    color: Colors.textSecondary,
    lineHeight: 26,
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressStat: {
    flex: 1,
    alignItems: 'center',
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  progressStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  avgRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressStatLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  recentRatings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  recentRatingsLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  recentRating: {
    marginRight: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  fullDescription: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 26,
  },
  videoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoInfo: {
    padding: 16,
  },
  videoSegmentDesc: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  videoTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  noVideoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginBottom: 24,
  },
  noVideoText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tipCard: {
    backgroundColor: Colors.accentLight + '20',
    borderRadius: 16,
    padding: 20,
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
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerButton: {
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});