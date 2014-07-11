all: build

install:
	mkdir $@

index.html: js/app.min.js css/app.min.css
	sed -i 's/<html>/<html manifest="manifest.appcache">/g' $@
	sed -i 's/app.css/app.min.css/g' $@
	sed -i 's/<script.*<\/script>//g' $@
	sed -i 's/<\/body>/<script src="js\/app.min.js"><\/script><\/body>/g' $@

install/package.zip: install index.html js/app.min.js css/app.min.css
	zip -r $@ . -x ".*" -x "*/.*" -x Makefile -x "install/*"

build: install/package.zip

clean: install/package.zip js/app.min.js css/app.min.css
	rm $^

js/app.js: js/base.js js/offline.js js/recorder.js js/webapp.js
	@cat $^ > $@

js/app.min.js: js/app.js
	yui-compressor $^ > $@
	rm $^

css/app.min.css: css/app.css
	yui-compressor $^ > $@

.PHONY: clean index.html
