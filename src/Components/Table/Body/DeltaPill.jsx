import './DeltaPill.css';

const DeltaPill = ({ delta, unit }) => {
  if (!delta) return null;

  const { value, direction } = delta;

  if (direction === 'none') {
    return (
      <span className="ct-delta-pill ct-delta-neutral">
        <span className="ct-delta-value">~</span>
      </span>
    );
  }

  if (direction === 'same') {
    return null;
  }

  const isUp = direction === 'up';
  let formattedValue = value;
  
  if (typeof formattedValue === 'number' && formattedValue % 1 !== 0) {
      formattedValue = formattedValue.toFixed(1);
  }

  return (
    <span className={`ct-delta-pill ${isUp ? 'ct-delta-up' : 'ct-delta-down'}`}>
      <span className="ct-delta-icon">{isUp ? '⇑' : '⇓'}</span>
      <span className="ct-delta-value">
        {isUp ? '+' : '-'}{formattedValue}{unit}
      </span>
    </span>
  );
};

export default DeltaPill;
