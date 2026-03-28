import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlbabCard } from '../components/AlbabCard';
import { PremiumBadge } from '../components/PremiumBadge';
import { Colors } from '../theme/colors';
import { t } from '../i18n';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const VALUES = [0.65, 0.82, 0.45, 0.90, 0.70, 0.30, 0.55];
const TODAY = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

const TOP_APPS = [
  { name: 'Instagram', time: '50m', color: '#E1306C', fraction: 0.45 },
  { name: 'TikTok', time: '33m', color: '#888', fraction: 0.30 },
  { name: 'Safari', time: '25m', color: '#0080FF', fraction: 0.22 },
  { name: 'WhatsApp', time: '18m', color: '#25D366', fraction: 0.16 },
];

export function StatsScreen() {
  const [period, setPeriod] = useState(0);
  const periods = [t('today'), t('week'), t('month')];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{t('statsTitle')}</Text>

          {/* Period selector */}
          <View style={styles.periodSelector}>
            {periods.map((p, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.periodBtn, i === period && styles.periodBtnActive]}
                onPress={() => setPeriod(i)}
              >
                <Text style={[styles.periodText, i === period && styles.periodTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Summary cards */}
          <View style={styles.summaryRow}>
            <View style={styles.statCard}>
              <Text style={[styles.statIcon, { color: Colors.gold }]}>📱</Text>
              <Text style={styles.statValue}>2h 18m</Text>
              <Text style={styles.statLabel}>{t('screenTimeToday')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statIcon, { color: Colors.productive }]}>⏱</Text>
              <Text style={styles.statValue}>45m</Text>
              <Text style={styles.statLabel}>{t('totalFocusTime')}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>{t('streak')}</Text>
            </View>
          </View>

          {/* Weekly bar chart */}
          <AlbabCard style={styles.card}>
            <Text style={styles.cardTitle}>{t('weeklyReport')}</Text>
            <Text style={styles.cardSubtitle}>{t('timeOffline')}</Text>
            <View style={styles.weekBars}>
              {DAYS.map((day, i) => (
                <View key={i} style={styles.weekBarGroup}>
                  <View style={[
                    styles.weekBar,
                    { height: VALUES[i] * 70, backgroundColor: i === TODAY ? Colors.gold : Colors.productive },
                    i === TODAY && styles.weekBarToday,
                  ]} />
                  <Text style={[styles.weekBarLabel, i === TODAY && { color: Colors.gold, fontWeight: '700' }]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </AlbabCard>

          {/* Top apps */}
          <AlbabCard style={styles.card}>
            <Text style={styles.cardTitle}>{t('mostUsed')}</Text>
            {TOP_APPS.map((app, i) => (
              <View key={i} style={[styles.appRow, i < TOP_APPS.length - 1 && { marginBottom: 16 }]}>
                <View style={[styles.appIcon, { backgroundColor: app.color + '22' }]}>
                  <Text style={[styles.appLetter, { color: app.color }]}>{app.name[0]}</Text>
                </View>
                <View style={{ flex: 1, gap: 6 }}>
                  <View style={styles.appRowTop}>
                    <Text style={styles.appName}>{app.name}</Text>
                    <Text style={styles.appTime}>{app.time}</Text>
                  </View>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${app.fraction * 100}%`, backgroundColor: app.color + 'AA' }]} />
                  </View>
                </View>
              </View>
            ))}
          </AlbabCard>

          {/* Advanced stats (premium) */}
          <AlbabCard goldBorder style={styles.card}>
            <View style={styles.premiumRow}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.cardTitle}>Advanced Analytics</Text>
                <Text style={styles.cardSubtitle}>Trends, insights & detailed breakdowns</Text>
              </View>
              <PremiumBadge />
            </View>
          </AlbabCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },
  title: { color: Colors.textPrimary, fontSize: 22, fontWeight: '700', marginTop: 16, marginBottom: 16 },

  periodSelector: {
    flexDirection: 'row', backgroundColor: Colors.surfaceElevated,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    padding: 3, marginBottom: 16,
  },
  periodBtn: { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  periodBtnActive: { backgroundColor: 'rgba(201,168,76,0.12)', borderWidth: 1, borderColor: Colors.borderGold },
  periodText: { color: Colors.textSecondary, fontSize: 13 },
  periodTextActive: { color: Colors.gold, fontWeight: '600' },

  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: Colors.surfaceElevated, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, padding: 14, gap: 6,
  },
  statIcon: { fontSize: 18 },
  statValue: { color: Colors.textPrimary, fontSize: 17, fontWeight: '700' },
  statLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '500' },

  card: { marginBottom: 14 },
  cardTitle: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  cardSubtitle: { color: Colors.textMuted, fontSize: 11, letterSpacing: 0.3, marginBottom: 16 },

  weekBars: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 90 },
  weekBarGroup: { alignItems: 'center', gap: 6 },
  weekBar: { width: 28, borderRadius: 6, minHeight: 4 },
  weekBarToday: { shadowColor: Colors.gold, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  weekBarLabel: { color: Colors.textMuted, fontSize: 11 },

  appRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  appIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  appLetter: { fontSize: 15, fontWeight: '700' },
  appRowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  appName: { color: Colors.textPrimary, fontSize: 13, fontWeight: '500' },
  appTime: { color: Colors.textSecondary, fontSize: 12 },
  progressBg: { height: 4, backgroundColor: Colors.surfaceHigh, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },

  premiumRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
