import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactMe from './index';

test('ContactMe', () => {
  const { getByText } = render(
    <MemoryRouter>
      <ContactMe />
    </MemoryRouter>,
  );
  expect(getByText(/Getting in Touch/i)).toBeTruthy();
});
