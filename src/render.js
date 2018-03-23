const renderRss = (rssItem, list) => {
  const listEl = document.createElement('li');
  listEl.classList.add('list-group-item');

  const descEl = document.createElement('div');
  descEl.classList.add('alert', 'alert-secondary');
  descEl.innerHTML = rssItem.description;
  listEl.innerHTML = rssItem.title;
  listEl.appendChild(descEl);
  list.appendChild(listEl);
};

const renderArticles = (rssItem, list, modalBody) => {
  const modal = modalBody;
  const mkListItem = (item) => {
    const articleListEl = document.createElement('li');
    articleListEl.classList.add('list-group-item');

    const articleItem = document.createElement('a');
    articleItem.classList.add('article-link');
    articleItem.innerHTML = item.articleTitle;
    articleItem.href = item.articleLink;

    const modalDescButton = document.createElement('button');
    modalDescButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'btn-launch-modal');
    modalDescButton.dataset.toggle = 'modal';
    modalDescButton.dataset.target = '#modal';
    modalDescButton.innerHTML = 'Desc';
    modalDescButton.addEventListener('mousedown', () => {
      modal.textContent = item.articleDesc;
    });

    articleListEl.appendChild(articleItem);
    articleListEl.appendChild(modalDescButton);

    return articleListEl;
  };
  rssItem.articles.forEach(item => list.appendChild(mkListItem(item)));
};

export default (state) => {
  const listRss = document.querySelector('#rsslist');
  const listArticles = document.querySelector('#articleslist');
  const modalBody = document.querySelector('.modal-body');

  listRss.innerHTML = '';
  listArticles.innerHTML = '';

  state.forEach((rssItem) => {
    renderRss(rssItem, listRss);
    renderArticles(rssItem, listArticles, modalBody);
  });
};
