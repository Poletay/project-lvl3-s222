import isURL from 'validator/lib/isURL';
import 'bootstrap';
import axios from 'axios';
import render from './render';

let rss = [];

const parser = new DOMParser();

const streamURL = document.querySelector('.url-to-rss');
const addRssForm = document.querySelector('.add-form');

const unpackCDATA = str => str.replace('<![CDATA[', '').replace(']]>', '');

const checkUrl = (url) => {
  if (url === '') {
    streamURL.classList.remove('invalid');
  } else if (isURL(url)) {
    streamURL.classList.remove('invalid');
  } else {
    streamURL.classList.add('invalid');
  }
};

const addRSS = (rssXML) => {
  const getArticles = () => {
    let articlesList = [];
    const rssItems = rssXML.querySelectorAll('item');

    rssItems.forEach((article) => {
      const articleTitle = unpackCDATA(article.querySelector('title').innerHTML);
      const articleLink = unpackCDATA(article.querySelector('link').innerHTML);
      const articleDesc = unpackCDATA(article.querySelector('description').innerHTML);

      articlesList = [...articlesList, { articleTitle, articleLink, articleDesc }];
    });
    return articlesList;
  };

  const title = unpackCDATA(rssXML.querySelector('title').innerHTML);
  const description = unpackCDATA(rssXML.querySelector('description').innerHTML);
  const articles = getArticles();
  const newRssItem = { title, description, articles };
  rss = [...rss, newRssItem];
};

const fetchRss = (link) => {
  const cross = 'https://crossorigin.me/';
  const crossLink = `${cross}${link}`;
  return axios.get(crossLink).then(response => parser.parseFromString(response.data, 'text/xml'));
};

streamURL.addEventListener('keyup', () => checkUrl(streamURL.value));
addRssForm.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchRss(streamURL.value)
    .then((rssXML) => {
      addRSS(rssXML);
      render(rss);
      streamURL.value = '';
    }).catch((error) => {
      console.log({ error });
    });
});
