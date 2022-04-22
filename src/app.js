import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import render from './render.js';
import validate from './validation.js';
import parser from './parser.js';

export default (i18n) => {
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

  const makeRequest = async (state, i18n, link) => {
    try {
      const response = await axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`);
      return response.data;
    } catch (e) {
      state.feedback.error = i18n.t('errors.network');
      throw new Error(i18n.t('errors.network'));
    }
  };

  const getNewPost = async (state, i18n) => {
    state.links.forEach(async (link) => {
      const response = await makeRequest(state, i18n, link);
      const newFeed = parser(response.contents, state.feedback, i18n);
      if (newFeed !== null) {
        const newPosts = _.differenceBy(newFeed.feedItems, state.posts, 'postLink');
        if (newPosts.length > 0) {
          state.newPosts = [...newPosts];
          state.posts = [...state.newPosts, ...state.posts];
        }
      }
    });
    setTimeout(() => getNewPost(state, i18n), 5000);
  };

  const getFeeds = async (state, i18n, link) => {
    const response = await makeRequest(state, i18n, link);
    const newFeed = parser(response.contents, state.feedback, i18n);
    if (newFeed !== null) {
      state.newFeed = [newFeed];
      state.feeds = [...state.newFeed, ...state.feeds];
    }
  };

  const runValidation = async (state, i18n, link) => {
    state.feedback.error = await validate(link, state.links, i18n);
    if (state.feedback.error !== null) {
      state.feedback.success = null;
      return;
    }
    state.input.readonly = true;
    await getFeeds(state, i18n, link);
    await getNewPost(state, i18n);
    if (state.feedback.error === null) {
      state.links.push(link);
      state.feedback.success = null;
      state.feedback.success = i18n.t('success');
    }
    state.input.readonly = false;
  };

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await runValidation(state, i18n, elements.input.value);
  });
};
