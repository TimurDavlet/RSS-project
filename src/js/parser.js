export default (domObj) => {
  const data = {
    feed: {
      name: '',
      description: '',
      link: '',
    },
    posts: [],
  };
  const channel = domObj.querySelector('channel');
  const channelChild = Array.from(channel.children);
  channelChild.forEach((element) => {
    switch (element.localName) {
      case 'title':
        data.feed.name = element.innerHTML ?? '';
        break;
      case 'description':
        data.feed.description = element.innerHTML ?? '';
        break;
      case 'link':
        data.feed.link = element.innerHTML ?? '';
        break;

      default:
        break;
    }
  });
  channelChild.filter((element) => element.localName === 'item').forEach((item) => {
    const itemChild = Array.from(item.children);
    const postObj = {};
    itemChild.forEach((element) => {
      switch (element.localName) {
        case 'title':
          postObj.name = element.innerHTML ?? '';
          break;
        case 'description':
          postObj.description = element.innerHTML ?? '';
          break;
        case 'link':
          postObj.link = element.innerHTML ?? '';
          break;

        default:
          break;
      }
    });
    data.posts.push(postObj);
  });
  return data;
};
