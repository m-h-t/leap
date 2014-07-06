// the composed view contains
// all UI elements 
// and represents one "path"

var PathList = React.createClass({
	
	render: function() {	
		var currentPath = this.props.storedPaths[this.props.currentPathId];

		var Paths = this.props.storedPaths.map(function(path,index) {
			var classes = ClassSet({
				'path-list-element': true,
				'is-current'       : (index == this.props.currentPathId)
			});

			return (
				<li 
					key       = {'path'+index}
					className = {classes}>
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