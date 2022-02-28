import { READ_WORK, SEARCH, GOOGLE_SEARCH, PERSEUS_WORD_LOOKUP, LOGEION_WORD_LOOKUP } from './index';

test('URLs', () => {
  expect(READ_WORK('new-testament', null, 'Luke', '15', '1')).toBe('/work/new-testament/Luke/15/1');
  expect(SEARCH('search_this', true, false, 2)).toBe('/search?q=search_this&page=2&ignore_diacritics=1');
  expect(GOOGLE_SEARCH('new-testament')).toBe('https://www.google.com/search?q=new-testament');
  expect(PERSEUS_WORD_LOOKUP('και')).toBe('http://www.perseus.tufts.edu/hopper/morph?l=και&la=greek');
  expect(LOGEION_WORD_LOOKUP('και')).toBe('https://logeion.uchicago.edu/και');
});
