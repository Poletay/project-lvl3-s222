import isURL from 'validator/lib/isURL';
import render from './render';
import { addRSS, updateArticles } from './rssManager';


export default () => {
  const streamURL = document.querySelector('.url-to-rss');
  const rssForm = document.querySelector('.add-form');
  const rssState = [];
  const formStatesList = {
    valid: {
      applyStyle: element => element.classList.remove('invalid'),
      submitAction: (link) => {
        const result = addRSS(link, rssState).then(() => updateArticles(rssState));
        return result;
      },
    },
    invalid: {
      applyStyle: element => element.classList.add('invalid'),
      submitAction: () => {},
    },
  };

  let formState = formStatesList.valid;

  const setState = (url) => {
    if (url === '') {
      formState = formStatesList.valid;
    } else if (isURL(url)) {
      formState = formStatesList.valid;
    } else {
      formState = formStatesList.invalid;
    }
  };

  streamURL.addEventListener('input', () => {
    setState(streamURL.value);
    formState.applyStyle(streamURL);
  });

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formState.submitAction(streamURL.value)
      .then(() => {
        render(rssState);
        streamURL.value = '';
      })
      .catch((error) => {
        console.log({ error });
      });
  });
  setInterval(() => updateArticles(rssState), 5000);
};
