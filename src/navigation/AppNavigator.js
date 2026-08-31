import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';
import useAppStore from '../store/useAppStore';

// Onboarding screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import PersonalInfoScreen from '../screens/onboarding/PersonalInfoScreen';
import GoalScreen from '../screens/onboarding/GoalScreen';
import SummaryScreen from '../screens/onboarding/SummaryScreen';

// Main tab screens
import HomeScreen from '../screens/HomeScreen';
import LogScreen from '../screens/LogScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import DietScreen from '../screens/DietScreen';
import ProsScreen from '../screens/ProsScreen';

// Stack sub-screens
import FoodCameraScreen from '../screens/FoodCameraScreen';
import FoodResultScreen from '../screens/FoodResultScreen';
import WorkoutCameraScreen from '../screens/WorkoutCameraScreen';
import WorkoutSummaryScreen from '../screens/WorkoutSummaryScreen';
import BookingScreen from '../screens/BookingScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Bottom Tab Navigator ────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            HomeTab: focused ? 'home' : 'home-outline',
            LogTab: focused ? 'camera' : 'camera-outline',
            WorkoutTab: focused ? 'barbell' : 'barbell-outline',
            DietTab: focused ? 'restaurant' : 'restaurant-outline',
            ProsTab: focused ? 'people' : 'people-outline',
          };
          return <Ionicons name={icons[route.name] || 'home-outline'} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Overview' }} />
      <Tab.Screen name="LogTab" component={LogScreen} options={{ tabBarLabel: 'Food Log' }} />
      <Tab.Screen name="WorkoutTab" component={WorkoutScreen} options={{ tabBarLabel: 'Workouts' }} />
      <Tab.Screen name="DietTab" component={DietScreen} options={{ tabBarLabel: 'Nutrition' }} />
      <Tab.Screen name="ProsTab" component={ProsScreen} options={{ tabBarLabel: 'Coaches' }} />
    </Tab.Navigator>
  );
}

// ─── Onboarding Stack ────────────────────────────────────────────────────────
function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="Goal" component={GoalScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
    </Stack.Navigator>
  );
}

// ─── Root App Navigator ──────────────────────────────────────────────────────
function AppNavigator() {
  const { hasCompletedOnboarding } = useAppStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : null}

        {hasCompletedOnboarding ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : null}
        {hasCompletedOnboarding ? (
          <Stack.Screen
            name="FoodCamera"
            component={FoodCameraScreen}
            options={{ presentation: 'fullScreenModal' }}
          />
        ) : null}
        {hasCompletedOnboarding ? (
          <Stack.Screen
            name="FoodResult"
            component={FoodResultScreen}
            options={{ presentation: 'card' }}
          />
        ) : null}
        {hasCompletedOnboarding ? (
          <Stack.Screen
            name="WorkoutCamera"
            component={WorkoutCameraScreen}
            options={{ presentation: 'fullScreenModal' }}
          />
        ) : null}
        {hasCompletedOnboarding ? (
          <Stack.Screen
            name="WorkoutSummary"
            component={WorkoutSummaryScreen}
            options={{ presentation: 'card' }}
          />
        ) : null}
        {hasCompletedOnboarding ? (
          <Stack.Screen
            name="Booking"
            component={BookingScreen}
            options={{ presentation: 'card' }}
          />
        ) : null}
        {hasCompletedOnboarding ? (
          <Stack.Screen
            name="Confirmation"
            component={ConfirmationScreen}
            options={{ presentation: 'card' }}
          />
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.18)',
    height: 72,
    paddingBottom: 12,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});

export default AppNavigator;
