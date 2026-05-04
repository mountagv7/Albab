import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { S } from '../theme/styles';

interface Props {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

export function GoldButton({ label, onPress, loading = false, style }: Props) {
  const { accentColor, accentDark, buttonTextColor } = useTheme();

  // 8-digit hex: last two chars are alpha (E6 = 90%)
  const accentAt90 = accentColor + 'E6';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.wrapper, { shadowColor: accentColor }, style]}
    >
      <LinearGradient
        colors={[accentAt90, accentDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={buttonTextColor} size="small" />
        ) : (
          <Text style={[styles.label, { color: buttonTextColor }]}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    ...S.strongGlow,
  },
  gradient: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...S.btnLabel,
    letterSpacing: 0.2,
  },
});
