import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { badges } from '../data/mockData';

const STATS = [
  { label: 'Streak',      value: '🔥 14j', sub: 'Jours consécutifs' },
  { label: 'Sessions',    value: '87',      sub: 'Complètes' },
  { label: 'Temps focus', value: '142h',    sub: 'Total' },
];

export function RihlaScreen() {
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
                  b.unlocked ? styles.badgeUnlocked : styles.badgeLocked,
                ]}
              >
                <Text style={[styles.badgeIcon, !b.unlocked && styles.badgeIconLocked]}>
                  {b.icon}
                </Text>
                <Text style={[styles.badgeName, b.unlocked && styles.badgeNameUnlocked]}>
                  {b.name}
                </Text>
                <Text style={styles.badgeNameAr}>{b.nameAr}</Text>
              </View>
            ))}
          </View>

          {/* Premium CTA */}
          <LinearGradient
            colors={['rgba(201,168,76,0.15)', 'rgba(26,107,74,0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumCard}
          >
            <Text style={styles.premiumEmoji}>✨</Text>
            <Text style={styles.premiumTitle}>Albab Premium</Text>
            <Text style={styles.premiumDesc}>
              Sessions illimitées · Tous les challenges · Stats avancées
            </Text>
            <TouchableOpacity activeOpacity={0.85} style={styles.premiumBtn}>
              <LinearGradient
                colors={[Colors.gold, '#a8782a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumBtnGrad}
              >
                <Text style={styles.premiumBtnText}>
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
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 23, paddingBottom: 116 },

  header: { paddingTop: 23, marginBottom: 28 },
  headerAr: { fontSize: 13, color: Colors.textMuted, letterSpacing: 0.8, marginBottom: 7 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 5,
  },
  statValue: { fontSize: 21, fontWeight: '700', color: Colors.textPrimary },
  statSub: { fontSize: 11, color: Colors.textMuted, letterSpacing: 0.3, textAlign: 'center' },

  sectionLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 16,
  },

  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  badgeItem: {
    width: '30%',
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 9,
    alignItems: 'center',
    gap: 5,
  },
  badgeUnlocked: {
    backgroundColor: Colors.goldBg,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
  },
  badgeLocked: {
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    opacity: 0.4,
  },
  badgeIcon: { fontSize: 28, marginBottom: 3 },
  badgeIconLocked: { opacity: 0.5 },
  badgeName: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  badgeNameUnlocked: { color: Colors.gold },
  badgeNameAr: { fontSize: 11, color: Colors.textMuted },

  premiumCard: {
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.25)',
    padding: 23,
    alignItems: 'center',
    gap: 0,
  },
  premiumEmoji: { fontSize: 23, marginBottom: 12 },
  premiumTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 7,
  },
  premiumDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 19,
  },
  premiumBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  premiumBtnGrad: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  premiumBtnText: { fontSize: 16, fontWeight: '700', color: '#000' },
});
