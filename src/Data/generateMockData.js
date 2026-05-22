// generateMockData.js
import fs from 'fs';

const statuses = ['Active', 'Inactive', 'Charging', 'Maintenance', 'Fault'];
const fleets = ['EKA Doto', 'EKA Transit', 'EKA Urban', 'EKA Cargo'];
const drivers = ['Sudhir Mehta', 'Rahul Sharma', 'Amit Kumar', 'Rajiv Singh', 'Priya Patel', 'Vikram Desai'];

const generateData = () => {
  return Array.from({ length: 200 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isMoving = status === 'Active';
    
    return {
      id: i + 1,
      vrn: `HR24SE${3600 + i}`,
      type: '12M',
      status: status,
      driver: drivers[Math.floor(Math.random() * drivers.length)],
      fleet: fleets[Math.floor(Math.random() * fleets.length)],
      speed: isMoving ? `${Math.floor(Math.random() * 60) + 20} km/h` : '0 km/h',
      soc: `${Math.floor(Math.random() * 91) + 10}%`,
      odometer: `${10000 + Math.floor(Math.random() * 40000)} km`,
      dte: `${20 + Math.floor(Math.random() * 180)} km`,
      temperature: `${Math.floor(Math.random() * 16) + 20} °C` 
    };
  });
};

fs.writeFileSync('mockTableData.json', JSON.stringify(generateData(), null, 2), 'utf-8');