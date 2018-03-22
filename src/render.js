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

const renderArticles = (rssItem, list) => {
  const mkListItem = (item) => {
    const articleListEl = document.createElement('li');
    articleListEl.classList.add('list-group-item');

    const articleItem = document.createElement('a');
    articleItem.innerHTML = item.articleTitle;
    articleItem.href = item.articleLink;

    articleListEl.appendChild(articleItem);

    return articleListEl;
  };
  rssItem.articles.forEach(item => list.appendChild(mkListItem(item)));
};


export default (rss) => {
  const listRss = document.querySelector('#rsslist');
  const listArticles = document.querySelector('#articleslist');
  listRss.innerHTML = '';
  listArticles.innerHTML = '';

  rss.forEach((rssItem) => {
    renderRss(rssItem, listRss);
    renderArticles(rssItem, listArticles);
  });
};
