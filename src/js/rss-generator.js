/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-shadow */
import '../style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tooltip, Toast, Popover } from 'bootstrap';
import onChange from 'on-change';
import * as yup from 'yup';
import i18n from 'i18next';
import resources from './locales/index.js';
import {
  renderModal, renderInfo, blockBottom, renderPost, renderFeed,
} from './view.js';
import { normalizationRSSObject, normalizationPosts } from './data-normalization.js';
import dowonloadStream from './dowonload-stream.js';
import { DOMparser, parser } from './parser.js';

const elements = {
  form: document.querySelector('[class="rss-form text-body"]'),
  input: document.querySelector('#url-input'),
  infoMassage: document.querySelector('[class="feedback m-0 position-absolute small"]'),
  buttonForm: document.querySelector('[class="h-100 btn btn-lg btn-primary px-sm-5"]'),
  posts: document.querySelector('[class="col-md-10 col-lg-8 order-1 mx-auto posts"]'),
  feeds: document.querySelector('[class="col-md-10 col-lg-4 mx-auto order-0 order-lg-1 feeds"]'),
  modal: document.getElementById('modal'),
};

const state = {
  feeds: [],
  urls: [],
  massage: '',
  processState: '',
  posts: [],
};

const getPosts = () => state.posts;
const getUrls = () => state.urls;

const obserward = onChange(state, (path, value) => {
  switch (path) {
    case 'posts':
      renderPost(elements, value);
      break;

    case 'processState':
      blockBottom(elements, value);
      break;

    case 'massage':
      renderInfo(elements, value);
      break;

    case 'feeds':
      renderFeed(elements, value);
      break;

    default:
      break;
  }
});

const defaultLanguage = 'ru';
const i18nInstance = i18n.createInstance();
i18nInstance.init({
  lng: defaultLanguage,
  debug: false,
  resources,
});

yup.setLocale({
  string: {
    url: i18nInstance.t('errors.url'),
  },
  mixed: {
    notOneOf: i18nInstance.t('errors.created'),
  },
});

const validate = (value, urlLists) => {
  const schema = yup.object().shape({
    website: yup.string().url().notOneOf([urlLists]),
  });
  const result = schema.validate({ website: value }, { abortEarly: false });
  return result;
};

const updatedPosts = (element) => {
  const id = element.getAttribute('data-id');
  const posts = getPosts();
  const updatedPosts = posts.reduce((acc, post) => {
    if (post.id === id) {
      post.state = 'viewed';
      acc.push(post);
      return acc;
    }
    acc.push(post);
    return acc;
  }, []);
  obserward.posts = updatedPosts;
};

export const linksEvent = () => {
  const links = document.querySelectorAll('[class="fw-bold"]');
  const arrLinks = Array.from(links);
  arrLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const click = e.target;
      updatedPosts(click);
      linksEvent();
    });
  });
};

const filterByIdPosts = (id) => {
  const posts = getPosts();
  const filterId = posts.filter((post) => post.id === id);
  const [result] = filterId;
  return { title: result.title, body: result.description, link: result.link };
};

export const createModal = (buttom) => {
  const id = buttom.getAttribute('data-id');
  const modalPost = filterByIdPosts(id);
  updatedPosts(buttom);
  linksEvent();
  renderModal(elements, modalPost);
};

let timeoutID;

const stopUpdatePost = () => clearTimeout(timeoutID);

export const findNewPosts = () => {
  stopUpdatePost();
  const urls = getUrls();
  urls.forEach((element) => {
    const { url } = element;
    const { feedId } = element;
    const oldPosts = getPosts();
    const oldPostsTitle = oldPosts.filter((post) => post.feedId === feedId)
      .map((post) => post.title);
    dowonloadStream(url, i18nInstance.t('errors.network'))
      .then((data1) => DOMparser(data1))
      .then((data2) => parser(data2))
      .then((data3) => {
        const { posts } = data3;
        const po = [];
        posts.forEach((post) => {
          if (!oldPostsTitle.includes(post.title)) {
            post.feedId = feedId;
            po.push(post);
          }
        });
        const normalizePo = normalizationPosts(po, feedId);
        const newPosts = normalizePo.concat(oldPosts);
        obserward.posts = newPosts;
        linksEvent();
      });
  });
  setTimeout(() => findNewPosts(state), 5000);
};

export const updatePost = (f) => {
  timeoutID = setTimeout(() => f(), 5000);
};

export const generateRss = (url) => {
  obserward.processState = 'loading';
  const urlLists = state.urls.map((element) => element.url);
  const validationResult = validate(url, urlLists);
  return validationResult.then(() => dowonloadStream(url, i18nInstance.t('errors.network')))
    .then((data1) => DOMparser(data1, i18nInstance.t('errors.invalidRSS')))
    .then((data2) => parser(data2))
    .then((data3) => normalizationRSSObject(data3, url))
    .then((data4) => {
      const {
        url, id, feed, posts,
      } = data4;
      const newPosts = state.posts.concat(posts);
      obserward.posts = newPosts;
      obserward.feeds.push({ feed, id });
      obserward.urls.push({ url, feedId: id });
      obserward.processState = 'ok';
      obserward.massage = { status: 'success', text: i18nInstance.t('success') };
    })
    .catch((e) => obserward.massage = { status: 'error', text: e.message });
};
