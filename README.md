# editur.js

[[https://github.com/alexkim205/editur.js/wiki/editur_demo.gif|alt=editur_demo]]

This is a modular WYSIWYG editor that is simple, clean and easy to use. It uses the following tools, all of which are included in their respective css/ and js/ files.
- JQuery (current <= 3.3.1)
- [Rangy](https://github.com/timdown/rangy) (current<=1.3.0)
- Font Awesome (CDN here)
- Google Fonts ([Open Sans](https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i,800) + [Overpass Mono](https://fonts.googleapis.com/css?family=Overpass+Mono:400,700&amp;subset=latin-ext))

## Getting Started

1. `git clone https://github.com/alexkim205/editur.git`
2. Copy the `css/` and `js/` folders into your project.
3. Import styles at beginning of your html file:

```html
<!-- Google Fonts -->
<!--Fonts-->
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i,800" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Overpass+Mono:400,700&amp;subset=latin-ext" rel="stylesheet">

<!-- Font Awesome 5 -->
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp"
  crossorigin="anonymous">

<!-- Direct the href to where you put the css files -->
<link rel="stylesheet" type="text/css" href="css/editor_base.css" />
```

4. Import scripts at end of your html file:

```html
<!-- If you haven't included JQuery already -->
<script src="js/jquery/jquery-3.3.1.min.js"></script>

<!-- Rangy Core and Modules -->
<script src="js/rangy/rangy-core.js"></script>
<script src="js/rangy/rangy-classapplier.js"></script>
<script src="js/rangy/rangy-textrange.js"></script>

<!-- Import editur.js-->
<script type="module" src="js/editur.js"></script>
```
Check out how to properly use editur.js the demo in the `html/` folder. 

### A persistent toolbar

[[https://github.com/alexkim205/editur.js/wiki/editur_scroll.gif|alt=editur_scroll]]
