import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // ─── Onboarding ──────────────────────────────────────────────────────────
  hasCompletedOnboarding: false,
  profile: {
    name: '',
    age: 25,
    sex: 'male',
    heightCm: 175,
    weightKg: 75,
    activityLevel: 'moderate',
    goal: 'maintain',
    dietPref: 'nonveg',
  },
  nutrition: {
    bmi: 0,
    bmiCategory: '',
    bmr: 0,
    tdee: 0,
    targetCalories: 2000,
    macros: { protein: 150, carbs: 200, fat: 65 },
  },

  setProfile: (profile) => set({ profile }),
  setNutrition: (nutrition) => set({ nutrition }),
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  // ─── Daily Log ───────────────────────────────────────────────────────────
  dailyLog: [], // Array of food entries logged today

  addFoodEntry: (entry) =>
    set((state) => ({
      dailyLog: [...state.dailyLog, { ...entry, id: Date.now().toString(), loggedAt: new Date().toISOString() }],
    })),

  removeFoodEntry: (id) =>
    set((state) => ({
      dailyLog: state.dailyLog.filter((e) => e.id !== id),
    })),

  clearDailyLog: () => set({ dailyLog: [] }),

  // Computed: consumed calories and macros
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

  // ─── Workout ─────────────────────────────────────────────────────────────
  workoutSessions: [], // Historical sessions

  addWorkoutSession: (session) =>
    set((state) => ({
      workoutSessions: [
        ...state.workoutSessions,
        { ...session, id: Date.now().toString(), date: new Date().toISOString() },
      ],
    })),

  // ─── Streak ──────────────────────────────────────────────────────────────
  streak: 7, // Demo starts at 7 for impressive presentation
  lastActiveDate: new Date().toDateString(),

  incrementStreak: () => {
    const today = new Date().toDateString();
    const state = get();
    if (state.lastActiveDate !== today) {
      set({ streak: state.streak + 1, lastActiveDate: today });
    }
  },

  // ─── Steps ───────────────────────────────────────────────────────────────
  stepCount: 3240, // Mock starting value
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
