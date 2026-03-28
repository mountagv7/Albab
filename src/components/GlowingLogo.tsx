import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';

interface Props {
  size?: number;
}

export function GlowingLogo({ size = 180 }: Props) {
  const pulse = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.7, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const innerSize = size * 0.6;
  const midSize = size * 0.78;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer glow */}
      <Animated.View
        style={[
          styles.outerGlow,
          { width: size, height: size, borderRadius: size / 2, opacity: pulse },
        ]}
      />

      {/* Mid ring */}
      <View
        style={[
          styles.midRing,
          { width: midSize, height: midSize, borderRadius: midSize / 2, position: 'absolute' },
        ]}
      />

      {/* Inner circle */}
      <View
        style={[
          styles.inner,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            position: 'absolute',
          },
        ]}
      >
        <Text style={[styles.arabicText, { fontSize: size * 0.16 }]}>ٱلْبَاب</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(201,168,76,0.08)',
    shadowColor: Colors.gold,
    shadowOpacity: 0.4,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  midRing: {
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    backgroundColor: 'rgba(201,168,76,0.04)',
  },
  inner: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1.5,
    borderColor: 'rgba(201,168,76,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.gold,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  arabicText: {
    color: Colors.gold,
    fontWeight: '700',
    textAlign: 'center',
  },
});
