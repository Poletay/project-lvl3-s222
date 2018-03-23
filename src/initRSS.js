import isURL from 'validator/lib/isURL';
import render from './render';
import { addRSS, updateArticles } from './rssManager';


export default () => {
  const streamURL = document.querySelector('.url-to-rss');
  const rssForm = document.querySelector('.add-form');
  const state = [];

  const checkUrl = (url) => {
    if (url === '') {
      streamURL.classList.remove('invalid');
    } else if (isURL(url)) {
      streamURL.classList.remove('invalid');
    } else {
      streamURL.classList.add('invalid');
    }
  };

  streamURL.addEventListener('input', () => checkUrl(streamURL.value));
  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addRSS(streamURL.value, state)
      .then(() => updateArticles(state)
        .then(() => {
          render(state);
          streamURL.value = '';
        }))
      .catch((error) => {
        console.log({ error });
      });
  });
};
