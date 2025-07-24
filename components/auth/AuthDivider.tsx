import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export const AuthDivider: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.divider}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>OR</Text>
      <View style={styles.dividerLine} />
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
});