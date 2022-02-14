import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tooltip, Toast, Popover } from 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import has from 'lodash/has.js';
import { keyBy } from 'lodash-es';
import i18n from 'i18next';
import resources from './locales/index.js';
import render from './view.js';
//import url from 'url';

console.log('Hello World!');

const elements = {
  form: document.querySelector('[class="rss-form text-body"]'),
  input: document.querySelector('#url-input'),
  error: document.querySelector('[class="feedback m-0 position-absolute small text-danger"]'),
};

// export default
const start = () => {
  const defaultLanguage = 'ru';
  // каждый запуск приложения создаёт свой собственный объект i18n и работает с ним,
  // не меняя глобальный объект.
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  const state = onChange({
    formRSS: {
      listOfFeeds: [],
      errors: '',
      processState: '',
      processError: null,
    },
  }, render(elements));

  yup.setLocale({
    string: {
      url: i18nInstance.t('errors.url'),
    },
    mixed: {
      notOneOf: i18nInstance.t('errors.created'),
    },
  });

  const schema = yup.object().shape({
    website: yup.string().url().notOneOf([state.formRSS.listOfFeeds]),
  });

  const validate = (value) => {
    const valid = schema.validate({ website: value }, { abortEarly: false });
    return valid.then(() => {
      const result = {};
      return result;
    });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    const error = validate(value, state.formRSS.listOfFeeds);
    error.then(() => {
      state.formRSS.listOfFeeds.push(value);
    }).catch((e) => {
      state.formRSS.errors = e.errors;
    });
  });
};

start();
