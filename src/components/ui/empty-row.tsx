import { TableCell, TableRow } from './table';

const EmptyRow = ({
  colSpan,
  label = 'No data to display',
}: {
  colSpan: number;
  label?: string;
}) => (
  <TableRow>
    <TableCell
      colSpan={colSpan}
      className="text-center text-xs text-muted-foreground py-8"
    >
      {label}
    </TableCell>
  </TableRow>
);

export default EmptyRow;
