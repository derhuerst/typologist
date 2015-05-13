var path =			require('path');
var vfs =			require('vinyl-fs');
var basename =		require('vinyl-basename');



function SourceStream (base, source, globs) {
	if (!Array.isArray(globs) && globs)
		globs = [globs];
	else if (globs.length === 0)
		return;

	// normalize `globs` with `source`
	var i, length;
	for (i = 0, length = globs.length; i < length; i++) {
		globs[i] = path.join(source, globs[i]);
	}

	return vfs.src(globs, {
		buffer: false,
		cwd: base,
		base: base
	})
	.pipe(basename);
}



module.exports = SourceStream;