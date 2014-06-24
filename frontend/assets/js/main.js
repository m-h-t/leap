/** @jsx React.DOM */

(function () {
	"use-strict";
function DataSet(path) {
	var xhttp = new XMLHttpRequest();

	xhttp.open("GET", path, false);
	xhttp.send();
	var xmlDoc = xhttp.responseXML;

	// var oSerializer = new XMLSerializer();
	// var sXML = oSerializer.serializeToString(xmlDoc);
	// console.log(xmlDoc);

	var x2js = new X2JS();

	var json = x2js.xml2json( xmlDoc );
	var beatifulObj = beautitfyJson(json.VGraph.N);
	
	return beatifulObj;
}

function beautitfyJson (json) {
	var beatifulObj = {};
 	var values = json.Data.Attr;

 	for (var i = 0; i < values.length; i++) {
 		beatifulObj[values[i].Key] = values[i].Value;
 	}

 	var children = json.N;
 	if (children) {
 		beatifulObj.children = [];	
 		for (var i = 0; i < json.N.length; i++) {
 			beatifulObj.children[i] = beautitfyJson(children[i]);
 		};
 	}

 	return beatifulObj;
}


//mixins

	//= require_tree /components
// the composed view contains
// all UI elements 
// and represents one "path"

var ComposedView = React.createClass({displayName: 'ComposedView',
	
	render: function() {
		return React.DOM.div( 
			{className:  "composed-view"}, 
			this.props.pathName
		);
	}
});
// the product viewer stores the global state of the app
// and handles events

var ProductViewer = React.createClass({displayName: 'ProductViewer',
	getInitialState: function () {
		return {
			scrolled: 0
		};
	},

	componentDidMount: function () {
		// listner to leap events goes here
		// call this.switchPath(delta) to move element

		//example:
		window.addEventListener('click',function(){
			this.switchPath(200);
		}.bind(this),false);
	},

	handleWheel: function (e) {
		e.preventDefault();
		// we write directly to state because it does not affect the DOM
		this.state.scrolled -= e.deltaX;

		this.switchPath(this.state.scrolled);
	},

	switchPath: function (delta) {
		//move view left or right based on delta
		var viewNode = this.refs.pathIdentifier.getDOMNode();
		viewNode.style.transform = 'translateX('+delta+'px)';

		//TODO: switch path when delta is greater than 100

	},

	render: function() {
		return (
			React.DOM.div( 
			{className:  "product-viewer",
			onWheel:  this.handleWheel}, 
				ComposedView( 
					{ref:  "pathIdentifier",
					pathName:  "placeholder Name test"} )
			)
		);
	}
});


	//get bike data from xml
	var bike = new DataSet('../data/bike/E-Bike_v4.xml');

	//add react component to DOM
	window.onload = function () {
		var contentFrame = document.getElementById('content');
		React.renderComponent(ProductViewer( {data:  bike} ), contentFrame);
	};
})();