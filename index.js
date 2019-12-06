// eslint-disable-next-line consistent-return
async function getData() {
  const source = 'https://api.taboola.com/1.2/json/apitestaccount/recommendations.get?app.type=web&app.apikey=7be65fc78e52c11727793f68b06d782cff9ede3c&source.id=%2Fdigiday-publishing-summit%2F&source.url=https%3A%2F%2Fblog.taboola.com%2Fdigiday-publishing-summit%2F&source.type=text&placement.organic-type=mix&placement.visible=true&placement.available=true&placement.rec-count=6&placement.name=Below%20Article%20Thumbnails&placement.thumbnail.width=640&placement.thumbnail.height=480&user.session=init';
  try {
    const response = await fetch(source);
    if (response.ok) {
      const data = await response.json();
      return data.list;
    }
  } catch (error) {
    console.log(error);
  }
}

// I thought about inserting a random "Trending" string as category in case there
// was no category in the object, but having no category at all in some of the articles
// actually looked pretty good so I chose this way.
function generateCategory(articleObject) {
  const category = document.createElement('p');
  if (articleObject.categories && articleObject.categories.length > 0) {
    [category.innerText] = articleObject.categories;
  }
  return category;
}

function generateBranding(articleObject) {
  const branding = document.createElement('p');
  branding.innerText = articleObject.branding;
  return branding;
}

function generateSubtitle(articleObject) {
  const subtitle = document.createElement('div');
  subtitle.className = 'subtitle';
  subtitle.appendChild(generateBranding(articleObject));
  subtitle.appendChild(generateCategory(articleObject));
  return subtitle;
}

function generateTitle(articleObject) {
  const title = document.createElement('p');
  title.className = 'title';
  title.innerText = articleObject.name;
  return title;
}

function generateThumbnail(articleObject) {
  const thumbnail = document.createElement('img');
  thumbnail.className = 'thumbnail';
  thumbnail.src = articleObject.thumbnail[0].url;
  thumbnail.style.width = articleObject.thumbnail[0].width;
  thumbnail.style.height = articleObject.thumbnail[0].height;
  thumbnail.alt = articleObject.description;
  return thumbnail;
}

function generateAnchor(articleObject) {
  const anchor = document.createElement('a');
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.className = 'link';
  anchor.href = articleObject.url;
  anchor.appendChild(generateThumbnail(articleObject));
  anchor.appendChild(generateTitle(articleObject));
  anchor.appendChild(generateSubtitle(articleObject));
  return anchor;
}

function generateArticle(articleObject) {
  const article = document.createElement('article');
  article.className = 'article';
  article.appendChild(generateAnchor(articleObject));
  return article;
}

async function populateGrid() {
  const list = await getData();
  const [container] = document.getElementsByTagName('main');
  if (!list) {
    container.innerText = 'There was an error fetching the data';
    return;
  }
  list.forEach((article) => {
    container.appendChild(generateArticle(article));
  });
}

populateGrid();
