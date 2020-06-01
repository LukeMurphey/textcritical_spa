import React from 'react';
import { render } from '@testing-library/react';
import BasicLoader from './index';

test('BasicLoader', () => {
  const { getByText } = render(<BasicLoader />);
  expect(getByText(/Loading/i)).toBeTruthy();
});
