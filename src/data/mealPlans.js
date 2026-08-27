// Static meal plans keyed by `${goal}_${dietPref}`
// MOCK: In production, generate personalized plans via AI nutrition engine

const plans = {
  // ─── BULK ───────────────────────────────────────────────────────────────
  bulk_nonveg: {
    breakfast: {
      name: 'Scrambled Eggs & Oats',
      emoji: '🍳',
      description: '4 whole eggs, 1 cup oatmeal with honey & banana',
      calories: 620, protein: 38, carbs: 72, fat: 18,
    },
    lunch: {
      name: 'Chicken Rice Bowl',
      emoji: '🍗',
      description: '200g grilled chicken, 1.5 cups brown rice, mixed veggies',
      calories: 680, protein: 58, carbs: 74, fat: 12,
    },
    dinner: {
      name: 'Beef Stir-Fry',
      emoji: '🥩',
      description: '150g lean beef, noodles, broccoli, soy sauce',
      calories: 590, protein: 42, carbs: 56, fat: 16,
    },
    snack: {
      name: 'Protein Shake + Peanut Butter Toast',
      emoji: '🥤',
      description: '1 scoop whey, 2 slices whole wheat, 2 tbsp PB',
      calories: 440, protein: 32, carbs: 38, fat: 14,
    },
  },

  bulk_veg: {
    breakfast: {
      name: 'Paneer Paratha & Lassi',
      emoji: '🫓',
      description: '2 paneer parathas, 1 glass sweet lassi',
      calories: 580, protein: 26, carbs: 68, fat: 20,
    },
    lunch: {
      name: 'Dal Makhani & Rice',
      emoji: '🍛',
      description: 'Rich lentil curry, 1.5 cups basmati rice, salad',
      calories: 640, protein: 24, carbs: 96, fat: 14,
    },
    dinner: {
      name: 'Tofu Tikka Masala',
      emoji: '🫘',
      description: '200g tofu, tomato masala gravy, 2 chapatis',
      calories: 560, protein: 30, carbs: 58, fat: 18,
    },
    snack: {
      name: 'Banana Protein Smoothie',
      emoji: '🍌',
      description: '2 bananas, 1 scoop protein, 200ml whole milk',
      calories: 380, protein: 28, carbs: 52, fat: 6,
    },
  },

  bulk_vegan: {
    breakfast: {
      name: 'Tofu Scramble & Whole Grain Toast',
      emoji: '🥑',
      description: '150g firm tofu, spinach, avocado, 2 slices toast',
      calories: 520, protein: 28, carbs: 54, fat: 20,
    },
    lunch: {
      name: 'Lentil & Quinoa Power Bowl',
      emoji: '🥗',
      description: '1 cup lentils, 1 cup quinoa, roasted veggies, tahini',
      calories: 620, protein: 32, carbs: 84, fat: 12,
    },
    dinner: {
      name: 'Chickpea Coconut Curry',
      emoji: '🍛',
      description: '1.5 cups chickpeas, coconut milk, basmati rice',
      calories: 580, protein: 22, carbs: 88, fat: 14,
    },
    snack: {
      name: 'Trail Mix & Soy Protein Shake',
      emoji: '🥜',
      description: '40g trail mix, 1 scoop pea protein, almond milk',
      calories: 410, protein: 26, carbs: 42, fat: 14,
    },
  },

  bulk_keto: {
    breakfast: {
      name: 'Bacon & Egg Plate',
      emoji: '🥓',
      description: '4 eggs, 4 strips bacon, half avocado, bulletproof coffee',
      calories: 640, protein: 38, carbs: 4, fat: 52,
    },
    lunch: {
      name: 'Keto Chicken Bowl',
      emoji: '🍗',
      description: '200g chicken thighs, cauliflower rice, cheese, sour cream',
      calories: 680, protein: 50, carbs: 8, fat: 48,
    },
    dinner: {
      name: 'Ribeye Steak & Asparagus',
      emoji: '🥩',
      description: '200g ribeye, butter-sautéed asparagus, garlic',
      calories: 720, protein: 54, carbs: 6, fat: 52,
    },
    snack: {
      name: 'Cheese & Pepperoni Platter',
      emoji: '🧀',
      description: '50g cheddar, 20 pepperoni slices, macadamia nuts',
      calories: 420, protein: 22, carbs: 2, fat: 36,
    },
  },

  // ─── CUT ────────────────────────────────────────────────────────────────
  cut_nonveg: {
    breakfast: {
      name: 'Egg White Omelette',
      emoji: '🍳',
      description: '5 egg whites, spinach, mushrooms, 1 slice whole wheat',
      calories: 240, protein: 32, carbs: 18, fat: 4,
    },
    lunch: {
      name: 'Tuna Salad Wrap',
      emoji: '🥙',
      description: '1 can tuna, lettuce, tomato, mustard, whole wheat wrap',
      calories: 320, protein: 38, carbs: 28, fat: 6,
    },
    dinner: {
      name: 'Baked Salmon & Veggies',
      emoji: '🐟',
      description: '150g salmon, roasted broccoli & zucchini, lemon',
      calories: 340, protein: 38, carbs: 12, fat: 14,
    },
    snack: {
      name: 'Greek Yogurt & Berries',
      emoji: '🫙',
      description: '170g 0% Greek yogurt, 100g mixed berries',
      calories: 160, protein: 18, carbs: 18, fat: 1,
    },
  },

  cut_veg: {
    breakfast: {
      name: 'Moong Dal Chilla',
      emoji: '🫓',
      description: '3 moong dal pancakes, mint chutney, black tea',
      calories: 260, protein: 18, carbs: 36, fat: 4,
    },
    lunch: {
      name: 'Sprout Salad Bowl',
      emoji: '🥗',
      description: 'Mixed sprouts, cucumber, tomato, lemon, black salt',
      calories: 220, protein: 14, carbs: 32, fat: 2,
    },
    dinner: {
      name: 'Palak Tofu & Chapati',
      emoji: '🍃',
      description: '150g tofu in spinach gravy, 2 chapatis',
      calories: 360, protein: 24, carbs: 44, fat: 8,
    },
    snack: {
      name: 'Curd & Cucumber',
      emoji: '🥒',
      description: '150ml low-fat curd, sliced cucumber, salt & cumin',
      calories: 90, protein: 8, carbs: 10, fat: 1,
    },
  },

  cut_vegan: {
    breakfast: {
      name: 'Chia Pudding with Berries',
      emoji: '🫐',
      description: '3 tbsp chia seeds, unsweetened almond milk, berries',
      calories: 220, protein: 8, carbs: 26, fat: 9,
    },
    lunch: {
      name: 'Buddha Bowl',
      emoji: '🥗',
      description: 'Quinoa, edamame, roasted chickpeas, greens, tahini dressing',
      calories: 380, protein: 20, carbs: 50, fat: 10,
    },
    dinner: {
      name: 'Zucchini Noodles & Marinara',
      emoji: '🍝',
      description: '2 zucchinis spiralized, tomato marinara, lentil meatballs',
      calories: 290, protein: 16, carbs: 38, fat: 6,
    },
    snack: {
      name: 'Apple & Almond Butter',
      emoji: '🍎',
      description: '1 apple, 1 tbsp almond butter',
      calories: 180, protein: 4, carbs: 26, fat: 8,
    },
  },

  cut_keto: {
    breakfast: {
      name: 'Keto Egg Muffins',
      emoji: '🥚',
      description: '4 egg muffins with cheese, bacon bits, and bell pepper',
      calories: 280, protein: 24, carbs: 2, fat: 20,
    },
    lunch: {
      name: 'Cobb Salad',
      emoji: '🥗',
      description: 'Romaine, grilled chicken, bacon, hard egg, avocado, blue cheese',
      calories: 420, protein: 38, carbs: 6, fat: 28,
    },
    dinner: {
      name: 'Baked Cod with Cauliflower Mash',
      emoji: '🐠',
      description: '200g cod, buttered cauliflower mash, green beans',
      calories: 360, protein: 42, carbs: 8, fat: 16,
    },
    snack: {
      name: 'Celery & Cream Cheese',
      emoji: '🥬',
      description: '4 celery sticks, 2 tbsp cream cheese',
      calories: 120, protein: 4, carbs: 3, fat: 10,
    },
  },

  // ─── MAINTAIN ───────────────────────────────────────────────────────────
  maintain_nonveg: {
    breakfast: {
      name: 'Eggs, Toast & Fruit',
      emoji: '🍳',
      description: '3 eggs any style, 2 whole wheat toast, 1 orange',
      calories: 440, protein: 28, carbs: 44, fat: 14,
    },
    lunch: {
      name: 'Turkey Sandwich & Salad',
      emoji: '🥪',
      description: 'Turkey, avocado, lettuce wrap + side salad',
      calories: 480, protein: 36, carbs: 38, fat: 18,
    },
    dinner: {
      name: 'Chicken & Veggie Pasta',
      emoji: '🍝',
      description: '150g chicken, whole wheat pasta, tomato sauce, parmesan',
      calories: 560, protein: 42, carbs: 62, fat: 12,
    },
    snack: {
      name: 'Cottage Cheese & Fruit',
      emoji: '🍑',
      description: '150g cottage cheese, sliced peaches or berries',
      calories: 200, protein: 18, carbs: 20, fat: 4,
    },
  },

  maintain_veg: {
    breakfast: {
      name: 'Masala Oats',
      emoji: '🥣',
      description: '1 cup oats, veggies, spices + glass of milk',
      calories: 400, protein: 16, carbs: 60, fat: 8,
    },
    lunch: {
      name: 'Rajma Rice',
      emoji: '🍛',
      description: 'Kidney bean curry, 1 cup rice, salad, curd',
      calories: 520, protein: 22, carbs: 80, fat: 8,
    },
    dinner: {
      name: 'Paneer Bhurji & Chapati',
      emoji: '🫓',
      description: '150g paneer scrambled with onions & spices, 2 chapatis',
      calories: 480, protein: 28, carbs: 46, fat: 18,
    },
    snack: {
      name: 'Fruit Chaat',
      emoji: '🍉',
      description: 'Seasonal fruit mix with chaat masala & lemon',
      calories: 150, protein: 2, carbs: 36, fat: 1,
    },
  },

  maintain_vegan: {
    breakfast: {
      name: 'Smoothie Bowl',
      emoji: '🍓',
      description: 'Acai, frozen berries, banana, granola, chia seeds, almond milk',
      calories: 420, protein: 12, carbs: 70, fat: 10,
    },
    lunch: {
      name: 'Falafel Wrap',
      emoji: '🧆',
      description: '4 falafels, hummus, tabbouleh, pita bread',
      calories: 520, protein: 18, carbs: 72, fat: 14,
    },
    dinner: {
      name: 'Veggie Stir-Fry & Tofu on Rice',
      emoji: '🍜',
      description: '150g tofu, mixed veggies, soy-ginger sauce, jasmine rice',
      calories: 480, protein: 24, carbs: 68, fat: 10,
    },
    snack: {
      name: 'Hummus & Veggie Sticks',
      emoji: '🥕',
      description: '3 tbsp hummus, carrot sticks, cucumber, bell pepper',
      calories: 180, protein: 8, carbs: 22, fat: 8,
    },
  },

  maintain_keto: {
    breakfast: {
      name: 'Avocado Egg Cups',
      emoji: '🥑',
      description: '2 avocado halves baked with eggs, topped with salsa',
      calories: 380, protein: 18, carbs: 6, fat: 32,
    },
    lunch: {
      name: 'Keto Burger (lettuce wrap)',
      emoji: '🥬',
      description: '150g beef patty, cheese, bacon, avocado, lettuce wrap',
      calories: 540, protein: 44, carbs: 8, fat: 38,
    },
    dinner: {
      name: 'Lemon Herb Chicken Thighs',
      emoji: '🍗',
      description: 'Skin-on chicken thighs, roasted zucchini, cream sauce',
      calories: 580, protein: 46, carbs: 6, fat: 42,
    },
    snack: {
      name: 'Keto Fat Bombs',
      emoji: '🍫',
      description: '2 dark chocolate peanut butter fat bombs',
      calories: 200, protein: 4, carbs: 4, fat: 18,
    },
  },
};

/**
 * Get meal plan for goal + diet preference
 * Falls back to nonveg if combo not found
 */
export function getMealPlan(goal = 'maintain', dietPref = 'nonveg') {
  const key = `${goal}_${dietPref}`;
  return plans[key] || plans[`${goal}_nonveg`] || plans['maintain_nonveg'];
}

export default plans;
