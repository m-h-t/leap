// the composed view contains
// all UI elements 
// and represents one "path"

var ComposedView = React.createClass({
	getInitialState: function () {
		return {
			past: [],
			current: this.props.data,
			future: []
		};
	},
	
	render: function() {
		var item = this.state.current;
		return <div 
			className = "composed-view">
				{item.name}
				<ChildList items={item.children} />
				<img src={'../data/bike/' + item.image} />
		</div>;
	}
});