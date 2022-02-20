import React from 'react';
import { render } from '@testing-library/react';
import Spreadsheet from './Spreadsheet';
import { Data } from '../../utils/data.types';
import { getAlphabetCharAtIndex } from '../../utils';

const SAMPLE_DATA: Data = [
  [{ value: 'John' }, { value: 'Doe' }],
  [{ value: 'Mark' }, { value: 'Rober' }],
  [{ value: 'Alan' }, { value: 'Turing' }]
];

describe('Spreadsheet', () => {
  test('should render spreadsheet', () => {
    const { container } = render(<Spreadsheet data={SAMPLE_DATA} />);
    expect(container).toBeVisible();
  });
  test('should render column titles', () => {
    const { container } = render(<Spreadsheet data={SAMPLE_DATA} />);
    const columnHeads = container.querySelectorAll('[role="column-head"]');
    expect(columnHeads.length).toEqual(
      Math.max(...SAMPLE_DATA.map((row) => row.length)) + 1
    );
    for (let i = 1; i < SAMPLE_DATA.length; i++) {
      expect(columnHeads[i].textContent).toBe(getAlphabetCharAtIndex(i - 1));
    }
  });
  test('should render row indices', () => {
    const { container } = render(<Spreadsheet data={SAMPLE_DATA} />);
    const rowIndices = container.querySelectorAll('[role="row-index"]');
    expect(rowIndices.length).toEqual(SAMPLE_DATA.length);
    for (let i = 1; i <= SAMPLE_DATA.length; i++) {
      expect(rowIndices[i - 1].textContent).toBe(i.toString());
    }
  });
});
