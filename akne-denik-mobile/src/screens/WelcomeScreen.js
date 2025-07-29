// src/screens/WelcomeScreen.js
// 🎉 WELCOME SCREEN podle posledního screenshotu Charm App
import React from 'react';
import { View, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Screen,
  Button,
  Title,
  Body,
  Caption,
  Column,
  Spacer,
  colors,
  spacing,
  gradients,
} from '../components/ui';

const WelcomeScreen = ({ navigation }) => {
  return (
    <Screen variant="gradient">
      <LinearGradient
        colors={['rgba(168, 85, 247, 0.8)', 'rgba(147, 51, 234, 0.9)']}
        style={{ flex: 1 }}
      >
        {/* Background Image podobný Charm app - můžeme přidat obrázek */}
        <View style={{ 
          flex: 1, 
          justifyContent: 'flex-end',
          padding: spacing.lg,
          paddingBottom: spacing.xxxl,
        }}>
          
          {/* Logo/Icon */}
          <View style={{
            width: 80,
            height: 80,
            backgroundColor: colors.white,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginBottom: spacing.xxxl,
          }}>
            <Title level={1} color="primary">
              charm
            </Title>
          </View>
          
          {/* Welcome Text */}
          <Column align="center" gap="md" style={{ marginBottom: spacing.xxxl }}>
            <Title level={1} color="white" align="center">
              Welcome to Charm!
            </Title>
            
            <Body color="white" align="center" style={{ opacity: 0.9, lineHeight: 24 }}>
              Your ultimate companion for your skincare
              journey. Achieve perfect skin with
              personalized routines and routine tracking.
            </Body>
          </Column>
          
          {/* Terms */}
          <Caption color="white" align="center" style={{ 
            opacity: 0.8, 
            marginBottom: spacing.lg,
            lineHeight: 20,
          }}>
            By continuing, you agree to our{' '}
            <Caption color="white" style={{ textDecorationLine: 'underline' }}>
              Terms
            </Caption>
            {' '}and{' '}
            <Caption color="white" style={{ textDecorationLine: 'underline' }}>
              Privacy Policy
            </Caption>
            .
          </Caption>
          
          {/* Buttons */}
          <Column gap="md">
            <Button
              title="GET STARTED"
              onPress={() => navigation.navigate('Onboarding')}
              variant="primary"
              style={{
                backgroundColor: colors.white,
                borderRadius: 28,
                minHeight: 56,
              }}
              textStyle={{ color: colors.primary, fontWeight: '600', fontSize: 16 }}
              fullWidth
            />
            
            <Button
              title="Already have an account? Login"
              onPress={() => navigation.navigate('Login')}
              variant="ghost"
              style={{ minHeight: 48 }}
              textStyle={{ color: colors.white, fontSize: 16 }}
            />
          </Column>
        </View>
      </LinearGradient>
    </Screen>
  );
};

export default WelcomeScreen;