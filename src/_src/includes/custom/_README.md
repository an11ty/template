# Custom Includes

Instead of overriding the default `_src/layouts` and `_src/includes`
files, these empty files are "hooks" where you can inject custom
template content.

In the base template, these template pieces are left empty so that
you can add content to them.

For example, to add custom content before the final footer, simply
create a file at `site/_src/includes/custom/footer-before.njk` and
put the content in it.
