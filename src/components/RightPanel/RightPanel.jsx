import MonthlyProfits from './MonthlyProfits';
import MonthlyComparison from './MonthlyComparison';
import RecentSales from './RecentSales';
import './RightPanel.css';

function RightPanel() {
  return (
    <aside className="right-panel">
      <MonthlyProfits />
      <MonthlyComparison />
      <RecentSales />
    </aside>
  );
}

export default RightPanel;
