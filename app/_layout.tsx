import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../hooks/useTheme';
import { TransactionsProvider } from '../hooks/useTransactions';
import { PreloadScreen } from '../components/ui/PreloadScreen';
import { initDatabase } from '../database/db';

function RootNavigation() {
  const { isDark, colors } = useTheme();
  const [isPreloadComplete, setIsPreloadComplete] = useState(false);

  useEffect(() => {
    initDatabase().catch((e) => console.warn('[SnapCost DB Init]', e));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="scan-review" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="transaction/[id]" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>

      {!isPreloadComplete && (
        <PreloadScreen onFinish={() => setIsPreloadComplete(true)} />
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TransactionsProvider>
          <RootNavigation />
        </TransactionsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
