import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color, height = 6 }) => {
  const { colors } = useTheme();

  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const barColor = color || (clampedProgress > 0.9 ? colors.danger : colors.accent);

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: colors.cardSubtle,
          height,
          borderRadius: height / 2,
        },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            backgroundColor: barColor,
            width: `${clampedProgress * 100}%`,
            height,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
