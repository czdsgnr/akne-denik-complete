// src/components/ui/index.js
// 🎨 OPRAVENÝ EXPORT - bez require()
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Design system export
export {
  default as designSystem,
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  gradients,
  animations,
  responsive,
  getStatusColor,
  getGradient,
  containers,
  layouts,
  cards,
  buttons,
  forms,
} from '../../styles/designSystem';

// Layout komponenty
export { Card } from './Card';
export { Button } from './Button';

// Typography komponenty
export {
  Title,
  Body,
  Caption,
  Label,
} from './Typography';

// Form komponenty
export { Input } from './Input';

// Display komponenty
export { Avatar } from './Avatar';
export { Badge } from './Badge';
export { ProgressBar } from './ProgressBar';

// Navigation a Structure
export {
  ListItem,
  SwitchListItem,
} from './List';

// Feedback komponenty
export {
  LoadingSpinner,
  LoadingOverlay,
  SkeletonCard,
} from './Loading';

export {
  Snackbar,
  useSnackbar,
} from './Snackbar';

export { Modal } from './Modal';

// Layout containers - OPRAVENÉ IMPORTY
import { 
  colors, 
  spacing, 
  typography, 
  containers, 
  layouts, 
  gradients 
} from '../../styles/designSystem';

export const Screen = ({ children, variant = 'default', style = {}, ...props }) => {
  const baseStyle = variant === 'soft' ? containers.screenSoft : containers.screen;
  return (
    <View style={[baseStyle, style]} {...props}>
      {children}
    </View>
  );
};

export const CenteredContainer = ({ children, style = {}, ...props }) => {
  return (
    <View style={[containers.centered, style]} {...props}>
      {children}
    </View>
  );
};

// Gradient wrapper - OPRAVENÝ
export const GradientView = ({ children, colors: gradientColors, style = {}, ...props }) => {
  return (
    <LinearGradient 
      colors={gradientColors || gradients.primary} 
      style={style} 
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

// Header komponenta - OPRAVENÁ
export const Header = ({ 
  title, 
  subtitle = null, 
  avatar = null, 
  rightComponent = null, 
  style = {}, 
  ...props 
}) => {
  return (
    <View style={[{
      padding: spacing.lg,
      backgroundColor: colors.surface,
    }, style]} {...props}>
      <View style={layouts.rowBetween}>
        {avatar}
        <View style={{ flex: 1, marginLeft: avatar ? spacing.md : 0 }}>
          <Text style={[typography.title, { color: colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
        {rightComponent}
      </View>
    </View>
  );
};

// Error komponenta - OPRAVENÁ
export const ErrorMessage = ({ 
  message, 
  onRetry = null, 
  style = {}, 
  ...props 
}) => {
  return (
    <View 
      style={[
        { 
          alignItems: 'center', 
          padding: spacing.lg,
          justifyContent: 'center',
          flex: 1,
        }, 
        style
      ]} 
      {...props}
    >
      <Ionicons name="alert-circle" size={48} color={colors.error} />
      <Text 
        style={[
          typography.body, 
          { 
            color: colors.error, 
            textAlign: 'center', 
            marginVertical: spacing.md 
          }
        ]}
      >
        {message}
      </Text>
      {onRetry && (
        <Button
          title="Zkusit znovu"
          onPress={onRetry}
          variant="outline"
        />
      )}
    </View>
  );
};

// Layout helpers
export const Row = ({ children, style = {}, center = false, between = false, ...props }) => {
  const baseStyle = center ? layouts.rowCenter : between ? layouts.rowBetween : layouts.row;
  return (
    <View style={[baseStyle, style]} {...props}>
      {children}
    </View>
  );
};

export const Column = ({ children, style = {}, center = false, ...props }) => {
  const baseStyle = center ? layouts.columnCenter : layouts.column;
  return (
    <View style={[baseStyle, style]} {...props}>
      {children}
    </View>
  );
};

export const Spacer = ({ size = 'md', horizontal = false }) => {
  const dimension = spacing[size] || spacing.md;
  return (
    <View 
      style={{
        width: horizontal ? dimension : 0,
        height: horizontal ? 0 : dimension,
      }} 
    />
  );
};