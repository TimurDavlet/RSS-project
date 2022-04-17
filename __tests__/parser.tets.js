/* eslint-disable no-undef */
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readFileSync } from 'fs';
import { parser } from '../src/js/parser';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const xml = readFileSync(getFixturePath('test.xml'), 'utf8');
const result = {
  feed: {
    title: 'Новые уроки на Хекслете',
    description: 'Практические уроки по программированию',
    link: 'https://ru.hexlet.io/',
  },
  posts: {
    title: 'Зависимости / Terraform: Основы',
    description: 'Цель: Научиться связывать ресурсы друг с другом через атрибуты',
    link: 'https://ru.hexlet.io/courses/terraform-basics/lessons/dependencies/theory_unit',
    state: 'unviewed',
    id: '2',
    feedId: '1',
  },
};

test('parsing', () => {
  expect(parser(xml)).toBe(result);
});
