import routes from './routes.js';
import { IsEmpty } from './UtilsUniversal.js';

const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splitedUrl = this._urlSplitter(url);
    return this._urlCombiner(splitedUrl);
  },
 
  parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    return this._urlSplitter(url);
  },
 
  _urlSplitter(url) {
    const urlsSplits = url.split('/');
    return {
      resource: urlsSplits[1] || null,
      lang: urlsSplits[2] || null,
    };
  },
 
  _urlCombiner(splitedUrl) {
    return (splitedUrl.resource ? `/${splitedUrl.resource}` : '/')
    + (splitedUrl.lang ? `/${splitedUrl.lang}` : '');
  },
};

class SpaSimulate {
  constructor({ content }) {
    this._content = content;
  }

  async renderPage() {
    const
      url = UrlParser.parseActiveUrlWithCombiner(),
      page = IsEmpty(routes[url]) ? routes["/404"] : routes[url],
      urlsSplits = url.split('/');

    this._content.innerHTML = await page.Render(urlsSplits[2]);
    await page.AfterRender(urlsSplits[2]);
  }

};

export default SpaSimulate;