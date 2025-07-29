// src/components/ui/Loading.js
// 🔄 CENTRALIZOVANÉ LOADING KOMPONENTY
import React from 'react';
import { View, ActivityIndicator, Dimensions } from 'react-native';
import { Body } from './Typography';
import { colors, spacing } from '../../styles/designSystem';

export const LoadingSpinner = ({
  size = 'large',
  color = colors.primary,
  text = null,
  overlay = false,
  style = {},
  ...props
}) => {
  const containerStyle = [
    {
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    overlay && {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 1000,
    },
    !overlay && { flex: 1 },
    style
  ];

  return (
    <View style={containerStyle} {...props}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Body variant="secondary" style={{ marginTop: spacing.md, textAlign: 'center' }}>
          {text}
        </Body>
      )}
    </View>
  );
};

export const LoadingOverlay = ({ visible = false, text = 'Načítám...', ...props }) => {
  if (!visible) return null;
  
  return <LoadingSpinner overlay text={text} {...props} />;
};

// Skeleton loading pro karty
export const SkeletonCard = ({ style = {} }) => (
  <View style={[
    {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    style
  ]}>
    <View style={{
      height: 20,
      backgroundColor: colors.borderLight,
      borderRadius: 4,
      marginBottom: spacing.md,
      width: '60%',
    }} />
    <View style={{
      height: 16,
      backgroundColor: colors.borderLight,
      borderRadius: 4,
      marginBottom: spacing.sm,
    }} />
    <View style={{
      height: 16,
      backgroundColor: colors.borderLight,
      borderRadius: 4,
      width: '80%',
    }} />
  </View>
);