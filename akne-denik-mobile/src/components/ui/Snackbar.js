// src/components/ui/Snackbar.js
// 🍪 ZÁKLADNÍ SNACKBAR KOMPONENTA
import React, { useState, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/designSystem';

const { width: screenWidth } = Dimensions.get('window');

export const Snackbar = ({ 
  visible = false,
  message = '',
  type = 'info', // success | error | warning | info
  duration = 3000,
  onDismiss = () => {},
  style = {},
  ...props 
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  const typeStyles = {
    success: {
      backgroundColor: colors.success,
      icon: 'checkmark-circle',
    },
    error: {
      backgroundColor: colors.error,
      icon: 'close-circle',
    },
    warning: {
      backgroundColor: colors.warning,
      icon: 'warning',
    },
    info: {
      backgroundColor: colors.info,
      icon: 'information-circle',
    },
  };

  const currentType = typeStyles[type] || typeStyles.info;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 100,
          left: spacing.lg,
          right: spacing.lg,
          backgroundColor: currentType.backgroundColor,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 1000,
          ...shadows.lg,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
      {...props}
    >
      <Ionicons 
        name={currentType.icon} 
        size={24} 
        color={colors.white} 
        style={{ marginRight: spacing.md }}
      />
      
      <Text style={[
        typography.body,
        { 
          color: colors.white,
          flex: 1,
        }
      ]}>
        {message}
      </Text>

      <TouchableOpacity
        onPress={handleDismiss}
        style={{
          padding: spacing.xs,
          marginLeft: spacing.sm,
        }}
      >
        <Ionicons name="close" size={20} color={colors.white} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Hook pro používání Snackbaru
export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: '',
    type: 'info',
    duration: 3000,
  });

  const showSnackbar = ({ message, type = 'info', duration = 3000 }) => {
    setSnackbar({
      visible: true,
      message,
      type,
      duration,
    });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, visible: false }));
  };

  const SnackbarComponent = () => (
    <Snackbar
      visible={snackbar.visible}
      message={snackbar.message}
      type={snackbar.type}
      duration={snackbar.duration}
      onDismiss={hideSnackbar}
    />
  );

  return {
    showSnackbar,
    hideSnackbar,
    SnackbarComponent,
  };
};