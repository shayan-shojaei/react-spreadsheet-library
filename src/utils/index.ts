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

/** checks whether a cell position is within the range */
export const isInRange = (
  position: CellPosition,
  ...ranges: SelectionRange[]
): boolean => {
  for (let range of ranges) {
    if (
      position.row >= range.fromRow &&
      position.row < range.toRow &&
      position.column >= range.fromColumn &&
      position.column < range.toColumn
    ) {
      return true;
    }
  }
  return false;
};

/** checks wether selection range `a` is inside the bounds of selection range `b`  */
export const isWithinRange = (a: SelectionRange, b: SelectionRange): boolean =>
  a.fromRow >= b.fromRow &&
  a.toRow <= b.toRow &&
  a.fromColumn >= b.fromColumn &&
  a.toColumn <= b.toColumn;

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

export const createSelectionRangeBetweenPositions = (
  first: CellPosition,
  second: CellPosition
): SelectionRange => {
  const [minRow, maxRow] = [
    Math.min(first.row, second.row),
    Math.max(first.row, second.row)
  ];
  const [minColumn, maxColumn] = [
    Math.min(first.column, second.column),
    Math.max(first.column, second.column)
  ];

  return {
    fromRow: minRow,
    toRow: maxRow + 1,
    fromColumn: minColumn,
    toColumn: maxColumn + 1
  };
};

export const removeSelectionRange = (
  ranges: SelectionRange[],
  toRemove: SelectionRange
): SelectionRange[] => {
  return ranges.flatMap((range) => {
    if (isWithinRange(toRemove, range)) {
      let newRanges: SelectionRange[] = [];
      const [minOuterRow, maxOuterRow] = [
        Math.min(range.fromRow, range.toRow),
        Math.max(range.fromRow, range.toRow)
      ];
      const [minInnerRow, maxInnerRow] = [
        Math.min(toRemove.fromRow, toRemove.toRow),
        Math.max(toRemove.fromRow, toRemove.toRow)
      ];
      const [minOuterColumn, maxOuterColumn] = [
        Math.min(range.fromColumn, range.toColumn),
        Math.max(range.fromColumn, range.toColumn)
      ];
      const [minInnerColumn, maxInnerColumn] = [
        Math.min(toRemove.fromColumn, toRemove.toColumn),
        Math.max(toRemove.fromColumn, toRemove.toColumn)
      ];

      // top rect
      if (minOuterRow < minInnerRow) {
        newRanges.push({
          fromRow: minOuterRow,
          toRow: minInnerRow,
          fromColumn: minOuterColumn,
          toColumn: maxOuterColumn
        });
      }

      // bottom rect
      if (maxOuterRow > maxInnerRow) {
        newRanges.push({
          fromRow: maxInnerRow,
          toRow: maxOuterRow,
          fromColumn: minOuterColumn,
          toColumn: maxOuterColumn
        });
      }

      // left rect
      if (minOuterColumn < minInnerColumn) {
        newRanges.push({
          fromRow: minInnerRow,
          toRow: maxInnerRow,
          fromColumn: minOuterColumn,
          toColumn: minInnerColumn
        });
      }

      // right rect
      if (maxOuterColumn > maxInnerColumn) {
        newRanges.push({
          fromRow: minInnerRow,
          toRow: maxInnerRow,
          fromColumn: maxInnerColumn,
          toColumn: maxOuterColumn
        });
      }

      return newRanges;
    }
    return range;
  });
};
