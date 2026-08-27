/**
 * Nutrition calculation utilities
 * Uses Mifflin-St Jeor BMR formula
 */

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,        // Little or no exercise
  light: 1.375,          // Light exercise 1–3 days/week
  moderate: 1.55,        // Moderate exercise 3–5 days/week
  active: 1.725,         // Hard exercise 6–7 days/week
  veryActive: 1.9,       // Very hard exercise, physical job
};

const GOAL_OFFSETS = {
  bulk: 400,       // Caloric surplus
  cut: -400,       // Caloric deficit
  maintain: 0,
};

/**
 * Calculate BMI
 * @param {number} weightKg
 * @param {number} heightCm
 * @returns {number}
 */
export function calcBMI(weightKg, heightCm) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/**
 * BMI category string
 */
export function bmiCategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

/**
 * Mifflin-St Jeor BMR
 * @param {'male'|'female'} sex
 * @param {number} weightKg
 * @param {number} heightCm
 * @param {number} age
 * @returns {number} BMR in kcal/day
 */
export function calcBMR(sex, weightKg, heightCm, age) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

/**
 * TDEE = BMR × activity multiplier
 */
export function calcTDEE(bmr, activityLevel) {
  return bmr * (ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.55);
}

/**
 * Daily calorie target with goal offset
 */
export function calcTargetCalories(tdee, goal) {
  return Math.round(tdee + (GOAL_OFFSETS[goal] ?? 0));
}

/**
 * Macro targets in grams
 * Protein: 2g/kg body weight (bulk), 2.2g/kg (cut), 1.8g/kg (maintain)
 * Fat: 25% of calories
 * Carbs: remainder
 */
export function calcMacros(targetCalories, weightKg, goal) {
  const proteinPerKg = goal === 'cut' ? 2.2 : goal === 'bulk' ? 2.0 : 1.8;
  const proteinG = Math.round(weightKg * proteinPerKg);
  const fatG = Math.round((targetCalories * 0.25) / 9);
  const carbsG = Math.round((targetCalories - proteinG * 4 - fatG * 9) / 4);

  return {
    protein: proteinG,
    carbs: Math.max(carbsG, 50), // floor to 50g
    fat: fatG,
  };
}

/**
 * Full profile calculation
 */
export function calcNutritionProfile(profile) {
  const { name, age, sex, heightCm, weightKg, activityLevel, goal } = profile;
  const bmi = calcBMI(weightKg, heightCm);
  const bmr = calcBMR(sex, weightKg, heightCm, age);
  const tdee = calcTDEE(bmr, activityLevel);
  const targetCalories = calcTargetCalories(tdee, goal);
  const macros = calcMacros(targetCalories, weightKg, goal);

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    bmiCategory: bmiCategory(bmi),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories,
    macros,
  };
}

export const ACTIVITY_LABELS = {
  sedentary: 'Sedentary (desk job)',
  light: 'Lightly Active (1-3x/week)',
  moderate: 'Moderately Active (3-5x/week)',
  active: 'Very Active (6-7x/week)',
  veryActive: 'Athlete / Physical Job',
};
