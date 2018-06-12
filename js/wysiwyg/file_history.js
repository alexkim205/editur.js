/**
 * FileHistory options
 *
 * options: {
 *  * `editor` : required. editor to implement history on
 * 	* `maxLength` : the maximum number of items in history
 * }
 *
 */


var truncate = function truncate(stack, limit) {
  while (stack.length > limit) {
    stack.shift();
  }
}

var setRange = function setRange(editor, prevSel) {
  var sel = rangy.getSelection()
  var range = rangy.createRange()
  range.selectCharacters(editor, prevSel.start, prevSel.end)
  sel.removeAllRanges()
  sel.addRange(range)
}

var FileHistory = function (options) {

  var settings = options ? options : {}
  var defaultOptions = {
    editor: function () {
      throw new Error("No editor!");
    },
    maxLength: 30,
  }
  this.editor = (typeof settings.editor != 'undefined') ? settings.editor : defaultOptions.editor;
  this.maxLength = (typeof settings.maxLength != 'undefined') ? settings.maxLength : defaultOptions.maxLength;

  this.initialItem = null
  this.clear()
}

FileHistory.prototype.initialize = function (initialItem) {
  this.stack[0] = initialItem
  this.sel_stack[0] = initialItem
  this.initialItem = initialItem
}

FileHistory.prototype.clear = function () {
  this.stack = [this.initialItem]
  this.sel_stack = [this.initialItem]
  this.position = 0
}

FileHistory.prototype.save = function () {
  if (this.position >= this.maxLength) truncate(this.stack, this.maxLength)
  this.position = Math.min(this.position, this.stack.length - 1)
  this.stack = this.stack.slice(0, this.position + 1)
  this.sel_stack = this.sel_stack.slice(0, this.position + 1)

  // save html and current range 
  var sel = rangy.getSelection()
  var range = sel.getRangeAt(0)
  const cur_sel = range.toCharacterRange(this.editor)
  let cur_canvas = [$(this.editor).html(), $(this.editor).parent().css("font-family")]
  // if modified after undo, then delete forward
  // if the current is same as top, don't add
  if (this.stack[this.count()] == null ||
    (this.stack[this.count()][0] != cur_canvas[0] ||
      this.stack[this.count()][1] != cur_canvas[1])) {
    console.log(this.stack[this.position])
    this.stack.push(cur_canvas)
    this.sel_stack.push(cur_sel)
    this.position++
  } else {
    console.log("BUT ACTUALLY DONT SAVE")
  }
  console.log(this.stack[this.position][0])
  // console.log(this.stack)
  // console.log(this.sel_stack)
  // console.log("saved: on position " + this.position + " out of " + this.count())
}

FileHistory.prototype.undo = function () {
  if (this.canUndo()) {
    --this.position
    $(this.editor).html(this.stack[this.position][0])
    $(this.editor).parent().css("font-family", this.stack[this.position][1])

    // var sel = rangy.getSelection()
    // var range = sel.getRangeAt(0)
    // range.selectCharacters(this.editor,
    //     this.sel_stack[this.position].start,
    //     this.sel_stack[this.position].end)
    setRange(this.editor, this.sel_stack[this.position])
  }
  console.log("undo: on position " + this.position + " out of " + this.count())
}

FileHistory.prototype.redo = function () {
  if (this.canRedo()) {
    ++this.position
    $(this.editor).html(this.stack[this.position][0])
    $(this.editor).parent().css("font-family", this.stack[this.position][1])

    // var sel = rangy.getSelection()
    // var range = sel.getRangeAt(0)
    // range.selectCharacters(this.editor,
    //     this.sel_stack[this.position].start,
    //     this.sel_stack[this.position].end)
    setRange(this.editor, this.sel_stack[this.position])
  }
  console.log("redo: on position " + this.position + " out of " + this.count())
}

FileHistory.prototype.canUndo = function () {
  return this.position > 0
}

FileHistory.prototype.canRedo = function () {
  return this.position < this.count()
}

FileHistory.prototype.count = function () {
  return this.stack.length - 1
}

export default FileHistory