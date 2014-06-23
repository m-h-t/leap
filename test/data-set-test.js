
var bike = new DataSet('../data/bike/E-Bike_v4.xml');

function traverse(o ) {
    for (i in o) {
        if (typeof(o[i])=="object") {
            // console.log(i, o[i])

            if (i == 2 && typeof o[i].Value != 'undefined') {
                // console.log(o[i].Value);

                $('body').append('<img src="../data/bike/' + o[i].Value + '"/>');
            }
            traverse(o[i] );
        }
    }
}

traverse(bike);
