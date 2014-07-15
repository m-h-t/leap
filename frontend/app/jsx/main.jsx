/** @jsx React.DOM */

(function () {
	"use-strict";
	//= require DataSet.js

	//use react classSet
	var ClassSet = React.addons.classSet;

	//= require mixins.jsx
	//= require_tree /components

	//get bike data from xml
	var bike = new DataSet('data/bike/E-Bike_v4.xml');

	//the leap controller
	var leapController = new Leap.Controller();
	leapController.connect();

	//add react component to DOM
	window.onload = function () {
		var contentFrame = document.getElementById('content');
		React.renderComponent(<ProductViewer data = {bike} />, contentFrame);
	};
})();