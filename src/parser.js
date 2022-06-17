/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

const getItem = (element) => ({
  postTitle: element.querySelector('title')?.textContent,
  postDescription: element.querySelector('description')?.textContent,
  postLink: element.querySelector('link')?.textContent,
  postId: element.querySelector('guid')?.textContent,
});

export default (data, state) => {
  const domParser = new DOMParser();
  const xmlDocument = domParser.parseFromString(data, 'application/xml');
  if (xmlDocument.querySelector('parsererror')) {
    state.feedback.error = 'parseError';
    throw new Error('parseError');
  }
  return {
    feedTitle: xmlDocument.querySelector('title')?.textContent,
    feedDescription: xmlDocument.querySelector('description')?.textContent,
    feedItems: [...xmlDocument.querySelectorAll('item')].map(getItem),
  };
};
