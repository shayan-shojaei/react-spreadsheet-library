import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { createRangeArray } from '../../utils';
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
  onChange?: (newData: CellData, rowIndex: number, columnIndex: number) => void;
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

  const [selectedColumn, setSelectedColumn] = useState<number[]>();
  const [selection, setSelection] = useState<CellPosition[]>([]);
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const [highlightedCell, setHighlightedCell] = useState<CellPosition | null>(
    null
  );

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selection);
    }
  }, [onSelectionChange, selection]);

  useEffect(() => {
    setEditingCell(null);
  }, [highlightedCell]);

  const handleCellClick = (position: CellPosition) => {
    setSelectedColumn([]);
    setSelection([position]);
    setHighlightedCell(position);
  };
  const handleCellDoubleClick = (position: CellPosition) => {
    setSelectedColumn([]);
    setHighlightedCell(position);
    setEditingCell(position);
  };

  const handleColumnClick = (column: number) => {
    setEditingCell(null);
    setHighlightedCell(null);
    if (column === 0) return;

    setSelectedColumn([column]);

    setSelection(
      createRangeArray(rows).map((rowIndex) => ({
        row: rowIndex + 1,
        column: column
      }))
    );
  };

  const handleRowClick = (row: number) => {
    setSelectedColumn([]);
    setEditingCell(null);
    setHighlightedCell(null);
    setSelection(
      createRangeArray(columns + 1).map((column) => ({
        row,
        column
      }))
    );
  };

  const handleValueChange = (
    newData: CellData,
    rowIndex: number,
    columnIndex: number
  ) => {
    if (onChange === undefined && setState === undefined) return;

    if (onChange !== undefined) {
      // dispatch events
      onChange(newData, rowIndex, columnIndex);
    } else {
      // manipulate state
      setState((previousData) => {
        previousData[rowIndex][columnIndex] = newData;
        return [...previousData];
      });
    }
  };

  const getTabIndex = (position: CellPosition): number =>
    columns * (position.row + 1) + position.column;

  return (
    <div
      className={cn({
        'spreadsheet--container': true,
        [className]: !!className
      })}
      style={gridStyle}
    >
      <ColumnHeads
        selectedColumns={selectedColumn}
        totalColumns={columns}
        onClick={handleColumnClick}
      />
      {createRangeArray(rows).map((rowIndex) =>
        createRangeArray(columns + 1).map((columnIndex) => {
          // add one to the rowIndex to account for the column heads
          const position: CellPosition = {
            row: rowIndex + 1,
            column: columnIndex
          };

          const cellSelected = useMemo(() => {
            for (let selected of selection) {
              if (
                selected.row === position.row &&
                selected.column === position.column
              )
                return true;
            }
            return false;
          }, [position, selection]);

          if (columnIndex === 0) {
            // render row index
            return (
              <RowIndexCell
                key={`row--${position.row}`}
                rowIndex={position.row}
                tabIndex={getTabIndex(position)}
                onClick={handleRowClick}
                selected={cellSelected}
              />
            );
          } else {
            // render actual cells

            const cellHighlighted =
              highlightedCell !== null &&
              highlightedCell.row === position.row &&
              highlightedCell.column === position.column;

            const cellEditing =
              editingCell !== null &&
              editingCell.row === position.row &&
              editingCell.column === position.column;

            const onValueChange = useCallback(
              (newData) =>
                handleValueChange(newData, rowIndex, columnIndex - 1),
              [rowIndex, columnIndex]
            );
            return (
              <Cell
                key={`cell--${position.row}:${position.column}`}
                data={data[rowIndex][columnIndex - 1]}
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
