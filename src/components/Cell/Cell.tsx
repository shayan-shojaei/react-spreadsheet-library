import React, { CSSProperties } from 'react';
import { CellData, DataTypes } from '../../utils/data.types';
import './Cell.scss';
import cn from 'classnames';

/** Cell Wrapper Props */
export interface IProps {
  /** Cell data */
  data: CellData;
  /** Indicates that the cursor is currently on the cell */
  highlighted?: boolean;
  /** Indicates that the cell is being edited */
  editing?: boolean;
  /** Indicates that the cell is selected */
  selected?: boolean;
  /** Fires when the value property changes */
  onChange?: (data: CellData) => void;
  /** classname */
  className?: any;
  /** style */
  style?: CSSProperties;
  /** HTML role attribute */
  role?: string;
  /** Tab index */
  tabIndex?: number;
  /** On Click */
  onClick?: () => void;
  /** On Double Click */
  onDoubleClick?: () => void;
}

function Cell({
  data = {},
  className,
  style,
  onChange,
  highlighted,
  editing,
  selected,
  tabIndex,
  onClick,
  onDoubleClick,
  role
}: IProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange === undefined) return;
    let newValue: DataTypes = e.target.value;

    // see if the string value is a parsable number
    if (
      !Number.isNaN(Number.parseFloat(newValue)) &&
      !newValue.trim().endsWith('.') &&
      newValue.trim().match(/^[0-9,.]$/)
    ) {
      newValue = newValue.includes('.')
        ? Number.parseFloat(newValue)
        : Number.parseInt(newValue);
    } else if (newValue === 'true' || newValue === 'false') {
      newValue = newValue === 'true';
    }

    !!onChange && onChange({ ...data, value: newValue });
  };

  return (
    <div
      className={cn({
        'cell--container': true,
        'cell--selected': selected,
        'cell--editing': editing,
        'cell--highlighted': highlighted,
        [className]: !!className
      })}
      style={style}
      tabIndex={tabIndex}
      role={role}
    >
      {editing ? (
        <input
          autoFocus
          className="cell--input"
          type="text"
          value={data.value !== undefined ? `${data.value}` : ''}
          onChange={handleInputChange}
        />
      ) : (
        <span
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          className="cell--display"
        >
          {data.value !== undefined ? `${data.value}` : ''}
        </span>
      )}
    </div>
  );
}

/**
 * Cell Component
 * @param {DataTypes} data - Cell data object.
 * @param onChange - fires when the cell value **or** state changes, passes in the new cell data object.
 * @param onValueChange - fires when the cell value changes, passes in the new cell value data.
 * @param className - appends to the element class list.
 * @param style - appends to the element style.
 * @param {boolean} highlighted - whether the cell is highlighted or not which indicates the cursor is on the cell.
 * only **one** component should be highlighted at a time but multiple components can be selected.
 * @param {boolean} editing - whether the cell is being edited or not and would render an input if so.
 * only **one** component should be editing at a time but multiple components can be selected.
 * @param {number} tabIndex - tab index in the corresponding spreadsheet.
 */
export default React.memo(Cell, (prevProps, nextProps) => {
  return (
    prevProps.style === nextProps.style &&
    prevProps.className === nextProps.className &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.tabIndex === nextProps.tabIndex &&
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.selected === nextProps.selected &&
    prevProps.editing === nextProps.editing &&
    prevProps.role === nextProps.role &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
  );
});
