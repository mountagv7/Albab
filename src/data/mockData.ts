export type SessionType = { id: number; name: string; nameAr: string; time: string; apps: number; active: boolean; type: 'planning' | 'timer' };
export type BadgeType = { id: string; name: string; nameAr: string; icon: string; unlocked: boolean; desc: string };
export type ChallengeType = { id: string; name: string; nameAr: string; days: number | null; current: number; color: string; premium: boolean };
export type VerseType = { ar: string; fr: string; source: string };

export const arabicVerses: VerseType[] = [
  { ar: 'وَاذْكُرُوا اللَّهَ كَثِيرًا', fr: 'Invoquez Allah abondamment', source: 'Al-Anfal 8:45' },
  { ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', fr: 'Avec la difficulté vient la facilité', source: 'Al-Inshirah 94:6' },
  { ar: 'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', fr: "Par le Temps, l'homme est en perdition", source: 'Al-Asr 103:1-2' },
  { ar: 'وَفِي ذَٰلِكَ فَلْيَتَنَافَسِ الْمُتَنَافِسُونَ', fr: 'Que les compétiteurs rivalisent pour cela', source: 'Al-Mutaffifin 83:26' },
];

export const sessions: SessionType[] = [
  { id: 1, name: 'Khushu Mode', nameAr: 'خشوع', time: '06:00 – 08:00', apps: 5, active: true, type: 'planning' },
  { id: 2, name: 'Heure du Coran', nameAr: 'وقت القرآن', time: '30 min', apps: 8, active: false, type: 'timer' },
  { id: 3, name: 'Qiyam al-Layl', nameAr: 'قيام الليل', time: '22:30 – 00:00', apps: 12, active: false, type: 'planning' },
];

export const badges: BadgeType[] = [
  { id: 'sabr', name: 'Sabr', nameAr: 'صبر', icon: '⏳', unlocked: true, desc: '7 jours consécutifs' },
  { id: 'asr', name: 'Al-Asr', nameAr: 'العصر', icon: '🌅', unlocked: true, desc: '1ère session complète' },
  { id: 'tawbah', name: 'Tawbah', nameAr: 'توبة', icon: '🌿', unlocked: true, desc: 'Reprise après streak cassé' },
  { id: 'ikhlas', name: 'Ikhlas', nameAr: 'إخلاص', icon: '✨', unlocked: false, desc: 'Niyyah définie 20 fois' },
  { id: 'mujahid', name: 'Mujahid', nameAr: 'مجاهد', icon: '🛡️', unlocked: false, desc: '100 sessions complètes' },
  { id: 'barakah', name: 'Barakah', nameAr: 'بركة', icon: '🌙', unlocked: false, desc: "30 jours d'objectif atteint" },
];

export const challenges: ChallengeType[] = [
  { id: 'ramadan', name: 'Ramadan Challenge', nameAr: 'تحدي رمضان', days: 30, current: 14, color: '#C9A84C', premium: false },
  { id: 'dhul', name: 'Dhul Hijjah', nameAr: 'ذو الحجة', days: 10, current: 0, color: '#1A6B4A', premium: false },
  { id: 'ilm', name: 'Challenge Ilm', nameAr: 'تحدي العلم', days: 21, current: 0, color: '#4a7fc1', premium: false },
  { id: 'streak', name: 'Streak Absolu', nameAr: 'ستريك مطلق', days: null, current: 0, color: '#8B2020', premium: true },
];
