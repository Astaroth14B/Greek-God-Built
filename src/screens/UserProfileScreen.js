import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import useAppStore from '../store/useAppStore';
import Card from '../components/Card';

const DAYS_OF_WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function UserProfileScreen({ navigation }) {
  const {
    profile,
    nutrition,
    streak,
    longestStreak,
    streakHistory,
    workoutSessions,
    achievements,
    updateProfileAndRecalculate,
  } = useAppStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name || 'Perseus');
  const [editAge, setEditAge] = useState(String(profile.age || 25));
  const [editSex, setEditSex] = useState(profile.sex || 'male');
  const [editHeight, setEditHeight] = useState(String(profile.heightCm || 178));
  const [editWeight, setEditWeight] = useState(String(profile.weightKg || 78));
  const [editGoal, setEditGoal] = useState(profile.goal || 'bulk');

  // Lifetime computed statistics
  const totalWorkouts = workoutSessions.length;
  const totalReps = workoutSessions.reduce((acc, s) => acc + (s.reps || 0), 0);
  const totalCaloriesBurned = workoutSessions.reduce((acc, s) => acc + (s.caloriesBurned || 0), 0);
  const avgFormScore =
    totalWorkouts > 0
      ? Math.round(workoutSessions.reduce((acc, s) => acc + (s.formScore || 85), 0) / totalWorkouts)
      : 92;

  const handleSaveProfile = () => {
    updateProfileAndRecalculate({
      name: editName.trim() || 'Athlete',
      age: parseInt(editAge) || 25,
      sex: editSex,
      heightCm: parseFloat(editHeight) || 178,
      weightKg: parseFloat(editWeight) || 78,
      goal: editGoal,
    });
    setIsEditModalOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={Colors.gold} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ATHLETE DOSSIER</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            setEditName(profile.name || 'Perseus');
            setEditAge(String(profile.age || 25));
            setEditSex(profile.sex || 'male');
            setEditHeight(String(profile.heightCm || 178));
            setEditWeight(String(profile.weightKg || 78));
            setEditGoal(profile.goal || 'bulk');
            setIsEditModalOpen(true);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={18} color={Colors.gold} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card style={styles.profileCard} highlighted>
          <View style={styles.profileHeroRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarGlow} />
              <View style={styles.avatarBorder}>
                <Image source={require('../../assets/logo.png')} style={styles.avatarImg} resizeMode="contain" />
              </View>
            </View>
            <View style={styles.profileInfoCol}>
              <View style={styles.tierBadge}>
                <Ionicons name="shield-checkmark" size={11} color={Colors.gold} />
                <Text style={styles.tierBadgeText}>OLYMPIAN TIER 1</Text>
              </View>
              <Text style={styles.athleteName}>{profile.name || 'Athlete'}</Text>
              <Text style={styles.athleteGoal}>
                Objective: <Text style={{ color: Colors.gold, fontWeight: '700' }}>{profile.goal?.toUpperCase() || 'BULK'}</Text>
              </Text>
            </View>
          </View>

          {/* Biometrics Summary Row */}
          <View style={styles.biometricsRow}>
            <View style={styles.bioItem}>
              <Text style={styles.bioLabel}>HEIGHT</Text>
              <Text style={styles.bioValue}>{profile.heightCm} <Text style={styles.bioUnit}>cm</Text></Text>
            </View>
            <View style={styles.bioDivider} />
            <View style={styles.bioItem}>
              <Text style={styles.bioLabel}>WEIGHT</Text>
              <Text style={styles.bioValue}>{profile.weightKg} <Text style={styles.bioUnit}>kg</Text></Text>
            </View>
            <View style={styles.bioDivider} />
            <View style={styles.bioItem}>
              <Text style={styles.bioLabel}>BMI</Text>
              <Text style={[styles.bioValue, { color: Colors.gold }]}>{nutrition.bmi || 24.6}</Text>
            </View>
            <View style={styles.bioDivider} />
            <View style={styles.bioItem}>
              <Text style={styles.bioLabel}>TARGET</Text>
              <Text style={styles.bioValue}>{nutrition.targetCalories} <Text style={styles.bioUnit}>kcal</Text></Text>
            </View>
          </View>
        </Card>

        {/* Streak & Consistency Hub */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>TRAINING STREAK & CONSISTENCY</Text>
          <View style={styles.streakLiveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>ACTIVE</Text>
          </View>
        </View>

        <Card style={styles.streakCard}>
          <View style={styles.streakStatsRow}>
            <View style={styles.streakStatBox}>
              <View style={styles.flameCircle}>
                <Ionicons name="flame" size={26} color={Colors.gold} />
              </View>
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakDesc}>Current Day Streak</Text>
            </View>
            <View style={styles.streakStatDivider} />
            <View style={styles.streakStatBox}>
              <View style={[styles.flameCircle, { backgroundColor: 'rgba(255, 180, 0, 0.15)' }]}>
                <Ionicons name="trophy" size={24} color="#FFB400" />
              </View>
              <Text style={[styles.streakNumber, { color: '#FFB400' }]}>{longestStreak}</Text>
              <Text style={styles.streakDesc}>Longest Streak</Text>
            </View>
          </View>

          {/* Streak Week Tracker */}
          <View style={styles.weekCalendar}>
            <Text style={styles.weekCalendarLabel}>LAST 7 DAYS ACTIVITY</Text>
            <View style={styles.daysRow}>
              {DAYS_OF_WEEK.map((day, idx) => {
                const isCompleted = idx <= (streak % 7 || 7) - 1 || idx < 6;
                return (
                  <View key={idx} style={styles.dayCol}>
                    <View style={[styles.dayCircle, isCompleted && styles.dayCircleActive]}>
                      <Ionicons
                        name={isCompleted ? 'checkmark' : 'ellipse-outline'}
                        size={12}
                        color={isCompleted ? Colors.bg : Colors.textMuted}
                      />
                    </View>
                    <Text style={[styles.dayText, isCompleted && styles.dayTextActive]}>{day}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.streakTipBox}>
            <Ionicons name="flash-outline" size={14} color={Colors.gold} />
            <Text style={styles.streakTipText}>
              Complete your daily Vision AI workout or log meals to maintain and grow your streak!
            </Text>
          </View>
        </Card>

        {/* Lifetime Telemetry */}
        <Text style={styles.sectionTitle}>AI TELEMETRY & LIFETIME PROGRESS</Text>
        <View style={styles.telemetryGrid}>
          <Card style={styles.telemetryCard}>
            <Ionicons name="barbell-outline" size={20} color={Colors.gold} />
            <Text style={styles.telemetryVal}>{totalWorkouts}</Text>
            <Text style={styles.telemetryLabel}>Sessions Tracked</Text>
          </Card>
          <Card style={styles.telemetryCard}>
            <Ionicons name="repeat-outline" size={20} color={Colors.gold} />
            <Text style={styles.telemetryVal}>{totalReps}</Text>
            <Text style={styles.telemetryLabel}>Total Reps Logged</Text>
          </Card>
          <Card style={styles.telemetryCard}>
            <Ionicons name="flame-outline" size={20} color={Colors.gold} />
            <Text style={styles.telemetryVal}>{totalCaloriesBurned}</Text>
            <Text style={styles.telemetryLabel}>kcal Burned</Text>
          </Card>
          <Card style={styles.telemetryCard}>
            <Ionicons name="sparkles-outline" size={20} color={Colors.gold} />
            <Text style={styles.telemetryVal}>{avgFormScore}%</Text>
            <Text style={styles.telemetryLabel}>Avg Form Quality</Text>
          </Card>
        </View>

        {/* Achievements & Medals */}
        <Text style={styles.sectionTitle}>OLYMPIAN ACHIEVEMENTS</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((ach) => (
            <Card key={ach.id} style={[styles.achievementCard, ach.unlocked && styles.achievementCardUnlocked]}>
              <View style={[styles.achIconBox, ach.unlocked && styles.achIconBoxUnlocked]}>
                <Ionicons
                  name={ach.icon}
                  size={18}
                  color={ach.unlocked ? Colors.gold : Colors.textMuted}
                />
              </View>
              <View style={styles.achInfo}>
                <Text style={[styles.achTitle, ach.unlocked && styles.achTitleUnlocked]}>
                  {ach.title}
                </Text>
                <Text style={styles.achDesc}>{ach.desc}</Text>
              </View>
              {ach.unlocked ? (
                <View style={styles.unlockedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.gold} />
                </View>
              ) : (
                <View style={styles.lockedBadge}>
                  <Ionicons name="lock-closed-outline" size={14} color={Colors.textMuted} />
                </View>
              )}
            </Card>
          ))}
        </View>

        {/* Workout History */}
        <Text style={styles.sectionTitle}>RECENT WORKOUT TELEMETRY</Text>
        {workoutSessions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No workout sessions recorded yet. Start tracking with Zeus AI Camera!</Text>
          </Card>
        ) : (
          [...workoutSessions].reverse().map((sess) => (
            <Card key={sess.id} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <View style={styles.historyIconBox}>
                  <Ionicons name="barbell" size={18} color={Colors.gold} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyName}>{sess.exercise}</Text>
                  <Text style={styles.historySub}>
                    {sess.reps} reps · {sess.sets || Math.ceil(sess.reps / 8)} sets · {sess.caloriesBurned} kcal
                  </Text>
                </View>
                <View style={styles.historyScoreBox}>
                  <Text style={styles.historyScoreVal}>{sess.formScore}%</Text>
                  <Text style={styles.historyScoreLabel}>FORM</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={isEditModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>EDIT ATHLETE PROFILE</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <View style={styles.modalField}>
                <Text style={styles.fieldLabel}>ATHLETE NAME</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Athlete name"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={styles.modalRow}>
                <View style={[styles.modalField, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.fieldLabel}>AGE</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editAge}
                    onChangeText={setEditAge}
                    keyboardType="numeric"
                    placeholder="25"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
                <View style={[styles.modalField, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.fieldLabel}>SEX</Text>
                  <View style={styles.sexToggleRow}>
                    {['male', 'female'].map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.sexBtn, editSex === s && styles.sexBtnActive]}
                        onPress={() => setEditSex(s)}
                      >
                        <Text style={[styles.sexText, editSex === s && styles.sexTextActive]}>
                          {s.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.modalRow}>
                <View style={[styles.modalField, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.fieldLabel}>HEIGHT (CM)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editHeight}
                    onChangeText={setEditHeight}
                    keyboardType="numeric"
                    placeholder="178"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
                <View style={[styles.modalField, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.fieldLabel}>WEIGHT (KG)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editWeight}
                    onChangeText={setEditWeight}
                    keyboardType="numeric"
                    placeholder="78"
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              </View>

              <View style={styles.modalField}>
                <Text style={styles.fieldLabel}>TRAINING OBJECTIVE</Text>
                <View style={styles.goalRow}>
                  {[
                    { id: 'bulk', label: 'Hypertrophy Surplus' },
                    { id: 'cut', label: 'Fat Loss & Definition' },
                    { id: 'maintain', label: 'Performance Maintain' },
                  ].map((g) => (
                    <TouchableOpacity
                      key={g.id}
                      style={[styles.goalBtn, editGoal === g.id && styles.goalBtnActive]}
                      onPress={() => setEditGoal(g.id)}
                    >
                      <Text style={[styles.goalBtnText, editGoal === g.id && styles.goalBtnTextActive]}>
                        {g.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} activeOpacity={0.85}>
                <Text style={styles.saveBtnText}>Save & Recalculate Protocol</Text>
                <Ionicons name="checkmark-circle" size={18} color={Colors.bg} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 54,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.15)',
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
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.goldGlow,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 2,
  },
  scroll: {
    padding: Spacing.md,
    paddingBottom: 40,
  },

  profileCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  profileHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: Spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGlow: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
  },
  avatarBorder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  profileInfoCol: {
    flex: 1,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.goldGlow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.borderGold,
    marginBottom: 4,
  },
  tierBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 0.8,
  },
  athleteName: {
    fontSize: FontSizes.xl,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  athleteGoal: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  biometricsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bgElevated,
    borderRadius: Radii.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bioItem: {
    flex: 1,
    alignItems: 'center',
  },
  bioLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  bioValue: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  bioUnit: {
    fontSize: 9,
    fontWeight: '400',
    color: Colors.textMuted,
  },
  bioDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: Spacing.md,
    marginBottom: 8,
  },
  streakLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  liveText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#22c55e',
    letterSpacing: 0.8,
  },

  streakCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  streakStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  streakStatBox: {
    alignItems: 'center',
    flex: 1,
  },
  flameCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.goldGlow,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  streakNumber: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.gold,
  },
  streakDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  streakStatDivider: {
    width: 1,
    height: 60,
    backgroundColor: Colors.border,
  },

  weekCalendar: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radii.md,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  weekCalendarLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
    textAlign: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
  },
  dayCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayCircleActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  dayText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  dayTextActive: {
    color: Colors.gold,
  },

  streakTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.goldGlow,
    padding: 8,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  streakTipText: {
    fontSize: 10,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 14,
  },

  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  telemetryCard: {
    width: '48%',
    alignItems: 'center',
    padding: 14,
    gap: 4,
  },
  telemetryVal: {
    fontSize: FontSizes.xl,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  telemetryLabel: {
    fontSize: 9,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  achievementsGrid: {
    gap: 8,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    opacity: 0.6,
  },
  achievementCardUnlocked: {
    opacity: 1,
    borderColor: Colors.borderGold,
    backgroundColor: '#16161E',
  },
  achIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  achIconBoxUnlocked: {
    backgroundColor: Colors.goldGlow,
    borderColor: Colors.borderGold,
  },
  achInfo: {
    flex: 1,
  },
  achTitle: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  achTitleUnlocked: {
    color: Colors.textPrimary,
  },
  achDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  unlockedBadge: {
    padding: 2,
  },
  lockedBadge: {
    padding: 2,
  },

  emptyCard: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  historyCard: {
    marginBottom: 8,
    padding: 12,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  historyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.goldGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  historySub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  historyScoreBox: {
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.sm,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  historyScoreVal: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: Colors.gold,
  },
  historyScoreLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: Colors.textMuted,
  },

  // Modal styles
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
  modalRow: {
    flexDirection: 'row',
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
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  sexToggleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sexBtn: {
    flex: 1,
    backgroundColor: Colors.bgInput,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  sexBtnActive: {
    backgroundColor: Colors.goldGlow,
    borderColor: Colors.borderGold,
  },
  sexText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  sexTextActive: {
    color: Colors.gold,
  },
  goalRow: {
    gap: 8,
  },
  goalBtn: {
    backgroundColor: Colors.bgInput,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  goalBtnActive: {
    backgroundColor: Colors.goldGlow,
    borderColor: Colors.borderGold,
  },
  goalBtnText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  goalBtnTextActive: {
    color: Colors.gold,
    fontWeight: '700',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    borderRadius: Radii.full,
    gap: 8,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.gold,
  },
  saveBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: Colors.bg,
    letterSpacing: 0.5,
  },
});
