// App.js
// 🚀 HLAVNÍ APP s DesignPlayground navigací
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UserTabNavigator from './src/navigation/UserTabNavigator';
import DesignPlayground from './src/screens/DesignPlayground'; // ✅ PŘIDÁNO

// Auth Provider
import { AuthProvider, useAuth } from './src/hooks/useAuth';

const Stack = createStackNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// App Navigator
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Nebo loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          {/* Hlavní tab navigace */}
          <Stack.Screen 
            name="MainTabs" 
            component={UserTabNavigator} 
          />
          
          {/* ✅ DESIGN PLAYGROUND SCREEN */}
          <Stack.Screen 
            name="DesignPlayground" 
            component={DesignPlayground}
            options={{
              headerShown: false,
              presentation: 'modal', // Volitelně jako modal
            }}
          />
        </>
      ) : (
        <>
          {/* Auth screens */}
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
};

// Main App
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}