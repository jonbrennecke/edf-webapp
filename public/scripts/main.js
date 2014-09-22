// ************************************************************************
// 
// 
// main javascripts
// 
// 
// ************************************************************************

$(document.body).ready(function(){


	$('a[data-action="display-header"]').click(function(){

	});

	var open = {
		"path" : "TODO"
	};


	var data = {

		"axes" : {

			/**
			 * The 'domain' parameter determines what time interval is shown as the 
			 * x-axis (domain) of the figure.
			 *
			 * The 'domain' should be an object with the fields "left" and "right". 
			 * Valid values for these are percent values as strings (eg '0%','100%'), unix time 
			 * stamps as numbers, or timestamps as strings (eg 'dd/mm/yy, HH:MM:SS'). 
			 *
			 */
			"domain" : {
				"left" : "0%",
				"right" : "100%"
			},

			/**
			 *
			 * The 'range' parameter determines the scale of the y-axis (range) of the figure.
			 *
			 * The 'range' should be an object with the fields "bottom" and "top". Valid values for 
			 * these are numbers such that 'bottom' < 'top' 
			 *
			 */
			"range" : {
				"bottom" : 0,
				"top" : 1
			}
		}
	};

	var figure = new figurejs.Figure('#lineplot');

	$('.figure-box')
		.resizable({
			"handles" : { "se" : ".figure-box--resize-handle" }
		})
		.draggable({})
		.resize(function ( event ) {
			// resize the figure area
			figure.resize(event);
		})

	$('a[data-action="display-header"]').click(function(){
		$('.figure-box--info-menu').toggleClass('show',250);
		$('.figure').toggleClass('hidden');
	})

	var openAsync = $.ajax({
		method : 'GET',
		url : '/api/open',
		data : open,
		contentType : 'application/json',
		dataType : 'json'
	});

	openAsync.success(function (data) {

		var dataAsync = $.ajax({
			method : 'GET',
			url : '/api/data',
			data : {
				'guid' : data.guid,
				'axes' : data.axes
			},
			contentType : 'application/json',
			dataType : 'json'
		});

		// the reserved field is just a bunch of random unicode characters
		delete data.header.reserved;

		Object.keys(data.header).forEach(function(key){
			var field = $('.'+key);
			field.find('.label').text(key+":");
			field.find('.value').text(data.header[key]);
		})

		$('.filename').text(data.path);
		

		dataAsync.done(function ( schema ) {

			// for ( var key in schema ) {

				var key = 'eeg1';
				
				// plot figure
				var line = new figurejs.Line( schema[key].data.x, schema[key].data.y );
				line.area(); // add area under curve
				figure.plot(line);

			// }			
		});


	});

	


});

	