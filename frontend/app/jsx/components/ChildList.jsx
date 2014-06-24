// the composed view contains
// all UI elements 
// and represents one "path"

var ChildList = React.createClass({
	
	render: function() {	
		var Items = {}; 
		if (this.props.items) {
			Items = this.props.items.map(function(item, i) {
				return <li 
					className = "child-item"
					key = {item.id + i}
					onClick = {function(){this.props.goToItem(item);}.bind(this)}>
						{item.name}
						<img className="child-image" src={'../data/bike/' + item.image} />
				</li>;
			},this);
		}

		return <ul className="child-list">
			{Items}
		</ul>;
	}
});