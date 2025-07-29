// src/components/ui/Button.js
// 🔘 ZÁKLADNÍ BUTTON KOMPONENTA
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  colors, 
  spacing, 
  typography, 
  borderRadius, 
  shadows 
} from '../../styles/designSystem';

export const Button = ({
  children,
  title,
  variant = 'primary', // primary | secondary | outline | ghost
  size = 'medium', // small | medium | large
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left', // left | right
  fullWidth = false,
  style = {},
  textStyle = {},
  onPress,
  ...props
}) => {
  // Variant styly
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      textColor: colors.textInverse,
    },
    secondary: {
      backgroundColor: colors.secondary,
      textColor: colors.textInverse,
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: colors.primary,
      borderColor: colors.primary,
      borderWidth: 1,
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: colors.primary,
    },
  };

  // Size styly
  const sizeStyles = {
    small: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      fontSize: 14,
      minHeight: 36,
    },
    medium: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      fontSize: 16,
      minHeight: 48,
    },
    large: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
      fontSize: 18,
      minHeight: 56,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const isDisabled = disabled || loading;

  // Container styly
  const containerStyle = [
    {
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: currentVariant.backgroundColor,
      borderColor: currentVariant.borderColor,
      borderWidth: currentVariant.borderWidth || 0,
      paddingVertical: currentSize.paddingVertical,
      paddingHorizontal: currentSize.paddingHorizontal,
      minHeight: currentSize.minHeight,
      opacity: isDisabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
    },
    variant === 'primary' && shadows.sm,
    style,
  ];

  // Text styly
  const textStyles = [
    {
      color: currentVariant.textColor,
      fontSize: currentSize.fontSize,
      fontWeight: '500',
      textAlign: 'center',
    },
    textStyle,
  ];

  const renderIcon = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={currentVariant.textColor} 
          style={{ marginRight: spacing.sm }}
        />
      );
    }

    if (icon) {
      return (
        <Ionicons 
          name={icon} 
          size={currentSize.fontSize} 
          color={currentVariant.textColor}
          style={{
            marginRight: iconPosition === 'left' ? spacing.sm : 0,
            marginLeft: iconPosition === 'right' ? spacing.sm : 0,
          }}
        />
      );
    }

    return null;
  };

  const content = title || children;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      
      {content && (
        <Text style={textStyles}>
          {content}
        </Text>
      )}
      
      {iconPosition === 'right' && renderIcon()}
    </TouchableOpacity>
  );
};