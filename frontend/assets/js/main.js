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

var ChildList = React.createClass({displayName: 'ChildList',
	
	render: function() {	
		var Items = {}; 
		if (this.props.items) {
			Items = this.props.items.map(function(item, i) {
				return React.DOM.li( 
					{className:  "child-item",
					key:  item.id + i,
					onClick:  function(){this.props.goToItem(item);}.bind(this)}, 
						item.name,
						React.DOM.img( {className:"child-image", src:'../data/bike/' + item.image} )
				);
			},this);
		}

		return React.DOM.ul( {className:"child-list"}, 
			Items
		);
	}
});
// the composed view contains
// all UI elements 
// and represents one "path"
// stores current state in path
// and manages "walking in the path"

var ComposedView = React.createClass({displayName: 'ComposedView',
	getInitialState: function () {
		return {
			past: [],
			current: this.props.data,
			future: []
		};
	},

	goToItem: function (item) {
		// go to specified item
		// add current item to past
		// and clear future
		var tmpPast = this.state.past;
		tmpPast.push(this.state.current); 

		this.setState({
			current: item,
			past: tmpPast,
			future: []
		});
	},

	goToPast: function (index) {
		var tmpPast = this.state.past;
		var tmpFuture = this.state.future;

		// remove elements from past
		var howMany = tmpPast.length - index;
		var removedFromHistory = tmpPast.splice(index,howMany);

		// add all removed items except the goToItem to future
		// also add the old current item to the future
		var goToItem = removedFromHistory.shift();
		removedFromHistory.push(this.state.current);
		tmpFuture = removedFromHistory.concat(tmpFuture);

		this.setState({
			current: goToItem,
			past: tmpPast,
			future: tmpFuture
		});
	},

	gotToFuture: function (index) {
		var tmpPast = this.state.past;
		var tmpFuture = this.state.future;

		// remove elements from future
		var howMany = tmpFuture.length - index;
		var newFuture = tmpFuture.splice(index,howMany);
		// also remove goToItem from newFuture
		var goToItem = newFuture.shift();

		// add current Item and the items removed from future to past
		tmpPast.push(this.state.current);
		tmpPast = tmpPast.concat(tmpFuture);

		this.setState({
			current: goToItem,
			future: newFuture,
			past: tmpPast
		});
	},
	
	render: function() {
		var item = this.state.current;
		return React.DOM.div( 
			{className:  "composed-view"}, 
				HistoryList(
					{items:  this.state.past, 
					goToItem:  this.goToPast}),

				React.DOM.div( {className:  "view-center"}, 
					ChildList( 
						{items:  item.children, 
						goToItem:  this.goToItem}),
					React.DOM.img( {src:'../data/bike/' + item.image} )
				),

				HistoryList(
					{items:  this.state.future, 
					goToItem:  this.gotToFuture})
		);
	}
});
// the composed view contains
// all UI elements 
// and represents one "path"

var HistoryList = React.createClass({displayName: 'HistoryList',
	
	render: function() {	
		var Items = {}; 
		if (this.props.items) {
			Items = this.props.items.map(function(item, i) {
				return React.DOM.li( 
					{className:  "history-item",
					key:  item.id + i,
					onClick:  function(){this.props.goToItem(i);}.bind(this)}, 
						item.name,
						React.DOM.img( {className:"history-image", src:'../data/bike/' + item.image} )
				);
			},this);
		}

		return React.DOM.ul( {className:"history-list"}, 
			Items
		);
	}
});
// the product viewer stores the global state of the app
// and handles events

var ProductViewer = React.createClass({displayName: 'ProductViewer',
	getInitialState: function () {
		return {
			paths: [this.props.data.id],
			currentPath: 0,
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
		var ref = 'path' + this.state.currentPath;
		var viewNode = this.refs[ref].getDOMNode();
		viewNode.style.transform = 'translateX('+delta+'px)';

		//TODO: switch path when delta is greater than 100

	},

	render: function() {
		var pathName = this.state.paths[this.state.currentPath];

		return (
			React.DOM.div( 
			{className:  "product-viewer",
			onWheel:  this.handleWheel}, 
				ComposedView( 
					{ref:  'path' + this.state.currentPath,
					data:  this.props.data} )
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