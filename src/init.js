import i18next from 'i18next';
import onChange from 'on-change';
import resources from './locales/index.js';
import render from './view.js';
import _ from 'lodash';
import axios from 'axios';
import validate from './validation.js';
import parser from './parser.js';
import 'bootstrap';

export default () => {
  const elements = {
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    posts: document.querySelector('.posts'),
    submitButton: document.querySelector('button[type="submit"]'),
    modal: document.querySelector('#modal'),
  };

const routes = {
  allOrigins: (url) => {
    const result = new URL('/get', 'https://allorigins.hexlet.app');
    result.searchParams.set('url', url);
    result.searchParams.set('disableCache', 'true');
    return result.toString();
  },
};

const getNewPost = (state) => {
  const promises = state.links.map((link) => {
    axios.get(routes.allOrigins(link))
      .then((response) => response.data)
      .then((data) => {
        const newFeed = parser(data.contents, state);
        const newPosts = _.differenceBy(newFeed.feedItems, state.posts, 'postLink');
        if (newPosts.length > 0) {
          state.newPosts = [...newPosts];
          state.posts = [...newPosts, ...state.posts];
        }
      });
  });
  Promise.all(promises).finally(setTimeout(() => getNewPost(state), 5000));
};

const runValidation = (state, link) => {
  state.processState = 'loading';
  return validate(link, state.links);
};

const view = (elements, state) => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const link = elements.input.value;
    runValidation(state, link)
      .then(() => axios.get(routes.allOrigins(link)))
      .then((response) => response.data)
      .then((data) => {
        const feed = parser(data.contents);
        const post = feed.feedItems;
        state.feeds = [...state.feeds, feed];
        state.links.push(link);
        state.posts = [...state.posts, ...post];
        state.newPosts = post;
        state.processState = 'success';
      })
      .catch((err) => {
        state.processState = 'Error';
        if (err.isAxiosError) {
          state.feedback.error = 'netError';
        } else if (err.isParsingError) {
          state.feedback.error = 'parseError';
        } else if (err.name === 'ValidationError') {
          const massage = err.message;
          state.feedback.error = massage;
        } else {
          console.log('Unknown Error');
        }
      });
  });
  elements.posts.addEventListener('click', (event) => {
    const currentId = event.target.dataset.id;
    if (currentId !== undefined) {
      state.visitedPostsId.add(currentId);
      state.currentPostId = {posts: state.posts, currentId};
    }
  });
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
    visitedPostsId: new Set(),
    currentPostId: '',
  }, render(elements, i18nextInstance));

  i18nextInstance.init({
    lng: state.lng,
    resources,
  }).then(() => {
    view(elements, state, i18nextInstance);
    getNewPost(state);
  });
};
