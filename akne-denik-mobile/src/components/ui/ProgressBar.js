// src/components/ui/ProgressBar.js
// 📊 CENTRALIZOVANÁ PROGRESS BAR KOMPONENTA
import React from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../styles/designSystem';

export const ProgressBar = ({
  progress = 0, // 0-1
  color = colors.primary,
  backgroundColor = colors.borderLight,
  height = 8,
  animated = true,
  showPercentage = false,
  showLabels = false,
  label = '',
  gradient = null,
  style = {},
  ...props
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(progress);
    }
  }, [progress, animated]);

  const progressWidth = animated ? animatedValue : progress;

  return (
    <View style={[{ marginVertical: spacing.sm }, style]} {...props}>
      {(showLabels || label) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
          <Text style={typography.caption}>{label}</Text>
          {showPercentage && (
            <Text style={typography.caption}>{Math.round(progress * 100)}%</Text>
          )}
        </View>
      )}
      
      <View style={{
        height,
        backgroundColor,
        borderRadius: height / 2,
        overflow: 'hidden',
      }}>
        <Animated.View
          style={{
            height: '100%',
            borderRadius: height / 2,
            width: progressWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
              extrapolate: 'clamp',
            }),
          }}
        >
          {gradient ? (
            <LinearGradient
              colors={gradient}
              style={{ flex: 1, borderRadius: height / 2 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          ) : (
            <View style={{ flex: 1, backgroundColor: color, borderRadius: height / 2 }} />
          )}
        </Animated.View>
      </View>
    </View>
  );
};