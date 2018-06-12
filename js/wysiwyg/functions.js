
export var exec = function exec(command) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return document.execCommand(command, false, value);
}

export var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

export var addEventListener = function addEventListener(parent, type, listener) {
  return parent.addEventListener(type, listener);
};
export var appendChild = function appendChild(parent, child) {
  return parent.append(child);
};
export var createElement = function createElement(tag) {
  return document.createElement(tag);
};
export var queryCommandValue = function queryCommandValue(command) {
  return document.queryCommandValue(command);
};

export var queryCommandState = function queryCommandState(command) {
  return document.queryCommandState(command);
}

export var getUserSelection = function getUserSelection() {
  // get selection
  var userSelection;
  if (window.getSelection) {
    userSelection = document.getSelection();
  } else if (document.selection) { // should come last; Opera!
    userSelection = document.selection.createRange();
  }
  return userSelection
}

export var getRangeObject = function getRangeObject(_userSelection) {
  // get range
  var rangeObject
  if (_userSelection.getRangeAt)
    rangeObject = _userSelection.getRangeAt(0);
  else { // Safari!
    rangeObject = document.createRange();
    rangeObject.setStart(_userSelection.anchorNode, _userSelection.anchorOffset);
    rangeObject.setEnd(_userSelection.focusNode, _userSelection.focusOffset);
  }
  return rangeObject
}