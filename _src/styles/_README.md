# Styles

If you want to override some of the styles to personalize your site, you can drop them in here.

The files are auto-globbed in this order:

* `variables` These are primary files you should edit to personalize
	your website. You can affect large UI changes just by editing these.
* `utilities` Functions for use inside the SCSS styles.
* `base` Styles that have global scope, like general typography and
	layout styles.
* `components` Styles that are scoped to components, like article figures.

```css
body {
	font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';
}
.headings {
	font-family: Lora,serif;
}

```
