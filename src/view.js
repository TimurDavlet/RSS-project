/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import axios from 'axios';
import validate from './validation.js';
import parser from './parser.js';

const routes = {
  allOrigins: (url) => {
    const result = new URL('/get', 'https://allorigins.hexlet.app');
    result.searchParams.set('url', url);
    result.searchParams.set('disableCache', 'true');
    return result.toString();
  },
};

const makeRequest = (i18n, link) => axios.get(routes.allOrigins(link))
  .then((response) => response.data).catch((e) => {
    throw new Error(i18n.t('errors.network'));
  });

const getNewPost = (state, i18n) => {
  const promises = state.links.map((link) => makeRequest(i18n, link)
    .then((data) => {
      const newFeed = parser(data.contents, state.feedback, i18n);
      const newPosts = _.differenceBy(newFeed.feedItems, state.posts, 'postLink');
      if (newPosts.length > 0) {
        state.newPosts = [...newPosts];
        state.posts = [...newPosts, ...state.posts];
      }
    }));
  Promise.all(promises).finally(setTimeout(() => getNewPost(state, i18n), 5000));
};

const getFeeds = (state, i18n, link) => makeRequest(i18n, link)
  .then((data) => {
    const feed = parser(data.contents, state.feedback, i18n);
    const post = feed.feedItems;
    state.feeds = [...state.feeds, feed];
    state.links.push(link);
    state.posts = [...state.posts, ...post];
    state.newPosts = post;
    state.feedback.success = i18n.t('success');
    state.processState = 'success';
  });

const runValidation = (state, i18n, link) => {
  state.feedback.success = null;
  state.feedback.error = null;
  state.processState = 'loading';
  validate(link, state.links, i18n)
    .then(() => getFeeds(state, i18n, link))
    .catch((err) => {
      state.feedback.error = err.message;
      state.feedback.success = null;
      state.processState = null;
    });
};

const view = (elements, state, i18n) => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    runValidation(state, i18n, elements.input.value);
    getNewPost(state, i18n);
  });
};

export default view;
