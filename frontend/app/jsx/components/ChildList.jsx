// the composed view contains
// all UI elements 
// and represents one "path"

var ChildList = React.createClass({
	
	render: function() {	
		var Items = {}; 
		if (this.props.items) {
			var cx = React.addons.classSet;

			Items = this.props.items.map(function(item, i) {
				var classes = cx({
				  'child-item': true,
				  'is-current-future': this.props.currentFutureIndex == i,
				});

				return <li 
					className = {classes}
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