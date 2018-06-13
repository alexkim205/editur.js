import wysiwyg from "./wysiwyg/wysiwyg.js"
console.log("imported ./wysiwyg/wysiwyg.js")

$(function () {

  function draw_titles() {
    var $inputs = $(".title input")

    $inputs.each(function () {
      var original_value = $(this).attr("value")
      $(this).click(function () {
        $(this).attr("value", "")
      })
    })
  }

  function draw_editor() {
    wysiwyg.init({
      element: $(".outer-container"),
      defaultParagraphSeparator: 'p',

      actions: [
        'font_drop',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'inline_code',
        "sep",
        'header_drop',
        'quote',
        'olist',
        'ulist',
        "sep",
        'line',
        'link',
        'image'
      ],
    })

    // $(".editor").append(
    //   `
    //     <h1>Header 1</h1>
    //     <h2>Header 2</h2>
    //     <h3>Header 3</h3>
    //     <h4>Header 4</h4>
    //     <h5>Header 5</h5>
    //     <p>Paragraph</p>
    //     <pre>// Code goes here</pre>
    //     <blockquote>"Quotes go here" - Michael Scott</blockquote>
    //   `
    // )
  }

  function fix_toolbar() {
    var toolbar = $(".toolbar")
    var sticky = toolbar.offset().top

    $(window).on("scroll", function () {
      var toolbarHeight = toolbar.outerHeight()
      var toolbarWidth = toolbar.outerWidth()
      if (window.pageYOffset >= sticky) {
        toolbar.addClass("sticky")
        toolbar.css({
          "height": toolbarHeight,
          "width": toolbarWidth
        })
        toolbar.next(".editor").css("padding-top", "calc(" + toolbarHeight + "px + 1em)")
      } else {
        toolbar.removeClass("sticky")
        toolbar.css({
          "height": "",
          "width": ""
        })
        toolbar.next(".editor").css("padding-top", "1em")
      }
    })
  }

  draw_titles()
  draw_editor()
  fix_toolbar()

})