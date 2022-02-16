import React from 'react';
import { ComponentMeta } from '@storybook/react';
import Spreadsheet from './Spreadsheet';

export default {
  title: 'Spreadsheet',
  component: Spreadsheet
} as ComponentMeta<typeof Spreadsheet>;

const Template = () => <Spreadsheet />;

export const Primary = Template.bind({});
