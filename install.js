

////////////////////////////////////////////////////////////
// install script //////////////////////////////////////////
////////////////////////////////////////////////////////////

var spawn = require('child_process').spawn;

// install edflib

process.chdir( __dirname+'/public/node_modules/edflib/' );

var npm = spawn( 'npm', [ 'install' ]);

npm.stdout.pipe(process.stdout); // TODO disable in production
npm.stderr.pipe(process.stderr); // TODO disable in production

