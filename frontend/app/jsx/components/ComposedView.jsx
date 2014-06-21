// the composed view contains
// all UI elements 
// and represents one "path"

var ComposedView = React.createClass({
	
	render: function() {
		return <div 
			className = "composed-view">
			{this.props.pathName}
		</div>;
	}
});