import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { challenges } from '../data/mockData';

export function ChallengesScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerAr}>التحديات</Text>
            <Text style={styles.title}>Challenges</Text>
          </View>

          {challenges.map((c, i) => {
            const pct = c.days ? (c.current / c.days) * 100 : 0;
            const isActive = c.current > 0;

            return (
              <View
                key={c.id}
                style={[
                  styles.card,
                  isActive && { borderColor: c.color + '44' },
                ]}
              >
                {/* Top row */}
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.challengeName}>{c.name}</Text>
                    <Text style={styles.challengeNameAr}>{c.nameAr}</Text>
                  </View>
                  <View style={styles.badges}>
                    {c.premium && (
                      <View style={styles.premiumBadge}>
                        <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                      </View>
                    )}
                    {isActive && (
                      <View style={[styles.activeBadge, { backgroundColor: c.color + '22', borderColor: c.color + '44' }]}>
                        <Text style={[styles.activeBadgeText, { color: c.color }]}>ACTIF</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Progress bar */}
                {c.days != null && (
                  <>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${pct}%`, backgroundColor: c.color },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressLabel}>
                      {isActive ? `Jour ${c.current} / ${c.days}` : `${c.days} jours`}
                    </Text>
                  </>
                )}
                {c.days == null && (
                  <Text style={styles.progressLabel}>
                    Aucune pause autorisée — Volonté absolue
                  </Text>
                )}

                {/* CTA */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.ctaBtn,
                    { borderColor: c.color + '44' },
                    !isActive && { backgroundColor: c.color + '22' },
                  ]}
                >
                  <Text style={[styles.ctaBtnText, { color: c.color }]}>
                    {isActive ? 'Continuer le challenge' : 'Commencer'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
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

  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 19,
    padding: 21,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  challengeName: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  challengeNameAr: { fontSize: 14, color: Colors.textMuted, marginTop: 3 },

  badges: { flexDirection: 'row', gap: 7 },
  premiumBadge: {
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  premiumBadgeText: { fontSize: 12, color: Colors.gold, fontWeight: '700' },
  activeBadge: {
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  activeBadgeText: { fontSize: 12, fontWeight: '700' },

  progressTrack: {
    backgroundColor: '#1a1a1a',
    borderRadius: 7,
    height: 6,
    overflow: 'hidden',
    marginBottom: 9,
  },
  progressFill: { height: '100%', borderRadius: 7 },
  progressLabel: { fontSize: 13, color: Colors.textMuted },

  ctaBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaBtnText: { fontSize: 15, fontWeight: '600' },
});
