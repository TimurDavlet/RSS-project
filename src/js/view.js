/* eslint-disable no-undef */
import isEmpty from 'lodash/isEmpty.js';

export const renderInfo = (elements, massage) => {
  const { buttonForm, input, infoMassage } = elements;
  buttonForm.classList.remove('disabled');
  if (massage.status === 'error') {
    input.removeAttribute('class');
    input.setAttribute('class', 'form-control w-100 is-invalid');
    infoMassage.removeAttribute('class');
    infoMassage.setAttribute('class', 'feedback m-0 position-absolute small text-danger');
  } else {
    input.removeAttribute('class');
    input.setAttribute('class', 'form-control w-100');
    infoMassage.removeAttribute('class');
    infoMassage.setAttribute('class', 'feedback m-0 position-absolute small text-success');
  }
  infoMassage.textContent = massage.text;
};

export const renderClearForm = (elements) => {
  const { buttonForm, form, input } = elements;
  buttonForm.classList.remove('disabled');
  form.reset();
  input.focus();
};

export const blockBottom = (elements, value) => {
  const { buttonForm } = elements;
  if (value === 'loading') {
    buttonForm.classList.add('disabled');
  } else {
    buttonForm.classList.remove('disabled');
    renderClearForm(elements);
  }
};

const createDiv = (parrent, name) => {
  const divCard = document.createElement('div');
  divCard.setAttribute('class', 'card border-0');
  const divTitle = document.createElement('div');
  divTitle.setAttribute('class', 'card-body');
  const h2 = document.createElement('h2');
  h2.setAttribute('class', 'card-title h4');
  h2.textContent = name;
  const ul = document.createElement('ul');
  ul.setAttribute('class', 'list-group border-0 rounded-0');
  divTitle.append(h2);
  divCard.append(divTitle);
  divCard.append(ul);
  parrent.append(divCard);
};

const getFeed = (value) => value.feed;

const addFeed = (parrent, value) => {
  const ul = parrent.querySelector('ul');
  ul.innerHTML = '';
  value.forEach((element) => {
    const feed = getFeed(element);
    const { title, description } = feed;
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item border-0 border-end-0');
    const h3 = document.createElement('h3');
    h3.setAttribute('class', 'h6 m-0');
    h3.textContent = title;
    const p = document.createElement('p');
    p.setAttribute('class', 'm-0 small text-black-50');
    p.textContent = description;
    li.append(h3);
    li.append(p);
    ul.append(li);
  });
};

const addPosts = (parrent, value) => {
  const ul = parrent.querySelector('ul');
  ul.innerHTML = '';
  value.forEach((elements) => {
    const {
      id, link, title, state,
    } = elements;
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
    const a = document.createElement('a');
    if (state === 'viewed') {
      a.setAttribute('class', 'fw-normal');
    } else {
      a.setAttribute('class', 'fw-bold');
    }
    a.setAttribute('href', link);
    a.setAttribute('data-id', id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = title;
    const bottom = document.createElement('bottom');
    bottom.setAttribute('type', 'bottom');
    bottom.setAttribute('class', 'btn btn-outline-primary btn-sm');
    bottom.setAttribute('data-id', id);
    bottom.setAttribute('data-bs-toggle', 'modal');
    bottom.setAttribute('data-bs-target', '#modal');
    bottom.textContent = 'Просмотр';
    li.append(a);
    li.append(bottom);
    ul.append(li);
  });
};

export const renderFeed = (elements, value) => {
  const { feeds } = elements;
  if (isEmpty(feeds.childNodes)) {
    createDiv(feeds, 'Фиды');
  }
  addFeed(feeds, value);
};

export const renderPost = (elements, value) => {
  const { posts } = elements;
  if (isEmpty(posts.childNodes)) {
    createDiv(posts, 'Посты');
  }
  addPosts(posts, value);
};

export const renderModal = (elements, modalPost) => {
  const { modal } = elements;
  const modalTitle = modal.querySelector('.modal-title');
  const modalBodyInput = modal.querySelector('.modal-body');
  const aboutLink = modal.querySelector('[class="btn btn-primary full-article"]');
  modalTitle.textContent = modalPost.title;
  modalBodyInput.textContent = modalPost.body;
  aboutLink.href = modalPost.link;
};
