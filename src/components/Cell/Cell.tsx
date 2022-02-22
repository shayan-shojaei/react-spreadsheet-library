import React, { CSSProperties } from 'react';
import { CellData, DataTypes, ModifierKey } from '../../utils/data.types';
import './Cell.scss';
import cn from 'classnames';
import { isValidNumber } from '../../utils';

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
  /** On Click */
  onClick?: (modifier: ModifierKey) => void;
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
      isValidNumber(newValue.trim())
    ) {
      newValue = newValue.includes('.')
        ? Number.parseFloat(newValue)
        : Number.parseInt(newValue);
    } else if (newValue === 'true' || newValue === 'false') {
      newValue = newValue === 'true';
    }

    !!onChange && onChange({ ...data, value: newValue });
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onClick === undefined) return;

    let modifer: ModifierKey = undefined;
    if (e.ctrlKey && e.shiftKey) {
      modifer = 'ctrl-shift';
    } else if (e.ctrlKey) {
      modifer = 'ctrl';
    } else if (e.shiftKey) {
      modifer = 'shift';
    }
    onClick(modifer);
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
      role={role}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
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
        <span className="cell--display">
          {data.value !== undefined ? `${data.value}` : ''}
        </span>
      )}
    </div>
  );
}

/**
 * Cell Component
 * @param {DataTypes} data - Cell data object.
 * @param {function} onChange - fires when the cell value **or** state changes, passes in the new cell data object.
 * @param {function} onValueChange - fires when the cell value changes, passes in the new cell value data.
 * @param {function} onClick - fires when the cell is clicked; *will not fire while the cell is being edited*.
 * passes in the modifer key if any was pressed.
 * @param {function} onDoubleClick - fires when the cell is double clicked; *will not fire while the cell is being edited*.
 * @param className - appends to the element class list.
 * @param style - appends to the element style.
 * @param {boolean} highlighted - whether the cell is highlighted or not which indicates the cursor is on the cell.
 * only **one** component should be highlighted at a time but multiple components can be selected.
 * @param {boolean} editing - whether the cell is being edited or not and would render an input if so.
 * only **one** component should be editing at a time but multiple components can be selected.
 */
export default React.memo(Cell, (prevProps, nextProps) => {
  return (
    prevProps.style === nextProps.style &&
    prevProps.className === nextProps.className &&
    prevProps.onChange === nextProps.onChange &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.onDoubleClick === nextProps.onDoubleClick &&
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.selected === nextProps.selected &&
    prevProps.editing === nextProps.editing &&
    prevProps.role === nextProps.role &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
  );
});
