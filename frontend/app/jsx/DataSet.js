function DataSet(path) {
	var xhttp = new XMLHttpRequest();

	xhttp.open("GET", path, false);
	xhttp.send();
	var xmlDoc = xhttp.responseXML;

	// var oSerializer = new XMLSerializer();
	// var sXML = oSerializer.serializeToString(xmlDoc);
	// console.log(xmlDoc);

	var x2js = new X2JS();

	var json = x2js.xml2json( xmlDoc );
	var beatifulObj = beautitfyJson(json.VGraph.N);
	
	return beatifulObj;
}

function beautitfyJson (json) {
	var beatifulObj = {};
 	var values = json.Data.Attr;

 	for (var i = 0; i < values.length; i++) {
 		beatifulObj[values[i].Key] = values[i].Value;
 	}

 	var children = json.N;
 	if (children) {
 		beatifulObj.children = [];	
 		for (var i = 0; i < json.N.length; i++) {
 			beatifulObj.children[i] = beautitfyJson(children[i]);
 		};
 	}

 	return beatifulObj;
}