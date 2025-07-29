// src/screens/HomeScreen.js
// 🏠 OPRAVENÝ HOMESCREEN - správný layout, padding, scrolling
import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  RefreshControl,
  SafeAreaView,
  StatusBar,
  View,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Card,
  Button,
  Title,
  Body,
  Caption,
  Row,
  Column,
  Avatar,
  ProgressBar,
  colors,
  spacing,
  gradients,
  borderRadius,
  shadows,
} from '../components/ui';

// Firebase imports
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useSnackbar } from '../components/ui/Snackbar';

const HomeScreen = ({ navigation }) => {
  const { user, userProfile, getCurrentDay } = useAuth();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDaysCount, setCompletedDaysCount] = useState(0);
  const [streak, setStreak] = useState(7);
  
  const progress = Math.min(currentDay / 365, 1);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulace načítání dat
    setTimeout(() => setRefreshing(false), 1000);
  };

  useEffect(() => {
    if (getCurrentDay) {
      setCurrentDay(getCurrentDay());
    }
  }, [getCurrentDay]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Fixed Header */}
      <View style={{
        backgroundColor: colors.background,
        paddingTop: spacing.md,
        paddingHorizontal: spacing.md, // 16px
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
      }}>
        {/* User Header */}
        <Row style={{ alignItems: 'center', marginBottom: spacing.lg }}>
          <View style={{ flex: 1 }}>
            <Title level={1} style={{ 
              fontSize: 28, 
              fontWeight: '700',
              marginBottom: spacing.xs
            }}>
              Ahoj, {userProfile?.name || 'Jam'}! 👋
            </Title>
            <Caption style={{ 
              color: colors.textSecondary,
              fontSize: 16
            }}>
              Den {currentDay} z 365 • {Math.round(progress * 100)}% dokončeno
            </Caption>
          </View>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="person" size={28} color={colors.primary} />
          </TouchableOpacity>
        </Row>

        {/* Progress Bar */}
        <View>
          <Row style={{ 
            justifyContent: 'space-between',
            marginBottom: spacing.sm
          }}>
            <Body style={{ color: colors.textSecondary }}>Celkový pokrok</Body>
            <Body style={{ 
              fontWeight: '600',
              color: colors.primary
            }}>
              {Math.round(progress * 100)}%
            </Body>
          </Row>
          <ProgressBar progress={progress} height={8} />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          paddingHorizontal: spacing.md, // 16px
          paddingTop: spacing.lg,
          paddingBottom: 120, // Místo pro bottom tabs
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        
        {/* Dnešní den Card */}
        <View style={{
          backgroundColor: colors.white,
          borderRadius: borderRadius.xxl,
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
              <Ionicons name="calendar" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Title level={3}>Dnešní den</Title>
            </View>
          </Row>
          
          <Body style={{ 
            color: colors.textSecondary,
            marginBottom: spacing.xl
          }}>
            Ještě ti zbývá několik úkolů na dnes
          </Body>
          
          <Button
            title="Zapsat denní záznam"
            variant="primary"
            size="large"
            fullWidth
            onPress={() => navigation.navigate('MyDay')}
            style={{
              backgroundColor: colors.primary,
              borderRadius: borderRadius.full,
              minHeight: 56,
            }}
          />
        </View>

        {/* Stats Row */}
        <Row style={{ 
          gap: spacing.md,
          marginBottom: spacing.xl
        }}>
          <View style={{
            flex: 1,
            backgroundColor: colors.white,
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            alignItems: 'center',
            ...shadows.sm
          }}>
            <Text style={{
              fontSize: 32,
              fontWeight: '700',
              color: colors.primary,
              marginBottom: spacing.xs
            }}>
              {completedDaysCount}
            </Text>
            <Caption style={{ color: colors.textSecondary }}>
              dnů dokončeno
            </Caption>
          </View>
          
          <View style={{
            flex: 1,
            backgroundColor: colors.white,
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            alignItems: 'center',
            ...shadows.sm
          }}>
            <Text style={{
              fontSize: 32,
              fontWeight: '700',
              color: colors.primary,
              marginBottom: spacing.xs
            }}>
              {streak}
            </Text>
            <Caption style={{ color: colors.textSecondary }}>
              dnů v řadě
            </Caption>
          </View>
        </Row>

        {/* Rychlé akce */}
        <View style={{
          backgroundColor: colors.white,
          borderRadius: borderRadius.xxl,
          padding: spacing.xl,
          marginBottom: spacing.xl,
          ...shadows.md
        }}>
          <Title level={3} style={{ marginBottom: spacing.lg }}>
            Rychlé akce
          </Title>
          
          <Row style={{ gap: spacing.md }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.primaryLight,
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                alignItems: 'center',
                minHeight: 100,
                justifyContent: 'center',
              }}
              onPress={() => navigation.navigate('MyDay')}
            >
              <Ionicons name="calendar" size={28} color={colors.primary} />
              <Body style={{ 
                marginTop: spacing.sm,
                color: colors.primary,
                fontWeight: '600'
              }}>
                Můj den
              </Body>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.primaryLight,
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                alignItems: 'center',
                minHeight: 100,
                justifyContent: 'center',
              }}
              onPress={() => navigation.navigate('Progress')}
            >
              <Ionicons name="trending-up" size={28} color={colors.primary} />
              <Body style={{ 
                marginTop: spacing.sm,
                color: colors.primary,
                fontWeight: '600'
              }}>
                Pokrok
              </Body>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.primaryLight,
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                alignItems: 'center',
                minHeight: 100,
                justifyContent: 'center',
              }}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person" size={28} color={colors.primary} />
              <Body style={{ 
                marginTop: spacing.sm,
                color: colors.primary,
                fontWeight: '600'
              }}>
                Profil
              </Body>
            </TouchableOpacity>
          </Row>
        </View>

        {/* Motivační zpráva */}
        <View style={{
          backgroundColor: colors.primaryLight,
          borderRadius: borderRadius.xxl,
          padding: spacing.xl,
          marginBottom: spacing.xl,
          borderWidth: 1,
          borderColor: colors.primary,
        }}>
          <Row style={{ alignItems: 'center', marginBottom: spacing.md }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing.md
            }}>
              <Ionicons name="sparkles" size={24} color={colors.white} />
            </View>
            <Title level={4} style={{ color: colors.primary }}>
              První týden je nejdůležitější! Pokračuj!
            </Title>
          </Row>
          
          <Body style={{ 
            color: colors.primary,
            textAlign: 'center',
            fontWeight: '500'
          }}>
            První týden je nejdůležitější! Pokračuj! 💪
          </Body>
        </View>

      </ScrollView>
      
      <SnackbarComponent />
    </SafeAreaView>
  );
};

export default HomeScreen;