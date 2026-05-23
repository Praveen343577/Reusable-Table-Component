import './Toolbar.css';

const Toolbar = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <div className="ct-toolbar">
      {tabs.length > 0 && (
        <div className="ct-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={`ct-tab ${activeTab === tab.label ? 'active' : ''}`}
              onClick={() => onTabChange(tab.label)}
            >
              {tab.label} {tab.count !== undefined && <span className="ct-tab-badge">{tab.count}</span>}
            </button>
          ))}
        </div>
      )}
      <div className="ct-toolbar-actions">
        {children}
      </div>
    </div>
  );
};

export default Toolbar;
