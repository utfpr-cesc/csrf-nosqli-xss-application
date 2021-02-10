function output(msg, className = '', elementSelector = '#message') {
  const outputElement = document.querySelector(elementSelector);
  outputElement.innerHTML = msg;
  outputElement.className = className;
}

function getQueryParam(paramName) {
  return new URL(location).searchParams.get(paramName) || '';
}
