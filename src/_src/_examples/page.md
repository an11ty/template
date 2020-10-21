---
layout: page
title: Example Page
subtitle: How I Learned to Stop Worrying and Love the Blog
author: Tobias Davis
published: 2020-09-05
eleventyNavigation:
  key: Example Page
  order: 1
tags:
  - foo
  - bar
  - biz
  - bazz
---

This is a post to demonstrate how all the styles and layout sections look with the default `@an11ty/template` template.

There's some lorem ipsum to give you a sense of how a normal post might look, then after that there are sections for each notable component.

Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.

Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. Aenean dignissim pellentesque felis. Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.

Praesent dapibus, neque id cursus faucibus, tortor neque egestas auguae, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.

Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.

## Code Blocks

Plain code blocks will look like this:

```js
const foo = async ({ fizz = 'buzz' }) => fizz.toUpperCase();
```

TODO:

- [ ] smartly add line numbers and such
- [ ] add details about what code block syntax is supported

## Quotes and Footnotes (this is an `<h2>`)

The default markdown block quote looks like this:

> It has some styling applied to it, to make it clear that
> it's a quote. With italics it looks *like this*.

The markdown library supports footnotes in [this format](https://www.markdownguide.org/extended-syntax#footnotes):

```
Here's a simple footnote,[^1] and here's a longer one.[^bignote]

[^1]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.
```

Which would render like this:

Here's a simple footnote,[^1] and here's a longer one.[^bignote]

[^1]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.

## Images as Figures

Recall that in markdown you can specify a title attribute for an image:

```
![alt text](url "title text")
```

With this template, if you set a title on an image it will make the image look like this (markdown in the title is rendered):

![Aerial photo of Ujście Warty National Park near Kostrzyn nad Odrą (Poland).](/_src/_examples/media/ujscie_warty.jpg "Aerial photo of Ujście Warty National Park near Kostrzyn nad Odrą (Poland). (Wikimedia Commons · WikiPhotoSpace) - [Own work, FAL](https://commons.wikimedia.org/w/index.php?curid=64480057).")

Behind the scenes, your images will be pre-processed into a few different sizes, and will change from a simple `<img>` element to the modern `<figure>` block.

## Videos as Figures

Similarly, if you add videos as `<iframe>` elements with the class `an11ty-video`, they will get styled into something reasonable:

```html
<iframe
	class="an11ty-video"
	src="https://www.youtube.com/embed/1AtOPiG5jyk"
	frameborder="0"
	allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
	allowfullscreen
></iframe>
```

Will get auto-transformed into this:

<iframe class="an11ty-video" src="https://www.youtube.com/embed/1AtOPiG5jyk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And here is some text after it, to make sure the spacing looks good.

# Other Styles

You've already seen some styles, following are the rest of the
different markdown blocks, to demo the full capabilities.

## `<h#>` Headings

They alternate between plain and italicized, to make the difference
more distinct. It's not very critical here, but in long-form articles
this makes a noticeable difference since font-size is hard to see.

# An `h1` Heading

With text. *This is italic.* **This is bold.** ***This is italic and bold.***

## An `h2` Heading

With text.

### An `h3` Heading

With text.

#### An `h4` Heading

With text.

##### An `h5` Heading

With text.

###### An `h6` Heading

With text.

# Other Basic Markdown Syntax

Here is some more text, followed by other [markdown](https://commonmark.org/help/)
syntax, with which you are probably already familiar.

- Here is a list that is unordered.
- Another bullet point to fill it out.
- And one more just to get a few going.

Ordered lists are different, they have a number in front of them.

1. Here is an ordered list.
2. It is ordered, which means the order is fixed.
4. You'll get numbers that are CSS based, not markdown based.

An `<hr>` will look like this:

---

Sometimes you'll have `inline code sections` which is pretty neat, honestly.
