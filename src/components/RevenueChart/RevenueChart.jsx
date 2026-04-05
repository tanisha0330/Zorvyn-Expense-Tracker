import { useState, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import './RevenueChart.css';

// ─── Constants ────────────────────────────────────────────────────────────
const BAR_RADIUS = 10;        // capsule corner radius

// ─── Custom bar shapes ────────────────────────────────────────────────────

/**
 * Dark capsule — occupies the bottom (value) portion.
 * Rounded at the bottom, flat at the top so it meets the light bar cleanly.
 */
const DarkCapsuleBar = (props) => {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0) return null;
  const r = Math.min(width / 2 - 1, BAR_RADIUS);
  return (
    <path
      d={[
        `M ${x},${y}`,
        `L ${x + width},${y}`,
        `L ${x + width},${y + height - r}`,
        `Q ${x + width},${y + height} ${x + width - r},${y + height}`,
        `L ${x + r},${y + height}`,
        `Q ${x},${y + height} ${x},${y + height - r}`,
        'Z',
      ].join(' ')}
      fill={fill || '#1c1c1e'}
    />
  );
};

/**
 * Light capsule — occupies the top (remainder) portion.
 * Rounded at the top, flat at the bottom so it sits flush on the dark bar.
 */
const LightCapsuleBar = (props) => {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0) return null;
  const r = Math.min(width / 2 - 1, BAR_RADIUS);
  return (
    <path
      d={[
        `M ${x},${y + r}`,
        `Q ${x},${y} ${x + r},${y}`,
        `L ${x + width - r},${y}`,
        `Q ${x + width},${y} ${x + width},${y + r}`,
        `L ${x + width},${y + height}`,
        `L ${x},${y + height}`,
        'Z',
      ].join(' ')}
      fill={fill || '#e5e3db'}
    />
  );
};

// ─── Custom tooltip ───────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const val = payload.find(p => p.dataKey === 'value')?.value;
  if (val == null) return null;

  return (
    <div className="rev-tooltip">
      <span className="rev-tooltip__dot" aria-hidden="true" />
      <span className="rev-tooltip__value">$ {val.toLocaleString()}</span>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────
function RevenueChart() {
  const { transactions, theme } = useDashboard();
  const [activeDay, setActiveDay] = useState(null);

  const activeFill = theme === 'dark' ? '#ffffff' : '#1c1c1e';
  const remainderFill = theme === 'dark' ? '#38383c' : '#e5e3db';

  // Group incomes by day over the last 7 days (or around the max latest date in our mock)
  const chartData = useMemo(() => {
    const incomes = transactions.filter(t => t.type === 'income');
    const dateMap = {};
    
    // Sum by date
    incomes.forEach(t => {
      // slice(0,10) of '2022-09-11' etc
      const dateStr = t.date.slice(0, 10);
      dateMap[dateStr] = (dateMap[dateStr] || 0) + t.amount;
    });

    // To ensure the chart displays data from our mock (since it's stuck in 2022),
    // let's grab the most recent date from transactions as our anchor point.
    let latestTimestamp = 0;
    transactions.forEach(t => {
      const ts = new Date(t.date).getTime();
      if (ts > latestTimestamp) latestTimestamp = ts;
    });
    const anchorDate = latestTimestamp > 0 ? new Date(latestTimestamp) : new Date();

    const result = [];
    let maxAmt = 1000;
    
    // Generate previous 7 days relative to the anchor
    for (let i = 6; i >= 0; i--) {
      const d = new Date(anchorDate);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const val = dateMap[iso] || 0;
      if (val > maxAmt) maxAmt = val;
      
      result.push({ day: dayName, value: val, iso });
    }

    // Dynamic ceiling for Y-axis (round to next suitable interval)
    // Here we jump by 10k but we can jump by more if it is huge
    let ceilingInterval = 10000;
    if (maxAmt > 50000) ceilingInterval = 20000;
    if (maxAmt > 100000) ceilingInterval = 50000;
      
    const ceiling = Math.ceil(maxAmt / ceilingInterval) * ceilingInterval;

    return result.map(item => ({
      ...item,
      remainder: ceiling - item.value,
      ceiling
    }));
  }, [transactions]);

  // Derived properties for axes
  const maxVal = chartData.length > 0 ? chartData[0].ceiling : 40000;
  
  // Calculate percentage increase (safely handling 0 values)
  let pctChangeNum = 0;
  let isPositive = true;
  
  const activeDays = chartData.filter(d => d.value > 0);
  
  if (activeDays.length >= 2) {
    // Compare earliest non-zero day to latest non-zero day
    const earliest = activeDays[0].value;
    const latest   = activeDays[activeDays.length - 1].value;
    pctChangeNum = ((latest - earliest) / earliest) * 100;
    isPositive = pctChangeNum >= 0;
  } else if (activeDays.length === 1) {
    pctChangeNum = 100;
    isPositive = true;
  } else {
    pctChangeNum = 0;
    isPositive = true; // neutral
  }
  
  const pctChange = Math.abs(pctChangeNum).toFixed(1);

  const handleMouseMove = useCallback((state) => {
    setActiveDay(state?.isTooltipActive ? state.activeLabel : null);
  }, []);

  return (
    <div className="revenue-chart">
      {/* ── Header row ─────────────────────── */}
      <div className="rev-header">
        <div className="rev-header__left">
          <h2 className="rev-title">Income in The Last Week</h2>
          <p className="rev-pct" style={{ color: isPositive ? '#5cc488' : '#e05c5c' }}>
            {isPositive ? '+' : ''} {pctChange}%
          </p>
        </div>
        <a className="rev-link" href="#" aria-label="See all time statistics">
          See statistics for all time
        </a>
      </div>

      {/* ── Chart ──────────────────────────── */}
      <div className="rev-chart-area">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={chartData}
            barSize={34}
            barCategoryGap="28%"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setActiveDay(null)}
            margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9a9a9e', fontSize: 12, fontFamily: 'var(--font-family)' }}
            />
            <YAxis
              tickFormatter={v => `${v / 1000}K`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9a9a9e', fontSize: 11, fontFamily: 'var(--font-family)' }}
              domain={[0, maxVal]}
              tickCount={5}
            />

            {/* Dotted reference line on active bar */}
            {activeDay && (
              <ReferenceLine
                x={activeDay}
                stroke="#9a9a9e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
            )}

            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              isAnimationActive={false}
            />

            {/* Stack: dark (value) on bottom */}
            <Bar
              dataKey="value"
              stackId="revenue"
              shape={<DarkCapsuleBar fill={activeFill} />}
              isAnimationActive={true}
            />
            {/* Stack: light (remainder) on top */}
            <Bar
              dataKey="remainder"
              stackId="revenue"
              shape={<LightCapsuleBar fill={remainderFill} />}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;
