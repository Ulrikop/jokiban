export function parseLevelsFromPythonServer(content) {
  const parser = new DOMParser();
  const availableLevelsPage = parser.parseFromString(content, 'text/html');

  return Array.from(availableLevelsPage.querySelectorAll('li'))
    .map(element => element.textContent)
    .filter(file => file.endsWith('.json'));
}
