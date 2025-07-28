import React from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingsSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const SettingsSwitch: React.FC<SettingsSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors, value, disabled);

  return (
    <Pressable
      style={styles.switch}
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
    >
      <View style={styles.thumb} />
    </Pressable>
  );
};

const createStyles = (colors: any, isOn: boolean, disabled: boolean) => StyleSheet.create({
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: isOn ? colors.primary : colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
    opacity: disabled ? 0.6 : 1,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: isOn ? 'flex-end' : 'flex-start',
  },
});