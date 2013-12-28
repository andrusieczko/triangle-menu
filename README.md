triangle-menu [![Build Status](https://travis-ci.org/andrusieczko/triangle-menu.png?branch=master)](https://travis-ci.org/andrusieczko/triangle-menu)
=============

This is a jQuery plugin that creates a dynamic menu with a triangle pointer based on clip-path.

[Examples](http://andrusieczko.github.io/triangle-menu/examples.html)

<img src="http://www.andrusieczko.pl/others/files_to_share/triangleMenu2.png" width="300">
<img src="http://www.andrusieczko.pl/others/files_to_share/triangleMenu.png" width="300">
<img src="http://www.andrusieczko.pl/others/files_to_share/triangleMenu3.png" width="300">

## Installation

### Node

`$ npm install triangle-menu --save`

Then require it:

```javascript
require('triangle-menu');
```

and use:
```javascript
$myElement.triangleMenu();
```

### Browser

Download [triangle-menu.min.js (minified)](https://raw.github.com/andrusieczko/triangle-menu/master/build/triangle-menu.min.js) or [menu-triangle.js (dev)](https://raw.github.com/andrusieczko/triangle-menu/master/js/triangle-menu.js) and add it to you HTML file:

```html
<script src="jquery.min.js"></script>
<script src="clip-path-polygon.min.js"></script>
<script src="triangle-menu.min.js"></script>
```

Remember about dependencies ([http://jquery.com/download](jQuery) and [clip-path-polygon](https://github.com/andrusieczko/clip-path-polygon))!

Compilation
-------

If you want to compile the whole package and run unit tests, type `npm install` and `grunt test` or `npm test`.

Usage
-------
Definition:
`triangleMenu(options)` where options are not required.

You have to have a certain HTML structure to use it. The element you call the function on has to have `.triangle-menu` class while all the item in the menu has to have `.menu-item` class.

### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `triangleHeight` | number | 20 | Height of the clipped triangle in px |
| `triangleWidth` | number | 25 | Half of width of the clipped triangle in px |
| `activate(event, index)` | function | *nothing* | The callback function that is called when the mouse hovers over a `.menu-item` element; `index` argument is the index of `.menu-item` element and it's numerated from 1 |

---

## Example use:
You can find the working examples [here](http://andrusieczko.github.io/triangle-menu/examples.html).
```html
<table class="triangle-menu">
    <tbody>
        <tr>
            <td class="menu-item">1</td>
            <td class="menu-item">2</td>
            <td class="menu-item">3</td>
            <td class="menu-item">4</td>
        </tr>
    </tbody>
</table>
```
and in your javascript file:
```javascript
$('.triangleMenu').triangleMenu();
```
you can add some css to see the effects:
```css
.triangle-menu {
  height: 200px;
  width: 600px;
  background: green;
  text-align: center;
}
```

###More examples

With [Bootstrap2](http://getbootstrap.com/2.3.2/):
```html
<div class="row-fluid menu-triangle">
    <div class="row4 menu-item">1</div>
    <div class="row4 menu-item">2</div>
    <div class="row4 menu-item">3</div>
</div>
```

Using options:
````javascript
$('.triangle-menu').triangleMenu({
  triangleWidth: 10,
  triangleheight: 5,
  activate: function(event, index) {
    console.log("You hovered over ", index, " element");
  }
});
```