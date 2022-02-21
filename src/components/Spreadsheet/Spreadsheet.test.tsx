import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  test('should select cell on click', () => {
    const onSelectionChange = jest.fn();

    const { container } = render(
      <Spreadsheet data={SAMPLE_DATA} onSelectionChange={onSelectionChange} />
    );

    const firstDataCell = container.querySelector('[tabindex="4"] span');
    userEvent.click(firstDataCell);

    expect(onSelectionChange).toBeCalledTimes(2);
    expect(onSelectionChange).toHaveBeenLastCalledWith([{ row: 0, column: 0 }]);
  });

  test('should select row when index is clicked', () => {
    const onSelectionChange = jest.fn();

    const { container } = render(
      <Spreadsheet data={SAMPLE_DATA} onSelectionChange={onSelectionChange} />
    );

    const firstRowCell = container.querySelector('[tabindex="3"] span');
    userEvent.click(firstRowCell);

    expect(onSelectionChange).toBeCalledTimes(2);
    expect(onSelectionChange).toHaveBeenLastCalledWith([
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 0, column: 2 }
    ]);
  });

  test('should select column when title is clicked', () => {
    const onSelectionChange = jest.fn();

    const { container } = render(
      <Spreadsheet data={SAMPLE_DATA} onSelectionChange={onSelectionChange} />
    );

    const firstColumnCell = container.querySelector('[tabindex="1"] span');
    userEvent.click(firstColumnCell);

    expect(onSelectionChange).toBeCalledTimes(2);
    expect(onSelectionChange).toHaveBeenLastCalledWith([
      { row: 0, column: 0 },
      { row: 1, column: 0 },
      { row: 2, column: 0 }
    ]);
  });
});
