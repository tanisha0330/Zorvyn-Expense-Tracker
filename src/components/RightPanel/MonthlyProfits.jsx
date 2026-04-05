import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useDashboard } from '../../context/DashboardContext';
import './MonthlyProfits.css';

const COLORS = ['#8b7fea', '#5bc9a0', '#e8c84a', '#e07a9a', '#7acbe0', '#e0a07a', '#c8a0e8'];

function MonthlyProfits() {
  const { transactions } = useDashboard();

  // 1. Calculate expenses by category
  const { chartData, highestCategory, highestAmount, totalExpenses } = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = {};
    expenses.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    let highestCat = 'None';
    let highestAmt = 0;

    const data = Object.entries(categoryMap)
      .map(([name, value], index) => {
        if (value > highestAmt) {
          highestAmt = value;
          highestCat = name;
        }
        return {
          name,
          value: Math.round((value / total) * 100) || 0,
          rawValue: value,
          color: COLORS[index % COLORS.length]
        };
      })
      .sort((a, b) => b.value - a.value);

    return { 
      chartData: data, 
      highestCategory: highestCat, 
      highestAmount: highestAmt,
      totalExpenses: total
    };
  }, [transactions]);

  return (
    <div className="monthly-profits">
      {/* Header */}
      <div className="mp-header">
        <div className="mp-header__left">
          <h3 className="mp-title">Expense Breakdown</h3>
          <p className="mp-sub">By Category (%)</p>
        </div>
        <button className="mp-options-btn" aria-label="Options">
          <span>⊞</span>
        </button>
      </div>

      <div className="mp-insight-text" style={{ fontSize: '0.72rem', color: '#6b6b72', marginBottom: '16px', lineHeight: '1.4' }}>
        Your highest spending category this month is <strong>{highestCategory}</strong> at <strong>${highestAmount.toLocaleString()}</strong>.
      </div>

      {/* Chart + Legend row */}
      <div className="mp-body">
        {/* Doughnut */}
        <div className="mp-chart-wrap">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label — positioned over chart */}
          <div className="mp-center-label">
            <span className="mp-center-label__title">Total</span>
            <span className="mp-center-label__value">${totalExpenses.toLocaleString()}</span>
          </div>
        </div>

        {/* Legend */}
        <ul className="mp-legend" role="list">
          {chartData.map((item) => (
            <li key={item.name} className="mp-legend__item">
              <span className="mp-legend__dot" style={{ background: item.color }} />
              <div className="mp-legend__text" style={{ minWidth: 0, overflow: 'hidden' }}>
                <span className="mp-legend__name" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.name}</span>
                <span className="mp-legend__pct">{item.value}%</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MonthlyProfits;
