import React from 'react';
import Cell from '../Cell/Cell';
import './RowIndexCell.scss';

interface IProps {
  rowIndex: number;
  tabIndex?: number;
  onClick?: (row: number) => void;
  selected?: boolean;
}

export default function RowIndexCell({
  rowIndex,
  tabIndex,
  onClick,
  selected
}: IProps) {
  return (
    <Cell
      role="row-index"
      data={{ value: rowIndex + 1 }}
      className={'row-index--cell'}
      tabIndex={tabIndex}
      onClick={() => !!onClick && onClick(rowIndex)}
      selected={selected}
    />
  );
}
