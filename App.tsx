import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BottomNav, TabId } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { SessionsScreen } from './src/screens/SessionsScreen';
import { ChallengesScreen } from './src/screens/ChallengesScreen';
import { RihlaScreen } from './src/screens/RihlaScreen';
import { NiyyahScreen } from './src/screens/NiyyahScreen';
import { ActiveSessionScreen } from './src/screens/ActiveSessionScreen';
import { KhushuScreen } from './src/screens/KhushuScreen';
import { Colors } from './src/theme/colors';
import { SessionType } from './src/data/mockData';

type Screen = 'main' | 'niyyah' | 'active' | 'khushu';

export default function App() {
  const [tab, setTab]                     = useState<TabId>('home');
  const [screen, setScreen]               = useState<Screen>('main');
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);
  const [niyyah, setNiyyah]               = useState('');

  function handleStartSession(session: SessionType) {
    setSelectedSession(session);
    setScreen('niyyah');
  }

  function handleLaunch(n: string) {
    setNiyyah(n);
    setScreen('active');
  }

  function handleBack() {
    setScreen('main');
    setSelectedSession(null);
    setNiyyah('');
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.root}>

        {/* ─── Khushu screen ─────────────────────────────────── */}
        {screen === 'khushu' && (
          <KhushuScreen onBack={handleBack} />
        )}

        {/* ─── Niyyah screen ─────────────────────────────────── */}
        {screen === 'niyyah' && selectedSession && (
          <NiyyahScreen
            session={selectedSession}
            onBack={handleBack}
            onLaunch={handleLaunch}
          />
        )}

        {/* ─── Active session screen ──────────────────────────── */}
        {screen === 'active' && selectedSession && (
          <ActiveSessionScreen
            session={selectedSession}
            niyyah={niyyah}
            onEnd={handleBack}
          />
        )}

        {/* ─── Main tab screens ───────────────────────────────── */}
        {screen === 'main' && (
          <>
            {tab === 'home' && (
              <HomeScreen
                onStartSession={handleStartSession}
                onKhushuPress={() => setScreen('khushu')}
              />
            )}
            {tab === 'sessions' && (
              <SessionsScreen onStartSession={handleStartSession} />
            )}
            {tab === 'challenges' && <ChallengesScreen />}
            {tab === 'rihla' && <RihlaScreen />}

            <BottomNav active={tab} onSelect={setTab} />
          </>
        )}

      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
});
