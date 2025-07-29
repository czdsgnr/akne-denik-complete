// src/screens/onboarding/OnboardingFlow.js
// 🚀 ONBOARDING s FIREBASE REGISTRACÍ
import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// UI komponenty
import {
  Screen,
  Card,
  Button,
  Title,
  Body,
  Caption,
  colors,
  spacing,
} from '../../components/ui';

// Firebase a Auth
import { useAuth } from '../../hooks/useAuth';

const OnboardingFlow = ({ navigation, route }) => {
  const { registerWithOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Údaje z registrace (pokud existují)
  const registrationData = route?.params || {};
  
  const [formData, setFormData] = useState({
    // Z registrace
    email: registrationData.email || '',
    password: registrationData.password || '',
    name: registrationData.name || '',
    acceptMarketing: registrationData.acceptMarketing || false,
    
    // Onboarding data
    gender: null,
    age: null,
    skinType: null,
    skinSensitivity: null,
    concerns: [],
    skinPhototype: null,
    experience: null,
    goals: [],
  });

  const totalSteps = 8;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dokončit onboarding a registrovat uživatele
      handleCompleteOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Zpět na registraci
      navigation.goBack();
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  // 🔥 DOKONČENÍ ONBOARDINGU a FIREBASE REGISTRACE
  const handleCompleteOnboarding = async () => {
    try {
      setLoading(true);
      
      console.log('🚀 Completing onboarding with data:', formData);
      
      // Registrace s onboarding daty
      await registerWithOnboarding(
        formData.email,
        formData.password,
        {
          name: formData.name,
          gender: formData.gender,
          age: formData.age,
          skinType: formData.skinType,
          skinSensitivity: formData.skinSensitivity,
          concerns: formData.concerns,
          skinPhototype: formData.skinPhototype,
          experience: formData.experience,
          goals: formData.goals,
          acceptMarketing: formData.acceptMarketing,
        }
      );
      
      console.log('✅ Onboarding completed successfully');
      
      // Navigace se řeší automaticky v useAuth
      
    } catch (error) {
      console.error('❌ Onboarding error:', error);
      Alert.alert(
        'Chyba',
        'Nepodařilo se dokončit registraci. Zkus to prosím znovu.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Pomocné komponenty (stejné jako předtím)
  const ProgressIndicator = ({ steps, currentStep }) => {
    const progress = Math.min(currentStep / steps, 1);
    const percentage = Math.round(progress * 100);

    return (
      <View style={{ marginVertical: spacing.lg }}>
        <Caption style={{ textAlign: 'right', marginBottom: spacing.sm }}>
          {percentage}%
        </Caption>
        
        <View style={{
          height: 4,
          backgroundColor: colors.borderLight,
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <View style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: colors.primary,
            borderRadius: 2,
          }} />
        </View>
      </View>
    );
  };

  const OptionCard = ({ title, subtitle, icon, selected, onPress }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: selected ? colors.primaryLight : colors.surface,
          borderRadius: 16,
          padding: spacing.lg,
          marginBottom: spacing.md,
          borderWidth: 2,
          borderColor: selected ? colors.primary : colors.borderLight,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {icon && (
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: selected ? colors.primary : colors.backgroundSecondary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
          }}>
            {typeof icon === 'string' ? (
              <Ionicons 
                name={icon} 
                size={24} 
                color={selected ? colors.textInverse : colors.primary} 
              />
            ) : (
              icon
            )}
          </View>
        )}
        
        <View style={{ flex: 1 }}>
          <Body style={{ 
            color: selected ? colors.primary : colors.text,
            fontWeight: selected ? '600' : '400' 
          }}>
            {title}
          </Body>
          {subtitle && (
            <Caption style={{ 
              color: selected ? colors.primary : colors.textSecondary,
              marginTop: spacing.xs 
            }}>
              {subtitle}
            </Caption>
          )}
        </View>
        
        {selected && (
          <Ionicons 
            name="checkmark-circle" 
            size={24} 
            color={colors.primary} 
          />
        )}
      </TouchableOpacity>
    );
  };

  const NumberSelector = ({ values, selectedValue, onSelect }) => {
    return (
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: spacing.sm,
        justifyContent: 'center',
      }}>
        {values.map((value) => (
          <TouchableOpacity
            key={value}
            style={{
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.lg,
              borderRadius: 16,
              backgroundColor: selectedValue === value ? colors.primary : colors.gray50,
              borderWidth: 1,
              borderColor: selectedValue === value ? colors.primary : colors.borderLight,
              minWidth: 60,
              alignItems: 'center',
              margin: spacing.xs,
            }}
            onPress={() => onSelect(value)}
            activeOpacity={0.8}
          >
            <Body style={{
              color: selectedValue === value ? colors.textInverse : colors.text,
              fontWeight: selectedValue === value ? '600' : '400'
            }}>
              {value}
            </Body>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const SelectableChip = ({ label, selected, onPress }) => {
    return (
      <TouchableOpacity
        style={{
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: 16,
          backgroundColor: selected ? colors.primary : colors.gray50,
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.borderLight,
          marginRight: spacing.sm,
          marginBottom: spacing.sm,
        }}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Caption style={{
          color: selected ? colors.textInverse : colors.text,
          fontWeight: selected ? '600' : '400'
        }}>
          {label}
        </Caption>
      </TouchableOpacity>
    );
  };

  // ================================================================
  // KROK 1: GENDER
  if (currentStep === 1) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.lg }}>
          <ProgressIndicator steps={totalSteps} currentStep={currentStep} />
          
          <View style={{ height: spacing.xl }} />
          
          <Title level={2} style={{ textAlign: 'center' }}>
            Jaké je tvoje pohlaví?
          </Title>
          
          <View style={{ height: spacing.sm }} />
          
          <Caption style={{ textAlign: 'center', color: colors.textSecondary }}>
            Pomůže nám to přizpůsobit doporučení
            podle tvého pohlaví.
          </Caption>
          
          <View style={{ height: spacing.xxxl }} />
          
          <View>
            <OptionCard
              title="Žena"
              icon="female"
              selected={formData.gender === 'female'}
              onPress={() => updateFormData('gender', 'female')}
            />
            
            <OptionCard
              title="Muž"
              icon="male"
              selected={formData.gender === 'male'}
              onPress={() => updateFormData('gender', 'male')}
            />
            
            <OptionCard
              title="Nechci uvádět"
              icon="help-circle"
              selected={formData.gender === 'other'}
              onPress={() => updateFormData('gender', 'other')}
            />
          </View>
          
          <View style={{ height: spacing.xxxl }} />
          
          <Button
            title="Pokračovat"
            onPress={handleNext}
            disabled={!formData.gender}
            fullWidth
          />
        </ScrollView>
      </Screen>
    );
  }

  // ================================================================
  // KROK 2: VĚK
  if (currentStep === 2) {
    const ageOptions = Array.from({ length: 30 }, (_, i) => i + 18); // 18-47
    
    return (
      <Screen>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              icon="chevron-back"
              variant="ghost"
              onPress={handleBack}
            />
            <ProgressIndicator steps={totalSteps} currentStep={currentStep} />
          </View>
          
          <View style={{ height: spacing.xl }} />
          
          <Title level={2}>
            Kolik ti je let?
          </Title>
          
          <View style={{ height: spacing.sm }} />
          
          <Caption style={{ color: colors.textSecondary }}>
            Věk nám pomůže personalizovat 
            doporučení produktů pro tvou věkovou skupinu.
          </Caption>
          
          <View style={{ height: spacing.xxxl }} />
          
          <NumberSelector
            values={ageOptions}
            selectedValue={formData.age}
            onSelect={(age) => updateFormData('age', age)}
          />
          
          <View style={{ height: spacing.xxxl }} />
          
          <Button
            title="Pokračovat"
            onPress={handleNext}
            disabled={!formData.age}
            fullWidth
          />
        </ScrollView>
      </Screen>
    );
  }

  // ================================================================
  // KROK 3: TYP PLETI
  if (currentStep === 3) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button
              icon="chevron-back"
              variant="ghost"
              onPress={handleBack}
            />
            <ProgressIndicator steps={totalSteps} currentStep={currentStep} />
          </View>
          
          <View style={{ height: spacing.xl }} />
          
          <Title level={2}>
            Jaký máš typ pleti?
          </Title>
          
          <View style={{ height: spacing.sm }} />
          
          <Caption style={{ color: colors.textSecondary }}>
            Identifikace typu pleti nám umožní nabídnout
            účinnější doporučení.
          </Caption>
          
          <View style={{ height: spacing.xxxl }} />
          
          <View>
            <OptionCard
              title="Normální pleť"
              icon="checkmark-circle"
              selected={formData.skinType === 'normal'}
              onPress={() => updateFormData('skinType', 'normal')}
            />
            
            <OptionCard
              title="Smíšená pleť"
              subtitle="Mastná v T-zóně, normální až suchá na tvářích."
              icon="partly-sunny"
              selected={formData.skinType === 'combination'}
              onPress={() => updateFormData('skinType', 'combination')}
            />
            
            <OptionCard
              title="Suchá pleť"
              icon="sunny"
              selected={formData.skinType === 'dry'}
              onPress={() => updateFormData('skinType', 'dry')}
            />
            
            <OptionCard
              title="Mastná pleť"
              icon="water"
              selected={formData.skinType === 'oily'}
              onPress={() => updateFormData('skinType', 'oily')}
            />
            
            <OptionCard
              title="Nevím, zjistíme to společně"
              icon="help-circle"
              selected={formData.skinType === 'unknown'}
              onPress={() => updateFormData('skinType', 'unknown')}
            />
          </View>
          
          <View style={{ height: spacing.xl }} />
          
          <Button
            title="Pokračovat"
            onPress={handleNext}
            disabled={!formData.skinType}
            fullWidth
          />
        </ScrollView>
      </Screen>
    );
  }

  // Rychle přeskočím na dokončovací obrazovku pro ostatní kroky
  if (currentStep >= 4) {
    return (
      <Screen>
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: spacing.lg 
        }}>
          <Card style={{
            padding: spacing.xxxl,
            alignItems: 'center',
            marginBottom: spacing.xxxl,
          }}>
            <Ionicons 
              name="sparkles" 
              size={64} 
              color={colors.primary} 
              style={{ marginBottom: spacing.lg }}
            />
            
            <Title level={2} style={{ 
              textAlign: 'center', 
              marginBottom: spacing.lg 
            }}>
              Vytvářím tvůj personalizovaný plán...
            </Title>
            
            <Caption style={{ textAlign: 'center', color: colors.textSecondary }}>
              Analyzuji tvoje údaje a připravuji doporučení
            </Caption>
          </Card>
          
          <Button
            title={loading ? "Ukládám..." : "Dokončit registraci"}
            onPress={handleCompleteOnboarding}
            loading={loading}
            disabled={loading}
            fullWidth
          />
        </View>
      </Screen>
    );
  }

  return null;
};

export default OnboardingFlow;