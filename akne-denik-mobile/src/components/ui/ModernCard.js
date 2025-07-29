// ================================================================
// src/components/ui/ModernCard.js
// 🃏 MODERNÍ CARD - čistý a minimální
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../../styles/designSystem';

export const Card = ({
  children,
  variant = 'base',
  onPress = null,
  padding = 'xl',
  style = {},
  ...props
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  
  const variants = {
    base: {
      backgroundColor: colors.white,
      ...shadows.sm,
    },
    elevated: {
      backgroundColor: colors.white,
      ...shadows.md,
    },
    subtle: {
      backgroundColor: colors.surfaceSubtle,
      ...shadows.xs,
    },
    minimal: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
  };

  const paddingValue = spacing[padding] || spacing.xl;

  const cardStyle = [
    {
      borderRadius: borderRadius.xl,
      padding: paddingValue,
      ...variants[variant],
    },
    style,
  ];

  return (
    <Wrapper
      style={cardStyle}
      onPress={onPress}
      activeOpacity={onPress ? 0.95 : 1}
      {...props}
    >
      {children}
    </Wrapper>
  );
};