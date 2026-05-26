import { useEffect, useState } from 'react';
import './DeltaPill.css';

const DeltaPill = ({ delta, unit }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (delta) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 4000); // fade out after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [delta]);

  if (!delta || !visible) return null;

  const isUp = delta.direction === 'up';
  
  // Format the value based on unit.
  // For %, we just append %. For temp, append °C. For speed, append km/h.
  let formattedValue = delta.value;
  // If it's a float, fix it to 1 decimal place if it has fractional parts.
  if (formattedValue % 1 !== 0) {
      formattedValue = formattedValue.toFixed(1);
  }

  return (
    <span className={`ct-delta-pill ${isUp ? 'ct-delta-up' : 'ct-delta-down'}`}>
      <span className="ct-delta-icon">{isUp ? '▲' : '▼'}</span>
      <span className="ct-delta-value">
        {isUp ? '+' : '-'}{formattedValue}{unit}
      </span>
    </span>
  );
};

export default DeltaPill;
