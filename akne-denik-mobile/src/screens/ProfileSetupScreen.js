// src/screens/ProfileScreen.js
// 👤 PROFILE SCREEN s tlačítkem na Design Playground
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Card,
  Button,
  Title,
  Body,
  Caption,
  Row,
  Column,
  Avatar,
  colors,
  spacing,
  gradients,
  borderRadius,
  shadows,
} from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useSnackbar } from '../components/ui/Snackbar';

const ProfileScreen = ({ navigation }) => {
  const { user, userProfile, logout, getCurrentDay } = useAuth();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  
  const [loading, setLoading] = useState(false);
  const currentDay = getCurrentDay ? getCurrentDay() : 1;
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
        { icon: 'trending-up', title: 'Statistiky', onPress: () => {} },
        { icon: 'camera', title: 'Moje fotky', onPress: () => {} },
        { icon: 'document-text', title: 'Export dat', onPress: () => {} },
      ]
    },
    {
      title: 'Vývoj',
      items: [
        { 
          icon: 'color-palette', 
          title: '🎨 Design Playground', 
          onPress: () => navigation.navigate('DesignPlayground'),
          special: true
        },
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient 
          colors={gradients.primary} 
          style={{ 
            paddingTop: StatusBar.currentHeight || 0,
            paddingBottom: spacing.xl,
            width: '100%'
          }}
        >
          <View style={{ 
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg
          }}>
            <Row style={{ alignItems: 'center' }}>
              <Avatar 
                name={userProfile?.name || 'User'} 
                size="large" 
                style={{ marginRight: spacing.lg }}
              />
              <Column style={{ flex: 1 }}>
                <Title level={2} style={{ 
                  color: colors.white,
                  marginBottom: spacing.xs
                }}>
                  {userProfile?.name || 'Uživatel'}
                </Title>
                <Caption style={{ 
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: spacing.sm
                }}>
                  {user?.email}
                </Caption>
                
                <Row style={{ alignItems: 'center' }}>
                  <Ionicons name="calendar" size={16} color="rgba(255,255,255,0.8)" />
                  <Caption style={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    marginLeft: spacing.xs
                  }}>
                    Den {currentDay} • {Math.round(progress * 100)}% hotovo
                  </Caption>
                </Row>
              </Column>
            </Row>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={{ 
          flex: 1,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          marginTop: -spacing.md
        }}>

          {/* Quick Stats */}
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            ...shadows.sm
          }}>
            <Title level={4} style={{ marginBottom: spacing.md }}>
              📊 Tvůj pokrok
            </Title>
            
            <Row style={{ justifyContent: 'space-between' }}>
              <Column style={{ alignItems: 'center' }}>
                <Title level={3} style={{ color: colors.primary }}>
                  {currentDay - 1}
                </Title>
                <Caption>dnů splněno</Caption>
              </Column>
              
              <Column style={{ alignItems: 'center' }}>
                <Title level={3} style={{ color: colors.success }}>
                  7
                </Title>
                <Caption>dní v řadě</Caption>
              </Column>
              
              <Column style={{ alignItems: 'center' }}>
                <Title level={3} style={{ color: colors.info }}>
                  {Math.round(progress * 100)}%
                </Title>
                <Caption>hotovo</Caption>
              </Column>
            </Row>
          </View>

          {/* Profile Sections */}
          {profileSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={{
              backgroundColor: colors.surface,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginBottom: spacing.md,
              ...shadows.sm
            }}>
              <Title level={4} style={{ 
                marginBottom: spacing.md,
                color: section.title === 'Vývoj' ? colors.warning : colors.text
              }}>
                {section.title}
              </Title>
              
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  onPress={item.onPress}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.sm,
                    borderRadius: borderRadius.md,
                    backgroundColor: item.special ? colors.warningLight : 'transparent',
                    borderWidth: item.special ? 1 : 0,
                    borderColor: item.special ? colors.warning : 'transparent',
                    marginBottom: itemIndex < section.items.length - 1 ? spacing.xs : 0
                  }}
                >
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: item.special ? colors.warning : colors.primaryLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing.md
                  }}>
                    <Ionicons 
                      name={item.icon} 
                      size={20} 
                      color={item.special ? colors.white : colors.primary} 
                    />
                  </View>
                  
                  <Column style={{ flex: 1 }}>
                    <Body style={{ 
                      fontWeight: item.special ? '600' : '400',
                      color: item.special ? colors.warning : colors.text
                    }}>
                      {item.title}
                    </Body>
                  </Column>
                  
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={colors.textMuted} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Logout */}
          <Button
            title={loading ? "Odhlašuji..." : "Odhlásit se"}
            variant="outline"
            onPress={handleLogout}
            loading={loading}
            fullWidth
            style={{
              borderColor: colors.error,
              marginTop: spacing.lg
            }}
            textStyle={{
              color: colors.error
            }}
          />
        </View>
      </ScrollView>
      
      <SnackbarComponent />
    </SafeAreaView>
  );
};

export default ProfileScreen;