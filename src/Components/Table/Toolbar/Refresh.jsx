import { RotateCcw } from 'lucide-react';

const Refresh = ({ onRefresh }) => {
  return (
    <button className="ct-btn" onClick={onRefresh} title="Reset all filters, sort, and search">
      <RotateCcw size={16} />
    </button>
  );
};

export default Refresh;
