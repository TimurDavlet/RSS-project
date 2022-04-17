import { generateRss } from '../src/js/rss-generator.js';

test('boom!', () => {
  expect(() => {
    generateRss('qwe');
  }).toThrow('Ссылка должна быть валидным URL');
});
