import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from './App';

test('App loads', () => {
  // https://stackoverflow.com/questions/36069731/how-to-unit-test-api-calls-with-mocked-fetch-in-react-native-with-jest
  global.fetch = jest.fn(() => Promise.resolve());
  const { getByText } = render(<MemoryRouter><App /></MemoryRouter>);
  expect(getByText(/About/i)).toBeTruthy();
});
