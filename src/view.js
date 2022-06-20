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

const makeRequest = (link, state) => axios.get(routes.allOrigins(link))
  .then((response) => response.data).catch((e) => {
    state.feedback.error = 'netError';
    throw new Error(e);
  });

export const getNewPost = (state) => {
  const promises = state.links.map((link) => makeRequest(link, state)
    .then((data) => {
      const newFeed = parser(data.contents, state);
      const newPosts = _.differenceBy(newFeed.feedItems, state.posts, 'postLink');
      if (newPosts.length > 0) {
        state.newPosts = [...newPosts];
        state.posts = [...newPosts, ...state.posts];
      }
    }));
  Promise.all(promises).finally(setTimeout(() => getNewPost(state), 5000));
};

const getFeeds = (state, link) => makeRequest(link, state)
  .then((data) => {
    const feed = parser(data.contents, state);
    const post = feed.feedItems;
    state.feeds = [...state.feeds, feed];
    state.links.push(link);
    state.posts = [...state.posts, ...post];
    state.newPosts = post;
    state.processState = 'success';
  });

const runValidation = (state, link) => {
  state.processState = 'loading';
  validate(link, state.links, state)
    .then(() => getFeeds(state, link))
    .catch((err) => {
      state.feedback.error = null;
      state.feedback.success = null;
      state.processState = null;
    });
};

export const view = (elements, state) => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    runValidation(state, elements.input.value);
  });
};
