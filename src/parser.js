/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
const getItem = (element) => ({
  postTitle: element.querySelector('title')?.textContent,
  postDescription: element.querySelector('description')?.textContent,
  postLink: element.querySelector('link')?.textContent,
  postId: element.querySelector('guid')?.textContent,
});

export default (data, feedback, i18n) => {
  try {
    const domParser = new DOMParser();
    const xmlDocument = domParser.parseFromString(data, 'application/xml');
    if (xmlDocument.querySelector('parsererror')) {
      throw new Error(i18n.t('errors.invalidRSS'));
    }
    return {
      feedTitle: xmlDocument.querySelector('title')?.textContent,
      feedDescription: xmlDocument.querySelector('description')?.textContent,
      feedItems: [...xmlDocument.querySelectorAll('item')].map(getItem),
    };
  } catch (e) {
    feedback.error = i18n.t('errors.invalidRSS');
    return null;
  }
};
