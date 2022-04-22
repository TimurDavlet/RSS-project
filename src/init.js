import i18next from 'i18next';
import resources from './locales/index.js';
import app from './app.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    resources,
  }).then(app(i18nextInstance));
};
