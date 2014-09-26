

////////////////////////////////////////////////////////////
// install script //////////////////////////////////////////
////////////////////////////////////////////////////////////

// TODO stat 

// because of a bug in Nodewebkit 0.8.6
// we need to rename node_modules/nodewebkit/package.json to 
// node_modules/nodewebkit/_package.json
var fs = require('fs');

fs.rename(__dirname+'/node_modules/nodewebkit/package.json', __dirname+'/node_modules/nodewebkit/_package.json', function(err) {
    if ( err ) console.log('ERROR: ' + err);
});


// install edflib

var spawn = require('child_process').spawn;

// install edflib
process.chdir( __dirname+'/public/' );

var npm = spawn( 'npm', [ 'install' ]);

npm.stdout.pipe(process.stdout); // TODO disable in production
npm.stderr.pipe(process.stderr); // TODO disable in production

