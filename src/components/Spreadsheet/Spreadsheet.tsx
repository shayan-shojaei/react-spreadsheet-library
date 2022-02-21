import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { arePositionsEqual, createRangeArray } from '../../utils';
import { CellData, Data, CellPosition } from '../../utils/data.types';
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

  const gridStyle = useMemo(
    // 36px is to create a square block for the index of the row, and the rest of the space is equally divided for each column
    () => ({ gridTemplateColumns: `36px repeat(${columns}, 1fr)`, ...style }),
    [columns, style]
  );

  const [selectedColumns, setSelectedColumns] = useState<number[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selection, setSelection] = useState<CellPosition[]>([]);
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const [highlightedCell, setHighlightedCell] = useState<CellPosition | null>(
    null
  );

  useEffect(() => {
    if (onSelectionChange !== undefined) {
      onSelectionChange(selection);
    }
  }, [onSelectionChange, selection]);

  useEffect(() => {
    setEditingCell(null);
  }, [highlightedCell]);

  const handleCellClick = (position: CellPosition) => {
    setSelectedColumns([]);
    setSelection([position]);
    setHighlightedCell(position);
  };
  const handleCellDoubleClick = (position: CellPosition) => {
    setSelectedColumns([]);
    setHighlightedCell(position);
    setEditingCell(position);
  };

  const handleColumnClick = (column: number) => {
    setEditingCell(null);
    setHighlightedCell(null);
    if (column === -1) return;

    setSelectedColumns([column]);

    setSelection(
      createRangeArray(rows).map((rowIndex) => ({
        row: rowIndex,
        column
      }))
    );
  };

  const handleRowClick = (row: number) => {
    setSelectedColumns([]);
    setSelectedRows([row]);
    setEditingCell(null);
    setHighlightedCell(null);
    setSelection(
      createRangeArray(columns + 1).map((column) => ({
        row,
        column
      }))
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

  const getTabIndex = (position: CellPosition): number =>
    (position.row + 1) * (columns + 1) + position.column + 1;

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
      {createRangeArray(rows).map((rowIndex) =>
        createRangeArray(columns + 1).map((columnIndex) => {
          // add one to the rowIndex to account for the column heads
          const position: CellPosition = useMemo(
            () => ({
              row: rowIndex,
              column: columnIndex - 1
            }),
            [rowIndex, columnIndex]
          );

          if (position.column === -1) {
            // render row index
            return (
              <RowIndexCell
                key={`row--${position.row}`}
                rowIndex={position.row}
                tabIndex={getTabIndex(position)}
                onClick={handleRowClick}
                selected={selectedRows.includes(rowIndex)}
              />
            );
          } else {
            // render actual cells

            const cellSelected = useMemo(() => {
              for (let selected of selection) {
                if (arePositionsEqual(selected, position)) {
                  return true;
                }
              }
              return false;
            }, [selection, position]);

            const cellHighlighted =
              highlightedCell !== null && highlightedCell === position;

            const cellEditing =
              editingCell !== null && editingCell === position;

            const onValueChange = useCallback(
              (newData) => handleValueChange(newData, position),
              [position]
            );
            return (
              <Cell
                key={`cell--${position.row}:${position.column}`}
                data={data[rowIndex][columnIndex]}
                style={cellStyle}
                className={cellClassName}
                onChange={onValueChange}
                tabIndex={getTabIndex(position)}
                selected={cellSelected}
                onClick={() => handleCellClick(position)}
                onDoubleClick={() => handleCellDoubleClick(position)}
                highlighted={cellHighlighted}
                editing={cellEditing}
              />
            );
          }
        })
      )}
    </div>
  );
}
