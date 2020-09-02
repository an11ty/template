# An 11ty Default Site

This is the site used by [an11ty](https://www.npmjs.com/package/an11ty) as the default template, if you haven't specified one.

The behaviour of `an11ty` is to overwrite template files with your files, instead of merging them. This default site has a lot of functionality packed in, and you can extend it many ways without needing to overwrite files.

## Extending `.eleventy.js`

Instead of rewriting the `.eleventy.js` configuration file, name your file `.an11ty.js` and it will be run like the normal 11ty configuration file, *after* the base one is run. (If you need it to run before, name it `.an11ty-before.js` instead. Or do both.)

Example of adding a single filter:

```js
// .an11ty.js (in your site's folder)
module.exports = function (eleventyConfig) {
	eleventyConfig.addFilter('uppercase', (string) => {
		return string.toUpperCase();
	});
};
```

If you return a configuration object, for example to change the returned `templateFormats` list, your object will be merged with the default ones using a non-recursive `Object.assign`.

This means to add a new template format, since it's an array, you would need to return the full updated array.

Example of only changing the HTML template engine:

```js
// .an11ty.js (in your site's folder)
module.exports = function () {
	return {
		htmlTemplateEngine: 'pug'
	};
};
```








---

## Roadmap

image resizing stuff? https://github.com/image-size/image-size



---

A starter repository showing how to build a blog with the [Eleventy](https://github.com/11ty/eleventy) static site generator.

[![Build Status](https://travis-ci.org/11ty/eleventy-base-blog.svg?branch=master)](https://travis-ci.org/11ty/eleventy-base-blog)

## Demos

* [Netlify](https://eleventy-base-blog.netlify.com/)
* [GitHub Pages](https://11ty.github.io/eleventy-base-blog/)
* [Remix on Glitch](https://glitch.com/~11ty-eleventy-base-blog)

## Deploy this to your own site

These builders are amazing—try them out to get your own Eleventy site in a few clicks!

* [Get your own Eleventy web site on Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/11ty/eleventy-base-blog)
* [Get your own Eleventy web site on Vercel](https://vercel.com/import/project?template=11ty%2Feleventy-base-blog)

## Getting Started

### 1. Clone this Repository

```
git clone https://github.com/11ty/eleventy-base-blog.git my-blog-name
```


### 2. Navigate to the directory

```
cd my-blog-name
```

Specifically have a look at `.eleventy.js` to see if you want to configure any Eleventy options differently.

### 3. Install dependencies

```
npm install
```

### 4. Edit _data/metadata.json

### 5. Run Eleventy

```
npx eleventy
```

Or build and host locally for local development
```
npx eleventy --serve
```

Or build automatically when a template changes:
```
npx eleventy --watch
```

Or in debug mode:
```
DEBUG=* npx eleventy
```

### Implementation Notes

* `about/index.md` shows how to add a content page.
* `posts/` has the blog posts but really they can live in any directory. They need only the `post` tag to be added to this collection.
* Add the `nav` tag to add a template to the top level site navigation. For example, this is in use on `index.njk` and `about/index.md`.
* Content can be any template format (blog posts needn’t be markdown, for example). Configure your supported templates in `.eleventy.js` -> `templateFormats`.
	* Because `css` and `png` are listed in `templateFormats` but are not supported template types, any files with these extensions will be copied without modification to the output (while keeping the same directory structure).
* The blog post feed template is in `feed/feed.njk`. This is also a good example of using a global data files in that it uses `_data/metadata.json`.
* This example uses three layouts:
  * `_includes/layouts/base.njk`: the top level HTML structure
  * `_includes/layouts/home.njk`: the home page template (wrapped into `base.njk`)
  * `_includes/layouts/post.njk`: the blog post template (wrapped into `base.njk`)
* `_includes/postlist.njk` is a Nunjucks include and is a reusable component used to display a list of all the posts. `index.njk` has an example of how to use it.
