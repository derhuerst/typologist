var VinylFile =	require('vinyl');
var through2 =	require('through2');
var path =		require('path');



function SortStream (base, source, dest) {
	dest = path.join(base, dest);

	return through2.obj(function (sourceFile, _, callback) {
		var i, collection, j, file;

		for (i in sourceFile.collections) {
			collection = sourceFile.collections[i];
			if (typeof collection === 'string')
				collection = [collection];
			if (!Array.isArray(collection)) continue;

			for (j = 0; j < collection.length; j++) {
				file = new VinylFile({
					cwd: dest,
					base: dest,
					path: path.join(dest, path.join(i, collection[j])),
					contents: sourceFile.contents
				});
				file.source = sourceFile;
				this.push(file);
			}
		}
		callback();
	});
}



module.exports = SortStream;