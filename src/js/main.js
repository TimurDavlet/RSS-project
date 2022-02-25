import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tooltip, Toast, Popover } from 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import has from 'lodash/has.js';
import { keyBy } from 'lodash-es';
import i18n from 'i18next';
import uniqueId from 'lodash/uniqueId.js';
import resources from './locales/index.js';
import { renderClear, renderErrors, renderRSS, renderBotton } from './view.js';
import 'whatwg-fetch';
import parsing from './parser.js';
// import url from 'url';

console.log('Hello World!');

const elements = {
  form: document.querySelector('[class="rss-form text-body"]'),
  input: document.querySelector('#url-input'),
  error: document.querySelector('[class="feedback m-0 position-absolute small"]'),
  posts: document.querySelector('[class="col-md-10 col-lg-8 order-1 mx-auto posts"]'),
  feeds: document.querySelector('[class="col-md-10 col-lg-4 mx-auto order-0 order-lg-1 feeds"]'),
  bottons: document.querySelectorAll('[class="btn btn-outline-primary btn-sm"]'),
  buttonForm: document.querySelector('[class="h-100 btn btn-lg btn-primary px-sm-5"]'),
  errorInfo: document.querySelector('[class="feedback m-0 position-absolute small"]'),
};
// disabled

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

  const state = {
    formRSS: {
      listOfFeeds: [],
      listOfFeedsUrl: [],
      errors: '',
      processState: '',
      processError: null,
      posts: [],
    },
  };

  const obserward = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        // handleProcessState(elements, value);
        break;

      case 'formRSS.processState':
        renderBotton(elements, value);
        break;

      case 'formRSS.errors':
        renderErrors(elements, value);
        break;

      case 'formRSS.listOfFeedsUrl':
        console.log('URL RSS добавлен в STATE');
        console.log('state');
        console.log(state);
        renderRSS(elements, state);
        renderClear(elements);
        break;

      default:
        break;
    }
  });

  yup.setLocale({
    string: {
      url: i18nInstance.t('errors.url'),
    },
    mixed: {
      notOneOf: i18nInstance.t('errors.created'),
    },
  });

  const schema = yup.object().shape({
    website: yup.string().url().notOneOf([state.formRSS.listOfFeedsUrl]),
  });

  const validate = (value) => {
    const valid = schema.validate({ website: value }, { abortEarly: false });
    return valid.then(() => {
      const result = {};
      return result;
    });
  };

  const generateId = () => uniqueId();

  const dataNormalization = (url, rssObj) => {
    const id = generateId();
    const { feed } = rssObj;
    const { posts } = rssObj;
    posts.map((element) => {
      element.id = generateId();
      element.feedId = id;
      return element;
    });
    obserward.formRSS.listOfFeeds.push({ feed, id });
    // obserward.formRSS.posts.push({ posts, feedId: id });
    // obserward.formRSS.posts.push(posts);
    posts.forEach((post) => obserward.formRSS.posts.push(post));
  };

  const dowonloadStream = (feald) => fetch(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(feald)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(i18nInstance.t('errors.network'));
    }).catch(() => {
      throw new Error(i18nInstance.t('errors.network'));
    });

  const createDomObject = (data) => {
    const parser = new DOMParser();
    const domObject = parser.parseFromString(data.contents, 'application/xml');
    if (domObject.querySelector('parsererror') !== null) {
      throw new Error(i18nInstance.t('errors.invalidRSS'));
    }
    return domObject;
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    obserward.formRSS.processState = 'loading';
    const error = validate(value);
    console.log('erorr')
    error.then(() => {
      dowonloadStream(value)
        .then((data) => createDomObject(data))
        .then((data2) => parsing(data2))
        .then((data3) => dataNormalization(value, data3))
        .then(() => {
          obserward.formRSS.listOfFeedsUrl.push(value);
          obserward.formRSS.processState = i18nInstance.t('success');
        })
        .catch((e) => {
          obserward.formRSS.errors = e.message;
        });
    }).catch((e) => {
      obserward.formRSS.errors = e.message;
    });
  });

  const filterByIdPosts = (id, stat) => {
    const { posts } = stat.formRSS;
    const filterId = posts.filter((post) => post.id === id);
    const result = filterId[0];
    console.log(filterId)
    return { title: result.name, body: result.description, link: result.link };
  };
  
  const modal = document.getElementById('modal');
  modal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const recipient = button.getAttribute('data-id');
    console.log(recipient);
    const modalTitle = modal.querySelector('.modal-title');
    const modalBodyInput = modal.querySelector('.modal-body');
    const aboutLink = modal.querySelector('[class="btn btn-primary full-article"]');
    const arg = filterByIdPosts(recipient, state);
    modalTitle.textContent = arg.title;
    modalBodyInput.textContent = arg.body;
    aboutLink.href = arg.link;
  });
};

start();

/*
const state = onChange({
    formRSS: {
      listOfFeeds: [],
      listOfFeedsUrl: [],
      errors: '',
      processState: '',
      processError: null,
    },
    posts: [],
  }, render(elements));
*/
