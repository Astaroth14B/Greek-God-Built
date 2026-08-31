import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import useAppStore from '../store/useAppStore';
import { DEFAULT_WORKOUTS, WORKOUT_CATEGORIES } from '../data/workoutDatabase';

const DIFFICULTY_STYLES = {
  Beginner: { color: Colors.green, border: Colors.green + '55', bg: Colors.greenGlow },
  Intermediate: { color: Colors.gold, border: Colors.borderGold, bg: Colors.goldGlow },
  Advanced: { color: Colors.orange, border: Colors.orange + '55', bg: Colors.orangeGlow },
};

export default function WorkoutScreen({ navigation }) {
  const { customWorkouts, addCustomWorkout, removeCustomWorkout } = useAppStore();
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Custom Workout Form state
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('Chest');
  const [customMuscles, setCustomMuscles] = useState('');
  const [customDifficulty, setCustomDifficulty] = useState('Intermediate');
  const [customCue1, setCustomCue1] = useState('');
  const [customCue2, setCustomCue2] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  // Merge default and user-created custom workouts
  const allWorkouts = [...DEFAULT_WORKOUTS, ...customWorkouts];

  // Filter workouts by category and search term
  const filteredWorkouts = allWorkouts.filter((w) => {
    const matchesCategory =
      activeCategory === 'All'
        ? true
        : activeCategory === 'Custom'
          ? w.isCustom
          : w.category?.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.muscles.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCreateCustomWorkout = () => {
    if (!customName.trim()) return;

    addCustomWorkout({
      name: customName.trim(),
      category: customCategory,
      muscles: customMuscles.trim() || 'Target Muscle Group',
      difficulty: customDifficulty,
      targetTempo: '2-1-1',
      formCues: [
        customCue1.trim() || 'Maintain strict tempo and steady cadence',
        customCue2.trim() || 'Achieve full range of motion at peak contraction',
        'Keep core braced throughout movement',
      ],
      icon: 'barbell-outline',
      caloriesPerRep: 0.5,
    });

    setCustomName('');
    setCustomMuscles('');
    setCustomCue1('');
    setCustomCue2('');
    setIsCustomModalOpen(false);
    setActiveCategory('Custom');
  };

  const selectedWorkoutObj = allWorkouts.find((e) => e.id === selected);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.badge}>
              <Ionicons name="sparkles" size={12} color={Colors.gold} />
              <Text style={styles.badgeText}>ZEUS POSE TRACKER</Text>
            </View>
            <TouchableOpacity
              style={styles.customAddBtn}
              onPress={() => setIsCustomModalOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color={Colors.gold} />
              <Text style={styles.customAddBtnText}>Custom</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>AI Biomechanical Form Telemetry</Text>
          <Text style={styles.subtitle}>
            Select from 25+ compound and isolation exercises or launch your own custom workout with front-camera pose tracking.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search exercises, muscles (e.g. Squat, Quads, Delts)..."
            placeholderTextColor={Colors.textMuted}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryRow}
        >
          {WORKOUT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Exercise Count */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {filteredWorkouts.length} exercise{filteredWorkouts.length !== 1 ? 's' : ''} available
          </Text>
          {activeCategory === 'Custom' && customWorkouts.length === 0 && (
            <TouchableOpacity onPress={() => setIsCustomModalOpen(true)}>
              <Text style={styles.addCustomLink}>+ Add First Custom Exercise</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Exercises List */}
        {filteredWorkouts.map((ex) => {
          const isSelected = selected === ex.id;
          const diffStyle = DIFFICULTY_STYLES[ex.difficulty] || DIFFICULTY_STYLES.Beginner;
          return (
            <TouchableOpacity
              key={ex.id}
              style={[styles.exerciseCard, isSelected && styles.exerciseCardActive]}
              onPress={() => setSelected(ex.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.exerciseIconContainer, isSelected && styles.exerciseIconActive]}>
                <Ionicons
                  name={ex.icon || 'barbell-outline'}
                  size={20}
                  color={isSelected ? Colors.gold : Colors.textSecondary}
                />
              </View>
              <View style={styles.exerciseInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>
                  {ex.isCustom && (
                    <View style={styles.customPill}>
                      <Text style={styles.customPillText}>CUSTOM</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.exerciseMuscles}>{ex.muscles}</Text>
                {ex.targetTempo ? (
                  <Text style={styles.exerciseTempo}>Tempo: {ex.targetTempo}</Text>
                ) : null}
              </View>
              <View style={styles.exerciseRight}>
                <View style={[styles.diffBadge, { backgroundColor: diffStyle.bg, borderColor: diffStyle.border }]}>
                  <Text style={[styles.diffText, { color: diffStyle.color }]}>
                    {ex.difficulty}
                  </Text>
                </View>
                {isSelected ? (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={12} color={Colors.bg} />
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}

        {filteredWorkouts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="barbell-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No matching exercises found</Text>
            <Text style={styles.emptySub}>Try adjusting your search or add a custom workout.</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setIsCustomModalOpen(true)}>
              <Text style={styles.emptyAddBtnText}>+ Create Custom Workout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button (Floats above workouts upon selection) */}
      {selectedWorkoutObj && (
        <View style={styles.floatingDock}>
          <TouchableOpacity
            style={styles.floatingBtn}
            onPress={() =>
              navigation.navigate('WorkoutCamera', {
                exercise: selectedWorkoutObj,
              })
            }
            activeOpacity={0.88}
          >
            <View style={styles.floatingIconBox}>
              <Ionicons name="camera" size={20} color={Colors.bg} />
            </View>
            <View style={styles.floatingTextCol}>
              <Text style={styles.floatingBadge}>ZEUS VISION AI • READY</Text>
              <Text style={styles.floatingExerciseName} numberOfLines={1}>
                {selectedWorkoutObj.name}
              </Text>
            </View>
            <View style={styles.floatingArrowBox}>
              <Ionicons name="arrow-forward" size={18} color={Colors.bg} />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Custom Workout Creation Modal */}
      <Modal visible={isCustomModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="sparkles" size={16} color={Colors.gold} />
                <Text style={styles.modalTitle}>NEW CUSTOM EXERCISE</Text>
              </View>
              <TouchableOpacity onPress={() => setIsCustomModalOpen(false)}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <View style={styles.modalField}>
                <Text style={styles.fieldLabel}>EXERCISE NAME</Text>
                <TextInput
                  style={styles.modalInput}
                  value={customName}
                  onChangeText={setCustomName}
                  placeholder="e.g. Incline Cable Flyes, Kettlebell Snatch..."
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={styles.fieldLabel}>PRIMARY MUSCLE GROUP</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catPickerRow}>
                  {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'].map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.catPickBtn, customCategory === c && styles.catPickBtnActive]}
                      onPress={() => setCustomCategory(c)}
                    >
                      <Text style={[styles.catPickText, customCategory === c && styles.catPickTextActive]}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.modalField}>
                <Text style={styles.fieldLabel}>TARGET MUSCLES</Text>
                <TextInput
                  style={styles.modalInput}
                  value={customMuscles}
                  onChangeText={setCustomMuscles}
                  placeholder="e.g. Upper Pectoralis, Anterior Deltoid, Triceps"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={styles.fieldLabel}>DIFFICULTY LEVEL</Text>
                <View style={styles.diffRow}>
                  {['Beginner', 'Intermediate', 'Advanced'].map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.diffOptionBtn, customDifficulty === d && styles.diffOptionBtnActive]}
                      onPress={() => setCustomDifficulty(d)}
                    >
                      <Text style={[styles.diffOptionText, customDifficulty === d && styles.diffOptionTextActive]}>
                        {d}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalField}>
                <Text style={styles.fieldLabel}>AI COACHING FORM CUE 1</Text>
                <TextInput
                  style={styles.modalInput}
                  value={customCue1}
                  onChangeText={setCustomCue1}
                  placeholder="e.g. Keep chest high and squeeze at peak"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={styles.modalField}>
                <Text style={styles.fieldLabel}>AI COACHING FORM CUE 2</Text>
                <TextInput
                  style={styles.modalInput}
                  value={customCue2}
                  onChangeText={setCustomCue2}
                  placeholder="e.g. Control the eccentric descent for 2 seconds"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveCustomBtn, !customName.trim() && styles.saveCustomBtnDisabled]}
                disabled={!customName.trim()}
                onPress={handleCreateCustomWorkout}
                activeOpacity={0.85}
              >
                <Text style={styles.saveCustomBtnText}>Add to Exercise Database</Text>
                <Ionicons name="checkmark-circle" size={18} color={Colors.bg} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingTop: 60, paddingBottom: 110 },

  header: { marginBottom: Spacing.md },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.goldGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 1.2,
  },
  customAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  customAddBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gold,
  },
  title: { fontSize: FontSizes.xxl, fontWeight: '900', color: Colors.textPrimary },
  subtitle: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    marginBottom: Spacing.sm,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
  },

  categoryScroll: {
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.full,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryBtnActive: {
    backgroundColor: Colors.goldGlow,
    borderColor: Colors.borderGold,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.gold,
  },

  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  addCustomLink: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gold,
  },

  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseCardActive: {
    borderColor: Colors.borderGold,
    backgroundColor: '#181822',
  },
  exerciseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseIconActive: {
    backgroundColor: Colors.goldGlow,
    borderColor: Colors.borderGold,
  },
  exerciseInfo: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseName: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textPrimary },
  customPill: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radii.xs,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  customPillText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.gold,
  },
  exerciseMuscles: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  exerciseTempo: { fontSize: 9, color: Colors.gold, marginTop: 2, fontWeight: '600' },
  exerciseRight: { alignItems: 'flex-end', gap: 6 },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    borderWidth: 1,
  },
  diffText: { fontSize: 8, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 8,
  },
  emptyTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptySub: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  emptyAddBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radii.full,
    backgroundColor: Colors.goldGlow,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  emptyAddBtnText: {
    fontSize: FontSizes.xs,
    fontWeight: '800',
    color: Colors.gold,
  },

  floatingDock: {
    position: 'absolute',
    bottom: 12,
    left: Spacing.md,
    right: Spacing.md,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  floatingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold,
    borderRadius: Radii.full,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  floatingIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingTextCol: {
    flex: 1,
  },
  floatingBadge: {
    fontSize: 8,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.65)',
    letterSpacing: 1,
  },
  floatingExerciseName: {
    fontSize: FontSizes.sm,
    fontWeight: '900',
    color: Colors.bg,
  },
  floatingArrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    padding: Spacing.lg,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 1.2,
  },
  modalScroll: {
    marginBottom: 10,
  },
  modalField: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
  },
  catPickerRow: {
    flexDirection: 'row',
  },
  catPickBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.sm,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
  },
  catPickBtnActive: {
    backgroundColor: Colors.goldGlow,
    borderColor: Colors.borderGold,
  },
  catPickText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  catPickTextActive: {
    color: Colors.gold,
  },
  diffRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diffOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radii.sm,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  diffOptionBtnActive: {
    backgroundColor: Colors.goldGlow,
    borderColor: Colors.borderGold,
  },
  diffOptionText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  diffOptionTextActive: {
    color: Colors.gold,
  },
  saveCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    borderRadius: Radii.full,
    gap: 8,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    ...Shadows.gold,
  },
  saveCustomBtnDisabled: {
    backgroundColor: Colors.bgElevated,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveCustomBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '900',
    color: Colors.bg,
    letterSpacing: 0.5,
  },
});
