import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RADIUS = 105;
const CX = 128;
const CY = 128;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const VERSE = {
  ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
  fr: 'Avec la difficulté vient la facilité — Al-Inshirah 94:6',
};

export function ActiveSessionScreen({ session, niyyah, onEnd }) {
  const TOTAL = 2 * 3600; // 2h mock
  const [seconds, setSeconds] = useState(47 * 60 + 23);
  const [paused, setPaused] = useState(false);

  // Animated dashOffset — drives the SVG ring smoothly
  const dashOffsetAnim = useRef(
    new Animated.Value(CIRCUMFERENCE * (1 - (47 * 60 + 23) / TOTAL))
  ).current;

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  // Countdown tick
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setSeconds(s => {
        const next = Math.max(0, s - 1);
        const progress = 1 - next / TOTAL;
        Animated.timing(dashOffsetAnim, {
          toValue: CIRCUMFERENCE * progress,
          duration: 950,
          easing: Easing.linear,
          useNativeDriver: false, // SVG props require JS driver
        }).start();
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [paused]);

  // Inverse dashOffset for the arc: offset = CIRCUMFERENCE - filled
  const strokeDashoffset = dashOffsetAnim.interpolate({
    inputRange: [0, CIRCUMFERENCE],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.inner}>

          {/* Status label */}
          <Text style={styles.statusLabel}>
            EN COURS · {session.name.toUpperCase()}
          </Text>

          {/* Timer ring */}
          <View style={styles.ringWrap}>
            <Svg
              width={256}
              height={256}
              style={{ transform: [{ rotate: '-90deg' }] }}
            >
              {/* Track */}
              <Circle
                cx={CX} cy={CY} r={RADIUS}
                fill="none"
                stroke="#1a1a1a"
                strokeWidth={9}
              />
              {/* Progress arc */}
              <AnimatedCircle
                cx={CX} cy={CY} r={RADIUS}
                fill="none"
                stroke={Colors.gold}
                strokeWidth={9}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </Svg>

            {/* Center overlay */}
            <View style={styles.timerOverlay}>
              <Text style={styles.timerText}>{mm}:{ss}</Text>
              <Text style={styles.timerSub}>restant</Text>
            </View>
          </View>

          {/* Niyyah reminder */}
          {!!niyyah && (
            <View style={styles.niyyahBox}>
              <Text style={styles.niyyahLabel}>TA NIYYAH</Text>
              <Text style={styles.niyyahText}>{niyyah}</Text>
            </View>
          )}

          {/* Verse */}
          <View style={styles.verseBox}>
            <Text style={styles.verseAr}>{VERSE.ar}</Text>
            <Text style={styles.verseFr}>{VERSE.fr}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.pauseBtn}
              onPress={() => setPaused(p => !p)}
              activeOpacity={0.8}
            >
              <Text style={styles.pauseBtnText}>
                {paused ? '▶ Reprendre' : '⏸ Pause'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.endBtn}
              onPress={onEnd}
              activeOpacity={0.8}
            >
              <Text style={styles.endBtnText}>Terminer</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            {session.apps} apps bloquées · Streak 🔥 14 jours
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 23,
  },

  statusLabel: {
    fontSize: 13,
    color: Colors.gold,
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 23,
    marginBottom: 5,
  },

  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 23,
  },
  timerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 44,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -2,
  },
  timerSub: { fontSize: 13, color: Colors.textMuted, marginTop: 5 },

  niyyahBox: {
    backgroundColor: Colors.goldBg,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 19,
    width: '100%',
    alignItems: 'center',
    marginBottom: 19,
  },
  niyyahLabel: {
    fontSize: 12,
    color: Colors.gold,
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  niyyahText: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  verseBox: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 19,
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
    gap: 7,
  },
  verseAr: {
    fontSize: 19,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 30,
  },
  verseFr: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },

  controls: { flexDirection: 'row', gap: 14, width: '100%' },
  pauseBtn: {
    flex: 1,
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  pauseBtnText: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600' },
  endBtn: {
    flex: 1,
    backgroundColor: 'rgba(139,32,32,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139,32,32,0.3)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  endBtnText: { fontSize: 16, color: '#c0504d', fontWeight: '600' },

  footer: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 19,
    textAlign: 'center',
  },
});
