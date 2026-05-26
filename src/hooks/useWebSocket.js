import { useState, useEffect, useRef } from 'react';
import initialData from '../Data/mockTableData.json';

export const useWebSocket = () => {
  const [liveData, setLiveData] = useState(initialData);
  const [prevData, setPrevData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const prevDataRef = useRef(null);

  useEffect(() => {
    // Simulate connection delay
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      setLastUpdate(new Date());
    }, 1000);

    const interval = setInterval(() => {
      setLiveData((currentData) => {
        // Save current data as prev before mutating
        setPrevData(currentData);
        prevDataRef.current = currentData;

        // Pick random rows to update (e.g., 5% of active fleet)
        const updateCount = Math.floor(currentData.length * 0.7);
        const indicesToUpdate = new Set();
        while (indicesToUpdate.size < updateCount) {
          indicesToUpdate.add(Math.floor(Math.random() * currentData.length));
        }

        const newData = currentData.map((row, index) => {
          if (!indicesToUpdate.has(index)) return row;

          const updatedRow = { ...row };

          // Helper to extract number and unit
          const parseValue = (str) => {
            const match = str.match(/(-?\d+(\.\d+)?)\s*(.*)/);
            if (!match) return { num: 0, unit: '' };
            return { num: parseFloat(match[1]), unit: match[3] };
          };

          // Mutate Speed (Only if Active)
          if (row.status === 'Active') {
            const speedObj = parseValue(row.speed);
            const speedChange = Math.floor(Math.random() * 11) - 5; // -5 to +5
            let newSpeed = speedObj.num + speedChange;
            if (newSpeed < 0) newSpeed = 0;
            if (newSpeed > 80) newSpeed = 80; // max speed
            updatedRow.speed = `${newSpeed} ${speedObj.unit}`;
          }

          // Mutate SOC
          const socObj = parseValue(row.soc);
          let newSoc = socObj.num;
          if (row.status === 'Charging') {
            newSoc += Math.floor(Math.random() * 3) + 1; // +1 to +3
            if (newSoc > 100) newSoc = 100;
          } else if (row.status === 'Active') {
            newSoc -= Math.floor(Math.random() * 2) + 1; // -1 to -2
            if (newSoc < 0) newSoc = 0;
          }
          updatedRow.soc = `${newSoc}${socObj.unit}`;

          // Mutate Temperature
          const tempObj = parseValue(row.temperature);
          const tempChange = Math.floor(Math.random() * 3) - 1; // -1 to +1
          let newTemp = tempObj.num + tempChange;
          if (newTemp < 15) newTemp = 15;
          if (newTemp > 45) newTemp = 45;
          updatedRow.temperature = `${newTemp} ${tempObj.unit}`;

          return updatedRow;
        });

        setLastUpdate(new Date());
        return newData;
      });
    }, 3000); // update every 3 seconds

    return () => {
      clearTimeout(connectTimer);
      clearInterval(interval);
    };
  }, []);

  return { liveData, prevData, isConnected, lastUpdate };
};
