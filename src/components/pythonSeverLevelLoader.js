class PythonSeverLevelLoader {
  static async load(url = './assets/levels') {
    fetch(url)
      .then(async response => {
        const parser = new DOMParser();
        const availableLevelsPage = parser.parseFromString(await response.text(), 'text/html');

        const levels = Array.from(availableLevelsPage.querySelectorAll('li'))
          .map(element => element.textContent)
          .filter(file => file.endsWith('.json'))
          .map(file => {
            return {
              name: file.replace(`\.json$`, ''),
              url: `${url.replace(/\/$/, '')}/${file}`,
            };
          });

        return new this(levels);
      })
      .catch(err => {
        console.error('failed to load levels. Server not started with `python3 -m http.server`?', err);

        return new this([]);
      });
  }

  constructor(levels) {
    this.levels = levels;
  }
}
