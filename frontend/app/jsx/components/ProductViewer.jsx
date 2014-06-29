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
		this.state.scrolled -= e.deltaX;

		this.switchPath(this.state.scrolled);
	},

	switchPath: function (delta) {
		//move view left or right based on delta
		var ref = 'path' + this.state.currentPathId;
		var viewNode = this.refs[ref].getDOMNode();
		viewNode.style.transform = 'translateX('+delta+'px)';

		//TODO: switch path when delta is greater than 100

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