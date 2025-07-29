// src/navigation/UserTabNavigator.js
// 🗂️ TAB NAVIGATOR s DesignPlayground tabem
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MyDayScreen from '../screens/MyDayScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DesignPlayground from '../screens/DesignPlayground'; // ✅ PŘIDÁNO

// Design system colors
import { colors } from '../components/ui';

const Tab = createBottomTabNavigator();

export default function UserTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'MyDay':
              iconName = focused ? 'today' : 'today-outline';
              break;
            case 'Progress':
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Design': // ✅ NOVÝ TAB
              iconName = focused ? 'color-palette' : 'color-palette-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 85 : 70,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Domů',
        }}
      />
      <Tab.Screen 
        name="MyDay" 
        component={MyDayScreen}
        options={{ 
          title: 'Můj den',
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ 
          title: 'Pokrok',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'Profil',
        }}
      />
      
      {/* ✅ DOČASNÝ DESIGN TAB */}
      {__DEV__ && ( // Pouze ve vývoji
        <Tab.Screen 
          name="Design" 
          component={DesignPlayground}
          options={{ 
            title: 'Design',
            tabBarBadge: '🎨', // Vizuální označení
          }}
        />
      )}
    </Tab.Navigator>
  );
}