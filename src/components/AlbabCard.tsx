import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  goldBorder?: boolean;
  onPress?: () => void;
  padding?: number;
}

export function AlbabCard({ children, style, goldBorder = false, onPress, padding = 16 }: Props) {
  const content = (
    <View style={[styles.card, goldBorder && styles.goldBorder, { padding }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  goldBorder: {
    borderColor: Colors.borderGold,
    shadowColor: Colors.gold,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
