import {
  arePositionsEqual,
  createRangeArray,
  createSelectionRangeBetweenPositions,
  getAlphabetCharAtIndex,
  isInRange,
  isValidNumber,
  isWithinRange,
  rangesToPositions,
  removeSelectionRange
} from '.';
import { CellPosition, SelectionRange } from './data.types';

describe('createRangeArray', () => {
  test('should return an array from 0 to 10', () => {
    const range = createRangeArray(10);
    for (let i = 0; i < 10; i++) {
      expect(range[i]).toEqual(i);
    }
  });
  test('should return an empty array', () => {
    const range = createRangeArray(0);
    expect(range.length).toEqual(0);
  });
  test('should return an array with values 5 <= x < 10', () => {
    const range = createRangeArray(10, 5);

    for (let i = 5; i < 10; i++) {
      expect(range[i - 5]).toEqual(i);
    }
  });
  test('should not accept max > min', () => {
    expect(() => createRangeArray(1, 2)).toThrowError(RangeError);
  });
});

describe('getAlphabetCharAtIndex', () => {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  test('should return the alphabet in order', () => {
    for (let i = 0; i < 26; i++) {
      expect(getAlphabetCharAtIndex(i)).toEqual(ALPHABET.charAt(i));
    }
  });

  test('should return the alphabet from the beginning if the the index is over 26', () => {
    for (let i = 0; i < 26; i++) {
      expect(getAlphabetCharAtIndex(26 + i)).toEqual(ALPHABET.charAt(i));
    }
  });
});

describe('isValidNumber', () => {
  test('should return true for strings with only digits', () => {
    expect(isValidNumber('123')).toBeTruthy();
  });

  test('should return false for strings with no digits', () => {
    expect(isValidNumber('one')).toBeFalsy();
    expect(isValidNumber('two')).toBeFalsy();
    expect(isValidNumber('')).toBeFalsy();
  });

  test('should return true for strings with floating point numbers', () => {
    expect(isValidNumber('123.45')).toBeTruthy();
    expect(isValidNumber('123.')).toBeTruthy();
    expect(isValidNumber('.123')).toBeTruthy();
  });

  test('should return true for strings with negative and positive symbols', () => {
    expect(isValidNumber('+123.45')).toBeTruthy();
    expect(isValidNumber('-123')).toBeTruthy();
  });
});

describe('arePositionsEqual', () => {
  test('should return true if positions point to the same spot', () => {
    const posA: CellPosition = { row: 1, column: 4 };
    const posB: CellPosition = { row: 1, column: 3 };
    const posC: CellPosition = { row: 1, column: 4 };
    expect(arePositionsEqual(posA, posB)).toBeFalsy();
    expect(arePositionsEqual(posA, posC)).toBeTruthy();
    expect(arePositionsEqual(posB, posC)).toBeFalsy();
  });
});

describe('isInRange', () => {
  test('should return true if position is in the range', () => {
    const posA: CellPosition = { row: 1, column: 4 };
    const posB: CellPosition = { row: 2, column: 3 };
    const posC: CellPosition = { row: 4, column: 2 };
    const rangeA: SelectionRange = {
      fromRow: 0,
      fromColumn: 0,
      toRow: 4,
      toColumn: 4
    };
    const rangeB: SelectionRange = {
      fromRow: 2,
      fromColumn: 1,
      toRow: 5,
      toColumn: 5
    };

    expect(isInRange(posA, rangeA)).toBeFalsy();
    expect(isInRange(posB, rangeA)).toBeTruthy();
    expect(isInRange(posC, rangeA)).toBeFalsy();
    expect(isInRange(posA, rangeB)).toBeFalsy();
    expect(isInRange(posB, rangeB)).toBeTruthy();
    expect(isInRange(posC, rangeB)).toBeTruthy();
  });
});

