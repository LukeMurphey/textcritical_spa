import React from 'react';
import { render } from '@testing-library/react';
import AboutDialog from './index';

test('toTitleCase', () => {
  // https://stackoverflow.com/questions/36069731/how-to-unit-test-api-calls-with-mocked-fetch-in-react-native-with-jest
  global.fetch = jest.fn(() => Promise.resolve());
  const { getByText } = render(<AboutDialog onClose={() => {}} />);
  expect(getByText(/About/i)).toBeTruthy();
});
