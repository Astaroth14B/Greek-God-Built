# ⚡ GREEK GOD BUILD 🔱

<p align="center">
  <img src="./assets/logo.png" alt="Greek God Build Logo" width="180" style="border-radius: 90px;"/>
</p>

<p align="center">
  <b>AI-Powered Cross-Platform Mobile Fitness App Prototype</b><br/>
  <i>Built with React Native, Expo, and Zustand</i>
</p>

---

## 🏛️ Overview

**Greek God Build** is a demo-ready mobile fitness application prototype engineered for pitch presentations and rapid iteration. Built on **Expo SDK 57**, the app works 100% reliably offline using client-side mock AI simulation for both meal calorie scanning and real-time workout form coaching.

---

## ⚡ Core Features & Screens

1. **🏛️ Mythic Onboarding & Olympian Assessment**
   - Collects personal vitals (Age, Sex, Height, Weight, Activity Level, Fitness Goal).
   - Computes Mifflin-St Jeor BMR, TDEE, BMI, and daily calorie + macro targets (Protein, Carbs, Fat).

2. **⚡ Olympus Dashboard**
   - Dynamic SVG calorie donut ring (consumed vs. target).
   - Macro nutrient progress indicators (Protein, Carbs, Healthy Fats).
   - Spartan step counter (with simulated sensor fallback).
   - Divine streak tracker with rank progression (Mortal ➔ Spartan ➔ Titan ➔ Olympian).

3. **📷 Ambrosia AI Vision Calorie Scanner (Mocked)**
   - Live camera viewfinder using `expo-camera`.
   - Simulated AI scan delay & instant nutrient estimation from local food lookup.
   - User editing & one-tap addition to daily fuel log.

4. **🏋️ Titan AI Workout & Pose Form Tracker (Mocked)**
   - Front-camera posture tracker with stick-figure skeleton overlay.
   - Real-time cadence rep/set counter.
   - Dynamic coach form tip toasts (e.g., *"Keep your back straight"*, *"Drive through heels"*).
   - End-of-session divine breakdown: Reps, Sets, Kcal burned, and Form Score.

5. **🥗 Olympian Feast Meal Plans**
   - Goal-filtered (Bulk / Cut / Maintain) and diet-filtered (Non-Veg, Veg, Vegan, Keto) meal plans.
   - Expandable meal cards with complete macro breakdowns.

6. **🩺 Olympus Council (Master Professionals Marketplace)**
   - Directory of certified trainers, dietitians, and sports doctors.
   - Slot booking flow, price summary, and instant booking confirmation.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device

### 2. Installation
```bash
cd greek-god-build
npm install
```

### 3. Run the App
```bash
npx expo start
```
- Scan the QR code in your terminal using the **Expo Go** camera on Android or iOS Camera app.
- Or press `a` for Android Emulator / `w` for Web preview.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Expo (SDK 57) / React Native
- **Navigation**: React Navigation v6 (Native Stack + Bottom Tabs)
- **State Management**: Zustand
- **Graphics**: `react-native-svg`
- **Sensors & Hardware**: `expo-camera`, `expo-sensors` (Pedometer)
- **Icons**: `@expo/vector-icons` (Ionicons & MaterialCommunityIcons)

---

## 📜 License
MIT License. Built for the Greek God Build Pitch Demo.
