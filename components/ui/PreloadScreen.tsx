import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { RADIUS, SPACING } from '../../constants/theme';

interface PreloadScreenProps {
  onFinish?: () => void;
  duration?: number;
}

const { width } = Dimensions.get('window');

export const PreloadScreen: React.FC<PreloadScreenProps> = ({
  onFinish,
  duration = 1400,
}) => {
  const { colors } = useTheme();

  // Animation values
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(12)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance animation (Logo + text appear smoothly)
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: duration - 300,
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Smooth exit fade out after duration
    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) {
          onFinish();
        }
      });
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        styles.container,
        {
          backgroundColor: colors.background,
          opacity: screenOpacity,
        },
      ]}
    >
      <View style={styles.contentCenter}>
        {/* Animated Brand Emblem */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/images/splash-icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Brand Name & Subtitle */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <Text style={styles.brandTitle}>
            <Text style={{ color: colors.textPrimary }}>Snap</Text>
            <Text style={{ color: colors.accent }}>Cost</Text>
          </Text>
          <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
            Solusi Hemat Pengeluaran
          </Text>
        </Animated.View>
      </View>

      {/* Subtle Minimalist Loading Bar */}
      <View style={styles.bottomBar}>
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <Animated.View
            style={[
              styles.fill,
              {
                backgroundColor: colors.accent,
                width: progressWidth,
              },
            ]}
          />
        </View>
        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          Memuat data transaksi...
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 92,
    height: 92,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  logoImage: {
    width: 62,
    height: 62,
  },
  textContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  brandSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
    marginTop: 6,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    width: '100%',
  },
  track: {
    width: 120,
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  fill: {
    height: '100%',
    borderRadius: 1.5,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});
