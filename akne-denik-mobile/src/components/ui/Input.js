// src/components/ui/Input.js
// 📝 CENTRALIZOVANÁ INPUT KOMPONENTA
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Label, Caption } from './Typography';
import { colors, spacing, borderRadius, forms } from '../../styles/designSystem';

export const Input = ({
  label = null,
  placeholder = '',
  value = '',
  onChangeText = () => {},
  error = null,
  helper = null,
  required = false,
  leftIcon = null,
  rightIcon = null,
  onRightIconPress = null,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  style = {},
  inputStyle = {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const showPasswordToggle = secureTextEntry;
  const finalRightIcon = showPasswordToggle 
    ? (isPasswordVisible ? 'eye-off' : 'eye')
    : rightIcon;

  const handleRightIconPress = () => {
    if (showPasswordToggle) {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  return (
    <View style={[forms.field, style]}>
      {label && (
        <Label required={required} style={{ marginBottom: spacing.sm }}>
          {label}
        </Label>
      )}
      
      <View style={{ position: 'relative' }}>
        <TextInput
          style={[
            forms.input,
            {
              paddingLeft: leftIcon ? 48 : spacing.md,
              paddingRight: finalRightIcon ? 48 : spacing.md,
              borderColor: error ? colors.error : (isFocused ? colors.primary : colors.border),
              minHeight: multiline ? 80 : 44,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            isFocused && forms.inputFocused,
            inputStyle
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          placeholderTextColor={colors.placeholder}
          {...props}
        />
        
        {leftIcon && (
          <View style={{
            position: 'absolute',
            left: spacing.md,
            top: multiline ? spacing.md : '50%',
            transform: multiline ? [] : [{ translateY: -10 }],
          }}>
            <Ionicons name={leftIcon} size={20} color={colors.textSecondary} />
          </View>
        )}
        
        {finalRightIcon && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: spacing.md,
              top: multiline ? spacing.md : '50%',
              transform: multiline ? [] : [{ translateY: -10 }],
            }}
            onPress={handleRightIconPress}
          >
            <Ionicons name={finalRightIcon} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Caption color="error" style={forms.error}>
          {error}
        </Caption>
      )}
      
      {helper && !error && (
        <Caption style={forms.helper}>
          {helper}
        </Caption>
      )}
    </View>
  );
};