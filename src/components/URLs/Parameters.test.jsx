import { appendLeadingQuestionMark, appendAmpersand } from './Parameters';

test('appendLeadingQuestionMark', () => {
  expect(appendLeadingQuestionMark('')).toBe('');
  expect(appendLeadingQuestionMark('q=search_this&page=2&ignore_diacritics=1')).toBe('?q=search_this&page=2&ignore_diacritics=1');

});

test('appendAmpersand', () => {
  expect(appendAmpersand('', 'q=search_this')).toBe('q=search_this');
  expect(appendAmpersand('q=search_this', 'page=2')).toBe('&page=2');
});
