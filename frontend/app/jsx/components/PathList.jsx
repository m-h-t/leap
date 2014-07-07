// the composed view contains
// all UI elements 
// and represents one "path"

var PathList = React.createClass({
	
	render: function() {	
		var currentPath  = this.props.storedPaths[this.props.currentPathId];
		var movePosition = parseInt(this.props.viewOffset);

		var Paths = this.props.storedPaths.map(function(path,index) {
			var classes = ClassSet({
				'path-list-element': true,
				'is-current'       : (index == this.props.currentPathId)
			});

			return (
				<li 
					key       = {'path' + index}
					className = {classes}
					style     = {{
						left: this.props.currentPathId * -222,
						transform: 'translateX('+ movePosition +'px)'
					}}>
					{path.current.id}
				</li>
			);
		},this);
		return (
			<ul 
				className = "path-list">

				{Paths}
			</ul>
		);
	}
});