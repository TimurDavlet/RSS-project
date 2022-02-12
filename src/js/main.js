import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tooltip, Toast, Popover } from 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import has from 'lodash/has.js';
import { keyBy } from 'lodash-es';
import render from './view.js';
//import url from 'url';

console.log('Hello World!');

const elements = {
  form: document.querySelector('[class="rss-form text-body"]'),
  input: document.querySelector('#url-input'),
  error: document.querySelector('[class="feedback m-0 position-absolute small text-danger"]'),
};

const schema = yup.object().shape({
  website: yup.string().url().nullable(),
});

const validate = (value) => {
  const valid = schema.validate({ website: value }, { abortEarly: false });
  return valid.then(() => {
    const result = {};
    return result;
  }).catch((e) => keyBy(e.inner, 'path'));
};

const state = onChange({
  formRSS: {
    listOfFeeds: [],
    errors: '',
    processState: '',
    processError: null,
  },
}, render(elements));

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const value = formData.get('url');
  const error = validate(value);
  const isFieldInFeeds = state.formRSS.listOfFeeds.includes(value);
  error.then((data) => {
    if (isEmpty(data) && !isFieldInFeeds) {
      state.formRSS.listOfFeeds.push(value);
      // передал в render
      // что-то отрисовываем в render по пути formRSS.listOfFeeds.
      console.log('валидация прошла успешно');
    } else {
      state.formRSS.errors = isFieldInFeeds ? 'RSS уже существует' : 'Ссылка должна быть валидным URL';
      // передал в render
      // что-то отрисовываем в render по пути formRSS.errors.
    }
  });
});
