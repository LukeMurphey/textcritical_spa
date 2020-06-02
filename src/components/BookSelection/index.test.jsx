import React from 'react';
import { render } from '@testing-library/react';
import { enableFetchMocks } from 'jest-fetch-mock';
import BookSelection from './index';

test('BookSelection', () => {
  enableFetchMocks();
  fetch.mockResponseOnce(JSON.stringify([{
    title: 'New Testament',
    title_slug: 'new-testament',
    author: '',
    editor: '',
    language: 'Greek',
  }]));

  const { getByText } = render(<BookSelection onSelectWork={() => {}} />);

  process.nextTick(() => {
    expect(getByText(/New Testament/i)).toBeTruthy();
  });
});
