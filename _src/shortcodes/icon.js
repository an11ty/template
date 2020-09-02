module.exports = ({ name, size = 24 }) => `
<svg
	class="icon icon-${name}"
	role="img"
	aria-hidden="true"
	width="${size}"
	height="${size}"
>
	<use xlink:href="#icon-${name}"></use>
</svg>
`
