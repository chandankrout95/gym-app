export interface DietPlan {
  id: string;
  name: string;
  category: 'muscle_building' | 'weight_loss' | 'lean_muscle' | 'maintenance' | 'general_fitness';
  targetCalories: number;
  macros: {
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
  };
  durationWeeks: number;
  dietaryType: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian';
  description: string;
  authorName: string;
  authorTitle: string;
  rating: number;
  reviewCount: number;
  priceInr: number; // 0 for included in Pro, >0 for paid marketplace plans
  isMarketplacePaid: boolean;
  dailySchedule: {
    mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
    timeSuggestion: string;
    description: string;
    approxCalories: number;
    proteinG: number;
    recommendedFoods: string[];
  }[];
  groceryItems: string[];
}

export const EVIDENCE_INFORMED_DIET_PLANS: DietPlan[] = [
  {
    id: 'plan_indian_hypertrophy_2400',
    name: 'Indian High-Protein Muscle Builder',
    category: 'muscle_building',
    targetCalories: 2400,
    macros: { proteinG: 180, carbsG: 260, fatG: 70, fiberG: 32 },
    durationWeeks: 12,
    dietaryType: 'non_vegetarian',
    description:
      'Scientifically calibrated hypertrophy meal blueprint utilizing Indian pantry staples (Eggs, Chicken Tikka, Paneer, Dahi, Brown Basmati). Formulated to hit 2.0g protein/kg bodyweight without bloating.',
    authorName: 'Dr. Rohan Mehra, Ph.D.',
    authorTitle: 'Sports Nutritionist & CSCS',
    rating: 4.9,
    reviewCount: 384,
    priceInr: 0, // Free on Pro
    isMarketplacePaid: false,
    dailySchedule: [
      {
        mealType: 'breakfast',
        timeSuggestion: '8:00 AM',
        description: '3 Whole Boiled Eggs + 2 Egg Whites + 2 Whole Wheat Rotis or Rolled Oats',
        approxCalories: 480,
        proteinG: 34,
        recommendedFoods: ['Whole Boiled Egg', 'Egg Whites', 'Whole Wheat Phulka / Roti', 'Rolled Oats'],
      },
      {
        mealType: 'lunch',
        timeSuggestion: '1:00 PM',
        description: '150g Grilled Chicken Breast / Tandoori Tikka + 1 cup Brown Rice + 1 bowl Dal Tadka + Cucumber Salad',
        approxCalories: 680,
        proteinG: 55,
        recommendedFoods: ['Grilled Chicken Breast', 'Steamed Brown Basmati Rice', 'Yellow Moong Dal Tadka'],
      },
      {
        mealType: 'snack',
        timeSuggestion: '5:00 PM (Pre-Workout)',
        description: '1 scoop Whey Isolate + 1 Banana + 20g California Almonds',
        approxCalories: 340,
        proteinG: 30,
        recommendedFoods: ['100% Whey Protein Isolate', 'Raw California Almonds'],
      },
      {
        mealType: 'dinner',
        timeSuggestion: '8:30 PM',
        description: '100g Lightly Sautéed Paneer or Fish + 2 Whole Wheat Rotis + Green Veggie Sabzi + Curd',
        approxCalories: 580,
        proteinG: 38,
        recommendedFoods: ['Raw Cottage Cheese (Paneer)', 'Whole Wheat Phulka / Roti', 'Low Fat Dahi (Curd)'],
      },
    ],
    groceryItems: [
      'Farm Fresh Eggs (30 count)',
      'Boneless Chicken Breast (2 kg)',
      'Fresh Low-Fat Paneer (1 kg)',
      'Brown Basmati Rice (2 kg)',
      'Rolled Oats (1 kg)',
      'Moong Dal (1 kg)',
      'California Almonds (500g)',
      '100% Whey Protein Isolate (1 tub)',
      'Low Fat Dahi / Curd (1 kg)',
      'Fresh Green Vegetables & Cucumbers',
    ],
  },
  {
    id: 'plan_vegetarian_lean_shred_1800',
    name: '100% Vegetarian Lean Shred & Fat Loss',
    category: 'weight_loss',
    targetCalories: 1800,
    macros: { proteinG: 145, carbsG: 165, fatG: 50, fiberG: 35 },
    durationWeeks: 8,
    dietaryType: 'vegetarian',
    description:
      'A safe, nutrient-dense caloric deficit designed for fat loss while preserving lean skeletal muscle. Maximizes satiety through high-volume lentils, soya chunks, Greek yogurt, sprouts, and paneer.',
    authorName: 'Priya Sharma, RD',
    authorTitle: 'Clinical Dietitian & Lifestyle Coach',
    rating: 4.8,
    reviewCount: 512,
    priceInr: 999, // Paid marketplace plan
    isMarketplacePaid: true,
    dailySchedule: [
      {
        mealType: 'breakfast',
        timeSuggestion: '8:30 AM',
        description: 'Moong Sprouts Chaat (1 bowl) + 1 cup Low Fat Dahi + 1 Scoop Whey',
        approxCalories: 380,
        proteinG: 38,
        recommendedFoods: ['Moong & Kala Chana Sprouts Salad', 'Low Fat Dahi (Curd)', '100% Whey Protein Isolate'],
      },
      {
        mealType: 'lunch',
        timeSuggestion: '1:30 PM',
        description: '50g Nutrela Soya Chunks Curry + 1 cup Brown Rice + Large Green Salad',
        approxCalories: 520,
        proteinG: 36,
        recommendedFoods: ['Nutrela Soya Chunks (Dry)', 'Steamed Brown Basmati Rice'],
      },
      {
        mealType: 'snack',
        timeSuggestion: '5:30 PM',
        description: 'Roasted Makhana (Foxnuts) + Green Tea + 15g Almonds',
        approxCalories: 220,
        proteinG: 9,
        recommendedFoods: ['Raw California Almonds'],
      },
      {
        mealType: 'dinner',
        timeSuggestion: '8:30 PM',
        description: '100g Grilled Paneer + Steamed Broccoli / Mixed Sabzi + 1 Whole Wheat Roti',
        approxCalories: 460,
        proteinG: 28,
        recommendedFoods: ['Raw Cottage Cheese (Paneer)', 'Whole Wheat Phulka / Roti'],
      },
    ],
    groceryItems: [
      'Moong Dal & Kala Chana (for sprouting)',
      'Nutrela Soya Chunks (1 kg)',
      'Low Fat Fresh Paneer (1 kg)',
      'Greek Yogurt / Epigamia Curd',
      'Whole Wheat Atta (2 kg)',
      'Makhana / Foxnuts (500g)',
      'Broccoli, Spinach, Capsicum & Cucumbers',
    ],
  },
  {
    id: 'plan_keto_recomposition_2100',
    name: 'Advanced Clean Keto & Recomposition',
    category: 'lean_muscle',
    targetCalories: 2100,
    macros: { proteinG: 160, carbsG: 40, fatG: 140, fiberG: 25 },
    durationWeeks: 6,
    dietaryType: 'non_vegetarian',
    description:
      'Low-carb ketogenic metabolic optimization protocol. Emphasizes healthy mono-unsaturated fats, wild-caught fish, whole eggs, avocados, and fibrous cruciferous vegetables.',
    authorName: 'Marcus Cole, MSc',
    authorTitle: 'Biochemist & Ketogenic Specialist',
    rating: 4.9,
    reviewCount: 220,
    priceInr: 1499,
    isMarketplacePaid: true,
    dailySchedule: [
      {
        mealType: 'breakfast',
        timeSuggestion: '9:00 AM',
        description: '3 Eggs Scrambled in Butter + Half Avocado + Baby Spinach',
        approxCalories: 450,
        proteinG: 24,
        recommendedFoods: ['Whole Boiled Egg'],
      },
      {
        mealType: 'lunch',
        timeSuggestion: '1:30 PM',
        description: '200g Grilled Salmon / Rohu Fish + Sautéed Zucchini & Olive Oil',
        approxCalories: 620,
        proteinG: 48,
        recommendedFoods: ['Bengali Rohu / Tilapia Fish Curry (Light)'],
      },
      {
        mealType: 'snack',
        timeSuggestion: '5:00 PM',
        description: '2 tbsp Peanut Butter + 30g Mixed Walnuts & Almonds',
        approxCalories: 380,
        proteinG: 14,
        recommendedFoods: ['All-Natural High Protein Peanut Butter', 'Raw California Almonds'],
      },
      {
        mealType: 'dinner',
        timeSuggestion: '8:30 PM',
        description: 'Grilled Chicken Breast with Herb Butter + Cauliflower Mash',
        approxCalories: 550,
        proteinG: 48,
        recommendedFoods: ['Skinless Grilled Chicken Breast'],
      },
    ],
    groceryItems: [
      'Fresh Eggs (2 dozen)',
      'Avocados & Olive Oil',
      'Skinless Chicken Breast & Fish Fillets',
      'Pure Natural Peanut Butter',
      'Cauliflower, Zucchini & Baby Spinach',
      'Raw Walnuts & Pecans',
    ],
  },
];
