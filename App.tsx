import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import LoginScreen from './src/components/LoginScreen';
import MainApp from './src/components/MainApp';

import SplashScreen from './src/components/SplashScreen';

function AppContent() {
  const { userName } = useApp();
  const isLoggedIn = userName !== '';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        {!isLoggedIn ? <LoginScreen /> : <MainApp />}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Simulate loading resources
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4', // green-50
  },
  content: {
    flex: 1,
  },
});
