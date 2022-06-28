/* eslint-disable no-param-reassign */
const clear = (elements) => {
  elements.input.classList.remove('is-invalid');
  elements.input.classList.remove('text-success');
  elements.feedback.classList.remove('text-danger');
  elements.feedback.classList.remove('text-success');
};

const renderError = (elements, value, i18n) => {
  if (value === null) {
    return;
  }
  const error = i18n.t(`errors.${value}`);
  clear(elements);
  elements.feedback.textContent = error;
  elements.input.classList.add('is-invalid');
  elements.feedback.classList.add('text-danger');
};

const renderSuccess = (elements, value) => {
  if (value === null) {
    return;
  }
  clear(elements);
  elements.feedback.textContent = value;
  elements.feedback.classList.add('text-success');
  elements.input.value = '';
  elements.input.focus();
};

const createTitle = (field, title) => {
  if (field.querySelector('.card')) {
    return;
  }
  const div = document.createElement('div');
  field.appendChild(div);
  div.classList.add('card', 'border-0');
  const ul = document.createElement('ul');
  const card = document.createElement('div');
  div.appendChild(card);
  card.classList.add('card-body');
  div.appendChild(ul);
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const h2 = document.createElement('h2');
  card.appendChild(h2);
  h2.classList.add('card-title', 'h4');
  h2.textContent = title;
};

const renderPosts = (elements, posts) => {
  const fieldPost = elements.posts;
  const ul = fieldPost.querySelector('.list-group');
  posts.forEach((post) => {
    const {
      postTitle, postLink, postId,
    } = post;
    const li = document.createElement('li');
    const link = document.createElement('a');
    const button = document.createElement('button');
    ul.prepend(li);
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    li.prepend(link);
    link.setAttribute('href', postLink);
    link.classList.add('fw-bold');
    link.setAttribute('data-id', postId);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.textContent = postTitle;
    li.appendChild(button);
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'btn-modal');
    button.setAttribute('data-id', postId);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = 'Просмотр';
  });
};

const renderFeeds = (elements, feeds, i18n) => {
  const fieldFeed = elements.feeds;
  createTitle(fieldFeed, i18n.t('titles.feedName'));
  createTitle(elements.posts, i18n.t('titles.postName'));
  const ul = fieldFeed.querySelector('.list-group');
  ul.innerHTML = '';
  feeds.forEach((feed) => {
    const { feedDescription, feedTitle } = feed;
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    ul.prepend(li);
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.appendChild(h3);
    h3.classList.add('h6', 'm-0');
    h3.textContent = feedTitle;
    li.appendChild(p);
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feedDescription;
  });
};

const blockInput = (elements, value) => {
  if (value === 'loading') {
    elements.input.setAttribute('readonly', value);
    elements.submitButton.setAttribute('disabled', '');
  } else {
    elements.input.removeAttribute('readonly');
    elements.submitButton.removeAttribute('disabled');
  }
};

const renderProcess = (elements, value, i18n) => {
  if (value === 'success') {
    const success = i18n.t('success');
    renderSuccess(elements, success);
  } else if (value === 'Error') {
    blockInput(elements, value);
  }
  blockInput(elements, value);
};

const renderVisitedPosts = (visitedPostsId) => {
  visitedPostsId.forEach((id) => {
    const a = document.querySelector(`a[data-id="${id}"]`);
    a.classList.remove('fw-bold');
    a.classList.add('fw-normal', 'link-secondary');
  });
};

const renderCurrentModal = (elements, obj) => {
  const { posts, currentId } = obj;
  const currentPost = posts.find((post) => post.postId === currentId);
  const modalTitle = elements.modal.querySelector('.modal-title');
  const modalBody = elements.modal.querySelector('.modal-body');
  const modalLink = elements.modal.querySelector('.full-article');

  modalTitle.textContent = currentPost.postTitle;
  modalBody.textContent = currentPost.postDescription;
  modalLink.setAttribute('href', currentPost.postLink);
};

const render = (elements, i18n) => (path, value) => {
  switch (path) {
    case 'feedback.error':
      renderError(elements, value, i18n);
      break;

    case 'feeds':
      renderFeeds(elements, value, i18n);
      break;

    case 'newPosts':
      renderPosts(elements, value.reverse());
      break;

    case 'processState':
      renderProcess(elements, value, i18n);
      break;

    case 'currentPostId':
      renderCurrentModal(elements, value);
      break;

    case 'visitedPostsId':
      renderVisitedPosts(value);
      break;

    default:
      break;
  }
};

export default render;
