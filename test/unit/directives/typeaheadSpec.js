'use strict';

describe('typeahead', function () {
	var scope, $sandbox, $compile, $timeout;

	beforeEach(module('$strap.directives'));

	beforeEach(inject(function ($injector, $rootScope, _$compile_, _$timeout_) {
		scope = $rootScope;
		$compile = _$compile_;
		$timeout = _$timeout_;

		$sandbox = $('<div id="sandbox"></div>').appendTo($('body'));
		scope.typeahead = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
	}));

	afterEach(function() {
		$sandbox.remove();
		scope.$destroy();
		$('.typeahead').remove();
	});

	var templates = {
		'default': '<input type="text" class="span3" data-items="4" ng-model="typeaheadValue" bs-typeahead="typeahead">'
	};

	function compileDirective(template) {
		template = template ? templates[template] : templates['default'];
		template = $(template).appendTo($sandbox);
		return $compile(template)(scope);
	}

	// Tests

	it('should add "data-provide" attr for you', function () {
		var elm = compileDirective();
		expect(elm.attr('data-provide') === 'typeahead').toBe(true);
	});

	it('should correctly call $.fn.typeahead', function () {
		var spy = spyOn($.fn, 'typeahead').andCallThrough();
		var elm = compileDirective();
		expect(spy).toHaveBeenCalled();
	});

	it('should show the typeahead dropdown on keyup', function() {
		var elm = compileDirective();
		var $dropdown = $('body > .typeahead.dropdown-menu');
		expect($dropdown.attr('style')).toBeUndefined();
		elm.trigger('keyup');
		expect($dropdown.attr('style') !== '').toBe(true);
	});

	it('should show correctly limit dropdown to 4 items', function() {
		var elm = compileDirective();
		elm.val('a').trigger('keyup');
		var $dropdown = elm.next('.typeahead.dropdown-menu');
		expect($dropdown.children('li').length).toBe(4);
	});

	it('should show corretly set the value', function() {
		var elm = compileDirective();
		elm.val('a').trigger('keyup');
		var $dropdown = elm.next('.typeahead.dropdown-menu');
		$dropdown.find('li:first > a').trigger('click');
		expect(elm.val()).toBe('Alabama');
	});

	it('should show correctly handle model binding', function() {
		var elm = compileDirective();
		scope.typeahead.push('Brazil');
		elm.val('brazil').trigger('keyup');
		var $dropdown = elm.next('.typeahead.dropdown-menu');
		expect($dropdown.children('li').length).toBe(1);
	});

});
