import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionCard } from '../components/SessionCard';
import { Colors } from '../theme/colors';
import { sessions } from '../data/mockData';

export function SessionsScreen({ onStartSession }) {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerAr}>الجلسات</Text>
            <Text style={styles.title}>Focus Sessions</Text>
          </View>

          {/* New session button */}
          <TouchableOpacity style={styles.newBtn} activeOpacity={0.7}>
            <Text style={styles.newBtnText}>+ Nouvelle session</Text>
          </TouchableOpacity>

          {/* Sessions list */}
          {sessions.map((s, i) => (
            <SessionCard
              key={s.id}
              session={s}
              onPress={() => onStartSession(s)}
              delay={i * 60}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 23, paddingBottom: 116 },

  header: { paddingTop: 23, marginBottom: 28 },
  headerAr: { fontSize: 13, color: Colors.textMuted, letterSpacing: 0.8, marginBottom: 7 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary },

  newBtn: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(201,168,76,0.4)',
    borderRadius: 16,
    backgroundColor: Colors.goldBg,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 23,
  },
  newBtnText: { fontSize: 16, color: Colors.gold, fontWeight: '600' },
});
