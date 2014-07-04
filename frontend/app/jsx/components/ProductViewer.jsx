// the product viewer stores the global state of the app
// and handles events

var ProductViewer = React.createClass({
	getInitialState: function () {
		return {
			paths: [this.props.data.id],
			currentPathId: 0,
			scrolled: 0
		};
	},

	componentDidMount: function () {
		// listner to leap events goes here
		// call this.switchPath(delta) to move element
		var startFrameP = null;
		var startFrameH = null;

		leapController.on('frame', function( frame ){
			var ref = 'path' + this.state.currentPathId;
			var currentPath = this.refs[ref];


			var hand = frame.hands[0];

			if (hand) {
				if (hand.palmNormal[0] > 0.8 || hand.palmNormal[0] < -0.8) {
					//swipe
					if (!startFrameP) {
						startFrameP = frame;
					} else {
						var distance = frame.translation(startFrameP)[0];
						this.switchPath(distance);
						if (distance > 150 || distance < -150) {
							startFrameP = null;
						}
					} 
				}
				if (hand.palmNormal[0] < 0.2 && hand.palmNormal[0] > -0.2 && hand.fingers.length >= 1 && hand.fingers.length <= 3) {
						//history gesture
					if (!startFrameH) {
						startFrameH = frame;
					} else {
						if (Math.abs(frame.translation(startFrameH)[2]) > Math.abs(frame.translation(startFrameH)[0])) {
							var distance = frame.translation(startFrameH)[2];
							// console.log(parseInt(distance));

							if (distance > 15) {
								currentPath.goToFuture(-1);
								startFrameH = null;
							} else if (distance < -15){
								currentPath.goToPast(-1);
								startFrameH = null;
							}
						} else {
							var distance = frame.translation(startFrameH)[0];

							if (distance > 15) {
								currentPath.changeFuture(1);
								startFrameH = null;
							} else if (distance < -15){
								currentPath.changeFuture(-1);
								startFrameH = null;
							}
						}
					} 
				}
			}
		}.bind(this));

		//example:
		window.addEventListener('keydown',function(e){
			var ref = 'path' + this.state.currentPathId;
			var currentPath = this.refs[ref];

			if(e.keyIdentifier == 'Up') {
				currentPath.goToPast(-1);
			} else if (e.keyIdentifier == 'Down') {
				currentPath.goToFuture(-1);
			} else if (e.keyIdentifier == 'Right') {
				currentPath.changeFuture(1);
			} else if (e.keyIdentifier == 'Left') {
				currentPath.changeFuture(-1);
			}

		}.bind(this),false);
	},

	handleWheel: function (e) {
		e.preventDefault();
		// we write directly to state because it does not affect the DOM
		this.state.scrolled -= e.deltaY;

		this.switchPath(this.state.scrolled);
	},

	switchPath: function (delta) {
		//move view left or right based on delta
		var ref = 'path' + this.state.currentPathId;
		var viewNode = this.refs[ref].getDOMNode();
		viewNode.style.transform = 'translateX('+delta+'px)';

		//TODO: switch path when delta is greater than 100
		if (delta > 150 || delta < -150) {
			alert('switchPath');
			this.state.scrolled = 0;
			viewNode.style.transform = 'translateX(0)';
		}

	},

	render: function() {
		var pathName = this.state.paths[this.state.currentPathId];

		return (
			<div 
			className = "product-viewer"
			onWheel = {this.handleWheel}>
				<ComposedView 
					ref = {'path' + this.state.currentPathId}
					data = {this.props.data} />
			</div>
		);
	}
});