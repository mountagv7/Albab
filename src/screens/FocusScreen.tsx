import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  ScrollView, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AlbabCard } from '../components/AlbabCard';
import { GoldButton } from '../components/GoldButton';
import { PremiumBadge } from '../components/PremiumBadge';
import { Colors } from '../theme/colors';
import { t } from '../i18n';

type SessionState = 'idle' | 'running' | 'paused' | 'complete';
const DURATIONS = [15, 20, 25, 30, 45, 60];
const RING = 100; // radius for SVG-less ring

export function FocusScreen() {
  const [state, setState] = useState<SessionState>('idle');
  const [selectedMin, setSelectedMin] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [showPremium, setShowPremium] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progress = state === 'idle' ? 0 : 1 - remaining / (selectedMin * 60);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  function start() {
    setRemaining(selectedMin * 60);
    setState('running');
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          setState('complete');
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }

  function pause() {
    clearInterval(intervalRef.current!);
    setState('paused');
  }

  function resume() {
    setState('running');
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          setState('complete');
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }

  function end() {
    clearInterval(intervalRef.current!);
    setState('idle');
    setRemaining(selectedMin * 60);
  }

  function fmt(s: number) {
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }

  const ringColor = state === 'complete' ? Colors.productive : Colors.gold;
  const circumference = 2 * Math.PI * RING;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{t('focusSession')}</Text>

          {/* Timer ring */}
          <View style={styles.timerWrapper}>
            <View style={styles.ringOuter}>
              {/* Background ring */}
              <View style={styles.ringBg} />
              {/* Progress indicator using border trick */}
              <View style={[styles.ringProgress, {
                borderColor: state === 'idle' ? 'transparent' : ringColor,
                opacity: state === 'idle' ? 0 : 1,
              }]} />
              {/* Inner circle */}
              <View style={[styles.ringInner, state === 'running' && styles.ringInnerGlow]}>
                {state === 'complete' ? (
                  <View style={{ alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 40 }}>✓</Text>
                    <Text style={styles.timerText}>{t('wellDone')}</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.timerText}>
                      {state === 'idle' ? `${selectedMin}:00` : fmt(remaining)}
                    </Text>
                    <Text style={[styles.timerSub, state === 'paused' && { color: Colors.warning }]}>
                      {state === 'paused' ? 'PAUSED' : t('focusDuration').toUpperCase()}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Duration picker */}
          {state === 'idle' && (
            <View style={styles.pickerSection}>
              <Text style={styles.pickerLabel}>{t('focusDuration')} ({t('minutes')})</Text>
              <View style={styles.pickerRow}>
                {DURATIONS.map(min => (
                  <TouchableOpacity
                    key={min}
                    onPress={() => { setSelectedMin(min); setRemaining(min * 60); }}
                    style={[styles.pickerItem, min === selectedMin && styles.pickerItemActive]}
                  >
                    <Text style={[styles.pickerItemText, min === selectedMin && styles.pickerItemTextActive]}>
                      {min}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Controls */}
          <View style={styles.controls}>
            {state === 'idle' || state === 'complete' ? (
              <GoldButton label={state === 'complete' ? t('startSession') : t('startSession')} onPress={state === 'complete' ? end : start} />
            ) : (
              <View style={styles.controlRow}>
                <TouchableOpacity style={styles.secondaryBtn} onPress={end}>
                  <Text style={styles.secondaryBtnText}>{t('endSession')}</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <GoldButton
                    label={state === 'running' ? t('pauseSession') : t('resumeSession')}
                    onPress={state === 'running' ? pause : resume}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Khushu Mode card */}
          <AlbabCard goldBorder onPress={() => setShowPremium(true)} style={styles.khushuCard}>
            <View style={styles.khushuInner}>
              <View style={styles.khushuIcon}>
                <Text style={{ fontSize: 22 }}>☪</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <View style={styles.khushuTitleRow}>
                  <Text style={styles.khushuTitle}>{t('khushuMode')}</Text>
                  <PremiumBadge />
                </View>
                <Text style={styles.khushuDesc}>{t('khushuModeDesc')}</Text>
              </View>
              <Text style={{ color: Colors.gold, fontSize: 18 }}>›</Text>
            </View>
          </AlbabCard>

          {/* Challenge Mode card */}
          <AlbabCard style={styles.khushuCard}>
            <View style={styles.khushuInner}>
              <View style={[styles.khushuIcon, { backgroundColor: 'rgba(255,107,138,0.1)' }]}>
                <Text style={{ fontSize: 22 }}>🏆</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <View style={styles.khushuTitleRow}>
                  <Text style={styles.khushuTitle}>{t('challengeMode')}</Text>
                  <PremiumBadge />
                </View>
                <Text style={styles.khushuDesc}>{t('challengeModeDesc')}</Text>
              </View>
              <Text style={{ color: Colors.textMuted, fontSize: 18 }}>›</Text>
            </View>
          </AlbabCard>
        </ScrollView>
      </SafeAreaView>

      {/* Premium Modal */}
      <Modal visible={showPremium} transparent animationType="slide" onRequestClose={() => setShowPremium(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPremium(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={{ fontSize: 42, textAlign: 'center', marginBottom: 12 }}>☪</Text>
          <Text style={styles.sheetTitle}>{t('khushuMode')}</Text>
          <Text style={styles.sheetDesc}>{t('premiumDesc')}</Text>

          <TouchableOpacity style={styles.planBest}>
            <LinearGradient colors={['rgba(201,168,76,0.1)', 'transparent']} style={styles.planGrad}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.planLabelGold}>{t('premiumYearly')}</Text>
                <View style={styles.bestTag}><Text style={styles.bestTagText}>BEST</Text></View>
              </View>
              <Text style={styles.planSave}>{t('premiumYearlySave')}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.planNormal}>
            <Text style={styles.planLabel}>{t('premiumMonthly')}</Text>
          </TouchableOpacity>

          <GoldButton label={t('freeTrialDays')} onPress={() => setShowPremium(false)} style={{ marginTop: 20 }} />
          <TouchableOpacity onPress={() => setShowPremium(false)} style={{ alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ color: Colors.textMuted, fontSize: 13 }}>{t('continueWithFree')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  title: { color: Colors.textPrimary, fontSize: 22, fontWeight: '700', marginTop: 16, marginBottom: 28 },

  timerWrapper: { alignItems: 'center', marginBottom: 28 },
  ringOuter: { width: 240, height: 240, alignItems: 'center', justifyContent: 'center' },
  ringBg: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    borderWidth: 6, borderColor: Colors.surfaceHigh,
  },
  ringProgress: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    borderWidth: 6, borderTopColor: 'transparent', borderRightColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
  },
  ringInner: {
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  ringInnerGlow: {
    shadowColor: Colors.gold, shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: 0 },
  },
  timerText: { color: Colors.textPrimary, fontSize: 42, fontWeight: '700', letterSpacing: -1 },
  timerSub: { color: Colors.textMuted, fontSize: 10, fontWeight: '600', letterSpacing: 1.2 },

  pickerSection: { alignItems: 'center', gap: 12, marginBottom: 24 },
  pickerLabel: { color: Colors.textSecondary, fontSize: 12 },
  pickerRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  pickerItem: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10,
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
  },
  pickerItemActive: { borderColor: Colors.gold, backgroundColor: 'rgba(201,168,76,0.12)' },
  pickerItemText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  pickerItemTextActive: { color: Colors.gold },

  controls: { marginBottom: 24 },
  controlRow: { flexDirection: 'row', gap: 12 },
  secondaryBtn: {
    flex: 1, height: 54, borderRadius: 14,
    backgroundColor: Colors.surfaceElevated, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  secondaryBtnText: { color: Colors.textSecondary, fontSize: 15, fontWeight: '600' },

  khushuCard: { marginBottom: 12 },
  khushuInner: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  khushuIcon: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1, borderColor: Colors.borderGold,
    alignItems: 'center', justifyContent: 'center',
  },
  khushuTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  khushuTitle: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600' },
  khushuDesc: { color: Colors.textSecondary, fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 1, borderColor: Colors.borderGold,
    padding: 20, paddingBottom: 40,
  },
  sheetHandle: { width: 36, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 24 },
  sheetTitle: { color: Colors.textPrimary, fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  sheetDesc: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  planBest: {
    borderRadius: 14, borderWidth: 1, borderColor: Colors.gold,
    overflow: 'hidden', marginBottom: 10,
  },
  planGrad: { padding: 16 },
  planLabelGold: { color: Colors.gold, fontSize: 15, fontWeight: '600' },
  planSave: { color: Colors.productive, fontSize: 12, marginTop: 2 },
  planNormal: {
    borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated, padding: 16, alignItems: 'center',
  },
  planLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: '500' },
  bestTag: { backgroundColor: 'rgba(201,168,76,0.2)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  bestTagText: { color: Colors.gold, fontSize: 10, fontWeight: '700' },
});
