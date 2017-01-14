import Ember from "ember";

export function mime(params) {
  const isFolder = params[0];
  const path = params[1];

  if (isFolder) {
    return 'yellow folder open';
  } else {
    let ext = path.substring(path.lastIndexOf('.') + 1);
    if (!ext) {
      return 'cube';
    }
    if (ext === 'pdf') {
      return 'blue file pdf outline';
    }
    if (ext === 'js') {
      return 'blue code outline';
    }
    if (ext === 'xml') {
      return 'blue file code outline';
    }
    if (ext === 'png' || ext === "jpeg" || ext === "gif") {
      return 'blue camera retro';
    }
    if (ext === "html") {
      return 'blue html5';
    }
    if (ext === "css") {
      return 'blue css3';
    }
    return 'cube';
  }
}

export default Ember.Helper.helper(mime);
