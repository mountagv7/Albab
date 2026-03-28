import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowingLogo } from '../components/GlowingLogo';
import { AlbabCard } from '../components/AlbabCard';
import { Colors } from '../theme/colors';
import { t } from '../i18n';

const MOCK_BARS = [
  { label: 'Mon', productive: 0.7, distracting: 0.3 },
  { label: 'Tue', productive: 0.5, distracting: 0.6 },
  { label: 'Wed', productive: 0.8, distracting: 0.2 },
  { label: 'Thu', productive: 0.4, distracting: 0.7 },
  { label: 'Fri', productive: 0.9, distracting: 0.15 },
  { label: 'Sat', productive: 0.3, distracting: 0.8 },
  { label: 'Sun', productive: 0.6, distracting: 0.4 },
];

const BAR_MAX = 64;

export function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.appName}>{t('appName')}</Text>
              <Text style={styles.tagline}>{t('appTagline')}</Text>
            </View>
            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>{t('today')}</Text>
            </View>
          </View>

          {/* Logo + screen time */}
          <Animated.View style={[styles.logoSection, { opacity: fadeAnim }]}>
            <GlowingLogo size={175} />
            <Text style={styles.screenTime}>2h 18m</Text>
            <Text style={styles.screenTimeLabel}>{t('screenTimeToday')}</Text>
          </Animated.View>

          {/* Stat mini cards */}
          <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
            {/* Left */}
            <View style={[styles.miniCard, { flex: 1 }]}>
              <View style={styles.miniCardHeader}>
                <View style={[styles.appDot, { backgroundColor: '#E1306C' }]}><Text style={styles.appLetter}>I</Text></View>
                <Text style={styles.miniLabel}>{t('mostUsed')}</Text>
              </View>
              <Text style={styles.miniValue}>Instagram</Text>
              <Text style={styles.miniSub}>50m</Text>
            </View>

            {/* Center */}
            <View style={[styles.miniCard, styles.miniCardCenter, { flex: 1 }]}>
              <Text style={styles.miniValueLg}>90%</Text>
              <View style={styles.changeTag}>
                <Text style={styles.changeText}>+14.8% ↗</Text>
              </View>
              <Text style={styles.miniSubCenter}>{t('screenTimeDown')}</Text>
            </View>

            {/* Right */}
            <View style={[styles.miniCard, { flex: 1 }]}>
              <View style={styles.miniCardHeader}>
                <View style={[styles.appDot, { backgroundColor: '#111' }]}><Text style={styles.appLetter}>T</Text></View>
                <Text style={styles.miniLabel}>{t('mostUsed')}</Text>
              </View>
              <Text style={styles.miniValue}>TikTok</Text>
              <Text style={styles.miniSub}>33m</Text>
            </View>
          </Animated.View>

          {/* Bar chart */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <AlbabCard style={styles.chartCard}>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.productive }]} />
                  <Text style={styles.legendText}>{t('productive')}</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: Colors.distracting }]} />
                  <Text style={styles.legendText}>{t('distracting')}</Text>
                </View>
              </View>
              <View style={styles.barsRow}>
                {MOCK_BARS.map((d, i) => (
                  <View key={i} style={styles.barGroup}>
                    <View style={styles.barPair}>
                      <View style={[styles.bar, { height: BAR_MAX * d.productive, backgroundColor: Colors.productive }]} />
                      <View style={[styles.bar, { height: BAR_MAX * d.distracting, backgroundColor: Colors.distracting }]} />
                    </View>
                    <Text style={styles.barLabel}>{d.label}</Text>
                  </View>
                ))}
              </View>
            </AlbabCard>
          </Animated.View>

          {/* Islamic reminder */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <AlbabCard goldBorder style={styles.reminderCard}>
              <View style={styles.reminderHeader}>
                <View style={styles.reminderBar} />
                <Text style={styles.reminderTitle}>{t('reminder')}</Text>
              </View>
              <Text style={styles.arabicText}>وَالْعَصْرِ ﴿١﴾ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ</Text>
              <Text style={styles.reminderTranslation}>
                "By time, indeed, mankind is in loss."
              </Text>
              <Text style={styles.reminderSource}>Surah Al-Asr, 103:1-2</Text>
            </AlbabCard>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  appName: { color: Colors.textPrimary, fontSize: 22, fontWeight: '800' },
  tagline: { color: Colors.textSecondary, fontSize: 12 },
  todayBadge: { backgroundColor: Colors.surfaceElevated, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 7 },
  todayText: { color: Colors.textPrimary, fontSize: 13, fontWeight: '600' },

  logoSection: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  screenTime: { color: Colors.textPrimary, fontSize: 44, fontWeight: '700', letterSpacing: -1 },
  screenTimeLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 1.5 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  miniCard: {
    backgroundColor: Colors.surfaceElevated, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, padding: 12, gap: 4,
  },
  miniCardCenter: { alignItems: 'center', justifyContent: 'center' },
  miniCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  appDot: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  appLetter: { color: '#fff', fontSize: 12, fontWeight: '700' },
  miniLabel: { color: Colors.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  miniValue: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700' },
  miniValueLg: { color: Colors.textPrimary, fontSize: 22, fontWeight: '700' },
  miniSub: { color: Colors.textSecondary, fontSize: 11 },
  miniSubCenter: { color: Colors.textSecondary, fontSize: 9, textAlign: 'center', marginTop: 2 },
  changeTag: { backgroundColor: 'rgba(93,217,193,0.15)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3, marginVertical: 4 },
  changeText: { color: Colors.productive, fontSize: 11, fontWeight: '700' },

  chartCard: { marginBottom: 14 },
  legendRow: { flexDirection: 'row', gap: 20, marginBottom: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: Colors.textSecondary, fontSize: 10, fontWeight: '600', letterSpacing: 0.8 },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 90 },
  barGroup: { alignItems: 'center', gap: 6 },
  barPair: { flexDirection: 'row', gap: 2, alignItems: 'flex-end' },
  bar: { width: 11, borderRadius: 3, minHeight: 4 },
  barLabel: { color: Colors.textMuted, fontSize: 10 },

  reminderCard: { marginBottom: 14 },
  reminderHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  reminderBar: { width: 3, height: 14, backgroundColor: Colors.gold, borderRadius: 2 },
  reminderTitle: { color: Colors.gold, fontSize: 9, fontWeight: '700', letterSpacing: 1.2 },
  arabicText: { color: Colors.textPrimary, fontSize: 17, lineHeight: 28, textAlign: 'right', marginBottom: 8 },
  reminderTranslation: { color: Colors.textSecondary, fontSize: 13, fontStyle: 'italic', lineHeight: 20, marginBottom: 6 },
  reminderSource: { color: Colors.textMuted, fontSize: 11 },
});
