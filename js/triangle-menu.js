/*!
 * jQuery triangle-menu Plugin v0.1.0
 * Released: 2013-09-08
 * jQuery plugin that creates a dynamic menu with a triangle pointer based on clip-path
 * https://github.com/andrusieczko/jquery-triangle-menu
 * 
 * Copyright 2013 Karol Andrusieczko
 * Released under MIT license
 */

var jQuery = jQuery || (require && require('jquery'));
(function($) {

  var TriangleMenu = function(jQuery, $el, options) {
    this.$el = $el;
    this.$ = jQuery;

    this._processOptions($el, options);
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = TriangleMenu;
    }
    exports.TriangleMenu = TriangleMenu;
  } else {
    var globalVariable = window || root;
    globalVariable.TriangleMenu = TriangleMenu;
  }

  TriangleMenu.prototype = {
    $: null,
    $el: null,

    menuItemSelector: '.menu-item',

    triangleWidth: 50,
    triangleHeight: 20,

    selectItem: function(index) {
      var $menu = this.$el;
      var points = this._createPolygonPoints($menu, index);
      $menu.clipPath(points);

      this._colorIcons($menu, this._getMenuItem($menu, index));
      $menu.trigger('activate', index);
    },

    _getMenuItem: function($menu, index) {
      return $menu.find(this.menuItemSelector + ':nth-child(' + index + ')');
    },

    _createPolygonPoints: function($menu, index) {
      var menuWidth = $menu.width();
      var menuHeight = $menu.height();
      var $menuItem = this._getMenuItem($menu, index);
      var center = this._getCenterOfMenuItem($menu, $menuItem);

      var left = center - (this.triangleWidth / 2);
      var right = center + (this.triangleWidth / 2);

      return this._buildPolygonPoints(center, left, right, menuWidth, menuHeight);
    },

    _buildPolygonPoints: function(center, left, right, width, height) {
      var points = [
        [0, 0],
        [left, 0],
        [center, this.triangleHeight],
        [right, 0],
        [width, 0],
        [width, height],
        [0, height]
      ];
      return points;
    },

    _getCenterOfMenuItem: function($menu, $menuItem) {
      var paddingLeft = parseInt($menuItem.css('padding-left'), 10);

      var offset = $menuItem.offset().left - $menu.offset().left + paddingLeft;
      var menuItemWidth = $menuItem.width();
      var center = offset + menuItemWidth / 2;
      return center;
    },

    _colorIcons: function($menu, $menuItem) {
      $menu.find(this.menuItemSelector).removeClass('active');
      $menuItem.addClass('active');
    },

    onHoverAction: function(ev) {
      var $menuItem = this.$(ev.target);
      if (!$menuItem.hasClass(this.menuItemSelector.substr(1))) {
        $menuItem = $menuItem.parents(this.menuItemSelector);
      }
      var index = $menuItem.parent().children(this.menuItemSelector).index($menuItem) + 1;
      this.selectItem(index);
    },

    _isFunction: function(obj) {
      return typeof obj === 'function';
    },

    _processOptions: function($menu, options) {
      this.triangleHeight = (options && options.triangleHeight) || this.triangleHeight;
      this.triangleWidth = (options && options.triangleWidth) || this.triangleWidth;
      this.menuItemSelector = (options && options.menuItemSelector) || this.menuItemSelector;

      if (options && options.activate) {

        if (!this._isFunction(options.activate)) {
          throw new Error("activate argument should be a function");
        }

        $menu.on('activate', options.activate.bind(this));
      }
    }

  };

  $.fn.triangleMenu = function(options) {
    return this.each(function() {
      var $triangleMenu = $(this);
      var triangleMenu = new TriangleMenu($, $triangleMenu, options);
      // TODO: this line looks stupid, to many triangleMenus
      $triangleMenu.find(triangleMenu.menuItemSelector).bind('mouseover', triangleMenu.onHoverAction.bind(triangleMenu));

      triangleMenu.selectItem(1);
    });
  };

}).call(this, jQuery);