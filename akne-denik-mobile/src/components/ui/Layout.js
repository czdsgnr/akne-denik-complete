// ================================================================
// src/components/ui/Layout.js
// 📐 LAYOUT KOMPONENTY - moderní spacing
import React from 'react';
import { View } from 'react-native';
import { spacing } from '../../styles/designSystem';

export const Row = ({
  children,
  align = 'center',
  justify = 'flex-start',
  gap = null,
  style = {},
  ...props
}) => {
  const gapValue = gap ? (spacing[gap] || gap) : 0;
  
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: align,
          justifyContent: justify,
          gap: gapValue,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export const Column = ({
  children,
  align = 'stretch',
  justify = 'flex-start',
  gap = null,
  style = {},
  ...props
}) => {
  const gapValue = gap ? (spacing[gap] || gap) : 0;
  
  return (
    <View
      style={[
        {
          flexDirection: 'column',
          alignItems: align,
          justifyContent: justify,
          gap: gapValue,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export const Spacer = ({
  size = 'md',
  horizontal = false,
  style = {},
  ...props
}) => {
  const spaceValue = spacing[size] || spacing.md;
  
  return (
    <View
      style={[
        {
          width: horizontal ? spaceValue : 1,
          height: horizontal ? 1 : spaceValue,
        },
        style,
      ]}
      {...props}
    />
  );
};