import RecentSaleRow from './RecentSaleRow';
import './RecentSales.css';

// ─── Mock data ────────────────────────────────────────────────────────────
const salesData = [
  { id: 1, initials: 'SS', avatarBg: '#e0a07a', name: 'Steven Summer',   timeAgo: '02 Minutes Ago', amount: '+ $52.00'   },
  { id: 2, initials: 'JM', avatarBg: '#7acbe0', name: 'Jordan Maizee',   timeAgo: '02 Minutes Ago', amount: '+ $83.00'   },
  { id: 3, initials: 'JA', avatarBg: '#a8d87a', name: 'Jessica Alba',    timeAgo: '05 Minutes Ago', amount: '+ $61.60'   },
  { id: 4, initials: 'AA', avatarBg: '#e07a9a', name: 'Anna Armas',      timeAgo: '05 Minutes Ago', amount: '+ $2351.00' },
  { id: 5, initials: 'AB', avatarBg: '#c8a0e8', name: 'Angelina Boo',    timeAgo: '10 Minutes Ago', amount: '+ $152.00'  },
  { id: 6, initials: 'AK', avatarBg: '#7a8ae0', name: 'Anastasia Koss',  timeAgo: '12 Minutes Ago', amount: '+ $542.00'  },
];

function RecentSales() {
  return (
    <div className="recent-sales">
      <div className="rs-header">
        <h3 className="rs-title">Recent Sales</h3>
        <a className="rs-link" href="#">See All</a>
      </div>

      <div className="rs-list">
        {salesData.map((sale) => (
          <RecentSaleRow
            key={sale.id}
            initials={sale.initials}
            avatarBg={sale.avatarBg}
            name={sale.name}
            timeAgo={sale.timeAgo}
            amount={sale.amount}
          />
        ))}
      </div>
    </div>
  );
}

export default RecentSales;
