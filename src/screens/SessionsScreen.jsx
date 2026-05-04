import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated, Easing, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { S } from '../theme/styles';
import { ProtectionScreen } from './ProtectionScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { BlockingScreenSettings } from './BlockingScreenSettings';

// ── Data ───────────────────────────────────────────────────────────────────────
const SESSION_NAMES = ['Heure du Coran', 'Qiyam al-Layl', 'Travail Halal', 'Étude', 'Révision', 'Dhikr', 'Tahajjud'];
const EMOJIS = ['📖', '🌙', '💼', '📚', '✨', '🤲', '⭐', '🌿'];

const DURATION_VALUES = Array.from({ length: 36 }, (_, i) => (i + 1) * 5); // 5 → 180 step 5
const WHEEL_ITEM_H = 44;
const WHEEL_VISIBLE = 5;
const WHEEL_H = WHEEL_ITEM_H * WHEEL_VISIBLE;
const WHEEL_PAD = WHEEL_ITEM_H * Math.floor(WHEEL_VISIBLE / 2);

const fmtDuration = (d) => {
  if (d < 60) return `${d} min`;
  const h = Math.floor(d / 60);
  const m = d % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
};

const makeTimeDate = (h, m) => new Date(2000, 0, 1, h, m, 0, 0);

const APPS = [
  { name: 'Instagram',   icon: '📸', color: '#E1306C' },
  { name: 'TikTok',      icon: '🎵', color: '#ff0050' },
  { name: 'YouTube',     icon: '▶️',  color: '#FF0000' },
  { name: 'Twitter / X', icon: '✖️',  color: '#1DA1F2' },
  { name: 'Snapchat',    icon: '👻', color: '#FFFC00' },
  { name: 'Reddit',      icon: '🤖', color: '#FF4500' },
  { name: 'Netflix',     icon: '🎬', color: '#E50914' },
  { name: 'Messages',    icon: '💬', color: '#34C759' },
];

const PAUSE_OPTIONS = [
  { key: 'yes',  icon: '✅', label: 'Autorisées',     labelAr: 'مسموح',  sub: '2 pauses par session, durée libre' },
  { key: 'hard', icon: '⚠️', label: 'Avec friction',  labelAr: 'بصعوبة', sub: 'Tu dois justifier ta pause avant de l\'obtenir' },
  { key: 'no',   icon: '🔒', label: 'Non autorisées', labelAr: 'ممنوع',  sub: 'Emergency Break uniquement · 5 min max' },
];

const DAY_CODES = ['MO','TU','WE','TH','FR','SA','SU'];
const daysToIndices = (days) => days.map(d => DAY_CODES.indexOf(d)).filter(i => i >= 0);

const IBADAH_SUGGESTIONS = [
  {
    emoji: '🌙',
    name: 'Jeûne numérique',
    description: 'Déconnecte-toi de Fajr à Maghrib',
    time: 'Fajr – Maghrib',
    days: ['MO','TU','WE','TH','FR','SA','SU'],
    startHour: 5, startMin: 0, endHour: 19, endMin: 0,
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=80',
  },
  {
    emoji: '📖',
    name: 'Lecture du Coran',
    description: 'Garde une relation quotidienne avec le Coran',
    time: '19h – 20h',
    days: ['MO','TU','WE','TH','FR','SA','SU'],
    startHour: 19, startMin: 0, endHour: 20, endMin: 0,
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400&q=80',
  },
  {
    emoji: '🤲',
    name: 'Qiyam al-Layl',
    description: 'Déconnecte-toi et connecte-toi avec ton Créateur',
    time: '1h – 4h',
    days: ['MO','TU','WE','TH','FR','SA','SU'],
    startHour: 1, startMin: 0, endHour: 4, endMin: 0,
    image: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=400&q=80',
  },
  {
    emoji: '☀️',
    name: 'Invocations du Matin',
    description: "Prends 30 min pour te rappeler d'Allah",
    time: '7h – 7h30',
    days: ['MO','TU','WE','TH','FR','SA','SU'],
    startHour: 7, startMin: 0, endHour: 7, endMin: 30,
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400&q=80',
  },
  {
    emoji: '🌅',
    name: 'Invocations du Soir',
    description: "Prends 30 min pour te rappeler d'Allah",
    time: '19h – 19h30',
    days: ['MO','TU','WE','TH','FR','SA','SU'],
    startHour: 19, startMin: 0, endHour: 19, endMin: 30,
    image: 'https://images.unsplash.com/photo-1564121211835-e2c5d7af9a0e?w=400&q=80',
  },
  {
    emoji: '🎙️',
    name: 'Écoute de Sermon',
    description: 'Nourris ton cœur le week-end',
    time: '18h – 19h',
    days: ['SA','SU'],
    startHour: 18, startMin: 0, endHour: 19, endMin: 0,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80',
  },
];

const HABITS_SUGGESTIONS = [
  {
    emoji: '😴',
    name: 'Sommeil',
    description: 'Protège ta nuit des distractions',
    time: '22h – 6h',
    days: ['MO','TU','WE','TH','FR','SA','SU'],
    startHour: 22, startMin: 0, endHour: 6, endMin: 0,
    image: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=400&q=80',
  },
  {
    emoji: '🏋️',
    name: 'Grind Time',
    description: "Bloque les distractions pendant l'entraînement",
    time: '17h30 – 18h30',
    days: ['MO','WE','SA'],
    startHour: 17, startMin: 30, endHour: 18, endMin: 30,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  },
  {
    emoji: '🚶',
    name: 'Promenade Quotidienne',
    description: 'Marche sans écran, reconnecte-toi',
    time: '12h – 13h',
    days: ['MO','TU','WE','TH','FR','SA','SU'],
    startHour: 12, startMin: 0, endHour: 13, endMin: 0,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  },
];

export const SESSIONS_DATA = [
  { id: 2, name: 'Heure du Coran', nameAr: 'وقت القرآن',  emoji: '📖', time: '30 min',         apps: 8,  active: false, streak: 7,  duration: 30, niyyah: 'Réciter avec tadabbur',            pauseMode: 'hard' },
  { id: 3, name: 'Qiyam al-Layl',  nameAr: 'قيام الليل', emoji: '🌙', time: '22:30 – 00:00', apps: 6,  active: false, streak: 3,  duration: 90, niyyah: "Chercher la proximité d'Allah",   pauseMode: 'no'   },
];

