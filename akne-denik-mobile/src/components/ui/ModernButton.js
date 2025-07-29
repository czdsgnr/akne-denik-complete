// src/components/ui/ModernButton.js
// 🔘 MODERNÍ BUTTON KOMPONENTA - jemný design
import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/designSystem';

export const Button = ({
  children,
  title,
  variant = 'primary',
  size = 'large',
  loading = false,
  disabled = false,
  icon = null,
  fullWidth = false,
  style = {},
  onPress,
  ...props
}) => {
  // Moderní varianty - jemné!
  const variants = {
    primary: {
      backgroundColor: colors.primary,
      textColor: colors.white,
      shadow: shadows.sm,
    },
    subtle: {
      backgroundColor: colors.primaryLight,
      textColor: colors.primary,
      shadow: shadows.xs,
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: colors.primary,
      shadow: shadows.none,
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: colors.text,
      borderWidth: 1,
      borderColor: colors.borderMedium,
      shadow: shadows.none,
    },
  };

  const sizes = {
    medium: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      fontSize: 16,
      minHeight: 48,
      borderRadius: borderRadius.xl,
    },
    large: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xxl,
      fontSize: 17,
      minHeight: 56,
      borderRadius: borderRadius.xl,
    },
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  const buttonStyle = [
    {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: currentVariant.backgroundColor,
      borderRadius: currentSize.borderRadius,
      paddingVertical: currentSize.paddingVertical,
      paddingHorizontal: currentSize.paddingHorizontal,
      minHeight: currentSize.minHeight,
      borderWidth: currentVariant.borderWidth || 0,
      borderColor: currentVariant.borderColor || 'transparent',
      ...currentVariant.shadow,
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.5 }),
    },
    style,
  ];

  const textStyle = {
    fontSize: currentSize.fontSize,
    fontWeight: '500',
    color: currentVariant.textColor,
    letterSpacing: 0.1,
    textAlign: 'center',
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={currentVariant.textColor} 
        />
      );
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={currentVariant.textColor}
            style={{ marginRight: spacing.sm }}
          />
        )}
        <Text style={textStyle}>
          {title || children}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};