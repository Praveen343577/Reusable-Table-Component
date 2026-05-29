// src/App.jsx
import { useState } from 'react';
import Table from './Components/Table/Table';
import { useWebSocket } from './hooks/useWebSocket';
import { getDelta } from './utils/getDelta';
import DeltaPill from './Components/Table/Body/DeltaPill';

function App() {
  const { liveData, prevData } = useWebSocket();

  const tableColumns = [
    { key: 'vrn', header: 'VRN/Chassis no.', width: '9rem' },
    { key: 'type', header: 'Vehicle Type', width: '7rem' },
    { key: 'status', header: 'Status', width: '8rem',
      render: (row) => (
        <span className={`status-chip status-${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      )
    },
    { key: 'driver', header: 'Driver', width: '12rem',
      render: (row) => {
        const initials = row.driver.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        return (
          <div className="driver-wrapper">
            <div className="driver-avatar">
              {initials}
            </div>
            <span>{row.driver}</span>
          </div>
        );
      }
    },
    { key: 'fleet', header: 'Fleet', width: '7rem' },
    { key: 'speed', header: 'Speed', width: '9rem',
      render: (row, prevRow) => {
        const delta = getDelta(row.speed, prevRow?.speed);
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{row.speed}</span>
            <DeltaPill delta={delta} unit=" km/h" />
          </div>
        );
      }
    },
    { key: 'soc', header: 'SOC', width: '10rem',
      render: (row, prevRow) => {
        const val = parseInt(row.soc, 10);
        let color = '#34c759'; // Green
        if (val < 20) color = '#ff2d55'; // Red
        else if (val < 40) color = '#ff9500'; // Orange
        else if (val < 60) color = '#ffcc00'; // Yellow

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="4"
              />
              <path
                strokeDasharray={`${val}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <span>{row.soc}</span>
            <DeltaPill delta={getDelta(row.soc, prevRow?.soc)} unit="%" />
          </div>
        );
      }
    },
    { key: 'odometer', header: 'Odometer', width: '7rem' },
    { key: 'dte', header: 'DTE', width: '6rem' },
    { key: 'temperature', header: 'Temperature', width: '11rem',
      render: (row, prevRow) => {
        const delta = getDelta(row.temperature, prevRow?.temperature);
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{row.temperature}</span>
            <DeltaPill delta={delta} unit=" °C" />
          </div>
        );
      }
    }
  ];

  const tabs = [
    { label: 'All', count: 1200 },
    { label: 'Active', count: 1000 },
    { label: 'Inactive', count: 200 }
  ];

  // Feature 2 & 3: Filter configuration
  const filterConfig = {
    speed: {
      type: 'range',
      valueExtractor: (val) => parseInt(val),
      ranges: [
        { label: '0 km/h', min: 0, max: 0 },
        { label: '1–25 km/h', min: 1, max: 25 },
        { label: '26–50 km/h', min: 26, max: 50 },
        { label: '>50 km/h', min: 51, max: Infinity },
      ],
      searchable: false,
    },
    status: {
      type: 'exact',
      searchable: true,
    },
    fleet: {
      type: 'exact',
      searchable: false,
    },
    driver: {
      type: 'exact',
      searchable: true,
    },
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', padding: '1rem', boxSizing: 'border-box' }}>

      <section style={{ height: '90vh', minHeight: '30rem', width: '100%', maxWidth: '115rem', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        <Table
          columns={tableColumns}
          data={liveData}
          prevData={prevData}
          tabs={tabs}
          defaultTab="ALL"
          showTabs={true}
          title="Vehicle Status"
          subtitle="Real-time fleet monitoring"
          // Feature 4: Toolbar button visibility
          showSearch={true}
          showFilter={true}
          showColumnToggle={true}
          showExport={true}
          // Feature 6: Row selection
          showRowSelection={true}
          // Feature 1: Only these columns appear in the filter dropdown
          filterableColumns={['status', 'fleet', 'speed', 'driver']}
          // Feature 2 & 3: Range filters + search toggle
          filterConfig={filterConfig}
        />
      </section>
    </div>
  );
}

export default App;
