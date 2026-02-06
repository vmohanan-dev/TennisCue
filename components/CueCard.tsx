import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '@/components/ThemeProvider';
import { Card } from './Card';
import { LevelBadge } from './LevelBadge';
import { Cue } from '@/types';
import { strokeLabels, skillAreaLabels } from '@/data/cues';
import { getVideosForCue } from '@/data/videos';
import { useUserStore } from '@/store';

interface CueCardProps {
  cue: Cue;
  showToggle?: boolean;
  compact?: boolean;
}

export function CueCard({ cue, showToggle = false, compact = false }: CueCardProps) {
  const { colors } = useTheme();
  const { activeCueIds, toggleActiveCue } = useUserStore();
  const isActive = activeCueIds.includes(cue.id);
  const videos = getVideosForCue(cue.id);
  const hasVideos = videos.length > 0;

  const handlePress = () => {
    router.push(`/cue/${cue.id}`);
  };

  const handleToggle = () => {
    toggleActiveCue(cue.id);
  };

  const handleOpenVideo = async () => {
    if (hasVideos) {
      try {
        await WebBrowser.openBrowserAsync(videos[0].url, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
          controlsColor: colors.primary,
        });
      } catch (error) {
        console.error('Error opening video:', error);
      }
    }
  };

  if (compact) {
    return (
      <Card variant="elevated" onPress={handlePress} style={styles.compactCard}>
        <View style={styles.compactContent}>
          <View style={styles.compactMain}>
            <Text style={[styles.compactTitle, { color: colors.text }]} numberOfLines={1}>
              {cue.title}
            </Text>
            <Text style={[styles.compactDescription, { color: colors.textSecondary }]} numberOfLines={2}>
              {cue.shortDescription}
            </Text>
          </View>
          <FontAwesome
            name="chevron-right"
            size={16}
            color={colors.textSecondary}
          />
        </View>
      </Card>
    );
  }

  return (
    <Card variant="elevated" onPress={handlePress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badges}>
          <LevelBadge level={cue.level} />
          <View style={[styles.tag, { backgroundColor: colors.background }]}>
            <Text style={[styles.tagText, { color: colors.textSecondary }]}>{strokeLabels[cue.strokeType]}</Text>
          </View>
        </View>
        {showToggle && (
          <TouchableOpacity onPress={handleToggle} style={styles.toggleButton}>
            <FontAwesome
              name={isActive ? 'check-circle' : 'plus-circle'}
              size={28}
              color={isActive ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{cue.title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>{cue.shortDescription}</Text>

      <View style={styles.footer}>
        <View style={styles.skillArea}>
          <FontAwesome name="tag" size={12} color={colors.textSecondary} />
          <Text style={[styles.skillAreaText, { color: colors.textSecondary }]}>{skillAreaLabels[cue.skillArea]}</Text>
        </View>
        <View style={styles.footerRight}>
          {hasVideos && (
            <TouchableOpacity onPress={handleOpenVideo} style={styles.videoButton}>
              <FontAwesome name="youtube-play" size={20} color="#FF0000" />
            </TouchableOpacity>
          )}
          <FontAwesome name="chevron-right" size={14} color={colors.textSecondary} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  toggleButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skillAreaText: {
    fontSize: 13,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  videoButton: {
    padding: 4,
  },
  // Compact styles
  compactCard: {
    marginBottom: 8,
    padding: 14,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactMain: {
    flex: 1,
    marginRight: 12,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  compactDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
