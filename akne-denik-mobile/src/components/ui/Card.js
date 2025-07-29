// src/components/ui/Card.js
// 🃏 KOMPLETNÍ CARD KOMPONENTA
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  colors, 
  shadows, 
  borderRadius, 
  spacing 
} from '../../styles/designSystem';

export const Card = ({ 
  children, 
  variant = 'base', // base | elevated | subtle | gradient | minimal
  onPress = null,
  padding = 'lg', // xs | sm | md | lg | xl
  margin = 'md',
  radius = 'lg',
  shadow = null,
  gradient = null,
  style = {},
  ...props 
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  
  const paddingValue = spacing[padding] || spacing.lg;
  const marginValue = spacing[margin] || spacing.md;
  const radiusValue = borderRadius[radius] || borderRadius.lg;
  
  const baseStyle = {
    padding: paddingValue,
    marginHorizontal: marginValue,
    marginBottom: marginValue,
    borderRadius: radiusValue,
  };

  const variantStyles = {
    base: {
      backgroundColor: colors.surface,
      ...shadows.sm,
    },
    elevated: {
      backgroundColor: colors.surface,
      ...shadows.md,
    },
    subtle: {
      backgroundColor: colors.surfaceSubtle,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    minimal: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    gradient: {
      // Gradient will be applied via LinearGradient wrapper
      backgroundColor: 'transparent',
    },
  };

  const finalStyle = [
    baseStyle,
    variantStyles[variant],
    shadow && shadows[shadow],
    style
  ];

  // Gradient wrapper
  if (gradient || variant === 'gradient') {
    const gradientColors = gradient || [colors.primaryExtraLight, colors.surface];
    return (
      <Wrapper onPress={onPress} activeOpacity={onPress ? 0.95 : 1} {...props}>
        <LinearGradient colors={gradientColors} style={finalStyle}>
          {children}
        </LinearGradient>
      </Wrapper>
    );
  }

  return (
    <Wrapper 
      style={finalStyle} 
      onPress={onPress} 
      activeOpacity={onPress ? 0.95 : 1}
      {...props}
    >
      {children}
    </Wrapper>
  );
};