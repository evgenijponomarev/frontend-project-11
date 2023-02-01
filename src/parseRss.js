const parseString = (string) => string.replace('<![CDATA[', '').replace(']]', '');

const parseRss = (data) => {
  const result = new DOMParser().parseFromString(data.contents, 'text/xml');
  const channel = result.getElementsByTagName('channel')[0];
  const title = channel.getElementsByTagName('title')[0].textContent;
  const description = channel.getElementsByTagName('description')[0].textContent;
  const posts = [...channel.getElementsByTagName('item')].map((i) => ({
    title: parseString(i.getElementsByTagName('title')[0].textContent),
    description: parseString(i.getElementsByTagName('description')[0].textContent),
    link: i.getElementsByTagName('link')[0].textContent,
    timestamp: new Date(i.getElementsByTagName('pubDate')[0].textContent).valueOf(),
    isRead: false,
  }));

  return { title, description, posts };
};

export default parseRss;
