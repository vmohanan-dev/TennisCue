import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { DotIndicator } from '@/components/DotIndicator';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store';
import { cues } from '@/data/cues';
import { getVideoForCue, getTimestampedVideoUrl } from '@/data/cue-videos';
import { Cue } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COURT = {
  bg: '#0A0A0A',
  cardBg: '#1A1A1A',
  cardBorder: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textBody: '#E0E0E0',
  accent: '#00C853',
  dismiss: 'rgba(255,255,255,0.7)',
};

function CueCardItem({ cue }: { cue: Cue }) {
  const [showVideo, setShowVideo] = useState(false);
  const cueVideo = getVideoForCue(cue.id);

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.card}>
        {cueVideo && (
          <TouchableOpacity
            style={styles.videoIconButton}
            onPress={() => setShowVideo(!showVideo)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome
              name="play-circle"
              size={22}
              color={showVideo ? COURT.accent : COURT.textSecondary}
            />
          </TouchableOpacity>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cardScrollContent}
        >
          <Text style={styles.cardTitle}>{cue.title}</Text>
          <Text style={styles.cardShortDesc}>{cue.shortDescription}</Text>
          <Text style={styles.cardFullDesc}>{cue.fullDescription}</Text>

          {showVideo && cueVideo && (
            <View style={styles.videoPanel}>
              <View style={styles.videoPanelDivider} />
              <Text style={styles.videoPanelTitle}>
                {cueVideo.videoTitle}
              </Text>
              <Text style={styles.videoPanelDesc}>
                {cueVideo.segmentDescription}
              </Text>
              <TouchableOpacity
                style={styles.videoPanelButton}
                onPress={() =>
                  Linking.openURL(
                    getTimestampedVideoUrl(
                      cueVideo.videoId,
                      cueVideo.startTime
                    )
                  )
                }
              >
                <FontAwesome name="youtube-play" size={16} color={COURT.bg} />
                <Text style={styles.videoPanelButtonText}>
                  Open in YouTube
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

export default function CourtModeScreen() {
  const insets = useSafeAreaInsets();
  const { activeCueIds } = useUserStore();
  const activeCues = cues.filter((cue) => activeCueIds.includes(cue.id));
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      setCurrentIndex(index);
    },
    [],
  );

  const handleClose = () => {
    if (currentIndex === activeCues.length - 1) {
      router.push('/court-mode/summary');
    } else {
      Alert.alert('Leave Court Mode?', 'You can rate your session from the last card.', [
        { text: 'Stay', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => router.back() },
      ]);
    }
  };

  const handleRateSession = () => {
    router.push('/court-mode/summary');
  };

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    [],
  );

  if (activeCues.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeButton, { top: insets.top + 12 }]}
        >
          <FontAwesome name="times" size={24} color={COURT.dismiss} />
        </TouchableOpacity>
        <FontAwesome name="list-alt" size={48} color={COURT.textSecondary} />
        <Text style={styles.emptyTitle}>No Active Cues</Text>
        <Text style={styles.emptyDescription}>
          Add cues from the library to start reviewing on court.
        </Text>
        <Button
          title="Browse Library"
          onPress={() => {
            router.back();
            router.push('/(tabs)/library');
          }}
        />
      </View>
    );
  }

  const isLastCard = currentIndex === activeCues.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TouchableOpacity
        onPress={handleClose}
        style={[styles.closeButton, { top: insets.top + 12 }]}
      >
        <FontAwesome name="times" size={24} color={COURT.dismiss} />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={activeCues}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CueCardItem cue={item} />}
        getItemLayout={getItemLayout}
      />

      <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 16 }]}>
        {isLastCard && (
          <TouchableOpacity style={styles.rateButton} onPress={handleRateSession}>
            <Text style={styles.rateButtonText}>Rate My Session</Text>
            <FontAwesome name="chevron-right" size={14} color={COURT.bg} />
          </TouchableOpacity>
        )}
        <DotIndicator count={activeCues.length} activeIndex={currentIndex} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COURT.bg,
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  card: {
    flex: 1,
    backgroundColor: COURT.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COURT.cardBorder,
    overflow: 'hidden',
  },
  cardScrollContent: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COURT.textPrimary,
    marginBottom: 12,
  },
  cardShortDesc: {
    fontSize: 20,
    color: COURT.textSecondary,
    lineHeight: 28,
    marginBottom: 20,
  },
  cardFullDesc: {
    fontSize: 20,
    color: COURT.textBody,
    lineHeight: 30,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 16,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COURT.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
  },
  rateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COURT.bg,
  },
  // Video icon and panel
  videoIconButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COURT.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPanel: {
    marginTop: 20,
  },
  videoPanelDivider: {
    height: 1,
    backgroundColor: COURT.cardBorder,
    marginBottom: 16,
  },
  videoPanelTitle: {
    fontSize: 14,
    color: COURT.textSecondary,
    marginBottom: 6,
  },
  videoPanelDesc: {
    fontSize: 16,
    color: COURT.textBody,
    lineHeight: 24,
    marginBottom: 16,
  },
  videoPanelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COURT.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  videoPanelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: COURT.bg,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    backgroundColor: COURT.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COURT.textPrimary,
  },
  emptyDescription: {
    fontSize: 16,
    color: COURT.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
});
