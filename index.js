(function(){

	// locate and start Node Webkit

	var spawn = require('child_process').spawn,
		// findpath = require('nodewebkit').findpath;  // TODO only works in NW >=10.0
		// nwpath = findpath(),
		nwpath = './node_modules/nodewebkit/bin/nodewebkit',
		nw = spawn(nwpath,[ __dirname + '/public/', '--no-toolbar' ]);

	// nw.stdout.pipe(process.stdout); // TODO disable in production
	// nw.stderr.pipe(process.stderr); // TODO disable in production

}());