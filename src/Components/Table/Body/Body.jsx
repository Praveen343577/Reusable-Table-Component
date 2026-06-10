import { useVirtualizer } from '@tanstack/react-virtual';
import tableStyles from "../Table.module.css";

const styles = { ...tableStyles, ...(typeof localStyles !== "undefined" ? localStyles : {}) };
const BodyRow = ({ row, visibleCols, selectedIds, onToggleSelectRow, prevRow, showRowSelection }) => {
  return (
    <tr style={style} className={styles["ct-table-row"]}>
      {showRowSelection && (
        <td style={{ width: '3rem', flexShrink: 0 }}>
          <input
            type="checkbox"
            className={styles["ct-checkbox"]}
            checked={selectedIds.includes(row.id)}
            onChange={() => onToggleSelectRow(row.id)}
          />
        </td>
      )}
      {visibleCols.map((col) => (
        <td key={`${row.id}-${col.key}`} style={{ width: col.width || 'auto', flex: col.width ? '0 0 auto' : '1 1 0px' }}>
          {col.render ? col.render(row, prevRow) : row[col.key]}
        </td>
      ))}
    </tr>
  );
};

const Body = ({ currentData, visibleCols, selectedIds, onToggleSelectRow, prevData, showRowSelection = true, tableWrapperRef }) => {
  const rowVirtualizer = useVirtualizer({
    count: currentData.length,
    getScrollElement: () => tableWrapperRef.current,
    estimateSize: () => 48, // 48px derives from your 3rem height in Table.css
    overscan: 5, // Buffer rows
  });

  return (
    <tbody style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative', display: 'block' }}>
      {currentData.length === 0 ? (
        <tr>
          <td colSpan={visibleCols.length + (showRowSelection ? 1 : 0)} style={{ textAlign: 'center', padding: '40px', width: '100%', display: 'block' }}>
            No records found.
          </td>
        </tr>
      ) : (
        rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = currentData[virtualRow.index];
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
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                display: 'flex',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            />
          );
        })
      )}
    </tbody>
  );
};

export default Body;

