import isURL from 'validator/lib/isURL';
import render from './render';
import { addRSS, updateArticles } from './rssManager';


export default () => {
  const streamURL = document.querySelector('.url-to-rss');
  const rssForm = document.querySelector('.add-form');
  const formActions = {
    valid: {
      applyStyle: element => element.classList.remove('invalid'),
      submitAction: (link, rssState) => addRSS(link, rssState).then(() => updateArticles(rssState)),
    },
    invalid: {
      applyStyle: element => element.classList.add('invalid'),
      submitAction: () => {},
    },
  };

  const state = {
    rssState: [],
    formState: 'valid',
  };

  const setFormState = (url) => {
    if (url === '') {
      state.formState = 'valid';
    } else if (isURL(url)) {
      state.formState = 'valid';
    } else {
      state.formState = 'invalid';
    }
  };

  const update = () => {
    updateArticles(state.rssState)
      .then(() => {
        render(state.rssState);
      })
      .catch((error) => {
        console.log({ error });
      })
      .then(() => {
        setTimeout(update, 5000);
      });
  };

  streamURL.addEventListener('input', () => {
    setFormState(streamURL.value);
    formActions[state.formState].applyStyle(streamURL);
  });

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formActions[state.formState].submitAction(streamURL.value, state.rssState)
      .then(() => {
        render(state.rssState);
        streamURL.value = '';
      })
      .catch((error) => {
        console.log({ error });
      });
  });

  setTimeout(update, 5000);
};
