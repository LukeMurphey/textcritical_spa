import { toTitleCase, indexOfNoDiacritic, appendLeadingQuestionMark, appendAmpersand } from './index';

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

test('appendLeadingQuestionMark', () => {
  expect(appendLeadingQuestionMark('')).toBe('');
  expect(appendLeadingQuestionMark('q=search_this&page=2&ignore_diacritics=1')).toBe('?q=search_this&page=2&ignore_diacritics=1');

});

test('appendAmpersand', () => {
  expect(appendAmpersand('', 'q=search_this')).toBe('q=search_this');
  expect(appendAmpersand('q=search_this', 'page=2')).toBe('&page=2');
});
