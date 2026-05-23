import { Download } from 'lucide-react';

const Export = ({ onExport }) => {
  return (
    <button className="ct-btn" onClick={onExport}>
      <Download size={16} /> Export
    </button>
  );
};

export default Export;
