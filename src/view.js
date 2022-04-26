/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import axios from 'axios';
import validate from './validation.js';
import parser from './parser.js';

const makeRequest = (state, i18n, link) => {
    return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
      .then((response) => {
        return response.data;
      }).catch((e) => {
      state.feedback.error = i18n.t('errors.network');
      throw new Error(i18n.t('errors.network'));
    })
};

const getNewPost = (state, i18n) => {
  state.links.forEach((link) => {
    return makeRequest(state, i18n, link)
      .then((data) => {
        const newFeed = parser(data.contents, state.feedback, i18n);
        if (newFeed !== null) {
          const newPosts = _.differenceBy(newFeed.feedItems, state.posts, 'postLink');
          if (newPosts.length > 0) {
            state.newPosts = [...newPosts];
            state.posts = [...state.newPosts, ...state.posts];
          }
        }
      })
  });
  console.log(state)
  setTimeout(() => getNewPost(state, i18n), 5000);
};

const getFeeds = (state, i18n, link) => {
  return makeRequest(state, i18n, link)
    .then((data) => {
      const response = data;
      return response;
    })
    .then((data2) => {
      const newFeed = parser(data2.contents, state.feedback, i18n);
      if (newFeed !== null) {
        state.newFeed = [newFeed];
        state.feeds = [...state.newFeed, ...state.feeds];
      }
    })
};

const runValidation = (state, i18n, link) => {
  validate(link, state.links, i18n)
  .then((data) => {
    if (data !== null) {
      state.feedback.error = data;
      state.feedback.success = null;
      throw new Error(data);
    }
    state.feedback.error = data;
    state.input.readonly = true;
  })
  .then(() => getFeeds(state, i18n, link))
  .then(() => state.links.push(link))
  .then(getNewPost(state, i18n))
  .then(() => {
    if (state.feedback.error === null) {
      state.feedback.success = null;
      state.feedback.success = i18n.t('success');
    }
    state.input.readonly = false;
  })
    .catch((err) => {
      console.log(err)
    //state.feedback.error = err;
  });
};

const view = (elements, state, i18n) => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    return runValidation(state, i18n, elements.input.value)
  });
};

export default view;
