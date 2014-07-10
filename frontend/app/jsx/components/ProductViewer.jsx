// the product viewer stores the global state of the app
// and handles events

var ProductViewer = React.createClass({
	getInitialState: function () {
		var numberOfChildren = this.props.data.children.length - 1;
		var middleIndex      = parseInt(numberOfChildren/2);

		return {
			storedPaths:           [{past: [], future: [this.props.data.children[middleIndex]], current: this.props.data}],
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
						if (frame.rotationAngle(startFrame) > 0.7) {
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
				//enter key
				this.savePath();
			} else if (e.keyCode == 8) {
				//backspace
				e.preventDefault();
				this.deletePath();
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

		if (delta > 0) {
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

	deletePath: function () {
		var tempPaths = this.state.storedPaths;
		if (tempPaths.length > 1) {
			tempPaths.splice(this.state.currentPathId,1);

			var newCurrentPathId = this.state.currentPathId - 1;
			if (newCurrentPathId < 0) newCurrentPathId = 0;

			this.setState({
				storedPaths: tempPaths,
				currentPathId: newCurrentPathId
			});
		}
	},

	render: function() {

		return (
			<div 
				className = "product-viewer"
				onWheel   = {this.handleWheel}>

				<PathList 
					storedPaths   = {this.state.storedPaths}
					currentPathId = {this.state.currentPathId}
					viewOffset    = {this.state.viewOffset}/>

				<ComposedView 
					ref                   = {'path' + this.state.currentPathId}
					key                   = {'path' + this.state.currentPathId}
					data                  = {this.props.data} 
					initalState           = {this.state.storedPaths[this.state.currentPathId]}
					navigationGestureIsOn = {this.state.navigationGestureIsOn}/>
			</div>
		);
	}
});