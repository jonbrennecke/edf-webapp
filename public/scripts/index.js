(function ( mod ) {

	mod(
		require('./scripts/schemas'),
		require('./scripts/figure'),
		require('./scripts/linalg')
	);

}(function ( schemas, figurejs, linalg ) {


	$(document.body).ready(function(){

		// create a new figure *************************************
		var figure = new figurejs.Figure('#lineplot'), 

			// Open the Edf file in the Async handler object *******	
			plotter = new schemas.AsyncEdfPlotter(figure);

		
		//////////////////////////////////////////////////////////// 
		//////////////////////////////////////////////////////////// 
		// Michelle's program //////////////////////////////////////
		////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////// 

		plotter.onload(function(){

			//////////////////////////////////////////////// 
			// find the first n 10 minute intervals ////////
			//////////////////////////////////////////////// 


			var ttlIndex = plotter.header.labels.indexOf('TTL'),
				ttl = this.edf.getData(ttlIndex),

				// matches HH:MM and HH:MM:SS
				hms = /([\d]{2})(?:[:.])*([\d]{2})(?:[:.])*([\d]{2})*/, 

				// convert string arrays into integer arrays
				ints = function (val) { return val ? +val|0 : 0 },

				// reduce to seconds
				sec = function (a) { return (a[0] * 60 + a[1]) * 60 + a[2]; },

				// starttime in seconds
				fileStartTime = sec(plotter.header.starttime.match(hms).slice(1,4).map(ints)),

				// TODO front end interface to change this value
				n = 10,

				// round up to the nearest 10min interval
				interval = 600,
				startTime = fileStartTime%interval?(startTime + interval - (fileStartTime%interval)):fileStartTime,

				// frequency of the eeg
				frequency = +plotter.header.samples[0] / +plotter.header.duration, 

				// number of samples in a 10min interval
				intervalSamples = interval * frequency,

				// the number of samples til the first 10 min interval
				startTimeSamples = frequency * (startTime - fileStartTime),

				onsets = [];
				
			// extract the first n 10 min intervals after startTimeSamples
			for (var i = 0; i < n; i++) {
				
				// start and end (in samples) of a 10 min interval
				var start = startTimeSamples + (startTimeSamples*n),
					end = startTimeSamples + (startTimeSamples*n) + intervalSamples;

				// find the first ttl onsets in each 10min interval
				ttl.slice(start,end).some(function(val,i){
					if ( val ) { onsets.push(i); return true; }
				});
			};

			if ( onsets.length ) {

				var eeg1Index = plotter.header.labels.indexOf('EEG1'),
					eeg1 = this.edf.getData(eeg1Index);

				// find an interval of 500ms before and 500ms after each onset
				var intervalAroundOnsets = onsets.map(function ( val ) {
					return eeg1.slice(
						startTimeSamples + onsets - 500, 
						startTimeSamples + onsets + 500
					);
				});

				console.log(intervalAroundOnsets)

				// average the intervals
				var avg = intervalAroundOnsets[0].map(function ( val, i ) {
					for (var sum = 0, j=0;j<n;j++) {
						sum += intervalAroundOnsets[j][i];
					}
					return sum /= n;
				});

				plotter.setData(avg);
			}
		});




		// figure window should be resizable and draggable
		$('.figure-box')
			.resizable({
				"handles" : { "se" : ".figure-box--resize-handle" }
			})
			.draggable({
				"handle" : ".figure-box--title-handle"
			})
			.resize(function ( event ) {
				figure.resize(event); // resize the figure area
			});

		// figure window should also resize when the window resizes
		$(window).resize(function( event ) {
			figure.resize(event);
		});

		// this has to be after body is loaded since proton looks for a few html elements
		var proton = require('./scripts/proton');

		// bring up proton's openFileDialog when the open-file action is clicked
		$('h1[data-action="open-file"]').click(function(){
			proton
				.openFileDialog()
				.then(function ( path ) {
					plotter.openFile(path);
					plotter.setWindow(0,500);
				});
		});

		// display a new line segment on drag ******************

		var drag = false, 
			deltaX = 0,
			center = plotter.figure.$element.position().left + plotter.figure.width * 0.5;

		$('div[data-action="scroll-and-zoom-data-window"]')
			.on('mousedown', function (evt) {
				$(this).on('mouseup mousemove', function handler(evt) {
					if (evt.type !== 'mouseup') {
						drag = true;
					}
					$(this).off('mouseup mousemove', handler);
				});
			})
			.on('mousemove',function (evt) {
				if (drag) {
					deltaX = evt.clientX - deltaX;
					// plotter.dragWindow(evt, deltaX);
					// console.log(deltaX,evt)
				}
			})
			.on('mouseup',function () {
				drag = false;
			})


		// display the header information
		$('a[data-action="display-header"]')
			.click(function(){
				$('.figure-box--info-menu').toggleClass('show',250);
				$('.figure').toggleClass('hidden');
			});

		// settings icon opens the settings menu
		$('a[data-action="open-settings"]')
			.click(function(){
				$(this).parent().toggleClass('extended')
			})

		// change the window to a different point
		$('div[data-action="update-window"]')
			.click(function ( event ) {
				
				plotter.setWindowFromStrings(
					$("#window-start").val(), 
					$("#window-end").val()
				);

			});
	});

}));

	