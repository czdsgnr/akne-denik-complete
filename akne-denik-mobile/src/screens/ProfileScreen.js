// ================================================================
// src/screens/ProfileScreen.js
// 👤 MODERNÍ PROFILE SCREEN
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
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
  colors,
  spacing,
} from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useSnackbar } from '../components/ui/Snackbar';

const ProfileScreen = ({ navigation }) => {
  const { user, userProfile, logout, getCurrentDay } = useAuth();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  
  const [loading, setLoading] = useState(false);
  const currentDay = getCurrentDay();
  const progress = Math.min(currentDay / 365, 1);

  const handleLogout = async () => {
    Alert.alert(
      'Odhlášení',
      'Opravdu se chceš odhlásit?',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Odhlásit',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await logout();
              showSnackbar({
                message: 'Byl/a jsi úspěšně odhlášen/a',
                type: 'success'
              });
            } catch (error) {
              showSnackbar({
                message: 'Chyba při odhlašování',
                type: 'error'
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const profileSections = [
    {
      title: 'Osobní údaje',
      items: [
        { icon: 'person', title: 'Upravit profil', onPress: () => {} },
        { icon: 'notifications', title: 'Notifikace', onPress: () => {} },
        { icon: 'shield-checkmark', title: 'Soukromí', onPress: () => {} },
      ]
    },
    {
      title: 'Pokrok',
      items: [
        { icon: 'trending-up', title: 'Statistiky', onPress: () => navigation.navigate('Stats') },
        { icon: 'camera', title: 'Moje fotky', onPress: () => {} },
        { icon: 'document-text', title: 'Export dat', onPress: () => {} },
      ]
    },
    {
      title: 'Podpora',
      items: [
        { icon: 'help-circle', title: 'Nápověda', onPress: () => {} },
        { icon: 'mail', title: 'Kontakt', onPress: () => {} },
        { icon: 'star', title: 'Ohodnotit aplikaci', onPress: () => {} },
      ]
    },
  ];

  return (
    <Screen variant="soft">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Card variant="elevated" padding="xl" style={{ margin: 0, borderRadius: 0 }}>
          <Row align="center" justify="space-between">
            <Title level={3}>Profil</Title>
            <Button
              icon="settings"
              variant="ghost"
              onPress={() => {
                showSnackbar({
                  message: 'Nastavení bude brzy dostupné',
                  type: 'info'
                });
              }}
            />
          </Row>
        </Card>

        <Column gap="lg" style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
          {/* Profil info */}
          <Card variant="elevated" padding="xl">
            <Column gap="lg" align="center">
              {/* Avatar */}
              <TouchableOpacity
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.primaryLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  showSnackbar({
                    message: 'Změna avataru bude brzy dostupná',
                    type: 'info'
                  });
                }}
              >
                <Title level={1} color="primary">
                  {userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Title>
              </TouchableOpacity>
              
              <Column align="center" gap="xs">
                <Title level={3}>{userProfile?.name || 'Uživatel'}</Title>
                <Caption>{user?.email}</Caption>
              </Column>
              
              <Row gap="lg">
                <Column align="center" gap="xs">
                  <Title level={4} color="primary">{currentDay - 1}</Title>
                  <Caption>dokončeno</Caption>
                </Column>
                
                <Column align="center" gap="xs">
                  <Title level={4} color="primary">{Math.round(progress * 100)}%</Title>
                  <Caption>hotovo</Caption>
                </Column>
                
                <Column align="center" gap="xs">
                  <Title level={4} color="primary">7</Title>
                  <Caption>v řadě</Caption>
                </Column>
              </Row>
            </Column>
          </Card>

          {/* Onboarding info */}
          {userProfile && (
            <Card variant="subtle" padding="xl">
              <Column gap="md">
                <Title level={4}>Tvůj profil pleti</Title>
                
                <Column gap="sm">
                  <Row align="center" justify="space-between">
                    <Body>Typ pleti</Body>
                    <Caption>{userProfile.skinType || 'Nespecifikováno'}</Caption>
                  </Row>
                  
                  <Row align="center" justify="space-between">
                    <Body>Citlivost</Body>
                    <Caption>{userProfile.skinSensitivity || 'Nespecifikováno'}</Caption>
                  </Row>
                  
                  <Row align="center" justify="space-between">
                    <Body>Věk</Body>
                    <Caption>{userProfile.age || 'Nespecifikováno'}</Caption>
                  </Row>
                  
                  {userProfile.concerns && userProfile.concerns.length > 0 && (
                    <Row align="flex-start" justify="space-between">
                      <Body>Problémy</Body>
                      <Caption style={{ flex: 1, textAlign: 'right' }}>
                        {userProfile.concerns.slice(0, 2).join(', ')}
                        {userProfile.concerns.length > 2 && '...'}
                      </Caption>
                    </Row>
                  )}
                </Column>
              </Column>
            </Card>
          )}

          {/* Sections */}
          {profileSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} variant="elevated" padding="xl">
              <Column gap="lg">
                <Title level={4}>{section.title}</Title>
                
                <Column gap="xs">
                  {section.items.map((item, itemIndex) => (
                    <TouchableOpacity
                      key={itemIndex}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: spacing.md,
                        paddingHorizontal: spacing.sm,
                        borderRadius: 12,
                      }}
                      onPress={item.onPress}
                      activeOpacity={0.8}
                    >
                      <Ionicons name={item.icon} size={24} color={colors.primary} />
                      <Body style={{ marginLeft: spacing.md, flex: 1 }}>
                        {item.title}
                      </Body>
                      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                  ))}
                </Column>
              </Column>
            </Card>
          ))}

          {/* Logout */}
          <Button
            title="Odhlásit se"
            onPress={handleLogout}
            loading={loading}
            disabled={loading}
            variant="outline"
            style={{ borderColor: colors.error }}
            textStyle={{ color: colors.error }}
            fullWidth
          />
        </Column>
      </ScrollView>
      
      <SnackbarComponent />
    </Screen>
  );
};

export default ProfileScreen;