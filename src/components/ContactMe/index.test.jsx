import React from 'react';
import { render } from '@testing-library/react';
import ContactMe from './index';

test('ContactMe', () => {
  const { getByText } = render(<ContactMe />);
  expect(getByText(/Getting in Touch/i)).toBeTruthy();
});
