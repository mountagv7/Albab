import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PaywallSheet } from './PaywallSheet';
import { Colors } from '../theme/colors';
import { S } from '../theme/styles';

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#000' : '#fff';
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onClaim: () => void;
  selectedColor: string;
}

export function ThemeSheet({ visible, onClose, onClaim, selectedColor }: Props) {
  const textColor = contrastColor(selectedColor);

  return (
    <PaywallSheet visible={visible} onClose={onClose} snapHeight={0.44}>
      <View style={styles.container}>
        {/* Swatch with glow */}
        <View style={[styles.swatchWrap, { shadowColor: selectedColor }]}>
          <View style={[styles.colorDot, { backgroundColor: selectedColor }]} />
        </View>

        <Text style={styles.title}>Thème Premium</Text>
        <Text style={styles.subtitle}>
          Débloquez tous les thèmes avec{'\n'}Albab Premium
        </Text>

        <TouchableOpacity
          onPress={onClaim}
          style={[styles.cta, { backgroundColor: selectedColor }]}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaText, { color: textColor }]}>Débloquer Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose} style={styles.dismiss}>
          <Text style={styles.dismissText}>Continuer avec l'or</Text>
        </TouchableOpacity>
      </View>
    </PaywallSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  swatchWrap: {
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    marginBottom: 4,
  },
  colorDot: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  title: {
    fontSize:   20,
    fontWeight: '700',
    color:      Colors.textPrimary,
  },
  subtitle: {
    ...S.bodySecondary,
    textAlign: 'center',
  },
  cta: {
    ...S.btnPrimary,
    width:     '100%',
    marginTop: 4,
  },
  ctaText:     { ...S.btnLabel },
  dismiss:     { paddingVertical: 8 },
  dismissText: { ...S.meta },
});
