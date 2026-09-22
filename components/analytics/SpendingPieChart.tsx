import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../ui/Card';
import { CategorySpending } from '../../types';
import { SPACING, RADIUS } from '../../constants/theme';

interface Props {
  data: CategorySpending[];
  totalMonthly: number;
}

export function SpendingPieChart({ data, totalMonthly }: Props) {
  const { colors } = useTheme();
  const size = 180;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const activeData = data.filter((d) => d.total > 0);
  let accumulatedPercentage = 0;

  return (
    <Card style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Distribusi Pengeluaran</Text>
      <View style={styles.chartRow}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.cardSubtle}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {activeData.map((item) => {
            const percentage = totalMonthly > 0 ? item.total / totalMonthly : 0;
            const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`;
            const rotation = accumulatedPercentage * 360 - 90;
            accumulatedPercentage += percentage;
            return (
              <Circle
                key={item.categoryId}
                cx={center}
                cy={center}
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={0}
                strokeLinecap="butt"
                rotation={rotation}
                origin={`${center}, ${center}`}
              />
            );
          })}
        </Svg>
        <View style={styles.centerLabel}>
          <Text style={[styles.totalLabel, { color: colors.textMuted }]}>Total</Text>
          <Text style={[styles.totalAmount, { color: colors.textPrimary }]}>
            Rp {totalMonthly > 0 ? (totalMonthly / 1000).toFixed(0) + 'K' : '0'}
          </Text>
        </View>
      </View>
      <View style={styles.legendContainer}>
        {activeData.slice(0, 4).map((item) => (
          <View key={item.categoryId} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.categoryName} ({item.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: SPACING.md,
    alignSelf: 'flex-start',
  },
  chartRow: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.lg,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginBottom: SPACING.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.sm,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
});
