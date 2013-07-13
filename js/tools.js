function qsa (selector) {
  return document.querySelectorAll(selector);
}

function qs (selector) {
  return document.querySelector(selector);
}

function makeNewElement (type) {
  if (!type) {
    return document.createElement("div");
  }

  switch (type) {
    case "div":
      return document.createElement("div");
    case "canvas":
      return document.createElement("canvas");
  }
}