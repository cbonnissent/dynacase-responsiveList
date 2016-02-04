po:
	dynacase-devtool.phar extractPo -s .

webinst:
	r.js -o RESPONSIVE_LIST/JS/build.js
	dynacase-devtool.phar generateWebinst -s .