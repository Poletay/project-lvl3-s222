import axios from 'axios';

const parseXML = (xml) => {
  const parser = new DOMParser();
  return parser.parseFromString(xml, 'text/xml');
};

const fetchRss = link => axios.get(`https://crossorigin.me/${link}`);

const unpackCDATA = str => str.replace('<![CDATA[', '').replace(']]>', '');

export const updateArticles = (state) => {
  const curState = state;
  const getArticles = (rssDOM) => {
    const articlesList = [];
    const rssItems = rssDOM.querySelectorAll('item');

    rssItems.forEach((article) => {
      const articleTitle = unpackCDATA(article.querySelector('title').innerHTML);
      const articleLink = unpackCDATA(article.querySelector('link').innerHTML);
      const articleDesc = article.querySelector('description') ?
        unpackCDATA(article.querySelector('description').innerHTML) :
        'Description is not defined';

      articlesList.push({ articleTitle, articleLink, articleDesc });
    });
    return articlesList;
  };

  return Promise.all(state.map((item, i) => {
    const result = new Promise((resolve, reject) => {
      fetchRss(item.rssLink)
        .then((res) => {
          const rssDOM = parseXML(res.data);
          curState[i].articles = getArticles(rssDOM);
          resolve(state[i].articles);
        })
        .catch(error => reject(error));
    });
    return result;
  }));
};

export const addRSS = (rssLink, state) => {
  const result = fetchRss(rssLink)
    .then((res) => {
      const rssDOM = parseXML(res.data);
      const title = unpackCDATA(rssDOM.querySelector('title').innerHTML);
      const description = unpackCDATA(rssDOM.querySelector('description').innerHTML);
      const articles = [];
      const newRssItem = {
        title, description, rssLink, articles,
      };

      state.push(newRssItem);
    });

  return result;
};
