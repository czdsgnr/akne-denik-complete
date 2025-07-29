// src/screens/LoadingScreen.js - Jednoduchý s design systémem
import React from 'react';
import { SafeAreaView } from 'react-native';
import { Screen, LoadingSpinner, Title, colors } from '../components/ui';

const LoadingScreen = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundSecondary }}>
    <Screen>
      <Title 
        level={1} 
        align="center" 
        style={{ 
          marginBottom: 32, 
          color: colors.primary,
          fontSize: 32,
          fontWeight: 'bold'
        }}
      >
        Akné Deník
      </Title>
      <LoadingSpinner text="Načítání..." />
    </Screen>
  </SafeAreaView>
);

export default LoadingScreen;