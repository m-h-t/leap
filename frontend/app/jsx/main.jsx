/** @jsx React.DOM */

(function () {
	"use-strict";
	//= require DataSet.js

	//= require mixins.jsx
	//= require_tree /components

	//get bike data from xml
	var bike = new DataSet('../data/bike/E-Bike_v4.xml');

	//the leap controller
	var leapController = new Leap.Controller();
	leapController.connect();

	//add react component to DOM
	window.onload = function () {
		var contentFrame = document.getElementById('content');
		React.renderComponent(<ProductViewer data = {bike} />, contentFrame);
	};
})();