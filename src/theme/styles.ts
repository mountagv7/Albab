import { StyleSheet } from 'react-native';
import { Colors } from './colors';

// ── Shared static styles ─────────────────────────────────────────────────────
// Use S.xxx in JSX. For overrides: style={[S.card, { marginBottom: 14 }]}
// For accent-color-dependent styles, use the helper functions below.

export const S = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────────────────
  screen:        { flex: 1 },
  fill:          { flex: 1 },
  row:           { flexDirection: 'row', alignItems: 'center' },
  rowBetween:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  center:        { alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

  // ── Cards ──────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.surface,
    borderWidth:     1,
    borderColor:     Colors.border,
    borderRadius:    16,
    padding:         16,
  },
  cardElevated: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth:     1,
    borderColor:     Colors.border,
    borderRadius:    14,
    padding:         16,
  },

  // ── Icon box ─────────────────────────────────────────────────────────
  iconBox: {
    width:           40,
    height:          40,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    backgroundColor: Colors.surfaceElevated,
    alignItems:      'center',
    justifyContent:  'center',
  },

  // ── Typography ────────────────────────────────────────────────────────
  screenTitle: {
    fontSize:      22,
    fontWeight:    '700',
    color:         Colors.textPrimary,
    letterSpacing: -0.5,
    marginTop:     16,
    marginBottom:  16,
  },
  heading: {
    fontSize:   18,
    fontWeight: '600',
    color:      Colors.textPrimary,
  },
  body: {
    fontSize: 15,
    color:    Colors.textPrimary,
  },
  bodySecondary: {
    fontSize:   14,
    color:      Colors.textSecondary,
    lineHeight: 22,
  },
  meta: {
    fontSize: 13,
    color:    Colors.textMuted,
  },
  label: {
    fontSize:      12,
    color:         Colors.textMuted,
    letterSpacing: 0.8,
  },

  // ── Buttons ───────────────────────────────────────────────────────────
  btnPrimary: {
    height:         54,
    borderRadius:   14,
    alignItems:     'center',
    justifyContent: 'center',
  },
  btnSecondary: {
    height:          54,
    borderRadius:    14,
    backgroundColor: Colors.surfaceElevated,
    borderWidth:     1,
    borderColor:     Colors.border,
    alignItems:      'center',
    justifyContent:  'center',
  },
  btnLabel: {
    fontSize:   16,
    fontWeight: '700',
  },
  btnLabelSecondary: {
    fontSize:   15,
    fontWeight: '600',
    color:      Colors.textSecondary,
  },

  // ── Progress bars ─────────────────────────────────────────────────────
  progressTrack: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius:    7,
    height:          7,
    overflow:        'hidden',
  },
  progressTrackThin: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius:    2,
    height:          4,
    overflow:        'hidden',
  },
  progressFill: {
    height:       '100%',
    borderRadius: 7,
  },

  // ── Bottom sheet handle ───────────────────────────────────────────────
  handle: {
    width:           36,
    height:          4,
    borderRadius:    2,
    backgroundColor: Colors.border,
    alignSelf:       'center',
  },

  // ── Pill / badge ─────────────────────────────────────────────────────
  pill: {
    borderRadius:      20,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderWidth:       1,
    borderColor:       Colors.border,
    backgroundColor:   Colors.surfaceElevated,
  },
  pillText: {
    fontSize: 12,
    color:    Colors.textMuted,
  },

  // ── Text input ────────────────────────────────────────────────────────
  input: {
    backgroundColor: Colors.surface,
    borderWidth:     1,
    borderColor:     Colors.border,
    borderRadius:    12,
    padding:         14,
    fontSize:        15,
    color:           Colors.textPrimary,
  },

  // ── Divider ───────────────────────────────────────────────────────────
  divider: {
    height:          1,
    backgroundColor: Colors.border,
  },

  // ── Shadow presets ────────────────────────────────────────────────────
  softGlow: {
    shadowOpacity: 0.08,
    shadowRadius:  20,
    shadowOffset:  { width: 0, height: 0 },
    elevation:     3,
  },
  strongGlow: {
    shadowOpacity: 0.6,
    shadowRadius:  12,
    shadowOffset:  { width: 0, height: 4 },
    elevation:     8,
  },

  // ── Navigation ───────────────────────────────────────────────────────
  backBtn:  { paddingVertical: 5, alignSelf: 'flex-start' },
  backText: { fontSize: 15, color: Colors.textMuted },
});

// ── Accent-color-dependent helpers ───────────────────────────────────────────
// These can't live in StyleSheet.create() because they depend on runtime values.

export function accentGlow(color: string) {
  return {
    shadowColor:   color,
    shadowOpacity: 0.3,
    shadowRadius:  16,
    shadowOffset:  { width: 0, height: 0 } as const,
    elevation:     6,
  };
}

export function accentSoftGlow(color: string) {
  return {
    shadowColor:   color,
    shadowOpacity: 0.08,
    shadowRadius:  20,
    shadowOffset:  { width: 0, height: 0 } as const,
    elevation:     3,
  };
}

export function accentActive(bg: string, border: string) {
  return { backgroundColor: bg, borderColor: border };
}
