module.exports.pascalCase = (str) => {
  if (!str) return;
  const words = str.match(/[a-z]+/gi);
  return words
    .map(
      (word) =>
        'I' +
        word.charAt(0).toUpperCase() +
        word.substring(1).toLowerCase() +
        'Response'
    )
    .join('');
};

module.exports.kebabCase = (str) => {
  if (!str) return;
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .join('-')
    .toLowerCase();
};

module.exports.isOptional = (attributeValue) => {
  // arrays are never null
  if (attributeValue.relation === 'oneToMany' || attributeValue.repeatable) {
    return false;
  }
  return attributeValue.required !== true;
};
