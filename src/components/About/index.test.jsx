import React from 'react';
import { render } from '@testing-library/react';
import About from './index';

test('toTitleCase', () => {
  const { getByText } = render(<About />);
  expect(getByText(/About/i)).toBeTruthy();
});
