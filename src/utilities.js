window.utilities = {
  mapValues: function (obj, handler) {
    var result = {};

    Object.keys(obj).forEach(function (key) {
      result[key] = handler(obj[key], key);
    });

    return result;
  },

  template: function (string, attributes) {
    return Object.keys(attributes).reduce(function (result, key) {
      return result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), attributes[key]);
    }, string);
  },

  createElementFromHTML: function (htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild;
  },
};
