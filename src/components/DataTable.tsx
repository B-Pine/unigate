import React from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T extends { id?: number | string }>({
  columns,
  data,
  loading,
  page,
  totalPages,
  onPageChange,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.key}>
                  <div style={{ height: 14, backgroundColor: "hsl(220,14%,93%)", borderRadius: 2, width: "70%" }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", color: "hsl(0,0%,50%)", padding: 20 }}>
                No data found
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={(item as any).id || idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {page && totalPages && totalPages > 1 && onPageChange && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
          <button className="action-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</button>
          <span style={{ fontSize: 13, color: "hsl(0,0%,50%)" }}>Page {page} of {totalPages}</span>
          <button className="action-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
