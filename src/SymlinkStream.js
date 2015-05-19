var skipConflicts =	require('gulp-skip-conflicts');
var through2 =		require('through2');
var path =			require('path');
var mkdirp =		require('mkdirp');
var fs =			require('graceful-fs');



function SymlinkStream (base) {

	var result = skipConflicts();
	result.pipe(through2.obj(function (file, _, callback) {
		mkdirp(path.dirname(file.path), function (error) {
			if (error)
				return callback(error);
			fs.symlink(file.source.path, file.path, function (error) {
				if(error)
					return callback(error);
				callback(null, file);
			});
		});
	}));
	return result;
}



module.exports = SymlinkStream;