import './RecentSaleRow.css';

/**
 * Reusable row for a recent sale entry.
 *
 * Props:
 *  - initials   {string}   Avatar initials
 *  - avatarBg   {string}   Avatar background colour
 *  - name       {string}   Customer name
 *  - timeAgo    {string}   Elapsed time label
 *  - amount     {string}   Transaction amount
 */
function RecentSaleRow({ initials, avatarBg, name, timeAgo, amount }) {
  return (
    <div className="sale-row">
      <div className="sale-row__avatar" style={{ background: avatarBg }}>
        {initials}
      </div>
      <div className="sale-row__info">
        <span className="sale-row__name">{name}</span>
        <span className="sale-row__time">{timeAgo}</span>
      </div>
      <span className="sale-row__amount">{amount}</span>
    </div>
  );
}

export default RecentSaleRow;
