(function ( mod ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) // CommonJS, Node
		module.exports = mod(require('./edflib'),require('./linalg'));
	else
		throw "This module is only supported on Node.js.";

}(function ( edflib, linalg ) {


	/**
	 *
	 * API Schema for an open file
	 *
	 */
	function OpenFileSchema ( path ) {
		this.path = path;
		this.edf = new edflib.Edf(path);
		this.guid = 'TODO';
		this.header = (new HeaderSchema(this)).serialize().header;
		this.data = {};
		
		// this part might take a while...
		this.header.labels.forEach(function (label,i) {
			this.data[label.toLowerCase().trim()] = this.edf.getData(i);
		}.bind(this));
	};

	OpenFileSchema.prototype = {
		
		// serialize the object to send it back to the front end
		serialize : function () {
			return {
				'path' : this.path,
				'guid' : this.guid,
				'header' : (new HeaderSchema(this)).serialize().header
			};
		}
	};

	/**
	 *
	 * API Schema for a file header
	 *
	 * :param file - (OpenFileSchema) the file schema
	 *
	 */
	function HeaderSchema ( file ) {
		this.file = file;
	};

	HeaderSchema.prototype = {
		
		// serialize the object to send it back to the front end
		serialize : function () {
			return {
				'header' : this.file.edf.getHeader()
			};
		}
	};



	/**
	 *
	 * API Schema for a windowed signal
	 *
	 */
	function DataSchema ( file ) {
		this.file = file;
		// this.y = this.file.edf.getData(2).slice(1,100);
	};

	DataSchema.prototype = {
		
		// serialize the object to send it back to the front end
		serialize : function () {

			data = {};

			for ( var key in this.file.data ) {

				var y = this.file.data[key].slice(1,500);

				data[key] = {
					'data' : {
						'x' : linalg.range(0,y.length).toArray()[0],
						'y' : y,
					}
				}
			}

			return data;
		},

		setAxes : function ( axes ) {

		}
	};


	/**
	 *
	 * API Schema for axes (to be applied to a signal)
	 *
	 */
	// function AxesSchema( axes ) {
	// 	console.log(axes)
	// };

	// AxesSchema.prototype = {

	// };

	return {
		'DataSchema' : DataSchema,
		'OpenFileSchema' : OpenFileSchema,
		'HeaderSchema' : HeaderSchema,
		// 'AxesSchema' : AxesSchema
	};

}));