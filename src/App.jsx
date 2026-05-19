import { useState } from 'react';
import Button from './Components/common/Button';
import DropdownSelect from './Components/common/DropdownSelect';
import Table from './Components/common/Table';

function App() {
  const [dropdownValue, setDropdownValue] = useState([]);

  const tableColumns = [
    { key: 'id', header: 'ID', width: '80px' },
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status' }
  ];

  const tableData = [
    { id: 1, name: 'Test Object Alpha', status: 'Active' },
    { id: 2, name: 'Test Object Beta', status: 'Inactive' },
    { id: 3, name: 'Test Object Gamma', status: 'Active' }
  ];

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Component Testing Environment</h1>
        <div style={{ width: '150px' }}>
            <Button onClick={toggleDarkMode} variant="secondary">Toggle Dark Mode</Button>
        </div>
      </header>

      <section>
        <h2>1. Button</h2>
        <div style={{ display: 'flex', gap: '1rem', width: '400px' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="success">Success</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      <section>
        <h2>2. DropdownSelect</h2>
        <div style={{ width: '300px' }}>
          <DropdownSelect
            options={[
              { label: 'Engineering', value: 'eng' },
              { label: 'Design', value: 'des' },
              { label: 'Product', value: 'prod' }
            ]}
            value={dropdownValue}
            onChange={setDropdownValue}
            isMulti={true}
            placeholder="Select departments..."
          />
        </div>
      </section>

      <section style={{ height: '500px' }}>
        <h2>3. Table</h2>
        <Table
          columns={tableColumns}
          data={tableData}
          enableSearch={true}
          enableSorting={true}
          enablePagination={true}
          enableSelection={true}
          enableColumnToggle={true}
        />
      </section>
    </div>
  );
}

export default App;