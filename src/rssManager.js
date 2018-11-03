import axios from 'axios';
import _ from 'lodash';

const parseXML = (xml) => {
  const parser = new DOMParser();
  return parser.parseFromString(xml, 'text/xml');
};

const fetchRss = link => axios.get(`https://crossorigin.me/${link}`);

const unpackCDATA = str => str.replace('<![CDATA[', '').replace(']]>', '');

const getArticles = (rssDOM, currentArtList) => {
  const articlesList = currentArtList;
  const rssItems = rssDOM.querySelectorAll('item');

  rssItems.forEach((article) => {
    const articleTitle = unpackCDATA(article.querySelector('title').innerHTML);
    const articleLink = unpackCDATA(article.querySelector('link').innerHTML);
    const articleDesc = article.querySelector('description')
      ? unpackCDATA(article.querySelector('description').innerHTML)
      : 'Description is not defined';

    articlesList.push({ articleTitle, articleLink, articleDesc });
  });
  return articlesList;
};

export const updateArticles = (state) => {
  const curState = state;
  console.log('Article list is updated.');

  const result = Promise.all(state.map((item, i) => fetchRss(item.rssLink)
    .then((res) => {
      const rssDOM = parseXML(res.data);
      curState[i].articles = _.unionBy(
        curState[i].articles,
        getArticles(rssDOM, curState[i].articles),
        'articleLink',
      );
      return state[i].articles;
    })
    .catch(error => console.log({ error }))));
  return result;
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
      console.log('New RSS channel was added.');
    });

  return result;
};
