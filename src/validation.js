import * as yup from 'yup';

const validate = (link, links, state) => {
  const schema = yup.string().url('link').notOneOf(links, 'uniq').required();
  return schema.validate(link).then(() => null).catch((e) => {
    const error = `${e.errors[0]}Error`;
    // eslint-disable-next-line no-param-reassign
    state.feedback.error = error;
    throw new Error(e.errors[0]);
  });
};

export default validate;
