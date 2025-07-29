// ================================================================
// src/components/ui/ModernScreen.js
// 📱 MODERNÍ SCREEN - čisté pozadí
import React from 'react';
import { View, StatusBar, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../styles/designSystem';

export const Screen = ({
  children,
  variant = 'white', // white | soft | gradient
  statusBar = 'dark-content',
  safeArea = true,
  style = {},
  ...props
}) => {
  const Wrapper = safeArea ? SafeAreaView : View;
  
  const variants = {
    white: {
      backgroundColor: colors.white,
    },
    soft: {
      backgroundColor: colors.backgroundSoft,
    },
    gradient: null, // bude použit LinearGradient
  };

  const screenStyle = [
    { flex: 1 },
    variants[variant] || variants.white,
    style,
  ];

  if (variant === 'gradient') {
    return (
      <>
        <StatusBar barStyle={statusBar} backgroundColor="transparent" translucent />
        <LinearGradient
          colors={gradients.backgroundSoft}
          style={{ flex: 1 }}
        >
          <Wrapper style={screenStyle} {...props}>
            {children}
          </Wrapper>
        </LinearGradient>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle={statusBar} backgroundColor="transparent" translucent />
      <Wrapper style={screenStyle} {...props}>
        {children}
      </Wrapper>
    </>
  );
};