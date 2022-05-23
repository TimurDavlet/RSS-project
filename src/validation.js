import * as yup from 'yup';

const validate = (link, links) => {
  const schema = yup.string().url('link').notOneOf(links, 'uniq').required();
  return schema.validate(link).then(() => null).catch((e) => {
    throw new Error(e.errors[0]);
  });
};

export default validate;
