export function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function truncate(str, maxLength) {
    return str.length > maxLength ? `${str.substring(0, (maxLength-3))}...` : str;
}

export function addHandler(handler, type = 'click') {
  window.addEventListener(type, (event) => handler(event));
}

export function removeHandler(handler, type = 'click') {
  window.removeEventListener(type, handler);
}
export function getAbsolutePosition(element) {
  const r = { x: element.offsetLeft, y: element.offsetTop };
  if (element.offsetParent) {
    const tmp = getAbsolutePosition(element.offsetParent);
    r.x += tmp.x;
    r.y += tmp.y;
  }
  return r;
};
