export function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function truncate(str, maxLength) {
    return str.length > maxLength ? `${str.substring(0, (maxLength-3))}...` : str;
}

export function addHandler(handler, type = 'click') {
  window.addEventListener(type, handler);
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

export function scrollToTargetAdjusted(id, offset=45){
  const element = document.getElementById(id);
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
       top: offsetPosition,
       behavior: "smooth"
  });
}

export function scrollToTarget(id){
  const elmnt = document.getElementById(id);
  if(elmnt) {
    elmnt.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}

export function indexOfNoDiacritic(array, word){
  const comparer = str1 => {
    if(str1) {
      // Note: zero means they are equivalent
      return str1.localeCompare(word, undefined, { sensitivity: 'base' }) === 0;
    }
    return false;
  };

  // const comparer = str1 => str1 === word;
  return array.findIndex(comparer);
}

/**
* Get the text for the node separated into lines.
*
* @param {object} element The element to get the text from
*/
export function getText(element) {
  try {
    const children = [];
 
    // If the node is text, then add the line
    if (element.nodeType === 3) {
      if (element.textContent && element.textContent.length > 0) {
        children.push(element.textContent);
      }
    }
 
    // Accumulate the children entries
    const childEntries = Array.from(element.childNodes).reduce(
      (accum, child) => accum.concat(...this.getText(child)),
      [],
    );
 
    children.push(...childEntries);
 
    // Return the content
    if (children) {
      return children;
    }
  } catch (err) {
    // If an exception happens, then just use the text content
    return [element.textContent];
  }
 
  return [element.textContent];
 }
 