/* eslint-disable no-undef */
import { generateRss, createModal, linksEvent, updatePost, findNewPosts } from './rss-generator.js';

const form = document.querySelector('[class="rss-form text-body"]');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');
  generateRss(url).then(() => linksEvent());
  updatePost(findNewPosts);
});

const modal = document.getElementById('modal');
modal.addEventListener('show.bs.modal', (event) => {
  const button = event.relatedTarget;
  createModal(button);
});
