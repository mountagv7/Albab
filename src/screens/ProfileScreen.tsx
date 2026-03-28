import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AlbabCard } from '../components/AlbabCard';
import { GoldButton } from '../components/GoldButton';
import { Colors } from '../theme/colors';
import { t } from '../i18n';

export function ProfileScreen() {
  const [notifs, setNotifs] = useState(true);
  const [adultFilter, setAdultFilter] = useState(true);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{t('profileTitle')}</Text>

          {/* User row */}
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>A</Text>
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
            colors={['rgba(138,111,46,0.25)', 'rgba(201,168,76,0.06)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumBanner}
          >
            <View style={styles.premiumBannerTop}>
              <Text style={styles.premiumStar}>✦ </Text>
              <Text style={styles.premiumBannerTitle}>{t('upgradeToPremium')}</Text>
            </View>
            <Text style={styles.premiumBannerDesc}>{t('premiumDesc')}</Text>
            <GoldButton label={`${t('premiumYearly')} · ${t('premiumYearlySave')}`} onPress={() => {}} style={{ marginTop: 14 }} />
            <Text style={styles.premiumBannerSub}>{t('premiumMonthly')}</Text>
          </LinearGradient>

          {/* Settings */}
          <AlbabCard padding={0} style={styles.card}>
            <SettingRow
              icon="🛡"
              label={t('adultContentFilter')}
              trailing={<Switch value={adultFilter} onValueChange={setAdultFilter} thumbColor={Colors.gold} trackColor={{ true: Colors.goldDim, false: Colors.surfaceHigh }} />}
              showDivider
            />
            <SettingRow
              icon="🔔"
              label={t('notifications')}
              trailing={<Switch value={notifs} onValueChange={setNotifs} thumbColor={Colors.gold} trackColor={{ true: Colors.goldDim, false: Colors.surfaceHigh }} />}
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
                  <LinearGradient colors={[Colors.goldDim, Colors.gold]} style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>PRO</Text>
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
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  iconWrap: { width: 34, height: 34, borderRadius: 9, backgroundColor: Colors.surfaceHigh, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, color: Colors.textPrimary, fontSize: 14 },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 62 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  title: { color: Colors.textPrimary, fontSize: 22, fontWeight: '700', marginTop: 16, marginBottom: 20 },

  userRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderWidth: 1.5, borderColor: Colors.borderGold,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: { color: Colors.gold, fontSize: 22, fontWeight: '700' },
  userName: { color: Colors.textPrimary, fontSize: 17, fontWeight: '600' },
  freeBadge: { alignSelf: 'flex-start', backgroundColor: Colors.surfaceElevated, borderRadius: 6, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 8, paddingVertical: 3 },
  freeBadgeText: { color: Colors.textSecondary, fontSize: 11 },
  streakBadge: { alignItems: 'center', backgroundColor: 'rgba(255,112,67,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,112,67,0.3)', paddingHorizontal: 12, paddingVertical: 8 },
  streakText: { color: '#FF7043', fontSize: 10, fontWeight: '600' },

  premiumBanner: { borderRadius: 18, borderWidth: 1, borderColor: Colors.borderGold, padding: 20, marginBottom: 14 },
  premiumBannerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  premiumStar: { color: Colors.gold, fontSize: 16 },
  premiumBannerTitle: { color: Colors.gold, fontSize: 16, fontWeight: '700' },
  premiumBannerDesc: { color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },
  premiumBannerSub: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 8 },

  card: { marginBottom: 14 },

  trailingText: { color: Colors.textSecondary, fontSize: 13 },
  trailingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  proBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  proBadgeText: { color: '#000', fontSize: 9, fontWeight: '800' },
  chevron: { color: Colors.textMuted, fontSize: 18 },
  version: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 24 },
});
