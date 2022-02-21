import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cell from './Cell';

const TEST_DATA = { value: 'TEST' };
const TEST_NUMBER_DATA = { value: 123 };
const TEST_BOOLEAN_DATA = { value: true };

describe('Cell', () => {
  test('should render cell', () => {
    const { container } = render(<Cell data={TEST_DATA} />);

    expect(container.textContent).toBe('TEST');
  });

  test('should have test-class in class list', () => {
    const {
      container: { firstChild: component }
    } = render(<Cell data={TEST_DATA} className="test-class" />);

    expect(component).toHaveClass('test-class');
  });

  test('should have passed style in component styles', () => {
    const {
      container: { firstChild: component }
    } = render(<Cell data={TEST_DATA} style={{ height: '100px' }} />);

    expect(component).toHaveStyle({ height: '100px' });
  });

  test('should render input only while editing', () => {
    const { container: idleCell } = render(
      <Cell data={TEST_DATA} editing={false} />
    );
    const { container: editingCell } = render(
      <Cell data={TEST_DATA} editing />
    );

    expect(idleCell.getElementsByTagName('input')[0]).toBeUndefined();
    expect(editingCell.getElementsByTagName('input')[0]).toBeDefined();
  });

  test('should format values in input', () => {
    const { container: stringCell } = render(<Cell data={TEST_DATA} editing />);
    const { container: booleanCell } = render(
      <Cell data={TEST_BOOLEAN_DATA} editing />
    );
    const { container: numberCell } = render(
      <Cell data={TEST_NUMBER_DATA} editing />
    );

    expect(stringCell.getElementsByTagName('input')[0]).toHaveValue('TEST');
    expect(booleanCell.getElementsByTagName('input')[0]).toHaveValue('true');
    expect(numberCell.getElementsByTagName('input')[0]).toHaveValue('123');
  });

  test('should have cell--editing class while cell is editing', () => {
    const {
      container: { firstChild: component }
    } = render(<Cell data={TEST_DATA} editing />);

    expect(component).toHaveClass('cell--editing');
  });

  test('should have cell--selected class while cell is selected', () => {
    const {
      container: { firstChild: component }
    } = render(<Cell data={TEST_DATA} selected />);

    expect(component).toHaveClass('cell--selected');
  });

  test('should not trigger onChange when typing if state is not editing', () => {
    const onValueChange = jest.fn();

    const { container } = render(
      <Cell data={TEST_DATA} onChange={(data) => onValueChange(data.value)} />
    );
    userEvent.type(container, 'TEST');

    expect(onValueChange).toHaveBeenCalledTimes(0);
  });

  test('should trigger onChange when typing if state is editing', () => {
    const onChange = jest.fn();

    const { container } = render(
      <Cell
        data={TEST_DATA}
        onChange={(data) => onChange(data.value)}
        editing={true}
      />
    );

    userEvent.type(container.getElementsByTagName('input')[0], '_');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('TEST_');
  });

  test('should return number as onChange argument if the value is a parsable number', () => {
    const onValueChange = jest.fn();

    const { container } = render(
      <Cell
        data={{ value: '123.' }}
        editing={true}
        onChange={(data) => onValueChange(data.value)}
      />
    );

    const input = container.getElementsByTagName('input')[0];

    userEvent.type(input, '{backspace}');
    expect(onValueChange).toHaveBeenLastCalledWith(123);
    userEvent.type(input, '4');
    expect(onValueChange).toHaveBeenLastCalledWith(123.4);
    userEvent.type(input, ' ');
    expect(onValueChange).toHaveBeenLastCalledWith('123. ');
  });

  test('should return boolean as onValueChange argument if the value is the string `true` or `false`', () => {
    const onValueChange = jest.fn();

    const { container } = render(
      <Cell
        data={{ value: 'tru' }}
        editing={true}
        onChange={(data) => onValueChange(data.value)}
      />
    );
    const input = container.getElementsByTagName('input')[0];

    userEvent.type(input, '1');
    expect(onValueChange).toHaveBeenLastCalledWith('tru1');
    userEvent.type(input, 'e');
    expect(onValueChange).toHaveBeenLastCalledWith(true);
  });

  test('should trigger onClick when clicked', () => {
    const onClick = jest.fn();

    const { container } = render(<Cell data={TEST_DATA} onClick={onClick} />);
    expect(onClick).toHaveBeenCalledTimes(0);
    userEvent.click(container.getElementsByTagName('span')[0]);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test('should trigger onDoubleClick when double clicked', () => {
    const onDoubleClick = jest.fn();

    const { container } = render(
      <Cell data={TEST_DATA} onDoubleClick={onDoubleClick} />
    );
    expect(onDoubleClick).toHaveBeenCalledTimes(0);
    userEvent.dblClick(container.getElementsByTagName('span')[0]);
    expect(onDoubleClick).toHaveBeenCalledTimes(1);
  });
});
