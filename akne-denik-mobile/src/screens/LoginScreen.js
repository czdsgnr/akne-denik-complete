// src/screens/LoginScreen.js
// 🔐 MODERNÍ LOGIN SCREEN - jemný a čistý design
import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
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
import { Input } from '../components/ui/ModernInput';
import { useAuth } from '../hooks/useAuth';
import { useSnackbar } from '../components/ui/Snackbar';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email je povinný';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Neplatný formát emailu';
    }
    
    if (!formData.password) {
      newErrors.password = 'Heslo je povinné';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      showSnackbar({
        message: 'Prosím zkontroluj zadané údaje',
        type: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      await login(formData.email.trim().toLowerCase(), formData.password);
      
      showSnackbar({
        message: 'Vítej zpět! 🎉',
        type: 'success'
      });
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Něco se pokazilo. Zkus to znovu.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Uživatel s tímto emailem neexistuje';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Nesprávné heslo';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Neplatný email';
      }
      
      showSnackbar({
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Screen variant="soft">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, padding: spacing.lg }}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <Row align="center" justify="space-between" style={{ marginBottom: spacing.xl }}>
            <Button
              icon="chevron-back"
              variant="ghost"
              onPress={() => navigation.goBack()}
            />
          </Row>
          
          <Spacer size="xxxl" />
          
          {/* Header */}
          <Column align="center" gap="md" style={{ marginBottom: spacing.xxxl }}>
            <Title level={1} align="center">
              Vítej zpět! 👋
            </Title>
            
            <Body color="textSecondary" align="center">
              Přihlas se a pokračuj ve své cestě za krásnou pletí
            </Body>
          </Column>

          {/* Login Form */}
          <Card variant="elevated" padding="xl">
            <Column gap="lg">
              <Input
                label="Email"
                placeholder="tvuj@email.cz"
                value={formData.email}
                onChangeText={(text) => handleFieldChange('email', text)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="mail"
              />
              
              <Input
                label="Heslo"
                placeholder="Tvoje heslo"
                value={formData.password}
                onChangeText={(text) => handleFieldChange('password', text)}
                error={errors.password}
                secureTextEntry
                leftIcon="lock-closed"
              />
              
              <Spacer size="md" />
              
              <Button
                title="Přihlásit se"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                fullWidth
              />
              
              <Row justify="center" style={{ marginTop: spacing.md }}>
                <TouchableOpacity
                  onPress={() => {
                    showSnackbar({
                      message: 'Funkce bude brzy dostupná',
                      type: 'info'
                    });
                  }}
                >
                  <Caption color="primary">
                    Zapomněl/a jsi heslo?
                  </Caption>
                </TouchableOpacity>
              </Row>
            </Column>
          </Card>

          <Spacer size="xxxl" />

          {/* Register Link */}
          <Card variant="subtle" padding="lg">
            <Column align="center" gap="md">
              <Body align="center" color="textSecondary">
                Ještě nemáš účet?
              </Body>
              
              <Button
                title="Vytvořit účet"
                onPress={() => navigation.navigate('Register')}
                variant="subtle"
                fullWidth
              />
            </Column>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <SnackbarComponent />
    </Screen>
  );
};

export default LoginScreen;