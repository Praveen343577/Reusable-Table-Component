const Body = ({ currentData, visibleCols, selectedIds, onToggleSelectRow }) => {
  return (
    <tbody>
      {currentData.length === 0 ? (
        <tr>
          <td colSpan={visibleCols.length + 1} style={{ textAlign: 'center', padding: '40px' }}>
            No records found.
          </td>
        </tr>
      ) : (
        currentData.map((row) => (
          <tr key={row.id}>
            <td>
              <input
                type="checkbox"
                className="ct-checkbox"
                checked={selectedIds.includes(row.id)}
                onChange={() => onToggleSelectRow(row.id)}
              />
            </td>
            {visibleCols.map((col) => (
              <td key={`${row.id}-${col.key}`}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
};

export default Body;
