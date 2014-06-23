/** @jsx React.DOM */

(function () {
	"use-strict";

	//= require mixins.jsx
	//= require_tree /components

	//add react component to DOM
	window.onload = function () {
		var contentFrame = document.getElementById('content');
		React.renderComponent(<ProductViewer />, contentFrame);
	};
})();