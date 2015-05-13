# typologist

***typologist* sorts files into [symlink](http://en.wikipedia.org/wiki/Symbolic_link) collections**, using easy-to-write plugins. It can be used to categorize **every type of file-based data**, for example text, music or photos. Because it leverages plugins, it can **categorize by any criteria**, such as file extension, size, ID3 tag, EXIF data or checksum.



## Example

Let's assume we have a directory `./documents` containing 4 files.

```
documents/
	01.js
	02.md
	03.txt
	04.js
```

Now we want to **sort our files into symlink collections, named after the file extension**.

```javascript
var Typologist = require('typologist');   // load typologist
var path = require('path');   // we will need path later
```

To sort our files, we need to create a new instance of `Typologist`. `Typologist` has to arguments:

1. `source` is base directory for all files to sort. For us, this is `documents`.
2. `dest` is the base directory for all collections of symlinks. For us, this is `.`.

```javascript
t = new Typologist('documents', '.');
```

Let's **write a plugin that specifies one collection for each file**, named after the file extension.

```javascript
function sortDocuments (file, _, callback) {
	var extension = path.extname(file.basename).substr(1);   // example: `one.js` -> `js`

	file.collections = {};   // an object containing all symlinks
	file.collections[extension] = file.basename;

	callback(null, file);   // `null` because no error occured
}
```

We bind our plugin to the `Typologist` instance.

```javascript
t.use(sortDocuments);
```

Now, we can add files one or more [globs](https://github.com/isaacs/node-glob#glob-primer). *typologist* will pass these files as [vinyl objects](https://github.com/wearefractal/vinyl#file) to the plugin. **According to what the plugin specifies, *typologist* then create symlink collections.**

```javascript
t.src('*');   // match any file in `./documents`
```

Let's have a look at the result:

```
documents/
	01.js
	02.md
	03.txt
	04.js
js/
	01.js -> ../documents/01.js
	04.js -> ../documents/04.js
md/
	02.md -> ../documents/02.md
txt/
	03.txt -> ../documents/03.txt
```



## Install

```shell
npm install typologist
```



## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/typologist/issues).