import React from 'react';
import { ModifierKey } from '../../utils/data.types';
import Cell from '../Cell/Cell';
import './RowIndexCell.scss';

interface IProps {
  rowIndex: number;
  onClick?: (row: number, modifier: ModifierKey) => void;
  selected?: boolean;
}

export default function RowIndexCell({ rowIndex, onClick, selected }: IProps) {
  return (
    <Cell
      role="row-index"
      data={{ value: rowIndex + 1 }}
      className={'row-index--cell'}
      onClick={(modifier) => !!onClick && onClick(rowIndex, modifier)}
      selected={selected}
    />
  );
}
