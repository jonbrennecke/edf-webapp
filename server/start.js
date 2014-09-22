(function(){

	// load and start the server *************************************************************

	var Server = require('./server'),
		schemas = require('./schemas');


	var server = (new Server(3000)).configure().start();

	// load the edf file **********************************************************************

	// TODO get the file path from the front end

	var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
		path = home + '/Desktop/testfiles/NEF1960 F Tamoxifen SD 03_06_2014 with TTL Channel.edf';

	var file = new schemas.OpenFileSchema(path);

	var table = {};

	table[file.guid] = file;



	// Define API endpoints *******************************************************************

	/**
	 *
	 * /open - open a file and return a GUID
	 *		
	 *		The sever stores the GUID in a lookup table
	 *
	 * 		:return OpenFileSchema with header information
	 *
	 * /data - (signed with GUID from /open)
	 *
	 * 		:return DataSchema
	 *
	 * /header - (signed with GUID from /open) get the header from the given EDF file
	 *
	 *		:return HeaderSchema
	 *
	 */

	// Endpoint for /open
	server.app
		.route('/api/open')
		.get(function( req, res ) {

			// TODO

			res.send(file.serialize());
		});

	// Endpoint for /data 
	server.app
		.route('/api/data')
		.get(function( req, res ) {
			var data = new schemas.DataSchema(file);
			res.send(data.serialize());
		});

	// Endpoint for /header
	server.app
		.route('/api/header')
		.get(function( req, res ) {

			var header = new schemas.HeaderSchema(file);

			res.send(header.serialize());
		});



	

}());