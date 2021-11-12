export const createElementWithOptions = (
  tagName,
  classList = null,
  textContent = null
) => {
  const tag = document.createElement(tagName);
  if (classList) tag.classList.add(...classList);
  if (textContent) tag.textContent = textContent;
  return tag;
};
