// ================================================================
// src/components/ui/ModernSwitch.js
// 🔄 MODERNÍ SWITCH KOMPONENTA
import React from 'react';
import { View, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../styles/designSystem';
import { Body, Caption } from './Typography';

export const SwitchListItem = ({
  title,
  subtitle,
  value,
  onValueChange,
  leftIcon,
  required = false,
  style = {},
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
          backgroundColor: colors.surfaceSubtle,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.borderLight,
        },
        style,
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
      {...props}
    >
      {leftIcon && (
        <View style={{
          width: 40,
          height: 40,
          borderRadius: borderRadius.lg,
          backgroundColor: value ? colors.primaryLight : colors.gray100,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}>
          <Ionicons 
            name={leftIcon} 
            size={20} 
            color={value ? colors.primary : colors.textMuted} 
          />
        </View>
      )}
      
      <View style={{ flex: 1 }}>
        <Body style={{ fontWeight: required ? '500' : '400' }}>
          {title}
        </Body>
        {subtitle && (
          <Caption style={{ marginTop: spacing.xs }}>
            {subtitle}
          </Caption>
        )}
      </View>
      
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: colors.gray200,
          true: colors.primaryLight,
        }}
        thumbColor={value ? colors.primary : colors.white}
        ios_backgroundColor={colors.gray200}
      />
    </TouchableOpacity>
  );
};