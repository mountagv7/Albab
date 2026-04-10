import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';
import { PrayerBanner } from '../components/PrayerBanner';
import { SessionCard } from '../components/SessionCard';
import { Colors } from '../theme/colors';
import { arabicVerses, sessions, SessionType } from '../data/mockData';

const verse = arabicVerses[0];
const PROGRESS = 65;

// Sessions displayed on Home — exclude Khushu Mode (id=1)
const homeSessions = sessions.filter(s => s.id !== 1);

// ── SVG Icons ────────────────────────────────────────────────
const GOLD = Colors.gold;

function MosqueIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C10.5 2 9.5 3 9.5 4C9.5 5 10 5.5 10 6C8.5 6.5 7 8 7 10V11H5V20H19V11H17V10C17 8 15.5 6.5 14 6C14 5.5 14.5 5 14.5 4C14.5 3 13.5 2 12 2Z"
        stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round"
      />
      <Path d="M9 20V15C9 13.3 10.3 12 12 12C13.7 12 15 13.3 15 15V20" stroke={GOLD} strokeWidth={1.5} />
      <Path d="M5 11H3V20H5" stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M19 11H21V20H19" stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}

function FlameIcon({ size = 14 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C12 2 7 7 7 13C7 15.76 9.24 18 12 18C14.76 18 17 15.76 17 13C17 10 15 8 14 7C14 9 13 10 12 11C11 10 11 8 12 2Z"
        stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round"
      />
      <Path
        d="M12 18C10.34 18 9 19.34 9 21H15C15 19.34 13.66 18 12 18Z"
        stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round"
      />
    </Svg>
  );
}

function MoonIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={GOLD} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Animated Khushu toggle ────────────────────────────────────
function KhushuToggle({ onPress }: { onPress: () => void }) {
  const anim = useRef(new Animated.Value(0)).current;
  const isOn = useRef(false);

  function toggle() {
    const next = isOn.current ? 0 : 1;
    isOn.current = !isOn.current;
    Animated.timing(anim, {
      toValue: next,
      duration: 220,
      useNativeDriver: false,
    }).start();
    if (next === 1) onPress();
  }

  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2a2a2a', Colors.gold],
  });
  const thumbX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity onPress={toggle} activeOpacity={0.85}>
      <Animated.View style={[styles.toggleTrack, { backgroundColor: bgColor }]}>
        <Animated.View style={[styles.toggleThumb, { transform: [{ translateX: thumbX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Props ─────────────────────────────────────────────────────
interface Props {
  onStartSession: (session: SessionType) => void;
  onKhushuPress: () => void;
}

export function HomeScreen({ onStartSession, onKhushuPress }: Props) {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.salam}>السلام عليكم</Text>
            <Text style={styles.greeting}>Bonsoir, Ali</Text>
          </View>

          {/* Prayer banner */}
          <PrayerBanner />

          {/* Objectif du jour */}
          <View style={styles.card}>
            <View style={styles.objectifRow}>
              <View>
                <Text style={styles.cardLabel}>OBJECTIF DU JOUR</Text>
                <Text style={styles.objectifValue}>
                  1h 57min{' '}
                  <Text style={styles.objectifTotal}>/ 3h</Text>
                </Text>
              </View>
              <View style={styles.solideBadge}>
                <Text style={styles.solideText}>Solide</Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <LinearGradient
                colors={[Colors.green, Colors.gold]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${PROGRESS}%` }]}
              />
            </View>

            <View style={styles.streakRow}>
              <FlameIcon size={13} />
              <Text style={styles.streakText}>
                Streak actuel :{' '}
                <Text style={styles.streakValue}>14 jours</Text>
              </Text>
            </View>
          </View>

          {/* Challenge actif */}
          <LinearGradient
            colors={['rgba(201,168,76,0.15)', 'rgba(201,168,76,0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.challengeBanner}
          >
            <MoonIcon size={24} />
            <View style={{ flex: 1 }}>
              <Text style={styles.challengeLabel}>CHALLENGE ACTIF</Text>
              <Text style={styles.challengeName}>
                Ramadan Challenge — Jour 14/30
              </Text>
            </View>
            <ChevronIcon size={18} />
          </LinearGradient>

          {/* ── Khushu Mode row ──────────────────────────────────── */}
          <View style={styles.khushuRow}>
            <View style={styles.khushuIconWrap}>
              <MosqueIcon size={22} />
            </View>
            <View style={styles.khushuText}>
              <Text style={styles.khushuTitle}>Khushu Mode</Text>
              <Text style={styles.khushuAr}>خشوع</Text>
            </View>
            <KhushuToggle onPress={onKhushuPress} />
          </View>

          {/* ── Sessions ─────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>MES SESSIONS</Text>
          {homeSessions.map((s, i) => (
            <SessionCard
              key={s.id}
              session={s}
              onPress={() => onStartSession(s)}
              delay={i * 60}
            />
          ))}

          {/* Verse watermark */}
          <View style={styles.verseWrap}>
            <Text style={styles.verseAr}>{verse.ar}</Text>
            <Text style={styles.verseFr}>
              {verse.fr} — {verse.source}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 23, paddingBottom: 116 },

  header: { paddingTop: 23, marginBottom: 28 },
  salam: { fontSize: 14, color: Colors.textMuted, letterSpacing: 1, marginBottom: 5 },
  greeting: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.5 },

  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 19,
    padding: 21,
    marginBottom: 19,
  },
  objectifRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  objectifValue: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  objectifTotal: { color: Colors.textMuted, fontWeight: '400' },
  solideBadge: {
    backgroundColor: Colors.goldBg,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: 23,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  solideText: { fontSize: 13, color: Colors.gold, fontWeight: '600' },

  progressTrack: {
    backgroundColor: '#1a1a1a',
    borderRadius: 7,
    height: 7,
    overflow: 'hidden',
    marginBottom: 9,
  },
  progressFill: { height: '100%', borderRadius: 7 },

  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  streakText: { fontSize: 12, color: Colors.textMuted },
  streakValue: { color: Colors.gold },

  challengeBanner: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.35)',
    paddingVertical: 14,
    paddingHorizontal: 19,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  challengeLabel: {
    fontSize: 13,
    color: Colors.gold,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  challengeName: { fontSize: 15, color: Colors.textPrimary },

  // ── Khushu row ──────────────────────────────────────────────
  khushuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 23,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    gap: 14,
  },
  khushuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.goldBg,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  khushuText: { flex: 1 },
  khushuTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  khushuAr: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  // Toggle
  toggleTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },

  sectionLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  // ── Verse ──────────────────────────────────────────────────
  verseWrap: {
    alignItems: 'center',
    paddingVertical: 23,
    opacity: 0.4,
    gap: 7,
  },
  verseAr: {
    fontSize: 20,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 33,
  },
  verseFr: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
