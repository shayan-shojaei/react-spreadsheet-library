import React from 'react';
import { createRangeArray, getAlphabetCharAtIndex } from '../../utils';
import Cell from '../Cell/Cell';
import './ColumnHeads.scss';

interface IProps {
  totalColumns: number;
  selectedColumns?: number[];
  onClick?: (column: number) => void;
}

function ColumnHeads({ totalColumns, onClick, selectedColumns }: IProps) {
  const handleClick = (column: number) => !!onClick && onClick(column);

  // a column is added to account for the row indices column
  return (
    <>
      {createRangeArray(totalColumns + 1).map((column: number) => {
        return (
          <Cell
            key={`column--${column}`}
            role="column-head"
            data={{
              value: column === 0 ? '' : getAlphabetCharAtIndex(column - 1)
            }}
            className={'column-head--cell'}
            tabIndex={column}
            onClick={() => handleClick(column - 1)}
            selected={selectedColumns && selectedColumns.includes(column - 1)}
          />
        );
      })}
    </>
  );
}

/** Column Heads COmponent
 * @param {number} totalColumns - number of columns in the spreadsheet.
 * @param {number} selectedColumns - indices of the columns that are currently selected.
 * @param onClick - fires when a column is clicked returning the index of said column.
 */
export default React.memo(ColumnHeads);
