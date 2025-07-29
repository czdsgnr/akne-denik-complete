// src/screens/DesignPlayground.js
// 🤍 KRÁTKÝ & ČISTÝ DESIGN PLAYGROUND - jen 2 karty
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, Text, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Title,
  Body,
  Caption,
  Row,
  Avatar,
  Badge,
  ProgressBar,
  colors,
  spacing,
  borderRadius,
  shadows,
} from '../components/ui';

const DesignPlayground = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(3);
  const [progress, setProgress] = useState(0.65);

  const moods = [
    { value: 1, emoji: '😞', label: 'Špatná' },
    { value: 2, emoji: '😕', label: 'Horší' },
    { value: 3, emoji: '😐', label: 'OK' },
    { value: 4, emoji: '😊', label: 'Dobrá' },
    { value: 5, emoji: '😄', label: 'Skvělá' }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={{ 
        backgroundColor: colors.background,
        paddingTop: spacing.md,
        paddingHorizontal: spacing.md, // 16px
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
      }}>
        <Row style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md,
              ...shadows.sm
            }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={{ flex: 1 }}>
            <Title level={1} style={{ fontSize: 28, marginBottom: spacing.xs }}>
              Design Test
            </Title>
            <Caption style={{ color: colors.textSecondary, fontSize: 16 }}>
              Čistý bílý design
            </Caption>
          </View>

          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Ionicons name="color-palette" size={24} color={colors.primary} />
          </View>
        </Row>
      </View>

      {/* Content - jen 2 karty */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: spacing.md, // 16px
          paddingTop: spacing.lg,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* KARTA 1 - Komponenty */}
        <View style={{
          backgroundColor: colors.white,
          borderRadius: borderRadius.xl,
          padding: spacing.xl,
          marginBottom: spacing.xl,
          ...shadows.md
        }}>
          <Row style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md
            }}>
              <Ionicons name="cube" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Title level={3}>Komponenty</Title>
              <Caption style={{ color: colors.textSecondary }}>
                Tlačítka, text, avatary
              </Caption>
            </View>
          </Row>
          
          {/* Buttons */}
          <View style={{ marginBottom: spacing.lg }}>
            <Caption style={{ marginBottom: spacing.md, fontWeight: '600' }}>
              Tlačítka
            </Caption>
            <Row style={{ gap: spacing.sm, marginBottom: spacing.md }}>
              <Button 
                title="Primary" 
                variant="primary" 
                size="medium"
                style={{ flex: 1 }}
              />
              <Button 
                title="Outline" 
                variant="outline" 
                size="medium"
                style={{ flex: 1 }}
              />
            </Row>
            <Button 
              title="Large tlačítko" 
              variant="primary" 
              size="large"
              fullWidth
            />
          </View>

          {/* Typography */}
          <View style={{ marginBottom: spacing.lg }}>
            <Caption style={{ marginBottom: spacing.md, fontWeight: '600' }}>
              Text
            </Caption>
            <View style={{ gap: spacing.sm }}>
              <Title level={2}>Hlavní nadpis</Title>
              <Body>Základní text aplikace</Body>
              <Caption>Malý popisek</Caption>
            </View>
          </View>

          {/* Avatars & Badges */}
          <View>
            <Caption style={{ marginBottom: spacing.md, fontWeight: '600' }}>
              Avatary & Odznaky
            </Caption>
            <Row style={{ 
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing.md
            }}>
              <Row style={{ gap: spacing.md }}>
                <Avatar name="Tereza" size="small" />
                <Avatar name="Tereza" size="medium" />
                <Avatar name="Tereza" size="large" />
              </Row>
            </Row>
            <Row style={{ gap: spacing.sm, flexWrap: 'wrap' }}>
              <Badge text="Primary" variant="primary" />
              <Badge text="Success" variant="success" />
            </Row>
          </View>
        </View>

        {/* KARTA 2 - Interakce */}
        <View style={{
          backgroundColor: colors.white,
          borderRadius: borderRadius.xl,
          padding: spacing.xl,
          marginBottom: spacing.xl,
          ...shadows.md
        }}>
          <Row style={{ alignItems: 'center', marginBottom: spacing.lg }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md
            }}>
              <Ionicons name="happy" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Title level={3}>Interakce</Title>
              <Caption style={{ color: colors.textSecondary }}>
                Mood selector & Progress
              </Caption>
            </View>
          </Row>

          {/* Mood Selector */}
          <View style={{ marginBottom: spacing.xl }}>
            <Caption style={{ marginBottom: spacing.md, fontWeight: '600' }}>
              Výběr nálady
            </Caption>
            <Row style={{ justifyContent: 'space-between' }}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.value}
                  onPress={() => setSelectedMood(mood.value)}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: borderRadius.lg,
                    borderWidth: 2,
                    borderColor: selectedMood === mood.value ? colors.primary : colors.borderLight,
                    backgroundColor: selectedMood === mood.value ? colors.primaryExtraLight : colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...shadows.xs
                  }}
                >
                  <Text style={{ fontSize: 24 }}>
                    {mood.emoji}
                  </Text>
                </TouchableOpacity>
              ))}
            </Row>
            <Caption style={{ 
              textAlign: 'center', 
              marginTop: spacing.sm,
              color: colors.textSecondary 
            }}>
              Vybraná: {moods.find(m => m.value === selectedMood)?.label}
            </Caption>
          </View>

          {/* Progress */}
          <View>
            <Caption style={{ marginBottom: spacing.md, fontWeight: '600' }}>
              Progress bar
            </Caption>
            <Row style={{ 
              justifyContent: 'space-between',
              marginBottom: spacing.sm
            }}>
              <Body style={{ fontWeight: '600' }}>Celkový pokrok</Body>
              <Body style={{ fontWeight: '700', color: colors.primary }}>
                {Math.round(progress * 100)}%
              </Body>
            </Row>
            <ProgressBar progress={progress} height={10} />
            
            <Row style={{ 
              justifyContent: 'center',
              marginTop: spacing.lg
            }}>
              <TouchableOpacity
                onPress={() => setProgress(Math.min(1, progress + 0.1))}
                style={{
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.sm,
                  backgroundColor: colors.primaryExtraLight,
                  borderRadius: borderRadius.full,
                  borderWidth: 1,
                  borderColor: colors.primary,
                }}
              >
                <Text style={{ 
                  color: colors.primary,
                  fontWeight: '600',
                  fontSize: 14
                }}>
                  + 10%
                </Text>
              </TouchableOpacity>
            </Row>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DesignPlayground;