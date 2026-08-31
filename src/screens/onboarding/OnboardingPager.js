import React, { useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Dimensions,
  FlatList,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../../theme';
import useAppStore from '../../store/useAppStore';
import { ACTIVITY_LABELS, calcNutritionProfile } from '../../utils/nutrition';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';

const { width } = Dimensions.get('window');

// ─── Step 1: Personal Info ───────────────────────────────────────────────────
const SEX_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

function PersonalInfoStep({ onNext, profile, setProfile }) {
  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState(String(profile.age || 25));
  const [sex, setSex] = useState(profile.sex || 'male');
  const [height, setHeight] = useState(String(profile.heightCm || 175));
  const [weight, setWeight] = useState(String(profile.weightKg || 75));

  const canContinue = name.trim() && age && height && weight;

  const handleNext = () => {
    setProfile({
      ...profile,
      name: name.trim(),
      age: parseInt(age) || 25,
      sex,
      heightCm: parseFloat(height) || 175,
      weightKg: parseFloat(weight) || 75,
    });
    onNext();
  };

  return (
    <KeyboardAvoidingView
      style={styles.stepContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.stepScroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Athlete Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="First name"
            placeholderTextColor={Colors.textMuted}
            autoCorrect={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder="25"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Biological Sex</Text>
          <View style={styles.optionRow}>
            {SEX_OPTIONS.map((opt) => {
              const isSelected = sex === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionBtn, isSelected && styles.optionBtnActive]}
                  onPress={() => setSex(opt.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.rowFields}>
          <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.fieldLabel}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="175"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.fieldLabel}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="75"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, !canContinue && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!canContinue}
          activeOpacity={0.85}
        >
          <Text style={[styles.nextBtnText, !canContinue && styles.nextBtnTextDisabled]}>
            Next Step
          </Text>
          <Ionicons name="arrow-forward" size={16} color={canContinue ? Colors.bg : Colors.textMuted} />
        </TouchableOpacity>

        <Text style={styles.swipeHint}>← Swipe to navigate steps →</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Step 2: Goal ────────────────────────────────────────────────────────────
const ACTIVITY_LEVELS = [
  { value: 'sedentary', icon: 'bed-outline' },
  { value: 'light', icon: 'walk-outline' },
  { value: 'moderate', icon: 'barbell-outline' },
  { value: 'active', icon: 'fitness-outline' },
  { value: 'veryActive', icon: 'trophy-outline' },
];
const GOALS = [
  { value: 'bulk', label: 'Hypertrophy Surplus', desc: 'Lean mass accrual with controlled caloric surplus', icon: 'trending-up-outline' },
  { value: 'cut', label: 'Fat Loss & Definition', desc: 'Metabolic fat reduction while preserving lean mass', icon: 'flame-outline' },
  { value: 'maintain', label: 'Performance Maintenance', desc: 'Body recomposition and athletic work capacity', icon: 'shield-outline' },
];
const DIET_PREFS = [
  { value: 'nonveg', label: 'Standard', icon: 'restaurant-outline' },
  { value: 'veg', label: 'Vegetarian', icon: 'leaf-outline' },
  { value: 'vegan', label: 'Vegan', icon: 'flower-outline' },
  { value: 'keto', label: 'Keto', icon: 'flame-outline' },
];

function GoalStep({ onNext, profile, setProfile }) {
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel || 'moderate');
  const [goal, setGoal] = useState(profile.goal || 'maintain');
  const [dietPref, setDietPref] = useState(profile.dietPref || 'nonveg');

  const handleNext = () => {
    setProfile({ ...profile, activityLevel, goal, dietPref });
    onNext();
  };

  return (
    <ScrollView
      style={styles.stepContainer}
      contentContainerStyle={styles.stepScroll}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <Text style={styles.sectionTitle}>DAILY EXPENDITURE / ACTIVITY</Text>
      {ACTIVITY_LEVELS.map((item) => {
        const isSelected = activityLevel === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.listItem, isSelected && styles.listItemActive]}
            onPress={() => setActivityLevel(item.value)}
            activeOpacity={0.8}
          >
            <View style={[styles.listItemIconBg, isSelected && styles.listItemIconBgActive]}>
              <Ionicons name={item.icon} size={16} color={isSelected ? Colors.gold : Colors.textSecondary} />
            </View>
            <Text style={[styles.listItemText, isSelected && styles.listItemTextActive]}>
              {ACTIVITY_LABELS[item.value]}
            </Text>
            {isSelected && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark" size={12} color={Colors.bg} />
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      <Text style={styles.sectionTitle}>TRAINING OBJECTIVE</Text>
      <View style={styles.goalGrid}>
        {GOALS.map((g) => {
          const isSelected = goal === g.value;
          return (
            <TouchableOpacity
              key={g.value}
              style={[styles.goalCard, isSelected && styles.goalCardActive]}
              onPress={() => setGoal(g.value)}
              activeOpacity={0.8}
            >
              <View style={styles.goalHeaderRow}>
                <View style={[styles.goalIconContainer, isSelected && styles.goalIconContainerActive]}>
                  <Ionicons name={g.icon} size={16} color={isSelected ? Colors.gold : Colors.textSecondary} />
                </View>
                <Text style={[styles.goalLabel, isSelected && styles.goalLabelActive]}>{g.label}</Text>
              </View>
              <Text style={styles.goalDesc}>{g.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>NUTRITION REGIMEN</Text>
      <View style={styles.dietRow}>
        {DIET_PREFS.map((d) => {
          const isSelected = dietPref === d.value;
          return (
            <TouchableOpacity
              key={d.value}
              style={[styles.dietBtn, isSelected && styles.dietBtnActive]}
              onPress={() => setDietPref(d.value)}
              activeOpacity={0.8}
            >
              <Ionicons name={d.icon} size={16} color={isSelected ? Colors.gold : Colors.textSecondary} />
              <Text style={[styles.dietLabel, isSelected && styles.dietLabelActive]}>{d.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
        <Text style={styles.nextBtnText}>Calculate Nutrition Protocol</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.bg} />
      </TouchableOpacity>

      <Text style={styles.swipeHint}>← Swipe to navigate steps →</Text>
    </ScrollView>
  );
}

// ─── Step 3: Summary ─────────────────────────────────────────────────────────
const StatCard = ({ label, value, unit, icon }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>
      <Ionicons name={icon} size={15} color={Colors.gold} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statUnit}>{unit}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

function SummaryStep({ profile, setNutrition, completeOnboarding }) {
  const result = React.useRef(calcNutritionProfile(profile)).current;

  React.useEffect(() => {
    setNutrition(result);
  }, []);

  const macroTotal = result.macros.protein * 4 + result.macros.carbs * 4 + result.macros.fat * 9;

  return (
    <ScrollView
      style={styles.stepContainer}
      contentContainerStyle={styles.stepScroll}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <Card style={styles.bmiCard} highlighted>
        <View>
          <Text style={styles.bmiLabel}>BODY MASS INDEX</Text>
          <Text style={styles.bmiValue}>{result.bmi}</Text>
          <Text style={styles.bmiCategory}>{result.bmiCategory}</Text>
        </View>
        <View style={styles.bmiStats}>
          <Text style={styles.bmiSmall}>Height: {profile.heightCm} cm</Text>
          <Text style={styles.bmiSmall}>Weight: {profile.weightKg} kg</Text>
        </View>
      </Card>

      <View style={styles.statsGrid}>
        <StatCard label="Basal Rate (BMR)" value={result.bmr} unit="kcal / day" icon="flame-outline" />
        <StatCard label="Daily Burn (TDEE)" value={result.tdee} unit="kcal / day" icon="flash-outline" />
      </View>

      <Card style={styles.targetCard} highlighted>
        <View style={styles.targetHeader}>
          <Text style={styles.targetLabel}>TARGET DAILY ENERGY</Text>
          <View style={styles.goalBadge}>
            <Text style={styles.goalBadgeText}>{profile.goal?.toUpperCase() || 'BALANCED'}</Text>
          </View>
        </View>
        <Text style={styles.targetValue}>
          {result.targetCalories}
          <Text style={styles.targetUnit}> kcal</Text>
        </Text>
        {profile.goal !== 'maintain' && (
          <Text style={styles.offsetNote}>
            {profile.goal === 'bulk' ? '+400 kcal surplus for hypertrophy' : '-400 kcal deficit for fat reduction'}
          </Text>
        )}
      </Card>

      <Text style={styles.sectionTitle}>MACRONUTRIENT TARGETS</Text>
      <View style={styles.macroRow}>
        {[
          { label: 'Protein', value: result.macros.protein, color: Colors.gold, icon: 'fitness-outline' },
          { label: 'Carbs', value: result.macros.carbs, color: Colors.textPrimary, icon: 'nutrition-outline' },
          { label: 'Fat', value: result.macros.fat, color: Colors.textSecondary, icon: 'shield-checkmark-outline' },
        ].map((m) => (
          <View key={m.label} style={styles.macroCard}>
            <View style={styles.macroIconContainer}>
              <Ionicons name={m.icon} size={14} color={m.color} />
            </View>
            <Text style={[styles.macroValue, { color: m.color }]}>{m.value}g</Text>
            <Text style={styles.macroLabel}>{m.label}</Text>
            <Text style={styles.macroPct}>
              {Math.round((m.value * (m.label === 'Fat' ? 9 : 4) / macroTotal) * 100)}%
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.ctaBtn} onPress={completeOnboarding} activeOpacity={0.85}>
        <Text style={styles.ctaBtnText}>Enter Dashboard</Text>
        <Ionicons name="arrow-forward" size={18} color={Colors.bg} />
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Main Pager ──────────────────────────────────────────────────────────────
const STEP_NAMES = ['Biometric Profile', 'Objective Calibration', 'Calibrated Protocol'];
const STEP_LABELS = ['STEP 1 OF 3', 'STEP 2 OF 3', 'STEP 3 OF 3 · COMPLETE'];

export default function OnboardingPager() {
  const { profile, setProfile, setNutrition, completeOnboarding } = useAppStore();
  const flatListRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const goToPage = useCallback((page) => {
    flatListRef.current?.scrollToIndex({ index: page, animated: true });
    setCurrentPage(page);
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goNext = useCallback(() => {
    if (currentPage < 2) goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const pages = [
    { key: 'personal' },
    { key: 'goal' },
    { key: 'summary' },
  ];

  const renderPage = useCallback(({ index }) => {
    if (index === 0) {
      return (
        <View style={styles.page}>
          <PersonalInfoStep onNext={goNext} profile={profile} setProfile={setProfile} />
        </View>
      );
    }
    if (index === 1) {
      return (
        <View style={styles.page}>
          <GoalStep onNext={goNext} profile={profile} setProfile={setProfile} />
        </View>
      );
    }
    return (
      <View style={styles.page}>
        <SummaryStep
          profile={profile}
          setNutrition={setNutrition}
          completeOnboarding={completeOnboarding}
        />
      </View>
    );
  }, [goNext, profile, setProfile, setNutrition, completeOnboarding]);

  return (
    <View style={styles.root}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, currentPage === 0 && styles.backBtnHidden]}
          onPress={goPrev}
          activeOpacity={0.7}
          disabled={currentPage === 0}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.gold} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.stepLabel}>{STEP_LABELS[currentPage]}</Text>
          <Text style={styles.stepTitle}>{STEP_NAMES[currentPage]}</Text>
        </View>

        {/* Spacer to balance layout */}
        <View style={styles.backBtn} />
      </View>

      {/* ── Progress Dots ── */}
      <View style={styles.progressRow}>
        {STEP_NAMES.map((_, i) => {
          const isDone = i < currentPage;
          const isActive = i === currentPage;
          return (
            <React.Fragment key={i}>
              <TouchableOpacity
                onPress={() => { if (i <= currentPage) goToPage(i); }}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.progressDot,
                  isDone && styles.progressDone,
                  isActive && styles.progressActive,
                ]} />
              </TouchableOpacity>
              {i < 2 && (
                <View style={[styles.progressLine, isDone && styles.progressLineDone]} />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* ── Horizontal Pager (FlatList for Android-safe swipe) ── */}
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderPage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.pager}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={3}
        scrollEnabled
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 56,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.goldGlow,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnHidden: { opacity: 0 },
  headerCenter: { flex: 1, alignItems: 'center' },
  stepLabel: {
    fontSize: 10,
    color: Colors.gold,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  stepTitle: {
    fontSize: FontSizes.md,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressDone: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  progressActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
    width: 24,
    borderRadius: 5,
  },
  progressLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.border,
    marginHorizontal: 6,
  },
  progressLineDone: { backgroundColor: Colors.gold },

  // Pager
  pager: { flex: 1 },
  page: { width, flex: 1 },

  // Shared step layout
  stepContainer: { flex: 1, backgroundColor: Colors.bg },
  stepScroll: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: 48,
  },
  swipeHint: {
    textAlign: 'center',
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: Spacing.md,
    letterSpacing: 0.5,
  },

  // Step 1 — Personal Info
  field: { marginBottom: Spacing.md },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  optionRow: { flexDirection: 'row', gap: 10 },
  optionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radii.md,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionBtnActive: { backgroundColor: Colors.goldGlow, borderColor: Colors.borderGold },
  optionText: { fontSize: FontSizes.sm, color: Colors.textSecondary, fontWeight: '600' },
  optionTextActive: { color: Colors.gold, fontWeight: '700' },
  rowFields: { flexDirection: 'row' },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    borderRadius: Radii.full,
    gap: 8,
    marginTop: Spacing.lg,
    ...Shadows.gold,
  },
  nextBtnDisabled: { backgroundColor: Colors.bgElevated, shadowOpacity: 0, elevation: 0 },
  nextBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: Colors.bg,
    letterSpacing: 0.5,
  },
  nextBtnTextDisabled: { color: Colors.textMuted },

  // Step 2 — Goals
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: Spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listItemActive: { borderColor: Colors.borderGold, backgroundColor: '#17171F' },
  listItemIconBg: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  listItemIconBgActive: { backgroundColor: Colors.goldGlow },
  listItemText: { flex: 1, fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600' },
  listItemTextActive: { color: Colors.textPrimary, fontWeight: '700' },
  checkmark: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center',
  },
  goalGrid: { gap: 10, marginBottom: Spacing.sm },
  goalCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  goalCardActive: { borderColor: Colors.borderGold, backgroundColor: '#17171F' },
  goalHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  goalIconContainer: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
  },
  goalIconContainerActive: { backgroundColor: Colors.goldGlow },
  goalLabel: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.textPrimary },
  goalLabelActive: { color: Colors.gold },
  goalDesc: { fontSize: FontSizes.xs, color: Colors.textSecondary, lineHeight: 18, paddingLeft: 38 },
  dietRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.sm },
  dietBtn: {
    flex: 1, minWidth: '47%',
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.md, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  dietBtnActive: { borderColor: Colors.borderGold, backgroundColor: Colors.goldGlow },
  dietLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600' },
  dietLabelActive: { color: Colors.gold, fontWeight: '700' },

  // Step 3 — Summary
  bmiCard: {
    marginBottom: Spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  bmiLabel: { fontSize: 10, color: Colors.textSecondary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  bmiValue: { fontSize: 44, fontWeight: '900', color: Colors.gold, lineHeight: 48 },
  bmiCategory: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600', marginTop: 2 },
  bmiStats: { alignItems: 'flex-end' },
  bmiSmall: { fontSize: FontSizes.xs, color: Colors.textMuted, marginBottom: 2 },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  statCard: {
    flex: 1, backgroundColor: Colors.bgCard,
    borderRadius: Radii.md, padding: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  statIconContainer: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.goldGlow, alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  statValue: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.textPrimary },
  statUnit: { fontSize: 10, color: Colors.textMuted },
  statLabel: { fontSize: 9, color: Colors.textSecondary, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  targetCard: { marginBottom: Spacing.md },
  targetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  targetLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  goalBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.borderGold,
    backgroundColor: Colors.goldGlow,
  },
  goalBadgeText: { fontSize: 9, fontWeight: '800', color: Colors.gold, letterSpacing: 0.8 },
  targetValue: { fontSize: 48, fontWeight: '900', color: Colors.gold, lineHeight: 54 },
  targetUnit: { fontSize: FontSizes.lg, fontWeight: '400', color: Colors.textSecondary },
  offsetNote: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 4 },
  macroRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.xl },
  macroCard: {
    flex: 1, backgroundColor: Colors.bgCard,
    borderRadius: Radii.md, padding: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  macroIconContainer: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  macroValue: { fontSize: FontSizes.md, fontWeight: '800' },
  macroLabel: { fontSize: 9, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  macroPct: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.gold, paddingVertical: 16,
    borderRadius: Radii.full, gap: 8, ...Shadows.gold,
  },
  ctaBtnText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.bg, letterSpacing: 0.5 },
});
