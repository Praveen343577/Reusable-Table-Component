// src/App.jsx
import { useState } from 'react';
import Table from './Components/Table/Table';
import { useWebSocket } from './hooks/useWebSocket';
import { getDelta } from './utils/getDelta';
import DeltaPill from './Components/Table/Body/DeltaPill';

function App() {
  const { liveData, prevData, isConnected, lastUpdate } = useWebSocket();

  const tableColumns = [
    { key: 'vrn', header: 'VRN/Chassis no.' },
    { key: 'type', header: 'Vehicle Type' },
    { 
      key: 'status', 
      header: 'Status',
      render: (row) => (
        <span className={`status-chip status-${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      )
    },
    { 
      key: 'driver', 
      header: 'Driver',
      render: (row) => {
        const initials = row.driver.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '27px',
              height: '27px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 146, 175, 0.1)',
              border: "1.5px solid rgba(0, 146, 175, 0.2)",
              color: '#0093af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '400'
            }}>
              {initials}
            </div>
            <span>{row.driver}</span>
          </div>
        );
      }
    },
    { key: 'fleet', header: 'Fleet' },
    { 
      key: 'speed', 
      header: 'Speed',
      render: (row, prevRow) => {
        const delta = prevRow ? getDelta(row.speed, prevRow.speed) : null;
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{row.speed}</span>
            <DeltaPill delta={delta} unit=" km/h" />
          </div>
        );
      }
    },
    { 
      key: 'soc', 
      header: 'SOC',
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
            {prevRow && <DeltaPill delta={getDelta(row.soc, prevRow.soc)} unit="%" />}
          </div>
        );
      }
    },
    { key: 'odometer', header: 'Odometer' },
    { key: 'dte', header: 'DTE' },
    { 
      key: 'temperature', 
      header: 'Temperature',
      render: (row, prevRow) => {
        const delta = prevRow ? getDelta(row.temperature, prevRow.temperature) : null;
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

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      
      {/* Live Indicator */}
      <div style={{ position: 'absolute', top: '24px', right: '40px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.8)', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: isConnected ? '#15803d' : '#b91c1c' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? '#22c55e' : '#ef4444', boxShadow: isConnected ? '0 0 8px #22c55e' : 'none' }} />
          {isConnected ? 'LIVE' : 'CONNECTING...'}
        </div>
        {lastUpdate && (
          <div style={{ fontSize: '12px', color: '#64748b', borderLeft: '1px solid #e2e8f0', paddingLeft: '12px' }}>
            Updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      <section style={{ height: '900px', width: '100%', maxWidth: '1833px', margin: '0 auto' }}>
        <Table
          columns={tableColumns}
          data={liveData}
          prevData={prevData}
          tabs={tabs}
          defaultTab="ALL"
        />
      </section>
    </div>
  );
}

export default App;