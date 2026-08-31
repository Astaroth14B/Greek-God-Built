import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAppStore from '../store/useAppStore';

// Onboarding screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import OnboardingPager from '../screens/onboarding/OnboardingPager';

// Main swipeable tab navigator
import MainSwipeNavigator from './MainSwipeNavigator';

// Stack sub-screens
import FoodCameraScreen from '../screens/FoodCameraScreen';
import FoodResultScreen from '../screens/FoodResultScreen';
import WorkoutCameraScreen from '../screens/WorkoutCameraScreen';
import WorkoutSummaryScreen from '../screens/WorkoutSummaryScreen';
import BookingScreen from '../screens/BookingScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';

const Stack = createNativeStackNavigator();

// ─── Onboarding Stack ────────────────────────────────────────────────────────
function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="OnboardingPager" component={OnboardingPager} />
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
          <>
            <Stack.Screen name="Main" component={MainSwipeNavigator} />
            {/* Tab navigation aliases so child screens can navigate directly */}
            <Stack.Screen name="HomeTab" component={MainSwipeNavigator} initialParams={{ initialTab: 0 }} />
            <Stack.Screen name="LogTab" component={MainSwipeNavigator} initialParams={{ initialTab: 1 }} />
            <Stack.Screen name="WorkoutTab" component={MainSwipeNavigator} initialParams={{ initialTab: 2 }} />
            <Stack.Screen name="DietTab" component={MainSwipeNavigator} initialParams={{ initialTab: 3 }} />
            <Stack.Screen name="ProsTab" component={MainSwipeNavigator} initialParams={{ initialTab: 4 }} />

            <Stack.Screen
              name="FoodCamera"
              component={FoodCameraScreen}
              options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
              name="FoodResult"
              component={FoodResultScreen}
              options={{ presentation: 'card' }}
            />
            <Stack.Screen
              name="WorkoutCamera"
              component={WorkoutCameraScreen}
              options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
              name="WorkoutSummary"
              component={WorkoutSummaryScreen}
              options={{ presentation: 'card' }}
            />
            <Stack.Screen
              name="Booking"
              component={BookingScreen}
              options={{ presentation: 'card' }}
            />
            <Stack.Screen
              name="Confirmation"
              component={ConfirmationScreen}
              options={{ presentation: 'card' }}
            />
          </>
        ) : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

