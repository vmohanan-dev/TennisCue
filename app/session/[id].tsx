import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/Card';
import { StarRating } from '@/components/StarRating';
import { useSessionStore } from '@/store';
import { cues } from '@/data/cues';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSessionById, deleteSession } = useSessionStore();

  const session = getSessionById(id || '');

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Session Details</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Session not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getAverageRating = () => {
    if (session.cueRatings.length === 0) return 0;
    const sum = session.cueRatings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / session.cueRatings.length).toFixed(1);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSession(session.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Details</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.backButton}>
          <FontAwesome name="trash-o" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date & Time */}
        <View style={styles.dateCard}>
          <View style={styles.dateRow}>
            <FontAwesome name="calendar" size={18} color={Colors.primary} />
            <Text style={styles.dateText}>{formatDate(session.date)}</Text>
          </View>
          <View style={styles.dateRow}>
            <FontAwesome name="clock-o" size={18} color={Colors.textSecondary} />
            <Text style={styles.timeText}>{formatTime(session.date)}</Text>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{session.cueRatings.length}</Text>
            <Text style={styles.statLabel}>Cues Rated</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.avgRatingRow}>
              <FontAwesome name="star" size={18} color={Colors.starFilled} />
              <Text style={styles.statNumber}>{getAverageRating()}</Text>
            </View>
            <Text style={styles.statLabel}>Average</Text>
          </View>
        </View>

        {/* Ratings List */}
        <Text style={styles.sectionTitle}>Cue Ratings</Text>
        {session.cueRatings.map((rating) => {
          const cue = cues.find((c) => c.id === rating.cueId);
          return (
            <Card
              key={rating.cueId}
              variant="outlined"
              style={styles.ratingCard}
              onPress={() => router.push(`/cue/${rating.cueId}`)}
            >
              <View style={styles.ratingContent}>
                <View style={styles.ratingInfo}>
                  <Text style={styles.ratingCueTitle}>
                    {cue?.title || 'Unknown Cue'}
                  </Text>
                  <Text style={styles.ratingCueDesc} numberOfLines={1}>
                    {cue?.shortDescription || ''}
                  </Text>
                </View>
                <View style={styles.ratingStars}>
                  <StarRating rating={rating.rating} size={16} readonly />
                </View>
              </View>
            </Card>
          );
        })}

        {/* Notes */}
        {session.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Card variant="outlined" style={styles.notesCard}>
              <Text style={styles.notesText}>{session.notes}</Text>
            </Card>
          </View>
        )}
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  dateCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  timeText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
    color: Colors.text,
  },
  avgRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  ratingCard: {
    marginBottom: 10,
  },
  ratingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingInfo: {
    flex: 1,
    marginRight: 12,
  },
  ratingCueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  ratingCueDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  ratingStars: {
    alignItems: 'flex-end',
  },
  notesSection: {
    marginTop: 16,
  },
  notesCard: {
    padding: 16,
  },
  notesText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
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