/* eslint-disable no-undef */
const getNode = (xml) => xml.querySelector('channel');
const getNodeParam = (node) => {
  const title = node.querySelector('title').textContent;
  const description = node.querySelector('description').textContent;
  const link = node.querySelector('link').textContent;
  return { title, description, link };
};
const getItems = (node) => {
  const items = node.querySelectorAll('item');
  return Array.from(items).map((item) => getNodeParam(item));
};

export const parser = (DOMxml) => {
  const node = getNode(DOMxml);
  const feedValue = getNodeParam(node);
  const postsValue = getItems(node);
  return { feed: feedValue, posts: postsValue };
};

export const DOMparser = (data, massage) => {
  const pars = new DOMParser();
  const domObject = pars.parseFromString(data.contents, 'application/xml');
  if (domObject.querySelector('parsererror') !== null) {
    throw new Error(massage);
  }
  return domObject;
};
