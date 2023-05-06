module.exports =  {
  transform: {
    // Needed due to an error with React-Markdown
    // https://stackoverflow.com/questions/70817646/jest-encountered-an-unexpected-token-syntaxerror-unexpected-token-export
    "^.+\\.(js|jsx)$": "babel-jest"
  }
};
