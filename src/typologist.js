// dependencies
var EventEmitter =	require('events').EventEmitter;
var util =			require('util');
var path =			require('path');
var through2 =		require('through2');
var SourceStream =	require('./SourceStream');
var SortStream =	require('./SortStream');
var SymlinkStream =	require('./SymlinkStream');



// todo: stream error handling
// todo: watch



// Initialize a new `Typologist`.
function Typologist (base, source, dest) {
	EventEmitter.call(this);

	this.base = path.join(process.cwd(), base || '.');
	this.source = source || '_';
	this.dest = dest || '.';
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