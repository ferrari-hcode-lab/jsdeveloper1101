const utils = {
  appendTemplate(element, tagName, html) {
    const wrapElement = document.createElement(tagName);

    wrapElement.innerHTML = html;

    element.append(wrapElement);

    return wrapElement;
  },

  getQueryString(url) {
    const queryString = {};

    if (url) {
      url
        .split("?")[1]
        .split("&")
        .forEach((param) => {
          param = param.split("=");
          queryString[param[0]] = decodeURIComponent(param[1]);
        });
    }

    return queryString;
  },
};

module.exports = utils;
