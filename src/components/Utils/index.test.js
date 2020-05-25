import { toTitleCase } from './index';

test('toTitleCase', () => {
  expect(toTitleCase('first')).toBe('First');
  expect(toTitleCase('1 john')).toBe('1 John');
});
