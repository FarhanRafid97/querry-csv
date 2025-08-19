const OutputData = ({
  data,

  headers,
}: {
  data: [][];

  headers: string[];
}) => {
  return (
    <div>
      {data.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold p-4 border-b">
            CSV Data Preview (First 10 rows)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {row.map(
                      (
                        cell: string | number | null | undefined,
                        cellIndex: number
                      ) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-2 text-sm text-gray-900 border-b"
                        >
                          {cell !== null ? String(cell) : "NULL"}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputData;
