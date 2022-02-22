import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  arePositionsEqual,
  createRangeArray,
  createSelectionRangeFromColumn,
  createSelectionRangeFromPosition,
  createSelectionRangeFromRow,
  isInRange,
  rangesToPositions
} from '../../utils';
import {
  CellData,
  Data,
  CellPosition,
  ModifierKey,
  SelectionRange
} from '../../utils/data.types';
import Cell from '../Cell/Cell';
import './Spreadsheet.scss';
import cn from 'classnames';
import RowIndexCell from '../RowIndexCell/RowIndexCell';
import ColumnHeads from '../ColumnHeads/ColumnHeads';

/** Spreadsheet Props */
interface IProps {
  /** 2D Array Of Cell Data */
  data: Data;
  /** Spreadsheet classname */
  className?: any;
  /** Cell classname */
  cellClassName?: any;
  /** Spreadsheet classname */
  style?: CSSProperties;
  /** Cell classname */
  cellStyle?: CSSProperties;
}

/** Spreadsheet Props Controlled */
interface IDispatchProps extends IProps {
  /** Cell Data changed */
  onChange?: (newData: CellData, position: CellPosition) => void;
  onSelectionChange?: (selection: CellPosition[]) => void;
}

/** Spreadsheet Props State */
interface IStateProps extends IProps {
  /** React setState dispatcher */
  setState?: React.Dispatch<React.SetStateAction<Data>>;
}

type Props = IDispatchProps | IStateProps;

/**
 * Spreadsheet Component
 *
 * @param {Data} data - Array of objects.
 * @param className - CSS className (gets appended to the components classlist.)
 * @param style - CSS styles (gets appended to the components styles.)
 * @param cellClassName - CSS className (gets appended to the components cells classlist.)
 * @param cellStyle - CSS styles (gets appended to the components cells styles.)
 * @param setState - a react state dispatcher to handle data manipulations.
 * @param onChange - fires when a cell's value is changed, returning a new cell object with updated values and cells coordinates.
 * @param onSelectionChange - fires when the selection changes, returning an array containing the positions of the selections cells.
 */
export default function Spreadsheet({
  data,
  className,
  cellClassName,
  style,
  cellStyle,
  ...props
}: Props) {
  const { onChange, onSelectionChange } = props as IDispatchProps;
  const { setState } = props as IStateProps;

  const [rows, columns] = useMemo(
    () => [data.length, Math.max(...data.map((row) => row.length))],
    [data]
  );

  const cellsMatrix: CellPosition[] = useMemo(() => {
    return createRangeArray(rows).flatMap((rowIndex) =>
      createRangeArray(columns + 1).map((columnIndex) => ({
        row: rowIndex,
        column: columnIndex - 1
      }))
    );
  }, [rows, columns]);

  const gridStyle = useMemo(
    // 36px is to create a square block for the index of the row, and the rest of the space is equally divided for each column
    () => {
      return { gridTemplateColumns: `36px repeat(${columns}, 1fr)`, ...style };
    },
    [columns, style]
  );

  const [selectionRanges, setSelectionRanges] = useState<SelectionRange[]>([]);
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const [highlightedCell, setHighlightedCell] = useState<CellPosition | null>(
    null
  );
  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  useEffect(() => {
    if (onSelectionChange !== undefined) {
      const selection = rangesToPositions(...selectionRanges);
      onSelectionChange(selection);
    }
  }, [onSelectionChange, selectionRanges]);

  useEffect(() => {
    setEditingCell(null);
  }, [highlightedCell]);

  const handleCellClick = (position: CellPosition) => {
    setSelectedColumns([]);
    setSelectionRanges([createSelectionRangeFromPosition(position)]);
    setHighlightedCell(position);
  };
  const handleCellDoubleClick = (position: CellPosition) => {
    setSelectedColumns([]);
    setHighlightedCell(position);
    setEditingCell(position);
  };

  const handleColumnClick = (newColumn: number, modifier: ModifierKey) => {
    setEditingCell(null);
    setHighlightedCell(null);
    setSelectedRows([]);

    if (newColumn === -1) return;

    // deselect the column was already selected
    if (selectedColumns.length === 1 && selectedColumns[0] === newColumn) {
      setSelectedColumns([]);
      setSelectionRanges([]);
      return;
    }

    let newColumns: number[];
    if (modifier === 'shift') {
      const min = Math.min(selectedColumns[0], newColumn);
      const max = Math.max(selectedColumns[0], newColumn);
      newColumns = createRangeArray(max + 1, min);
    } else {
      newColumns = [newColumn];
    }

    setSelectedColumns(newColumns);

    setSelectionRanges(
      newColumns.map((column) => createSelectionRangeFromColumn(column, rows))
    );
  };

  const handleRowClick = (newRow: number, modifier: ModifierKey) => {
    setEditingCell(null);
    setHighlightedCell(null);
    setSelectedColumns([]);

    // deselect the row was already selected
    if (selectedRows.length === 1 && selectedRows[0] === newRow) {
      setSelectedRows([]);
      setSelectionRanges([]);
      return;
    }

    let newRows: number[];
    if (modifier === 'shift') {
      const lastSelection = selectedRows[0];
      const min = Math.min(lastSelection, newRow);
      const max = Math.max(lastSelection, newRow);
      newRows = [lastSelection, ...createRangeArray(max + 1, min)];
    } else {
      newRows = [newRow];
    }
    setSelectedRows(newRows);

    setSelectionRanges(
      newRows.map((row) => createSelectionRangeFromRow(row, columns))
    );
  };

  const handleValueChange = (newData: CellData, position: CellPosition) => {
    if (onChange === undefined && setState === undefined) return;

    if (onChange !== undefined) {
      // dispatch events
      onChange(newData, position);
    } else {
      // manipulate state
      setState((previousData) => {
        previousData[position.row][position.column] = newData;
        return [...previousData];
      });
    }
  };

  return (
    <div
      className={cn({
        'spreadsheet--container': true,
        [className]: !!className
      })}
      style={gridStyle}
    >
      <ColumnHeads
        selectedColumns={selectedColumns}
        totalColumns={columns}
        onClick={handleColumnClick}
      />
      {cellsMatrix.map((position) => {
        if (position.column === -1) {
          // render row index
          return (
            <RowIndexCell
              key={`row--${position.row}`}
              rowIndex={position.row}
              onClick={handleRowClick}
              selected={selectedRows.includes(position.row)}
            />
          );
        } else {
          // render actual cells

          const cellSelected = useMemo(() => {
            for (let range of selectionRanges) {
              if (isInRange(range, position)) {
                return true;
              }
            }
            return false;
          }, [selectionRanges, position]);

          const cellHighlighted =
            highlightedCell !== null &&
            arePositionsEqual(highlightedCell, position);

          const cellEditing =
            editingCell !== null && arePositionsEqual(editingCell, position);

          const onValueChange = useCallback(
            (newData) => handleValueChange(newData, position),
            [position]
          );
          const onDoubleClick = useCallback(
            () => handleCellDoubleClick(position),
            [position]
          );
          const onClick = useCallback(
            () => handleCellClick(position),
            [position]
          );
          return (
            <Cell
              key={`cell--${position.row}:${position.column}`}
              data={data[position.row][position.column]}
              style={cellStyle}
              className={cellClassName}
              onChange={onValueChange}
              selected={cellSelected}
              onClick={onClick}
              onDoubleClick={onDoubleClick}
              highlighted={cellHighlighted}
              editing={cellEditing}
            />
          );
        }
      })}
    </div>
  );
}
