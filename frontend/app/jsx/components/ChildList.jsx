// the composed view contains
// all UI elements 
// and represents one "path"

var ChildList = React.createClass({
	
	render: function() {	
		var itemList = this.props.items;
		if (!itemList) {
			itemList = [{id: 'empty', name:'', image: 'data/empty.png'}];
		}

		var	Items = itemList.map(function(item, i) {
			var classes = ClassSet({
			  'child-item': true,
			  'is-current-future': (this.props.currentFutureIndex == i && this.props.highlightChurrent),
			});

			return (
				<li 
					style     = {{transform: 'translateX('+this.props.currentFutureIndex * -115 +'px)'}}
					className = {classes}
					key       = {item.id + i}
					onClick   = {function(){this.props.goToItem(item);}.bind(this)}>
						<p className = "child-name">
							{item.name}
						</p>
						<img className="child-image" src={'../data/bike/' + item.image} />
				</li>
			);
			
		},this);

		return (
			<div className = "child-list-wrapper">
				<p className = "title">
					Parts:
				</p>
				<ul className = "child-list">
					{Items}
				</ul>
			</div>
		);
	}
});