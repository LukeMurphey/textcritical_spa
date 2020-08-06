import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { enableFetchMocks } from 'jest-fetch-mock';
// regeneratorRuntime is needed for AwesomeDebouncePromise
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';
import WorkCard from './WorkCard';

test('WorkCard', async () => {
  const mockSetFavoriteWork = jest.fn();
  const mockRemoveFavoriteWork = jest.fn();

  enableFetchMocks();
  fetch.mockResponseOnce(JSON.stringify({
    "url": "/work/lxx/Malachi/1",
    "verse_to_highlight": null,
    "divisions": ["Malachi", "1"],
    "work_title": "Septuagint (LXX)",
    "division_title": "Malachi 1"
  }));

  await act(async () => {
    const { getByTestId, getByText } = render(
      <MemoryRouter>
        <WorkCard work="lxx" divisionReference="Malachi 1" divisions={['malachi', '1']} setFavoriteWork={mockSetFavoriteWork} removeFavoriteWork={mockRemoveFavoriteWork} />
      </MemoryRouter>
    );

    fireEvent.click(getByTestId('setFav'));
    expect(mockSetFavoriteWork).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId('removeFav'));
    expect(mockRemoveFavoriteWork).toHaveBeenCalledTimes(1);

    process.nextTick(() => {
      expect(getByText("Septuagint (LXX)")).toBeTruthy();
    });
  });
});
