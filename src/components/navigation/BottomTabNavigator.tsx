import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { MainTabScreen } from '../../types/navigation';

interface BottomTabNavigatorProps {
  activeTab: MainTabScreen;
  onTabPress: (tab: MainTabScreen) => void;
}

const tabs: Array<{
  key: MainTabScreen;
  title: string;
  icon: string;
  iconFamily: 'MaterialIcons' | 'Ionicons';
}> = [
  { key: 'dashboard', title: 'Dashboard', icon: 'dashboard', iconFamily: 'MaterialIcons' },
  { key: 'log', title: 'Log Action', icon: 'add-circle', iconFamily: 'Ionicons' },
  { key: 'trips', title: 'Trips', icon: 'map', iconFamily: 'Ionicons' },
  { key: 'profile', title: 'Profile', icon: 'person', iconFamily: 'Ionicons' },
];

export const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({
  activeTab,
  onTabPress,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets.bottom);

  const renderIcon = (iconFamily: string, iconName: string, isActive: boolean) => {
    const color = isActive ? colors.primary : colors.textSecondary;
    const size = isActive ? 26 : 24;

    switch (iconFamily) {
      case 'MaterialIcons':
        return <MaterialIcons name={iconName as any} size={size} color={color} />;
      case 'Ionicons':
        return <Ionicons name={iconName as any} size={size} color={color} />;
      default:
        return <MaterialIcons name="help" size={size} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onTabPress(tab.key)}
            >
              {renderIcon(tab.iconFamily, tab.icon, isActive)}
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (colors: any, bottomInset: number) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingBottom: Math.max(bottomInset, 16),
  },
  tabContainer: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  tabText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
});