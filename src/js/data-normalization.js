/* eslint-disable no-param-reassign */
import uniqueId from 'lodash/uniqueId.js';

const generateId = () => uniqueId();

export const normalizationRSSObject = (object, url) => {
  const id = generateId();
  const { feed } = object;
  const { posts } = object;
  posts.map((item) => {
    item.state = 'unviewed';
    item.id = generateId();
    item.feedId = id;
    return item;
  });
  return {
    url, feed, id, posts,
  };
};

export const normalizationPosts = (posts, feedId) => {
  posts.map((item) => {
    const id = generateId();
    item.id = id;
    item.feedId = feedId;
    return item;
  });
  return posts;
};
