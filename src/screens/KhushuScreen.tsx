import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { S } from '../theme/styles';

const _a = (hex: string, op: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${op})`;
};

// ── Data ───────────────────────────────────────────────────────

const PRAYERS = [
  { key: 'Fajr',    fr: 'Fajr',    ar: 'الفجر',   emoji: '🌑', time: '05:12' },
  { key: 'Dhuhr',   fr: 'Dhuhr',   ar: 'الظهر',   emoji: '☀️', time: '13:04' },
  { key: 'Asr',     fr: 'Asr',     ar: 'العصر',   emoji: '🌤', time: '16:38' },
  { key: 'Maghrib', fr: 'Maghrib', ar: 'المغرب',  emoji: '🌅', time: '19:47' },
  { key: 'Isha',    fr: 'Isha',    ar: 'العشاء',  emoji: '🌙', time: '21:22' },
];

const PAYWALL_FEATURES = [
  '🕌 Blocage automatique à chaque prière',
  '⏱ Tu choisis le timing avant / après',
  '🌙 Fonctionne même app fermée',
  '📿 Pour les 5 prières ou celles que tu choisis',
];

const BEFORE_STEPS = [5, 10, 15, 20, 25, 30];
const AFTER_STEPS  = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

function fmtMin(total: number): string {
  const m = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

// ── Toggle switch ──────────────────────────────────────────────

function KhushuToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { accentColor } = useTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  function handlePress() {
    const next = !value;
    Animated.timing(anim, {
      toValue: next ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onChange(next);
  }

  const bgColor   = anim.interpolate({ inputRange: [0, 1], outputRange: ['#2a2a2a', accentColor] });
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [3, 25] });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.toggleTrack, { backgroundColor: bgColor }]}>
        <Animated.View style={[styles.toggleThumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Step picker (replaces HTML range input) ────────────────────

function StepSlider({
  steps, value, onChange, label, unit,
}: {
  steps: number[]; value: number;
  onChange: (v: number) => void;
  label: string; unit: string;
}) {
  const { accentColor, accentBg } = useTheme();
  return (
    <View>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <View style={[styles.sliderPill, { backgroundColor: accentBg, borderColor: _a(accentColor, 0.3) }]}>
          <Text style={[styles.sliderPillText, { color: accentColor }]}>{value} {unit}</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepsRow}
      >
        {steps.map(s => (
          <TouchableOpacity
            key={s}
            onPress={() => onChange(s)}
            style={[styles.stepBtn, s === value && [styles.stepBtnActive, { borderColor: accentColor, backgroundColor: accentBg }]]}
          >
            <Text style={[styles.stepText, s === value && { color: accentColor }]}>
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.sliderMinMax}>
        <Text style={styles.sliderMinMaxText}>{steps[0]} min</Text>
        <Text style={styles.sliderMinMaxText}>{steps[steps.length - 1]} min</Text>
      </View>
    </View>
  );
}

// ── Paywall ────────────────────────────────────────────────────

function PaywallScreen({ onUnlock, onBack }: { onUnlock: () => void; onBack: () => void }) {
  const { accentColor, accentDim } = useTheme();
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Retour</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.paywallScroll}
        >
          {/* Hero */}
          <View style={styles.paywallHero}>
            <Text style={[styles.premiumTag, { color: accentColor }]}>FONCTIONNALITÉ PREMIUM</Text>
            <Text style={styles.paywallLock}>🔒</Text>
            <Text style={styles.paywallTitle}>Mode Khushu</Text>
            <Text style={[styles.paywallAr, { color: accentColor }]}>خشوع</Text>
            <Text style={styles.paywallDesc}>
              Albab bloque automatiquement les apps distrayantes avant et après
              chaque prière — sans aucune action de ta part.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.card}>
            {PAYWALL_FEATURES.map((f, i) => (
              <View
                key={i}
                style={[
                  styles.featureRow,
                  i < PAYWALL_FEATURES.length - 1 && styles.featureRowBorder,
                ]}
              >
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity onPress={onUnlock} activeOpacity={0.85}>
            <LinearGradient
              colors={[accentColor, accentDim]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaBtn}
            >
              <Text style={styles.ctaBtnText}>Passer à Premium — 6,99$/mois</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.ctaHint}>
            Essai gratuit 7 jours · Annulable à tout moment
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ── Config ─────────────────────────────────────────────────────

function ConfigScreen({ onBack }: { onBack: () => void }) {
  const { accentColor, accentBg, accentDim } = useTheme();
  const [enabled, setEnabled] = useState(true);
  const [before, setBefore] = useState(15);
  const [after,  setAfter]  = useState(30);
  const [selectedPrayers, setSelectedPrayers] = useState<Record<string, boolean>>({
    Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true,
  });
  const [saved, setSaved] = useState(false);

  function togglePrayer(key: string) {
    setSelectedPrayers(p => ({ ...p, [key]: !p[key] }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => onBack(), 2500);
  }

  // Timeline Maghrib example
  const [mH, mM] = '19:47'.split(':').map(Number);
  const base = mH * 60 + mM;
  const timeline = [
    { dot: accentColor,  text: '🔒 Blocage démarre',       time: fmtMin(base - before) },
    { dot: Colors.green, text: '🕌 Maghrib — الله أكبر',    time: '19:47' },
    { dot: '#444',       text: '✅ Déblocage automatique',  time: fmtMin(base + after) },
  ];

  // ── Success overlay ──
  if (saved) {
    return (
      <View style={[styles.container, styles.successCenter]}>
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>Khushu activé</Text>
        <Text style={styles.successDesc}>
          Le blocage automatique est configuré.{'\n'}
          Que Allah facilite tes prières.
        </Text>
        <Text style={[styles.successAr, { color: accentColor }]}>بسم الله</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Retour</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.configScroll}
        >
          {/* Header */}
          <View style={styles.configHeader}>
            <Text style={styles.premiumTag}>PREMIUM · ACTIF</Text>
            <Text style={styles.configTitle}>Mode Khushu</Text>
            <Text style={[styles.configAr, { color: accentColor }]}>خشوع</Text>
          </View>

          {/* Master toggle */}
          <View style={[styles.card, enabled && { borderColor: _a(accentColor, 0.3) }]}>
            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Khushu automatique</Text>
                <Text style={[
                  styles.toggleStatus,
                  { color: enabled ? accentColor : Colors.textMuted },
                ]}>
                  {enabled ? '● Actif — tourne en arrière-plan' : 'Désactivé'}
                </Text>
              </View>
              <KhushuToggle value={enabled} onChange={setEnabled} />
            </View>
          </View>

          {enabled && (
            <>
              {/* Timing sliders */}
              <View style={styles.card}>
                <StepSlider
                  steps={BEFORE_STEPS} value={before} onChange={setBefore}
                  label="BLOCAGE AVANT LA PRIÈRE" unit="min avant"
                />
                <View style={styles.divider} />
                <StepSlider
                  steps={AFTER_STEPS} value={after} onChange={setAfter}
                  label="BLOCAGE APRÈS LA PRIÈRE" unit="min après"
                />
              </View>

              {/* Timeline */}
              <View style={[styles.timelineCard, { backgroundColor: _a(accentColor, 0.04), borderColor: _a(accentColor, 0.15) }]}>
                <Text style={styles.sectionLabel}>EXEMPLE — MAGHRIB (19:47)</Text>
                {timeline.map((item, i) => (
                  <View key={i}>
                    <View style={styles.timelineRow}>
                      <View style={[styles.timelineDot, { backgroundColor: item.dot }]} />
                      <Text style={styles.timelineText}>{item.text}</Text>
                      <Text style={styles.timelineTime}>{item.time}</Text>
                    </View>
                    {i < timeline.length - 1 && (
                      <View style={styles.timelineConnector} />
                    )}
                  </View>
                ))}
              </View>

              {/* Prayers */}
              <View style={styles.card}>
                <Text style={[styles.sectionLabel, { marginBottom: 16 }]}>
                  PRIÈRES CONCERNÉES
                </Text>
                {PRAYERS.map((p, i) => (
                  <TouchableOpacity
                    key={p.key}
                    onPress={() => togglePrayer(p.key)}
                    activeOpacity={0.75}
                    style={[
                      styles.prayerRow,
                      selectedPrayers[p.key]
                        ? [styles.prayerRowActive, { backgroundColor: _a(accentColor, 0.06), borderColor: _a(accentColor, 0.25) }]
                        : styles.prayerRowInactive,
                      i < PRAYERS.length - 1 && { marginBottom: 9 },
                    ]}
                  >
                    <Text style={styles.prayerEmoji}>{p.emoji}</Text>
                    <View style={styles.prayerInfo}>
                      <Text style={styles.prayerName}>{p.fr}</Text>
                      <Text style={styles.prayerMeta}>{p.ar} · {p.time}</Text>
                    </View>
                    <View style={[
                      styles.checkbox,
                      selectedPrayers[p.key]
                        ? [styles.checkboxChecked, { backgroundColor: accentColor, borderColor: accentColor }]
                        : styles.checkboxUnchecked,
                    ]}>
                      {selectedPrayers[p.key] && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Save button */}
          <TouchableOpacity onPress={handleSave} activeOpacity={0.85}>
            {enabled ? (
              <LinearGradient
                colors={[accentColor, accentDim]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveBtn}
              >
                <Text style={styles.saveBtnTextDark}>Activer Khushu — بسم الله</Text>
              </LinearGradient>
            ) : (
              <View style={styles.saveBtnDisabled}>
                <Text style={styles.saveBtnTextMuted}>Désactiver Khushu</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.saveHint}>
            Fonctionne en arrière-plan même si Albab est fermée.{' '}
            Les heures sont calculées selon ta position GPS.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ── Main export ────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

export function KhushuScreen({ onBack }: Props) {
  const [isPremium, setIsPremium] = useState(false);

  if (!isPremium) {
    return (
      <PaywallScreen
        onUnlock={() => setIsPremium(true)}
        onBack={onBack}
      />
    );
  }
  return <ConfigScreen onBack={onBack} />;
}

// ── Styles ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  topBar:   { paddingHorizontal: 23, paddingTop: 14 },
  backBtn:  { ...S.backBtn },
  backText: { ...S.backText },

  // ── Paywall ──
  paywallScroll: { paddingHorizontal: 23, paddingBottom: 48 },
  paywallHero:   { paddingTop: 16, marginBottom: 28, alignItems: 'center' },
  premiumTag:    { fontSize: 11, letterSpacing: 1, marginBottom: 20 },
  paywallLock:   { fontSize: 52, marginBottom: 16 },
  paywallTitle:  { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  paywallAr:     { fontSize: 26, opacity: 0.7, marginBottom: 16 },
  paywallDesc:   { ...S.bodySecondary, textAlign: 'center' },

  // Features list
  featureRow:       { paddingVertical: 12 },
  featureRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  featureText:      { fontSize: 13, color: Colors.textSecondary },

  // CTA
  ctaBtn:     { borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 12 },
  ctaBtnText: { ...S.btnLabel, color: '#000' },
  ctaHint:    { textAlign: 'center', ...S.label },

  // ── Config ──
  configScroll:  { paddingHorizontal: 23, paddingBottom: 48 },
  configHeader:  { paddingTop: 8, marginBottom: 20 },
  configTitle:   { fontSize: 28, fontWeight: '700', color: Colors.textPrimary },
  configAr:      { fontSize: 22, opacity: 0.6, marginTop: 2 },

  // Card
  card: {
    ...S.card,
    borderRadius: 18,
    padding:      19,
    marginBottom: 14,
  },
  cardGoldBorder: {},

  // Toggle
  toggleRow:    { ...S.row, gap: 16 },
  toggleTitle:  { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  toggleStatus: { fontSize: 13, marginTop: 3 },
  toggleTrack:  { width: 52, height: 30, borderRadius: 15, justifyContent: 'center' },
  toggleThumb: {
    position: 'absolute',
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.3,
    shadowRadius: 3, shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  // Step slider
  sliderHeader:     { ...S.rowBetween, marginBottom: 12 },
  sliderLabel:      { ...S.label, fontSize: 11 },
  sliderPill:       { ...S.pill, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: 'transparent' },
  sliderPillText:   { fontSize: 14, fontWeight: '700' },
  stepsRow:         { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  stepBtn: {
    paddingHorizontal: 16,
    paddingVertical:   8,
    borderRadius:      20,
    backgroundColor:   Colors.surfaceHigh,
    borderWidth:       1,
    borderColor:       Colors.border,
  },
  stepBtnActive:    {},
  stepText:         { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  stepTextActive:   {},
  sliderMinMax:     { ...S.rowBetween, marginTop: 6 },
  sliderMinMaxText: { fontSize: 10, color: Colors.textMuted },

  divider: { ...S.divider, marginVertical: 19 },

  // Timeline
  timelineCard:     { borderWidth: 1, borderRadius: 18, padding: 19, marginBottom: 14 },
  sectionLabel:     { ...S.label, fontSize: 11 },
  timelineRow:      { ...S.row, gap: 12 },
  timelineDot:      { width: 10, height: 10, borderRadius: 5 },
  timelineText:     { flex: 1, fontSize: 13, color: Colors.textSecondary },
  timelineTime:     { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, fontVariant: ['tabular-nums'] },
  timelineConnector: { width: 1, height: 18, backgroundColor: Colors.border, marginLeft: 4.5, marginVertical: 2 },

  // Prayer rows
  prayerRow:         { ...S.row, gap: 14, padding: 12, borderRadius: 12, borderWidth: 1 },
  prayerRowActive:   {},
  prayerRowInactive: { backgroundColor: Colors.surfaceDark, borderColor: Colors.border },
  prayerEmoji:       { fontSize: 19 },
  prayerInfo:        { flex: 1 },
  prayerName:        { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  prayerMeta:        { fontSize: 12, color: Colors.textMuted },
  checkbox:          { width: 26, height: 26, borderRadius: 7, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked:   {},
  checkboxUnchecked: { backgroundColor: 'transparent', borderColor: '#333' },
  checkmark:         { fontSize: 14, color: '#000', fontWeight: '700' },

  // Save button
  saveBtn:         { borderRadius: 16, paddingVertical: 19, alignItems: 'center', marginBottom: 14 },
  saveBtnDisabled: { borderRadius: 16, paddingVertical: 19, alignItems: 'center', backgroundColor: Colors.surfaceCard, borderWidth: 1, borderColor: Colors.border, marginBottom: 14 },
  saveBtnTextDark: { ...S.btnLabel, color: '#000' },
  saveBtnTextMuted: { ...S.btnLabel, color: Colors.textMuted },
  saveHint:        { textAlign: 'center', ...S.label, lineHeight: 19 },

  // Success
  successCenter: { alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 40 },
  successEmoji:  { fontSize: 56 },
  successTitle:  { ...S.screenTitle, marginTop: 0, marginBottom: 0 },
  successDesc:   { ...S.bodySecondary, color: Colors.textMuted, textAlign: 'center' },
  successAr:     { fontSize: 24, opacity: 0.7 },
});
