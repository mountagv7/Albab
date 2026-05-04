import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AlbabCard } from '../components/AlbabCard';
import { GoldButton } from '../components/GoldButton';
import { ThemeSheet } from '../components/ThemeSheet';
import { Colors } from '../theme/colors';
import { useTheme, THEME_COLORS } from '../context/ThemeContext';
import { t } from '../i18n';
import { S } from '../theme/styles';

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
      <Text style={styles.sectionHeading}>Apparence</Text>
      <AlbabCard padding={0} style={themeStyles.card}>
        <View style={themeStyles.row}>
          {themeColors.map(color => {
            const isSelected = accentColor === color.hex;
            return (
              <TouchableOpacity
                key={color.hex}
                onPress={() => handleSwatchPress(color)}
                activeOpacity={0.75}
              >
                <View style={[
                  themeStyles.swatchWrap,
                  { shadowColor: color.hex },
                  isSelected && themeStyles.swatchWrapSelected,
                ]}>
                  <View style={[
                    themeStyles.swatch,
                    { backgroundColor: color.hex },
                    isSelected && themeStyles.swatchSelected,
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

const themeStyles = StyleSheet.create({
  card: { marginBottom: 14 },
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
export function ProfileScreen() {
  const { accentColor, accentDim, accentBg, accentBorder, buttonTextColor } = useTheme();
  const [notifs, setNotifs] = useState(true);
  const [adultFilter, setAdultFilter] = useState(true);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{t('profileTitle')}</Text>

          {/* User row */}
          <View style={styles.userRow}>
            <View style={[styles.avatar, { backgroundColor: accentBg, borderColor: accentBorder }]}>
              <Text style={[styles.avatarLetter, { color: accentColor }]}>A</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.userName}>Albab User</Text>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>{t('freePlan')}</Text>
              </View>
            </View>
            <View style={styles.streakBadge}>
              <Text style={{ fontSize: 20 }}>🔥</Text>
              <Text style={styles.streakText}>5 days</Text>
            </View>
          </View>

          {/* Premium banner */}
          <LinearGradient
            colors={[accentBg, accentBg.replace('0.12', '0.04')]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.premiumBanner, { borderColor: accentBorder }]}
          >
            <View style={styles.premiumBannerTop}>
              <Text style={[styles.premiumStar, { color: accentColor }]}>✦ </Text>
              <Text style={[styles.premiumBannerTitle, { color: accentColor }]}>{t('upgradeToPremium')}</Text>
            </View>
            <Text style={styles.premiumBannerDesc}>{t('premiumDesc')}</Text>
            <GoldButton label={`${t('premiumYearly')} · ${t('premiumYearlySave')}`} onPress={() => {}} style={{ marginTop: 14 }} />
            <Text style={styles.premiumBannerSub}>{t('premiumMonthly')}</Text>
          </LinearGradient>

          {/* Thème */}
          <ThemeSection />

          {/* Settings */}
          <AlbabCard padding={0} style={styles.card}>
            <SettingRow
              icon="🛡"
              label={t('adultContentFilter')}
              trailing={<Switch value={adultFilter} onValueChange={setAdultFilter} thumbColor={accentColor} trackColor={{ true: accentDim, false: Colors.surfaceHigh }} />}
              showDivider
            />
            <SettingRow
              icon="🔔"
              label={t('notifications')}
              trailing={<Switch value={notifs} onValueChange={setNotifs} thumbColor={accentColor} trackColor={{ true: accentDim, false: Colors.surfaceHigh }} />}
              showDivider
            />
            <SettingRow
              icon="🌐"
              label={t('language')}
              trailing={<Text style={styles.trailingText}>EN</Text>}
              showDivider
            />
            <SettingRow
              icon="📋"
              label={t('blockingProfiles')}
              trailing={
                <View style={styles.trailingRow}>
                  <LinearGradient colors={[accentDim, accentColor]} style={styles.proBadge}>
                    <Text style={[styles.proBadgeText, { color: buttonTextColor }]}>PRO</Text>
                  </LinearGradient>
                  <Text style={styles.chevron}>›</Text>
                </View>
              }
              showDivider={false}
            />
          </AlbabCard>

          {/* About */}
          <AlbabCard padding={0}>
            <SettingRow
              icon="ℹ️"
              label={t('about')}
              trailing={<Text style={styles.chevron}>›</Text>}
              showDivider
            />
            <SettingRow
              icon="🔄"
              label={t('restorePurchase')}
              trailing={<Text style={styles.chevron}>›</Text>}
              showDivider={false}
            />
          </AlbabCard>

          <Text style={styles.version}>Albab v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SettingRow({ icon, label, trailing, showDivider }: {
  icon: string; label: string; trailing: React.ReactNode; showDivider: boolean;
}) {
  return (
    <>
      <View style={settingStyles.row}>
        <View style={settingStyles.iconWrap}>
          <Text style={{ fontSize: 16 }}>{icon}</Text>
        </View>
        <Text style={settingStyles.label}>{label}</Text>
        {trailing}
      </View>
      {showDivider && <View style={settingStyles.divider} />}
    </>
  );
}

const settingStyles = StyleSheet.create({
  row:     { ...S.row, paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  iconWrap: { width: 34, height: 34, borderRadius: 9, backgroundColor: Colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' },
  label:   { flex: 1, color: Colors.textPrimary, fontSize: 14 },
  divider: { ...S.divider, marginLeft: 62 },
});

const styles = StyleSheet.create({
  container:      { flex: 1 },
  scroll:         { paddingHorizontal: 16, paddingBottom: 32 },
  title:          { ...S.screenTitle, marginBottom: 20 },
  sectionHeading: { color: Colors.textSecondary, fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },

  userRow:      { ...S.row, gap: 14, marginBottom: 16 },
  avatar:       { width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { fontSize: 22, fontWeight: '700' },
  userName:     { color: Colors.textPrimary, fontSize: 17, fontWeight: '600' },
  freeBadge:    { ...S.pill, alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  freeBadgeText: { color: Colors.textSecondary, fontSize: 11 },
  streakBadge:  { alignItems: 'center', backgroundColor: 'rgba(255,112,67,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,112,67,0.3)', paddingHorizontal: 12, paddingVertical: 8 },
  streakText:   { color: '#FF7043', fontSize: 10, fontWeight: '600' },

  premiumBanner:    { borderRadius: 18, borderWidth: 1, padding: 20, marginBottom: 14 },
  premiumBannerTop: { ...S.row, marginBottom: 6 },
  premiumStar:      { fontSize: 16 },
  premiumBannerTitle: { fontSize: 16, fontWeight: '700' },
  premiumBannerDesc:  { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },
  premiumBannerSub:   { ...S.meta, textAlign: 'center', marginTop: 8 },

  card: { marginBottom: 14 },

  trailingText: { color: Colors.textSecondary, fontSize: 13 },
  trailingRow:  { ...S.row, gap: 8 },
  proBadge:     { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  proBadgeText: { fontSize: 9, fontWeight: '800' },
  chevron:      { color: Colors.textMuted, fontSize: 18 },
  version:      { ...S.meta, textAlign: 'center', marginTop: 24 },
});
