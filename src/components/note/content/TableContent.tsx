
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableContentProps {
  headers: string[];
  rows: string[][];
}

export function TableContent({ headers, rows }: TableContentProps) {
  return (
    <Table className="border border-border">
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index} className="border border-border">
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex} className="border border-border">
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
