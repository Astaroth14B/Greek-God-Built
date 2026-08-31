// Static meal plans keyed by `${goal}_${dietPref}`
// Structured nutrition breakdown for Project Zeus

const plans = {
  // ─── BULK ───────────────────────────────────────────────────────────────
  bulk_nonveg: {
    breakfast: {
      name: 'Organic Scrambled Eggs & Rolled Oats',
      description: '4 pasture-raised eggs, 1 cup rolled oats with pure honey & sliced banana',
      calories: 620, protein: 38, carbs: 72, fat: 18,
    },
    lunch: {
      name: 'Flame Grilled Chicken & Jasmine Rice',
      description: '200g herb chicken breast, 1.5 cups steamed jasmine rice, steamed greens',
      calories: 680, protein: 58, carbs: 74, fat: 12,
    },
    dinner: {
      name: 'Grass-Fed Lean Beef Stir-Fry',
      description: '150g lean tenderloin beef, soba noodles, charred broccoli, tamari glaze',
      calories: 590, protein: 42, carbs: 56, fat: 16,
    },
    snack: {
      name: 'Whey Isolate & Natural Almond Butter Toast',
      description: '1 scoop grass-fed whey, 2 slices sprouted grain toast, 2 tbsp almond butter',
      calories: 440, protein: 32, carbs: 38, fat: 14,
    },
  },

  bulk_veg: {
    breakfast: {
      name: 'Artisan Paneer Flatbread & Cultured Lassi',
      description: '2 fresh cottage cheese flatbreads, glass of organic probiotic lassi',
      calories: 580, protein: 26, carbs: 68, fat: 20,
    },
    lunch: {
      name: 'Slow-Cooked Black Lentils & Basmati',
      description: 'Protein-rich simmered black lentils, 1.5 cups aged basmati rice, crisp greens',
      calories: 640, protein: 24, carbs: 96, fat: 14,
    },
    dinner: {
      name: 'Spiced Organic Tofu & Ancient Grain Rotis',
      description: '200g pressed tofu in spiced tomato reduction, 2 stoneground rotis',
      calories: 560, protein: 30, carbs: 58, fat: 18,
    },
    snack: {
      name: 'Cold-Pressed Banana & Vanilla Protein',
      description: 'Ripe bananas, 1 scoop clean plant protein, fresh whole milk',
      calories: 380, protein: 28, carbs: 52, fat: 6,
    },
  },

  bulk_vegan: {
    breakfast: {
      name: 'Turmeric Tofu Scramble & Sprouted Toast',
      description: '150g firm tofu scramble, baby spinach, Haas avocado, artisan sourdough',
      calories: 520, protein: 28, carbs: 54, fat: 20,
    },
    lunch: {
      name: 'Ancient Quinoa & Green Lentil Power Bowl',
      description: '1 cup sprouted green lentils, 1 cup tri-color quinoa, roasted tahini dressing',
      calories: 620, protein: 32, carbs: 84, fat: 12,
    },
    dinner: {
      name: 'Organic Chickpea Coconut Curry',
      description: '1.5 cups simmered chickpeas, rich coconut reduction, steamed wild rice',
      calories: 580, protein: 22, carbs: 88, fat: 14,
    },
    snack: {
      name: 'Raw Trail Nuts & Pea Protein Shake',
      description: '40g raw walnut & pumpkin seed mix, clean yellow pea isolate, unsweetened almond milk',
      calories: 410, protein: 26, carbs: 42, fat: 14,
    },
  },

  bulk_keto: {
    breakfast: {
      name: 'Free-Range Eggs & Smoked Bacon Medley',
      description: '4 eggs any style, 4 strips uncured bacon, whole avocado, dark roast black coffee',
      calories: 640, protein: 38, carbs: 4, fat: 52,
    },
    lunch: {
      name: 'Crisp Chicken Thighs & Cauliflower Risotto',
      description: '200g roasted chicken thighs, garlic herb cauliflower rice, aged cheddar',
      calories: 680, protein: 50, carbs: 8, fat: 48,
    },
    dinner: {
      name: 'Pan-Seared Prime Ribeye & Asparagus',
      description: '200g grass-fed ribeye steak, butter-basted asparagus spears, roasted sea salt',
      calories: 720, protein: 54, carbs: 6, fat: 52,
    },
    snack: {
      name: 'Aged Cheddar & Roasted Macadamias',
      description: '50g sharp vintage cheddar, artisanal dry cured slices, whole macadamia nuts',
      calories: 420, protein: 22, carbs: 2, fat: 36,
    },
  },

  // ─── CUT ────────────────────────────────────────────────────────────────
  cut_nonveg: {
    breakfast: {
      name: 'Whipped Egg White & Spinach Scramble',
      description: '5 pasture egg whites, baby spinach, cremini mushrooms, 1 slice sprouted rye',
      calories: 240, protein: 32, carbs: 18, fat: 4,
    },
    lunch: {
      name: 'Wild Albacore Tuna & Crisp Greens Wrap',
      description: 'Flaked albacore tuna, crisp romaine, Dijon mustard, high-fiber flax wrap',
      calories: 320, protein: 38, carbs: 28, fat: 6,
    },
    dinner: {
      name: 'Herb Baked Atlantic Salmon & Zucchini',
      description: '150g wild salmon fillet, charred zucchini medallions, steamed broccoli florets',
      calories: 340, protein: 38, carbs: 12, fat: 14,
    },
    snack: {
      name: 'Pure Greek Strained Yogurt & Forest Berries',
      description: '170g unflavored 0% Greek yogurt, 100g wild antioxidant blueberries',
      calories: 160, protein: 18, carbs: 18, fat: 1,
    },
  },

  cut_veg: {
    breakfast: {
      name: 'Spiced Yellow Lentil Crepes',
      description: '3 golden moong dal crepes, fresh mint and coriander chutney',
      calories: 260, protein: 18, carbs: 36, fat: 4,
    },
    lunch: {
      name: 'Live Sprout & Cucumber Crunch Bowl',
      description: 'Sprouted mung beans, English cucumber, vine tomatoes, freshly squeezed lemon',
      calories: 220, protein: 14, carbs: 32, fat: 2,
    },
    dinner: {
      name: 'Charred Tofu in Pureed Spinach Gravy',
      description: '150g grilled tofu cubes, slow-simmered palak reduction, 2 whole wheat rotis',
      calories: 360, protein: 24, carbs: 44, fat: 8,
    },
    snack: {
      name: 'Cultured Curd & Roasted Cumin Dip',
      description: '150ml low-fat cultured yogurt with crisp sliced Persian cucumbers and roasted cumin',
      calories: 90, protein: 8, carbs: 10, fat: 1,
    },
  },

  cut_vegan: {
    breakfast: {
      name: 'Vanilla Chia Seed & Berry Parfait',
      description: '3 tbsp soaked chia seeds, cold unsweetened almond milk, crushed raspberries',
      calories: 220, protein: 8, carbs: 26, fat: 9,
    },
    lunch: {
      name: 'Steamed Edamame & Roasted Chickpea Bowl',
      description: 'Steamed edamame, organic quinoa, roasted chickpeas, massaged kale, tahini drizzle',
      calories: 380, protein: 20, carbs: 50, fat: 10,
    },
    dinner: {
      name: 'Spiralized Zucchini & Lentil Bolognese',
      description: 'Fresh zucchini ribbons, slow cooked San Marzano tomato & lentil sauce',
      calories: 290, protein: 16, carbs: 38, fat: 6,
    },
    snack: {
      name: 'Crisp Green Apple & Raw Almond Butter',
      description: '1 crisp Granny Smith apple slices, 1 tbsp organic raw almond butter',
      calories: 180, protein: 4, carbs: 26, fat: 8,
    },
  },

  cut_keto: {
    breakfast: {
      name: 'Baked Herb & Provolone Egg Bites',
      description: '4 pasture egg bites baked with provolone cheese and roasted bell peppers',
      calories: 280, protein: 24, carbs: 2, fat: 20,
    },
    lunch: {
      name: 'Classic Cobb Greens & Avocado Medley',
      description: 'Crisp romaine, grilled chicken breast, hard-boiled egg, avocado, crumbled blue cheese',
      calories: 420, protein: 38, carbs: 6, fat: 28,
    },
    dinner: {
      name: 'Pan-Roasted Cod with Whipped Cauliflower',
      description: '200g wild Pacific cod, velvet whipped cauliflower mash, tender green beans',
      calories: 360, protein: 42, carbs: 8, fat: 16,
    },
    snack: {
      name: 'Crisp Celery & French Herb Cream Cheese',
      description: '4 fresh celery stalks, 2 tbsp cultured herb cream cheese',
      calories: 120, protein: 4, carbs: 3, fat: 10,
    },
  },

  // ─── MAINTAIN ───────────────────────────────────────────────────────────
  maintain_nonveg: {
    breakfast: {
      name: 'Pasture Eggs, Sourdough & Fresh Citrus',
      description: '3 eggs prepared your way, 2 slices toasted sourdough, fresh sliced orange',
      calories: 440, protein: 28, carbs: 44, fat: 14,
    },
    lunch: {
      name: 'Roast Turkey Breast & Garden Herb Salad',
      description: 'Thin sliced lean roast turkey, sliced avocado, mixed field greens, vinaigrette',
      calories: 480, protein: 36, carbs: 38, fat: 18,
    },
    dinner: {
      name: 'Grilled Chicken & Whole Grain Penne',
      description: '150g grilled chicken tenders, whole grain penne, rustic tomato basil sauce, parmesan',
      calories: 560, protein: 42, carbs: 62, fat: 12,
    },
    snack: {
      name: 'Artisan Cottage Cheese & Ripe Peaches',
      description: '150g cultured cottage cheese, fresh seasonal sliced peaches, cracked black pepper',
      calories: 200, protein: 18, carbs: 20, fat: 4,
    },
  },

  maintain_veg: {
    breakfast: {
      name: 'Golden Spiced Rolled Oats & Farm Milk',
      description: '1 cup whole oats cooked with aromatic spices, diced carrots, glass of fresh milk',
      calories: 400, protein: 16, carbs: 60, fat: 8,
    },
    lunch: {
      name: 'Red Kidney Bean Stew & Steamed Basmati',
      description: 'Slow-simmered Punjabi rajma curry, 1 cup fragrant basmati rice, shredded cucumber salad',
      calories: 520, protein: 22, carbs: 80, fat: 8,
    },
    dinner: {
      name: 'Crumbled Cottage Cheese & Stoneground Rotis',
      description: '150g paneer tossed with sauteed onions and coriander, 2 fresh stoneground rotis',
      calories: 480, protein: 28, carbs: 46, fat: 18,
    },
    snack: {
      name: 'Chilled Citrus & Pomegranate Fruit Medley',
      description: 'Seasonal fruit bowl tossed with freshly roasted rock salt and lime juice',
      calories: 150, protein: 2, carbs: 36, fat: 1,
    },
  },

  maintain_vegan: {
    breakfast: {
      name: 'Antioxidant Acai & Sprouted Granola Bowl',
      description: 'Pure acai puree, frozen dark cherries, banana, sprouted buckwheat granola, hemp seeds',
      calories: 420, protein: 12, carbs: 70, fat: 10,
    },
    lunch: {
      name: 'Crisp Herb Falafel & Velvet Hummus Wrap',
      description: '4 baked herb falafel patties, organic garlic hummus, tabbouleh salad, warm whole pita',
      calories: 520, protein: 18, carbs: 72, fat: 14,
    },
    dinner: {
      name: 'Marinated Organic Tofu & Steamed Jasmine',
      description: '150g pan-crisped tofu, ginger tamari glaze, wok-tossed bok choy, jasmine rice',
      calories: 480, protein: 24, carbs: 68, fat: 10,
    },
    snack: {
      name: 'Stoneground Hummus & Garden Crudites',
      description: '3 tbsp olive oil hummus, rainbow carrot batons, sliced cucumber, sweet pepper rings',
      calories: 180, protein: 8, carbs: 22, fat: 8,
    },
  },

  maintain_keto: {
    breakfast: {
      name: 'Baked Avocado Egg Boats with Pico',
      description: '2 ripe avocado halves baked with free-range egg centers, cilantro lime salsa',
      calories: 380, protein: 18, carbs: 6, fat: 32,
    },
    lunch: {
      name: 'Angus Beef Lettuce Wrap with Aged Gouda',
      description: '150g grass-fed beef patty, smoked bacon, aged gouda, butter lettuce wrap',
      calories: 540, protein: 44, carbs: 8, fat: 38,
    },
    dinner: {
      name: 'Cast-Iron Chicken Thighs & Herb Butter',
      description: 'Crispy skin chicken thighs, roasted zucchini rounds, rosemary garlic butter sauce',
      calories: 580, protein: 46, carbs: 6, fat: 42,
    },
    snack: {
      name: '90% Dark Cocoa & Roasted Walnut Bites',
      description: '2 artisan dark cocoa fat bites crafted with virgin coconut oil and walnut butter',
      calories: 200, protein: 4, carbs: 4, fat: 18,
    },
  },
};

export function getMealPlan(goal = 'maintain', dietPref = 'nonveg') {
  const key = `${goal}_${dietPref}`;
  return plans[key] || plans[`${goal}_nonveg`] || plans['maintain_nonveg'];
}

export default plans;
