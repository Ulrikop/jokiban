/**
 * Calls `document.addEventListener` and returns a method to remove the added listener;
 */
export function addEventListener(type, listener) {
  document.addEventListener(type, listener);

  return () => document.removeEventListener(type, listener);
}
