const BodyRow = ({ row, visibleCols, selectedIds, onToggleSelectRow, prevRow, showRowSelection }) => {
  return (
    <tr>
      {showRowSelection && (
        <td>
          <input
            type="checkbox"
            className="ct-checkbox"
            checked={selectedIds.includes(row.id)}
            onChange={() => onToggleSelectRow(row.id)}
          />
        </td>
      )}
      {visibleCols.map((col) => (
        <td key={`${row.id}-${col.key}`}>
          {col.render ? col.render(row, prevRow) : row[col.key]}
        </td>
      ))}
    </tr>
  );
};

const Body = ({ currentData, visibleCols, selectedIds, onToggleSelectRow, prevData, showRowSelection = true }) => {
  return (
    <tbody>
      {currentData.length === 0 ? (
        <tr>
          <td colSpan={visibleCols.length + (showRowSelection ? 1 : 0)} style={{ textAlign: 'center', padding: '40px' }}>
            No records found.
          </td>
        </tr>
      ) : (
        currentData.map((row) => {
          const prevRow = prevData ? prevData.find((p) => p.id === row.id) : null;
          return (
            <BodyRow
              key={row.id}
              row={row}
              prevRow={prevRow}
              visibleCols={visibleCols}
              selectedIds={selectedIds}
              onToggleSelectRow={onToggleSelectRow}
              showRowSelection={showRowSelection}
            />
          );
        })
      )}
    </tbody>
  );
};

export default Body;

