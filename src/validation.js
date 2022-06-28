import * as yup from 'yup';

const validate = (link, links) => {
  yup.setLocale({
    string: {
      url: 'linkError',
    },
    mixed: {
      notOneOf: 'uniqError',
    },
  });

  const schema = yup.string().url().notOneOf(links).required();
  return schema.validate(link).then(() => null);
};

export default validate;
