import {
  exec,
  queryCommandState,
} from './functions.js'

export var defaultActions = {
  font_drop: {
    icon: [
      // automatically generated from title and choices
    ],
    inline_style: {
      "font-size": "1em"
    },
    title: ['Open Sans', 'Georgia', 'Times New Roman'],
    dropdown_style: {
      // "font-weight": [700, 700, 700, 700, 700, 400, 400],
      "font-family": ['Open Sans', 'Georgia', 'Times New Roman'],
    },
    type: 'dropdown',
    default: 0,
    choices: ['Open Sans', 'Georgia', 'Times New Roman'],
    state: function state() {
      return queryCommandState('fontName')
    },
    result: function result(choice) {
      exec("selectAll")
      //exec("formatBlock", '<font>')
      $('.outer-container').css("font-family", choice)
    }
  },
  bold: {
    icon: "<i class='fas fa-bold'></i>",
    title: 'Bold',
    type: 'button',
    state: function state() {
      return queryCommandState('bold');
    },
    result: function result() {
      return exec('bold');
    }
  },
  italic: {
    icon: "<i class='fas fa-italic'></i>",
    title: 'Italic',
    type: 'button',
    state: function state() {
      return queryCommandState('italic');
    },
    result: function result() {
      return exec('italic');
    }
  },
  underline: {
    icon: "<i class='fas fa-underline'></i>",
    title: 'Underline',
    type: 'button',
    state: function state() {
      return queryCommandState('underline');
    },
    result: function result() {
      return exec('underline');
    }
  },
  strikethrough: {
    icon: "<i class='fas fa-strikethrough'></i>",
    title: 'Strike-through',
    type: 'button',
    state: function state() {
      return queryCommandState('strikeThrough');
    },
    result: function result() {
      return exec('strikeThrough');
    }
  },
  header_drop: {
    icon: [
      // automatically generated from title and choices
    ],
    inline_style: {
      "font-size": "1em"
    },
    dropdown_style: {
      "font-weight": [800, 800, 700, 700, 700, 400, 400],
      "font-family": [null, null, null, null, null, null, "Overpass Mono"],
      "font-size": ['2em', '1.7em', '1.5em', '1.3em', '1.1em', '1em', '1em']
    },
    title: [
      'Header 1', 'Header 2', 'Header 3',
      'Header 4', 'Header 5', 'Paragraph',
      'Preformatted'
    ],
    type: 'dropdown',
    default: 5,
    choices: ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'pre'],
    result: function result(choice) {
      // let sel = getUserSelection()
      // let range = getRangeObject(sel)

      // // if selection is inside quote or code
      // if (queryCommandValue(formatBlock) === 'blockquote' ||
      //     queryCommandValue(formatBlock) === 'pre') {
      //     // if in middle, break into two parts

      //     // if at ends, take out and put into separate

      //     return exec('formatBlock', '<' + choice + '>')
      // } else {
      //     return exec('formatBlock', '<' + choice + '>')
      // }

      // ehh i guess this bug can be a feature lol
      return exec('formatBlock', '<' + choice + '>')

    }
  },
  inline_code: {
    icon: "<i class='fas fa-code'></i>",
    title: "In-line Code",
    type: 'button',
    // state: function state() {
    //     return 
    // },
    classApply: function classApply() {
      return rangy.createClassApplier("inline-code", {
        elementTagName: "code"
      })
    },
    result: function result(applier) {
      applier.toggleSelection()
    }
  },
  quote: {
    icon: "<i class='fas fa-quote-left'></i>",
    title: 'Quote',
    type: 'button',
    state: function state() {
      return queryCommandState('quote');
    },
    result: function result() {
      return exec('formatBlock', '<blockquote>');
    }
  },
  olist: {
    icon: "<i class='fas fa-list-ol'></i>",
    title: 'Ordered List',
    type: 'button',
    result: function result() {
      return exec('insertOrderedList');
    }
  },
  ulist: {
    icon: "<i class='fas fa-list-ul'></i>",
    title: 'Unordered List',
    type: 'button',
    result: function result() {
      return exec('insertUnorderedList');
    }
  },
  line: {
    icon: "<i class='fas fa-ruler-horizontal'></i>",
    title: 'Horizontal Line',
    type: 'button',
    result: function result() {
      return exec('insertHorizontalRule');
    }
  },
  link: {
    icon: "<i class='fas fa-link'></i>",
    title: 'Link',
    type: 'button',
    result: function result() {
      var url = window.prompt('Enter the link URL');
      if (url) exec('createLink', url);
    }
  },
  image: {
    icon: "<i class='fas fa-image'></i>",
    title: 'Image',
    type: 'button',
    result: function result() {
      var url = window.prompt('Enter the image URL');
      if (url) exec('insertImage', url);
    }
  },
  sep: {
    title: 'Separator',
    type: 'separator'
  }
}

export var defaultClasses = {
  actionbar: 'toolbar',
  button: 'button',
  content: 'editor',
  selected: 'button-selected',
  statusbar: 'statusbar'
}