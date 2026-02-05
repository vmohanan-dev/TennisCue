import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { CueCard } from '@/components/CueCard';
import { useUserStore } from '@/store';
import { cues, strokeLabels, skillAreaLabels, levelLabels } from '@/data/cues';
import { StrokeType, SkillArea, SkillLevel } from '@/types';

type FilterType = 'all' | 'stroke' | 'skill' | 'level';

// Icon mappings for category cards
const strokeIcons: Record<StrokeType, string> = {
  forehand: 'hand-paper-o',
  backhand: 'reply',
  serve: 'arrow-up',
  return: 'mail-reply',
  volley: 'bolt',
  overhead: 'cloud-upload',
  general: 'th-large',
  approach: 'arrow-right',
  'drop-shot': 'hand-stop-o',
  lob: 'level-up',
  slice: 'minus',
};

const skillIcons: Record<SkillArea, string> = {
  footwork: 'road',
  preparation: 'clock-o',
  contact: 'bullseye',
  'follow-through': 'long-arrow-right',
  timing: 'hourglass-half',
  mental: 'lightbulb-o',
  recovery: 'refresh',
  tactics: 'sitemap',
};

const levelIcons: Record<SkillLevel, string> = {
  beginner: 'star-o',
  intermediate: 'star-half-o',
  advanced: 'star',
};

interface FilterOption {
  id: string;
  label: string;
  type: FilterType;
}

export default function LibraryScreen() {
  useUserStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedStroke, setSelectedStroke] = useState<StrokeType | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillArea | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | null>(null);

  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All', type: 'all' },
    { id: 'level', label: 'By Level', type: 'level' },
    { id: 'stroke', label: 'By Stroke', type: 'stroke' },
    { id: 'skill', label: 'By Skill', type: 'skill' },
  ];

  const strokeOptions = Object.entries(strokeLabels).map(([id, label]) => ({
    id: id as StrokeType,
    label,
  }));

  const skillOptions = Object.entries(skillAreaLabels).map(([id, label]) => ({
    id: id as SkillArea,
    label,
  }));

  const levelOptions = Object.entries(levelLabels).map(([id, label]) => ({
    id: id as SkillLevel,
    label,
  }));

  // Calculate cue counts per category
  const cueCounts = useMemo(() => {
    return {
      stroke: strokeOptions.reduce((acc, opt) => {
        acc[opt.id] = cues.filter((c) => c.strokeType === opt.id).length;
        return acc;
      }, {} as Record<StrokeType, number>),
      skill: skillOptions.reduce((acc, opt) => {
        acc[opt.id] = cues.filter((c) => c.skillArea === opt.id).length;
        return acc;
      }, {} as Record<SkillArea, number>),
      level: levelOptions.reduce((acc, opt) => {
        acc[opt.id] = cues.filter((c) => c.level === opt.id).length;
        return acc;
      }, {} as Record<SkillLevel, number>),
    };
  }, []);

  const filteredCues = useMemo(() => {
    let result = [...cues];

    if (activeFilter === 'stroke' && selectedStroke) {
      result = result.filter((cue) => cue.strokeType === selectedStroke);
    } else if (activeFilter === 'skill' && selectedSkill) {
      result = result.filter((cue) => cue.skillArea === selectedSkill);
    } else if (activeFilter === 'level' && selectedLevel) {
      result = result.filter((cue) => cue.level === selectedLevel);
    }

    // Sort by level (beginner first), then by sortOrder for beginners, alphabetically for others
    const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 };
    result.sort((a, b) => {
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];
      if (levelDiff !== 0) return levelDiff;
      // For beginners, use pedagogical sortOrder; otherwise alphabetical
      if (a.level === 'beginner' && b.level === 'beginner') {
        return (a.sortOrder || 999) - (b.sortOrder || 999);
      }
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [activeFilter, selectedStroke, selectedSkill, selectedLevel]);

  const handleFilterChange = (type: FilterType) => {
    setActiveFilter(type);
    if (type === 'all') {
      setSelectedStroke(null);
      setSelectedSkill(null);
      setSelectedLevel(null);
    }
  };

  const renderCategoryCard = (
    option: { id: string; label: string },
    isSelected: boolean,
    count: number,
    icon: string,
    onPress: () => void,
    colorOverride?: string
  ) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.categoryCard,
        isSelected && styles.categoryCardActive,
        colorOverride && { borderColor: colorOverride },
        isSelected && colorOverride && { backgroundColor: colorOverride + '15' },
      ]}
      onPress={onPress}
    >
      <FontAwesome
        name={icon as any}
        size={24}
        color={
          isSelected
            ? colorOverride || Colors.primary
            : Colors.textSecondary
        }
      />
      <Text
        style={[
          styles.categoryLabel,
          isSelected && styles.categoryLabelActive,
          isSelected && colorOverride && { color: colorOverride },
        ]}
        numberOfLines={2}
      >
        {option.label}
      </Text>
      <Text style={styles.categoryCount}>{count}</Text>
    </TouchableOpacity>
  );

  const renderSubFilters = () => {
    if (activeFilter === 'stroke') {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subFilterScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {strokeOptions.map((option) =>
            renderCategoryCard(
              option,
              selectedStroke === option.id,
              cueCounts.stroke[option.id],
              strokeIcons[option.id],
              () => setSelectedStroke(selectedStroke === option.id ? null : option.id)
            )
          )}
        </ScrollView>
      );
    }

    if (activeFilter === 'skill') {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subFilterScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {skillOptions.map((option) =>
            renderCategoryCard(
              option,
              selectedSkill === option.id,
              cueCounts.skill[option.id],
              skillIcons[option.id],
              () => setSelectedSkill(selectedSkill === option.id ? null : option.id)
            )
          )}
        </ScrollView>
      );
    }

    if (activeFilter === 'level') {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subFilterScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {levelOptions.map((option) =>
            renderCategoryCard(
              option,
              selectedLevel === option.id,
              cueCounts.level[option.id],
              levelIcons[option.id],
              () => setSelectedLevel(selectedLevel === option.id ? null : option.id),
              Colors[option.id as keyof typeof Colors] as string
            )
          )}
        </ScrollView>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Main Filters */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterChip,
                activeFilter === option.type && styles.filterChipActive,
              ]}
              onPress={() => handleFilterChange(option.type)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === option.type && styles.filterTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sub Filters */}
      {renderSubFilters()}

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredCues.length} cue{filteredCues.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Cues List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCues.map((cue) => (
          <CueCard key={cue.id} cue={cue} showToggle />
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
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.background,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.textLight,
  },
  subFilterScroll: {
    flexGrow: 0,
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryCard: {
    width: 85,
    height: 95,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  categoryCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 14,
  },
  categoryLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
});