// ================================================================
// src/screens/RegisterScreen.js
// 📝 MODERNÍ REGISTER SCREEN - minimalistický design
import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
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
import { SwitchListItem } from '../components/ui/ModernSwitch';
import { useAuth } from '../hooks/useAuth';
import { useSnackbar } from '../components/ui/Snackbar';

const RegisterScreen = ({ navigation }) => {
  const { registerWithOnboarding } = useAuth();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptTerms: false,
    acceptMarketing: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Jméno je povinné';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email je povinný';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Neplatný formát emailu';
    }
    
    if (!formData.password) {
      newErrors.password = 'Heslo je povinné';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Heslo musí mít alespoň 6 znaků';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hesla se neshodují';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Musíš souhlasit s podmínkami';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      showSnackbar({
        message: 'Prosím oprav chyby ve formuláři',
        type: 'warning'
      });
      return;
    }

    // Přejít na onboarding s dočasnými daty
    navigation.navigate('Onboarding', {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      name: formData.name.trim(),
      acceptMarketing: formData.acceptMarketing,
    });
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
          
          <Spacer size="xl" />
          
          {/* Header */}
          <Column align="center" gap="md" style={{ marginBottom: spacing.xxxl }}>
            <Title level={1} align="center">
              Vytvoř si účet ✨
            </Title>
            
            <Body color="textSecondary" align="center">
              Začni svou cestu za krásnou a zdravou pletí
            </Body>
          </Column>

          {/* Register Form */}
          <Card variant="elevated" padding="xl">
            <Column gap="lg">
              <Input
                label="Jméno"
                placeholder="Tvoje jméno"
                value={formData.name}
                onChangeText={(text) => handleFieldChange('name', text)}
                error={errors.name}
                leftIcon="person"
                autoCapitalize="words"
              />
              
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
                placeholder="Alespoň 6 znaků"
                value={formData.password}
                onChangeText={(text) => handleFieldChange('password', text)}
                error={errors.password}
                secureTextEntry
                leftIcon="lock-closed"
              />
              
              <Input
                label="Potvrzení hesla"
                placeholder="Zadej heslo znovu"
                value={formData.confirmPassword}
                onChangeText={(text) => handleFieldChange('confirmPassword', text)}
                error={errors.confirmPassword}
                secureTextEntry
                leftIcon="lock-closed"
              />
              
              <Spacer size="md" />
              
              {/* Terms & Marketing */}
              <Column gap="sm">
                <SwitchListItem
                  title="Souhlasím s podmínkami *"
                  subtitle="Přečíst podmínky používání"
                  value={formData.acceptTerms}
                  onValueChange={(value) => handleFieldChange('acceptTerms', value)}
                  leftIcon="document-text"
                  required
                />
                
                {errors.acceptTerms && (
                  <Caption color="error" style={{ marginTop: spacing.xs }}>
                    {errors.acceptTerms}
                  </Caption>
                )}
                
                <SwitchListItem
                  title="Marketing (volitelné)"
                  subtitle="Dostávat tipy a novinky o péči o pleť"
                  value={formData.acceptMarketing}
                  onValueChange={(value) => handleFieldChange('acceptMarketing', value)}
                  leftIcon="notifications"
                />
              </Column>
              
              <Spacer size="lg" />
              
              <Button
                title="Pokračovat"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                fullWidth
              />
            </Column>
          </Card>

          <Spacer size="xl" />

          {/* Login Link */}
          <Row justify="center" gap="xs">
            <Body color="textSecondary">
              Už máš účet?
            </Body>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Body color="primary" style={{ fontWeight: '600' }}>
                Přihlásit se
              </Body>
            </TouchableOpacity>
          </Row>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <SnackbarComponent />
    </Screen>
  );
};

export default RegisterScreen;