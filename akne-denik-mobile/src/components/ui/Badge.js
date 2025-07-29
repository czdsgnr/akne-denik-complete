// src/components/ui/Badge.js
// 🏷️ CENTRALIZOVANÁ BADGE KOMPONENTA
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { badges, colors, borderRadius, spacing } from '../../styles/designSystem';

export const Badge = ({
  children,
  variant = 'primary', // primary | secondary | success | warning | error | info
  size = 'medium', // small | medium | large
  icon = null,
  style = {},
  textStyle = {},
  ...props
}) => {
  const variantStyles = {
    primary: { backgroundColor: colors.primary, color: colors.textInverse },
    secondary: { backgroundColor: colors.secondary, color: colors.textInverse },
    success: { backgroundColor: colors.success, color: colors.textInverse },
    warning: { backgroundColor: colors.warning, color: colors.textInverse },
    error: { backgroundColor: colors.error, color: colors.textInverse },
    info: { backgroundColor: colors.info, color: colors.textInverse },
  };

  const sizeStyles = {
    small: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10 },
    medium: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 },
    large: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 },
  };

  const { backgroundColor, color } = variantStyles[variant];
  const { paddingHorizontal, paddingVertical, fontSize } = sizeStyles[size];

  return (
    <View 
      style={[
        {
          backgroundColor,
          paddingHorizontal,
          paddingVertical,
          borderRadius: borderRadius.full,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
        },
        style
      ]} 
      {...props}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={fontSize} 
          color={color} 
          style={{ marginRight: children ? 4 : 0 }} 
        />
      )}
      {children && (
        <Text 
          style={[
            { color, fontSize, fontWeight: '600' },
            textStyle
          ]}
        >
          {children}
        </Text>
      )}
    </View>
  );
};