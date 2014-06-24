// the composed view contains
// all UI elements 
// and represents one "path"

var ChildList = React.createClass({
	
	render: function() {	
		var Items = this.props.items.map(function(item) {
			return <li className="child-item">
				{item.name}
				<img className="child-image" src={'../data/bike/' + item.image} />
			</li>;
		});

		return <ul className="child-list">
			{Items}
		</ul>;
	}
});