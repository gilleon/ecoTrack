import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useUnits, WeightUnit } from '../../contexts/UnitsContext';

interface UnitOption {
  value: WeightUnit;
  label: string;
  description: string;
}

const unitOptions: UnitOption[] = [
  { value: 'lb', label: 'Pounds (lb)', description: 'Imperial weight measurement' },
  { value: 'kg', label: 'Kilograms (kg)', description: 'Metric weight measurement' },
];

export const UnitSelector: React.FC = () => {
  const { colors } = useTheme();
  const { weightUnit, setWeightUnit } = useUnits();
  const styles = createStyles(colors);

  return (
    <View>
      {unitOptions.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.option,
            weightUnit === option.value && styles.selectedOption,
          ]}
          onPress={() => setWeightUnit(option.value)}
        >
          <View style={styles.optionContent}>
            <Text style={[
              styles.optionLabel,
              weightUnit === option.value && styles.selectedOptionLabel,
            ]}>
              {option.label}
            </Text>
            <Text style={[
              styles.optionDescription,
              weightUnit === option.value && styles.selectedOptionDescription,
            ]}>
              {option.description}
            </Text>
          </View>
          <View style={[
            styles.radioButton,
            weightUnit === option.value && styles.selectedRadioButton,
          ]}>
            {weightUnit === option.value && (
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