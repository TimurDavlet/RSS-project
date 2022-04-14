import axios from 'axios';

export default (feed, massage) => axios({
  method: 'get',
  url: `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed)}`,
  responseType: 'json',
})
  .then((response) => response.data).catch(() => {
    throw new Error(massage);
  });
