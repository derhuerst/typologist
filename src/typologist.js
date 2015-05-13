// dependencies
var EventEmitter =	require('events').EventEmitter;
var path =			require('path');
var commondir =		require('commondir');
var util =			require('util');
var through2 =		require('through2');
var SourceStream =	require('./SourceStream');
var SortStream =	require('./SortStream');
var SymlinkStream =	require('./SymlinkStream');



// todo: solid stream error handling
// todo: filter dirs, only files



// Initialize a new `Typologist`.
function Typologist (source, dest) {
	EventEmitter.call(this);

	source = path.join(process.cwd(), source || '.');
	dest = path.join(process.cwd(), dest || '.');
	this.base = commondir(source, dest);
	this.source = path.relative(this.base, source);
	this.dest = path.relative(this.base, dest);
	this.plugins = [];
}
util.inherits(Typologist, EventEmitter);



// Wrap a given `plugin` functions in a *through2* wrapper and add it to `plugins`.
Typologist.prototype.use = function (plugin) {
	this.plugins.push(through2.obj(plugin));

	return this;
};



// Search for files in `globs` and process them using `plugins`.
Typologist.prototype.src = function (globs) {
	var stream = new SourceStream(this.base, this.source, globs);

	var i, length;
	for (i = 0, length = this.plugins.length; i < length; i++) {
		stream = stream.pipe(this.plugins[i]);
	}

	stream
	.pipe(new SortStream(this.base, this.source, this.dest))
	.pipe(new SymlinkStream(this.base, this.source, this.dest))

	.on('error', console.error);

	return this;
};



module.exports = Typologist;