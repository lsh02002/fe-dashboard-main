export function isalnum(str) {
  for (var i = 0; i < str.length; i++) {
    var char1 = str.charAt(i);
    var cc = char1.charCodeAt(0);

    if ((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123)) {
    } else {
      return false;
    }
  }

  return true;
}
