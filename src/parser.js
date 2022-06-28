/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

const getItem = (element) => ({
  postTitle: element.querySelector('title')?.textContent,
  postDescription: element.querySelector('description')?.textContent,
  postLink: element.querySelector('link')?.textContent,
  postId: element.querySelector('guid')?.textContent,
});

export default (data) => {
  const domParser = new DOMParser();
  const xmlDocument = domParser.parseFromString(data, 'application/xml');
  if (xmlDocument.querySelector('parsererror')) {
    const error = new Error();
    error.name = 'parseError';
    error.message = 'Does not contain valid RSS';
    error.isParsingError = true;
    throw error;
  }
  return {
    feedTitle: xmlDocument.querySelector('title')?.textContent,
    feedDescription: xmlDocument.querySelector('description')?.textContent,
    feedItems: [...xmlDocument.querySelectorAll('item')].map(getItem),
  };
};
