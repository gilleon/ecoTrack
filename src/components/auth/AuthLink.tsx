import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
  disabled?: boolean;
}

export const AuthLink: React.FC<AuthLinkProps> = ({
  text,
  linkText,
  onPress,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <Pressable onPress={onPress} disabled={disabled}>
        <Text style={[styles.link, disabled && styles.linkDisabled]}>
          {linkText}
        </Text>
      </Pressable>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  linkDisabled: {
    opacity: 0.6,
  },
});