import { toTitleCase, indexOfNoDiacritic } from './index';

test('toTitleCase', () => {
  expect(toTitleCase('first')).toBe('First');
  expect(toTitleCase('1 john')).toBe('1 John');
});



test('indexOfNoDiacritic', () => {
  const law = ["ΝΌΜΟΥ", "Νόμε", "Νόμον", "νόμος"];

  // Basic search
  expect(indexOfNoDiacritic(law, 'Νόμε')).toBe(1);

  // Case compare
  expect(indexOfNoDiacritic(law, 'νόμε')).toBe(1);

  // No diacritic
  expect(indexOfNoDiacritic(law, 'νομος')).toBe(3);
});
