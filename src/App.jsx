// src/App.jsx
import { useState } from 'react';
import Table from './Components/Table';

function App() {
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
    { key: 'speed', header: 'Speed' },
    { 
      key: 'soc', 
      header: 'SOC',
      render: (row) => {
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
          </div>
        );
      }
    },
    { key: 'odometer', header: 'Odometer' },
    { key: 'dte', header: 'DTE' },
    { key: 'temperature', header: 'Temperature' }
  ];

  // Generate mock dataset
  const generateMockData = () => {
    const statuses = ['Active', 'Inactive', 'Charging', 'Maintenance', 'Fault'];
    const fleets = ['EKA Doto', 'EKA Transit', 'EKA Urban', 'EKA Cargo'];
    const drivers = ['Sudhir Mehta', 'Rahul Sharma', 'Amit Kumar', 'Rajiv Singh'];

    return Array.from({ length: 500 }, (_, i) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      return {
        id: i + 1,
        vrn: `HR24SE${3600 + i}`,
        type: '12M',
        status: status,
        driver: drivers[i % drivers.length],
        fleet: fleets[i % fleets.length],
        speed: `${status === 'Active' ? 200 : 0} km/h`,
        soc: `${Math.floor(Math.random() * (100 - 10 + 1) + 10)}%`,
        odometer: `${10000 + Math.floor(Math.random() * 5000)} km`,
        dte: `${20 + Math.floor(Math.random() * 80)} km`,
        temperature: `2026 °C` // Standardized to match screenshot
      };
    });
  };

  const tableData = generateMockData();

  const tabs = [
    { label: 'All', count: 1200 },
    { label: 'Active', count: 1000 },
    { label: 'Inactive', count: 200 }
  ];

  return (
    <div style={{ height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <section style={{ height: '900px', width: '100%', maxWidth: '1833px', margin: '0 auto' }}>
        <Table
          columns={tableColumns}
          data={tableData}
          tabs={tabs}
          defaultTab="ALL"
        />
      </section>
    </div>
  );
}

export default App;