export function getPublicPath() {
  let result = window.__webpack_public_path__;

  // guess cdn prefix by find current executing file
  const filePath = '/vendors.js';
  const currentScript = document.querySelector(`script[src$="${filePath}"]`);
  if (currentScript) {
    const src = currentScript.getAttribute('src');
    const idx = src.lastIndexOf(filePath);

    result = src.substring(0, idx + 1);
  }

  return result;
}
