var through2 =		require('through2');
var path =			require('path');
var mkdirp =		require('mkdirp');
var fs =			require('graceful-fs');



function SymlinkStream () {

	return through2.obj(function (file, _, callback) {
		mkdirp(path.dirname(file.path), function (error) {
			if (error)
				return callback(error);
			fs.symlink(file.source.path, file.path, function (error) {
				if(error)
					return callback(error);
				callback(null, file);
			});
		});
	});
}



module.exports = SymlinkStream;