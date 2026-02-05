import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Card } from './Card';
import { LevelBadge } from './LevelBadge';
import { Cue } from '@/types';
import { strokeLabels, skillAreaLabels } from '@/data/cues';
import { useUserStore } from '@/store';

interface CueCardProps {
  cue: Cue;
  showToggle?: boolean;
  compact?: boolean;
}

export function CueCard({ cue, showToggle = false, compact = false }: CueCardProps) {
  const { activeCueIds, toggleActiveCue } = useUserStore();
  const isActive = activeCueIds.includes(cue.id);

  const handlePress = () => {
    router.push(`/cue/${cue.id}`);
  };

  const handleToggle = () => {
    toggleActiveCue(cue.id);
  };

  if (compact) {
    return (
      <Card variant="elevated" onPress={handlePress} style={styles.compactCard}>
        <View style={styles.compactContent}>
          <View style={styles.compactMain}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {cue.title}
            </Text>
            <Text style={styles.compactDescription} numberOfLines={2}>
              {cue.shortDescription}
            </Text>
          </View>
          <FontAwesome
            name="chevron-right"
            size={16}
            color={Colors.textSecondary}
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
          <View style={styles.tag}>
            <Text style={styles.tagText}>{strokeLabels[cue.strokeType]}</Text>
          </View>
        </View>
        {showToggle && (
          <TouchableOpacity onPress={handleToggle} style={styles.toggleButton}>
            <FontAwesome
              name={isActive ? 'check-circle' : 'plus-circle'}
              size={28}
              color={isActive ? Colors.primary : Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>{cue.title}</Text>
      <Text style={styles.description}>{cue.shortDescription}</Text>

      <View style={styles.footer}>
        <View style={styles.skillArea}>
          <FontAwesome name="tag" size={12} color={Colors.textSecondary} />
          <Text style={styles.skillAreaText}>{skillAreaLabels[cue.skillArea]}</Text>
        </View>
        <FontAwesome name="chevron-right" size={14} color={Colors.textSecondary} />
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
    backgroundColor: Colors.background,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  toggleButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
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
    color: Colors.textSecondary,
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
    color: Colors.text,
    marginBottom: 4,
  },
  compactDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});