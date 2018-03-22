import isURL from 'validator/lib/isURL';
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

const addStream = (stream) => {
  const getArticles = () => {
    let articlesList = [];
    const rssItems = stream.querySelectorAll('item');

    rssItems.forEach((article) => {
      const articleTitle = unpackCDATA(article.querySelector('title').innerHTML);
      const articleLink = unpackCDATA(article.querySelector('link').innerHTML);

      articlesList = [...articlesList, { articleTitle, articleLink }];
    });
    return articlesList;
  };

  const title = unpackCDATA(stream.querySelector('title').innerHTML);
  const description = unpackCDATA(stream.querySelector('description').innerHTML);
  const articles = getArticles();
  const newRssItem = { title, description, articles };
  rss = [...rss, newRssItem];
};

const fetchRss = (link) => {
  const result = new Promise((resolve, reject) => {
    const cross = 'https://crossorigin.me/';
    const crossLink = `${cross}${link}`;
    axios.get(crossLink)
      .then((response) => {
        resolve(parser.parseFromString(response.data, 'application/xml'));
      })
      .catch((error) => {
        reject(error);
      });
  });
  return result;
};

streamURL.addEventListener('keyup', () => checkUrl(streamURL.value));
addRssForm.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchRss(streamURL.value)
    .then((rssData) => {
      addStream(rssData);
      render(rss);
    }).catch((error) => {
      console.log({ error });
    });
  streamURL.value = '';
});
