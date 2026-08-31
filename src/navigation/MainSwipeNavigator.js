import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';

// Main tab screens
import HomeScreen from '../screens/HomeScreen';
import LogScreen from '../screens/LogScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import DietScreen from '../screens/DietScreen';
import ProsScreen from '../screens/ProsScreen';

const { width } = Dimensions.get('window');

const TABS = [
  { id: 'HomeTab', name: 'Overview', icon: 'home', iconOutline: 'home-outline', Component: HomeScreen },
  { id: 'LogTab', name: 'Food Log', icon: 'camera', iconOutline: 'camera-outline', Component: LogScreen },
  { id: 'WorkoutTab', name: 'Workouts', icon: 'barbell', iconOutline: 'barbell-outline', Component: WorkoutScreen },
  { id: 'DietTab', name: 'Nutrition', icon: 'restaurant', iconOutline: 'restaurant-outline', Component: DietScreen },
  { id: 'ProsTab', name: 'Coaches', icon: 'people', iconOutline: 'people-outline', Component: ProsScreen },
];

export default function MainSwipeNavigator({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  // Initial tab support (from route params if passed)
  const initialIndex = route.params?.initialTab ?? route.params?.tabIndex ?? 0;
  const [activeTab, setActiveTab] = useState(initialIndex);

  // Handle route param updates when navigating back to a specific tab
  useEffect(() => {
    if (route.params?.initialTab !== undefined && route.params.initialTab !== activeTab) {
      const idx = route.params.initialTab;
      setActiveTab(idx);
      flatListRef.current?.scrollToIndex({ index: idx, animated: true });
    } else if (route.params?.screen) {
      const idx = TABS.findIndex((t) => t.id === route.params.screen);
      if (idx !== -1 && idx !== activeTab) {
        setActiveTab(idx);
        flatListRef.current?.scrollToIndex({ index: idx, animated: true });
      }
    }
  }, [route.params]);

  const goToTab = useCallback((index) => {
    if (index >= 0 && index < TABS.length) {
      setActiveTab(index);
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  }, []);

  const handleMomentumScrollEnd = useCallback((e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    if (newIndex >= 0 && newIndex < TABS.length && newIndex !== activeTab) {
      setActiveTab(newIndex);
    }
  }, [activeTab]);

  // Screen navigation bridge: if child screen calls navigation.navigate('WorkoutTab'), it switches tab
  const screenNav = {
    ...navigation,
    navigate: (screenName, params) => {
      const tabIdx = TABS.findIndex((t) => t.id === screenName);
      if (tabIdx !== -1) {
        goToTab(tabIdx);
      } else {
        navigation.navigate(screenName, params);
      }
    },
  };

  // Safe bottom padding ensures bottom bar sits ABOVE Android 3-button navigation bar (and iPhone home indicator)
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 24 : 16);

  return (
    <View style={styles.container}>
      {/* Horizontal Screen Pager */}
      <FlatList
        ref={flatListRef}
        data={TABS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        keyboardShouldPersistTaps="handled"
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item }) => {
          const ScreenComponent = item.Component;
          return (
            <View style={{ width, flex: 1 }}>
              <ScreenComponent navigation={screenNav} />
            </View>
          );
        }}
      />

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomBar, { paddingBottom: bottomPadding }]}>
        {TABS.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => goToTab(idx)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.icon : tab.iconOutline}
                size={22}
                color={isActive ? Colors.gold : Colors.textMuted}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  bottomBar: {
    backgroundColor: Colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    marginTop: 3,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  tabLabelActive: {
    color: Colors.gold,
  },
});
