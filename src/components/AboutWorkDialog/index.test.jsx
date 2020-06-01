import React from 'react';
import { render } from '@testing-library/react';
import AboutWorkDialog from './index';

test('AboutWorkDialog', () => {
  global.fetch = jest.fn(() => Promise.resolve());
  const { getByText } = render(<AboutWorkDialog work="new-testament" onClose={() => {}} />);
  expect(getByText(/About this Book/i)).toBeTruthy();
});
