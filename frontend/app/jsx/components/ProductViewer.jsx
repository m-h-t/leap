// the product viewer stores the global state of the app
// and handles events

var ProductViewer = React.createClass({
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
			<div 
			className = "product-viewer"
			onWheel = {this.handleWheel}>
				<ComposedView 
					ref = {'path' + this.state.currentPath}
					data = {this.props.data} />
			</div>
		);
	}
});