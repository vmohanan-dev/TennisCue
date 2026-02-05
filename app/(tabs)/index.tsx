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
import { Button } from '@/components/Button';
import { CueCard } from '@/components/CueCard';
import { useUserStore } from '@/store';
import { cues } from '@/data/cues';

export default function HomeScreen() {
  const { activeCueIds, level } = useUserStore();
  const activeCues = cues.filter((cue) => activeCueIds.includes(cue.id));

  const handleStartSession = () => {
    router.push('/session/new');
  };

  const handleBrowseLibrary = () => {
    router.push('/(tabs)/library');
  };

  if (activeCues.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <FontAwesome name="list-alt" size={48} color={Colors.textSecondary} />
        </View>
        <Text style={styles.emptyTitle}>No Active Cues</Text>
        <Text style={styles.emptyDescription}>
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
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeCues.length}</Text>
            <Text style={styles.statLabel}>Active Cues</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Colors[level || 'beginner'] }]}>
              {level ? level.charAt(0).toUpperCase() + level.slice(1) : '-'}
            </Text>
            <Text style={styles.statLabel}>Your Level</Text>
          </View>
        </View>

        {/* Session CTA */}
        <TouchableOpacity style={styles.sessionCta} onPress={handleStartSession}>
          <View style={styles.sessionCtaContent}>
            <View style={styles.sessionCtaIcon}>
              <FontAwesome name="play-circle" size={32} color={Colors.textLight} />
            </View>
            <View style={styles.sessionCtaText}>
              <Text style={styles.sessionCtaTitle}>Start Practice Session</Text>
              <Text style={styles.sessionCtaSubtitle}>
                Rate your performance on active cues
              </Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={20} color={Colors.textLight} />
        </TouchableOpacity>

        {/* Active Cues List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Focus Areas</Text>
          <TouchableOpacity onPress={handleBrowseLibrary}>
            <Text style={styles.sectionLink}>Add More</Text>
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
    backgroundColor: Colors.background,
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
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sessionCta: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: Colors.primary,
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
    color: Colors.textLight,
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
    color: Colors.text,
  },
  sectionLink: {
    fontSize: 15,
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