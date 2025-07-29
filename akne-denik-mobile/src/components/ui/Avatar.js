// src/components/ui/Avatar.js
// 👤 CENTRALIZOVANÁ AVATAR KOMPONENTA
import React from 'react';
import { View, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { avatars, colors, typography } from '../../styles/designSystem';

export const Avatar = ({
  size = 'medium', // small | medium | large | xlarge | custom
  source = null,
  initials = null,
  backgroundColor = colors.primary,
  textColor = colors.textInverse,
  icon = 'person',
  style = {},
  customSize = null,
  ...props
}) => {
  const sizeStyle = customSize 
    ? { width: customSize, height: customSize, borderRadius: customSize / 2 }
    : avatars[size] || avatars.medium;
  
  const fontSize = sizeStyle.width * 0.4;
  const iconSize = sizeStyle.width * 0.5;
  
  const containerStyle = [
    avatars.container,
    sizeStyle,
    { backgroundColor },
    style
  ];

  if (source) {
    return (
      <Image
        source={typeof source === 'string' ? { uri: source } : source}
        style={containerStyle}
        {...props}
      />
    );
  }
  
  return (
    <View style={containerStyle} {...props}>
      {initials ? (
        <Text style={[{ color: textColor, fontSize, fontWeight: '600' }]}>
          {initials.toUpperCase()}
        </Text>
      ) : (
        <Ionicons name={icon} size={iconSize} color={textColor} />
      )}
    </View>
  );
};