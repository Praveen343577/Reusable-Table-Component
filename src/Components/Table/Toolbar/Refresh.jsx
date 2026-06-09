import { RotateCcw } from 'lucide-react';

const Refresh = ({ onRefresh, localeText = {} }) => {
  return (
    <button className="ct-btn" onClick={onRefresh} title={localeText.refresh || "Reset all filters, sort, and search"}>
      <RotateCcw size={16} />
    </button>
  );
};

export default Refresh;
