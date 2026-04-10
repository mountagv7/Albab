import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';

export function PrayerBanner() {
  return (
    <LinearGradient
      colors={['rgba(26,107,74,0.2)', 'rgba(26,107,74,0.05)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.icon}>🕌</Text>
      <View style={styles.info}>
        <Text style={styles.label}>PROCHAIN — MAGHRIB</Text>
        <Text style={styles.time}>
          dans <Text style={styles.timeBold}>2h 34min</Text> · 19:47
        </Text>
      </View>
      <View style={styles.location}>
        <Text style={styles.locationText}>Montréal</Text>
        <Text style={styles.locationText}>DDO</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(26,107,74,0.3)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 19,
  },
  icon: { fontSize: 21 },
  info: { flex: 1 },
  label: {
    fontSize: 13,
    color: Colors.greenLight,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  time: { fontSize: 15, color: Colors.textPrimary },
  timeBold: { fontWeight: '700' },
  location: { alignItems: 'flex-end' },
  locationText: { fontSize: 12, color: Colors.textMuted },
});
