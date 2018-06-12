import {
  defaultActions,
  defaultClasses
} from './actions.js'
import {
  exec,
  _extends,
  addEventListener,
  appendChild,
  createElement,
  queryCommandValue,
  getUserSelection,
  getRangeObject
} from './functions.js'
import FileHistory from './file_history.js'

var DEBUG = true
var defaultParagraphSeparatorString = 'defaultParagraphSeparator';

var init = function init(settings) {
  rangy.init()

  var actions = settings.actions ? settings.actions.map(function (action) {
    if (typeof action === 'string') return defaultActions[action];
    else if (defaultActions[action.name]) return _extends({}, defaultActions[action.name], action);
    return action;
  }) : Object.keys(defaultActions).map(function (action) {
    return defaultActions[action];
  });

  var classes = _extends({}, defaultClasses, settings.classes);

  var defaultParagraphSeparator = settings[defaultParagraphSeparatorString] || 'div';

  var customFont = document.createElement('my-font')

  var actionbar = createElement('div');
  actionbar.className = classes.actionbar;
  appendChild(settings.element, actionbar);

  var statusbar = createElement('div')

  var content = settings.element.content = createElement('div');
  content.contentEditable = true;
  content.className = classes.content;


  /* Code below is for behavior using editor */

  /* What does this do? */
  // contenteditable key events
  content.oninput = function (_ref) {
    // var firstChild = _ref.target.firstChild;

    // if (firstChild && firstChild.nodeType === 3) exec('formatBlock', '<' + defaultParagraphSeparator + '>');
    // else if (content.innerHTML === '<br>') content.innerHTML = '';
    settings.onChange(content.innerHTML);

    // make sure there is always <br> at end of document

  };

  content.onmousedown = function (event) {
    let sel = getUserSelection()
    let range = getRangeObject(sel)

  }

  content.onmouseup = function (event) {
    // DEBUG && console.log("mouseup")
  }

  // if click anywhere in text editor don't lose focus on content
  $(actionbar).on("click", function (e) {;
    content.focus();
  }).mousedown(function (e) {
    e.preventDefault();
  })

  function pressTab() {
    event.preventDefault();
    // todo add Tab indent
  }

  function pressLeftRight() {
    let sel = getUserSelection()
    let range = getRangeObject(sel)
  }

  function pressEnter() {
    // later implement rangy
    let sel = getUserSelection()
    let range = getRangeObject(sel)

    event.preventDefault()
    let brToInsert1 = $("<br>").get(0)
    let brToInsert2 = $("<br>").get(0)

    // if last element is br
    function checkParent(_range) {
      return range.startContainer.tagName != null &&
        (range.startContainer.tagName == "PRE" ||
          range.startContainer.tagName == "BLOCKQUOTE")
    }

    sel.deleteFromDocument()
    var rangeChildNodes = range.startContainer.childNodes
    var isEmptyLine = [sel.baseNode.tagName, sel.focusNode.tagName, sel.anchorNode.tagName, sel.extentNode.tagName].every((val, i, arr) => val === arr[0])
    // sel.collapse(sel.focusNode, sel.focusOffset-1)
    var saved_selFocusNode = sel.focusNode
    var saved_selFocusOffset = sel.focusOffset

    // DEBUG && console.log("childnodeslength: " + range.endContainer.childNodes.length)
    // console.log("length:")

    if ( // if break in middle of line
      (sel.focusNode.length != null &&
        sel.focusOffset != sel.focusNode.length) ||
      // if break at end of line but not last line 
      (sel.focusOffset == sel.focusNode.length &&
        sel.focusNode.nextSibling != null &&
        sel.focusNode.nextSibling.tagName == "BR") ||
      !isEmptyLine ||
      (isEmptyLine && range.endOffset < range.endContainer.childNodes.length - 2)
    ) {
      range.insertNode(brToInsert1)
      range.setEndAfter(brToInsert1)
      range.collapse()
      // DEBUG && console.log("1 and 2")
    }
    // end of line of last line
    else if (checkParent(range)) {
      // DEBUG && console.log(3)
      //exec("outdent")
      // if haven't reached parent container
      var pbrToInsert
      pbrToInsert = $("<p>").append($("<br>")).get(0)

      var save_startContainer = range.startContainer
      var save_startOffset = range.startOffset

      range.setEndAfter(range.endContainer)
      range.collapse()

      if (checkParent(range)) {
        // DEBUG && console.log("ET has not returned home")

        // block within a block empty line don't exit
        // (isEmptyLine && range.endOffset < range.endContainer.childNodes.length)

        let nestedSelection = getUserSelection()
        let nestedRange = getRangeObject(nestedSelection)
        let nestedNodes = nestedRange.startContainer.childNodes
        let nestedNodesContainer = nestedNodes[nestedRange.startOffset - 1] // blockquote within the blockquote
        // DEBUG && console.log(nestedSelection)
        // DEBUG && console.log(nestedRange)

        // if last child not br, don't exit
        if (nestedNodesContainer.lastChild.nodeName != "BR") {
          // DEBUG && console.log(2.5)
          // nestedRange.setEnd()
          // range.insertNode(brToInsert1)
          // range.collapse()
        } else {
          let nodes_in_nest = nestedNodesContainer.childNodes
          // DEBUG && console.log(nodes_in_nest)
          // delete last br's if there are
          for (let i = nodes_in_nest.length - 1; i >= 0; --i) {
            // DEBUG && console.log(i)
            if (nodes_in_nest[i].tagName == "BR") {
              nestedRange.setStart(nestedNodesContainer, i)
            } else {
              break
            }
          }
          // DEBUG && console.log(nestedNodesContainer.childNodes)

          nestedRange.deleteContents()
          nestedRange.setStartAfter(nestedNodesContainer)
          nestedRange.collapse()
          pbrToInsert = document.createTextNode("")
          nestedRange.insertNode(pbrToInsert)
          range.collapse(false)
          nestedRange.detach()
        }


      } else {
        // reset selection 
        range.setStart(save_startContainer, save_startOffset)
        range.setEndAfter(range.startContainer)

        // DEBUG && console.log(range)
        // DEBUG && console.log(getUserSelection())
        // delete if true last line
        range.deleteContents()
        range.setEndAfter(save_startContainer)
        range.collapse()
        pbrToInsert = $("<p>").append($("<br>")).get(0)
        range.insertNode(pbrToInsert)
        range.collapse(true)
      }
    }
    // if last line really is last line 
    else {
      // make sure there are no extra breaks at end
      range.setEndAfter(range.endContainer)
      range.deleteContents()

      // DEBUG && console.log(4)
      range.insertNode(brToInsert1)
      // range.insertNode(brToInsert2)
      // var textToInsert = document.createTextNode("EETT")
      var brToInsert = $("<br>").get(0) //.after(textToInsert).get(0)

      range.insertNode(brToInsert)
      range.setEndAfter(brToInsert)
      range.collapse()
    }
  }

  function isModifier(event) {
    let isCtrl = event.ctrlKey //event.key == "Control"
    let isMeta = event.metaKey //event.key == "Meta"
    return isCtrl ? !isMeta : isMeta // XOR
  }

  var history = new FileHistory({
    maxLength: 200,
    editor: content,
  })

  var numOfPresses = 0
  let historyHandler = function historyHandler(event) {

    let isMod = isModifier(event)
    // if undo/redo commands pressed don't save history even onkeyup
    if (isMod && event.key == 'z' ||
      isMod && event.key == 'z' && event.key == "Shift") {
      DEBUG && console.log("DONT SAVE")
    } else {
      DEBUG && console.log("DO SAVE")
      history.save()
    }
  }
  addEventListener(settings.element.get(0), 'keyup', historyHandler);
  addEventListener(settings.element.get(0), 'mouseup', historyHandler);

  content.onkeydown = function (event) {
    let isMod = isModifier(event)
    console.log("---------------------")
    console.log("eventKey: " + event.key)
    console.log(numOfPresses++)
    // hist ory.save()
    if (isMod) {
      console.log("modifier key was hit")
      event.preventDefault()
    }
    // if (event.key == 'z') {
    //     console.log("z key was hit")
    // }
    // if (event.shiftKey) {
    //     console.log("shift was hit")
    // }

    switch (true) {
      case (event.key == 'Tab'):
        {
          DEBUG && console.log("Tab was pressed")
          pressTab()
          break
        }
      case (event.key == 37): // left
      case (event.key == 39): // right
        {
          DEBUG && console.log("Left/right was pressed")
          pressLeftRight()
          break
        }
      case (event.key == 'Enter'):
        {
          DEBUG && console.log("Enter was pressed")
          // don't break inside blockquotes and pre's
          if (queryCommandValue('formatBlock') === 'blockquote' ||
            queryCommandValue('formatBlock') === 'pre') {
            pressEnter()
          }
          break
        }
      case (isMod && event.key == 'z' && event.shiftKey):
        {
          // redo
          DEBUG && console.log("Cmd+Shift+z was pressed")
          history.redo()
          break
        }
      case (isMod && event.key == 'z'):
        {
          // undo
          DEBUG && console.log("Cmd+z was pressed")
          history.undo()
          break
        }
      default:
        break
    }
  }

  /* End Behavior Code */

  // append editor
  appendChild(settings.element, content);

  actions.forEach(function (action) {
    // DEBUG && console.log(action)
    // if separator
    if (action.type == 'separator') {
      var sep = createElement('div')
      sep.className = "separator"
      appendChild(actionbar, sep)
    }
    // else if dropdown 
    /*
    <div class="dropdown">
        <div class="dropdown-content">
            <div class="dropdown-option">
                <i class="fas fa-{}">{}</i>
            </div>
        </div>
    </div>
    */
    else if (action.type == 'dropdown') {

      var $dropdown = $("<div>", {
        "class": "dropdown",
      })

      var $dropdownbtn = $("<div>", {
        "class": "dropdown-button"
      })

      var $dropdownContent = $("<div>", {
        "class": "dropdown-content"
      })

      $.each(action.choices, function (i, v) {
        var $option = $("<div>", {
          "id": v,
          "class": "dropdown-option"
        }).append(
          $("<div>").css(
            // https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
            Object.assign(...Object.entries(action.dropdown_style).map(([k, v]) => ({
              [k]: (v[i] == null) ? "inherit" : v[i]
            })))
          ).append(action.title[i])
        )

        // .append($("<" + v + ">").append(action.title[i]))
        // $option.append(action.icon[i]).append(v)

        // if option clicked
        $option.on("click", function () {
          // hide dropdown
          $dropdownContent.removeClass("show")
          $dropdownbtn.removeClass("open")
          // choose selected
          $dropdown.find(".dropdown-option").each(function () {
            $(this).removeAttr("selected")
          })
          $(this).attr("selected", "")
          // replace dropdown icon with selected
          $dropdownbtn.html(
            $dropdownContent.find(".dropdown-option[selected]").clone().find("div")
              .css(action.inline_style)
          )

          return action.result(v) && content.focus()
        }).mousedown(function (e) {
          e.preventDefault()
        })
        action.default == i ? $option.attr("selected", "") : {}

        $dropdownContent.append($option)
      })

      // set dropdownbtn to show selected option
      // var $longestOption = 
      $dropdownbtn.html(
        $dropdownContent.find(".dropdown-option[selected]").clone().find("div")
          .css(action.inline_style)
      )

      $dropdown.append($dropdownbtn, $dropdownContent)

      $dropdownbtn.on("click", function () {
        $dropdownContent.toggleClass("show")
        $(this).toggleClass("open")
      }).mousedown(function (e) {
        e.preventDefault();
      })

      $(document).mouseup(function (e) {
        // if the target of the click isn't the container // nor a descendant of the container
        if (!$dropdown.is(e.target) && $dropdown.has(e.target).length === 0) { // 
          $dropdownContent.removeClass("show")
          $dropdownbtn.removeClass("open")
        }
      });

      appendChild(actionbar, $dropdown.get(0))
    }
    // else if regular button
    else if (action.type == 'button') {
      var button = createElement('button')
      button.className = classes.button
      button.innerHTML = action.icon
      button.title = action.title
      button.setAttribute('type', 'button')

      // create class applier if exists
      if (action.classApply) {
        var applier = action.classApply()
      }

      button.onclick = function () {
        // if custom applier, pass through
        if (action.classApply) {
          return action.result(applier) && content.focus()
        } else {
          return action.result() && content.focus()
        }
      };

      if (action.state) {
        var handler = function handler() {
          return button.classList[action.state() ? 'add' : 'remove'](classes.selected);
        };
        addEventListener(content, 'keyup', handler);
        addEventListener(content, 'mouseup', handler);
        addEventListener(button, 'click', handler);
      }

      appendChild(actionbar, button)
    }
  });

  return settings.element;
}

var wysiwyg = {
  exec: exec,
  init: init
}

export default wysiwyg;