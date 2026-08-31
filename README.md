# Project Zeus

<p align="center">
  <img src="./assets/logo.png" alt="Project Zeus Logo" width="180" style="border-radius: 90px;"/>
</p>

<p align="center">
  <b>AI-Powered Cross-Platform Mobile Fitness & Nutrition App Prototype</b><br/>
  <i>Built with React Native, Expo SDK 57, and Zustand</i>
</p>

---

## Overview

**Project Zeus** is a mobile fitness and nutrition application prototype engineered for intuitive fitness tracking and rapid iteration. Built on **Expo SDK 57**, the app works 100% reliably offline using client-side mock AI simulation for both meal calorie scanning and real-time workout form coaching with a minimalist **Black, White & Gold** aesthetic.

---

## Core Features & Screens

1. **Onboarding & Fitness Assessment**
   - Collects personal vitals (Age, Sex, Height, Weight, Activity Level, Fitness Goal).
   - Computes Mifflin-St Jeor BMR, TDEE, BMI, and daily calorie + macro targets (Protein, Carbs, Fat).

2. **Overview Dashboard**
   - Clean circular calorie progress ring (consumed vs. target).
   - Macro nutrient progress indicators (Protein, Carbs, Healthy Fats).
   - Daily step counter (with simulated sensor fallback).
   - Daily streak tracker and consistency milestones.

3. **AI Vision Calorie Scanner (Mocked)**
   - Live camera viewfinder using `expo-camera`.
   - Simulated computer vision portion & nutrition estimation.
   - User editing & one-tap addition to daily food log.

4. **AI Workout & Form Tracker (Mocked)**
   - Front-camera posture tracker with stick-figure skeleton overlay.
   - Real-time cadence rep/set counter.
   - Dynamic coach form tip toasts (e.g., *"Keep your back straight"*, *"Drive through heels"*).
   - Post-workout form score breakdown & focus points.

5. **Curated Nutrition & Meal Plans**
   - Personalized meal suggestions for Bulk, Cut, and Maintenance goals.
   - Dietary filter support: Standard, Vegetarian, Vegan, Keto.
   - Complete macro breakdowns for Breakfast, Lunch, Dinner, and Snacks.

6. **Verified Coaches Marketplace**
   - Browse certified trainers, nutritionists, and sports medicine doctors.
   - Filter by specialty, view ratings, reviews, and rates.
   - Interactive time-slot booking flow with instant confirmation.

---

## Quick Start

### Prerequisites
- Node.js (v18+)
- Expo CLI (`npm install -g expo-cli` or via `npx expo`)
- Expo Go app on iOS/Android (optional, for physical device testing)

### Installation & Run

```bash
# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

Press `a` for Android Emulator, `i` for iOS Simulator, or scan the QR code using the **Expo Go** app on your physical device.

---

## License

MIT License.