// ── Helper components ──────────────────────────────────────────────────────────
function SectionCard({ children }) {
  return <View style={ss.sectionCard}>{children}</View>;
}

function PausePicker({ value, onChange }) {
  const { accentColor, accentBg } = useTheme();
  return (
    <View style={{ gap: 8 }}>
      {PAUSE_OPTIONS.map(opt => (
        <TouchableOpacity key={opt.key} onPress={() => onChange(opt.key)}
          style={[ss.pauseOpt, value === opt.key && [ss.pauseOptActive, { backgroundColor: accentBg, borderColor: accentColor }]]}>
          <Text style={{ fontSize: 20, marginTop: 2 }}>{opt.icon}</Text>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <Text style={[ss.pauseOptLabel, value === opt.key && { color: accentColor }]}>{opt.label}</Text>
              <Text style={{ fontSize: 11, color: Colors.textMuted }}>{opt.labelAr}</Text>
            </View>
            <Text style={{ fontSize: 11, color: Colors.textMuted, lineHeight: 16 }}>{opt.sub}</Text>
          </View>
          <View style={[ss.radio, value === opt.key && [ss.radioActive, { borderColor: accentColor }]]}>
            {value === opt.key && <View style={[ss.radioDot, { backgroundColor: accentColor }]} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function AppPicker({ selected, onToggle }) {
  const { accentColor, accentBg } = useTheme();
  return (
    <View>
      {APPS.map((app, i) => (
        <TouchableOpacity key={app.name} onPress={() => onToggle(app.name)}
          style={[ss.appRow, i < APPS.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#1C180A' }]}>
          <View style={[ss.appIcon, { backgroundColor: `${app.color}22` }]}>
            <Text style={{ fontSize: 18 }}>{app.icon}</Text>
          </View>
          <Text style={{ flex: 1, fontSize: 14, color: Colors.textPrimary }}>{app.name}</Text>
          <View style={[ss.checkbox, selected.includes(app.name) && [ss.checkboxActive, { borderColor: accentColor, backgroundColor: accentBg }]]}>
            {selected.includes(app.name) && <Text style={{ fontSize: 13, color: accentColor }}>✓</Text>}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── DurationWheel ──────────────────────────────────────────────────────────────
function DurationWheel({ value, onChange, accent: accentProp }) {
  const { accentColor } = useTheme();
  const accent = accentProp ?? accentColor;
  const scrollRef = useRef(null);

  useEffect(() => {
    const idx = DURATION_VALUES.indexOf(value);
    const target = idx >= 0 ? idx : 0;
    // Small delay to ensure the ScrollView has laid out
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: target * WHEEL_ITEM_H, animated: false });
    }, 50);
    return () => clearTimeout(t);
  }, []);

  const handleEnd = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / WHEEL_ITEM_H);
    const clamped = Math.max(0, Math.min(idx, DURATION_VALUES.length - 1));
    onChange(DURATION_VALUES[clamped]);
  };

  const CARD_BG = '#120F08';

  return (
    <View style={{ height: WHEEL_H, overflow: 'hidden' }}>
      {/* Selection pill — behind the scroll */}
      <View pointerEvents="none" style={{
        position: 'absolute',
        top: WHEEL_ITEM_H * Math.floor(WHEEL_VISIBLE / 2),
        left: 12, right: 12,
        height: WHEEL_ITEM_H,
        backgroundColor: '#1c1c1c',
        borderRadius: 14,
      }} />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={WHEEL_ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={handleEnd}
        onScrollEndDrag={handleEnd}
        contentContainerStyle={{ paddingVertical: WHEEL_PAD }}
      >
        {DURATION_VALUES.map(d => {
          const sel = d === value;
          return (
            <View key={d} style={{ height: WHEEL_ITEM_H, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{
                fontSize: sel ? 22 : 16,
                fontWeight: sel ? '700' : '400',
                color: sel ? accent : Colors.textSecondary,
                opacity: sel ? 1 : 0.45,
              }}>
                {fmtDuration(d)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Top fade */}
      <LinearGradient
        colors={[CARD_BG, 'transparent']}
        pointerEvents="none"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: WHEEL_ITEM_H * 2,
        }}
      />
      {/* Bottom fade */}
      <LinearGradient
        colors={['transparent', CARD_BG]}
        pointerEvents="none"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: WHEEL_ITEM_H * 2,
        }}
      />
    </View>
  );
}

// ── SessionsList ───────────────────────────────────────────────────────────────
function isTimerSession(s) {
  return !String(s.time || '').match(/\d{2}:\d{2}\s*[–-]\s*\d{2}:\d{2}/);
}

function categoriseSessions(sessions, now) {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = now.toISOString().split('T')[0];
  const maintenant = [];
  const prochainement = [];

  sessions.forEach(s => {
    // ── Timer sessions: never in Prochainement ─────────────────────────────
    if (isTimerSession(s)) {
      if (!s.active) return; // inactive timer → invisible, never scheduled
      // Active timer: show in Maintenant only while duration hasn't elapsed
      if (s.startedAt) {
        const elapsed = (now.getTime() - s.startedAt) / 1000;
        if (elapsed < (s.duration || 30) * 60) {
          maintenant.push(s);
        }
        // expired → don't show anywhere
      } else {
        // active but no startedAt (shouldn't happen, but show it)
        maintenant.push(s);
      }
      return;
    }

    // ── Planning sessions from here ────────────────────────────────────────
    if (s.active) {
      maintenant.push(s);
      return;
    }

    if (s.endedTodayDate === today) {
      const match = s.time.match(/(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/);
      if (match) {
        const startMin = parseInt(match[1]) * 60 + parseInt(match[2]);
        prochainement.push({ ...s, _startMin: startMin + 1440, _countdown: null });
      }
      return;
    }

    const match = s.time.match(/(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/);
    if (!match) {
      // Unrecognised format — skip rather than pollute Prochainement
      return;
    }
    const startMin = parseInt(match[1]) * 60 + parseInt(match[2]);
    const endMin   = parseInt(match[3]) * 60 + parseInt(match[4]);

    if (nowMin >= startMin && nowMin < endMin) {
      maintenant.push(s);
    } else if (nowMin < startMin) {
      const diff = startMin - nowMin;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      const countdown = h > 0
        ? `Démarre dans ${h}h${m > 0 ? ` ${m}m` : ''}`
        : `Démarre dans ${m}m`;
      prochainement.push({ ...s, _startMin: startMin, _countdown: countdown });
    } else {
      prochainement.push({ ...s, _startMin: startMin + 1440, _countdown: null });
    }
  });

  prochainement.sort((a, b) => a._startMin - b._startMin);
  return { maintenant, prochainement };
}

function SessionsList({ onNew, onLaunch, onEdit, onSettings, sessions = SESSIONS_DATA, onAddSuggestion }) {
  const { accentColor, accentBorder, accentBg } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const anim = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1,   duration: 800, useNativeDriver: true }),
    ]));
    anim.start();
    return () => anim.stop();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const { maintenant, prochainement } = categoriseSessions(sessions, now);

  const getRemaining = (s) => {
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const parsed = parseTimeRange(s.time);
    if (parsed) {
      const diff = Math.max(0, parsed.endHour * 60 + parsed.endMin - nowMin);
      if (diff <= 0) return null;
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''} restantes` : `${m}m restantes`;
    }
    if (s.startedAt) {
      const remainS = Math.max(0, (s.duration || 30) * 60 - (now.getTime() - s.startedAt) / 1000);
      const remainMin = Math.ceil(remainS / 60);
      return remainMin > 0 ? `${remainMin}m restantes` : null;
    }
    return null;
  };

  const renderSession = (s, isNow) => {
    const remainingLabel = isNow ? getRemaining(s) : null;
    return (
      <TouchableOpacity key={s.id} onPress={() => isNow ? onLaunch(s) : onEdit(s)}
        style={[ss.sessionCard, isNow && [ss.sessionCardActive, { borderColor: accentColor, shadowColor: accentColor }]]}>
        {isNow && <View style={[ss.activeBar, { backgroundColor: accentColor }]} />}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={[ss.sessionEmoji, isNow && [ss.sessionEmojiActive, { backgroundColor: accentBg, borderColor: accentColor }]]}>
            <Text style={{ fontSize: 22 }}>{s.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.textPrimary }}>{s.name}</Text>
            <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 2 }}>
              {s.time} · {s.apps} apps bloquées
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {isNow && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                <Animated.View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: accentColor, opacity: pulseAnim }} />
                <Text style={{ fontSize: 11, color: accentColor, fontWeight: '700' }}>EN COURS</Text>
              </View>
            )}
            {isNow && remainingLabel && (
              <Text style={{ fontSize: 10, color: Colors.textMuted, marginBottom: 2 }}>{remainingLabel}</Text>
            )}
            {!isNow && s._countdown && (
              <Text style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>{s._countdown}</Text>
            )}
            <Text style={{ fontSize: 11, color: Colors.textMuted }}>🔥 {s.streak} jours</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90, paddingTop: 88 }}>

      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <TouchableOpacity onPress={onNew} style={[ss.newSessionBtn, { justifyContent: 'center', borderColor: accentBorder, backgroundColor: accentBg.replace('0.12', '0.03') }]}>
          <Text style={{ fontSize: 15, color: accentColor, fontWeight: '600' }}>+ Nouvelle session</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <Text style={ss.sectionTitle}>Maintenant</Text>
        {maintenant.length > 0
          ? <View style={{ gap: 10 }}>{maintenant.map(s => renderSession(s, true))}</View>
          : <Text style={{ fontSize: 13, color: Colors.textMuted, textAlign: 'center', paddingVertical: 18, opacity: 0.5 }}>Aucune session active en ce moment</Text>
        }
      </View>

      {prochainement.length > 0 && (
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={ss.sectionTitle}>Prochainement</Text>
          <View style={{ gap: 10 }}>
            {prochainement.map(s => renderSession(s, false))}
          </View>
        </View>
      )}

      {/* SECTION SESSIONS RELIGIEUSES */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24, marginTop: 20 }}>
        <Text style={ss.sectionTitle}>Sessions Religieuses</Text>
        <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: -8, marginBottom: 14, opacity: 0.6 }}>
          Actes d'adoration
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', gap: 12, paddingRight: 20 }}>
            {IBADAH_SUGGESTIONS.map((s, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => onAddSuggestion(s)}
                style={ss.suggestionCard}
                activeOpacity={0.85}
              >
                <Image source={{ uri: s.image }} style={ss.suggestionImage} />
                <View style={ss.suggestionOverlay} />
                <View style={ss.suggestionContent}>
                  <Text style={ss.suggestionEmoji}>{s.emoji}</Text>
                  <Text style={ss.suggestionName}>{s.name}</Text>
                  <Text style={ss.suggestionDesc} numberOfLines={2}>{s.description}</Text>
                  <Text style={[ss.suggestionTime, { color: accentColor }]}>{s.time}</Text>
                  <View style={[ss.suggestionAddBtn, { backgroundColor: accentBg, borderColor: accentBorder }]}>
                    <Text style={{ fontSize: 12, color: accentColor, fontWeight: '700' }}>+ Ajouter</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* SECTION HABITUDES */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <Text style={ss.sectionTitle}>Habitudes</Text>
        <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: -8, marginBottom: 14, opacity: 0.6 }}>
          Routine de vie
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', gap: 12, paddingRight: 20 }}>
            {HABITS_SUGGESTIONS.map((s, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => onAddSuggestion(s)}
                style={ss.suggestionCard}
                activeOpacity={0.85}
              >
                <Image source={{ uri: s.image }} style={ss.suggestionImage} />
                <View style={ss.suggestionOverlay} />
                <View style={ss.suggestionContent}>
                  <Text style={ss.suggestionEmoji}>{s.emoji}</Text>
                  <Text style={ss.suggestionName}>{s.name}</Text>
                  <Text style={ss.suggestionDesc} numberOfLines={2}>{s.description}</Text>
                  <Text style={[ss.suggestionTime, { color: accentColor }]}>{s.time}</Text>
                  <View style={[ss.suggestionAddBtn, { backgroundColor: accentBg, borderColor: accentBorder }]}>
                    <Text style={{ fontSize: 12, color: accentColor, fontWeight: '700' }}>+ Ajouter</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={{ alignItems: 'center', paddingVertical: 24, opacity: 0.2 }}>
        <Text style={{ fontSize: 14, color: Colors.textMuted }}>وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ</Text>
      </View>
      </ScrollView>
      <LinearGradient
        colors={['#0C0A06', 'rgba(12,10,6,0.95)', 'rgba(12,10,6,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        pointerEvents="box-none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: Colors.textMuted, letterSpacing: 1, marginBottom: 4 }}>MES SESSIONS</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.5 }}>Locks</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <TouchableOpacity onPress={onSettings} style={ss.gearBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ fontSize: 18, color: Colors.textMuted }}>⚙</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNew} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <View style={{ width: 36, height: 36, borderRadius: 20, borderWidth: 1, borderColor: accentBorder, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: accentColor, fontSize: 18, fontWeight: '300' }}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

// ── TypeSheet ──────────────────────────────────────────────────────────────────
function TypeSheet({ onSelect, onClose }) {
  const { accentColor, accentBg } = useTheme();
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.timing(slideAnim, { toValue: 0, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 50 }]} pointerEvents="box-none">
      <TouchableOpacity style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
        activeOpacity={1} onPress={onClose} />
      <Animated.View style={[ss.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <LinearGradient
          colors={['#120F08', '#0C0A06']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={ss.sheetHandle} />
        <Text style={{ fontSize: 11, color: Colors.textMuted, letterSpacing: 1, marginBottom: 6 }}>NOUVELLE SESSION</Text>
        <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 20 }}>Quel type de session?</Text>

        <TouchableOpacity onPress={() => onSelect('timer')} style={[ss.typeOption, { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderRadius: 16 }]}>
          <View style={[ss.typeIcon, { backgroundColor: accentBg, borderColor: accentColor + '4D' }]}>
            <Text style={{ fontSize: 24 }}>⏱</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 }}>Minuteur libre</Text>
            <Text style={{ fontSize: 12, color: Colors.textMuted }}>Définis une durée et démarre</Text>
          </View>
          <Text style={{ fontSize: 20, color: accentColor }}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSelect('planning')} style={[ss.typeOption, { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderRadius: 16 }]}>
          <View style={[ss.typeIcon, { backgroundColor: 'rgba(26,107,74,0.12)', borderColor: 'rgba(34,135,94,0.3)' }]}>
            <Text style={{ fontSize: 24 }}>📅</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 }}>Session planifiée</Text>
            <Text style={{ fontSize: 12, color: Colors.textMuted }}>Plage horaire + jours récurrents</Text>
          </View>
          <Text style={{ fontSize: 20, color: Colors.greenLight }}>›</Text>
        </TouchableOpacity>

        <View style={[ss.typeOption, { opacity: 0.5 }]}>
          <View style={[ss.typeIcon, { backgroundColor: '#1A1508', borderColor: '#1C180A' }]}>
            <Text style={{ fontSize: 24 }}>🎯</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.textMuted }}>Challenge Mode</Text>
            <Text style={{ fontSize: 12, color: Colors.textMuted }}>Défis et compétitions communautaires</Text>
          </View>
          <View style={{ backgroundColor: accentBg, borderWidth: 1, borderColor: accentColor + '4D', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
            <Text style={{ fontSize: 9, color: accentColor, letterSpacing: 1 }}>BIENTÔT</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

// ── TimerConfig ────────────────────────────────────────────────────────────────
function TimerConfig({ onBack, onLaunch }) {
  const { accentColor } = useTheme();
  const [name, setName] = useState('Ma Session');
  const [emoji, setEmoji] = useState('🌙');
  const [duration, setDuration] = useState(30);
  const [pauses, setPauses] = useState('yes');
  const [selectedApps, setSelectedApps] = useState(['Instagram', 'TikTok']);
  const [niyyah, setNiyyah] = useState('');
  const [showApps, setShowApps] = useState(false);

  const toggleApp = (app) => setSelectedApps(prev =>
    prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
  );

  return (
    <View style={{ flex: 1 }}>
      <Text pointerEvents="none" style={{ position: 'absolute', fontSize: 280, color: accentColor, opacity: 0.05, alignSelf: 'center', top: '20%', fontFamily: 'sans-serif' }}>الله</Text>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(12,10,6,0.60)' }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8 }}>
        <TouchableOpacity onPress={onBack} style={ss.backCircle}>
          <Text style={{ color: Colors.textMuted, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 11, color: accentColor, letterSpacing: 1 }}>MINUTEUR</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.textPrimary }}>Nouvelle Session</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        {/* Name & Emoji */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <Text style={[ss.sectionLabel, { color: accentColor }]}>Nom & icône</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {EMOJIS.map(e => (
                <TouchableOpacity key={e} onPress={() => setEmoji(e)}
                  style={[ss.emojiBtn, emoji === e && [ss.emojiBtnActive, { backgroundColor: accentBg, borderColor: accentColor }]]}>
                  <Text style={{ fontSize: 20 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              value={name} onChangeText={setName}
              style={ss.textInput} placeholderTextColor={Colors.textMuted}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {SESSION_NAMES.map(n => (
                <TouchableOpacity key={n} onPress={() => setName(n)}
                  style={[ss.namePill, name === n && [ss.namePillActive, { backgroundColor: accentBg, borderColor: accentColor }]]}>
                  <Text style={{ fontSize: 12, color: name === n ? accentColor : Colors.textMuted }}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SectionCard>

        {/* Niyyah */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <Text style={[ss.sectionLabel, { color: accentColor }]}>Niyyah · النية</Text>
            <TextInput
              value={niyyah} onChangeText={setNiyyah}
              placeholder="Quelle est ton intention pour cette session?"
              placeholderTextColor={Colors.textMuted}
              style={ss.textInput}
            />
            {!!niyyah && (
              <Text style={{ fontSize: 11, color: accentColor, marginTop: 8, opacity: 0.7, fontStyle: 'italic' }}>
                بِسْمِ اللَّهِ — {niyyah}
              </Text>
            )}
          </View>
        </SectionCard>

        {/* Duration */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <Text style={[ss.sectionLabel, { color: accentColor }]}>Durée</Text>
            <DurationWheel value={duration} onChange={setDuration} accent={accentColor} />
          </View>
        </SectionCard>

        {/* Apps */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View>
                <Text style={[ss.sectionLabel, { color: accentColor }]}>Apps bloquées</Text>
                <Text style={{ fontSize: 13, color: Colors.textPrimary }}>
                  {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} sélectionnée{selectedApps.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowApps(v => !v)}
                style={{ borderWidth: 1, borderColor: accentColor + '40', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text style={{ fontSize: 13, color: accentColor }}>{showApps ? 'Fermer' : 'Modifier'}</Text>
              </TouchableOpacity>
            </View>
            {showApps && <AppPicker selected={selectedApps} onToggle={toggleApp} />}
          </View>
        </SectionCard>

        {/* Pause mode */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <Text style={[ss.sectionLabel, { color: accentColor }]}>Mode pauses</Text>
            <PausePicker value={pauses} onChange={setPauses} />
          </View>
        </SectionCard>
      </ScrollView>

      <View style={ss.launchFooter}>
        <TouchableOpacity
          onPress={() => onLaunch({ name, nameAr: 'جلسة', emoji, niyyah, pauseMode: pauses, duration, streak: 0, apps: selectedApps.length, time: fmtDuration(duration) })}
          style={[ss.launchBtn, { backgroundColor: accentColor, shadowColor: accentColor }]}>
          <Text style={ss.launchBtnText}>Lancer la session — بِسْمِ اللَّهِ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── PlanningConfig ─────────────────────────────────────────────────────────────
const GREEN = Colors.greenLight;
const DAYS_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function PlanningConfig({ onBack, onLaunch, onSchedule, defaults = null }) {
  const [name, setName] = useState(defaults?.name ?? 'Ma Session');
  const [emoji, setEmoji] = useState(defaults?.emoji ?? '📅');
  const [niyyah, setNiyyah] = useState('');
  const [startHour, setStartHour] = useState(defaults?.startHour ?? 6);
  const [startMin, setStartMin] = useState(defaults?.startMin ?? 0);
  const [endHour, setEndHour] = useState(defaults?.endHour ?? 8);
  const [endMin, setEndMin] = useState(defaults?.endMin ?? 0);
  const [selectedDays, setSelectedDays] = useState(
    defaults?.days ? daysToIndices(defaults.days) : [0, 1, 2, 3, 4]
  );

  useEffect(() => {
    if (!defaults) return;
    setName(defaults.name);
    setEmoji(defaults.emoji);
    setStartHour(defaults.startHour);
    setStartMin(defaults.startMin);
    setEndHour(defaults.endHour);
    setEndMin(defaults.endMin);
    setSelectedDays(daysToIndices(defaults.days));
  }, [defaults]);
  const [pauses, setPauses] = useState('yes');
  const [selectedApps, setSelectedApps] = useState(['Instagram', 'TikTok']);
  const [showApps, setShowApps] = useState(false);

  const toggleApp = (app) => setSelectedApps(prev =>
    prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
  );
  const toggleDay = (i) => setSelectedDays(prev =>
    prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i]
  );
  const toggleAll = () => setSelectedDays(prev =>
    prev.length === 7 ? [] : [0, 1, 2, 3, 4, 5, 6]
  );

  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;
  const totalMin = startTotalMin !== endTotalMin
    ? (endTotalMin > startTotalMin
        ? endTotalMin - startTotalMin
        : (24 * 60 - startTotalMin) + endTotalMin)
    : 0;
  const isTimeValid = startTotalMin !== endTotalMin;
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const isCurrentlyActive = isTimeValid && nowMin >= startTotalMin && nowMin < endTotalMin;
  const durationLabel = totalMin > 0
    ? totalMin < 60
      ? `${totalMin} min`
      : `${Math.floor(totalMin / 60)}h${totalMin % 60 > 0 ? `${totalMin % 60}` : ''}`
    : '—';

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#080818', '#0f1f3d', '#1a2a4a', '#2d3a1a', '#8B6914']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.6, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(8,8,8,0.60)' }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8 }}>
        <TouchableOpacity onPress={onBack} style={ss.backCircle}>
          <Text style={{ color: Colors.textMuted, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 11, color: GREEN, letterSpacing: 1 }}>PLANNING</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.textPrimary }}>Nouvelle Session</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>

        {/* Name & Emoji */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <Text style={ss.sectionLabel}>Nom & icône</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {EMOJIS.map(e => (
                <TouchableOpacity key={e} onPress={() => setEmoji(e)}
                  style={[ss.emojiBtn, emoji === e && ss.emojiBtnGreen]}>
                  <Text style={{ fontSize: 20 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              value={name} onChangeText={setName}
              style={ss.textInput} placeholderTextColor={Colors.textMuted}
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {SESSION_NAMES.map(n => (
                <TouchableOpacity key={n} onPress={() => setName(n)}
                  style={[ss.namePill, name === n && ss.namePillGreen]}>
                  <Text style={{ fontSize: 12, color: name === n ? GREEN : Colors.textMuted }}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SectionCard>

        {/* Niyyah */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <Text style={ss.sectionLabel}>Niyyah · النية</Text>
            <TextInput
              value={niyyah} onChangeText={setNiyyah}
              placeholder="Quelle est ton intention pour cette session?"
              placeholderTextColor={Colors.textMuted}
              style={ss.textInput}
            />
            {!!niyyah && (
              <Text style={{ fontSize: 11, color: GREEN, marginTop: 8, opacity: 0.8, fontStyle: 'italic' }}>
                بِسْمِ اللَّهِ — {niyyah}
              </Text>
            )}
          </View>
        </SectionCard>

        {/* Time range */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <Text style={ss.sectionLabel}>Plage horaire</Text>

            <Text style={ss.timeLabel}>DE</Text>
            <DateTimePicker
              value={makeTimeDate(startHour, startMin)}
              mode="time"
              display="spinner"
              is24Hour={true}
              themeVariant="dark"
              textColor={Colors.textPrimary}
              onChange={(_, date) => {
                if (date) { setStartHour(date.getHours()); setStartMin(date.getMinutes()); }
              }}
              style={ss.timePicker}
            />

            <Text style={[ss.timeLabel, { marginTop: 8 }]}>À</Text>
            <DateTimePicker
              value={makeTimeDate(endHour, endMin)}
              mode="time"
              display="spinner"
              is24Hour={true}
              themeVariant="dark"
              textColor={Colors.textPrimary}
              onChange={(_, date) => {
                if (date) { setEndHour(date.getHours()); setEndMin(date.getMinutes()); }
              }}
              style={ss.timePicker}
            />

            <View style={ss.durationRow}>
              <Text style={{ fontSize: 11, color: Colors.textMuted, letterSpacing: 1 }}>DURÉE</Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: totalMin > 0 ? GREEN : Colors.textMuted }}>
                {durationLabel}
              </Text>
            </View>
          </View>
        </SectionCard>
        {/* Days */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={[ss.sectionLabel, { marginBottom: 0 }]}>Jours récurrents</Text>
              <TouchableOpacity onPress={toggleAll}>
                <Text style={{ fontSize: 12, color: GREEN, fontWeight: '600' }}>
                  {selectedDays.length === 7 ? 'Désélectionner tout' : 'Tous les jours'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {DAYS_LABELS.map((d, i) => (
                <TouchableOpacity key={i} onPress={() => toggleDay(i)}
                  style={[ss.dayBtn, selectedDays.includes(i) && ss.dayBtnActive]}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: selectedDays.includes(i) ? GREEN : Colors.textMuted }}>
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SectionCard>

        {/* Apps */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View>
                <Text style={ss.sectionLabel}>Apps bloquées</Text>
                <Text style={{ fontSize: 13, color: Colors.textPrimary }}>
                  {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} sélectionnée{selectedApps.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowApps(v => !v)}
                style={{ borderWidth: 1, borderColor: `${GREEN}55`, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text style={{ fontSize: 13, color: GREEN }}>{showApps ? 'Fermer' : 'Modifier'}</Text>
              </TouchableOpacity>
            </View>
            {showApps && <AppPicker selected={selectedApps} onToggle={toggleApp} />}
          </View>
        </SectionCard>

        {/* Pause mode */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <Text style={ss.sectionLabel}>Mode pauses</Text>
            <PausePicker value={pauses} onChange={setPauses} />
          </View>
        </SectionCard>

      </ScrollView>

      <View style={ss.launchFooter}>
        <TouchableOpacity
          disabled={!isTimeValid}
          onPress={() => {
            if (!isTimeValid) return;
            const sessionData = {
              name, nameAr: 'جلسة', emoji, niyyah,
              pauseMode: pauses,
              duration: totalMin,
              streak: 0,
              apps: selectedApps.length,
              time: `${String(startHour).padStart(2,'0')}:${String(startMin).padStart(2,'0')} – ${String(endHour).padStart(2,'0')}:${String(endMin).padStart(2,'0')}`,
            };
            if (isCurrentlyActive) {
              onLaunch(sessionData);
            } else {
              onSchedule(sessionData);
            }
          }}
          style={[ss.launchBtn, { backgroundColor: isTimeValid ? GREEN : '#2a2a2a' }]}>
          <Text style={[ss.launchBtnText, { color: isTimeValid ? '#000' : Colors.textMuted }]}>
            {isCurrentlyActive ? 'Lancer maintenant — بِسْمِ اللَّهِ' : 'Planifier la session — بِسْمِ اللَّهِ'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── EditSession ────────────────────────────────────────────────────────────────
function parseTimeRange(time) {
  const match = time.match(/(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/);
  if (!match) return null;
  return {
    startHour: parseInt(match[1]), startMin: parseInt(match[2]),
    endHour:   parseInt(match[3]), endMin:   parseInt(match[4]),
  };
}

function EditSession({ session, onBack, onDelete }) {
  const parsed = parseTimeRange(session.time);
  const isPlanning = parsed !== null;

  const [name,         setName]         = useState(session.name || 'Ma Session');
  const [emoji,        setEmoji]        = useState(session.emoji || '🌙');
  const [niyyah,       setNiyyah]       = useState(session.niyyah || '');
  const [pauses,       setPauses]       = useState(session.pauseMode || 'yes');
  const [selectedApps, setSelectedApps] = useState([]);
  const [showApps,     setShowApps]     = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);

  // Timer-only
  const [duration, setDuration] = useState(session.duration || 30);

  // Planning-only
  const [startHour,    setStartHour]    = useState(parsed?.startHour ?? 9);
  const [startMin,     setStartMin]     = useState(parsed?.startMin  ?? 0);
  const [endHour,      setEndHour]      = useState(parsed?.endHour   ?? 10);
  const [endMin,       setEndMin]       = useState(parsed?.endMin    ?? 0);
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]);

  const toggleApp = (app) => setSelectedApps(prev =>
    prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]
  );
  const toggleDay = (i) => setSelectedDays(prev =>
    prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i]
  );
  const toggleAll = () => setSelectedDays(prev => prev.length === 7 ? [] : [0,1,2,3,4,5,6]);

  const { accentColor: themeAccent, accentBg } = useTheme();
  const accent = isPlanning ? GREEN : themeAccent;
  const _startTotalMin = startHour * 60 + startMin;
  const _endTotalMin = endHour * 60 + endMin;
  const totalMin = isPlanning
    ? (_startTotalMin !== _endTotalMin
        ? (_endTotalMin > _startTotalMin
            ? _endTotalMin - _startTotalMin
            : (24 * 60 - _startTotalMin) + _endTotalMin)
        : 0)
    : 0;
  const isTimeValid = !isPlanning || _startTotalMin !== _endTotalMin;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8 }}>
        <TouchableOpacity onPress={onBack} style={ss.backCircle}>
          <Text style={{ color: Colors.textMuted, fontSize: 16 }}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 11, color: accent, letterSpacing: 1 }}>
            {isPlanning ? 'PLANNING' : 'MINUTEUR'} · MODIFIER
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.textPrimary }}>Modifier la session</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160 }}>

        {/* Name & Emoji */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <Text style={[ss.sectionLabel, { color: accent }]}>Nom & icône</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {EMOJIS.map(e => (
                <TouchableOpacity key={e} onPress={() => setEmoji(e)}
                  style={[ss.emojiBtn, emoji === e && (isPlanning ? ss.emojiBtnGreen : [ss.emojiBtnActive, { backgroundColor: accentBg, borderColor: themeAccent }])]}>
                  <Text style={{ fontSize: 20 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput value={name} onChangeText={setName}
              style={ss.textInput} placeholderTextColor={Colors.textMuted} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {SESSION_NAMES.map(n => (
                <TouchableOpacity key={n} onPress={() => setName(n)}
                  style={[ss.namePill, name === n && (isPlanning ? ss.namePillGreen : [ss.namePillActive, { backgroundColor: accentBg, borderColor: themeAccent }])]}>
                  <Text style={{ fontSize: 12, color: name === n ? accent : Colors.textMuted }}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SectionCard>

        {/* Niyyah */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <Text style={[ss.sectionLabel, { color: accent }]}>Niyyah · النية</Text>
            <TextInput value={niyyah} onChangeText={setNiyyah}
              placeholder="Quelle est ton intention pour cette session?"
              placeholderTextColor={Colors.textMuted} style={ss.textInput} />
            {!!niyyah && (
              <Text style={{ fontSize: 11, color: accent, marginTop: 8, opacity: 0.8, fontStyle: 'italic' }}>
                بِسْمِ اللَّهِ — {niyyah}
              </Text>
            )}
          </View>
        </SectionCard>

        {/* Duration — timer only */}
        {!isPlanning && (
          <SectionCard>
            <View style={{ padding: 16 }}>
              <Text style={ss.sectionLabel}>Durée</Text>
              <DurationWheel value={duration} onChange={setDuration} />
            </View>
          </SectionCard>
        )}

        {/* Time range — planning only */}
        {isPlanning && (
          <>
            <SectionCard>
              <View style={{ padding: 16 }}>
                <Text style={ss.sectionLabel}>Plage horaire</Text>

                <Text style={ss.timeLabel}>DE</Text>
                <DateTimePicker
                  value={makeTimeDate(startHour, startMin)}
                  mode="time"
                  display="spinner"
                  is24Hour={true}
                  themeVariant="dark"
                  textColor={Colors.textPrimary}
                  onChange={(_, date) => {
                    if (date) { setStartHour(date.getHours()); setStartMin(date.getMinutes()); }
                  }}
                  style={ss.timePicker}
                />

                <Text style={[ss.timeLabel, { marginTop: 8 }]}>À</Text>
                <DateTimePicker
                  value={makeTimeDate(endHour, endMin)}
                  mode="time"
                  display="spinner"
                  is24Hour={true}
                  themeVariant="dark"
                  textColor={Colors.textPrimary}
                  onChange={(_, date) => {
                    if (date) { setEndHour(date.getHours()); setEndMin(date.getMinutes()); }
                  }}
                  style={ss.timePicker}
                />

                <View style={ss.durationRow}>
                  <Text style={{ fontSize: 11, color: Colors.textMuted, letterSpacing: 1 }}>DURÉE</Text>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: totalMin > 0 ? GREEN : Colors.textMuted }}>
                    {totalMin > 0
                      ? totalMin < 60 ? `${totalMin} min` : `${Math.floor(totalMin/60)}h${totalMin%60>0?`${totalMin%60}`:''}`
                      : '—'}
                  </Text>
                </View>
              </View>
            </SectionCard>
            {/* Days */}
            <SectionCard>
              <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <Text style={[ss.sectionLabel, { marginBottom: 0 }]}>Jours récurrents</Text>
                  <TouchableOpacity onPress={toggleAll}>
                    <Text style={{ fontSize: 12, color: GREEN, fontWeight: '600' }}>
                      {selectedDays.length === 7 ? 'Désélectionner tout' : 'Tous les jours'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  {DAYS_LABELS.map((d, i) => (
                    <TouchableOpacity key={i} onPress={() => toggleDay(i)}
                      style={[ss.dayBtn, selectedDays.includes(i) && ss.dayBtnActive]}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: selectedDays.includes(i) ? GREEN : Colors.textMuted }}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </SectionCard>
          </>
        )}

        {/* Apps */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View>
                <Text style={[ss.sectionLabel, { color: accent }]}>Apps bloquées</Text>
                <Text style={{ fontSize: 13, color: Colors.textPrimary }}>
                  {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} sélectionnée{selectedApps.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowApps(v => !v)}
                style={{ borderWidth: 1, borderColor: `${accent}55`, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 }}>
                <Text style={{ fontSize: 13, color: accent }}>{showApps ? 'Fermer' : 'Modifier'}</Text>
              </TouchableOpacity>
            </View>
            {showApps && <AppPicker selected={selectedApps} onToggle={toggleApp} />}
          </View>
        </SectionCard>

        {/* Pause mode */}
        <SectionCard>
          <View style={{ padding: 16 }}>
            <Text style={[ss.sectionLabel, { color: accent }]}>Mode pauses</Text>
            <PausePicker value={pauses} onChange={setPauses} />
          </View>
        </SectionCard>

        {/* Delete */}
        <TouchableOpacity onPress={() => setShowConfirm(true)} style={ss.deleteBtn}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#e05555' }}>Supprimer la session</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={ss.launchFooter}>
        <TouchableOpacity
          disabled={!isTimeValid}
          onPress={onBack}
          style={[ss.launchBtn, { backgroundColor: isTimeValid ? accent : '#2a2a2a' }]}>
          <Text style={[ss.launchBtnText, { color: isTimeValid ? '#000' : Colors.textMuted }]}>
            Enregistrer les modifications
          </Text>
        </TouchableOpacity>
      </View>

      {showConfirm && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 99 }]} pointerEvents="box-none">
          <TouchableOpacity style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.75)' }]}
            activeOpacity={1} onPress={() => setShowConfirm(false)} />
          <View style={[ss.sheet, { gap: 10 }]}>
            <View style={ss.sheetHandle} />
            <View style={{ alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 28, marginBottom: 10 }}>🗑️</Text>
              <Text style={{ fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 }}>
                Supprimer cette session ?
              </Text>
              <Text style={{ fontSize: 13, color: Colors.textMuted, lineHeight: 20, textAlign: 'center' }}>
                "{name}" sera définitivement supprimée.{'\n'}Cette action est irréversible.
              </Text>
            </View>
            <TouchableOpacity onPress={onDelete} style={ss.deleteBtnConfirm}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Oui, supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowConfirm(false)} style={ss.outlineBtn}>
              <Text style={{ fontSize: 14, color: Colors.textMuted }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SESSIONS SCREEN (main export)
// ══════════════════════════════════════════════════════════════════════════════
export function SessionsScreen({ onStartSession, onSaveSession, sessions = SESSIONS_DATA }) {
  const [view,               setView]               = useState('list');
  const [editingSession,     setEditingSession]     = useState(null);
  const [newSessionDefaults, setNewSessionDefaults] = useState(null);

  const handleLaunch = (session) => {
    setView('list');
    onStartSession(session);
  };

  const handleSchedule = (session) => {
    setView('list');
    onSaveSession(session);
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setView('edit');
  };

  const onAddSuggestion = (suggestion) => {
    setNewSessionDefaults({
      name: suggestion.name,
      emoji: suggestion.emoji,
      startHour: suggestion.startHour,
      startMin: suggestion.startMin,
      endHour: suggestion.endHour,
      endMin: suggestion.endMin,
      days: suggestion.days,
    });
    setView('planning');
  };

  if (view === 'notifications') return (
    <NotificationsScreen onBack={() => setView('protection')} />
  );

  if (view === 'blockingScreen') return (
    <BlockingScreenSettings onBack={() => setView('protection')} />
  );

  if (view === 'protection') return (
    <ProtectionScreen
      onBack={() => setView('list')}
      onOpenNotifications={() => setView('notifications')}
      onOpenBlockingScreen={() => setView('blockingScreen')}
    />
  );

  if (view === 'timer') return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <TimerConfig onBack={() => setView('list')} onLaunch={handleLaunch} />
    </SafeAreaView>
  );

  if (view === 'planning') return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <PlanningConfig
        onBack={() => { setView('list'); setNewSessionDefaults(null); }}
        onLaunch={handleLaunch}
        onSchedule={handleSchedule}
        defaults={newSessionDefaults}
      />
    </SafeAreaView>
  );

  if (view === 'edit' && editingSession) return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <EditSession
        session={editingSession}
        onBack={() => { setView('list'); setEditingSession(null); }}
        onDelete={() => { setView('list'); setEditingSession(null); }}
      />
    </SafeAreaView>
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <SessionsList
          onNew={() => setView('typeSheet')}
          onLaunch={(s) => onStartSession(s)}
          onEdit={handleEdit}
          onSettings={() => setView('protection')}
          sessions={sessions}
          onAddSuggestion={onAddSuggestion}
        />
      </SafeAreaView>
      {view === 'typeSheet' && (
        <TypeSheet onSelect={(type) => setView(type)} onClose={() => setView('list')} />
      )}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const ss = StyleSheet.create({
  sectionCard:  { ...S.card, borderRadius: 16, marginBottom: 12, padding: 0, backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)' },
  sectionLabel: { ...S.label, fontSize: 11, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  pauseOpt:      { ...S.row, alignItems: 'flex-start', gap: 12, backgroundColor: Colors.surfaceDark, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 12 },
  pauseOptActive: {},
  pauseOptLabel:  { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  radio:          { width: 22, height: 22, borderRadius: 11, marginTop: 2, borderWidth: 2, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioActive:    {},
  radioDot:       { width: 8, height: 8, borderRadius: 4 },
  appRow:         { ...S.row, gap: 12, paddingVertical: 11 },
  appIcon:        { ...S.iconBox, width: 36, height: 36, borderRadius: 10, borderWidth: 0, backgroundColor: 'transparent' },
  checkbox:       { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: {},
  newSessionBtn:  { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  sessionCard:       { ...S.card, borderRadius: 16, padding: 14, overflow: 'hidden' },
  sessionCardActive: { ...S.softGlow },
  activeBar:         { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  sessionEmoji:      { ...S.iconBox, width: 46, height: 46, borderRadius: 13 },
  sessionEmojiActive: {},
  sheet:       { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, borderTopColor: Colors.border, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, paddingBottom: 48, overflow: 'hidden' },
  sheetHandle: { ...S.handle, marginBottom: 24 },
  typeOption:  { ...S.card, flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 14, padding: 16, marginBottom: 10 },
  typeIcon:    { ...S.iconBox, width: 52, height: 52, borderRadius: 16 },
  backCircle:  { ...S.iconBox, width: 36, height: 36, borderRadius: 18 },
  textInput:   { ...S.input, borderRadius: 10, padding: 11, paddingHorizontal: 14, backgroundColor: Colors.surfaceCard },
  emojiBtn:    { ...S.iconBox, width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.surfaceCard },
  emojiBtnActive: {},
  namePill:    { ...S.pill, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: Colors.surfaceCard },
  namePillActive: {},
  launchFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border, padding: 12, paddingBottom: 28 },
  launchBtn:    { borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 12 },
  launchBtnText: { ...S.btnLabel, color: '#000' },
  // Edit / delete
  deleteBtn:        { borderWidth: 1, borderColor: 'rgba(224,85,85,0.3)', borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 8, backgroundColor: 'rgba(224,85,85,0.06)' },
  deleteBtnConfirm: { backgroundColor: Colors.danger, borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  outlineBtn:       { borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  // Planning-specific
  emojiBtnGreen: { backgroundColor: 'rgba(34,135,94,0.12)', borderColor: Colors.greenLight },
  namePillGreen: { backgroundColor: 'rgba(34,135,94,0.12)', borderColor: Colors.greenLight },
  dayBtn:        { ...S.iconBox, width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.surfaceCard },
  dayBtnActive:  { backgroundColor: 'rgba(34,135,94,0.12)', borderColor: Colors.greenLight },
  // Time picker
  timeLabel:   { fontSize: 10, color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 2 },
  timePicker:  { width: '100%' },
  durationRow: { ...S.rowBetween, paddingTop: 12, marginTop: 4, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border },
  // Gear button
  gearBtn: { ...S.iconBox, width: 36, height: 36, borderRadius: 18, marginTop: 4 },
  // Suggestion cards
  suggestionCard:    { width: 160, height: 220, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  suggestionImage:   { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  suggestionOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)' },
  suggestionContent: { flex: 1, padding: 12, justifyContent: 'flex-end' },
  suggestionEmoji:   { fontSize: 24, marginBottom: 6 },
  suggestionName:    { fontSize: 14, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  suggestionDesc:    { fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 15, marginBottom: 6 },
  suggestionTime:    { fontSize: 11, marginBottom: 8 },
  suggestionAddBtn:  { borderWidth: 1, borderRadius: 8, paddingVertical: 6, alignItems: 'center' },
});
