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

interface FilterOption {
  id: string;
  label: string;
  type: FilterType;
}

export default function LibraryScreen() {
  const { level: userLevel } = useUserStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedStroke, setSelectedStroke] = useState<StrokeType | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillArea | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel | null>(null);

  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All', type: 'all' },
    { id: 'stroke', label: 'By Stroke', type: 'stroke' },
    { id: 'skill', label: 'By Skill', type: 'skill' },
    { id: 'level', label: 'By Level', type: 'level' },
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

  const filteredCues = useMemo(() => {
    let result = [...cues];

    if (activeFilter === 'stroke' && selectedStroke) {
      result = result.filter((cue) => cue.strokeType === selectedStroke);
    } else if (activeFilter === 'skill' && selectedSkill) {
      result = result.filter((cue) => cue.skillArea === selectedSkill);
    } else if (activeFilter === 'level' && selectedLevel) {
      result = result.filter((cue) => cue.level === selectedLevel);
    }

    // Sort by level (beginner first), then alphabetically
    const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 };
    result.sort((a, b) => {
      const levelDiff = levelOrder[a.level] - levelOrder[b.level];
      if (levelDiff !== 0) return levelDiff;
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

  const renderSubFilters = () => {
    if (activeFilter === 'stroke') {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subFilterScroll}
          contentContainerStyle={styles.subFilterContent}
        >
          {strokeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.subFilterChip,
                selectedStroke === option.id && styles.subFilterChipActive,
              ]}
              onPress={() =>
                setSelectedStroke(selectedStroke === option.id ? null : option.id)
              }
            >
              <Text
                style={[
                  styles.subFilterText,
                  selectedStroke === option.id && styles.subFilterTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }

    if (activeFilter === 'skill') {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subFilterScroll}
          contentContainerStyle={styles.subFilterContent}
        >
          {skillOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.subFilterChip,
                selectedSkill === option.id && styles.subFilterChipActive,
              ]}
              onPress={() =>
                setSelectedSkill(selectedSkill === option.id ? null : option.id)
              }
            >
              <Text
                style={[
                  styles.subFilterText,
                  selectedSkill === option.id && styles.subFilterTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }

    if (activeFilter === 'level') {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subFilterScroll}
          contentContainerStyle={styles.subFilterContent}
        >
          {levelOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.subFilterChip,
                selectedLevel === option.id && styles.subFilterChipActive,
                { borderColor: Colors[option.id] },
                selectedLevel === option.id && { backgroundColor: Colors[option.id] },
              ]}
              onPress={() =>
                setSelectedLevel(selectedLevel === option.id ? null : option.id)
              }
            >
              <Text
                style={[
                  styles.subFilterText,
                  selectedLevel === option.id && styles.subFilterTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  subFilterContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  subFilterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  subFilterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  subFilterText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  subFilterTextActive: {
    color: Colors.textLight,
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