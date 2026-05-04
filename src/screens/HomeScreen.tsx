import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Line, Rect, Text as SvgText } from 'react-native-svg';
import { PrayerBanner } from '../components/PrayerBanner';
import { SessionCard } from '../components/SessionCard';
import { Colors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { S } from '../theme/styles';
import { arabicVerses, sessions, SessionType } from '../data/mockData';

const verse = arabicVerses[0];
const PROGRESS = 65;

// Sessions displayed on Home — exclude Khushu Mode (id=1)
const homeSessions = sessions.filter(s => s.id !== 1);

// ── SVG Icons ────────────────────────────────────────────────
function MosqueIcon({ size = 24 }: { size?: number }) {
  const { accentColor } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C10.5 2 9.5 3 9.5 4C9.5 5 10 5.5 10 6C8.5 6.5 7 8 7 10V11H5V20H19V11H17V10C17 8 15.5 6.5 14 6C14 5.5 14.5 5 14.5 4C14.5 3 13.5 2 12 2Z" stroke={accentColor} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M9 20V15C9 13.3 10.3 12 12 12C13.7 12 15 13.3 15 15V20" stroke={accentColor} strokeWidth={1.5} />
      <Path d="M5 11H3V20H5" stroke={accentColor} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M19 11H21V20H19" stroke={accentColor} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}

function FlameIcon({ size = 14 }: { size?: number }) {
  const { accentColor } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C12 2 7 7 7 13C7 15.76 9.24 18 12 18C14.76 18 17 15.76 17 13C17 10 15 8 14 7C14 9 13 10 12 11C11 10 11 8 12 2Z" stroke={accentColor} strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M12 18C10.34 18 9 19.34 9 21H15C15 19.34 13.66 18 12 18Z" stroke={accentColor} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}

function MoonIcon({ size = 22 }: { size?: number }) {
  const { accentColor } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={accentColor} strokeWidth={1.5} strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronIcon({ size = 18 }: { size?: number }) {
  const { accentColor } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18L15 12L9 6" stroke={accentColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Stats mock data ───────────────────────────────────────────
type StatsTab = 'Semaine' | 'Mois' | 'À vie';
const STATS_TABS: StatsTab[] = ['Semaine', 'Mois', 'À vie'];

type ChartPoint = { label: string; value: number };
type TabData = { total: string; sessions: number; avg: string; chart: ChartPoint[]; maxY: number };

const STATS_DATA: Record<StatsTab, TabData> = {
  'Semaine': {
    total: '4h 32min',
    sessions: 14,
    avg: '39min',
    chart: [
      { label: 'Lun', value: 0.5 },
      { label: 'Mar', value: 1.2 },
      { label: 'Mer', value: 0.8 },
      { label: 'Jeu', value: 2.1 },
      { label: 'Ven', value: 1.5 },
      { label: 'Sam', value: 0.3 },
      { label: 'Dim', value: 1.0 },
    ],
    maxY: 3,
  },
  'Mois': {
    total: '18h 12min',
    sessions: 48,
    avg: '36min',
    chart: [
      { label: 'S1', value: 3.2 },
      { label: 'S2', value: 5.1 },
      { label: 'S3', value: 4.8 },
      { label: 'S4', value: 5.1 },
    ],
    maxY: 6,
  },
  'À vie': {
    total: '124h 15min',
    sessions: 312,
    avg: '42min',
    chart: [
      { label: 'Jan', value: 8 },
      { label: 'Fév', value: 12 },
      { label: 'Mar', value: 10 },
      { label: 'Avr', value: 18 },
      { label: 'Mai', value: 22 },
      { label: 'Juin', value: 16 },
    ],
    maxY: 24,
  },
};

// ── Stats styles ──────────────────────────────────────────────
const st = StyleSheet.create({
  tabTrack: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 7,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: '#FFFFFF' },
  tabText: { fontSize: 13, color: '#666', fontWeight: '500' },
  tabTextActive: { color: '#0C0A06', fontWeight: '600' },

  card: {
    backgroundColor: '#1A1508',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
  },
  totalTime: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  totalLabel: { fontSize: 12, color: '#888', marginBottom: 18 },
  chartWrap: { marginLeft: -4 },

  miniRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  miniCard: {
    flex: 1,
    backgroundColor: '#1A1508',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  miniValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  miniLabel: { fontSize: 12, color: '#888', lineHeight: 17 },
});

// ── Line chart ────────────────────────────────────────────────
function LineChart({ data, maxY, width }: { data: ChartPoint[]; maxY: number; width: number }) {
  const { accentColor, accentBg } = useTheme();
  const H = 100;
  const PT = 6;         // plot top
  const PB = 76;        // plot bottom
  const PH = PB - PT;   // plot height = 70
  const LP = 28;        // left padding for Y labels
  const RP = 8;         // right padding
  const PW = width - LP - RP;
  const n = data.length;

  const xs = data.map((_, i) => LP + (i / (n - 1)) * PW);
  const ys = data.map(d => PT + PH - (d.value / maxY) * PH);

  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const fillPath = `${linePath} L${xs[n - 1].toFixed(1)},${PB} L${xs[0].toFixed(1)},${PB} Z`;
  const midLabel = Math.round(maxY / 2);

  return (
    <Svg width={width} height={H}>
      <SvgText x={LP - 5} y={PB + 1} textAnchor="end" fontSize="9" fill="#555">0h</SvgText>
      <SvgText x={LP - 5} y={PT + PH / 2 + 4} textAnchor="end" fontSize="9" fill="#555">{midLabel}h</SvgText>
      <SvgText x={LP - 5} y={PT + 4} textAnchor="end" fontSize="9" fill="#555">{maxY}h</SvgText>
      <Path d={fillPath} fill={accentBg} />
      <Path d={linePath} stroke={accentColor} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <Circle key={i} cx={xs[i]} cy={ys[i]} r="2.5" fill={accentColor} />
      ))}
      {data.map((d, i) => (
        <SvgText key={d.label} x={xs[i]} y={H - 2} textAnchor="middle" fontSize="9" fill="#555">
          {d.label}
        </SvgText>
      ))}
    </Svg>
  );
}

// ── Stats widget ──────────────────────────────────────────────
function StatsWidget() {
  const { accentBorder } = useTheme();
  const [tab, setTab] = useState<StatsTab>('Semaine');
  const { width: screenW } = useWindowDimensions();
  const chartWidth = screenW - 23 * 2 - 18 * 2;
  const d = STATS_DATA[tab];

  return (
    <View>
      <View style={st.tabTrack}>
        {STATS_TABS.map(t => (
          <TouchableOpacity
            key={t}
            style={[st.tabBtn, t === tab && st.tabBtnActive]}
            onPress={() => setTab(t)}
            activeOpacity={0.75}
          >
            <Text style={[st.tabText, t === tab && st.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[st.card, { borderColor: accentBorder }]}>
        <Text style={st.totalTime}>{d.total}</Text>
        <Text style={st.totalLabel}>Temps de focus</Text>
        <View style={st.chartWrap}>
          <LineChart data={d.chart} maxY={d.maxY} width={chartWidth} />
        </View>
      </View>

      <View style={st.miniRow}>
        <View style={[st.miniCard, { borderColor: accentBorder }]}>
          <Text style={st.miniValue}>{d.sessions}</Text>
          <Text style={st.miniLabel}>Sessions complétées</Text>
        </View>
        <View style={[st.miniCard, { borderColor: accentBorder }]}>
          <Text style={st.miniValue}>{d.avg}</Text>
          <Text style={st.miniLabel}>Moyenne par jour</Text>
        </View>
      </View>
    </View>
  );
}

// ── Animated Khushu toggle ────────────────────────────────────
function KhushuToggle({ onPress }: { onPress: () => void }) {
  const { accentColor } = useTheme();
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
    outputRange: ['#2a2a2a', accentColor],
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
  const { accentColor, accentBg, accentBorder } = useTheme();
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
              <View style={[styles.solideBadge, { backgroundColor: accentBg, borderColor: accentBorder }]}>
                <Text style={[styles.solideText, { color: accentColor }]}>Solide</Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <LinearGradient
                colors={[Colors.green, accentColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${PROGRESS}%` }]}
              />
            </View>

            <View style={styles.streakRow}>
              <FlameIcon size={13} />
              <Text style={styles.streakText}>
                Streak actuel :{' '}
                <Text style={[styles.streakValue, { color: accentColor }]}>14 jours</Text>
              </Text>
            </View>
          </View>

          {/* Challenge actif */}
          <LinearGradient
            colors={[accentBg, accentBg.replace('0.12', '0.04')]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.challengeBanner, { borderColor: accentBorder }]}
          >
            <MoonIcon size={24} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.challengeLabel, { color: accentColor }]}>CHALLENGE ACTIF</Text>
              <Text style={styles.challengeName}>
                Ramadan Challenge — Jour 14/30
              </Text>
            </View>
            <ChevronIcon size={18} />
          </LinearGradient>

          {/* ── Khushu Mode row ──────────────────────────────────── */}
          <View style={styles.khushuRow}>
            <View style={[styles.khushuIconWrap, { backgroundColor: accentBg, borderColor: accentBorder }]}>
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

          {/* ── Stats ──────────────────────────────────────────── */}
          <Text style={[styles.sectionLabel, { marginTop: 28 }]}>MES STATISTIQUES</Text>
          <StatsWidget />

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
  container: { flex: 1 },
  scroll:    { paddingHorizontal: 23, paddingBottom: 116 },

  header:   { paddingTop: 23, marginBottom: 28 },
  salam:    { fontSize: 14, color: Colors.textMuted, letterSpacing: 1, marginBottom: 5 },
  greeting: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.5 },

  card: {
    ...S.card,
    borderRadius: 19,
    padding:      21,
    marginBottom: 19,
  },
  objectifRow: { ...S.rowBetween, marginBottom: 14 },
  cardLabel:   { ...S.label, fontSize: 13, marginBottom: 3 },
  objectifValue: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  objectifTotal: { color: Colors.textMuted, fontWeight: '400' },
  solideBadge: {
    borderWidth:       1,
    borderRadius:      23,
    paddingHorizontal: 12,
    paddingVertical:   5,
  },
  solideText: { fontSize: 13, fontWeight: '600' },

  progressTrack: { ...S.progressTrack, marginBottom: 9 },
  progressFill:  { ...S.progressFill },

  streakRow:   { ...S.row, gap: 5 },
  streakText:  { fontSize: 12, color: Colors.textMuted },
  streakValue: {},

  challengeBanner: {
    ...S.card,
    borderRadius:      16,
    paddingVertical:   14,
    paddingHorizontal: 19,
    marginBottom:      14,
    flexDirection:     'row',
    alignItems:        'center',
    gap:               14,
    padding:           0,
  },
  challengeLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5, marginBottom: 3 },
  challengeName:  { fontSize: 15, color: Colors.textPrimary },

  // ── Khushu row ──────────────────────────────────────────────
  khushuRow: {
    ...S.card,
    borderRadius:      14,
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   14,
    paddingHorizontal: 16,
    marginBottom:      23,
    gap:               14,
    padding:           0,
  },
  khushuIconWrap: {
    width:          38,
    height:         38,
    borderRadius:   10,
    borderWidth:    1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  khushuText:  { flex: 1 },
  khushuTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  khushuAr:    { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  // Toggle
  toggleTrack: { width: 46, height: 26, borderRadius: 13, justifyContent: 'center' },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },

  sectionLabel: { ...S.label, fontSize: 13, marginBottom: 14 },

  // ── Verse ──────────────────────────────────────────────────
  verseWrap: { alignItems: 'center', paddingVertical: 23, opacity: 0.4, gap: 7 },
  verseAr:   { fontSize: 20, color: Colors.textMuted, textAlign: 'center', lineHeight: 33 },
  verseFr:   { ...S.label, textAlign: 'center' },
});
