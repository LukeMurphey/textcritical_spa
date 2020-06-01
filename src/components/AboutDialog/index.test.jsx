import React from 'react';
import { render } from '@testing-library/react';
import AboutDialog from './index';

test('toTitleCase', () => {
  const { getByText } = render(<AboutDialog onClose={() => {}} />);
  expect(getByText(/About/i)).toBeTruthy();
});
