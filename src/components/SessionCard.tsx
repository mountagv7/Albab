import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { S, accentSoftGlow } from '../theme/styles';
import { SessionType } from '../data/mockData';

interface Props {
  session: SessionType;
  onPress: () => void;
  delay?: number;
}

export function SessionCard({ session, onPress, delay = 0 }: Props) {
  const { accentColor, accentBg, accentBorder } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(translateAnim, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: translateAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[
          styles.card,
          session.active && [S.softGlow, { borderColor: accentBorder, shadowColor: accentColor }],
        ]}
      >
        {session.active && <View style={[styles.activeBar, { backgroundColor: accentColor }]} />}

        <View style={[styles.iconBox, session.active && { backgroundColor: accentBg, borderColor: accentBorder }]}>
          <Text style={styles.iconText}>
            {session.type === 'planning' ? '🗓' : '⏱'}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{session.name}</Text>
          <Text style={styles.meta}>
            {session.time} · {session.apps} apps bloquées
          </Text>
        </View>

        <View style={styles.right}>
          {session.active ? (
            <Text style={[styles.activeDot, { color: accentColor }]}>● ACTIF</Text>
          ) : (
            <Text style={styles.chevron}>›</Text>
          )}
          <Text style={styles.nameAr}>{session.nameAr}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...S.card,
    paddingVertical:   16,
    paddingHorizontal: 19,
    marginBottom:      12,
    flexDirection:     'row',
    alignItems:        'center',
    gap:               16,
    overflow:          'hidden',
    padding:           0,
  },
  activeBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0.7,
  },
  iconBox: {
    width:           49,
    height:          49,
    borderRadius:    14,
    backgroundColor: Colors.surfaceElevated,
    borderWidth:     1,
    borderColor:     Colors.border,
    alignItems:      'center',
    justifyContent:  'center',
  },
  iconText: { fontSize: 21 },
  info:     { flex: 1 },
  name:     { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  meta:     { ...S.meta, marginTop: 3 },
  right:    { alignItems: 'flex-end' },
  activeDot: { fontSize: 13, fontWeight: '600' },
  chevron:   { fontSize: 21, color: Colors.textMuted },
  nameAr:    { fontSize: 12, color: Colors.textMuted, marginTop: 3 },
});
