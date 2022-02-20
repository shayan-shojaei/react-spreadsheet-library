export const createRangeArray = (range: number) =>
  Array.from(Array(range).keys());

const CHAR_CODE_A = 65;
export const getAlphabetCharAtIndex = (index: number): string => {
  return String.fromCharCode(CHAR_CODE_A + (index % 26));
};
