import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { S } from '../theme/styles';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  goldBorder?: boolean;
  onPress?: () => void;
  padding?: number;
}

export function AlbabCard({ children, style, goldBorder = false, onPress, padding = 16 }: Props) {
  const { accentColor, accentBorder } = useTheme();

  const content = (
    <View style={[
      S.card,
      goldBorder && {
        borderColor:   accentBorder,
        shadowColor:   accentColor,
        shadowOpacity: 0.12,
        shadowRadius:  14,
        shadowOffset:  { width: 0, height: 0 },
        elevation:     4,
      },
      { padding },
      style,
    ]}>
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
