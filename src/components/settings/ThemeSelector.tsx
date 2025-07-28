import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme, ThemeMode } from '../../contexts/ThemeContext';

interface ThemeOption {
  value: ThemeMode;
  label: string;
  description: string;
}

const themeOptions: ThemeOption[] = [
  { value: 'light', label: 'Light', description: 'Always use light theme' },
  { value: 'dark', label: 'Dark', description: 'Always use dark theme' },
];

export const ThemeSelector: React.FC = () => {
  const { themeMode, colors, setThemeMode } = useTheme();
  const styles = createStyles(colors);

  return (
    <View>
      {themeOptions.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.option,
            themeMode === option.value && styles.selectedOption,
          ]}
          onPress={() => setThemeMode(option.value)}
        >
          <View style={styles.optionContent}>
            <Text style={[
              styles.optionLabel,
              themeMode === option.value && styles.selectedOptionLabel,
            ]}>
              {option.label}
            </Text>
            <Text style={[
              styles.optionDescription,
              themeMode === option.value && styles.selectedOptionDescription,
            ]}>
              {option.description}
            </Text>
          </View>
          <View style={[
            styles.radioButton,
            themeMode === option.value && styles.selectedRadioButton,
          ]}>
            {themeMode === option.value && (
              <View style={styles.radioButtonInner} />
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  selectedOptionLabel: {
    color: colors.primary,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedOptionDescription: {
    color: colors.primary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});