import React, { useState } from 'react';
import { ComponentMeta } from '@storybook/react';
import Spreadsheet from './Spreadsheet';
import { Data } from '../../utils/data.types';

const SAMPLE_DATA = [
  [{ value: 'John' }, { value: 'Doe' }, { value: 213 }, { value: true }],
  [{ value: 'Mark' }, { value: 'Rober' }, { value: 403 }, { value: true }],
  [{ value: 'Alan' }, { value: 'Turing' }, { value: 234 }]
];

const StoryWrapper = () => {
  const [data, setData] = useState<Data>(SAMPLE_DATA);
  return <Spreadsheet data={data} setState={setData} />;
};

export default {
  title: 'Spreadsheet',
  component: Spreadsheet
} as ComponentMeta<typeof Spreadsheet>;

const Template = () => <StoryWrapper />;

export const Primary = Template.bind({});
