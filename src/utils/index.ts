import { CellPosition, SelectionRange } from './data.types';

export const createRangeArray = (max: number, min: number = 0) =>
  Array.from(Array(max - min).keys()).map((i) => i + min);

const CHAR_CODE_A = 65;
export const getAlphabetCharAtIndex = (index: number): string => {
  return String.fromCharCode(CHAR_CODE_A + (index % 26));
};

const NUMBER_REGEX = new RegExp(/^(-|\+)?((\d+)\.?(\d+)?|(\d+)?\.?(\d+))$/);
export const isValidNumber = (text: string): boolean => {
  return NUMBER_REGEX.test(text);
};

export const arePositionsEqual = (a: CellPosition, b: CellPosition): boolean =>
  a.row === b.row && a.column === b.column;

export const isInRange = (
  range: SelectionRange,
  position: CellPosition
): boolean =>
  position.row >= range.fromRow &&
  position.row < range.toRow &&
  position.column >= range.fromColumn &&
  position.column < range.toColumn;

export const createSelectionRangeFromPosition = (
  position: CellPosition
): SelectionRange => ({
  fromRow: position.row,
  toRow: position.row + 1,
  fromColumn: position.column,
  toColumn: position.column + 1
});

export const createSelectionRangeFromColumn = (
  column: number,
  totalRows: number
): SelectionRange => ({
  fromRow: 0,
  toRow: totalRows,
  fromColumn: column,
  toColumn: column + 1
});

export const createSelectionRangeFromRow = (
  row: number,
  totalColumns: number
): SelectionRange => ({
  fromRow: row,
  toRow: row + 1,
  fromColumn: 0,
  toColumn: totalColumns
});

export const rangesToPositions = (
  ...ranges: SelectionRange[]
): CellPosition[] => {
  let positions: Record<string, CellPosition> = {};

  for (let range of ranges) {
    const [minCol, maxCol] = [
      Math.min(range.fromColumn, range.toColumn),
      Math.max(range.fromColumn, range.toColumn)
    ];
    const [minRow, maxRow] = [
      Math.min(range.fromRow, range.toRow),
      Math.max(range.fromRow, range.toRow)
    ];
    createRangeArray(maxRow, minRow)
      .flatMap((row) =>
        createRangeArray(maxCol, minCol).map((column) => ({ row, column }))
      )
      .forEach((position) => {
        positions[`${position.row}:${position.column}`] = position;
      });
  }

  return Object.values(positions);
};
