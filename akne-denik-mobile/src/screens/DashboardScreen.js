// src/screens/DashboardScreen.js
// 🏠 MODERNÍ DASHBOARD - čistý a minimalistický
import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Screen,
  Card,
  Button,
  Title,
  Body,
  Caption,
  Row,
  Column,
  Spacer,
  ProgressIndicator,
  colors,
  spacing,
  gradients,
} from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

const DashboardScreen = ({ navigation }) => {
  const { user, userProfile, getCurrentDay } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const currentDay = getCurrentDay();
  const progress = Math.min(currentDay / 365, 1);
  const todayCompleted = userProfile?.completedDays?.includes(currentDay) || false;

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Mock data pro demo
  const stats = {
    totalDays: currentDay - 1,
    streak: 7,
    averageMood: 4.2,
    photosCount: 12,
  };

  const todayTasks = [
    { id: 1, title: 'Ranní péče o pleť', completed: true },
    { id: 2, title: 'Pořídit denní fotku', completed: false },
    { id: 3, title: 'Večerní rutina', completed: false },
    { id: 4, title: 'Zápis do deníku', completed: false },
  ];

  return (
    <Screen variant="soft">
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header s uvítáním */}
        <LinearGradient
          colors={gradients.backgroundSoft}
          style={{
            paddingTop: spacing.xxxl,
            paddingBottom: spacing.xl,
            paddingHorizontal: spacing.lg,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            marginBottom: spacing.lg,
          }}
        >
          <Row align="center" justify="space-between" style={{ marginBottom: spacing.lg }}>
            <Column style={{ flex: 1 }}>
              <Title level={2}>
                Ahoj, {userProfile?.name || 'krásko'}! 👋
              </Title>
              <Caption style={{ marginTop: spacing.xs }}>
                Den {currentDay} z 365 • {Math.round(progress * 100)}% dokončeno
              </Caption>
            </Column>
            
            <TouchableOpacity
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.white,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person" size={24} color={colors.primary} />
            </TouchableOpacity>
          </Row>
          
          {/* Progress bar */}
          <ProgressIndicator 
            steps={365} 
            currentStep={currentDay}
            showPercentage={false}
          />
        </LinearGradient>

        <Column gap="lg" style={{ paddingHorizontal: spacing.lg }}>
          {/* Dnešní stav */}
          <Card variant="elevated" padding="xl">
            <Column gap="lg">
              <Row align="center" justify="space-between">
                <Title level={4}>Dnešní den</Title>
                <Ionicons 
                  name={todayCompleted ? "checkmark-circle" : "time"} 
                  size={24} 
                  color={todayCompleted ? colors.success : colors.warning} 
                />
              </Row>
              
              {todayCompleted ? (
                <Column gap="md">
                  <Body color="success">✅ Skvěle! Dnešní úkoly máš hotové</Body>
                  <Button
                    title="Zobrazit záznam"
                    variant="subtle"
                    onPress={() => navigation.navigate('MyDay')}
                  />
                </Column>
              ) : (
                <Column gap="md">
                  <Body color="textSecondary">
                    Ještě ti zbývá několik úkolů na dnes
                  </Body>
                  <Button
                    title="Pokračovat"
                    onPress={() => navigation.navigate('MyDay')}
                  />
                </Column>
              )}
            </Column>
          </Card>

          {/* Rychlé statistiky */}
          <Row gap="md">
            <Card variant="subtle" style={{ flex: 1 }} padding="lg">
              <Column gap="xs" align="center">
                <Title level={3} color="primary">{stats.totalDays}</Title>
                <Caption>dnů dokončeno</Caption>
              </Column>
            </Card>
            
            <Card variant="subtle" style={{ flex: 1 }} padding="lg">
              <Column gap="xs" align="center">
                <Title level={3} color="primary">{stats.streak}</Title>
                <Caption>dnů v řadě</Caption>
              </Column>
            </Card>
          </Row>

          {/* Dnešní úkoly náhled */}
          <Card variant="elevated" padding="xl">
            <Column gap="lg">
              <Row align="center" justify="space-between">
                <Title level={4}>Dnešní úkoly</Title>
                <Caption color="primary">
                  {todayTasks.filter(t => t.completed).length}/{todayTasks.length}
                </Caption>
              </Row>
              
              <Column gap="sm">
                {todayTasks.slice(0, 3).map((task) => (
                  <Row key={task.id} align="center" gap="md">
                    <Ionicons 
                      name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                      size={20} 
                      color={task.completed ? colors.success : colors.borderMedium} 
                    />
                    <Body 
                      style={{ 
                        flex: 1,
                        textDecorationLine: task.completed ? 'line-through' : 'none',
                        opacity: task.completed ? 0.6 : 1,
                      }}
                    >
                      {task.title}
                    </Body>
                  </Row>
                ))}
              </Column>
              
              <Button
                title="Zobrazit všechny"
                variant="ghost"
                onPress={() => navigation.navigate('MyDay')}
              />
            </Column>
          </Card>

          {/* Rychlé akce */}
          <Card variant="subtle" padding="xl">
            <Column gap="lg">
              <Title level={4}>Rychlé akce</Title>
              
              <Row gap="md">
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: colors.primaryLight,
                    borderRadius: 16,
                    padding: spacing.lg,
                    alignItems: 'center',
                  }}
                  onPress={() => navigation.navigate('MyDay')}
                >
                  <Ionicons name="calendar-today" size={24} color={colors.primary} />
                  <Caption color="primary" style={{ marginTop: spacing.sm }}>
                    Můj den
                  </Caption>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: colors.primaryLight,
                    borderRadius: 16,
                    padding: spacing.lg,
                    alignItems: 'center',
                  }}
                  onPress={() => navigation.navigate('Progress')}
                >
                  <Ionicons name="trending-up" size={24} color={colors.primary} />
                  <Caption color="primary" style={{ marginTop: spacing.sm }}>
                    Pokrok
                  </Caption>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: colors.primaryLight,
                    borderRadius: 16,
                    padding: spacing.lg,
                    alignItems: 'center',
                  }}
                  onPress={() => navigation.navigate('Camera')}
                >
                  <Ionicons name="camera" size={24} color={colors.primary} />
                  <Caption color="primary" style={{ marginTop: spacing.sm }}>
                    Fotka
                  </Caption>
                </TouchableOpacity>
              </Row>
            </Column>
          </Card>

          {/* Týdenní přehled */}
          <Card variant="elevated" padding="xl">
            <Column gap="lg">
              <Title level={4}>Tento týden</Title>
              
              <Column gap="md">
                <Row align="center" justify="space-between">
                  <Body>Průměrná nálada</Body>
                  <Row align="center" gap="xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= Math.round(stats.averageMood) ? "star" : "star-outline"}
                        size={16}
                        color={colors.warning}
                      />
                    ))}
                    <Caption style={{ marginLeft: spacing.sm }}>
                      {stats.averageMood.toFixed(1)}
                    </Caption>
                  </Row>
                </Row>
                
                <Row align="center" justify="space-between">
                  <Body>Počet fotek</Body>
                  <Caption>{stats.photosCount}</Caption>
                </Row>
                
                <Row align="center" justify="space-between">
                  <Body>Dokončené dny</Body>
                  <Caption>{stats.streak}/7</Caption>
                </Row>
              </Column>
              
              <Button
                title="Zobrazit detailní statistiky"
                variant="outline"
                onPress={() => navigation.navigate('Stats')}
              />
            </Column>
          </Card>
        </Column>
      </ScrollView>
    </Screen>
  );
};

export default DashboardScreen;