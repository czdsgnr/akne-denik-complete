// src/components/ui/Typography.js
// 🔤 ZÁKLADNÍ TYPOGRAPHY KOMPONENTY
import React from 'react';
import { Text } from 'react-native';
import { typography, colors } from '../../styles/designSystem';

export const Title = ({ 
  children, 
  level = 2, // 1 | 2 | 3 | 4
  style = {}, 
  color = null,
  ...props 
}) => {
  const levels = {
    1: typography.title,
    2: typography.subtitle,
    3: typography.heading,
    4: { ...typography.heading, fontSize: 16 },
  };

  const textColor = color ? colors[color] || color : levels[level].color;

  return (
    <Text 
      style={[
        levels[level], 
        { color: textColor },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

export const Body = ({ 
  children, 
  variant = 'default', // default | bold | secondary
  style = {}, 
  color = null,
  ...props 
}) => {
  const variants = {
    default: typography.body,
    bold: typography.bodyBold,
    secondary: { ...typography.body, color: colors.textSecondary },
  };

  const textColor = color ? colors[color] || color : variants[variant].color;

  return (
    <Text 
      style={[
        variants[variant], 
        { color: textColor },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

export const Caption = ({ 
  children, 
  style = {}, 
  color = null,
  ...props 
}) => {
  const textColor = color ? colors[color] || color : typography.caption.color;

  return (
    <Text 
      style={[
        typography.caption, 
        { color: textColor },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

export const Label = ({ 
  children, 
  style = {}, 
  color = null,
  ...props 
}) => {
  const textColor = color ? colors[color] || color : typography.label.color;

  return (
    <Text 
      style={[
        typography.label, 
        { color: textColor },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};