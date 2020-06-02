import React from 'react';
import { render } from '@testing-library/react';
import LazyImage from './index';

test('LazyImage', () => {
  const { getByTestId } = render(<LazyImage src="/media/pic.png" />);
  expect(getByTestId('loader')).toBeTruthy();
});
