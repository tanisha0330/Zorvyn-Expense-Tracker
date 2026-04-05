import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import './MonthlyComparison.css';

function get30DayPeriods(transactions) {
  // Find anchor date (most recent transaction)
  let latestTimestamp = 0;
  transactions.forEach(t => {
    const ts = new Date(t.date).getTime();
    if (ts > latestTimestamp) latestTimestamp = ts;
  });
  
  const anchorDate = latestTimestamp > 0 ? new Date(latestTimestamp) : new Date();
  const DAY_IN_MS = 24 * 60 * 60 * 1000;
  
  const currentPeriodStart = new Date(anchorDate.getTime() - 30 * DAY_IN_MS).getTime();
  const previousPeriodStart = new Date(anchorDate.getTime() - 60 * DAY_IN_MS).getTime();

  let currentIncome = 0;
  let previousIncome = 0;

  transactions.forEach(t => {
    if (t.type === 'income') {
      const ts = new Date(t.date).getTime();
      if (ts >= currentPeriodStart && ts <= anchorDate.getTime()) {
        currentIncome += t.amount;
      } else if (ts >= previousPeriodStart && ts < currentPeriodStart) {
        previousIncome += t.amount;
      }
    }
  });

  return { currentIncome, previousIncome };
}

function MonthlyComparison() {
  const { transactions } = useDashboard();

  const { currentIncome, previousIncome } = useMemo(() => {
    return get30DayPeriods(transactions);
  }, [transactions]);

  let pctChange = 0;
  if (previousIncome > 0) {
    pctChange = ((currentIncome - previousIncome) / previousIncome) * 100;
  } else if (currentIncome > 0) {
    pctChange = 100;
  }

  const isPositive = pctChange > 0;
  const isNeutral = pctChange === 0;

  return (
    <div className="monthly-comparison">
      <div className="mc-header">
        <h3 className="mc-title">Monthly Comparison</h3>
      </div>
      
      <p className="mc-desc">
        Income over the last 30 days compared to the previous 30 days.
      </p>

      <div className="mc-stats">
        <div className="mc-stat-item">
          <span className="mc-stat-label">This 30 Days</span>
          <span className="mc-stat-value">${currentIncome.toLocaleString()}</span>
        </div>
        <div className="mc-stat-item">
          <span className="mc-stat-label">Prev 30 Days</span>
          <span className="mc-stat-value">${previousIncome.toLocaleString()}</span>
        </div>
      </div>

      <div className={`mc-badge ${isPositive ? 'mc-badge--positive' : isNeutral ? 'mc-badge--neutral' : 'mc-badge--negative'}`}>
        {isPositive && <TrendingUp size={16} strokeWidth={2.5} />}
        {!isPositive && !isNeutral && <TrendingDown size={16} strokeWidth={2.5} />}
        {isNeutral && <Minus size={16} strokeWidth={2.5} />}
        <span className="mc-badge-text">
          {isPositive ? '+' : ''}{pctChange.toFixed(1)}% vs previous period
        </span>
      </div>
    </div>
  );
}

export default MonthlyComparison;
