import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { StarRating } from '@/components/StarRating';
import { useUserStore, useSessionStore } from '@/store';
import { cues } from '@/data/cues';
import { CueRating } from '@/types';

export default function NewSessionScreen() {
  const { activeCueIds } = useUserStore();
  const { addSession } = useSessionStore();

  const activeCues = cues.filter((cue) => activeCueIds.includes(cue.id));
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  const handleRatingChange = (cueId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [cueId]: rating }));
  };

  const handleSave = () => {
    const cueRatings: CueRating[] = Object.entries(ratings)
      .filter(([_, rating]) => rating > 0)
      .map(([cueId, rating]) => ({ cueId, rating }));

    if (cueRatings.length === 0) {
      Alert.alert('No Ratings', 'Please rate at least one cue before saving.');
      return;
    }

    addSession(cueRatings, notes.trim() || undefined);
    router.back();
  };

  const ratedCount = Object.values(ratings).filter((r) => r > 0).length;

  if (activeCues.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Session</Text>
          <View style={styles.closeButton} />
        </View>
        <View style={styles.emptyContainer}>
          <FontAwesome name="list-alt" size={48} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Active Cues</Text>
          <Text style={styles.emptyDescription}>
            Add cues to your focus list before logging a session.
          </Text>
          <Button
            title="Browse Library"
            onPress={() => {
              router.back();
              router.push('/(tabs)/library');
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Session</Text>
          <View style={styles.closeButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Date */}
          <View style={styles.dateCard}>
            <FontAwesome name="calendar" size={18} color={Colors.primary} />
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>

          {/* Instructions */}
          <Text style={styles.instructions}>
            Rate how well you executed each cue during this session.
          </Text>

          {/* Cue ratings */}
          {activeCues.map((cue) => (
            <Card key={cue.id} variant="outlined" style={styles.cueCard}>
              <Text style={styles.cueTitle}>{cue.title}</Text>
              <Text style={styles.cueDescription}>{cue.shortDescription}</Text>
              <View style={styles.ratingContainer}>
                <StarRating
                  rating={ratings[cue.id] || 0}
                  onChange={(rating) => handleRatingChange(cue.id, rating)}
                  size={32}
                />
                {ratings[cue.id] ? (
                  <Text style={styles.ratingLabel}>
                    {ratings[cue.id] === 1 && 'Needs work'}
                    {ratings[cue.id] === 2 && 'Getting there'}
                    {ratings[cue.id] === 3 && 'Decent'}
                    {ratings[cue.id] === 4 && 'Good'}
                    {ratings[cue.id] === 5 && 'Excellent'}
                  </Text>
                ) : (
                  <Text style={styles.ratingPlaceholder}>Tap to rate</Text>
                )}
              </View>
            </Card>
          ))}

          {/* Notes */}
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Session Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="How did practice go? Any breakthroughs or challenges?"
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={styles.footerCount}>
              {ratedCount} of {activeCues.length} cues rated
            </Text>
          </View>
          <Button
            title="Save Session"
            onPress={handleSave}
            disabled={ratedCount === 0}
            size="large"
            style={styles.saveButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
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
  closeButton: {
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
    paddingBottom: 20,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  instructions: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  cueCard: {
    marginBottom: 12,
  },
  cueTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  cueDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  ratingContainer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  ratingLabel: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 8,
  },
  ratingPlaceholder: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  notesSection: {
    marginTop: 12,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerInfo: {
    marginBottom: 12,
  },
  footerCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  saveButton: {
    width: '100%',
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
});