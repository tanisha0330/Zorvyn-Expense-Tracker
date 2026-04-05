import { useDashboard } from '../../context/DashboardContext';
import Card from './Card';
import './SummaryCards.css';

function SummaryCards() {
  const { totalIncome, totalExpense } = useDashboard();
  const balance = totalIncome - totalExpense;

  const cards = [
    {
      id: 'balance',
      bg: '#d8e8c8',
      waveColor: '#8ab87a',
      icon: '$',
      label: 'Total Balance',
      badge: '', // Can compute % change if we want, or leave blank
      value: `$${balance.toLocaleString()}`,
    },
    {
      id: 'income',
      bg: '#f0e0a0',
      waveColor: '#c8a830',
      icon: '↗',
      label: 'Total Income',
      badge: '',
      value: `$${totalIncome.toLocaleString()}`,
    },
    {
      id: 'expenses',
      bg: '#fde8e8',
      waveColor: '#e0a0a0',
      icon: '↘',
      label: 'Total Expenses',
      badge: '',
      value: `$${totalExpense.toLocaleString()}`,
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map(({ id, bg, waveColor, icon, label, badge, value }) => (
        <Card
          key={id}
          bg={bg}
          waveColor={waveColor}
          icon={icon}
          label={label}
          badge={badge}
          value={value}
          showWave={true}
        />
      ))}
    </div>
  );
}

export default SummaryCards;
