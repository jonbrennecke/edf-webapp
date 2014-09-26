(function ( mod ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) // CommonJS, Node
		module.exports = mod(window.$);
	else
		throw "This module is only supported on Node.js.";

}(function ($) {

	var proton = proton || { "meta" : "proton namespace" };

	// constants
	proton.$openFileDialog = $("#proton--openFileDialog"); // TODO requires document.body

	proton.openFileDialog = function () {

		var promise = $.Deferred();

		proton.$openFileDialog.change(function ( val ) {
			promise.resolve(val.currentTarget.value);
		});

		proton.$openFileDialog.trigger('click');

		return promise;

	};


	return proton;

}));