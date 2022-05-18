import * as yup from 'yup';

const validate = (link, links, i18n) => {
  const schema = yup.string().url(i18n.t('errors.link')).notOneOf(links, i18n.t('errors.uniq')).required();
  return schema.validate(link).then(() => null).catch((e) => {
    throw new Error(e.errors[0]);
  });
};

export default validate;
