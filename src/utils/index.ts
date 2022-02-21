export const createRangeArray = (range: number) =>
  Array.from(Array(range).keys());

const CHAR_CODE_A = 65;
export const getAlphabetCharAtIndex = (index: number): string => {
  return String.fromCharCode(CHAR_CODE_A + (index % 26));
};

const NUMBER_REGEX = new RegExp(/^(-|\+)?((\d+)\.?(\d+)?|(\d+)?\.?(\d+))$/);
export const isValidNumber = (text: string): boolean => {
  return NUMBER_REGEX.test(text);
};
