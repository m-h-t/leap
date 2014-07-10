// the composed view contains
// all UI elements 
// and represents one "path"

var HistoryList = React.createClass({
	
	render: function() {	
		var Items = {}; 

		if (this.props.items) {
			Items = this.props.items.map(function(item, i) {
				return (
					<li 
						className = "history-item"
						key       = {item.id + i}
						onClick   = {function(){this.props.goToItem(i);}.bind(this)}>
						<img 
							className = "history-image" 
							src       = {'../data/bike/' + item.image}/>
						<p className = "history-name">
							{item.name}
						</p>
					</li>
				);
				
			},this);
		}

		return (
			<ul className="history-list">
				{Items}
			</ul>
		);
	}
});