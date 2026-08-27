// MOCK: replace with real model inference (food photo → nutrition lookup via vision API)
// These are the mocked food recognition results returned after a fake "AI analysis"

export const MOCK_FOODS = [
  {
    id: 'f1',
    name: 'Grilled Chicken Breast',
    emoji: '🍗',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    serving: '100g',
  },
  {
    id: 'f2',
    name: 'Brown Rice (cooked)',
    emoji: '🍚',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    serving: '1 cup',
  },
  {
    id: 'f3',
    name: 'Avocado Toast',
    emoji: '🥑',
    calories: 320,
    protein: 9,
    carbs: 33,
    fat: 18,
    serving: '1 slice',
  },
  {
    id: 'f4',
    name: 'Greek Yogurt (0% fat)',
    emoji: '🫙',
    calories: 100,
    protein: 17,
    carbs: 7,
    fat: 0.7,
    serving: '170g',
  },
  {
    id: 'f5',
    name: 'Banana',
    emoji: '🍌',
    calories: 89,
    protein: 1.1,
    carbs: 23,
    fat: 0.3,
    serving: '1 medium',
  },
  {
    id: 'f6',
    name: 'Egg Omelette (2 eggs)',
    emoji: '🍳',
    calories: 180,
    protein: 14,
    carbs: 2,
    fat: 13,
    serving: '2 eggs',
  },
  {
    id: 'f7',
    name: 'Mixed Nuts',
    emoji: '🥜',
    calories: 172,
    protein: 5,
    carbs: 6,
    fat: 15,
    serving: '30g',
  },
  {
    id: 'f8',
    name: 'Protein Shake',
    emoji: '🥤',
    calories: 150,
    protein: 25,
    carbs: 8,
    fat: 3,
    serving: '1 scoop + water',
  },
  {
    id: 'f9',
    name: 'Salmon Fillet',
    emoji: '🐟',
    calories: 208,
    protein: 28,
    carbs: 0,
    fat: 10,
    serving: '100g',
  },
  {
    id: 'f10',
    name: 'Sweet Potato',
    emoji: '🍠',
    calories: 86,
    protein: 2,
    carbs: 20,
    fat: 0.1,
    serving: '100g',
  },
];

// MOCK: replace with real model inference
// Randomly selects a food from the lookup to simulate vision-based recognition
export function mockRecognizeFood() {
  const idx = Math.floor(Math.random() * MOCK_FOODS.length);
  return MOCK_FOODS[idx];
}
