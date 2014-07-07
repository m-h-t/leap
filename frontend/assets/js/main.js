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

	var json        = x2js.xml2json( xmlDoc );
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
 	
 	if (children && children.Data) {
 		// only one child -> obj
 		beatifulObj.children    = [];
 		beatifulObj.children[0] = beautitfyJson(children);

 	} else if (children) {
 		// many children -> array
 		beatifulObj.children = [];	
 		for (var i = 0; i < children.length; i++) {
 			beatifulObj.children[i] = beautitfyJson(children[i]);
 		};
 	}

 	return beatifulObj;
}


	//use react classSet
	var ClassSet = React.addons.classSet;

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
				var classes = ClassSet({
				  'child-item': true,
				  'is-current-future': (this.props.currentFutureIndex == i && this.props.highlightChurrent),
				});

				return (
					React.DOM.li( 
						{style:      {transform: 'translateX('+this.props.currentFutureIndex * -100 +'px)'},
						className:  classes,
						key:        item.id + i,
						onClick:    function(){this.props.goToItem(item);}.bind(this)}, 
							React.DOM.p( {className:  "child-name"}, 
								item.name
							),
							React.DOM.img( {className:"child-image", src:'../data/bike/' + item.image} )
					)
				);
				
			},this);
		}

		return (
			React.DOM.div( {className:  "child-list-wrapper"}, 
				React.DOM.p( {className:  "title"}, 
					"Parts:"
				),
				React.DOM.ul( {className:  "child-list"}, 
					Items
				)
			)
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
		return this.props.initalState;
	},

	componentWillMount: function () {
		if (!this.state.current) {
			var initialFuture = [];
			if (this.props.data.children) {
				var numberOfChildren = this.props.data.children.length - 1;
				var middleIndex      = parseInt(numberOfChildren/2);

				initialFuture.push(this.props.data.children[middleIndex]);
			}

			this.setState({
				current: this.props.data,
				future: initialFuture
			});
		}
	},

	goToItem: function (item) {
		// go to specified item
		// add current item to past
		// and clear future
		var tmpPast   = this.state.past;
		var newFuture = [];

		tmpPast.push(this.state.current);
		if (item.children) {
			var numberOfChildren = item.children.length - 1;
			var middleIndex      = parseInt(numberOfChildren/2);

			newFuture.push(item.children[middleIndex]);
		}

		this.setState({
			current: item,
			past: tmpPast,
			future: newFuture
		});
	},

	goToPast: function (index) {
		var tmpPast   = this.state.past;
		var tmpFuture = this.state.future;

		// when index is negative go back as many index * -1 steps
		if (index < 0) index = tmpPast.length + index;

		if (index >= 0 && index < tmpPast.length) {
			// remove elements from past
			var howMany            = tmpPast.length - index;
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
		}
	},

	goToFuture: function (index) {
		var tmpPast   = this.state.past;
		var tmpFuture = this.state.future;

		// when index is negative go forward index * -1 steps
		if (index < 0) index = (index * -1) -1;

		if (index >= 0 && index < tmpFuture.length) {
			// remove elements from future
			var howMany   = tmpFuture.length - index;
			var newFuture = tmpFuture.splice(index,howMany);
			// also remove goToItem from newFuture
			var goToItem  = newFuture.shift();

			if (newFuture.length === 0 && goToItem.children) {
				var numberOfChildren = goToItem.children.length - 1;
				var middleIndex      = parseInt(numberOfChildren/2);

				newFuture.push(goToItem.children[middleIndex]);
			}

			// add current Item and the items removed from future to past
			tmpPast.push(this.state.current);
			tmpPast = tmpPast.concat(tmpFuture);

			this.setState({
				current: goToItem,
				future: newFuture,
				past: tmpPast
			});
		}
	},

	changeFuture: function (step) {
		if (this.state.current.children) {
			var currentFuture  = this.state.future[0];
			var newFutureIndex = this.state.current.children.indexOf(currentFuture) + step;
			var childrenSize   = this.state.current.children.length - 1;

			if (newFutureIndex >= 0 && newFutureIndex <= childrenSize) {
				var newFuture = [];
				newFuture[0] = this.state.current.children[newFutureIndex];

				this.setState({
					future: newFuture
				});
			}
		}
	},
	
	render: function() {
		var item               = this.state.current;
		var currentFuture      = this.state.future[0];
		var currentFutureIndex = 0;

		if (this.state.current.children) {
			currentFutureIndex = this.state.current.children.indexOf(currentFuture);
		}

		return (
			React.DOM.div( 
				{className:  "composed-view",
				style:      {transform: 'translateX('+this.props.viewOffset+'px)'}}, 
					HistoryList(
						{items:     this.state.past, 
						goToItem:  this.goToPast}),

					React.DOM.div( 
						{className:  "view-center"}, 
						React.DOM.div(
							{className:  "current-item"}, 
							React.DOM.h2( 
								{className:  "item-name"}, 
								item.name
							),
							React.DOM.img( 
								{className:  "item-image",
								src:'../data/bike/' + item.image} 
								)
						),
						ChildList( 
							{items:               item.children, 
							currentFutureIndex:  currentFutureIndex,
							goToItem:            this.goToItem,
							highlightChurrent:   this.props.navigationGestureIsOn})
					),

					HistoryList(
						{items:     this.state.future, 
						goToItem:  this.goToFuture})
			)
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
				return (
					React.DOM.li( 
						{className:  "history-item",
						key:        item.id + i,
						onClick:    function(){this.props.goToItem(i);}.bind(this)}, 

						item.name,
						React.DOM.img( 
							{className:  "history-image", 
							src:        '../data/bike/' + item.image})
					)
				);
				
			},this);
		}

		return (
			React.DOM.ul( {className:"history-list"}, 
				Items
			)
		);
	}
});
// the composed view contains
// all UI elements 
// and represents one "path"

