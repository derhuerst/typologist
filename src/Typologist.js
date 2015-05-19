// dependencies
var EventEmitter =	require('events').EventEmitter;
var path =			require('path');
var commondir =		require('commondir');
var util =			require('util');
var through2 =		require('through2');
var SourceStream =	require('./SourceStream');
var SortStream =	require('./SortStream');
var SymlinkStream =	require('./SymlinkStream');



// todo: filter dirs, only files
// todo: relative symlinks?



// Initialize a new `Typologist`.
function Typologist (source, dest) {
	EventEmitter.call(this);

	source = path.join(process.cwd(), source || '.');
	dest = path.join(process.cwd(), dest || '.');
	this.base = commondir([source, dest]);
	this.source = path.relative(this.base, source);
	this.dest = path.relative(this.base, dest);
	this.plugins = [];
}
util.inherits(Typologist, EventEmitter);



// Wrap a given `plugin` functions in a *through2* wrapper and add it to `plugins`.
Typologist.prototype.use = function (plugin) {
	this.plugins.push(through2.obj(plugin));
	this.emit('use', plugin);

	return this;
};



// Search for files in `globs` and process them using `plugins`.
Typologist.prototype.src = function (globs) {
	var onError, onPluginError, stream;

	onError = this._onError.bind(this);
	onPluginError = this._onPluginError.bind(this);

	stream = new SourceStream(this.base, this.source, globs);
	stream.on('error', onError);

	var i, length;
	for (i = 0, length = this.plugins.length; i < length; i++) {
		stream = stream.pipe(this.plugins[i]);
		stream.on('error', onPluginError);
	}

	stream = stream.pipe(new SortStream(this.base, this.source, this.dest));
	stream.on('error', onError);

	stream = stream.pipe(new SymlinkStream(this.base, this.source, this.dest));
	stream.on('error', onError);

	return this;
};



// Handle a stream error from Typologist's components.
Typologist.prototype._onError = function (error) {
	this.emit('error', error);
	throw error;
};



// Handle a stream error from a plugin.
Typologist.prototype._onPluginError = function (error) {
	console.log('plugin-error', error);
	this.emit('plugin-error', error);
};



module.exports = Typologist;