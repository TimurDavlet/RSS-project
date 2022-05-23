import i18next from 'i18next';
import onChange from 'on-change';
import view from './view.js';
import resources from './locales/index.js';
import render from './render.js';

export default () => {
  const elements = {
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    posts: document.querySelector('.posts'),
    submitButton: document.querySelector('button[type="submit"]'),
  };

  const i18nextInstance = i18next.createInstance();

  const state = onChange({
    lng: 'ru',
    links: [],
    processState: null,
    feedback: {
      error: null,
    },
    valid: true,
    newPosts: [],
    feeds: [],
    posts: [],
  }, render(elements, i18nextInstance));

  i18nextInstance.init({
    lng: state.lng,
    resources,
  }).then(view(elements, state, i18nextInstance));
};
