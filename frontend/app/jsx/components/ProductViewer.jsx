//product viewer
var ProductViewer = React.createClass({
	getInitialState: function () {
		return {
			scrolled: 0
		};
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
			<div 
			className = "product-viewer"
			onWheel = {this.handleWheel}>
				<ComposedView 
					ref = "pathIdentifier"
					pathName = "path Name" />
			</div>
		);
	}
});