describe('rangeToPositions', () => {
  test('should return cell positions for range', () => {
    const rangeA: SelectionRange = {
      fromRow: 0,
      fromColumn: 0,
      toRow: 4,
      toColumn: 4
    };
    const rangeB: SelectionRange = {
      fromRow: 2,
      fromColumn: 2,
      toRow: 4,
      toColumn: 4
    };

    const resultA: CellPosition[] = [
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 0, column: 2 },
      { row: 0, column: 3 },
      { row: 1, column: 0 },
      { row: 1, column: 1 },
      { row: 1, column: 2 },
      { row: 1, column: 3 },
      { row: 2, column: 0 },
      { row: 2, column: 1 },
      { row: 2, column: 2 },
      { row: 2, column: 3 },
      { row: 3, column: 0 },
      { row: 3, column: 1 },
      { row: 3, column: 2 },
      { row: 3, column: 3 }
    ];

    const resultB: CellPosition[] = [
      { row: 2, column: 2 },
      { row: 2, column: 3 },
      { row: 3, column: 2 },
      { row: 3, column: 3 }
    ];
    expect(rangesToPositions(rangeA)).toStrictEqual(resultA);
    expect(rangesToPositions(rangeB)).toStrictEqual(resultB);
  });
  test('should return cell positions for multiple ranges', () => {
    const rangeA: SelectionRange = {
      fromRow: 0,
      fromColumn: 0,
      toRow: 2,
      toColumn: 2
    };
    const rangeB: SelectionRange = {
      fromRow: 2,
      fromColumn: 2,
      toRow: 4,
      toColumn: 4
    };

    const result: CellPosition[] = [
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 1, column: 0 },
      { row: 1, column: 1 },
      { row: 2, column: 2 },
      { row: 2, column: 3 },
      { row: 3, column: 2 },
      { row: 3, column: 3 }
    ];
    expect(rangesToPositions(rangeA, rangeB)).toStrictEqual(result);
  });
  test('should return cell positions for intersecting ranges', () => {
    const rangeA: SelectionRange = {
      fromRow: 0,
      fromColumn: 0,
      toRow: 2,
      toColumn: 2
    };
    const rangeB: SelectionRange = {
      fromRow: 1,
      fromColumn: 2,
      toRow: 4,
      toColumn: 4
    };
    const result: CellPosition[] = [
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 1, column: 0 },
      { row: 1, column: 1 },
      { row: 1, column: 2 },
      { row: 1, column: 3 },
      { row: 2, column: 2 },
      { row: 2, column: 3 },
      { row: 3, column: 2 },
      { row: 3, column: 3 }
    ];
    expect(rangesToPositions(rangeA, rangeB)).toStrictEqual(result);
  });
});

describe('createSelectionRangeBetweenPositions', () => {
  test('should return selection range between trivial positions', () => {
    const posA: CellPosition = {
      row: 0,
      column: 0
    };
    const posB: CellPosition = {
      row: 3,
      column: 3
    };

    const result: SelectionRange = {
      fromRow: 0,
      toRow: 4,
      fromColumn: 0,
      toColumn: 4
    };
    expect(createSelectionRangeBetweenPositions(posA, posB)).toStrictEqual(
      result
    );
  });
  test('should return selection range between non-trivial positions', () => {
    const posA: CellPosition = {
      row: 5,
      column: 3
    };
    const posB: CellPosition = {
      row: 3,
      column: 3
    };
    const posC: CellPosition = {
      row: 4,
      column: 4
    };

    const resultAB: SelectionRange = {
      fromRow: 3,
      toRow: 6,
      fromColumn: 3,
      toColumn: 4
    };
    const resultAC: SelectionRange = {
      fromRow: 4,
      toRow: 6,
      fromColumn: 3,
      toColumn: 5
    };
    const resultBC: SelectionRange = {
      fromRow: 3,
      toRow: 5,
      fromColumn: 3,
      toColumn: 5
    };

    expect(createSelectionRangeBetweenPositions(posA, posB)).toStrictEqual(
      resultAB
    );
    expect(createSelectionRangeBetweenPositions(posA, posC)).toStrictEqual(
      resultAC
    );
    expect(createSelectionRangeBetweenPositions(posB, posC)).toStrictEqual(
      resultBC
    );
    expect(createSelectionRangeBetweenPositions(posB, posA)).toStrictEqual(
      resultAB
    );
    expect(createSelectionRangeBetweenPositions(posC, posA)).toStrictEqual(
      resultAC
    );
    expect(createSelectionRangeBetweenPositions(posC, posB)).toStrictEqual(
      resultBC
    );
  });
});

describe('isWithinRange', () => {
  test('should return true if first range contains second range', () => {
    const rangeA: SelectionRange = {
      fromRow: 0,
      toRow: 4,
      fromColumn: 0,
      toColumn: 4
    };
    const rangeB: SelectionRange = {
      fromRow: 1,
      toRow: 3,
      fromColumn: 1,
      toColumn: 3
    };

    expect(isWithinRange(rangeA, rangeB)).toBeFalsy();
    expect(isWithinRange(rangeB, rangeA)).toBeTruthy();
  });
});
