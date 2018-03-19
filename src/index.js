const componentRssReader = () => {
  const mainBlock = document.createElement('div');
  mainBlock.classList.add('container');

  const jumboField = document.createElement('div');
  jumboField.classList.add('jumbotron');

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');

  const callRssForm = document.createElement('form');
  callRssForm.name = 'callRSS';

  const streamURL = document.createElement('input');
  streamURL.type = 'text';
  streamURL.name = 'streamURL';
  streamURL.placeholder = 'URL to RSS-Stream';
  streamURL.classList.add('form-control');

  const streamSubmit = document.createElement('input');
  streamSubmit.type = 'button';
  streamSubmit.name = 'streamSubmit';
  streamSubmit.value = 'Start';
  streamSubmit.classList.add('btn', 'btn-primary', 'btn-lg');

  inputGroup.appendChild(streamURL);
  inputGroup.appendChild(streamSubmit);
  callRssForm.appendChild(inputGroup);
  jumboField.appendChild(callRssForm);
  mainBlock.appendChild(jumboField);

  return mainBlock;
};

document.body.appendChild(componentRssReader());
