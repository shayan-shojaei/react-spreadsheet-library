import {
  arePositionsEqual,
  createRangeArray,
  getAlphabetCharAtIndex,
  isValidNumber
} from '.';
import { CellPosition } from './data.types';

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
