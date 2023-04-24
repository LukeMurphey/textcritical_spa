import {
  ENDPOINT_READ_WORK,
  ENDPOINT_WORK_INFO,
  ENDPOINT_WORK_IMAGE,
  ENDPOINT_WORK_DOWNLOAD,
  ENDPOINT_RESOLVE_REFERENCE,
  ENDPOINT_WIKI_INFO,
  ENDPOINT_WORD_PARSE,
  ENDPOINT_WORKS_LISTS,
  ENDPOINT_VERSION_INFO,
  ENDPOINT_SEARCH,
} from './index';

test('Endpoints', () => {
  expect(ENDPOINT_READ_WORK('new-testament', 'Luke', '15', '1')).toBe('/api/work/new-testament/Luke/15/1');
  expect(ENDPOINT_WORK_INFO('new-testament')).toBe('/api/work_info/new-testament');
  expect(ENDPOINT_WORK_IMAGE('new-testament', 128)).toBe('/api/work_image/new-testament?width=128');
  expect(ENDPOINT_WORK_DOWNLOAD('new-testament')).toBe('/api/download/work/new-testament?format=epub');
  expect(ENDPOINT_RESOLVE_REFERENCE('new-testament', '1 john')).toBe('/api/resolve_reference/?work=new-testament&ref=1 john');
  expect(ENDPOINT_WIKI_INFO('Bible')).toBe('/api/wikipedia_info/Bible');
  expect(ENDPOINT_WORD_PARSE('λογος')).toBe('/api/word_parse/λογος');
  expect(ENDPOINT_WORKS_LISTS()).toBe('/api/works');
  expect(ENDPOINT_VERSION_INFO()).toBe('/api/version_info');
  expect(ENDPOINT_SEARCH('λογος')).toBe('/api/search/%CE%BB%CE%BF%CE%B3%CE%BF%CF%82?page=1&ignore_diacritics=0&related_forms=0');
});
