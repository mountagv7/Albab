import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Circle, Polygon, Defs, LinearGradient, Stop, Text as SvgText,
} from 'react-native-svg';
import { Colors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { S } from '../theme/styles';

const _a = (hex, op) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${op})`;
};

// ── Constants ──────────────────────────────────────────────────────────────────
const PAUSE_DURATIONS = [1, 3, 5, 7, 10, 15];
const MAX_PAUSES = 2;
const COOLDOWN_SECONDS = 10;

const VERSES = [
  { ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', fr: 'Avec la difficulté vient la facilité', source: 'Al-Inshirah · 6' },
  { ar: 'وَاذْكُرُوا اللَّهَ كَثِيرًا', fr: 'Invoquez Allah abondamment', source: 'Al-Anfal · 45' },
  { ar: 'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', fr: "Par le Temps, l'homme est en perdition", source: 'Al-Asr · 1-2' },
];

const PAUSE_CONTENT = [
  { type: 'dhikr',  ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',                                      fr: 'Gloire à Allah et louange à Lui',                                         source: 'Riyadh As-Salihin' },
  { type: 'verse',  ar: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',                       fr: "C'est par l'invocation d'Allah que les cœurs trouvent la quiétude",       source: "Ar-Ra'd · 28" },
  { type: 'dhikr',  ar: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',               fr: "Il n'y a de dieu qu'Allah, Seul, sans associé",                           source: 'Bukhari' },
  { type: 'hadith', ar: 'أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',       fr: "L'action la plus aimée d'Allah est celle accomplie avec régularité",       source: 'Bukhari · 6464' },
  { type: 'dhikr',  ar: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',                                    fr: 'Je demande pardon à Allah le Très Grand',                                 source: 'Tirmidhi' },
  { type: 'verse',  ar: 'فَاذْكُرُونِي أَذْكُرْكُمْ',                                         fr: 'Invoquez-Moi, Je vous invoquerai',                                        source: 'Al-Baqara · 152' },
  { type: 'dhikr',  ar: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ',                  fr: 'Ô Allah, Tu es la Paix et de Toi vient la Paix',                          source: 'Muslim' },
  { type: 'hadith', ar: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ ثَقِيلَتَانِ فِي الْمِيزَانِ', fr: 'Deux mots légers sur la langue, mais lourds dans la balance',        source: 'Bukhari · 6682' },
];

const DHIKR_COOLDOWN = [
  { ar: 'سُبْحَانَ اللَّهِ',          fr: 'Gloire à Allah' },
  { ar: 'الْحَمْدُ لِلَّهِ',          fr: 'Louange à Allah' },
  { ar: 'اللَّهُ أَكْبَرُ',           fr: 'Allah est le Plus Grand' },
  { ar: 'لَا إِلَهَ إِلَّا اللَّهُ', fr: "Il n'y a de dieu qu'Allah" },
];

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

function starPoints(cx, cy, r1, r2, pts) {
  const a = [];
  for (let i = 0; i < pts * 2; i++) {
    const ang = (i * Math.PI) / pts - Math.PI / 2;
    const r = i % 2 === 0 ? r1 : r2;
    a.push(`${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`);
  }
  return a.join(' ');
}

// ── IslamicPattern — geometry hoisted (static, computed once at module load) ───
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const _CX = 130, _CY = 130, _R = 110;
const _CIRC = 2 * Math.PI * _R;
const _DIAMONDS = Array.from({ length: 8 }).map((_, i) => {
  const ang = (i * Math.PI * 2) / 8 - Math.PI / 2;
  const x = _CX + (_R + 7) * Math.cos(ang);
  const y = _CY + (_R + 7) * Math.sin(ang);
  return `${x},${y - 5} ${x + 4},${y} ${x},${y + 5} ${x - 4},${y}`;
});
const _STAR_OUTER = starPoints(_CX, _CY, 52, 28, 8);
const _STAR_INNER = starPoints(_CX, _CY, 40, 20, 8);

function IslamicPattern({ seconds, totalSeconds }) {
  const { accentColor, accentDim, accentLight } = useTheme();
  const pct = Math.round((1 - seconds / totalSeconds) * 100);
  const dashOffsetAnim = useRef(new Animated.Value(_CIRC)).current;

  useEffect(() => {
    dashOffsetAnim.stopAnimation();
    Animated.timing(dashOffsetAnim, {
      toValue: _CIRC * (seconds / totalSeconds),
      duration: 900,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [seconds]);

  return (
    <Svg width={260} height={260} viewBox="0 0 260 260">
      <Defs>
        <LinearGradient id="arcG" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%"   stopColor={accentLight} />
          <Stop offset="50%"  stopColor={accentColor} />
          <Stop offset="100%" stopColor={accentDim} />
        </LinearGradient>
      </Defs>
      <Circle cx={_CX} cy={_CY} r={_R + 14} fill="none" stroke={_a(accentColor, 0.06)} strokeWidth={1} strokeDasharray="3 6" />
      <Circle cx={_CX} cy={_CY} r={_R + 10} fill="none" stroke={_a(accentColor, 0.04)} strokeWidth={1} />
      {_DIAMONDS.map((pts, i) => <Polygon key={i} points={pts} fill={_a(accentColor, 0.20)} />)}
      <Circle cx={_CX} cy={_CY} r={_R} fill="none" stroke={_a(accentColor, 0.08)} strokeWidth={8} />
      <AnimatedCircle
        cx={_CX} cy={_CY} r={_R}
        fill="none" stroke={accentColor} strokeWidth={8} strokeLinecap="round"
        strokeDasharray={_CIRC} strokeDashoffset={dashOffsetAnim}
        rotation="-90" origin={`${_CX},${_CY}`}
      />
      <Circle cx={_CX} cy={_CY} r={80} fill="none" stroke={_a(accentColor, 0.08)} strokeWidth={1} />
      <Polygon points={_STAR_OUTER} fill="none" stroke={_a(accentColor, 0.12)} strokeWidth={1} />
      <Polygon points={_STAR_INNER} fill="none" stroke={_a(accentColor, 0.08)} strokeWidth={1} />
      <SvgText x={_CX} y={_CY - 10} textAnchor="middle" fontSize="34" fontWeight="700" fill={accentColor}>{fmt(seconds)}</SvgText>
      <SvgText x={_CX} y={_CY + 10} textAnchor="middle" fontSize="11" fill={Colors.textMuted} letterSpacing="1">FOCUS</SvgText>
      <SvgText x={_CX} y={_CY + 30} textAnchor="middle" fontSize="12" fill={accentColor} opacity="0.7">{pct}%</SvgText>
    </Svg>
  );
}

// ── Flame ──────────────────────────────────────────────────────────────────────
function Flame({ extinguished, size = 90 }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (extinguished) { scaleAnim.setValue(1); return; }
    const anim = Animated.loop(Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 500, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1.08, duration: 500, useNativeDriver: true }),
    ]));
    anim.start();
    return () => anim.stop();
  }, [extinguished]);

  return (
    <Animated.Text style={{ fontSize: size * 0.9, transform: [{ scale: scaleAnim }], opacity: extinguished ? 0.15 : 1 }}>
      🔥
    </Animated.Text>
  );
}

// ── StreakExtinguish ───────────────────────────────────────────────────────────
function StreakExtinguish({ streak, onDone }) {
  const { accentColor } = useTheme();
  const [count, setCount] = useState(streak);
  const [extinguished, setExtinguished] = useState(false);

  useEffect(() => {
    if (count > 0) {
      const speed = count > 8 ? 50 : count > 3 ? 90 : 160;
      const t = setTimeout(() => setCount(c => c - 1), speed);
      return () => clearTimeout(t);
    } else {
      setExtinguished(true);
      const t = setTimeout(onDone, 2000);
      return () => clearTimeout(t);
    }
  }, [count]);

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <Flame extinguished={extinguished} size={90} />
      <Text style={{ fontSize: 52, fontWeight: '800', color: extinguished ? '#555' : accentColor }}>{count}</Text>
      <Text style={{ fontSize: 12, letterSpacing: 1.5, fontWeight: '700', color: extinguished ? '#444' : Colors.textMuted, textTransform: 'uppercase' }}>
        {extinguished ? 'STREAK PERDU' : 'JOURS DE STREAK'}
      </Text>
    </View>
  );
}

// ── PauseSheet ─────────────────────────────────────────────────────────────────
function PauseSheet({ onConfirm, onCancel, pausesLeft }) {
  const { accentColor, accentBg } = useTheme();
  const [selected, setSelected] = useState(5);
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.timing(slideAnim, { toValue: 0, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableOpacity style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.65)' }]} activeOpacity={1} onPress={onCancel} />
      <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={s.sheetHandle} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <View>
            <Text style={s.sheetTitle}>Durée de la pause</Text>
            <Text style={{ fontSize: 12, color: Colors.textMuted, marginTop: 2 }}>Maximum 15 minutes</Text>
          </View>
          <View style={[s.pauseCountBadge, { backgroundColor: accentBg, borderColor: _a(accentColor, 0.25) }]}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: accentColor }}>{pausesLeft}</Text>
            <Text style={{ fontSize: 9, color: Colors.textMuted }}>PAUSE{pausesLeft !== 1 ? 'S' : ''} REST.</Text>
          </View>
        </View>
        <View style={s.durationGrid}>
          {PAUSE_DURATIONS.map(min => (
            <TouchableOpacity key={min} onPress={() => setSelected(min)} style={[s.durationChip, selected === min && [s.durationChipActive, { backgroundColor: accentBg, borderColor: accentColor }]]}>
              <Text style={[s.durationNum, selected === min && { color: accentColor }]}>{min}</Text>
              <Text style={[s.durationUnit, selected === min && { color: accentColor }]}>min</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={() => onConfirm(selected)} style={[s.goldBtn, { backgroundColor: accentColor }]}>
          <Text style={s.goldBtnText}>Prendre une pause · {selected} min</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={[s.outlineBtn, { marginTop: 8 }]}>
          <Text style={{ fontSize: 14, color: Colors.textMuted }}>Annuler</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ── PauseScreen ────────────────────────────────────────────────────────────────
function PauseScreen({ duration, onResume }) {
  const { accentColor } = useTheme();
  const [remaining, setRemaining] = useState(duration * 60);
  const [contentIdx, setContentIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const onResumeRef = useRef(onResume);
  onResumeRef.current = onResume;
  const circ = 2 * Math.PI * 52;

  // Single interval — no teardown/recreation every tick
  useEffect(() => {
    const t = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(t); onResumeRef.current(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 350, useNativeDriver: true }).start(() => {
        setContentIdx(i => (i + 1) % PAUSE_CONTENT.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
      });
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const nav = (dir) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
      setContentIdx(i => (i + dir + PAUSE_CONTENT.length) % PAUSE_CONTENT.length);
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  };

  const prog = remaining / (duration * 60);
  const c = PAUSE_CONTENT[contentIdx];
  const typeColor = c.type === 'verse' ? '#4a7fc1' : c.type === 'hadith' ? Colors.greenLight : accentColor;
  const typeLabel = c.type === 'verse' ? 'VERSET' : c.type === 'hadith' ? 'HADITH' : 'DHIKR';

  return (
    <View style={{ flex: 1, padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 11, color: Colors.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', textAlign: 'center', marginTop: 4 }}>
        EN PAUSE · DHIKR
      </Text>
      <View style={{ alignSelf: 'center' }}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="52" fill="none" stroke="#1A1508" strokeWidth="5" />
          <Circle cx="60" cy="60" r="52" fill="none" stroke={Colors.textMuted} strokeWidth="5"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - prog)}
            rotation="-90" origin="60,60" />
          <SvgText x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="700" fill={Colors.textPrimary}>{fmt(remaining)}</SvgText>
          <SvgText x="60" y="73" textAnchor="middle" fontSize="9" fill={Colors.textMuted} letterSpacing="1">PAUSE</SvgText>
        </Svg>
      </View>
      <Animated.View style={[s.pauseCard, { opacity: fadeAnim, flex: 1 }]}>
        <View style={[s.typeTag, { backgroundColor: `${typeColor}18`, borderColor: `${typeColor}44` }]}>
          <Text style={[s.typeTagText, { color: typeColor }]}>{typeLabel}</Text>
        </View>
        <Text style={s.pauseAr}>{c.ar}</Text>
        <Text style={s.pauseFr}>{c.fr}</Text>
        <Text style={s.pauseSource}>{c.source}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 }}>
          <TouchableOpacity onPress={() => nav(-1)} style={s.navBtn}>
            <Text style={{ color: Colors.textMuted, fontSize: 18 }}>‹</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
            {PAUSE_CONTENT.map((_, i) => (
              <View key={i} style={{ width: i === contentIdx ? 16 : 5, height: 5, borderRadius: 3, backgroundColor: i === contentIdx ? accentColor : '#2a2a2a' }} />
            ))}
          </View>
          <TouchableOpacity onPress={() => nav(1)} style={s.navBtn}>
            <Text style={{ color: Colors.textMuted, fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <TouchableOpacity onPress={onResume} style={[s.goldBtn, { backgroundColor: accentColor }]}>
        <Text style={s.goldBtnText}>▶ Reprendre la session</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── EarlyEndScreen ─────────────────────────────────────────────────────────────
function EarlyEndScreen({ streak, onBack }) {
  const [phase, setPhase] = useState('streak');
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, gap: 22 }}>
      {phase === 'streak' ? (
        <StreakExtinguish streak={streak} onDone={() => setPhase('message')} />
      ) : (
        <>
          <Text style={{ fontSize: 36 }}>🌙</Text>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 }}>Continue d'essayer</Text>
            <Text style={{ fontSize: 13, color: Colors.textSecondary }}>Chaque effort compte, même le plus petit.</Text>
          </View>
          <View style={s.hadithCard}>
            <Text style={s.hadithAr}>أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ</Text>
            <Text style={s.hadithFr}>"L'action la plus aimée d'Allah est celle accomplie avec régularité, même si elle est peu."</Text>
            <Text style={s.hadithSource}>— Sahih Bukhari · 6464</Text>
          </View>
          <View style={s.streakResetRow}>
            <Text style={{ fontSize: 32, opacity: 0.15 }}>🔥</Text>
            <View>
              <Text style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 2 }}>STREAK RÉINITIALISÉ</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#555' }}>0 jour</Text>
            </View>
            <View style={{ marginLeft: 'auto', alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 11, color: Colors.textMuted }}>Prochain objectif</Text>
              <Text style={{ fontSize: 13, color: Colors.textSecondary, fontWeight: '600' }}>1 jour 🎯</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onBack} style={[s.goldBtn, { width: '100%' }]}>
            <Text style={s.goldBtnText}>Nouvelle session — بِسْمِ اللَّهِ</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ── CooldownScreen ─────────────────────────────────────────────────────────────
function CooldownScreen({ onDone }) {
  const { accentColor } = useTheme();
  const [remaining, setRemaining] = useState(COOLDOWN_SECONDS);
  const circ = 2 * Math.PI * 62;

  useEffect(() => {
    if (remaining <= 0) { onDone(); return; }
    const t = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(t);
  }, [remaining]);

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 24, gap: 24, flexGrow: 1, justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text style={{ fontSize: 36 }}>🌿</Text>
        <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.textPrimary }}>Session terminée</Text>
        <Text style={{ fontSize: 13, color: Colors.textMuted, lineHeight: 20 }}>Prends le temps de souffler et remercier.</Text>
      </View>
      <Svg width={140} height={140} viewBox="0 0 140 140">
        <Circle cx="70" cy="70" r="62" fill="none" stroke="#1A1508" strokeWidth="6" />
        <Circle cx="70" cy="70" r="62" fill="none" stroke={accentColor} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - remaining / COOLDOWN_SECONDS)}
          rotation="-90" origin="70,70" />
        <SvgText x="70" y="67" textAnchor="middle" fontSize="26" fontWeight="700" fill={Colors.textPrimary}>{remaining}</SvgText>
        <SvgText x="70" y="83" textAnchor="middle" fontSize="9" fill={Colors.textMuted} letterSpacing="1">SECONDES</SvgText>
      </Svg>
      <View style={s.dhikrCard}>
        <Text style={{ fontSize: 11, color: Colors.textMuted, letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' }}>
          Profites-en pour faire dhikr
        </Text>
        {DHIKR_COOLDOWN.map((d, i) => (
          <View key={i} style={[s.dhikrRow, i < DHIKR_COOLDOWN.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#1C180A' }]}>
            <Text style={s.dhikrAr}>{d.ar}</Text>
            <Text style={s.dhikrFr}>{d.fr}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={onDone} style={s.outlineBtn}>
        <Text style={{ fontSize: 13, color: Colors.textMuted }}>Passer →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function SessionWrap({ children }) {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>{children}</SafeAreaView>
    </View>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ACTIVE SESSION SCREEN
// ══════════════════════════════════════════════════════════════════════════════
export function ActiveSessionScreen({ session, onEnd }) {
  const { accentColor, accentBg } = useTheme();
  const TOTAL = (session.duration || 30) * 60;

  // Compute remaining seconds from startedAt so remounting never resets the timer
  const computeRemaining = () => {
    if (session.startedAt) {
      const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
      return Math.max(0, TOTAL - elapsed);
    }
    return TOTAL;
  };

  const [seconds, setSeconds] = useState(computeRemaining);
  const [subScreen, setSubScreen] = useState(() => computeRemaining() <= 0 ? 'done' : 'active');
  const [isRunning, setIsRunning] = useState(() => computeRemaining() > 0);
  const [pauseDuration, setPauseDuration] = useState(5);
  const [pausesUsed, setPausesUsed] = useState(0);
  const [emergencyUsed, setEmergencyUsed] = useState(false);
  const [verseIdx, setVerseIdx] = useState(0);
  const timerRef = useRef(null);
  const pausedAt = useRef(null);
  const breatheAnim = useRef(new Animated.Value(1)).current;

  const pauseMode = session.pauseMode || 'yes';
  const pausesLeft = pauseMode === 'no' ? 0 : MAX_PAUSES - pausesUsed;
  const verse = VERSES[verseIdx];
  const streak = session.streak || 0;
  const sessionNiyyah = session.niyyah || '';

  useEffect(() => {
    if (!isRunning) { return; }
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(t); setIsRunning(false); setSubScreen('done'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isRunning]);

  useEffect(() => {
    const t = setInterval(() => setVerseIdx(i => (i + 1) % VERSES.length), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isRunning) { breatheAnim.setValue(1); return; }
    const anim = Animated.loop(Animated.sequence([
      Animated.timing(breatheAnim, { toValue: 1.03, duration: 2000, useNativeDriver: true }),
      Animated.timing(breatheAnim, { toValue: 0.97, duration: 2000, useNativeDriver: true }),
    ]));
    anim.start();
    return () => anim.stop();
  }, [isRunning]);

  const handleStartPause = (min) => { pausedAt.current = seconds; setPausesUsed(p => p + 1); setPauseDuration(min); setIsRunning(false); setSubScreen('pausing'); };
  const handleRestart = () => { setSeconds(TOTAL); setPausesUsed(0); setEmergencyUsed(false); setIsRunning(true); setSubScreen('active'); };

  if (subScreen === 'earlyEnd') return <SessionWrap><EarlyEndScreen streak={streak} onBack={() => setSubScreen('cooldown')} /></SessionWrap>;
  if (subScreen === 'cooldown') return <SessionWrap><CooldownScreen onDone={() => { handleRestart(); onEnd(true); }} /></SessionWrap>;
  if (subScreen === 'pausing') return <SessionWrap><PauseScreen duration={pauseDuration} onResume={() => { if (pausedAt.current !== null) { setSeconds(pausedAt.current); pausedAt.current = null; } setIsRunning(true); setSubScreen('active'); }} /></SessionWrap>;

  if (subScreen === 'done') return (
    <SessionWrap>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20 }}>
        <Text style={{ fontSize: 60 }}>⭐</Text>
        <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' }}>MashaAllah!</Text>
        <Text style={{ fontSize: 22, color: accentColor, opacity: 0.85 }}>أَحْسَنْتَ</Text>
        <Text style={{ fontSize: 13, color: Colors.textMuted, textAlign: 'center', lineHeight: 22, maxWidth: 280 }}>
          Tu as complété ta session avec constance. C'est cela que Allah aime le plus.
        </Text>
        <View style={[s.streakBadge, { backgroundColor: accentBg, borderColor: _a(accentColor, 0.2) }]}>
          <Text style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>STREAK</Text>
          <Text style={{ fontSize: 22, fontWeight: '700', color: accentColor }}>🔥 {streak + 1} jours</Text>
        </View>
        <TouchableOpacity onPress={() => setSubScreen('cooldown')} style={[s.goldBtn, { backgroundColor: accentColor, width: '100%' }]}>
          <Text style={s.goldBtnText}>Terminer — الحمد لله</Text>
        </TouchableOpacity>
      </View>
    </SessionWrap>
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>

        {/* Header */}
        <View style={s.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity onPress={() => onEnd(false)} style={s.backCircle}>
              <Text style={{ color: Colors.textMuted, fontSize: 18 }}>←</Text>
            </TouchableOpacity>
            <View>
              <Text style={{ fontSize: 11, color: accentColor, letterSpacing: 1 }}>EN COURS</Text>
              <Text style={{ fontSize: 17, fontWeight: '700', color: Colors.textPrimary }}>{session.name}</Text>
              {!!session.nameAr && <Text style={{ fontSize: 11, color: Colors.textMuted }}>{session.nameAr}</Text>}
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <View style={[s.streakPill, { backgroundColor: accentBg, borderColor: _a(accentColor, 0.25) }]}>
              <View style={[s.streakDot, { backgroundColor: accentColor }]} />
              <Text style={{ fontSize: 13, color: accentColor, fontWeight: '700' }}>🔥 {streak} jours</Text>
            </View>
            {pauseMode === 'no'
              ? <Text style={{ fontSize: 10, color: Colors.textMuted }}>🔒 Mode strict</Text>
              : pausesLeft < MAX_PAUSES
                ? <Text style={{ fontSize: 10, color: pausesLeft === 0 ? '#c0392b' : Colors.textMuted }}>
                    {pausesLeft === 0 ? 'Aucune pause restante' : `${pausesLeft} pause${pausesLeft !== 1 ? 's' : ''} restante${pausesLeft !== 1 ? 's' : ''}`}
                  </Text>
                : null}
          </View>
        </View>

        {/* Timer */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View style={{ transform: [{ scale: breatheAnim }] }}>
            <IslamicPattern seconds={seconds} totalSeconds={TOTAL} />
          </Animated.View>
          {!!sessionNiyyah && (
            <View style={[s.niyyahBox, { backgroundColor: accentBg, borderColor: _a(accentColor, 0.15) }]}>
              <Text style={{ fontSize: 10, color: accentColor, letterSpacing: 1, marginBottom: 3, textTransform: 'uppercase' }}>TÂCHE</Text>
              <Text style={{ fontSize: 12, color: Colors.textSecondary, fontStyle: 'italic' }}>{sessionNiyyah}</Text>
            </View>
          )}
        </View>

        {/* Verse */}
        <View style={{ paddingHorizontal: 24, marginBottom: 14, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, color: Colors.textSecondary, marginBottom: 4, textAlign: 'center' }}>{verse.ar}</Text>
          <Text style={{ fontSize: 11, color: Colors.textMuted, textAlign: 'center' }}>{verse.fr} — {verse.source}</Text>
        </View>

        {/* Controls */}
        <View style={s.controls}>
          {pauseMode === 'no' || pausesLeft === 0 ? (
            <View style={[s.pauseBtn, { opacity: 0.25 }]}>
              <Text style={{ fontSize: 14, color: Colors.textPrimary }}>⏸ Pause</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setSubScreen('pausePicker')} style={s.pauseBtn}>
              <Text style={{ fontSize: 14, color: Colors.textPrimary }}>⏸ Pause</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setSubScreen('endConfirm')} style={s.endBtn}>
            <Text style={s.endBtnText}>Terminer</Text>
          </TouchableOpacity>
        </View>

        {/* Pause picker */}
        {subScreen === 'pausePicker' && (
          <PauseSheet pausesLeft={pausesLeft} onConfirm={handleStartPause} onCancel={() => setSubScreen('active')} />
        )}

        {/* End confirm */}
        {subScreen === 'endConfirm' && (
          <View style={[StyleSheet.absoluteFill, { zIndex: 50 }]} pointerEvents="box-none">
            <TouchableOpacity style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.75)' }]}
              activeOpacity={1} onPress={() => setSubScreen('active')} />
            <View style={[s.sheet, { gap: 10 }]}>
              <View style={s.sheetHandle} />
              <View style={{ alignItems: 'center', marginBottom: 14 }}>
                <Text style={{ fontSize: 28, marginBottom: 10 }}>🤜</Text>
                <Text style={{ fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 }}>Lu'bat Al-Qawy</Text>
                <Text style={{ fontSize: 13, color: Colors.textMuted, lineHeight: 20, textAlign: 'center' }}>
                  "Le vrai fort est celui qui se maîtrise lui-même."
                </Text>
                <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 4, opacity: 0.7 }}>— Sahih Bukhari & Muslim</Text>
              </View>
              {!emergencyUsed && (
                <TouchableOpacity
                  onPress={() => { pausedAt.current = seconds; setEmergencyUsed(true); setPauseDuration(5); setPausesUsed(p => p + 1); setIsRunning(false); setSubScreen('pausing'); }}
                  style={s.emergencyBtn}>
                  <Text style={{ fontSize: 13, color: accentColor }}>⚡ Emergency Break — 5 min (1× par session)</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setSubScreen('earlyEnd')} style={[s.endEarlyBtn, { borderColor: _a(accentColor, 0.3) }]}>
                <Text style={s.endBtnText}>Terminer la session</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSubScreen('active')} style={s.outlineBtn}>
                <Text style={{ fontSize: 14, color: Colors.textMuted }}>Continuer ↩</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  header:          { ...S.rowBetween, paddingHorizontal: 20, paddingVertical: 12 },
  backCircle:      { ...S.iconBox, width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceCard },
  streakPill:      { ...S.row, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, gap: 6 },
  streakDot:       { width: 6, height: 6, borderRadius: 3 },
  niyyahBox:       { borderWidth: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, marginTop: 14, marginHorizontal: 20 },
  controls:        { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingBottom: 16 },
  pauseBtn:        { flex: 1, backgroundColor: Colors.surfaceDark, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  endBtn:          { flex: 1, backgroundColor: 'rgba(139,30,20,0.12)', borderWidth: 1, borderColor: 'rgba(180,60,50,0.35)', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  endBtnText:      { fontSize: 14, color: 'rgba(200,90,80,0.9)' },
  sheet:           { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surfaceDeep, borderTopWidth: 1, borderTopColor: Colors.border, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  sheetHandle:     { ...S.handle, marginBottom: 20 },
  sheetTitle:      { ...S.heading },
  pauseCountBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center' },
  durationGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  durationChip:    { width: '30%', backgroundColor: Colors.surfaceDark, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  durationChipActive: {},
  durationNum:     { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  durationUnit:    { ...S.label, fontSize: 11, marginTop: 2 },
  goldBtn:         { borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  goldBtnText:     { fontSize: 15, fontWeight: '700', color: '#000' },
  outlineBtn:      { borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingVertical: 13, alignItems: 'center', paddingHorizontal: 40 },
  emergencyBtn:    { borderWidth: 1, backgroundColor: Colors.surfaceDark, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  endEarlyBtn:     { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(180,60,50,0.4)', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  pauseCard:       { ...S.card, borderRadius: 16, padding: 18 },
  typeTag:         { ...S.pill, alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 3, marginBottom: 14, backgroundColor: 'transparent' },
  typeTagText:     { fontSize: 10, letterSpacing: 1, fontWeight: '700' },
  pauseAr:         { fontSize: 17, color: Colors.textPrimary, lineHeight: 30, textAlign: 'right', marginBottom: 10 },
  pauseFr:         { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 6 },
  pauseSource:     { ...S.label, fontSize: 11, opacity: 0.7 },
  navBtn:          { ...S.iconBox, width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surfaceDark },
  hadithCard:      { ...S.card, borderRadius: 14, padding: 18, width: '100%' },
  hadithAr:        { fontSize: 15, color: Colors.textSecondary, textAlign: 'right', marginBottom: 10, lineHeight: 26 },
  hadithFr:        { fontSize: 12, color: Colors.textMuted, lineHeight: 18, marginBottom: 6 },
  hadithSource:    { ...S.label, fontSize: 11, opacity: 0.7 },
  streakResetRow:  { ...S.row, ...S.card, borderRadius: 12, padding: 14, gap: 14, width: '100%' },
  streakBadge:     { borderWidth: 1, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 16, alignItems: 'center' },
  dhikrCard:       { ...S.card, borderRadius: 14, padding: 18, width: '100%' },
  dhikrRow:        { ...S.rowBetween, paddingVertical: 10 },
  dhikrAr:         { fontSize: 14, color: Colors.textPrimary },
  dhikrFr:         { ...S.label, fontSize: 11 },
});
