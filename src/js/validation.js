import * as yup from 'yup';

const validate = async (link, links, i18n) => {
  const schema = yup.string().url(i18n.t('errors.url')).notOneOf(links, i18n.t('errors.created')).required();
  try {
    await schema.validate(link);
    return null;
  } catch (e) {
    return e.message;
  }
};

export default validate;
