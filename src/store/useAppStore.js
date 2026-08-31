import { create } from 'zustand';
import { calcNutritionProfile } from '../utils/nutrition';

const INITIAL_ACHIEVEMENTS = [
  { id: 'first_step', title: 'First Calibration', desc: 'Completed Zeus biometric intake', icon: 'shield-checkmark', unlocked: true },
  { id: 'streak_3', title: 'Consistent Fire', desc: 'Maintained 3+ days active streak', icon: 'flame', unlocked: true },
  { id: 'streak_7', title: 'Olympian Dedication', desc: 'Achieved 7-day training consistency', icon: 'trophy', unlocked: true },
  { id: 'ai_form_pro', title: 'Biomechanical Master', desc: 'Scored 90%+ form score in AI Pose Tracker', icon: 'sparkles', unlocked: false },
  { id: 'calorie_sniper', title: 'Calorie Architect', desc: 'Logged 5+ meals with Vision AI', icon: 'camera', unlocked: false },
  { id: 'iron_athlete', title: 'Century Rep Club', desc: 'Completed 100+ reps with AI tracker', icon: 'barbell', unlocked: false },
];

const useAppStore = create((set, get) => ({
  // ─── Onboarding ──────────────────────────────────────────────────────────
  hasCompletedOnboarding: false,
  profile: {
    name: 'Perseus',
    age: 25,
    sex: 'male',
    heightCm: 178,
    weightKg: 78,
    activityLevel: 'moderate',
    goal: 'bulk',
    dietPref: 'nonveg',
    memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  },
  nutrition: {
    bmi: 24.6,
    bmiCategory: 'Optimal Lean Mass',
    bmr: 1780,
    tdee: 2450,
    targetCalories: 2850,
    macros: { protein: 175, carbs: 320, fat: 75 },
  },

  setProfile: (profile) => set({ profile }),
  setNutrition: (nutrition) => set({ nutrition }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  updateProfileAndRecalculate: (newProfile) => {
    const updatedProfile = { ...get().profile, ...newProfile };
    const calculatedNutrition = calcNutritionProfile(updatedProfile);
    set({
      profile: updatedProfile,
      nutrition: calculatedNutrition,
    });
  },

  // ─── Custom Workouts ─────────────────────────────────────────────────────
  customWorkouts: [],

  addCustomWorkout: (workout) =>
    set((state) => ({
      customWorkouts: [
        ...state.customWorkouts,
        {
          ...workout,
          id: `custom_${Date.now()}`,
          isCustom: true,
          category: workout.category || 'Custom',
          icon: workout.icon || 'barbell-outline',
          caloriesPerRep: workout.caloriesPerRep || 0.5,
          formCues: workout.formCues || [
            'Maintain steady pacing throughout movement',
            'Full range of motion at peak contraction',
            'Keep core braced and spine neutral',
          ],
        },
      ],
    })),

  removeCustomWorkout: (id) =>
    set((state) => ({
      customWorkouts: state.customWorkouts.filter((w) => w.id !== id),
    })),

  // ─── Daily Log ───────────────────────────────────────────────────────────
  dailyLog: [],

  addFoodEntry: (entry) => {
    const state = get();
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
      loggedAt: new Date().toISOString(),
    };
    const updatedLog = [...state.dailyLog, newEntry];

    // Trigger meal streak update
    state.recordMealStreak();

    // Check achievement for logging meals
    let updatedAchievements = state.achievements;
    if (updatedLog.length >= 5) {
      updatedAchievements = updatedAchievements.map((a) =>
        a.id === 'calorie_sniper' ? { ...a, unlocked: true } : a
      );
    }

    set({ dailyLog: updatedLog, achievements: updatedAchievements });
  },

  removeFoodEntry: (id) =>
    set((state) => ({
      dailyLog: state.dailyLog.filter((e) => e.id !== id),
    })),

  clearDailyLog: () => set({ dailyLog: [] }),

  getConsumed: () => {
    const log = get().dailyLog;
    return log.reduce(
      (acc, e) => ({
        calories: acc.calories + (e.calories || 0),
        protein: acc.protein + (e.protein || 0),
        carbs: acc.carbs + (e.carbs || 0),
        fat: acc.fat + (e.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  },

  // ─── Workout Sessions & Lifetime Progress ─────────────────────────────────
  workoutSessions: [
    {
      id: 'demo_1',
      exercise: 'Barbell Back Squat',
      reps: 24,
      sets: 3,
      duration: 180,
      caloriesBurned: 72,
      formScore: 94,
      date: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'demo_2',
      exercise: 'Push-Up Protocol',
      reps: 32,
      sets: 4,
      duration: 140,
      caloriesBurned: 58,
      formScore: 91,
      date: new Date(Date.now() - 172800000).toISOString(),
    },
  ],

  addWorkoutSession: (session) => {
    const state = get();
    const newSession = {
      ...session,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updatedSessions = [...state.workoutSessions, newSession];

    // Increment streak on completing a workout
    state.recordWorkoutStreak();

    // Check achievements
    let updatedAchievements = state.achievements;
    const totalReps = updatedSessions.reduce((sum, s) => sum + (s.reps || 0), 0);

    if (session.formScore >= 90) {
      updatedAchievements = updatedAchievements.map((a) =>
        a.id === 'ai_form_pro' ? { ...a, unlocked: true } : a
      );
    }
    if (totalReps >= 100) {
      updatedAchievements = updatedAchievements.map((a) =>
        a.id === 'iron_athlete' ? { ...a, unlocked: true } : a
      );
    }

    set({
      workoutSessions: updatedSessions,
      achievements: updatedAchievements,
    });
  },

  // ─── Streak System ────────────────────────────────────────────────────────
  streak: 7,
  longestStreak: 14,
  lastActiveDate: new Date().toDateString(),
  lastWorkoutDate: new Date(Date.now() - 86400000).toDateString(),
  streakHistory: [
    new Date(Date.now() - 86400000 * 6).toDateString(),
    new Date(Date.now() - 86400000 * 5).toDateString(),
    new Date(Date.now() - 86400000 * 4).toDateString(),
    new Date(Date.now() - 86400000 * 3).toDateString(),
    new Date(Date.now() - 86400000 * 2).toDateString(),
    new Date(Date.now() - 86400000 * 1).toDateString(),
    new Date().toDateString(),
  ],

  // Check login streak on daily app open
  checkDailyLoginStreak: () => {
    const today = new Date().toDateString();
    const state = get();

    if (state.lastActiveDate === today) {
      return; // Already recorded today
    }

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let newStreak = state.streak;

    if (state.lastActiveDate === yesterday) {
      // Consecutive day login! Increase streak
      newStreak = state.streak + 1;
    } else {
      // Missed a day: start new streak or keep base
      newStreak = Math.max(1, state.streak);
    }

    const newLongest = Math.max(newStreak, state.longestStreak || newStreak);
    const newHistory = Array.from(new Set([...state.streakHistory, today]));

    set({
      streak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: today,
      streakHistory: newHistory,
    });
  },

  // Called when user completes an AI workout session
  recordWorkoutStreak: () => {
    const today = new Date().toDateString();
    const state = get();
    const newStreak = state.lastWorkoutDate === today ? state.streak : state.streak + 1;
    const newLongest = Math.max(newStreak, state.longestStreak || newStreak);
    const newHistory = Array.from(new Set([...state.streakHistory, today]));

    set({
      streak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: today,
      lastWorkoutDate: today,
      streakHistory: newHistory,
    });
  },

  // Called when user logs a meal
  recordMealStreak: () => {
    const today = new Date().toDateString();
    const state = get();
    if (!state.streakHistory.includes(today)) {
      const newHistory = [...state.streakHistory, today];
      set({ streakHistory: newHistory, lastActiveDate: today });
    }
  },

  // ─── Achievements ─────────────────────────────────────────────────────────
  achievements: INITIAL_ACHIEVEMENTS,

  // ─── Steps ───────────────────────────────────────────────────────────────
  stepCount: 4820,
  stepGoal: 10000,

  setStepCount: (count) => set({ stepCount: count }),
  incrementSteps: (delta = 1) =>
    set((state) => ({ stepCount: state.stepCount + delta })),

  // ─── Bookings ────────────────────────────────────────────────────────────
  bookings: [],

  addBooking: (booking) =>
    set((state) => ({
      bookings: [
        ...state.bookings,
        { ...booking, id: Date.now().toString(), bookedAt: new Date().toISOString() },
      ],
    })),
}));

export default useAppStore;

