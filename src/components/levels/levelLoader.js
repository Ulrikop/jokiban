import { Level } from './level.js';

export class LevelLoader {
  constructor({ url, listParser } = {}) {
    this.url = url || './assets/levels';
    this.listParser = listParser ? listParser : levels => levels;

    this.levelList = undefined;
    this.levels = {};
  }

  async list() {
    if (!this.levelList) {
      this.levelList = await this.loadAll();
    }

    // if levels are still not defined, the fetching failed
    return this.levelList || [];
  }

  async get(file) {
    if (!(file in this.levels)) {
      this.levels[file] = await this.load(file);
    }

    return this.levels[file];
  }

  async loadAll() {
    try {
      const response = await fetch(this.url);

      const content = await response.text();
      const levelFiles = await this.listParser(content);
      return levelFiles.map(file => {
        return {
          name: this.levelNameFromFile(file),
          file: file,
        };
      });
    } catch (err) {
      console.error('failed to load levels', err);
    }
  }

  async load(file) {
    const response = await fetch(`${this.url.replace(/\/$/, '')}/${file}`);
    const config = JSON.parse(await response.text());

    return new Level(this.levelNameFromFile(file), config);
  }

  levelNameFromFile(file) {
    return file.replace(/\.json$/, '');
  }
}
