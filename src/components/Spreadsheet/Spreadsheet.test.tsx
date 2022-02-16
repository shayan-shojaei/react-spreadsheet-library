import React from 'react';
import { render } from '@testing-library/react';
import Spreadsheet from './Spreadsheet';

describe('Spreadsheet', () => {
  test('should render spreadsheet', () => {
    const component = render(<Spreadsheet />);
    expect(component.getByText('Spreadsheet')).toBeVisible();
  });
});
