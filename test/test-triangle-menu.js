var TriangleMenu = require("../js/triangle-menu.js");
var sinon = require('sinon');

var expect = require('expect.js');
var jQuery = require('jquery');
var $ = jQuery;

describe('TriangleMenu', function() {

  var cut = null;
  var jQueryMock = null;
  var $el = null;

  beforeEach(function() {
    jQueryMock = {
      find: function(selector) {
        this.selector = this.selector + " " + selector;
        return jQueryMock;
      },
      attr: function() {
        return jQueryMock;
      }
    };
    var elLeftOffset = 30;
    var elWidth = 400;
    var elHeight = 300;
    $el = {
      css: sinon.spy(),
      offset: function() {
        return {
          left: elLeftOffset
        };
      },
      width: function() {
        return elWidth;
      },
      height: function() {
        return elHeight;
      },
      clipPath: sinon.spy(),
      trigger: sinon.spy()
    };

    cut = new TriangleMenu(jQuery, $el);
  });

  it('should select the item', function() {
    // given
    var index = 3;
    var points = [[2,3]];
    cut._createPolygonPoints = function() {
      return points;
    };
    var createPolygonPointsSpy = sinon.spy(cut, "_createPolygonPoints");
    cut._colorIcons = sinon.spy();
    var menuItem = {menuItem: "test"};
    cut._getMenuItem = function() {
      return menuItem;
    };
    var getMenuItemSpy = sinon.spy(cut, "_getMenuItem");

    // when
    cut.selectItem(index);

    // expect
    expect(createPolygonPointsSpy.withArgs(index).calledOnce).to.be.equal(true);
    expect(cut._colorIcons.withArgs(menuItem).calledOnce).to.be.equal(true);
    expect(getMenuItemSpy.withArgs(index).calledOnce).to.be.equal(true);
    expect($el.clipPath.withArgs(points).calledOnce).to.be.equal(true);
    expect($el.trigger.withArgs('activate', index).calledOnce).to.be.equal(true);
  });

  it('should create polygon points for clip-path-polygon for a particular menu item', function() {
    // given
    var index = 2;
    cut._getMenuItem = sinon.spy();
    cut._getCenterOfMenuItem = function() {
      return 230;
    };
    var expectedPoints = [
      [0, 0],
      [205, 0],
      [230, 20],
      [255, 0],
      [400, 0],
      [400, 300],
      [0, 300]
    ];

    // when
    var result = cut._createPolygonPoints(index);

    expect(result).to.be.eql(expectedPoints);
    expect(cut._getMenuItem.withArgs(index).calledOnce).to.be.equal(true);
  });

  it('should build points for clip-path-polygon', function() {
    // given
    var left = 30;
    var center = 50;
    var right = 70;
    var width = 300;
    var height = 20;
    var expected = [
      [0, 0],
      [30, 0],
      [50, 20],
      [70, 0],
      [300, 0],
      [300, 20],
      [0, 20]
    ];

    // when
    var result = cut._buildPolygonPoints(center, left, right, width, height);

    // then
    expect(result).to.be.eql(expected);
  });

  it('should calculate a center of element', function() {
    // given
    var elementPaddingLeft = "10";
    var elementLeftOffset = 100;
    var elementWidth = 300;
    var $element = {
      css: function() {
        return elementPaddingLeft;
      },
      offset: function() {
        return {
          left: elementLeftOffset
        };
      },
      width: function() {
        return elementWidth;
      }
    };

    // when
    var result = cut._getCenterOfMenuItem($element);

    // then
    expect(result).to.be.equal(230);
  });

  var createMenuStructure = function() {
    var menuSelector = cut.triangleMenuSelector.substr(1);
    var menuItemSelector = cut.menuItemSelector.substr(1);
    var $menu = $('<div>').addClass(menuSelector);
    var $menuItem1 = $('<div>').addClass(menuItemSelector);
    var $menuItem2 = $('<div>').addClass(menuItemSelector).append($('<div>').addClass('test'));
    var $menuItem3 = $('<div>').addClass(menuItemSelector).addClass('active');
    var $menuItem4 = $('<div>').addClass(menuItemSelector);
    $menu.append($menuItem1).append($menuItem2).append($menuItem3).append($menuItem4);

    return $menu;
  };

  it('should color icons', function() {
    // given
    var $menu = createMenuStructure();

    var $toBeColored = $menu.find('>:nth-child(2)');
    var expected = '<div class="triangle-menu"><div class="menu-item"></div><div class="menu-item active"><div class="test"></div></div><div class="menu-item"></div><div class="menu-item"></div></div>';

    // when
    cut._colorIcons($toBeColored);

    // then
    expect($menu.prop('outerHTML')).to.be.equal(expected);
  });

  it('should select an item after hover on it', function() {
    // given
    var $menu = createMenuStructure();
    var index = 2;
    var ev = {
      target: $menu.find('>:nth-child(' + index + ')')[0]
    };
    cut.selectItem = sinon.spy();

    // when
    cut.onHoverAction(ev);

    // then
    expect(cut.selectItem.withArgs(index).calledOnce).to.be.equal(true);
  });

  it('should select an item after hover on a child', function() {
    // given
    var $menu = createMenuStructure();
    var index = 2;
    var ev = {
      target: $menu.find('>:nth-child(' + index + ') .test')[0]
    };
    cut.selectItem = sinon.spy();

    // when
    cut.onHoverAction(ev);

    // then
    expect(cut.selectItem.withArgs(index).calledOnce).to.be.equal(true);
  });

  it('should check if sth is a function', function() {
    // given
    var number = 2;
    var string = "string";
    var func = function() {};
    var type = function() {};
    var obj = new type();

    // when
    var numberResult = cut._isFunction(number);
    var stringResult = cut._isFunction(string);
    var funcResult = cut._isFunction(func);
    var typeResult = cut._isFunction(type);
    var objResult = cut._isFunction(obj);

    expect(numberResult).to.be.equal(false);
    expect(stringResult).to.be.equal(false);
    expect(funcResult).to.be.equal(true);
    expect(typeResult).to.be.equal(true);
    expect(objResult).to.be.equal(false);
  });

});