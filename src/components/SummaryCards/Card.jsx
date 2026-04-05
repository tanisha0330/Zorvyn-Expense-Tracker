import './Card.css';

// Inline SVG wave — minor variation added via amplitude prop
function WaveSVG({ color }) {
  return (
    <svg
      className="card-wave"
      viewBox="0 0 260 60"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 40 C40 20, 80 55, 130 35 C180 15, 220 50, 260 30 L260 60 L0 60 Z"
        fill={color}
        opacity="0.35"
      />
      <path
        d="M0 50 C50 30, 100 58, 150 42 C200 26, 230 55, 260 45 L260 60 L0 60 Z"
        fill={color}
        opacity="0.2"
      />
    </svg>
  );
}

/**
 * Reusable Card component.
 *
 * Props:
 *  - bg         {string}  Card background color
 *  - waveColor  {string}  Wave SVG fill tint (usually same hue, darker)
 *  - icon       {string}  Short text / symbol icon shown top-left
 *  - label      {string}  Card label (e.g. "Balance")
 *  - badge      {string}  Optional badge text (e.g. "+17%")
 *  - value      {string}  Main value (e.g. "$56,874")
 *  - children   {node}    Custom slot for Upgrade-style content
 *  - showWave   {boolean} Whether to render the wave graphic
 */
function Card({ bg, waveColor, icon, label, badge, value, children, showWave = true }) {
  return (
    <div className="summary-card" style={{ background: bg }}>
      {/* Top row: icon + label + badge */}
      {(icon || label || badge) && (
        <div className="card-top-row">
          {icon && <span className="card-icon">{icon}</span>}
          {label && <span className="card-label">{label}</span>}
          {badge && <span className="card-badge">{badge}</span>}
        </div>
      )}

      {/* Main value */}
      {value && <p className="card-value">{value}</p>}

      {/* Custom slot (Upgrade card content) */}
      {children && <div className="card-body">{children}</div>}

      {/* Decorative wave */}
      {showWave && waveColor && <WaveSVG color={waveColor} />}
    </div>
  );
}

export default Card;
