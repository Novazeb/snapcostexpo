import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../ui/Card';
import { Transaction } from '../../types';
import { SPACING, RADIUS } from '../../constants/theme';
import { getLocalDateString } from '../../constants/dateUtils';

interface Props {
  transactions: Transaction[];
}

export function MonthlyBarChart({ transactions }: Props) {
  const { colors } = useTheme();

  // Get last 7 days spending in local timezone
  const days: { label: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateString(d);
    const dayLabel = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()];
    const total = transactions
      .filter((tx) => tx.date === dateStr)
      .reduce((sum, tx) => sum + tx.totalAmount, 0);
    days.push({ label: dayLabel, total });
  }

  const maxVal = Math.max(...days.map((d) => d.total), 1);
  const chartWidth = 300;
  const chartHeight = 130;
  const barWidth = 26;
  const gap = (chartWidth - barWidth * 7) / 8;

  return (
    <Card style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Pengeluaran 7 Hari Terakhir</Text>
      <View style={styles.chartWrapper}>
        <Svg width={chartWidth} height={chartHeight + 24}>
          {days.map((day, i) => {
            const barHeight = maxVal > 0 ? (day.total / maxVal) * chartHeight : 0;
            const x = gap + i * (barWidth + gap);
            const y = chartHeight - barHeight;
            return (
              <React.Fragment key={i}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  rx={RADIUS.sm}
                  fill={day.total > 0 ? colors.accent : colors.cardSubtle}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 16}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="600"
                  fill={colors.textMuted}
                >
                  {day.label}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: SPACING.md,
  },
  chartWrapper: {
    alignItems: 'center',
  },
});
