import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('App loads', () => {
  const { getByText } = render(<App />);
  expect(getByText(/About/i)).toBeTruthy();
});
