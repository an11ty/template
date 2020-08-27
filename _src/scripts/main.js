// This is the main insert point, but it really just grabs
// files auto-globbed from the ./modules folder. They get
// loaded in whatever order the filesystem lists them as from
// the `glob` function listing, so if ordering matters then
// you should name your files with a numeric index prefix to
// force ordering.

import globbed from './globbed.js'
