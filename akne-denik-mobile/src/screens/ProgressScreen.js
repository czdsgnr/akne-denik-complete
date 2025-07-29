// src/screens/ProgressScreen.js
// 📊 JEDNODUCHÝ PROGRESS SCREEN
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { 
  Screen,
  Card,
  Title,
  Body,
  Caption,
  Button,
  colors,
  spacing,
} from '../components/ui';

import { useAuth } from '../hooks/useAuth';

const ProgressScreen = ({ navigation }) => {
  const { userProfile, getCurrentDay } = useAuth();
  const currentDay = getCurrentDay ? getCurrentDay() : 1;
  const progress = Math.min(currentDay / 365, 1);

  // Mock data
  const stats = {
    completedDays: currentDay - 1,
    streak: 7,
    averageMood: 4.2,
    totalPhotos: 12,
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        
        {/* Hlavní pokrok */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Title level={3} style={{ marginBottom: spacing.lg }}>
            Celkový pokrok
          </Title>
          
          {/* Progress bar */}
          <View style={{ marginBottom: spacing.lg }}>
            <View style={{
              height: 8,
              backgroundColor: colors.borderLight,
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              <View style={{
                height: '100%',
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: colors.primary,
                borderRadius: 4,
              }} />
            </View>
            <Caption style={{ textAlign: 'right', marginTop: spacing.xs }}>
              {Math.round(progress * 100)}% dokončeno
            </Caption>
          </View>
          
          {/* Statistiky */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ alignItems: 'center' }}>
              <Title level={3} style={{ color: colors.primary }}>
                {stats.completedDays}
              </Title>
              <Caption>dokončeno</Caption>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Title level={3} style={{ color: colors.primary }}>
                {365 - currentDay}
              </Title>
              <Caption>zbývá</Caption>
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <Title level={3} style={{ color: colors.primary }}>
                {stats.streak}
              </Title>
              <Caption>v řadě</Caption>
            </View>
          </View>
        </Card>

        {/* Rychlé statistiky */}
        <View style={{ 
          flexDirection: 'row', 
          gap: spacing.md,
          marginBottom: spacing.lg 
        }}>
          <Card style={{ flex: 1 }}>
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="happy" size={24} color={colors.primary} style={{ marginBottom: spacing.sm }} />
              <Title level={4} style={{ color: colors.primary }}>
                {stats.averageMood.toFixed(1)}
              </Title>
              <Caption>průměrná nálada</Caption>
            </View>
          </Card>
          
          <Card style={{ flex: 1 }}>
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="camera" size={24} color={colors.secondary} style={{ marginBottom: spacing.sm }} />
              <Title level={4} style={{ color: colors.secondary }}>
                {stats.totalPhotos}
              </Title>
              <Caption>fotek</Caption>
            </View>
          </Card>
        </View>

        {/* Tento týden */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Title level={4} style={{ marginBottom: spacing.lg }}>
            Tento týden
          </Title>
          
          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Body>Dokončené dny</Body>
              <Caption>{Math.min(7, stats.streak)}/7</Caption>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Body>Průměrná nálada</Body>
              <Caption>{stats.averageMood.toFixed(1)}/5</Caption>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Body>Nové fotky</Body>
              <Caption>3</Caption>
            </View>
          </View>
        </Card>

        {/* Úspěchy */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Title level={4} style={{ marginBottom: spacing.lg }}>
            Úspěchy
          </Title>
          
          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Body style={{ marginLeft: spacing.sm }}>
                První týden dokončen
              </Body>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Body style={{ marginLeft: spacing.sm }}>
                7 dní v řadě
              </Body>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="ellipse-outline" size={20} color={colors.borderMedium} />
              <Body style={{ marginLeft: spacing.sm, opacity: 0.6 }}>
                První měsíc (za {30 - currentDay} dní)
              </Body>
            </View>
          </View>
        </Card>

        {/* Akce */}
        <View style={{ gap: spacing.md }}>
          <Button
            title="Zobrazit fotky"
            variant="outline"
            onPress={() => {
              // TODO: Navigate to photos
            }}
          />
          
          <Button
            title="Export dat"
            variant="outline"
            onPress={() => {
              // TODO: Export functionality
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ProgressScreen;