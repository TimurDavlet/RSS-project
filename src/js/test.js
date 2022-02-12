import keyBy from 'lodash/keyBy.js';
import has from 'lodash/has.js';
import isEmpty from 'lodash/isEmpty.js';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

// urls нельзя хардкодить: https://ru.hexlet.io/blog/posts/izbavlyaytes-ot-strok
const routes = {
  usersPath: () => '/users',
};

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

// Этот объект можно использовать для того, чтобы обрабатывать ошибки сети.
// Это необязательное задание, но крайне рекомендуем попрактиковаться.
const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

// Используйте эту функцию для выполнения валидации
// Выведите в консоль её результат, чтобы увидеть, как получить сообщения об ошибках
const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

// BEGIN (write your solution here)
const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'sent':
      elements.container.innerHTML = 'User Created!';
      break;

    case 'error':
      elements.submitButton.disabled = false;
      break;

    case 'sending':
      elements.submitButton.disabled = true;
      break;

    case 'filling':
      elements.submitButton.disabled = false;
      break;

    default:
      // https://ru.hexlet.io/blog/posts/sovershennyy-kod-defolty-v-svitchah
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const handleProcessError = () => {
  // вывести сообщение о сетевой ошибке
};

const renderErrors = (elements, errors, prevErrors) => {
  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    const error = errors[fieldName];
    // правильный путь - проверять модель, а не DOM. Модель - единый источник правды.
    const fieldHadError = has(prevErrors, fieldName);
    const fieldHasError = has(errors, fieldName);
    if (!fieldHadError && !fieldHasError) {
      return;
    }

    if (fieldHadError && !fieldHasError) {
      fieldElement.classList.remove('is-invalid');
      fieldElement.nextElementSibling.remove();
      return;
    }

    if (fieldHadError && fieldHasError) {
      const feedbackElement = fieldElement.nextElementSibling;
      feedbackElement.textContent = error.message;
      return;
    }

    fieldElement.classList.add('is-invalid');
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('invalid-feedback');
    feedbackElement.textContent = error.message;
    fieldElement.after(feedbackElement);
  });
};
// Представление не меняет модель.
// По сути, в представлении происходит отображение модели на страницу
// Для оптимизации рендер происходит точечно в зависимости от того, какая часть модели изменилась
const render = (elements) => (path, value, prevValue) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value);
      break;

    case 'form.processError':
      handleProcessError();
      break;

    case 'form.valid':
      elements.submitButton.disabled = !value;
      break;

    case 'form.errors':
      renderErrors(elements, value, prevValue);
      break;

    default:
      break;
  }
};

export default () => {
  const elements = {
    container: document.querySelector('[data-container="sign-up"]'),
    form: document.querySelector('[data-form="sign-up"]'),
    fields: {
      name: document.getElementById('sign-up-name'),
      email: document.getElementById('sign-up-email'),
      password: document.getElementById('sign-up-password'),
      passwordConfirmation: document.getElementById('sign-up-password-confirmation'),
    },
    submitButton: document.querySelector('input[type="submit"]'),
  };
  // Модель ничего не знает о контроллерах и о представлении. В ней не хранятся DOM-элементы.
  const state = onChange({
    form: {
      valid: true,
      processState: 'filling',
      processError: null,
      errors: {},
      fields: {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
    },
  }, render(elements));
  // Контроллеры меняют модель, тем самым вызывая рендеринг.
  // Контроллеры не должны менять DOM напрямую, минуя представление.
  Object.entries(elements.fields).forEach(([fieldName, fieldElement]) => {
    fieldElement.addEventListener('input', (e) => {
      const { value } = e.target;
      state.form.fields[fieldName] = value;
      const errors = validate(state.form.fields);
      state.form.errors = errors;
      state.form.valid = isEmpty(errors);
    });
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    state.form.processState = 'sending';
    state.form.processError = null;

    try {
      await axios.post(routes.usersPath());
      state.form.processState = 'sent';
    } catch (err) {
      // в реальных приложениях необходимо помнить об обработке ошибок сети
      state.form.processState = 'error';
      state.form.processError = errorMessages.network.error;
      throw err;
    }
  });
};
// END
