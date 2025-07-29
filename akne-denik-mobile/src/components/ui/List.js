// ═══════════════════════════════════════════════════════════════════
// src/components/ui/List.js
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../styles/designSystem';

export const ListItem = ({
  title,
  subtitle = null,
  leftIcon = null,
  rightComponent = null,
  onPress = null,
  badge = null,
  style = {},
  ...props
}) => {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component 
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing.md,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        },
        style
      ]}
      {...props}
    >
      {leftIcon && (
        <Ionicons 
          name={leftIcon} 
          size={24} 
          color={colors.textSecondary}
          style={{ marginRight: spacing.md }}
        />
      )}
      
      <View style={{ flex: 1 }}>
        <Text style={{ ...typography.body, color: colors.text }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ ...typography.caption, color: colors.textSecondary, marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {badge && (
        <View style={{ marginRight: spacing.sm }}>
          {badge}
        </View>
      )}
      
      {rightComponent && rightComponent}
      
      {onPress && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={colors.textSecondary}
          style={{ marginLeft: spacing.sm }}
        />
      )}
    </Component>
  );
};

export const SwitchListItem = ({
  title,
  subtitle = null,
  value = false,
  onValueChange,
  leftIcon = null,
  disabled = false,
  style = {},
  ...props
}) => {
  return (
    <View 
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing.md,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderLight,
        },
        style
      ]}
      {...props}
    >
      {leftIcon && (
        <Ionicons 
          name={leftIcon} 
          size={24} 
          color={colors.textSecondary}
          style={{ marginRight: spacing.md }}
        />
      )}
      
      <View style={{ flex: 1 }}>
        <Text style={{ 
          ...typography.body, 
          color: disabled ? colors.disabled : colors.text 
        }}>
          {title}
        </Text>
        {subtitle && (
          <Text style={{ 
            ...typography.caption, 
            color: disabled ? colors.disabled : colors.textSecondary, 
            marginTop: 2 
          }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ 
          false: colors.borderLight, 
          true: colors.primary + '40' // Add transparency
        }}
        thumbColor={value ? colors.primary : colors.surface}
      />
    </View>
  );
};