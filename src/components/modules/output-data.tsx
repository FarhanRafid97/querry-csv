import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OutputData = ({ data, headers }: { data: [][]; headers: string[] }) => {
  return (
    <div>
      {data.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  {headers.map((header, idx) => (
                    <TableHead
                      key={idx}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-700 border-b"
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {row.map(
                      (
                        cell: string | number | null | undefined,
                        cellIndex: number
                      ) => (
                        <TableCell
                          key={cellIndex}
                          className="px-4 py-1.5 text-xs text-gray-900 border-b"
                        >
                          {cell !== null ? String(cell) : "NULL"}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputData;
