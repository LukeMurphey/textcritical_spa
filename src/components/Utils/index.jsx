export function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function truncate(str, maxLength) {
    return str.length > maxLength ? `${str.substring(0, (maxLength-3))}...` : str;
}
