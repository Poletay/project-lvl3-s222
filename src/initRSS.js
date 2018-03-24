import isURL from 'validator/lib/isURL';
import render from './render';
import { addRSS, updateArticles } from './rssManager';


export default () => {
  const streamURL = document.querySelector('.url-to-rss');
  const rssForm = document.querySelector('.add-form');
  const formStatesList = {
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
    formState: formStatesList.valid,
  };

  const setFormState = (url) => {
    if (url === '') {
      state.formState = formStatesList.valid;
    } else if (isURL(url)) {
      state.formState = formStatesList.valid;
    } else {
      state.formState = formStatesList.invalid;
    }
  };

  const update = () => {
    updateArticles(state.rssState)
      .then(() => {
        render(state.rssState);
        setTimeout(update, 5000);
      })
      .catch((error) => {
        console.log({ error });
        setTimeout(update, 5000);
      });
  };

  streamURL.addEventListener('input', () => {
    setFormState(streamURL.value);
    state.formState.applyStyle(streamURL);
  });

  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.formState.submitAction(streamURL.value, state.rssState)
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
