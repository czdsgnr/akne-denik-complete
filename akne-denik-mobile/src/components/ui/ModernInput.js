// ================================================================
// src/components/ui/ModernInput.js
// 📝 MODERNÍ INPUT KOMPONENTA
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '../../styles/designSystem';
import { Caption } from './Typography';

export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helper,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  multiline = false,
  numberOfLines = 1,
  style = {},
  inputStyle = {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setIsSecureVisible(!isSecureVisible);
    }
  };

  const finalRightIcon = secureTextEntry 
    ? (isSecureVisible ? 'eye-off' : 'eye')
    : rightIcon;

  return (
    <View style={style}>
      {label && (
        <Caption 
          style={{ 
            marginBottom: spacing.sm,
            color: colors.text,
            fontWeight: '500'
          }}
        >
          {label}
        </Caption>
      )}
      
      <View style={{ position: 'relative' }}>
        <TextInput
          style={[
            {
              borderWidth: 1,
              borderColor: error ? colors.error : (isFocused ? colors.primary : colors.borderMedium),
              borderRadius: borderRadius.xl,
              paddingHorizontal: leftIcon ? spacing.xxxl : spacing.lg,
              paddingVertical: spacing.md,
              fontSize: 16,
              backgroundColor: isFocused ? colors.primaryExtraLight : colors.white,
              color: colors.text,
              textAlignVertical: multiline ? 'top' : 'center',
              minHeight: multiline ? 80 : 48,
              ...(isFocused && shadows.xs),
              ...typography.body,
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />
        
        {leftIcon && (
          <View style={{
            position: 'absolute',
            left: spacing.lg,
            top: multiline ? spacing.md : '50%',
            transform: multiline ? [] : [{ translateY: -10 }],
          }}>
            <Ionicons name={leftIcon} size={20} color={colors.textMuted} />
          </View>
        )}
        
        {finalRightIcon && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: spacing.lg,
              top: multiline ? spacing.md : '50%',
              transform: multiline ? [] : [{ translateY: -10 }],
            }}
            onPress={handleRightIconPress}
          >
            <Ionicons name={finalRightIcon} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Caption color="error" style={{ marginTop: spacing.xs }}>
          {error}
        </Caption>
      )}
      
      {helper && !error && (
        <Caption color="textMuted" style={{ marginTop: spacing.xs }}>
          {helper}
        </Caption>
      )}
    </View>
  );
};