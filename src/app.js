import onChange from 'on-change';
import render from './render.js';
import view from './view.js';

export default (i18nextInstance) => {
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
};
