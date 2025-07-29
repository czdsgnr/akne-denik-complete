// ═══════════════════════════════════════════════════════════════════
// src/components/ui/Modal.js
// ═══════════════════════════════════════════════════════════════════
import React from 'react';
import { Modal as RNModal, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/designSystem';

export const Modal = ({
  visible = false,
  onClose,
  title = '',
  children,
  size = 'medium', // small | medium | large | fullscreen
  closable = true,
  blurBackground = true,
  actions = null,
  style = {},
  ...props
}) => {
  const sizeStyles = {
    small: { maxWidth: 300, maxHeight: '50%' },
    medium: { maxWidth: 400, maxHeight: '70%' },
    large: { maxWidth: 600, maxHeight: '85%' },
    fullscreen: { width: '100%', height: '100%' },
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <View style={{
        flex: 1,
        backgroundColor: blurBackground ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
      }}>
        <View style={[
          {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            width: '100%',
            ...sizeStyles[size],
            ...shadows.xl,
          },
          style
        ]}>
          {/* Header */}
          {(title || closable) && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing.md,
            }}>
              <Text style={{ ...typography.h4, color: colors.text }}>
                {title}
              </Text>
              {closable && (
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Content */}
          <View style={{ marginBottom: actions ? spacing.lg : 0 }}>
            {children}
          </View>
          
          {/* Actions */}
          {actions && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: spacing.sm,
            }}>
              {actions}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
};