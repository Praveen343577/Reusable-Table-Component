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
    { key: 'driver', header: 'Driver' },
    { key: 'fleet', header: 'Fleet' },
    { key: 'speed', header: 'Speed' },
    { key: 'soc', header: 'SOC' },
    { key: 'odometer', header: 'Odometer' },
    { key: 'dte', header: 'DTE' },
    { key: 'temperature', header: 'Temperature' }
  ];

  // Generate mock dataset
  const generateMockData = () => {
    const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Charging', 'Maintenance', 'Fault'];
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
        speed: `${status === 'Active' ? 200 : 0} kmhp`,
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