import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';

const GOLD = Colors.gold;

// ── Feature list ──────────────────────────────────────────────
const PREMIUM_FEATURES = [
  { title: 'Khushu Mode',        sub: 'Blocage automatique autour de chaque prière' },
  { title: 'Challenge Mode',     sub: 'Défis thématiques et personnalisés pour booster ton focus' },
  { title: 'Sessions illimitées',sub: 'Pas de limite quotidienne' },
  { title: 'Sessions récurrentes',sub: "Planifie tes blocs de focus à l'avance" },
  { title: 'Badges islamiques',  sub: 'Débloque des récompenses qui reflètent tes valeurs et ta progression spirituelle' },
  { title: 'Stats avancées',     sub: 'Historique complet et analyse de ton focus' },
];

// ── SVG Icons ─────────────────────────────────────────────────
function MoonIcon({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
      <Path
        d="M2 6.5L5 9.5L11 3.5"
        stroke={GOLD} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function HeartIcon({ size = 13 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        stroke={GOLD} strokeWidth={1.5} strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Success screen ────────────────────────────────────────────
function SuccessView({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={success.wrap}>
      <View style={success.iconRing}>
        <MoonIcon size={40} />
      </View>
      <Text style={success.title}>Bienvenue</Text>
      <Text style={success.ar}>بارك الله فيك</Text>
      <Text style={success.sub}>
        Que Allah bénisse ton temps et facilite tes prières.
      </Text>
      <TouchableOpacity onPress={onClose} style={success.btn}>
        <Text style={success.btnText}>Fermer</Text>
      </TouchableOpacity>
    </View>
  );
}

const success = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
    gap: 12,
  },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  ar: { fontSize: 22, color: GOLD, opacity: 0.85 },
  sub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },
  btn: {
    marginTop: 12,
    backgroundColor: Colors.goldBg,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.3)',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  btnText: { fontSize: 14, color: GOLD, fontWeight: '600' },
});

// ── Main component ────────────────────────────────────────────
interface Props {
  onClose: () => void;
}

type Plan = 'monthly' | 'yearly';

const PLANS: { key: Plan; label: string; price: string; badge?: string }[] = [
  { key: 'monthly', label: 'Mensuel',  price: '6,99 $/mois' },
  { key: 'yearly',  label: 'Annuel',   price: '55,99 $/an', badge: '-33%' },
];

export function PaywallContent({ onClose }: Props) {
  const [plan, setPlan] = useState<Plan>('yearly');
  const [done, setDone] = useState(false);

  if (done) {
    return <SuccessView onClose={onClose} />;
  }

  return (
    <View style={styles.root}>
      {/* ── Scrollable body ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <MoonIcon size={36} />
          </View>

          <Text style={styles.overline}>ALBAB PREMIUM</Text>

          <View style={styles.memberRow}>
            <HeartIcon size={12} />
            <Text style={styles.memberText}>
              Membre gratuit depuis le{' '}
              <Text style={styles.memberDate}>3 avril 2026</Text>
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Passe à Premium et reprends le contrôle de ton temps.
          </Text>
          <Text style={styles.heroSub}>
            Débloquer tout Albab — pour mieux servir Allah.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featureList}>
          {PREMIUM_FEATURES.map((f, i) => (
            <View
              key={i}
              style={[
                styles.featureRow,
                i < PREMIUM_FEATURES.length - 1 && styles.featureRowBorder,
              ]}
            >
              <View style={styles.checkWrap}>
                <CheckIcon />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSub}>{f.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plan selector */}
        <View style={styles.planWrap}>
          <View style={styles.planTrack}>
            {PLANS.map((p) => {
              const active = plan === p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={styles.planBtnWrap}
                  onPress={() => setPlan(p.key)}
                  activeOpacity={0.85}
                >
                  {p.badge && (
                    <View style={styles.planBadge}>
                      <Text style={styles.planBadgeText}>{p.badge}</Text>
                    </View>
                  )}
                  {active ? (
                    <LinearGradient
                      colors={[GOLD, '#a8782a']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.planBtn}
                    >
                      <Text style={[styles.planLabel, styles.planLabelActive]}>
                        {p.label}
                      </Text>
                      <Text style={[styles.planPrice, styles.planPriceActive]}>
                        {p.price}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.planBtn, styles.planBtnInactive]}>
                      <Text style={styles.planLabel}>{p.label}</Text>
                      <Text style={styles.planPrice}>{p.price}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Hadith */}
        <View style={styles.hadithWrap}>
          <Text style={styles.hadithAr}>
            "نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ الصِّحَّةُ وَالْفَرَاغُ"
          </Text>
          <Text style={styles.hadithFr}>
            "Deux bienfaits dont beaucoup sont négligents : la santé et le temps libre." — Bukhari
          </Text>
        </View>
      </ScrollView>

      {/* ── Fixed CTA ── */}
      <View style={styles.cta}>
        <TouchableOpacity onPress={() => setDone(true)} activeOpacity={0.88}>
          <LinearGradient
            colors={[GOLD, '#a8782a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaBtn}
          >
            <Text style={styles.ctaText}>Essayer gratuitement — 7 jours</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.ctaSub}>
          {plan === 'monthly'
            ? 'Puis 6,99 $/mois · Annulable à tout moment'
            : 'Puis 55,99 $/an · ~4,67 $/mois · Annulable à tout moment'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingBottom: 24 },

  // ── Hero
  hero: { alignItems: 'center', paddingHorizontal: 28, paddingTop: 12, paddingBottom: 24 },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  overline: {
    fontSize: 11,
    color: GOLD,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  memberText: { fontSize: 13, color: Colors.textMuted },
  memberDate: { color: Colors.textSecondary, fontWeight: '600' },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },

  // ── Features
  featureList: {
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13,
    paddingVertical: 13,
  },
  featureRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  checkWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.goldBg,
    borderWidth: 1.5,
    borderColor: 'rgba(201,168,76,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  featureSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
    lineHeight: 18,
  },

  // ── Plan selector
  planWrap: { paddingHorizontal: 24, marginBottom: 20 },
  planTrack: {
    backgroundColor: '#0d0d0d',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 4,
    flexDirection: 'row',
    gap: 4,
  },
  planBtnWrap: { flex: 1, position: 'relative' },
  planBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  planBtnInactive: { backgroundColor: 'transparent' },
  planLabel: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  planLabelActive: { color: '#000' },
  planPrice: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  planPriceActive: { color: 'rgba(0,0,0,0.55)' },
  planBadge: {
    position: 'absolute',
    top: -10,
    right: 6,
    zIndex: 1,
    backgroundColor: Colors.green,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  planBadgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },

  // ── Hadith
  hadithWrap: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 8,
    gap: 8,
    opacity: 0.55,
  },
  hadithAr: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  hadithFr: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
  },

  // ── CTA
  cta: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: Colors.surface,
  },
  ctaBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#000' },
  ctaSub: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
  },
});
