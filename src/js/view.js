export const renderErrors = (elements, error) => {
	elements.buttonForm.removeAttribute('disabled');
  elements.input.classList.add('is-invalid');
	console.log(elements.errorInfo)
	if (elements.errorInfo.classList.contains('text-success')) {
		elements.errorInfo.classList.toggle('text-success');
	}
	if (!elements.errorInfo.classList.contains('text-danger')) {
		elements.errorInfo.classList.add('text-danger');
	}
  elements.error.textContent = error;
};

export const renderClear = (elements) => {
  elements.form.reset();
  elements.input.focus();
};

const createDivFeedDomElements = (ul) => {
  const divFeeds = document.createElement('div');
  divFeeds.setAttribute('calss', 'col-md-10 col-lg-4 mx-auto order-0 order-lg-1 feeds');
  const divCard = document.createElement('div');
  divCard.setAttribute('class', 'card border-0');
  const divCardBody = document.createElement('div');
  divCardBody.setAttribute('class', 'card-body');
  const h2 = document.createElement('h2');
  h2.setAttribute('class', 'card-title h4');
  h2.textContent = 'Фиды';
  divCardBody.append(h2);
  divCard.append(divCardBody);
  divCard.append(ul);
  divFeeds.append(divCard);
  return divFeeds;
};

const createDivPostDomElements = (ul) => {
  const divFeeds = document.createElement('div');
  divFeeds.setAttribute('calss', 'col-md-10 col-lg-4 mx-auto order-0 order-lg-1 feeds');
  const divCard = document.createElement('div');
  divCard.setAttribute('class', 'card border-0');
  const divCardBody = document.createElement('div');
  divCardBody.setAttribute('class', 'card-body');
  const h2 = document.createElement('h2');
  h2.setAttribute('class', 'card-title h4');
  h2.textContent = 'Посты';
  divCardBody.append(h2);
  divCard.append(divCardBody);
  divCard.append(ul);
  divFeeds.append(divCard);
  return divFeeds;
};

const createLiFeedDomElement = (name, description) => {
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item border-0 border-end-0');
  const h3 = document.createElement('h3');
  h3.setAttribute('class', 'h6 m-0');
  h3.textContent = name;
  const p = document.createElement('p');
  p.setAttribute('class', 'm-0 small text-black-50');
  p.textContent = description;
  li.append(h3);
  li.append(p);
  return li;
};

const createLiPostsDomElement = (name, description, link, id) => {
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
  const a = document.createElement('a');
  a.setAttribute('class', 'fw-bold');
  a.setAttribute('href', link);
  a.setAttribute('data-id', id);
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  a.textContent = name;
  const button = document.createElement('button');
  button.setAttribute('class', 'btn btn-outline-primary btn-sm');
  button.setAttribute('type', 'button');
  button.setAttribute('data-id', id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.textContent = 'Просмотр';
  li.append(a);
  li.append(button);
  return li;
}

// { posts, id: generateId(), feedId: id }
export const renderRSS = (elements, state) => {
  elements.feeds.innerHTML = '';
	elements.posts.innerHTML = '';
  const { listOfFeeds } = state.formRSS;
  const { posts } = state.formRSS;
  const ulFeeds = document.createElement('ul');
  const ulPosts = document.createElement('ul');
  ulFeeds.setAttribute('class', 'list-group border-0 rounded-0');
  ulPosts.setAttribute('class', 'list-group border-0 rounded-0');
  listOfFeeds.forEach((feed) => {
    const { name, description } = feed.feed;
    const { id } = feed;
    const liFeed = createLiFeedDomElement(name, description);
    ulFeeds.append(liFeed);
    const postsInThisFeed = posts.filter((post) => id === post.feedId);
		// console.log(postsInThisFeed)
    /* const postsFeed = postsInThisFeed[0];
    const postElements = postsFeed.posts; */
    postsInThisFeed.forEach((el) => {
      const { name, description, link, id } = el;
      const liPosts = createLiPostsDomElement(name, description, link, id);
      ulPosts.append(liPosts);
    });
  });
  const divFeeds = createDivFeedDomElements(ulFeeds);
  const divPosts = createDivPostDomElements(ulPosts);
  elements.feeds.append(divFeeds);
  elements.posts.append(divPosts);
};

export const renderBotton = (elements, value) => {
  const botton = elements.buttonForm;
	if (value === 'loading') {
		botton.setAttribute('disabled', '');
		return;
	}
	botton.removeAttribute('disabled');
	if (elements.errorInfo.classList.contains('text-danger')) {
		elements.errorInfo.classList.toggle('text-danger');
	}
	if (!elements.errorInfo.classList.contains('text-success')) {
		elements.errorInfo.classList.add('text-success');
	}
	elements.errorInfo.textContent = value;
};
//text-success

//li class: list-group-item d-flex justify-content-between align-items-start border-0 border-end-0
// <a> href class="fw-bold" data-id target="_blank" rel="noopener noreferrer"
// <button> type="button" class="btn btn-outline-primary btn-sm" data-id data-bs-toggle="modal" data-bs-target="#modal"
/*
export default (elements) => (path, value, prevValue) => {
	console.log(prevValue)
  elements.input.classList.remove('is-invalid');
  elements.error.textContent = "";
  switch (path) {
    case 'form.processState':
      // handleProcessState(elements, value);
      break;

    case 'formRSS.listOfFeeds':
      renderFeed(elements, value);
      break;

    case 'formRSS.errors':
      renderErrors(elements, value);
      break;

    case 'formRSS.listOfFeedsUrl':
      console.log('RSS добавлен на страницу');
      renderRSS(elements);
      break;

    default:
      break;
  }
};
*/
