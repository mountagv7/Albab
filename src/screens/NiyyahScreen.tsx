import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { SessionType } from '../data/mockData';

const SUGGESTIONS = [
  "Étudier pour la satisfaction d'Allah",
  'Lire le Coran avec présence',
  'Travailler pour subvenir à ma famille',
  "Me préparer pour l'examen",
];

interface Props {
  session: SessionType;
  onBack: () => void;
  onLaunch: (niyyah: string) => void;
}

export function NiyyahScreen({ session, onBack, onLaunch }: Props) {
  const [niyyah, setNiyyah] = useState('');

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Retour</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.tag}>NIYYAH — النية</Text>
          <Text style={styles.title}>Quelle est ton intention ?</Text>
          <Text style={styles.hadith}>
            "Les actes ne valent que par les intentions."{'\n'}
            <Text style={styles.hadithSource}>— Sahih al-Bukhari</Text>
          </Text>

          {/* Arabic accent */}
          <View style={styles.arabicAccent}>
            <Text style={styles.arabicAccentText}>بِسْمِ اللَّهِ</Text>
          </View>

          {/* Textarea */}
          <TextInput
            value={niyyah}
            onChangeText={setNiyyah}
            placeholder="Qu'est-ce que tu veux accomplir pour Allah ?"
            placeholderTextColor="#444"
            multiline
            style={[styles.input, niyyah ? styles.inputActive : null]}
          />

          {/* Suggestions */}
          <Text style={styles.suggestionsLabel}>SUGGESTIONS</Text>
          {SUGGESTIONS.map((s, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setNiyyah(s)}
              style={[
                styles.suggestion,
                niyyah === s && styles.suggestionActive,
              ]}
            >
              <Text
                style={[
                  styles.suggestionText,
                  niyyah === s && styles.suggestionTextActive,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Session summary */}
          <View style={styles.summary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>SESSION</Text>
              <Text style={styles.summaryValue}>{session.name}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>DURÉE</Text>
              <Text style={styles.summaryValue}>{session.time}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>APPS</Text>
              <Text style={styles.summaryValue}>{session.apps} bloquées</Text>
            </View>
          </View>
        </ScrollView>

        {/* Launch button */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => onLaunch(niyyah)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.gold, '#a8782a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.launchBtn}
            >
              <Text style={styles.launchText}>Commencer — بسم الله</Text>
            </LinearGradient>
          </TouchableOpacity>
          {!niyyah && (
            <Text style={styles.skipHint}>
              Tu peux commencer sans niyyah, mais elle donne du sens.
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  topBar: { paddingHorizontal: 23, paddingTop: 14 },
  backBtn: { paddingVertical: 5, alignSelf: 'flex-start' },
  backText: { fontSize: 15, color: Colors.textMuted },

  scroll: { paddingHorizontal: 23, paddingBottom: 28 },

  tag: {
    fontSize: 13, color: Colors.gold, letterSpacing: 1, marginBottom: 7, marginTop: 23,
  },
  title: {
    fontSize: 26, fontWeight: '700', color: Colors.textPrimary,
    lineHeight: 33, marginBottom: 9,
  },
  hadith: {
    fontSize: 15, color: Colors.textMuted, lineHeight: 23,
  },
  hadithSource: { fontSize: 13, opacity: 0.7 },

  arabicAccent: { alignItems: 'center', paddingVertical: 28, opacity: 0.15 },
  arabicAccentText: { fontSize: 37, color: Colors.gold },

  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 19,
    color: Colors.textPrimary,
    fontSize: 18,
    lineHeight: 28,
    height: 128,
    textAlignVertical: 'top',
    marginBottom: 23,
  },
  inputActive: { borderColor: 'rgba(201,168,76,0.4)' },

  suggestionsLabel: {
    fontSize: 13, color: Colors.textMuted, letterSpacing: 0.6, marginBottom: 12,
  },
  suggestion: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 9,
  },
  suggestionActive: {
    backgroundColor: Colors.goldBg,
    borderColor: 'rgba(201,168,76,0.3)',
  },
  suggestionText: { fontSize: 15, color: Colors.textSecondary },
  suggestionTextActive: { color: Colors.gold },

  summary: {
    backgroundColor: '#0f0f0f',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    flexDirection: 'row',
    marginTop: 23,
    marginBottom: 9,
  },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  summaryLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 5 },
  summaryValue: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  summaryDivider: { width: 1, backgroundColor: Colors.border },

  footer: {
    paddingHorizontal: 23,
    paddingBottom: 47,
    paddingTop: 9,
  },
  launchBtn: {
    borderRadius: 16,
    paddingVertical: 19,
    alignItems: 'center',
  },
  launchText: { fontSize: 19, fontWeight: '700', color: '#000' },
  skipHint: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
    color: Colors.textMuted,
  },
});
