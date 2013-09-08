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

    this._processOptions(options);
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

    triangleMenuSelector: '.triangle-menu',
    menuItemSelector: '.menu-item',

    triangleWidth: 25,
    triangleHeight: 20,

    selectItem: function(index) {
      var points = this._createPolygonPoints(index);
      this.$el.clipPath(points);

      this._colorIcons(this._getMenuItem(index));
      this.$el.trigger('activate', index);
    },

    _getMenuItem: function(index) {
      return this.$el.find(this.menuItemSelector + ':nth-child(' + index + ')');
    },

    _createPolygonPoints: function(index) {
      var menuWidth = this.$el.width();
      var menuHeight = this.$el.height();
      var $menuItem = this._getMenuItem(index);
      var center = this._getCenterOfMenuItem($menuItem);

      var left = center - this.triangleWidth;
      var right = center + this.triangleWidth;

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

    _getCenterOfMenuItem: function($menuItem) {
      var paddingLeft = parseInt($menuItem.css('padding-left'), 10);

      var offset = $menuItem.offset().left - this.$el.offset().left + paddingLeft;
      var menuItemWidth = $menuItem.width();
      var center = offset + menuItemWidth / 2;
      return center;
    },

    _colorIcons: function($menuItem) {
      var $menu = $menuItem.parents(this.triangleMenuSelector);
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

    _processOptions: function(options) {
      this.triangleHeight = (options && options.triangleHeight) || this.triangleHeight;
      this.triangleWidth = (options && options.triangleWidth) || this.triangleWidth;

      if (options && options.activate) {

        if (!this._isFunction(options.activate)) {
          throw new Error("activate argument should be a function");
        }

        this.$el.on('activate', options.activate.bind(this));
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