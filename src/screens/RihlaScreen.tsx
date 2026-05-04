import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useTheme, THEME_COLORS } from '../context/ThemeContext';
import { S } from '../theme/styles';
import { ThemeSheet } from '../components/ThemeSheet';
import { AlbabCard } from '../components/AlbabCard';
import { badges } from '../data/mockData';

const STATS = [
  { label: 'Streak',      value: '🔥 14j', sub: 'Jours consécutifs' },
  { label: 'Sessions',    value: '87',      sub: 'Complètes' },
  { label: 'Temps focus', value: '142h',    sub: 'Total' },
];

// ── Apparence / Thème section ─────────────────────────────────
function ThemeSection() {
  const { accentColor, setAccentColor, themeColors } = useTheme();
  const [pendingColor, setPendingColor] = useState<string | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function handleSwatchPress(color: { hex: string; free: boolean }) {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (color.free) {
      setAccentColor(color.hex);
      setPendingColor(null);
      return;
    }
    setAccentColor(color.hex);
    setPendingColor(color.hex);
    timerRef.current = setTimeout(() => setShowSheet(true), 800);
  }

  function handleClaim() {
    setShowSheet(false);
    setPendingColor(null);
  }

  function handleClose() {
    setShowSheet(false);
    setAccentColor(THEME_COLORS[0].hex);
    setPendingColor(null);
  }

  return (
    <>
      <Text style={styles.sectionLabel}>APPARENCE</Text>
      <AlbabCard padding={0} style={themeCardStyle.card}>
        <View style={themeCardStyle.row}>
          {themeColors.map(color => {
            const isSelected = accentColor === color.hex;
            return (
              <TouchableOpacity
                key={color.hex}
                onPress={() => handleSwatchPress(color)}
                activeOpacity={0.75}
              >
                <View style={[
                  themeCardStyle.swatchWrap,
                  { shadowColor: color.hex },
                  isSelected && themeCardStyle.swatchWrapSelected,
                ]}>
                  <View style={[
                    themeCardStyle.swatch,
                    { backgroundColor: color.hex },
                    isSelected && themeCardStyle.swatchSelected,
                  ]} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </AlbabCard>
      <ThemeSheet
        visible={showSheet}
        onClose={handleClose}
        onClaim={handleClaim}
        selectedColor={pendingColor ?? THEME_COLORS[0].hex}
      />
    </>
  );
}

const themeCardStyle = StyleSheet.create({
  card: { marginBottom: 28 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  swatchWrap: {
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
    borderRadius: 22,
  },
  swatchWrapSelected: {
    shadowOpacity: 0.75,
    shadowRadius: 14,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
});

// ─────────────────────────────────────────────────────────────
export function RihlaScreen() {
  const { accentColor, accentBg, accentBorder, accentDim, buttonTextColor } = useTheme();
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerAr}>الرحلة</Text>
            <Text style={styles.title}>Mon Voyage</Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {STATS.map((s, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statSub}>{s.sub}</Text>
              </View>
            ))}
          </View>

          {/* Badges label */}
          <Text style={styles.sectionLabel}>MES BADGES</Text>

          {/* Badges grid — 3 columns */}
          <View style={styles.badgesGrid}>
            {badges.map(b => (
              <View
                key={b.id}
                style={[
                  styles.badgeItem,
                  b.unlocked ? [styles.badgeUnlocked, { backgroundColor: accentBg, borderColor: accentBorder }] : styles.badgeLocked,
                ]}
              >
                <Text style={[styles.badgeIcon, !b.unlocked && styles.badgeIconLocked]}>
                  {b.icon}
                </Text>
                <Text style={[styles.badgeName, b.unlocked && { color: accentColor }]}>
                  {b.name}
                </Text>
                <Text style={styles.badgeNameAr}>{b.nameAr}</Text>
              </View>
            ))}
          </View>

          {/* Theme section */}
          <ThemeSection />

          {/* Premium CTA */}
          <LinearGradient
            colors={[accentBg, 'rgba(26,107,74,0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.premiumCard, { borderColor: accentBorder }]}
          >
            <Text style={styles.premiumEmoji}>✨</Text>
            <Text style={styles.premiumTitle}>Albab Premium</Text>
            <Text style={styles.premiumDesc}>
              Sessions illimitées · Tous les challenges · Stats avancées
            </Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.premiumBtn}>
              <LinearGradient
                colors={[accentColor, accentDim]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumBtnGrad}
              >
                <Text style={[styles.premiumBtnText, { color: buttonTextColor }]}>
                  6,99 $/mois — Essai gratuit 7j
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll:    { paddingHorizontal: 23, paddingBottom: 116 },

  header:   { paddingTop: 23, marginBottom: 28 },
  headerAr: { ...S.label, fontSize: 13, marginBottom: 7 },
  title:    { fontSize: 28, fontWeight: '700', color: Colors.textPrimary },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: {
    ...S.card,
    flex:              1,
    paddingVertical:   14,
    paddingHorizontal: 12,
    alignItems:        'center',
    gap:               5,
    padding:           0,
  },
  statValue: { fontSize: 21, fontWeight: '700', color: Colors.textPrimary },
  statSub:   { ...S.label, fontSize: 11, letterSpacing: 0.3, textAlign: 'center' },

  sectionLabel: { ...S.label, fontSize: 13, marginBottom: 16 },

  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  badgeItem:  { width: '30%', borderRadius: 16, padding: 16, paddingHorizontal: 9, alignItems: 'center', gap: 5 },
  badgeUnlocked: { borderWidth: 1 },
  badgeLocked:   { backgroundColor: Colors.surfaceDeep, borderWidth: 1, borderColor: Colors.border, opacity: 0.4 },
  badgeIcon:       { fontSize: 28, marginBottom: 3 },
  badgeIconLocked: { opacity: 0.5 },
  badgeName:        { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  badgeNameUnlocked: {},
  badgeNameAr:      { fontSize: 11, color: Colors.textMuted },

  premiumCard:    { borderRadius: 19, borderWidth: 1, padding: 23, alignItems: 'center', gap: 0 },
  premiumEmoji:   { fontSize: 23, marginBottom: 12 },
  premiumTitle:   { fontSize: 19, fontWeight: '700', color: Colors.textPrimary, marginBottom: 7 },
  premiumDesc:    { fontSize: 14, color: Colors.textMuted, lineHeight: 21, textAlign: 'center', marginBottom: 19 },
  premiumBtn:     { borderRadius: 14, overflow: 'hidden', alignSelf: 'stretch' },
  premiumBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  premiumBtnText: { ...S.btnLabel },
});
