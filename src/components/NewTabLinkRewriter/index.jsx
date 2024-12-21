/* eslint-disable no-param-reassign */
// https://github.com/uiwjs/react-md-editor/issues/445

const NewTabLinkRewriter = (node) => {
    if (node.type === "element" && node.tagName === "a") {
      node.properties = { ...node.properties, target: "_blank" };
    }
  }

export default NewTabLinkRewriter;
