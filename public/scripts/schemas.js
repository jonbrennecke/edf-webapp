(function ( mod ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) { // CommonJS, Node 
		module.exports = mod(
			require('edflib'),
			require('node-linalg'),
			require(__dirname+'/figure'),
			window.$
		);
	}
	else
		throw "This module is only supported on Node.js.";

}(function ( edflib, linalg, figurejs, $ ) {



	function AsyncEdfPlotter ( figure ) {
		this.figure = figure;
		this.promisedFile = $.Deferred();

		// default window of first 500 data points
		this.window = {
			start : 0,
			end : 500
		} 

		// when the promised file is resolved, load the Edf file
		// and plot it
		this.promisedFile.then(function ( edf ) {

			this.edf = edf;
			var header = this.edf.getHeader();

			// the reserved field is just a bunch of random unicode characters
			delete header.reserved;

			this.header = header;

			Object.keys(this.header).forEach(function(key){
				var field = $('.'+key);
				field.find('.label').text(key+":");
				field.find('.value').text(this.header[key]);
			}.bind(this));

			// by default, get the first channel
			// TODO, add a settings field where the channel can be selected
			this.data = this.edf.getData(0);

			var y = this.data.slice(this.window.start,this.window.end), 
				x = linalg.range(0,y.length).toArray()[0],
				line = new figurejs.Line(
					linalg.range(0,y.length).toArray()[0],
					y
				);

			line.area(); // area under the line
			this.figure.plot(line);

		}.bind(this));
	}

	AsyncEdfPlotter.prototype = {

		setData : function ( data ) {
			this.data = data;

			// TODO might need to change the default windowing
			this.window.start = 0;
			this.window.end = this.data.length;
		},

		onload : function ( callback ) {
			this.promisedFile.then(callback.bind(this));
		},

		// load the Edf file
		openFile : function ( path ) { 
			this.promisedFile.resolve(new edflib.Edf(path));
		},

		setWindow : function ( start, end ) {
			this.promisedFile.then(function(){

				if ( end > start ) {

					this.figure.clear();

					this.window.start = start;
					this.window.end = end;

					var y = this.data.slice(this.window.start,this.window.end),
						x = linalg.range(0,y.length).toArray()[0],
						line = new figurejs.Line(
							linalg.range(0,y.length).toArray()[0],
							y
						);

					line.area(); // area under the line
					this.figure.plot(line);
				}

			}.bind(this));
		},

		// translate start and end into numbers and feed them into setWindow
		// TODO allow user to pick channel index
		setWindowFromStrings : function ( start, end ) {
			this.promisedFile.then(function(){

				if ( start && end ) {

					var hms = /([\d]{2})(?:[:.])*([\d]{2})(?:[:.])*([\d]{2})*/, // matches HH:MM and HH:MM:SS

						// convert into integer arrays
						ints = function (val) { return val ? +val|0 : 0 },

						// reduce to seconds
						sec = function (a) { return (a[0] * 60 + a[1]) * 60 + a[2]; },

						// calculate the # of seconds
						startTime = sec(start.match(hms).slice(1,4).map(ints)),
						endTime = sec(end.match(hms).slice(1,4).map(ints)),

						// calculate the start time of the file in seconds
						fileStartTime = sec(this.header.starttime.match(hms).slice(1,4).map(ints)),

						frequency = +this.header.samples[0] / +this.header.duration; 

					// the window is given by the number of samples since the beginning of the file
					this.setWindow( 
						frequency * (startTime - fileStartTime), 
						frequency * (endTime - fileStartTime)
					);

				}

			}.bind(this));
		},


		dragWindow : function ( event, deltaX ) {
			this.promisedFile.then(function(){

				this.figure.clear();

				this.window.start+=Math.floor(deltaX*0.05);
				this.window.end+=Math.floor(deltaX*0.05);

				var y = this.data.slice(this.window.start,this.window.end),
					x = linalg.range(0,y.length).toArray()[0],
					line = new figurejs.Line(
						linalg.range(0,y.length).toArray()[0],
						y
					);

				line.area(); // area under the line
				this.figure.plot(line);

			}.bind(this));
		}

	};

	return {
		'AsyncEdfPlotter' : AsyncEdfPlotter
	};

}));