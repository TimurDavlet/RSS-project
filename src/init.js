/* eslint-disable no-undef */
import i18next from 'i18next';
import onChange from 'on-change';
import resources from './locales/index.js';
import render from './render.js';
import view from './view.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources,
  }).then(() => {
    const elements = {
      feedback: document.querySelector('.feedback'),
      feeds: document.querySelector('.feeds'),
      form: document.querySelector('.rss-form'),
      input: document.getElementById('url-input'),
      posts: document.querySelector('.posts'),
      submitButton: document.querySelector('button[type="submit"]'),
    };

    const state = onChange({
      lng: 'ru',
      links: [],
      input: {
        readonly: false,
      },
      feedback: {
        error: null,
        success: null,
      },
      valid: true,
      newFeed: [],
      newPosts: [],
      feeds: [],
      posts: [],
    }, render(elements));

    view(elements, state, i18nextInstance);
  });
};
