const renderErrors = (elements, error) => {
  elements.input.classList.add('is-invalid');
  elements.error.textContent = error;
};

const renderRSS = (elements) => {
  elements.form.reset();
  elements.input.focus();
};

export default (elements) => (path, value, prevValue) => {
  elements.input.classList.remove('is-invalid');
  elements.error.textContent = "";
  switch (path) {
    case 'form.processState':
      // handleProcessState(elements, value);
      break;

    case 'form.processError':
      // handleProcessError();
      break;

    case 'formRSS.errors':
      renderErrors(elements, value);
      break;

    case 'formRSS.listOfFeeds':
      console.log('RSS добавлен на страницу');
      renderRSS(elements);
      break;

    default:
      break;
  }
};
