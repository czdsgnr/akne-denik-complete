// ================================================================
// src/components/ui/OnboardingComponents.js
// 🚀 KOMPONENTY PRO ONBOARDING podle Charm App
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../../styles/designSystem';
import { Title, Body, Caption } from './Typography';

// Karta pro výběr možnosti (gender, věk, atd.)
export const OptionCard = ({
  title,
  subtitle = null,
  icon = null,
  selected = false,
  onPress,
  style = {},
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: selected ? colors.primaryLight : colors.white,
          borderRadius: borderRadius.xl,
          padding: spacing.lg,
          marginBottom: spacing.md,
          borderWidth: 2,
          borderColor: selected ? colors.primary : colors.borderLight,
          ...shadows.xs,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      <Row align="center" gap="md">
        {icon && (
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: borderRadius.lg,
              backgroundColor: selected ? colors.primary : colors.gray100,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {typeof icon === 'string' ? (
              <Ionicons
                name={icon}
                size={24}
                color={selected ? colors.white : colors.primary}
              />
            ) : (
              icon
            )}
          </View>
        )}
        
        <Column style={{ flex: 1 }}>
          <Body
            color={selected ? 'primary' : 'text'}
            style={{ fontWeight: selected ? '600' : '400' }}
          >
            {title}
          </Body>
          {subtitle && (
            <Caption
              color={selected ? 'primary' : 'textSecondary'}
              style={{ marginTop: spacing.xs }}
            >
              {subtitle}
            </Caption>
          )}
        </Column>
        
        {selected && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={colors.primary}
          />
        )}
      </Row>
    </TouchableOpacity>
  );
};

// Progress indikátor pro onboarding
export const ProgressIndicator = ({
  steps = 8,
  currentStep = 1,
  style = {},
  ...props
}) => {
  const progress = Math.min(currentStep / steps, 1);
  const percentage = Math.round(progress * 100);

  return (
    <View style={[{ marginVertical: spacing.lg }, style]} {...props}>
      <Caption align="right" style={{ marginBottom: spacing.sm }}>
        {percentage}%
      </Caption>
      
      <View
        style={{
          height: 4,
          backgroundColor: colors.borderLight,
          borderRadius: borderRadius.full,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: colors.primary,
            borderRadius: borderRadius.full,
          }}
        />
      </View>
    </View>
  );
};

// Číselný selektor (pro věk)
export const NumberSelector = ({
  values = [],
  selectedValue = null,
  onSelect,
  style = {},
  ...props
}) => {
  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, style]} {...props}>
      {values.map((value) => (
        <TouchableOpacity
          key={value}
          style={{
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            borderRadius: borderRadius.xl,
            backgroundColor: selectedValue === value ? colors.primary : colors.gray50,
            borderWidth: 1,
            borderColor: selectedValue === value ? colors.primary : colors.borderLight,
            minWidth: 60,
            alignItems: 'center',
          }}
          onPress={() => onSelect(value)}
          activeOpacity={0.8}
        >
          <Body
            color={selectedValue === value ? 'white' : 'text'}
            style={{ fontWeight: selectedValue === value ? '600' : '400' }}
          >
            {value}
          </Body>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Multi-select čip komponenta
export const SelectableChip = ({
  label,
  selected = false,
  onPress,
  style = {},
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: borderRadius.xl,
          backgroundColor: selected ? colors.primary : colors.gray50,
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.borderLight,
          marginRight: spacing.sm,
          marginBottom: spacing.sm,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      <Caption
        color={selected ? 'white' : 'text'}
        style={{ fontWeight: selected ? '600' : '400' }}
      >
        {label}
      </Caption>
    </TouchableOpacity>
  );
};

// Loading komponenta pro setup
export const SetupProgress = ({
  steps = [],
  currentIndex = 0,
  style = {},
  ...props
}) => {
  return (
    <Column gap="md" style={[{ marginVertical: spacing.xl }, style]} {...props}>
      {steps.map((step, index) => (
        <Row key={index} align="center" gap="md">
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: borderRadius.full,
              backgroundColor: index <= currentIndex ? colors.primary : colors.gray200,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {index < currentIndex ? (
              <Ionicons name="checkmark" size={16} color={colors.white} />
            ) : (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: borderRadius.full,
                  backgroundColor: index === currentIndex ? colors.white : colors.gray400,
                }}
              />
            )}
          </View>
          
          <Caption
            color={index <= currentIndex ? 'primary' : 'textMuted'}
            style={{ fontWeight: index === currentIndex ? '600' : '400' }}
          >
            {step}
          </Caption>
        </Row>
      ))}
    </Column>
  );
};