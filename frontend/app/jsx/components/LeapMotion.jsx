var controller = new Leap.Controller();

for( var i =  0; i < frame.gestures.length; i++){
	var gesture  = frame.gestures[0];
    var type = gesture.type;

    switch( type ){

		case "circle":
	    	console.log("Circle erkannt");
	        onCircle(gesture);
	    break;

	    case "swipe":
	    	console.log("swipe erkannt");
	        //onSwipe(gesture);
	    break;

	    case "screenTap":
	      	console.log("screenTap erkannt");
	        //onScreenTap(gesture);
	    break;

	    case "keyTap":
	      	console.log("keyTap erkannt");
	        //onKeyTap(gesture);
	    break;

	}
});

controller.connect();