var PathList = React.createClass({displayName: 'PathList',
	
	render: function() {	
		var currentPath = this.props.storedPaths[this.props.currentPathId];

		var Paths = this.props.storedPaths.map(function(path,index) {
			var classes = ClassSet({
				'path-list-element': true,
				'is-current'       : (index == this.props.currentPathId)
			});

			return (
				React.DOM.li( 
					{key:        'path'+index,
					className:  classes}, 
					path.current.id
				)
			);
		},this);
		return (
			React.DOM.ul( 
				{className:  "path-list"}, 

				Paths
			)
		);
	}
});
// the product viewer stores the global state of the app
// and handles events

var ProductViewer = React.createClass({displayName: 'ProductViewer',
	getInitialState: function () {
		return {
			storedPaths:           [{past: [], future: [], current: false}],
			currentPathId:         0,
			scrolled:              0,
			viewOffset:            0,
			navigationGestureIsOn: false
		};
	},

	componentDidMount: function () {
		// listner to leap events goes here
		var startFrame = null;
		var prevFingerCount = 0;

		leapController.on('frame', function( frame ){
			var ref = 'path' + this.state.currentPathId;
			var currentPath = this.refs[ref];

			var hand = frame.hands[0];

			if (hand) {

				var handIsVertical   = (hand.palmNormal[0] > 0.8 || hand.palmNormal[0] < -0.8);
				var handIsHorizontal = (hand.palmNormal[0] < 0.2 && hand.palmNormal[0] > -0.2);
				var fewFingers       = (hand.fingers.length <= 3 && hand.fingers.length > 0);

				if (handIsVertical) {
					// swipe
					if (!startFrame) {
						startFrame = frame;
					} else {
						var distance  = frame.translation(startFrame)[0];
						var threshold = 100;

						this.switchPath(distance,threshold);
						// reset gesture when threshold is reached
						if (distance > threshold || distance < -threshold) {
							startFrame = null;
						}
					}
					this.setState({navigationGestureIsOn: false});
				}

				else if (handIsHorizontal && fewFingers) {
						//history gesture
					if (!startFrame) {
						startFrame = frame;
						this.setState({navigationGestureIsOn: true});

					} else {
						var moveOnZAxis = (Math.abs(frame.translation(startFrame)[2]) > Math.abs(frame.translation(startFrame)[0]));
						var threshold   = 15;

						if (moveOnZAxis) {
							// navigate through history
							var distance = frame.translation(startFrame)[2];

							if (distance > threshold) {
								currentPath.goToFuture(-1);
								startFrame = null;
							} else if (distance < -threshold){
								currentPath.goToPast(-1);
								startFrame = null;
							}

						} else {
							// navigate through child elements
							var distance = frame.translation(startFrame)[0];

							if (distance > threshold) {
								currentPath.changeFuture(1);
								startFrame = null;

							} else if (distance < -threshold){
								currentPath.changeFuture(-1);
								startFrame = null;
							}
						}
					}
					prevFingerCount = hand.fingers.length;
				} else if (this.state.navigationGestureIsOn && prevFingerCount >= hand.fingers.length) {
					// save path
					if (startFrame) {
						if (frame.rotationAngle(startFrame) > 0.5) {
							this.savePath();
							this.setState({navigationGestureIsOn: false});
							startFrame = null;
						}
					}
				} else {
					startFrame = null;
					this.setState({navigationGestureIsOn: false});
				}
			} else {
				startFrame = null;
				this.setState({navigationGestureIsOn: false});
			}
		}.bind(this));

		//mouse fallback:
		window.addEventListener('keydown',function(e){
			var ref         = 'path' + this.state.currentPathId;
			var currentPath = this.refs[ref];

			if(e.keyIdentifier == 'Up') {
				currentPath.goToPast(-1);
			} else if (e.keyIdentifier == 'Down') {
				currentPath.goToFuture(-1);
			} else if (e.keyIdentifier == 'Right') {
				currentPath.changeFuture(1);
			} else if (e.keyIdentifier == 'Left') {
				currentPath.changeFuture(-1);
			} else if (e.keyCode == 32) {
				this.savePath();
			}

		}.bind(this),false);

		//store inital path
		this.savePath(true);
	},

	handleWheel: function (e) {
		e.preventDefault();
		this.setState({scrolled: this.state.scrolled - e.deltaY});
		var threshold = 200;
		// reset scrolled when threshold is reached
		if (this.state.scrolled >= threshold || this.state.scrolled <= -threshold) {
			this.setState({scrolled: 0});
		}

		this.switchPath(this.state.scrolled,threshold);
	},

	switchPath: function (delta,threshold) {
		//move view left or right based on delta
		var currentId = this.state.currentPathId;
		var newPathId, canGoLeft, canGoRight;

		if (delta < 0) {
			newPathId = currentId - 1;
			canGoLeft = newPathId >= 0;
		} else {
			newPathId  = currentId + 1;
			canGoRight = newPathId < this.state.storedPaths.length;
		}

		if (canGoLeft || canGoRight) {
			this.setState({viewOffset: delta});

			//switch path when delta is greater than threshold
			if (delta > threshold || delta < -threshold) {
				this.savePath(true); //update stored path
				this.setState({currentPathId: newPathId});
				this.setState({viewOffset: 0});
			}
		}
	},

	savePath: function (updateExisting) {
		var ref         = 'path' + this.state.currentPathId;
		var currentPath = this.refs[ref];
		var copyOfState = {};

		copyOfState.current = currentPath.state.current;
		copyOfState.past    = currentPath.state.past.slice();
		copyOfState.future  = currentPath.state.future.slice();

		var tempPaths = this.state.storedPaths;
		if (updateExisting) {
			tempPaths[this.state.currentPathId] = copyOfState;
		} else {
			tempPaths.push(copyOfState);
		}

		this.setState({
			storedPaths: tempPaths,
			currentPathId: tempPaths.length - 1
		});
	},

	render: function() {

		return (
			React.DOM.div( 
				{className:  "product-viewer",
				onWheel:    this.handleWheel}, 

				ComposedView( 
					{ref:                    'path' + this.state.currentPathId,
					key:                    'path' + this.state.currentPathId,
					data:                   this.props.data, 
					viewOffset:             this.state.viewOffset,
					initalState:            this.state.storedPaths[this.state.currentPathId],
					navigationGestureIsOn:  this.state.navigationGestureIsOn}),
				PathList( 
					{storedPaths:    this.state.storedPaths,
					currentPathId:  this.state.currentPathId})
			)
		);
	}
});


	//get bike data from xml
	var bike = new DataSet('../data/bike/E-Bike_v4.xml');

	//the leap controller
	var leapController = new Leap.Controller();
	leapController.connect();

	//add react component to DOM
	window.onload = function () {
		var contentFrame = document.getElementById('content');
		React.renderComponent(ProductViewer( {data:  bike} ), contentFrame);
	};
})();