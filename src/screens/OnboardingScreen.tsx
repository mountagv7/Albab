import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GlowingLogo } from '../components/GlowingLogo';
import { GoldButton } from '../components/GoldButton';
import { Colors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';
import { S } from '../theme/styles';

const { height } = Dimensions.get('window');

const FEATURES = [
  { icon: '⏱', title: 'Focus Sessions', subtitle: 'Block distractions, protect your time' },
  { icon: '🛡', title: 'App Blocking', subtitle: 'Keep distracting apps away' },
  { icon: '✨', title: 'Islamic Reminders', subtitle: 'Stay connected to what matters' },
];

interface Props {
  onDone: () => void;
}

export function OnboardingScreen({ onDone }: Props) {
  const { accentBg, accentBorder } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <GlowingLogo size={190} />
          </Animated.View>

          <Animated.View style={[styles.titleBlock, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.appName}>{t('appName')}</Text>
            <Text style={styles.tagline}>{t('appTagline')}</Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.features, { opacity: fadeAnim }]}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: accentBg, borderColor: accentBorder }]}>
                <Text style={styles.featureEmoji}>{f.icon}</Text>
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSubtitle}>{f.subtitle}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.bottom, { opacity: fadeAnim }]}>
          <GoldButton label={t('tryForFree')} onPress={onDone} />
          <TouchableOpacity onPress={onDone} style={styles.skipBtn}>
            <Text style={styles.skipText}>{t('continueWithFree')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1 },
  safe:       { flex: 1, paddingHorizontal: 24 },
  top:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  titleBlock: { alignItems: 'center', gap: 6 },
  appName:    { color: Colors.textPrimary, fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  tagline:    { color: Colors.textSecondary, fontSize: 16 },
  features:   { gap: 14, marginBottom: 32 },
  featureRow: { ...S.row, gap: 14 },
  featureIcon: {
    ...S.iconBox,
    width:  44,
    height: 44,
    borderWidth: 1,
  },
  featureEmoji:    { fontSize: 20 },
  featureText:     { flex: 1, gap: 2 },
  featureTitle:    { color: Colors.textPrimary, fontSize: 14, fontWeight: '600' },
  featureSubtitle: { color: Colors.textSecondary, fontSize: 12 },
  bottom:   { gap: 10, paddingBottom: 8 },
  skipBtn:  { alignItems: 'center', paddingVertical: 10 },
  skipText: { ...S.meta },
});
