import Header from '../Header/Header';
import SummaryCards from '../SummaryCards/SummaryCards';
import RevenueChart from '../RevenueChart/RevenueChart';
import LastOrders from '../LastOrders/LastOrders';
import './MainContent.css';

function MainContent() {
  return (
    <main className="main-content">
      <Header />
      <SummaryCards />
      <RevenueChart />
      <LastOrders />
    </main>
  );
}

export default MainContent;
