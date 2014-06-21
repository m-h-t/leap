//product viewer
var ComposedView = React.createClass({
	
	render: function() {
		return <div 
			className = "composed-view">
			{this.props.pathName}
		</div>;
	}
});