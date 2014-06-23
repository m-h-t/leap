/** @jsx React.DOM */

(function () {
	"use-strict";

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


	//add react component to DOM
	window.onload = function () {
		var contentFrame = document.getElementById('content');
		React.renderComponent(ProductViewer(null ), contentFrame);
	};
})();