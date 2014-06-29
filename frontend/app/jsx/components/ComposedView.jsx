// the composed view contains
// all UI elements 
// and represents one "path"
// stores current state in path
// and manages "walking in the path"

var ComposedView = React.createClass({
	getInitialState: function () {
		return {
			past: [],
			current: {},
			future: [],
		};
	},

	componentWillMount: function () {
		var initialFuture = [];
		if (this.props.data.children) {
			initialFuture.push(this.props.data.children[0]);
		}

		this.setState({
			current: this.props.data,
			future: initialFuture
		});
	},

	goToItem: function (item) {
		// go to specified item
		// add current item to past
		// and clear future
		var tmpPast = this.state.past;
		var newFuture = [];

		tmpPast.push(this.state.current);
		if (item.children) {
			newFuture.push(item.children[0]);
		}

		this.setState({
			current: item,
			past: tmpPast,
			future: newFuture
		});
	},

	goToPast: function (index) {
		var tmpPast = this.state.past;
		var tmpFuture = this.state.future;

		// when index is negative go back as many index * -1 steps
		if (index < 0) index = tmpPast.length + index;

		if (index >= 0 && index < tmpPast.length) {
			// remove elements from past
			var howMany = tmpPast.length - index;
			var removedFromHistory = tmpPast.splice(index,howMany);

			// add all removed items except the goToItem to future
			// also add the old current item to the future
			var goToItem = removedFromHistory.shift();
			removedFromHistory.push(this.state.current);
			tmpFuture = removedFromHistory.concat(tmpFuture);

			this.setState({
				current: goToItem,
				past: tmpPast,
				future: tmpFuture
			});
		}
	},

	goToFuture: function (index) {
		var tmpPast = this.state.past;
		var tmpFuture = this.state.future;

		// when index is negative go forward index * -1 steps
		if (index < 0) index = (index * -1) -1;

		if (index >= 0 && index < tmpFuture.length) {
			// remove elements from future
			var howMany = tmpFuture.length - index;
			var newFuture = tmpFuture.splice(index,howMany);
			// also remove goToItem from newFuture
			var goToItem = newFuture.shift();

			if (newFuture.length === 0 && goToItem.children) {
				newFuture.push(goToItem.children[0]);
			}

			// add current Item and the items removed from future to past
			tmpPast.push(this.state.current);
			tmpPast = tmpPast.concat(tmpFuture);

			this.setState({
				current: goToItem,
				future: newFuture,
				past: tmpPast
			});
		}
	},

	changeFuture: function (step) {
		var currentFuture = this.state.future[0];
		var newFutureIndex = this.state.current.children.indexOf(currentFuture) + step;
		var childrenSize = this.state.current.children.length - 1;

		if (newFutureIndex < 0) newFutureIndex = childrenSize;
		if (newFutureIndex > childrenSize) newFutureIndex = 0;

		var newFuture = [];
		newFuture[0] = this.state.current.children[newFutureIndex];

		this.setState({
			future: newFuture
		});
	},
	
	render: function() {
		var item = this.state.current;
		var currentFuture = this.state.future[0];
		var currentFutureIndex = 0;
		if (this.state.current.children) {
			currentFutureIndex = this.state.current.children.indexOf(currentFuture);
		}

		return <div 
			className = "composed-view">
				<HistoryList
					items = {this.state.past} 
					goToItem = {this.goToPast}/>

				<div className = "view-center">
					<ChildList 
						items = {item.children} 
						currentFutureIndex = {currentFutureIndex}
						goToItem = {this.goToItem}/>
					{item.name} <br/>
					<img src={'../data/bike/' + item.image} />
				</div>

				<HistoryList
					items = {this.state.future} 
					goToItem = {this.goToFuture}/>
		</div>;
	}
});