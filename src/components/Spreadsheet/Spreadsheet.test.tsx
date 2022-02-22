import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Spreadsheet from './Spreadsheet';
import { Data } from '../../utils/data.types';
import { getAlphabetCharAtIndex } from '../../utils';

const SAMPLE_DATA: Data = [
  [{ value: 'John' }, { value: 'Doe' }, { value: 34 }],
  [{ value: 'Mark' }, { value: 'Rober' }, { value: 34 }],
  [{ value: 'Alan' }, { value: 'Turing' }, { value: 34 }]
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

  test('should select cell on click', async () => {
    const onSelectionChange = jest.fn();

    const component = render(
      <Spreadsheet data={SAMPLE_DATA} onSelectionChange={onSelectionChange} />
    );

    const firstDataCell = await component.findByText('John');
    const secondDataCell = await component.findByText('Rober');

    userEvent.click(firstDataCell);

    expect(onSelectionChange).toBeCalledTimes(2);
    expect(onSelectionChange).toHaveBeenLastCalledWith([{ row: 0, column: 0 }]);

    userEvent.click(secondDataCell);

    expect(onSelectionChange).toBeCalledTimes(3);
    expect(onSelectionChange).toHaveBeenLastCalledWith([{ row: 1, column: 1 }]);
  });

  test('should select row when index is clicked', async () => {
    const onSelectionChange = jest.fn();

    const component = render(
      <Spreadsheet data={SAMPLE_DATA} onSelectionChange={onSelectionChange} />
    );

    const firstRowCell = await component.findByText('1');
    const secondRowCell = await component.findByText('2');

    userEvent.click(firstRowCell);
    expect(onSelectionChange).toBeCalledTimes(2);

    expect(onSelectionChange).toHaveBeenLastCalledWith([
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 0, column: 2 }
    ]);
    userEvent.click(secondRowCell);
    expect(onSelectionChange).toBeCalledTimes(3);
    expect(onSelectionChange).toHaveBeenLastCalledWith([
      { row: 1, column: 0 },
      { row: 1, column: 1 },
      { row: 1, column: 2 }
    ]);
  });

  test('should select column when title is clicked', async () => {
    const onSelectionChange = jest.fn();

    const component = render(
      <Spreadsheet data={SAMPLE_DATA} onSelectionChange={onSelectionChange} />
    );

    const firstColumnCell = await component.findByText('A');
    const secondColumnCell = await component.findByText('B');

    userEvent.click(firstColumnCell);
    expect(onSelectionChange).toBeCalledTimes(2);
    expect(onSelectionChange).toHaveBeenLastCalledWith([
      { row: 0, column: 0 },
      { row: 1, column: 0 },
      { row: 2, column: 0 }
    ]);
    userEvent.click(secondColumnCell);
    expect(onSelectionChange).toBeCalledTimes(3);
    expect(onSelectionChange).toHaveBeenLastCalledWith([
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      { row: 2, column: 1 }
    ]);
  });

  test('should select the data between two columns when the second column is shift-clicked', async () => {
    const onSelectionChange = jest.fn();

    const component = render(
      <Spreadsheet data={SAMPLE_DATA} onSelectionChange={onSelectionChange} />
    );

    const firstColumnCell = await component.findByText('A');
    const thirdColumnCell = await component.findByText('C');

    userEvent.click(firstColumnCell);
    expect(onSelectionChange).toBeCalledTimes(2);
    expect(onSelectionChange).toHaveBeenLastCalledWith([
      { row: 0, column: 0 },
      { row: 1, column: 0 },
      { row: 2, column: 0 }
    ]);

    userEvent.click(thirdColumnCell, { shiftKey: true });
    expect(onSelectionChange).toBeCalledTimes(3);
    expect(onSelectionChange).toHaveBeenLastCalledWith([
      { row: 0, column: 0 },
      { row: 1, column: 0 },
      { row: 2, column: 0 },
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      { row: 2, column: 1 },
      { row: 0, column: 2 },
      { row: 1, column: 2 },
      { row: 2, column: 2 }
    ]);
  });
});
